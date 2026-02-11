import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ship,
  MapPin,
  Shield,
  BarChart3,
  Warehouse,
  Truck,
  Wrench,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Anchor,
  Globe,
  Leaf,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';

const Landing = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [activeNews, setActiveNews] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const features = [
    {
      icon: Ship,
      title: t('landing.feature1.title'),
      description: t('landing.feature1.desc'),
    },
    {
      icon: MapPin,
      title: t('landing.feature2.title'),
      description: t('landing.feature2.desc'),
    },
    {
      icon: Shield,
      title: t('landing.feature3.title'),
      description: t('landing.feature3.desc'),
    },
    {
      icon: BarChart3,
      title: t('landing.feature4.title'),
      description: t('landing.feature4.desc'),
    },
  ];

  const services = [
    {
      icon: Warehouse,
      title: language === 'ar' ? 'حجز المخازن' : 'Warehouse Booking',
      description: language === 'ar'
        ? 'احجز مساحات التخزين بسهولة وتتبع حالة طلباتك'
        : 'Book storage spaces easily and track your requests',
    },
    {
      icon: Truck,
      title: language === 'ar' ? 'طلبات التراكى' : 'Berthing Requests',
      description: language === 'ar'
        ? 'اطلب خدمات تراكى السفن بالميناء'
        : 'Request vessel berthing services at the port',
    },
    {
      icon: Wrench,
      title: language === 'ar' ? 'الصيانة والشكاوى' : 'Maintenance & Complaints',
      description: language === 'ar'
        ? 'قدم بلاغات الصيانة وتتبع حالتها على الخريطة'
        : 'Submit maintenance reports and track them on the map',
    },
  ];

  const stats = [
    { value: '50+', label: language === 'ar' ? 'مخزن' : 'Warehouses' },
    { value: '1000+', label: language === 'ar' ? 'طلب شهرياً' : 'Requests/Month' },
    { value: '24/7', label: language === 'ar' ? 'دعم فني' : 'Support' },
    { value: '99%', label: language === 'ar' ? 'نسبة الرضا' : 'Satisfaction' },
  ];

  // Enhanced port statistics
  const portStats = [
    {
      value: '500+',
      label: language === 'ar' ? 'سفينة سنوياً' : 'Vessels/Year',
      icon: Ship,
    },
    {
      value: '5M+',
      label: language === 'ar' ? 'طن سعة تخزين' : 'Storage Capacity (Tons)',
      icon: Warehouse,
    },
    {
      value: '24h',
      label: language === 'ar' ? 'متوسط التفريغ' : 'Avg. Unload Time',
      icon: Clock,
    },
    {
      value: '98%',
      label: language === 'ar' ? 'نسبة السلامة' : 'Safety Rate',
      icon: Shield,
    },
  ];

  // News ticker items
  const newsItems = [
    {
      title: language === 'ar' ? 'تحديث نظام الحجز' : 'Booking System Update',
      date: language === 'ar' ? 'اليوم' : 'Today',
      description: language === 'ar'
        ? 'تم تحديث نظام حجز المخازن لتحسين سرعة العملية'
        : 'Warehouse booking system updated for improved speed',
    },
    {
      title: language === 'ar' ? 'افتتاح مخزن جديد' : 'New Warehouse Opening',
      date: language === 'ar' ? 'أمس' : 'Yesterday',
      description: language === 'ar'
        ? 'تم افتتاح مخزن جديد بمساحة 2000 متر مربع'
        : 'New warehouse opened with 2000 sq. meters capacity',
    },
    {
      title: language === 'ar' ? 'خدمة التدريب عن بعد' : 'Remote Training Service',
      date: language === 'ar' ? 'قبل يومين' : '2 days ago',
      description: language === 'ar'
        ? 'بدء برنامج تدريب جديد للعاملين بالميناء'
        : 'New training program launched for port staff',
    },
  ];

  // Announcements
  const announcements = [
    {
      title: language === 'ar' ? 'صيانة طارئة' : 'Emergency Maintenance',
      type: 'warning',
      message: language === 'ar'
        ? 'صيانة مخطط لها في المخازن الشرقية من 2 إلى 5 مارس'
        : 'Scheduled maintenance at Eastern Warehouses from March 2-5',
    },
    {
      title: language === 'ar' ? 'طرح مخازن وساحات للإيجار' : 'Warehouses & Yards for Rent',
      type: 'info',
      message: language === 'ar'
        ? 'طرح مخازن وساحات للإيجار بمساحات متنوعة وموقع استراتيجي بالميناء'
        : 'Warehouses and yards available for rent with various sizes and strategic location',
    },
  ];

  // Hierarchical Services Structure
  const serviceCategories = [
    {
      id: 'transit',
      title: language === 'ar' ? 'خدمات مرور السفن' : 'Ship Transit Services',
      icon: Ship,
      description: language === 'ar'
        ? 'جميع الخدمات المتعلقة بمرور السفن والملاحة'
        : 'All services related to ship transit and navigation',
      subcategories: [
        {
          title: language === 'ar' ? 'الملاحة والتوجيه' : 'Navigation & Guidance',
          items: [
            'GPS Navigation Services',
            language === 'ar' ? 'خدمات التوجيه البحري' : 'Marine Guidance Services',
            language === 'ar' ? 'معلومات الممرات المائية' : 'Waterway Information',
          ],
        },
        {
          title: language === 'ar' ? 'البرج والإرشاد' : 'Tower & Pilotage',
          items: [
            language === 'ar' ? 'خدمات الإرشاد البحري' : 'Marine Piloting Services',
            language === 'ar' ? 'إدارة الحركة المرورية' : 'Traffic Management',
            language === 'ar' ? 'الاتصالات البحرية' : 'Marine Communications',
          ],
        },
        {
          title: language === 'ar' ? 'العوامات والملاحة الآمنة' : 'Buoys & Safe Navigation',
          items: [
            language === 'ar' ? 'صيانة العوامات' : 'Buoy Maintenance',
            language === 'ar' ? 'تحديث خرائط الملاحة' : 'Navigation Chart Updates',
            language === 'ar' ? 'تنبيهات الملاحة' : 'Navigation Alerts',
          ],
        },
      ],
    },
    {
      id: 'interactive',
      title: language === 'ar' ? 'الخدمات التفاعليه' : 'Interactive Services',
      icon: Globe,
      description: language === 'ar'
        ? 'خدمات رقمية تفاعلية عبر الإنترنت'
        : 'Interactive digital services online',
      subcategories: [
        {
          title: language === 'ar' ? 'إدراج الطلبات والمانفست' : 'Requests & Manifest',
          items: [
            language === 'ar' ? 'تقديم الطلبات الرسمية' : 'Submit Official Requests',
            language === 'ar' ? 'إدارة المانفست الشحنات' : 'Cargo Manifest Management',
            language === 'ar' ? 'تتبع حالة الطلبات' : 'Track Request Status',
          ],
        },
        {
          title: language === 'ar' ? 'التدريب عن بعد' : 'Remote Training',
          items: [
            language === 'ar' ? 'برامج تدريبية للعاملين' : 'Staff Training Programs',
            language === 'ar' ? 'دورات السلامة البحرية' : 'Marine Safety Courses',
            language === 'ar' ? 'شهادات تدريب معترف بها' : 'Recognized Certificates',
          ],
        },
        {
          title: language === 'ar' ? 'خدمات الشحن العامة' : 'General Cargo Services',
          items: [
            language === 'ar' ? 'خدمات الشحن والتفريغ' : 'Loading/Unloading Services',
            language === 'ar' ? 'أعمال التخزين المؤقت' : 'Temporary Storage',
            language === 'ar' ? 'معالجة البضائع' : 'Cargo Handling',
          ],
        },
      ],
    },
    {
      id: 'maritime',
      title: language === 'ar' ? 'الخدمات البحرية' : 'Maritime Services',
      icon: Anchor,
      description: language === 'ar'
        ? 'خدمات متخصصة للعمليات البحرية والبحارة'
        : 'Specialized maritime operations services',
      subcategories: [
        {
          title: language === 'ar' ? 'خدمات السفن والتراكي' : 'Vessel & Berthing Services',
          items: [
            language === 'ar' ? 'حجز فترات التراكي' : 'Berthing Slot Booking',
            language === 'ar' ? 'خدمات الصيانة البحرية' : 'Marine Maintenance',
            language === 'ar' ? 'إمدادات السفن' : 'Ship Supplies',
          ],
        },
        {
          title: language === 'ar' ? 'خدمات البحارة' : 'Crew Services',
          items: [
            language === 'ar' ? 'استقبال وتغيير الطاقم' : 'Crew Change Services',
            language === 'ar' ? 'خدمات الإجازات البرية' : 'Shore Leave Services',
            language === 'ar' ? 'التأمين الصحي للبحارة' : 'Crew Health Insurance',
          ],
        },
      ],
    },
    {
      id: 'environmental',
      title: language === 'ar' ? 'الخدمات البيئية' : 'Environmental Services',
      icon: Leaf,
      description: language === 'ar'
        ? 'حماية البيئة والنحر والإطماء'
        : 'Environmental protection and monitoring',
      subcategories: [
        {
          title: language === 'ar' ? 'مراقبة البيئة البرية' : 'Land Environment',
          items: [
            language === 'ar' ? 'تقييم تأثيرات التراكى' : 'Impact Assessment',
            language === 'ar' ? 'إدارة النفايات' : 'Waste Management',
            language === 'ar' ? 'مشاريع التشجير' : 'Greening Projects',
          ],
        },
        {
          title: language === 'ar' ? 'مراقبة البيئة البحرية' : 'Sea Environment',
          items: [
            language === 'ar' ? 'مراقبة جودة المياه' : 'Water Quality Monitoring',
            language === 'ar' ? 'تحليل النحر والإطماء' : 'Erosion & Sedimentation',
            language === 'ar' ? 'حماية الحياة البحرية' : 'Marine Life Protection',
          ],
        },
        {
          title: language === 'ar' ? 'مراقبة البيئة الجوية' : 'Air Environment',
          items: [
            language === 'ar' ? 'قياس معدلات التلوث' : 'Pollution Monitoring',
            language === 'ar' ? 'جودة الهواء' : 'Air Quality',
            language === 'ar' ? 'الانبعاثات البحرية' : 'Marine Emissions',
          ],
        },
      ],
    },
  ];

  // Images for hero background carousel (served from public/maps/صور)
  const heroBgImages = [
    '/maps/صور/1 (1).png',
    '/maps/صور/1 (2).png',
    '/maps/صور/1 (3).png',
    '/maps/صور/1 (4).png',
    '/maps/صور/1 (5).png',
    '/maps/صور/1 (6).png',
    '/maps/صور/1 (7).png',
    '/maps/صور/1 (8).png',
    '/maps/صور/1 (9).png',
  ];

  // Auto-rotate news
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNews((prev) => (prev + 1) % newsItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % heroBgImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroBgImages.length]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-20">
        {/* Carousel Background Image */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          key={activeImage}
        >
          <img
            src={heroBgImages[activeImage]}
            alt={`port-image-${activeImage}`}
            className="w-full h-full object-cover filter brightness-110 contrast-105 saturate-105"
          />
        </motion.div>

        {/* Dark Gradient Overlay */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          activeImage === 0
            ? 'bg-gradient-to-br from-transparent via-transparent to-transparent'
            : 'bg-black/20'
        }`}></div>

        {/* Animated Blur Shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 flex flex-col items-center justify-center z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
            style={{ textShadow: '0 6px 16px rgba(0, 0, 0, 0.9), 0 2px 4px rgba(0, 0, 0, 0.8)' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('landing.title')}
            </h1>

            <p className="text-xl md:text-2xl opacity-90 mb-8">
              {t('landing.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ textShadow: '0 3px 10px rgba(0, 0, 0, 0.7)' }}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 gap-2"
                asChild
              >
                <Link to="/register">
                  {t('landing.cta')}
                  <ArrowIcon className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/login">{t('nav.login')}</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Image Carousel Indicators */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {heroBgImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeImage ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl mb-2">
                  {language === 'ar' ? 'نبذة عن الهيئة' : 'About the Authority'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {language === 'ar'
                    ? 'هيئة ميناء دمياط'
                    : 'Damietta Port Authority'}
                </CardDescription>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed mb-4">
                  {language === 'ar'
                    ? 'تعتبر هيئة ميناء دمياط من أهم البوابات الاقتصادية على ساحل البحر المتوسط، حيث تقدم خدمات بحرية متكاملة للعاملين في المجال البحري والشحن. تتمتع الهيئة بموقع استراتيجي مميز يجعلها محطة مهمة للنقل البحري في جمهورية مصر العربية.'
                    : 'Damietta Port Authority is one of the most important economic gateways on the Mediterranean coast, providing integrated maritime services for stakeholders in the maritime and shipping sector. The authority enjoys a strategic location that makes it an important hub for maritime transport in Egypt.'}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'أحدث التسهيلات' : 'Modern Facilities'}
                      </h4>
                      <p>
                        {language === 'ar'
                          ? 'معدات حديثة وأنظمة إلكترونية متقدمة'
                          : 'Modern equipment and advanced systems'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'ar' ? 'خدمات متميزة' : 'Premium Services'}
                      </h4>
                      <p>
                        {language === 'ar'
                          ? 'خدمات على مدار 24 ساعة طوال السنة'
                          : '24/7 services throughout the year'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Mission'}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-6 h-6 text-primary" />
                    {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">
                    {language === 'ar'
                      ? 'أن نكون ميناء عالمي متقدم يسهم في التنمية الاقتصادية والاجتماعية لجمهورية مصر العربية، ويوفر خدمات بحرية متحضرة وآمنة وفعالة.'
                      : 'To be an advanced world-class port that contributes to the economic and social development of Egypt, providing modern, safe, and efficient maritime services.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed">
                    {language === 'ar'
                      ? 'توفير بيئة عمل آمنة وفعالة للعاملين والعملاء، وتطوير البنية التحتية البحرية، وتعزيز السلامة والحماية البحرية والحفاظ على البيئة.'
                      : 'Provide a safe and efficient working environment for employees and customers, develop maritime infrastructure, promote maritime safety and environmental sustainability.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News Ticker Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'آخر الأخبار' : 'Latest News'}
            </h2>
          </motion.div>

          <div className="relative">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="min-h-32 flex items-center justify-between bg-gradient-to-r from-primary/10 to-primary/5 p-8">
                  <motion.div
                    key={activeNews}
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    className="flex-1"
                  >
                    <h3 className="text-2xl font-bold mb-2">{newsItems[activeNews].title}</h3>
                    <p className="text-muted-foreground mb-2">{newsItems[activeNews].date}</p>
                    <p className="text-lg">{newsItems[activeNews].description}</p>
                  </motion.div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50">
                  <div className="flex gap-2">
                    {newsItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveNews(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === activeNews ? 'bg-primary w-8' : 'bg-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activeNews + 1} / {newsItems.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'الإعلانات الهامة' : 'Important Announcements'}
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {announcements.map((announcement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Alert className={announcement.type === 'warning' ? 'border-warning bg-warning/5' : 'border-info bg-info/5'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{announcement.title}</AlertTitle>
                  <AlertDescription>{announcement.message}</AlertDescription>
                </Alert>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Port Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'إحصائيات الميناء' : 'Port Statistics'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar'
                ? 'مؤشرات الأداء الرئيسية للميناء'
                : 'Key performance indicators of the port'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full card-hover">
                  <CardContent className="pt-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Hierarchy Accordion */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'خدماتنا المتكاملة' : 'Our Comprehensive Services'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar'
                ? 'مجموعة شاملة من الخدمات البحرية والدعم اللوجستي'
                : 'Complete range of maritime services and logistics support'}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {serviceCategories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-md card-hover">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={category.id} className="border-0">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <category.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold text-lg">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-4">
                          {category.subcategories.map((sub, subIdx) => (
                            <div key={subIdx} className="bg-muted/30 rounded-lg p-4">
                              <h4 className="font-semibold mb-3 text-primary">{sub.title}</h4>
                              <ul className="space-y-2">
                                {sub.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section (from original) */}
      <section className="py-12 relative z-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center card-hover">
                  <CardContent className="pt-6">
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (from original) */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('landing.features')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar'
                ? 'منصة متكاملة توفر جميع الأدوات اللازمة لإدارة عمليات الميناء بكفاءة'
                : 'An integrated platform providing all the tools needed to efficiently manage port operations'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover border-0 shadow-md">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section (from original) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar' ? 'خدماتنا السريعة' : 'Our Quick Services'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar'
                ? 'نقدم مجموعة متنوعة من الخدمات الرقمية لتسهيل إجراءاتك'
                : 'We offer a variety of digital services to streamline your procedures'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover group">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-4">
                      {service.description}
                    </CardDescription>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {language === 'ar' ? 'إجراءات سريعة' : 'Fast procedures'}
                      </li>
                      <li className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {language === 'ar' ? 'تتبع مباشر' : 'Real-time tracking'}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'ar'
                ? 'ابدأ استخدام المنصة الآن'
                : 'Start Using the Platform Now'}
            </h2>
            <p className="text-xl opacity-90 mb-8">
              {language === 'ar'
                ? 'سجل حسابك واستفد من جميع الخدمات الرقمية المتاحة'
                : 'Register your account and benefit from all available digital services'}
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 gap-2"
              asChild
            >
              <Link to="/register">
                {t('nav.register')}
                <ArrowIcon className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
