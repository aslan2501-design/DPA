import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Plus, Filter, Search, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useData, Request } from '@/contexts/DataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useFeedback } from '@/contexts/FeedbackContext';
import { Link } from 'react-router-dom';
import {
  canSeeWarehouseRequests,
  canSeeTrolleyRequests,
  getVisibleRequests,
  ROLE_CLASSIFICATIONS,
} from '@/lib/rbac';

// List of warehouses extracted from map data
const WAREHOUSES_LIST = [
  'معدات سيسكو ترانس',
  'معدات ميد سوفت',
  'معدات مارين لوجيستيك',
  'معدات سي سيرفيس',
  'معدات إيريك',
  'ساحة معدات رويال سي',
  'السد العالى',
  'مارين لوجيستيك',
  'معدات الشروق',
  'الشركة البحرية محمد فتحى',
  'معدات سيسكو',
  'معدات المجد مجدى بصار',
  'معدات البدري',
  'معدات سنابل',
  'معدات الطماوى - المصرية',
  'معدات المجد لتكرير الزيوت',
  'مخزن سيسكو',
  'مخزن كايرو ثري',
  'مخزن سي ترانس',
  'مخزن كايروثري ايه',
  'مخزن المجد لتكرير الزيوت',
  'مخزن كايرو ثري ايه',
  'مخزن سنابل',
  'مخزن الدقهلية',
  'مخزن ميد سوفت',
  'مخزن مهمل الهيئة',
  'مخزن تابع للهيئة',
  'مخزن سي سيرفيس',
  'مخازن كايرو ثري ايه',
  'مخزن لاج',
  'مخزن سيسكو ترانس',
  'مخزن الوطنية',
  'مخزن الصوامع',
  'مخزن الرحاب',
  'السويسرية',
  'سنابل للشحن والتفريغ',
  'الفارس العربي',
  'إسبريا مصر',
  'رويال للبتروكيماويات',
  'أجواء',
  'عافية للزيوت',
  'إفكو',
  'الفا مصر',
  'المتحدة للزيوت',
  'أرما',
  'الدلتا للسكر',
  'الدقهلية',
  'محمد فتحي',
  'المنصورة للراتنجات',
];

