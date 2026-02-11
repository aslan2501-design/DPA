import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  KeyRound,
  Package,
  Truck,
  Wrench,
  Plus,
  Search,
  MoreHorizontal,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Admin = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const stats = [
    {
      title: language === 'ar' ? 'المستخدمين' : 'Users',
      value: '156',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: language === 'ar' ? 'طلبات المخازن' : 'Warehouse Requests',
      value: '48',
      icon: Package,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: language === 'ar' ? 'طلبات التراكى' : 'Berthing Requests',
      value: '32',
      icon: Truck,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: language === 'ar' ? 'شكاوى الصيانة' : 'Complaints',
      value: '12',
      icon: Wrench,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const users = [
    { id: '1', name: 'أحمد محمد', email: 'ahmed@dpa.gov.eg', type: 'ADMIN', status: 'active' },
    { id: '2', name: 'محمد علي', email: 'mohamed@dpa.gov.eg', type: 'DPA_STAFF', status: 'active' },
    { id: '3', name: 'سارة أحمد', email: 'sara@company.com', type: 'COMMUNITY', status: 'active' },
    { id: '4', name: 'خالد حسن', email: 'khaled@shipping.com', type: 'COMMUNITY', status: 'inactive' },
  ];

  const securityCodes = [
    { code: 'DPA-STAFF-2025', type: 'STAFF_FIXED', assignedTo: null, used: false, expiry: '2025-12-31' },
    { code: 'COM-001-2025', type: 'COMMUNITY_UNIQUE', assignedTo: 'sara@company.com', used: true, expiry: '2025-06-30' },
    { code: 'COM-002-2025', type: 'COMMUNITY_UNIQUE', assignedTo: null, used: false, expiry: '2025-06-30' },
    { code: 'COM-003-2025', type: 'COMMUNITY_UNIQUE', assignedTo: null, used: false, expiry: '2025-06-30' },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: language === 'ar' ? 'تم النسخ' : 'Copied',
      description: language === 'ar' ? 'تم نسخ الكود إلى الحافظة' : 'Code copied to clipboard',
    });
  };

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `COM-${String(Date.now()).slice(-3)}-2025`;
    toast({
      title: language === 'ar' ? 'تم إنشاء الكود' : 'Code Generated',
      description: newCode,
    });
    setGenerateDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          {language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar'
            ? 'إدارة المستخدمين والأكواد الأمنية والطلبات'
            : 'Manage users, security codes, and requests'}
        </p>
        <div className="mt-3" />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              {language === 'ar' ? 'المستخدمين' : 'Users'}
            </TabsTrigger>
            <TabsTrigger value="codes" className="gap-2">
              <KeyRound className="w-4 h-4" />
              {language === 'ar' ? 'الأكواد الأمنية' : 'Security Codes'}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</CardTitle>
                    <CardDescription>
                      {language === 'ar' ? 'عرض وإدارة حسابات المستخدمين' : 'View and manage user accounts'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder={language === 'ar' ? 'بحث...' : 'Search...'} className="ps-9 w-48" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                      <TableHead>{language === 'ar' ? 'البريد' : 'Email'}</TableHead>
                      <TableHead>{language === 'ar' ? 'النوع' : 'Type'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="font-mono text-sm">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.type === 'ADMIN'
                              ? (language === 'ar' ? 'مدير' : 'Admin')
                              : user.type === 'DPA_STAFF'
                                ? (language === 'ar' ? 'موظف' : 'Staff')
                                : (language === 'ar' ? 'متعامل' : 'Community')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status === 'active'
                              ? (language === 'ar' ? 'نشط' : 'Active')
                              : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {language === 'ar' ? 'تعديل' : 'Edit'}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                {language === 'ar' ? 'تعطيل' : 'Disable'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Codes Tab */}
          <TabsContent value="codes">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>{language === 'ar' ? 'الأكواد الأمنية' : 'Security Codes'}</CardTitle>
                    <CardDescription>
                      {language === 'ar' ? 'إدارة أكواد التسجيل للموظفين والمتعاملين' : 'Manage registration codes for staff and community'}
                    </CardDescription>
                  </div>
                  <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {language === 'ar' ? 'إنشاء كود' : 'Generate Code'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {language === 'ar' ? 'إنشاء كود أمني جديد' : 'Generate New Security Code'}
                        </DialogTitle>
                        <DialogDescription>
                          {language === 'ar'
                            ? 'اختر نوع الكود وتاريخ الانتهاء'
                            : 'Select code type and expiry date'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleGenerateCode} className="space-y-4">
                        <div className="space-y-2">
                          <Label>{language === 'ar' ? 'نوع الكود' : 'Code Type'}</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'ar' ? 'اختر النوع' : 'Select type'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="community">
                                {language === 'ar' ? 'متعامل (فريد)' : 'Community (Unique)'}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</Label>
                          <Input type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label>{language === 'ar' ? 'عدد الأكواد' : 'Number of Codes'}</Label>
                          <Input type="number" min="1" max="100" defaultValue="1" />
                        </div>
                        <Button type="submit" className="w-full">
                          {language === 'ar' ? 'إنشاء' : 'Generate'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ar' ? 'الكود' : 'Code'}</TableHead>
                      <TableHead>{language === 'ar' ? 'النوع' : 'Type'}</TableHead>
                      <TableHead>{language === 'ar' ? 'مخصص لـ' : 'Assigned To'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead>{language === 'ar' ? 'الانتهاء' : 'Expiry'}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityCodes.map((code, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{code.code}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {code.type === 'STAFF_FIXED'
                              ? (language === 'ar' ? 'موظفين' : 'Staff')
                              : (language === 'ar' ? 'متعامل' : 'Community')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {code.assignedTo || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={code.used ? 'secondary' : 'default'}>
                            {code.used
                              ? (language === 'ar' ? 'مستخدم' : 'Used')
                              : (language === 'ar' ? 'متاح' : 'Available')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{code.expiry}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyCode(code.code)}
                          >
                            {copiedCode === code.code ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div >
  );
};

export default Admin;
