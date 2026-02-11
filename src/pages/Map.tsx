import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, ZoomIn, ZoomOut, Locate, Info, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import L from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Facility {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  status?: string;
}

// Damietta Port coordinates (center of warehouse area)
const DAMIETTA_CENTER = [31.4706, 31.7706] as [number, number];

const Map = () => {
  const { language } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'leaflet' | 'image'>('leaflet');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  // Video player refs/state for crossfade player (option 2)
  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const currentVideoIndexRef = useRef<number>(0);
  const videoSources = ['/maps/فيديو/3DPORT1.mp4', '/maps/فيديو/3DPORT2.mp4'];
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackMode, setPlaybackMode] = useState<'default' | 'longHold'>('longHold');
  const [extraHoldMs, setExtraHoldMs] = useState<number>(5000);

  const toggleMute = () => {
    setIsMuted((m) => {
      const next = !m;
      if (videoARef.current) videoARef.current.muted = next;
      if (videoBRef.current) videoBRef.current.muted = next;
      return next;
    });
  };

  const togglePlayPause = async () => {
    try {
      const activeEl = activeVideo === 0 ? videoARef.current : videoBRef.current;
      const idleEl = activeVideo === 0 ? videoBRef.current : videoARef.current;
      if (!activeEl) return;
      if (isPlaying) {
        activeEl.pause();
        if (idleEl) idleEl.pause();
        setIsPlaying(false);
      } else {
        await activeEl.play();
        setIsPlaying(true);
      }
    } catch (e) {
      // ignore play errors
    }
  };

  // Initialize and handle ended events for crossfade playback
  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    a.muted = isMuted;
    b.muted = isMuted;

    // start first video
    a.src = videoSources[0];
    a.currentTime = 0;
    a.play().catch(() => { });

    const handleEnded = async () => {
      const nextIdx = (currentVideoIndexRef.current + 1) % videoSources.length;
      const activeEl = currentVideoIndexRef.current === 0 ? a : b;
      const idleEl = currentVideoIndexRef.current === 0 ? b : a;

      // prepare idle
      idleEl.src = videoSources[nextIdx];
      idleEl.currentTime = 0;
      try { idleEl.playbackRate = 1.0; } catch (e) { // ignore 
      }

      // helper to perform the crossfade switch
      const doSwitch = () => {
        setActiveVideo((prev) => (prev === 0 ? 1 : 0));
        setTimeout(() => {
          try { activeEl.pause(); } catch (e) { // ignore
          }
        }, 700);
        currentVideoIndexRef.current = nextIdx;
      };

      // Long hold mode: delay the crossfade by extraHoldMs when next is second
      const holdMs = playbackMode === 'longHold' && nextIdx === 1 ? extraHoldMs : 0;
      try { await idleEl.play(); } catch (e) { // ignore
      }
      if (holdMs > 0) {
        setTimeout(() => doSwitch(), holdMs);
      } else {
        doSwitch();
      }
    };

    a.addEventListener('ended', handleEnded);
    b.addEventListener('ended', handleEnded);

    return () => {
      a.removeEventListener('ended', handleEnded);
      b.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMuted]);

  const layers = [
    { id: 'all', label: language === 'ar' ? 'جميع الطبقات' : 'All Layers' },
    { id: 'warehouses', label: language === 'ar' ? 'المخازن' : 'Warehouses' },
  ];

  // Load facilities from GeoJSON
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const response = await fetch('/data/warehouses.json');
        const geojson = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loadedFacilities = geojson.features.map((feature: any) => ({
          id: String(feature.properties.fid || feature.properties.id),
          name: feature.properties.Name || 'بدون اسم',
          type: 'warehouse',
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          status: 'active',
        }));

        setFacilities(loadedFacilities);
        setLoading(false);
      } catch (error) {
        console.error('خطأ في تحميل بيانات المخازن:', error);
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (mapMode !== 'leaflet' || loading) return;

    try {
      // Remove existing map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Create new map
      const mapContainer = document.getElementById('map-container');
      if (!mapContainer) return;

      mapRef.current = L.map('map-container', {
        zoomControl: false,
      }).setView(DAMIETTA_CENTER, 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add custom zoom controls
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

      // Add markers for facilities
      facilities.forEach(facility => {
        const popupHtml = `<div style="direction: ${language === 'ar' ? 'rtl' : 'ltr'}; text-align: ${language === 'ar' ? 'right' : 'left'};">
            <strong>${facility.name}</strong><br/>
            <small>${language === 'ar' ? 'النوع' : 'Type'}: ${facility.type}</small><br/>
            <small>${language === 'ar' ? 'الحالة' : 'Status'}: ${facility.status}</small><br/>
            <a href="/complaints?facilityId=${facility.id}">${language === 'ar' ? 'إنشاء بلاغ هنا' : 'Create report here'}</a>
          </div>`;

        const marker = L.marker([facility.lat, facility.lng])
          .bindPopup(popupHtml)
          .on('click', () => setSelectedFacility(facility.id))
          .addTo(mapRef.current!);
      });
    } catch (error) {
      console.error('خطأ في إنشاء الخريطة:', error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapMode, facilities, loading, language]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleLocate = () => {
    if (mapRef.current) {
      mapRef.current.setView(DAMIETTA_CENTER, 13);
    }
  };

  const handleFacilityClick = (facilityId: string) => {
    setSelectedFacility(facilityId);
    const facility = facilities.find(f => f.id === facilityId);
    if (facility && mapRef.current) {
      mapRef.current.setView([facility.lat, facility.lng], 16);
    }
  };

  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send focus message to embedded map when selection changes and dialog is open
  useEffect(() => {
    if (!mapDialogOpen || !selectedFacility || !iframeRef.current) return;
    const facility = facilities.find(f => f.id === selectedFacility);
    if (!facility) return;

    const msg = { type: 'focus', id: facility.id, lat: facility.lat, lng: facility.lng };
    try {
      iframeRef.current.contentWindow?.postMessage(msg, window.location.origin);
    } catch (e) {
      // ignore
    }
  }, [mapDialogOpen, selectedFacility, facilities]);

  const filteredFacilities = facilities.filter(
    f => selectedLayer === 'all' || selectedLayer === f.type
  );

  return (
    <div className={`p-4 space-y-4 h-full ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl">
                    {language === 'ar' ? 'التجوال الافتراضي للميناء' : 'Virtual Port Tour'}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar'
                      ? 'تشغيل التجوال الافتراضي'
                      : 'Virtual Tour'}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={mapMode === 'leaflet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapMode('leaflet')}
                >
                  {language === 'ar' ? 'تشغيل التجوال' : 'Start Tour'}
                </Button>
                <Button
                  variant={mapMode === 'image' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapMode('image')}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Map Container (replaced with crossfading dual-video player) */}
            {mapMode === 'leaflet' ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {loading && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 z-10 flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      {language === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}
                    </p>
                  </div>
                )}

                <div className="w-full h-96 md:h-[500px] bg-black">
                  <div className="relative w-full h-full" style={{ perspective: 1000 }}>
                    {/* Dual video elements for crossfade */}
                    <video
                      ref={videoARef}
                      playsInline
                      muted
                      autoPlay
                      preload="metadata"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeVideo === 0 ? 'opacity-100' : 'opacity-0'}`}
                    />

                    <video
                      ref={videoBRef}
                      playsInline
                      muted
                      autoPlay
                      preload="metadata"
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${activeVideo === 1 ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Small controls overlay */}
                    <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2">
                      <button
                        onClick={() => togglePlayPause()}
                        className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-md text-sm"
                      >
                        {isPlaying ? (language === 'ar' ? 'إيقاف' : 'Pause') : (language === 'ar' ? 'تشغيل' : 'Play')}
                      </button>
                      <button
                        onClick={() => toggleMute()}
                        className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-md text-sm"
                      >
                        {isMuted ? (language === 'ar' ? 'تشغيل صوت' : 'Unmute') : (language === 'ar' ? 'كتم' : 'Mute')}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                <div className="p-8 text-center text-gray-600 dark:text-gray-300">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{language === 'ar' ? 'يمكنك رفع صورة خريطة هنا' : 'You can upload a custom map image here'}</p>
                </div>
              </div>
            )}

            {/* Facilities List */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">
                  {language === 'ar' ? 'قائمة المخازن' : 'Warehouses List'}
                  {language === 'ar' ? ` (${filteredFacilities.length} مخزن)` : ` (${filteredFacilities.length})`}
                </h3>
              </div>

              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {filteredFacilities.slice(0, 20).map(facility => (
                  <motion.div
                    key={facility.id}
                    whileHover={{ x: language === 'ar' ? -5 : 5 }}
                  >
                    <Button
                      variant={selectedFacility === facility.id ? 'default' : 'outline'}
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => handleFacilityClick(facility.id)}
                    >
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="font-medium">{facility.name}</span>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {facility.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {facility.status}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="link" onClick={() => { setSelectedFacility(facility.id); setMapDialogOpen(true); }}>
                        {language === 'ar' ? 'عرض على الخريطة الأصلية' : 'Show on original map'}
                      </Button>
                      <a href={`/complaints?facilityId=${facility.id}`} className="text-xs text-blue-600">{language === 'ar' ? 'تبليغ صيانة' : 'Report'}</a>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredFacilities.length > 20 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {language === 'ar'
                    ? `وآخرون ${filteredFacilities.length - 20}`
                    : `and ${filteredFacilities.length - 20} more`}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Map;