const Requests = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const { triggerFeedback, triggerConfetti } = useFeedback();
  const { requests, addRequest, updateRequestStatus } = useData();
  const warehouseMapRef = useRef<HTMLIFrameElement | null>(null);

  // ... (rest of the component)

  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseDialogOpen, setWarehouseDialogOpen] = useState(false);
  const [trolleyDialogOpen, setTrolleyDialogOpen] = useState(false);
  const [selectedWarehouseMap, setSelectedWarehouseMap] = useState<string>('');

  const [warehouseFormData, setWarehouseFormData] = useState({
    title: '',
    owner: '',
    cargoType: '',
    quantity: '',
    fromDate: '',
    toDate: '',
    selectedWarehouse: '',
  });

  const [trolleyFormData, setTrolleyFormData] = useState({
    vesselName: '',
    cargoType: '',
    shippingAgent: '',
    fromDate: '',
    toDate: '',
    notes: '',
  });

  const [warehouseSearchTerm, setWarehouseSearchTerm] = useState<string>('');
  const [filteredWarehouses, setFilteredWarehouses] = useState<string[]>(WAREHOUSES_LIST);

  // Filter warehouses based on search term
  useEffect(() => {
    if (warehouseSearchTerm.trim() === '') {
      setFilteredWarehouses(WAREHOUSES_LIST);
    } else {
      const searchLower = warehouseSearchTerm.toLowerCase();
      const filtered = WAREHOUSES_LIST.filter((warehouse) =>
        warehouse.toLowerCase().includes(searchLower)
      );
      setFilteredWarehouses(filtered);
    }
  }, [warehouseSearchTerm]);

  // Initialize iframe listener when dialog opens
  useEffect(() => {
    if (warehouseDialogOpen && warehouseMapRef.current) {
      const timer = setTimeout(() => {
        try {
          // Try to establish connection with iframe
          if (warehouseMapRef.current && warehouseMapRef.current.contentWindow) {
            warehouseMapRef.current.contentWindow.postMessage({
              type: 'initConnection',
              ready: true,
            }, '*');
            console.log('🔗 Connected to map iframe');
          }
        } catch (e) {
          console.log('ℹ️ iframe connection note:', e);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [warehouseDialogOpen]);

  // Handle warehouse selection from dropdown
  const handleWarehouseChange = (warehouseName: string) => {
    console.log('🎯 Warehouse selected from dropdown:', warehouseName);

    setSelectedWarehouseMap(warehouseName);
    setWarehouseFormData({ ...warehouseFormData, selectedWarehouse: warehouseName });
    setWarehouseSearchTerm(warehouseName);

    // Send message to map to highlight, focus and zoom to the warehouse
    try {
      const iframe = warehouseMapRef.current;
      if (!iframe) {
        console.warn('⚠️ iframe ref not found');
        return;
      }

      // Ensure iframe is loaded before sending message
      setTimeout(() => {
        if (iframe && iframe.contentWindow) {
          // Send message in the format the map expects
          const message = {
            type: 'focus',
            name: warehouseName,
            id: warehouseName, // The map uses this to search
            source: 'dropdown-selection',
          };

          console.log('📤 Sending to map:', message);
          iframe.contentWindow.postMessage(message, '*');
        } else {
          console.warn('⚠️ iframe contentWindow not ready');
        }
      }, 50);
    } catch (e) {
      console.error('❌ Error sending message to map:', e);
    }
  };

  // Listen for warehouse selection from map with improved handling
  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      console.log('📨 Message received from map:', event.data);

      // Handle the message format from the map
      if (event.data) {
        let warehouseName = null;

        // Check multiple formats the map might send
        if (event.data.type === 'selected' && event.data.name) {
          // This is the format the map actually sends
          warehouseName = event.data.name;
          console.log('✅ Got warehouse name from map:', warehouseName);
        } else if (event.data.type === 'warehouseSelected' && event.data.warehouseName) {
          warehouseName = event.data.warehouseName;
        } else if (event.data.action === 'warehouseSelected' && event.data.warehouseName) {
          warehouseName = event.data.warehouseName;
        } else if (event.data.warehouseName) {
          warehouseName = event.data.warehouseName;
        } else if (event.data.name && typeof event.data.name === 'string') {
          warehouseName = event.data.name;
        }

        if (warehouseName && WAREHOUSES_LIST.includes(warehouseName)) {
          console.log('✅✅ Warehouse selected from map:', warehouseName);
          setSelectedWarehouseMap(warehouseName);
          setWarehouseFormData(prev => ({ ...prev, selectedWarehouse: warehouseName }));
          setWarehouseSearchTerm(warehouseName);
        } else if (warehouseName) {
          console.log('⚠️ Warehouse name not in list, searching for partial match:', warehouseName);
          // Try to find partial match
          const partialMatch = WAREHOUSES_LIST.find(w =>
            w.toLowerCase().includes(warehouseName.toLowerCase()) ||
            warehouseName.toLowerCase().includes(w.toLowerCase())
          );
          if (partialMatch) {
            console.log('✅ Found partial match:', partialMatch);
            setSelectedWarehouseMap(partialMatch);
            setWarehouseFormData(prev => ({ ...prev, selectedWarehouse: partialMatch }));
            setWarehouseSearchTerm(partialMatch);
          }
        }
      }
    };

    // Add listener with capturing phase to catch all messages
    window.addEventListener('message', handleMapMessage, true);

    // Also add standard listener
    window.addEventListener('message', handleMapMessage);

    return () => {
      window.removeEventListener('message', handleMapMessage, true);
      window.removeEventListener('message', handleMapMessage);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: {
        label: language === 'ar' ? 'قيد الانتظار' : 'Pending',
        variant: 'secondary',
      },
      approved: {
        label: language === 'ar' ? 'مقبول' : 'Approved',
        variant: 'default',
      },
      rejected: {
        label: language === 'ar' ? 'مرفوض' : 'Rejected',
        variant: 'destructive',
      },
      in_progress: {
        label: language === 'ar' ? 'قيد المراجعة' : 'Under Review',
        variant: 'outline',
      },
    };

    const { label, variant } = statusMap[status] || statusMap.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const handleWarehouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWarehouseMap) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى اختيار مخزن' : 'Please select a warehouse',
        variant: 'destructive',
      });
      return;
    }

    addRequest({
      type: 'warehouse',
      title: language === 'ar' ? `طلب حجز مخزن - ${selectedWarehouseMap}` : `Warehouse Booking - ${selectedWarehouseMap}`,
      details: `${warehouseFormData.cargoType} - ${warehouseFormData.quantity} ${language === 'ar' ? 'طن' : 'tons'} من ${warehouseFormData.owner}`,
      owner: warehouseFormData.owner,
      cargoType: warehouseFormData.cargoType,
      quantity: warehouseFormData.quantity,
      fromDate: warehouseFormData.fromDate,
      toDate: warehouseFormData.toDate,
      userId: user?.id,
      status: 'pending',
    }, 'pending');
    toast({
      title: language === 'ar' ? 'تم إرسال الطلب' : 'Request Submitted',
      description: language === 'ar' ? 'سيتم مراجعة طلب حجز المخزن وتنبيهك في لوحة التحكم' : 'Your warehouse booking request will be reviewed and you will be notified on the dashboard',
    });
    setWarehouseDialogOpen(false);
    // Trigger feedback modal after 1 second
    setTimeout(() => {
      triggerFeedback('warehouse_request');
    }, 1000);
    setSelectedWarehouseMap('');
    setWarehouseFormData({
      title: '',
      owner: '',
      cargoType: '',
      quantity: '',
      fromDate: '',
      toDate: '',
      selectedWarehouse: '',
    });
  };

  const handleTrolleySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      type: 'trolley',
      title: language === 'ar' ? `طلب تراكى - ${trolleyFormData.vesselName}` : `Berthing - ${trolleyFormData.vesselName}`,
      details: `${trolleyFormData.cargoType} - ${trolleyFormData.shippingAgent}`,
      vesselName: trolleyFormData.vesselName,
      cargoType: trolleyFormData.cargoType,
      shippingAgent: trolleyFormData.shippingAgent,
      fromDate: trolleyFormData.fromDate,
      toDate: trolleyFormData.toDate,
      userId: user?.id,
      status: 'pending',
    }, 'pending');
    toast({
      title: language === 'ar' ? 'تم إرسال الطلب' : 'Request Submitted',
      description: language === 'ar' ? 'سيتم مراجعة طلبك وتنبيهك في الداش بورد' : 'Your request will be reviewed and you will be notified on the dashboard',
    });
    setTrolleyDialogOpen(false);
    // Trigger feedback modal after 1 second
    setTimeout(() => {
      triggerFeedback('berthing_request');
    }, 1000);
  };

  const handleStatusUpdate = (id: string, status: Request['status']) => {
    updateRequestStatus(id, status);
    toast({
      title: language === 'ar' ? 'تم تحديث الحالة' : 'Status Updated',
      description: status === 'approved'
        ? (language === 'ar' ? 'تم قبول الطلب' : 'Request Approved')
        : status === 'rejected'
          ? (language === 'ar' ? 'تم رفض الطلب' : 'Request Rejected')
          : (language === 'ar' ? 'الطلب قيد المراجعة' : 'Request Under Review'),
    });
  };

  const getFilteredRequests = () => {
    // Use centralized RBAC utility to determine which requests are visible
    const visible = getVisibleRequests(requests, user?.userType, user?.id, user?.classification);

    // Apply search filter on visible requests
    const filtered = visible.filter((req) => req.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  };

  const filteredRequests = getFilteredRequests();
  // Define role checks for Maritime Agency and Shipping Company
  const isAgency = user?.classification === 'agency' || user?.email === 'agency@dpa.gov.eg';
  const isShipping = user?.classification === 'shipping' || user?.email === 'dpa-community@dpa.gov.eg';
  const isAdmin = user?.userType === 'ADMIN';
  const isStaff = user?.userType === 'DPA_STAFF';
  // Hide warehouse requests for Maritime Agency, hide trolley requests for Shipping Company
  const warehouseRequests = isAgency ? [] : filteredRequests.filter((req) => req.type === 'warehouse');
  const trolleyRequests = isShipping ? [] : filteredRequests.filter((req) => req.type === 'trolley');

  // Block direct access to warehouse/trolley for shipping company
  useEffect(() => {
    const pageUrl = window.location.pathname;
    if (isShipping && pageUrl.includes('berthing')) {
      window.location.href = '/dashboard';
    }
    if (isAgency && pageUrl.includes('warehouse')) {
      window.location.href = '/dashboard';
    }
  }, [isShipping, isAgency]);

  const RequestCard = ({ request }: { request: Request }) => {
    const canEdit = (user?.userType === 'ADMIN' || user?.userType === 'DPA_STAFF') && !user?.isReadOnly;

    return (
      <Card className="card-hover">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {request.type === 'warehouse' ? (
                  <Package className="w-5 h-5 text-primary" />
                ) : (
                  <Truck className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{request.title}</h3>
                <p className="text-sm text-muted-foreground">{request.details}</p>
              </div>
            </div>
            {getStatusBadge(request.status)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <span>{request.date}</span>
          </div>

          {canEdit && (
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 w-full"
                onClick={() => {
                  handleStatusUpdate(request.id, 'approved');
                  triggerConfetti('success');
                }}
                disabled={request.status === 'approved'}
              >
                {language === 'ar' ? 'موافقة' : 'Approve'}
              </Button>
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 w-full text-white"
                onClick={() => handleStatusUpdate(request.id, 'in_progress')}
                disabled={request.status === 'in_progress'}
              >
                {language === 'ar' ? 'جاري العمل' : 'Review'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                disabled={request.status === 'rejected'}
              >
                {language === 'ar' ? 'رفض' : 'Reject'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card >
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">{t('nav.requests')}</h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'إدارة طلبات المخازن وتراكى السفن' : 'Manage warehouse and vessel berthing requests'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* New Warehouse Request Dialog - show for Admin/Staff and Shipping Company, hide for Maritime Agency */}
          {!user?.isReadOnly && canSeeWarehouseRequests(user?.userType, user?.classification) && !isAgency && (isAdmin || isStaff || isShipping) && (
            <Dialog open={warehouseDialogOpen} onOpenChange={setWarehouseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-full px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg">
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'طلب مخزن +' : 'Warehouse Request +'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('requests.warehouse.title')}</DialogTitle>
                  <DialogDescription>
                    {language === 'ar' ? 'البحث واختيار المخزن من الخريطة أو القائمة، ثم إدخال التفاصيل' : 'Search and select warehouse from map or list, then enter booking details'}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Search Box */}
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder={language === 'ar' ? 'البحث عن المخزن...' : 'Search warehouse...'}
                      className="ps-10 h-10 text-base"
                      value={warehouseSearchTerm}
                      onChange={(e) => setWarehouseSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Info Box */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {language === 'ar'
                        ? '💡 اختر من القائمة أو انقر على الخريطة - سيتم التحديث تلقائياً على الطرفين'
                        : '💡 Select from dropdown or click on map - both will update automatically'}
                    </p>
                  </div>

                  {/* Main Content: Side-by-Side Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
                    {/* Left Section: Warehouse Dropdown */}
                    <div className="space-y-2">
                      <Label className="font-semibold text-base">{language === 'ar' ? 'اختر المخزن' : 'Select Warehouse'}</Label>
                      <Select value={selectedWarehouseMap} onValueChange={(value) => {
                        handleWarehouseChange(value);
                      }}>
                        <SelectTrigger className="h-10 border-2 border-primary/50">
                          <SelectValue placeholder={language === 'ar' ? 'اختر من القائمة...' : 'Select warehouse...'} />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 w-full">
                          {filteredWarehouses.length > 0 ? (
                            filteredWarehouses.map((warehouse, index) => (
                              <SelectItem key={index} value={warehouse} className="cursor-pointer">
                                {warehouse}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-center text-sm text-muted-foreground">
                              {language === 'ar' ? 'لا توجد نتائج' : 'No results'}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Right Section: Map (Takes Full Space) */}
                    <div className="lg:col-span-2 space-y-2 overflow-hidden flex flex-col border-2 border-primary/30 rounded-lg bg-muted">
                      <div className="sticky top-0 bg-background border-b p-3 z-10 flex items-center justify-between">
                        <Label className="font-semibold text-base">{language === 'ar' ? 'خريطة المخازن' : 'Warehouse Map'}</Label>
                        {selectedWarehouseMap && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            ✓ {selectedWarehouseMap}
                          </span>
                        )}
                      </div>
                      <iframe
                        ref={warehouseMapRef}
                        src="/maps/المخازن/index.html"
                        className="w-full flex-1 border-0 rounded-b-lg"
                        title="Warehouses Map"
                      />
                    </div>
                  </div>

                  {/* Selected Warehouse Confirmation */}
                  {selectedWarehouseMap && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <span className="text-2xl">✓</span>
                        </div>
                        <div>
                          <p className="font-semibold text-green-900">
                            {language === 'ar' ? 'تم اختيار المخزن' : 'Warehouse Selected'}
                          </p>
                          <p className="text-sm text-green-800">{selectedWarehouseMap}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Warehouse Details Form */}
                {selectedWarehouseMap && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-lg">
                      {language === 'ar' ? 'تفاصيل الحجز' : 'Booking Details'}
                    </h3>

                    <form onSubmit={handleWarehouseSubmit} className="space-y-4 border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t('requests.warehouse.owner')}</Label>
                          <Input
                            placeholder={language === 'ar' ? 'صاحب الشأن / اسم الشركة' : 'Company name or owner'}
                            value={warehouseFormData.owner}
                            onChange={(e) => setWarehouseFormData({ ...warehouseFormData, owner: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('requests.warehouse.cargoType')}</Label>
                          <Input
                            placeholder={language === 'ar' ? 'نوع البضاعة' : 'Cargo type'}
                            value={warehouseFormData.cargoType}
                            onChange={(e) => setWarehouseFormData({ ...warehouseFormData, cargoType: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t('requests.warehouse.quantity')}</Label>
                          <Input
                            type="number"
                            placeholder={language === 'ar' ? 'الكمية بالطن' : 'Quantity in tons'}
                            value={warehouseFormData.quantity}
                            onChange={(e) => setWarehouseFormData({ ...warehouseFormData, quantity: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>{t('requests.warehouse.period')}</Label>
                          <Input
                            placeholder={language === 'ar' ? 'مدة الحجز' : 'Booking period'}
                            value={warehouseFormData.fromDate}
                            onChange={(e) => setWarehouseFormData({ ...warehouseFormData, fromDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        {language === 'ar' ? 'تقديم الطلب' : 'Submit Request'}
                      </Button>
                    </form>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}

          {/* New Trolley Request Dialog - Hidden for Shipping Company */}
          {!user?.isReadOnly && canSeeTrolleyRequests(user?.userType, user?.classification) && !isShipping && (
            <Dialog open={trolleyDialogOpen} onOpenChange={setTrolleyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'طلب تراكى' : 'Berthing Request'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('requests.berthing.title')}</DialogTitle>
                  <DialogDescription>
                    {language === 'ar' ? 'أدخل تفاصيل طلب تراكى السفينة' : 'Enter vessel berthing request details'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTrolleySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('requests.berthing.vesselName')}</Label>
                    <Input
                      placeholder={language === 'ar' ? 'اسم السفينة' : 'Vessel name'}
                      value={trolleyFormData.vesselName}
                      onChange={(e) => setTrolleyFormData({ ...trolleyFormData, vesselName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('requests.berthing.agent')}</Label>
                    <Input
                      placeholder={language === 'ar' ? 'التوكيل الملاحي' : 'Shipping agent'}
                      value={trolleyFormData.shippingAgent}
                      onChange={(e) => setTrolleyFormData({ ...trolleyFormData, shippingAgent: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('requests.berthing.cargo')}</Label>
                    <Input
                      placeholder={language === 'ar' ? 'نوع البضاعة' : 'Cargo type'}
                      value={trolleyFormData.cargoType}
                      onChange={(e) => setTrolleyFormData({ ...trolleyFormData, cargoType: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">{t('requests.submit')}</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}

        </div>
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

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className={`grid w-full mb-6 ${isShipping ? 'grid-cols-2' : isAgency ? 'grid-cols-2' : 'grid-cols-3'}`}>
            <TabsTrigger value="all">
              {language === 'ar' ? 'الكل' : 'All'} ({filteredRequests.length})
            </TabsTrigger>
            {/* Warehouse tab - show for Admin/Staff and Shipping Company */}
            {(isAdmin || isStaff || isShipping) && (
              <TabsTrigger value="warehouse">
                {language === 'ar' ? 'طلب مخزن' : 'Warehouse Request'} ({warehouseRequests.length})
              </TabsTrigger>
            )}
            {/* Trolley tab - Hide for Shipping Company */}
            {!isShipping && (
              <TabsTrigger value="trolley">
                {t('nav.trolley')} ({trolleyRequests.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </TabsContent>

          {/* Hide warehouse tab content for Maritime Agency */}
          {!isAgency && (
            <TabsContent value="warehouse">
              <div className="grid md:grid-cols-2 gap-4">
                {warehouseRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>
          )}

          {/* Hide trolley tab content for Shipping Company */}
          {!isShipping && (
            <TabsContent value="trolley">
              <div className="grid md:grid-cols-2 gap-4">
                {trolleyRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Requests;
