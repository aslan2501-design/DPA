import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LineChart, Line, ReferenceLine } from 'recharts';
import { canSeeHydrography } from '@/lib/rbac';
import { AlertTriangle, Check } from 'lucide-react';

const DAMIETTA_CENTER: [number, number] = [31.7706, 31.4706];
const EASTERN_BREAKWATER: [number, number] = [31.774, 31.480]; // [lng, lat] Eastern breakwater
const WESTERN_BREAKWATER: [number, number] = [31.760, 31.465]; // [lng, lat] Western breakwater

const erosionLayers = [
  'erosion_1990',
  'erosion_2000',
  'erosion_2010',
  'erosion_2020',
];

const sedimentationLayers = [
  'Sedimentation_1990',
  'Sedimentation_2000',
  'Sedimentation_2010',
  'Sedimentation_2020',
];

const erosionData = [
  { period: '1990-2000', min: 40, max: 125, layer: 'erosion_1990' },
  { period: '2000-2010', min: 15, max: 82, layer: 'erosion_2000' },
  { period: '2010-2020', min: 15, max: 59, layer: 'erosion_2010' },
];

const sedimentationData = [
  { period: '1990-2000', min: 15, max: 166, layer: 'Sedimentation_1990' },
  { period: '2000-2010', min: 40, max: 147, layer: 'Sedimentation_2000' },
  { period: '2010-2020', min: 18, max: 127, layer: 'Sedimentation_2010' },
];

