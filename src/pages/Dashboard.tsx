import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import {
  Package,
  Truck,
  Wrench,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Map as MapIcon,
  ShieldCheck,
  AlertCircle,
  CheckCheck,
  Plus,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import { useFeedback } from '@/contexts/FeedbackContext';
import {
  canSeeWarehouseRentalInDashboard,
  canSeeTrolleyRequestInDashboard,
  canSeeHydrography,
  getVisibleRequests,
  getVisibleComplaints,
} from '@/lib/rbac';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { requests, complaints } = useData();
  const { toast } = useToast();

  const { triggerConfetti } = useFeedback();
  const prevCount = React.useRef(requests.length + complaints.length);

  // Celebrations for specific users
  React.useEffect(() => {
    const targetEmails = ['dpa-community@dpa.gov.eg', 'agency@dpa.gov.eg'];
    if (user && targetEmails.includes(user.email.toLowerCase())) {
      const celebratedItems = JSON.parse(localStorage.getItem('celebrated_items') || '[]');
      let newCelebrations = false;

      // Check requests
      requests.forEach(req => {
        if (req.userId === user.id && req.status === 'approved' && !celebratedItems.includes(req.id)) {
          celebratedItems.push(req.id);
          newCelebrations = true;
        }
      });

      // Check complaints
      complaints.forEach(comp => {
        if (comp.userId === user.id && comp.status === 'resolved' && !celebratedItems.includes(comp.id)) {
          celebratedItems.push(comp.id);
          newCelebrations = true;
        }
      });

      if (newCelebrations) {
        localStorage.setItem('celebrated_items', JSON.stringify(celebratedItems));
        // Small delay to ensure the page is loaded
        setTimeout(() => triggerConfetti('success'), 1500);
      }
    }
  }, [requests, complaints, user, triggerConfetti]);

  React.useEffect(() => {
    const currentCount = requests.length + complaints.length;
    if (currentCount > prevCount.current) {
      toast({
        title: language === 'ar' ? 'تحديث جديد' : 'New Update',
        description: language === 'ar'
          ? 'تم استلام طلب أو شكوى جديدة'
          : 'A new request or complaint has been received',
      });
    }
    prevCount.current = currentCount;
  }, [requests.length, complaints.length, toast, language]);

  // Visible items according to RBAC
  const visibleRequests = getVisibleRequests(requests, user?.userType, user?.id, user?.classification);
  const visibleComplaints = getVisibleComplaints(complaints, user?.userType, user?.id, user?.classification);

  const stats = [
    {
      title: t('dashboard.totalRequests'),
      value: String(visibleRequests.length + visibleComplaints.length),
      icon: Package,
    },
    {
      title: t('dashboard.pending'),
      value: String(
        visibleRequests.filter((r) => r.status === 'pending').length +
        visibleComplaints.filter((c) => c.status === 'pending').length
      ),
      icon: Clock,
    },
    {
      title: t('dashboard.approved'),
      value: String(
        visibleRequests.filter((r) => r.status === 'approved').length +
        visibleComplaints.filter((c) => c.status === 'resolved').length
      ),
      icon: CheckCircle,
    },
    {
      title: t('dashboard.rejected'),
      value: String(visibleRequests.filter((r) => r.status === 'rejected').length),
      icon: XCircle,
    },
  ];

  // Calculate KPIs for Requests
  const totalRequests = visibleRequests.length;
  const warehouseRequests = visibleRequests.filter(r => r.type === 'warehouse').length;
  const trolleyRequests = visibleRequests.filter(r => r.type === 'trolley').length;
  const approvedRequests = visibleRequests.filter(r => r.status === 'approved').length;
  const rejectedRequests = visibleRequests.filter(r => r.status === 'rejected').length;
  const pendingRequests = visibleRequests.filter(r => r.status === 'pending').length;
  const inProgressRequests = visibleRequests.filter(r => r.status === 'in_progress').length;
  const requestApprovalRate = totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0;

  // Calculate KPIs for Complaints
  const totalComplaints = visibleComplaints.length;
  const highPriorityComplaints = visibleComplaints.filter(c => c.priority === 'high').length;
  const mediumPriorityComplaints = visibleComplaints.filter(c => c.priority === 'medium').length;
  const lowPriorityComplaints = visibleComplaints.filter(c => c.priority === 'low').length;
  const resolvedComplaints = visibleComplaints.filter(c => c.status === 'resolved').length;
  const inProgressComplaints = visibleComplaints.filter(c => c.status === 'in_progress').length;
  const pendingComplaints = visibleComplaints.filter(c => c.status === 'pending').length;
  const complaintResolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  const avgProcessingTime = 24;

  const recentActivity = [
    ...visibleRequests.map((r) => ({ id: `req-${r.id}`, type: r.type, title: r.title, status: r.status, date: r.date, icon: r.type === 'warehouse' ? Package : Truck })),
    ...visibleComplaints.map((c) => ({ id: `comp-${c.id}`, type: 'complaint', title: c.title, status: c.status, date: c.date, icon: Wrench })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const processStages = [
    { stage: language === 'ar' ? 'معلقة' : 'Pending', count: pendingRequests + pendingComplaints },
    { stage: language === 'ar' ? 'قيد العمل' : 'In Progress', count: inProgressRequests + inProgressComplaints },
    { stage: language === 'ar' ? 'موافق' : 'Completed', count: approvedRequests + resolvedComplaints },
    { stage: language === 'ar' ? 'مرفوضة' : 'Rejected', count: rejectedRequests },
  ];

  const getQuickActions = () => {
    const actions: Array<{ title: string; icon: any; href: string; color?: string }> = [];

    const isAgency = user?.classification === 'agency' || user?.email === 'agency@dpa.gov.eg';
    const isShipping = user?.classification === 'shipping' || user?.email === 'dpa-community@dpa.gov.eg';

    if (user?.userType === 'COMMUNITY') {
      actions.push({ title: language === 'ar' ? 'تقديم بلاغ جديد' : 'Submit New Complaint', icon: Wrench, href: '/complaints', color: 'bg-destructive' });
      actions.push({ title: language === 'ar' ? 'متابعة البلاغات' : 'Follow up Complaints', icon: Clock, href: '/complaints?tab=followup', color: 'bg-warning' });
      if (!isAgency && canSeeWarehouseRentalInDashboard(user?.userType, user?.classification)) {
        actions.push({ title: language === 'ar' ? 'تأجير مخزن' : 'Warehouse Rental', icon: Package, href: '/requests/warehouse', color: 'bg-primary' });
      }
      if (!isShipping && canSeeTrolleyRequestInDashboard(user?.userType, user?.classification)) {
        actions.push({ title: language === 'ar' ? 'طلب تراكى للسفينة' : 'Vessel Berthing', icon: Truck, href: '/requests/berthing', color: 'bg-accent' });
      }
      return actions;
    }

    if (user?.userType === 'ADMIN' || user?.userType === 'DPA_STAFF') {
      actions.push({ title: language === 'ar' ? 'التجوال الافتراضي' : 'Virtual Tour', icon: MapIcon, href: '/map', color: 'bg-emerald-600' });
      actions.push({ title: language === 'ar' ? 'إدارة الطلبات' : 'Manage Requests', icon: Package, href: '/requests', color: 'bg-primary' });
      actions.push({ title: language === 'ar' ? 'بلاغات الصيانة' : 'Maintenance Reports', icon: Wrench, href: '/complaints', color: 'bg-secondary' });
      if (!isAgency && canSeeWarehouseRentalInDashboard(user?.userType, user?.classification)) {
        actions.push({ title: language === 'ar' ? 'تأجير مخزن' : 'Warehouse Rental', icon: Package, href: '/requests/warehouse', color: 'bg-primary' });
      }
      if (!isShipping && canSeeTrolleyRequestInDashboard(user?.userType, user?.classification)) {
        actions.push({ title: language === 'ar' ? 'طلب تراكى للسفينة' : 'Vessel Berthing', icon: Truck, href: '/requests/berthing', color: 'bg-accent' });
      }
      if (canSeeHydrography(user?.userType, user?.classification)) {
        actions.push({ title: language === 'ar' ? 'تحليل النحر' : 'Erosion Analysis', icon: TrendingUp, href: '/hydrography', color: 'bg-blue-600' });
      }
      if (user?.userType === 'ADMIN') {
        actions.push({ title: language === 'ar' ? 'إدارة النظام' : 'System Administration', icon: ShieldCheck, href: '/admin', color: 'bg-slate-800' });
      }
      return actions;
    }

    actions.push({ title: language === 'ar' ? 'طلب مخزن جديد' : 'New Warehouse Request', icon: Package, href: '/requests/warehouse', color: 'bg-primary' });
    actions.push({ title: language === 'ar' ? 'طلب تراكى' : 'Berthing Request', icon: Truck, href: '/requests/berthing', color: 'bg-accent' });
    actions.push({ title: language === 'ar' ? 'شكوى صيانة' : 'Maintenance Complaint', icon: Wrench, href: '/complaints', color: 'bg-secondary' });

    return actions;
  };

  const quickActions = getQuickActions();

  const requestTypeData = [
    { name: language === 'ar' ? 'مخازن' : 'Warehouse', value: warehouseRequests, fill: '#8b5cf6' },
    { name: language === 'ar' ? 'تراكى' : 'Berthing', value: trolleyRequests, fill: '#10b981' },
  ];

  const requestStatusData = [
    { name: language === 'ar' ? 'موافق عليها' : 'Approved', value: approvedRequests, fill: '#22c55e' },
    { name: language === 'ar' ? 'معلقة' : 'Pending', value: pendingRequests, fill: '#f59e0b' },
    { name: language === 'ar' ? 'قيد العمل' : 'In Progress', value: inProgressRequests, fill: '#3b82f6' },
    { name: language === 'ar' ? 'مرفوضة' : 'Rejected', value: rejectedRequests, fill: '#ef4444' },
  ];

  const complaintPriorityData = [
    { name: language === 'ar' ? 'عالي' : 'High', value: highPriorityComplaints, fill: '#dc2626' },
    { name: language === 'ar' ? 'متوسط' : 'Medium', value: mediumPriorityComplaints, fill: '#f59e0b' },
    { name: language === 'ar' ? 'منخفض' : 'Low', value: lowPriorityComplaints, fill: '#10b981' },
  ];

  const weeklyTrendData = [
    { day: 'السبت', requests: 5, complaints: 2 },
    { day: 'الأحد', requests: 8, complaints: 3 },
    { day: 'الاثنين', requests: 6, complaints: 5 },
    { day: 'الثلاثاء', requests: 9, complaints: 4 },
    { day: 'الأربعاء', requests: 7, complaints: 3 },
    { day: 'الخميس', requests: 10, complaints: 6 },
    { day: 'الجمعة', requests: 8, complaints: 2 },
  ];

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">{language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</h1>
          <p className="text-muted-foreground mt-1">{language === 'ar' ? 'مرحبا بك في لوحة التحكم الرئيسية' : 'Welcome to your dashboard'}</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.title}>
                <CardHeader>
                  <CardTitle className="text-sm">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">{s.value}</CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section - Row 1 */}
        {(totalRequests > 0 || totalComplaints > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Type Distribution */}
            {totalRequests > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-center">{language === 'ar' ? 'توزيع الطلبات حسب النوع' : 'Request Distribution'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={requestTypeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.value}`}
                            innerRadius={80}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {requestTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `${value}`}
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #ccc', borderRadius: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-6 w-full grid grid-cols-2 gap-4">
                        {requestTypeData.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }}></div>
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-lg font-bold text-gray-800">
                                {((item.value / totalRequests) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-600 ml-auto">{item.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 w-full border-t pt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'الإجمالي' : 'Total'}</p>
                            <p className="text-xl font-bold text-blue-600">{totalRequests}</p>
                          </div>
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'الأكثر' : 'Top'}</p>
                            <p className="text-lg font-bold text-purple-600">{Math.max(...requestTypeData.map(d => d.value), 0)}</p>
                          </div>
                          <div className="p-2 bg-green-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'الأقل' : 'Min'}</p>
                            <p className="text-lg font-bold text-green-600">{Math.min(...requestTypeData.map(d => d.value), 0)}</p>
                          </div>
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'المتوسط' : 'Avg'}</p>
                            <p className="text-lg font-bold text-orange-600">{Math.round(totalRequests / requestTypeData.length)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Complaint Priority Distribution */}
            {totalComplaints > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-center">{language === 'ar' ? 'توزيع البلاغات حسب الأولوية' : 'Complaint Priority Distribution'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={complaintPriorityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.value}`}
                            innerRadius={80}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {complaintPriorityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `${value}`}
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #ccc', borderRadius: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-6 w-full grid grid-cols-3 gap-3">
                        {complaintPriorityData.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-5 h-5 rounded-full mb-2" style={{ backgroundColor: item.fill }}></div>
                            <p className="text-sm font-medium text-center">{item.name}</p>
                            <p className="text-lg font-bold text-gray-800 mt-1">
                              {((item.value / totalComplaints) * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs font-semibold text-gray-600 mt-1">{item.value} {language === 'ar' ? 'بلاغ' : 'items'}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 w-full border-t pt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-red-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'الإجمالي' : 'Total'}</p>
                            <p className="text-xl font-bold text-red-600">{totalComplaints}</p>
                          </div>
                          <div className="p-2 bg-orange-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'الأكثر أولوية' : 'Highest'}</p>
                            <p className="text-lg font-bold text-orange-600">{Math.max(...complaintPriorityData.map(d => d.value), 0)}</p>
                          </div>
                          <div className="p-2 bg-green-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'الأقل أولوية' : 'Lowest'}</p>
                            <p className="text-lg font-bold text-green-600">{Math.min(...complaintPriorityData.map(d => d.value), 0)}</p>
                          </div>
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600">{language === 'ar' ? 'المتوسط' : 'Avg'}</p>
                            <p className="text-lg font-bold text-blue-600">{Math.round(totalComplaints / complaintPriorityData.length)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Request Status - Stacked Horizontal Bar */}
        {totalRequests > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white rounded-t-xl">
                <CardTitle className="text-2xl font-bold">{language === 'ar' ? 'حالة الطلبات' : 'Request Status'}</CardTitle>
                <p className="text-sm opacity-90 mt-1">{language === 'ar' ? 'توزيع الطلبات حسب حالتها الحالية' : 'Distribution of requests by current status'}</p>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-6">
                  {requestStatusData.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      <div className="flex justify-between mb-3 items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: item.fill }}></div>
                          <span className="font-bold text-gray-800">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-700">{item.value}</span>
                          <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {((item.value / totalRequests) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-10 overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / totalRequests) * 100}%` }}
                          transition={{ delay: idx * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-500 group-hover:shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${item.fill}, ${item.fill}DD)`,
                            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), 0 5px 15px ${item.fill}40`
                          }}
                        >
                          {((item.value / totalRequests) * 100) > 10 && (
                            <span>{((item.value / totalRequests) * 100).toFixed(0)}%</span>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'الإجمالي' : 'Total'}</p>
                      <p className="text-2xl font-bold text-blue-600">{totalRequests}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}</p>
                      <p className="text-2xl font-bold text-green-600">{totalRequests > 0 ? ((approvedRequests / totalRequests) * 100).toFixed(0) : 0}%</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'المعلقة' : 'Pending'}</p>
                      <p className="text-2xl font-bold text-orange-600">{pendingRequests}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-1">{language === 'ar' ? 'المرفوضة' : 'Rejected'}</p>
                      <p className="text-2xl font-bold text-red-600">{rejectedRequests}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Weekly Trend */}
        {(totalRequests > 0 || totalComplaints > 0) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'الاتجاهات الأسبوعية' : 'Weekly Trends'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name={language === 'ar' ? 'طلبات' : 'Requests'} />
                    <Line type="monotone" dataKey="complaints" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} name={language === 'ar' ? 'بلاغات' : 'Complaints'} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Process Workflow */}
        {(totalRequests > 0 || totalComplaints > 0) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'مراحل سير العملية' : 'Process Pipeline'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {processStages.map((stage, idx) => (
                    <div key={idx} className="text-center">
                      <div className="flex justify-center mb-2">
                        {idx === 0 && <Clock className="w-10 h-10 text-orange-500" />}
                        {idx === 1 && <TrendingUp className="w-10 h-10 text-blue-500" />}
                        {idx === 2 && <CheckCircle className="w-10 h-10 text-green-500" />}
                        {idx === 3 && <XCircle className="w-10 h-10 text-red-500" />}
                      </div>
                      <h3 className="font-semibold text-sm">{stage.stage}</h3>
                      <p className="text-2xl font-bold mt-1">{stage.count}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${totalRequests + totalComplaints > 0 ? (stage.count / (totalRequests + totalComplaints)) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Performance Metrics */}
        {(totalRequests > 0 || totalComplaints > 0) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'مؤشرات الأداء' : 'Performance Metrics'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}</span>
                      <span className="text-sm font-bold">{requestApprovalRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${requestApprovalRate}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{language === 'ar' ? 'معدل الحل' : 'Resolution Rate'}</span>
                      <span className="text-sm font-bold">{complaintResolutionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${complaintResolutionRate}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{language === 'ar' ? 'متوسط وقت المعالجة' : 'Avg Processing Time'}</span>
                      <span className="text-sm font-bold">{avgProcessingTime} {language === 'ar' ? 'ساعة' : 'hrs'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <CheckCheck className="w-4 h-4" />
                      <span>{language === 'ar' ? 'وقت معالجة سريع وفعال' : 'Efficient processing time'}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{language === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}</span>
                      <span className="text-sm font-bold">
                        {totalRequests + totalComplaints > 0
                          ? Math.round(((approvedRequests + resolvedComplaints) / (totalRequests + totalComplaints)) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${totalRequests + totalComplaints > 0
                              ? Math.round(((approvedRequests + resolvedComplaints) / (totalRequests + totalComplaints)) * 100)
                              : 0
                            }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Details Section - 2×2 Grid Layout (Option 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Top: Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link to={action.href} key={action.title} className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors">
                        <div className={`p-2 rounded ${action.color ?? 'bg-slate-200'} text-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{action.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Top: Account Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === 'ar' ? 'معلومات الحساب' : 'Account Info'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ar' ? 'نوع الحساب' : 'Account Type'}</span>
                  <Badge variant="outline">
                    {user?.userType === 'ADMIN'
                      ? language === 'ar'
                        ? 'مدير'
                        : 'Admin'
                      : user?.userType === 'DPA_STAFF'
                        ? language === 'ar'
                          ? 'موظف'
                          : 'Staff'
                        : language === 'ar'
                          ? 'متعامل'
                          : 'Community'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ar' ? 'البريد' : 'Email'}</span>
                  <span className="font-mono text-xs">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{language === 'ar' ? 'الهاتف' : 'Phone'}</span>
                  <span dir="ltr">{user?.phone}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Left Column - Bottom: Requests Summary */}
          {totalRequests > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{language === 'ar' ? 'ملخص الطلبات' : 'Requests Summary'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'المخازن' : 'Warehouse'}</span>
                    <Badge variant="secondary">{warehouseRequests}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'التراكى' : 'Berthing'}</span>
                    <Badge variant="secondary">{trolleyRequests}</Badge>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-semibold">
                    <span className="text-sm">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <Badge>{totalRequests}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Right Column - Bottom: Complaints Summary */}
          {totalComplaints > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{language === 'ar' ? 'ملخص البلاغات' : 'Complaints Summary'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'عالية الأولوية' : 'High Priority'}</span>
                    <Badge className="bg-red-500">{highPriorityComplaints}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'متوسطة' : 'Medium'}</span>
                    <Badge className="bg-yellow-500">{mediumPriorityComplaints}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'منخفضة' : 'Low'}</span>
                    <Badge className="bg-green-500">{lowPriorityComplaints}</Badge>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-semibold">
                    <span className="text-sm">{language === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <Badge>{totalComplaints}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recentActivity.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-muted">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{item.title}</div>
                            <div className="text-xs text-muted-foreground">{item.type} • {item.date}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{item.status}</Badge>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
