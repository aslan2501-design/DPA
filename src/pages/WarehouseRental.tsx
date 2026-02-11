import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Package } from 'lucide-react';

// List of warehouses extracted from the map data
const warehousesList = [
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

interface RentalFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  selectedWarehouse: string;
  rentalPeriod: string;
  startDate: string;
  purpose: string;
}

const WarehouseRental = () => {
  const { language } = useLanguage();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [formData, setFormData] = useState<RentalFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    selectedWarehouse: '',
    rentalPeriod: '',
    startDate: '',
    purpose: '',
  });

  // Handle warehouse selection from dropdown
  const handleWarehouseChange = (warehouseName: string) => {
    setSelectedWarehouse(warehouseName);
    setFormData({ ...formData, selectedWarehouse: warehouseName });

    // Send message to map to highlight the warehouse
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage({
        type: 'focusWarehouse',
        warehouseName: warehouseName,
      }, '*');
    } catch (e) {
      // ignore
    }
  };

  // Listen for messages from the embedded map
  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'warehouseSelected') {
        const warehouseName = event.data.warehouseName;
        setSelectedWarehouse(warehouseName);
        setFormData({ ...formData, selectedWarehouse: warehouseName });
      }
    };

    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, [formData]);

  // Handle iframe load
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      try {
        iframe.style.height = '100%';
        // Send warehouses list to map
        iframe.contentWindow?.postMessage({
          type: 'initWarehouses',
          warehouses: warehousesList,
        }, '*');
      } catch (e) {
        // ignore
      }
    };

    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rental Request Submitted:', formData);
    // TODO: Send form data to backend
    alert(language === 'ar' ? 'تم استقبال طلبك بنجاح!' : 'Your request has been submitted successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="w-8 h-8" />
          {language === 'ar' ? 'تأجير مخزن' : 'Warehouse Rental'}
        </h1>
        <p className="text-gray-600 mt-2">
          {language === 'ar'
            ? 'اختر مخزنًا من الخريطة أو من القائمة المنسدلة واملأ نموذج الطلب'
            : 'Select a warehouse from the map or dropdown list and fill out the rental request form'}
        </p>
      </div>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid grid-cols-2 gap-2 max-w-md mb-4">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {language === 'ar' ? 'الخريطة' : 'Map'}
          </TabsTrigger>
          <TabsTrigger value="form">
            {language === 'ar' ? 'نموذج الطلب' : 'Request Form'}
          </TabsTrigger>
        </TabsList>

        {/* Map Tab */}
        <TabsContent value="map">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'ar' ? 'خريطة المخازن' : 'Warehouse Map'}</CardTitle>
                  <CardDescription>
                    {language === 'ar'
                      ? 'انقر على مخزن على الخريطة لاختياره'
                      : 'Click on a warehouse on the map to select it'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[600px] rounded border overflow-hidden">
                    <iframe
                      ref={iframeRef}
                      title="Warehouse Map"
                      src="/maps/المخازن/index.html"
                      className="w-full h-full border-0"
                      style={{ minHeight: '600px' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Warehouse Selection Section */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {language === 'ar' ? 'المخزن المختار' : 'Selected Warehouse'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Warehouse Dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'ar' ? 'اختر المخزن' : 'Select Warehouse'}
                    </label>
                    <Select value={selectedWarehouse} onValueChange={handleWarehouseChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={language === 'ar' ? 'اختر مخزنًا' : 'Choose a warehouse'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {warehousesList.map((warehouse) => (
                          <SelectItem key={warehouse} value={warehouse}>
                            {warehouse}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Warehouse Info */}
                  {selectedWarehouse && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900">
                        {language === 'ar' ? 'المخزن المختار:' : 'Selected Warehouse:'}
                      </p>
                      <p className="text-lg font-bold text-blue-700 mt-1">{selectedWarehouse}</p>
                      <Button
                        onClick={() => {
                          setSelectedWarehouse('');
                          setFormData({ ...formData, selectedWarehouse: '' });
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                      >
                        {language === 'ar' ? 'مسح الاختيار' : 'Clear Selection'}
                      </Button>
                    </div>
                  )}

                  {!selectedWarehouse && (
                    <div className="p-3 bg-gray-50 rounded text-center text-sm text-gray-500">
                      {language === 'ar'
                        ? 'لم يتم اختيار مخزن بعد'
                        : 'No warehouse selected yet'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Form Tab */}
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'نموذج طلب التأجير' : 'Warehouse Rental Request Form'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected Warehouse Display */}
                {selectedWarehouse && (
                  <div className="p-4 bg-green-50 rounded border border-green-200">
                    <p className="text-sm font-semibold text-green-900">
                      {language === 'ar' ? 'المخزن المختار:' : 'Selected Warehouse:'}
                    </p>
                    <p className="text-lg font-bold text-green-700 mt-1">{selectedWarehouse}</p>
                  </div>
                )}

                {/* Company Information Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {language === 'ar' ? 'معلومات الشركة' : 'Company Information'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'اسم الشركة' : 'Company Name'}
                      </label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => handleFormChange('companyName', e.target.value)}
                        placeholder={language === 'ar' ? 'أدخل اسم الشركة' : 'Enter company name'}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'شخص الاتصال' : 'Contact Person'}
                      </label>
                      <Input
                        value={formData.contactPerson}
                        onChange={(e) => handleFormChange('contactPerson', e.target.value)}
                        placeholder={language === 'ar' ? 'اسم شخص الاتصال' : 'Contact person name'}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email address'}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone number'}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Rental Details Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {language === 'ar' ? 'تفاصيل التأجير' : 'Rental Details'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'مدة التأجير (بالأشهر)' : 'Rental Period (Months)'}
                      </label>
                      <Select value={formData.rentalPeriod} onValueChange={(value) => handleFormChange('rentalPeriod', value)}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={language === 'ar' ? 'اختر المدة' : 'Select period'}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 3, 6, 12].map((month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month} {language === 'ar' ? 'أشهر' : 'month(s)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 mt-4">
                      {language === 'ar' ? 'الغرض من التأجير' : 'Purpose of Rental'}
                    </label>
                    <Input
                      value={formData.purpose}
                      onChange={(e) => handleFormChange('purpose', e.target.value)}
                      placeholder={language === 'ar' ? 'اشرح الغرض من تأجير المخزن' : 'Explain the purpose'}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!selectedWarehouse || !formData.companyName || !formData.contactPerson}
                  >
                    {language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        companyName: '',
                        contactPerson: '',
                        email: '',
                        phone: '',
                        selectedWarehouse: '',
                        rentalPeriod: '',
                        startDate: '',
                        purpose: '',
                      });
                      setSelectedWarehouse('');
                    }}
                  >
                    {language === 'ar' ? 'مسح' : 'Clear'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WarehouseRental;
