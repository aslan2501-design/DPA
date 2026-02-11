import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, MapPin, AlertTriangle, Clock, CheckCircle, Filter, Search, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useFeedback } from '@/contexts/FeedbackContext';
import { canEditComplaintStatus, getVisibleComplaints } from '@/lib/rbac';

const Complaints = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const { triggerFeedback, triggerConfetti } = useFeedback();
  const { complaints, addComplaint, updateComplaintStatus } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'in_progress' | 'resolved'>('pending');

  const [formData, setFormData] = useState({
    title: '',
    faultType: '',
    priority: 'medium' as const,
    location: '',
    facilityId: '',
    mapPath: '',
    description: '',
  });

  const [facilitiesList, setFacilitiesList] = useState<{ id: string; name: string }[]>([]);
  const mapIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Listen for selection messages from embedded map iframe
    const handler = (e: MessageEvent) => {
      try {
        const msg = e.data || {};
        if (msg && msg.type === 'selected') {
          const id = String(msg.id || '');
          const name = msg.name || '';
          setFormData((prev) => ({ ...prev, facilityId: id, location: name }));
        }
      } catch (err) { }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/warehouses.json');
        const geo = await res.json();
        const list = (geo.features || []).map((f: any) => ({ id: String(f.properties.fid || f.properties.id), name: f.properties.Name || 'بدون اسم' }));
        setFacilitiesList(list);
      } catch (e) {
        console.warn('Failed to load warehouses.json', e);
      }
    })();
  }, []);

  // If a facilityId is present in query params, prefill form and open dialog
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const facilityId = params.get('facilityId');
      if (facilityId && facilitiesList.length > 0) {
        const found = facilitiesList.find(f => f.id === facilityId);
        setFormData((prev) => ({ ...prev, facilityId: facilityId, location: found ? found.name : '' }));
        setDialogOpen(true);
        // remove param from URL to avoid reopening repeatedly
        params.delete('facilityId');
        const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {
      // ignore
    }
  }, [facilitiesList]);

  const getPriorityBadge = (priority: string) => {
    const priorityMap: Record<string, { label: string; className: string }> = {
      high: {
        label: t('common.high'),
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      },
      medium: {
        label: t('common.medium'),
        className: 'bg-warning/10 text-warning border-warning/20',
      },
      low: {
        label: t('common.low'),
        className: 'bg-success/10 text-success border-success/20',
      },
    };

    const { label, className } = priorityMap[priority] || priorityMap.medium;
    return <Badge variant="outline" className={className}>{label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'in_progress':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: language === 'ar' ? 'قيد الانتظار' : 'Pending',
      in_progress: language === 'ar' ? 'قيد التنفيذ' : 'In Progress',
      resolved: language === 'ar' ? 'تم الحل' : 'Resolved',
    };
    return statusMap[status] || status;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      title: formData.title || (language === 'ar' ? `بلاغ صيانة - ${formData.location}` : `Maintenance Report - ${formData.location}`),
      mapPath: '/maps/المخازن/index.html',
    };
    addComplaint(payload, user?.id);
    toast({
      title: language === 'ar' ? 'تم إرسال البلاغ' : 'Report Submitted',
      description: language === 'ar'
        ? 'تم إضافة البلاغ وسوف يظهر في الداش بورد فوراً'
        : 'The report has been added and will appear on the dashboard immediately',
    });
    setDialogOpen(false);
    // Trigger feedback modal after 1 second
    setTimeout(() => {
      triggerFeedback('complaint');
    }, 1000);
    setFormData({
      title: '',
      faultType: '',
      priority: 'medium',
      location: '',
      facilityId: '',
      mapPath: '',
      description: '',
    });
  };

  const handleStatusChange = (complaintId: string) => {
    if (updateComplaintStatus) {
      updateComplaintStatus(complaintId, selectedStatus);
      toast({
        title: language === 'ar' ? 'تم تحديث الحالة' : 'Status Updated',
        description: language === 'ar'
          ? `تم تغيير حالة البلاغ إلى ${getStatusLabel(selectedStatus)}`
          : `Complaint status changed to ${getStatusLabel(selectedStatus)}`,
      });
      if (selectedStatus === 'resolved') {
        triggerConfetti('success');
      }
      setEditingStatusId(null);
    }
  };

  // First get complaints visible to the user according to RBAC rules
  const visibleComplaints = getVisibleComplaints(complaints, user?.userType, user?.id, user?.classification);

  const filteredComplaints = visibleComplaints.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">{language === 'ar' ? 'بلاغات الصيانة' : 'Reports & Complaints'}</h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'تقديم بلاغات صيانة ومتابعة حالة البلاغات الحالية' : 'Submit new reports and follow up on current status'}
          </p>
        </div>

        {!user?.isReadOnly && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {language === 'ar' ? 'تقديم بلاغ جديد' : 'Submit New Report'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('complaints.title')}</DialogTitle>
                <DialogDescription>
                  {language === 'ar' ? 'أدخل تفاصيل شكوى الصيانة' : 'Enter maintenance complaint details'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Select onValueChange={(v) => setFormData({ ...formData, faultType: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر نوع العطل' : 'Select fault type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrical">{language === 'ar' ? 'كهربائي' : 'Electrical'}</SelectItem>
                      <SelectItem value="plumbing">{language === 'ar' ? 'سباكة' : 'Plumbing'}</SelectItem>
                      <SelectItem value="mechanical">{language === 'ar' ? 'ميكانيكي' : 'Mechanical'}</SelectItem>
                      <SelectItem value="structural">{language === 'ar' ? 'إنشائي' : 'Structural'}</SelectItem>
                      <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'الموقع / المرفق' : 'Location / Facility'}</Label>
                  <Select
                    value={formData.facilityId}
                    onValueChange={(v) => {
                      const found = facilitiesList.find(f => f.id === v);
                      setFormData({ ...formData, location: found ? found.name : v, facilityId: v });
                      // send focus message to embedded iframes (preview + picker)
                      try {
                        const msg = { type: 'focus', id: v };
                        if (mapIframeRef && mapIframeRef.current && mapIframeRef.current.contentWindow) {
                          mapIframeRef.current.contentWindow.postMessage(msg, window.location.origin);
                        }
                        // also target any open picker iframe by title
                        const pickIframe = document.querySelector('iframe[title="Pick warehouse"]') as HTMLIFrameElement | null;
                        if (pickIframe && pickIframe.contentWindow) pickIframe.contentWindow.postMessage(msg, window.location.origin);
                      } catch (err) {
                        // ignore
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ar' ? 'اختر الموقع' : 'Select location'} />
                    </SelectTrigger>
                    <SelectContent>
                      {facilitiesList.length === 0 && (
                        <SelectItem value="none">{language === 'ar' ? 'لا توجد مخازن' : 'No warehouses'}</SelectItem>
                      )}
                      {facilitiesList.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>{t('complaints.priority')}</Label>
                  <RadioGroup
                    defaultValue="medium"
                    value={formData.priority}
                    onValueChange={(v) => setFormData({ ...formData, priority: v as any })}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="text-destructive cursor-pointer">{t('common.high')}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="text-warning cursor-pointer">{t('common.medium')}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="text-success cursor-pointer">{t('common.low')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>{t('complaints.description')}</Label>
                  <Textarea
                    placeholder={language === 'ar' ? 'اوصف المشكلة بالتفصيل...' : 'Describe the problem in detail...'}
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Map Location Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <Label className="font-semibold">{language === 'ar' ? 'تحديد الموقع على الخريطة' : 'Select Location on Map'}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar'
                      ? 'اختر الموقع مباشرة من الخريطة - سيظهر دبوس أحمر عند الاختيار'
                      : 'Click on the map to select location - a red pin will appear'}
                  </p>

                  {/* Map Container with Pin Indicator */}
                  <div className="relative border-2 border-primary/20 rounded-lg overflow-hidden h-96 bg-muted">
                    <iframe
                      ref={mapIframeRef}
                      src="/maps/المخازن/index.html"
                      title="Select warehouse location"
                      className="w-full h-full"
                    />

                    {/* Red Pin Indicator Overlay */}
                    {formData.location && (
                      <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg border-l-4 border-red-500 z-10 flex items-center gap-2">
                        <div className="relative">
                          <div className="text-2xl animate-bounce">📍</div>
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800">{formData.location}</p>
                          <p className="text-xs text-green-600">{language === 'ar' ? '✓ تم التحديد' : '✓ Selected'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selection Status */}
                  <div className="flex items-center gap-2 text-sm">
                    {formData.location ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">
                          {language === 'ar' ? `محدد: ${formData.location}` : `Selected: ${formData.location}`}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-amber-600">{language === 'ar' ? 'انتظر الاختيار من الخريطة' : 'Waiting for selection'}</span>
                      </>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full">{t('complaints.submit')}</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            className="ps-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          {t('common.filter')}
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-muted-foreground mb-1">
              {complaints.filter((c) => c.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-warning mb-1">
              {complaints.filter((c) => c.status === 'in_progress').length}
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-success mb-1">
              {complaints.filter((c) => c.status === 'resolved').length}
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'تم الحل' : 'Resolved'}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Complaints List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{complaint.title}</h3>
                      {getPriorityBadge(complaint.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{complaint.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {complaint.location}
                      </span>
                      <span>{complaint.faultType}</span>
                      <span>{complaint.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {/* Status Display or Edit Mode */}
                  {editingStatusId === complaint.id && canEditComplaintStatus(user?.userType) ? (
                    <div className="flex flex-col gap-2">
                      <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                        <SelectTrigger className="w-[140px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                          <SelectItem value="in_progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</SelectItem>
                          <SelectItem value="resolved">{language === 'ar' ? 'تم الحل' : 'Resolved'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusChange(complaint.id)}
                        >
                          {language === 'ar' ? 'حفظ' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStatusId(null)}
                        >
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(complaint.status)}
                        <span className="text-sm font-medium">{getStatusLabel(complaint.status)}</span>
                      </div>
                      {canEditComplaintStatus(user?.userType) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingStatusId(complaint.id);
                            setSelectedStatus(complaint.status as any);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div >
  );
};

export default Complaints;