const Hydrography = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [activeTab, setActiveTab] = useState<'erosion' | 'sedimentation'>('erosion');
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [mapSrc, setMapSrc] = useState<string>('/maps/النحر/index.html');

  // Check if user has access to this page
  useEffect(() => {
    if (!canSeeHydrography(user?.userType, user?.classification)) {
      // Redirect to dashboard if user doesn't have access
      navigate('/dashboard', { replace: true });
    }
  }, [user?.userType, user?.classification, navigate]);

  useEffect(() => {
    // Listen for messages from embedded map
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'layerClicked') {
        const layerName = event.data.layer;
        setSelectedLayer(layerName);
      }
    };
    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, []);

  useEffect(() => {
    // Update map source based on active tab
    if (activeTab === 'erosion') {
      setMapSrc('/maps/النحر/index.html');
    } else {
      setMapSrc('/maps/الاطماء/index.html');
    }
    setSelectedLayer(null);
  }, [activeTab]);

  useEffect(() => {
    // no-op: map is provided by the qgis2web OpenLayers app
    // we embed it in an iframe below. Attempt to resize iframe on load.
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      try { iframe.style.height = '100%'; } catch (e) {}
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    setSelectedLayer(null);
    // Send layers to map based on active tab + zoom
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      const layersToShow = activeTab === 'erosion' ? erosionLayers : sedimentationLayers;
      
      // Set zoom coordinates based on active tab
      const zoomCoords = activeTab === 'erosion' ? EASTERN_BREAKWATER : WESTERN_BREAKWATER;
      
      // Send layers then ask map to fit to appropriate layer extents
      iframe.contentWindow.postMessage({ 
        type: 'setLayers', 
        layers: layersToShow,
        tab: activeTab
      }, '*');
      if (activeTab === 'erosion') {
        iframe.contentWindow.postMessage({ type: 'fitToErosionLevels' }, '*');
      } else {
        iframe.contentWindow.postMessage({ type: 'fitToSedimentationLevels' }, '*');
      }
    } catch (e) {}
  }, [activeTab]);

  const onSelectLayer = (layerName: string) => {
    setSelectedLayer(layerName);
    // Post a best-effort message to the embedded map iframe to toggle/focus a layer
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage({ type: 'toggleLayer', layer: layerName }, '*');
    } catch (e) {}
  };

  const onChartClick = (layerName: string) => {
    // Click on chart bar: activate the layer + filter table
    onSelectLayer(layerName);
  };

  const exportCSV = (rows: any[], filename = 'export.csv') => {
    if (!rows || rows.length === 0) return;
    const header = Object.keys(rows[0]).join(',') + '\n';
    const lines = rows.map(r => Object.values(r).join(',')).join('\n');
    const blob = new Blob([header + lines], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  // Check if user has permission to view this page
  if (!canSeeHydrography(user?.userType, user?.classification)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {language === 'ar' 
              ? 'ليس لديك الصلاحية لعرض هذه الصفحة. سيتم إعادة توجيهك إلى لوحة التحكم'
              : 'You do not have permission to view this page. You will be redirected to dashboard'
            }
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          {language === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{language === 'ar' ? 'تحليل معدلات النحر والإطماء خلف حواجز الأمواج – ميناء دمياط' : 'Erosion & Sedimentation Analysis behind breakwaters – Damietta Port'}</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid grid-cols-2 gap-2 max-w-md mb-4">
          <TabsTrigger value="erosion">{language === 'ar' ? 'النحر' : 'Erosion'}</TabsTrigger>
          <TabsTrigger value="sedimentation">{language === 'ar' ? 'الإطماء' : 'Sedimentation'}</TabsTrigger>
        </TabsList>

        <TabsContent value="erosion">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'خريطة النحر' : 'Erosion Map'}</CardTitle>
              <CardDescription>{language === 'ar' ? 'الخريطة المتخصصة لمعدلات النحر - تصريف كامل الآثار' : 'Specialized Erosion Map - Full erosion impact view'}</CardDescription>
            </CardHeader>
            <CardContent>
              <iframe 
                key={mapSrc}
                ref={iframeRef} 
                title="Erosion Map" 
                src={mapSrc} 
                className="w-full h-[480px] rounded border" 
              />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'جدول معدلات النحر' : 'Erosion Rates Table'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">{language === 'ar' ? 'الفترة' : 'Period'}</TableHead>
                      <TableHead className="text-center">Min (m)</TableHead>
                      <TableHead className="text-center">Max (m)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {erosionData.map((row) => (
                      <TableRow 
                        key={row.period} 
                        className={selectedLayer === row.layer ? 'bg-green-100 border-l-4 border-green-500 hover:bg-green-200' : 'hover:bg-gray-50 cursor-pointer'} 
                        onClick={() => onSelectLayer(row.layer)}
                      >
                        <TableCell className="text-center font-medium">
                          <div className="flex items-center justify-center gap-1">
                            {selectedLayer === row.layer && <Check className="w-4 h-4 text-green-600" />}
                            {row.period}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{row.min}</TableCell>
                        <TableCell className="text-center">{row.max}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'رسوم بيانية للنحر' : 'Erosion Charts'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={erosionData.map((item) => ({
                    ...item,
                    isSelected: selectedLayer === item.layer
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="min" 
                      fill="#8884d8" 
                      name={language === 'ar' ? 'الحد الأدنى' : 'Min'}
                      onClick={(data: any) => onChartClick(data.layer)}
                      style={{ cursor: 'pointer' }}
                    />
                    <Bar 
                      dataKey="max" 
                      fill="#82ca9d" 
                      name={language === 'ar' ? 'الحد الأقصى' : 'Max'}
                      onClick={(data: any) => onChartClick(data.layer)}
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={erosionData.map((item, idx) => ({
                      ...item,
                      isSelected: selectedLayer === item.layer,
                      index: idx
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedLayer && (
                        <ReferenceLine
                          x={erosionData.find(d => d.layer === selectedLayer)?.period}
                          stroke="#10b981"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: language === 'ar' ? 'مختار' : 'Selected',
                            position: 'top' as const,
                            fill: '#10b981',
                            fontSize: 12,
                            fontWeight: 'bold' as const
                          }}
                        />
                      )}
                      <Line 
                        type="monotone" 
                        dataKey="min" 
                        stroke="#8884d8" 
                        name={language === 'ar' ? 'الحد الأدنى' : 'Min'}
                        onClick={(data: any) => onChartClick(erosionData[data.index]?.layer)}
                        style={{ cursor: 'pointer' }}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          const isSelected = payload?.isSelected;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isSelected ? 6 : 3}
                              fill={isSelected ? '#10b981' : '#8884d8'}
                              stroke={isSelected ? '#059669' : 'none'}
                              strokeWidth={isSelected ? 2 : 0}
                              style={{ cursor: 'pointer' }}
                            />
                          );
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="max" 
                        stroke="#82ca9d" 
                        name={language === 'ar' ? 'الحد الأقصى' : 'Max'}
                        onClick={(data: any) => onChartClick(erosionData[data.index]?.layer)}
                        style={{ cursor: 'pointer' }}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          const isSelected = payload?.isSelected;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isSelected ? 6 : 3}
                              fill={isSelected ? '#10b981' : '#82ca9d'}
                              stroke={isSelected ? '#059669' : 'none'}
                              strokeWidth={isSelected ? 2 : 0}
                              style={{ cursor: 'pointer' }}
                            />
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sedimentation">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'خريطة الإطماء' : 'Sedimentation Map'}</CardTitle>
              <CardDescription>{language === 'ar' ? 'الخريطة المتخصصة لمعدلات الإطماء - تصريح كامل الآثار' : 'Specialized Sedimentation Map - Full sedimentation impact view'}</CardDescription>
            </CardHeader>
            <CardContent>
              <iframe 
                key={mapSrc}
                ref={iframeRef} 
                title="Sedimentation Map" 
                src={mapSrc} 
                className="w-full h-[480px] rounded border" 
              />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'جدول معدلات الإطماء' : 'Sedimentation Rates Table'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">{language === 'ar' ? 'الفترة' : 'Sedimentation'}</TableHead>
                      <TableHead className="text-center">Min (m)</TableHead>
                      <TableHead className="text-center">Max (m)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sedimentationData.map((row) => (
                      <TableRow 
                        key={row.period} 
                        className={selectedLayer === row.layer ? 'bg-green-100 border-l-4 border-green-500 hover:bg-green-200' : 'hover:bg-gray-50 cursor-pointer'} 
                        onClick={() => onSelectLayer(row.layer)}
                      >
                        <TableCell className="text-center font-medium">
                          <div className="flex items-center justify-center gap-1">
                            {selectedLayer === row.layer && <Check className="w-4 h-4 text-green-600" />}
                            {row.period}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{row.min}</TableCell>
                        <TableCell className="text-center">{row.max}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'رسوم بيانية للإطماء' : 'Sedimentation Charts'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sedimentationData.map((item) => ({
                    ...item,
                    isSelected: selectedLayer === item.layer
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="min" 
                      fill="#8884d8" 
                      name={language === 'ar' ? 'الحد الأدنى' : 'Min'}
                      onClick={(data: any) => onChartClick(data.layer)}
                      style={{ cursor: 'pointer' }}
                    />
                    <Bar 
                      dataKey="max" 
                      fill="#82ca9d" 
                      name={language === 'ar' ? 'الحد الأقصى' : 'Max'}
                      onClick={(data: any) => onChartClick(data.layer)}
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={sedimentationData.map((item, idx) => ({
                      ...item,
                      isSelected: selectedLayer === item.layer,
                      index: idx
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {selectedLayer && (
                        <ReferenceLine
                          x={sedimentationData.find(d => d.layer === selectedLayer)?.period}
                          stroke="#10b981"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: language === 'ar' ? 'مختار' : 'Selected',
                            position: 'top' as const,
                            fill: '#10b981',
                            fontSize: 12,
                            fontWeight: 'bold' as const
                          }}
                        />
                      )}
                      <Line 
                        type="monotone" 
                        dataKey="min" 
                        stroke="#8884d8" 
                        name={language === 'ar' ? 'الحد الأدنى' : 'Min'}
                        onClick={(data: any) => onChartClick(sedimentationData[data.index]?.layer)}
                        style={{ cursor: 'pointer' }}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          const isSelected = payload?.isSelected;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isSelected ? 6 : 3}
                              fill={isSelected ? '#10b981' : '#8884d8'}
                              stroke={isSelected ? '#059669' : 'none'}
                              strokeWidth={isSelected ? 2 : 0}
                              style={{ cursor: 'pointer' }}
                            />
                          );
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="max" 
                        stroke="#82ca9d" 
                        name={language === 'ar' ? 'الحد الأقصى' : 'Max'}
                        onClick={(data: any) => onChartClick(sedimentationData[data.index]?.layer)}
                        style={{ cursor: 'pointer' }}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          const isSelected = payload?.isSelected;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isSelected ? 6 : 3}
                              fill={isSelected ? '#10b981' : '#82ca9d'}
                              stroke={isSelected ? '#059669' : 'none'}
                              strokeWidth={isSelected ? 2 : 0}
                              style={{ cursor: 'pointer' }}
                            />
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Hydrography;
