import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ship, Mail, Lock, Eye, EyeOff, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { t, language } = useLanguage();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // حسابات توضيحية للاختبار
  const demoAccounts = [
    {
      role: 'رئيس مجلس الإدارة',
      permissions: 'مشاهدة كل التقارير والطلبات والشكاوى',
      email: 'Chairman@dpa.gov.eg',
      password: 'Chairman123',
    },
    {
      role: 'مدير النظام (Admin)',
      permissions: 'صلاحيات كاملة لإدارة النظام',
      email: 'admin@dpa.gov.eg',
      password: 'admin123',
    },
    {
      role: 'موظف الهيئة (Staff)',
      permissions: 'عرض وتحرير البيانات',
      email: 'staff@dpa.gov.eg',
      password: 'staff123',
    },
    {
      role: 'جهة خارجية – شركة شحن وتفريغ',
      permissions: 'مشاهدة وتحديث بيانات الشحن',
      email: 'dpa-community@dpa.gov.eg',
      password: 'dpa-community123',
    },
    {
      role: 'توكيل ملاحي',
      permissions: 'وصول للمعلومات الملاحية ورفع المستندات',
      email: 'agency@dpa.gov.eg',
      password: 'agency123',
    },
  ];

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: language === 'ar' ? 'تم النسخ' : 'Copied',
      description: language === 'ar' ? 'تم نسخ البيانات بنجاح' : 'Data copied successfully',
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(formData.email, formData.password);

    if (success) {
      toast({
        title: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Login successful',
        description: language === 'ar' ? 'مرحباً بك في المنصة' : 'Welcome to the platform',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: language === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed',
        description: language === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Ship className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t('auth.login.title')}</CardTitle>
            <CardDescription>
              {language === 'ar'
                ? 'أدخل بيانات حسابك للوصول إلى المنصة'
                : 'Enter your credentials to access the platform'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.login.email')}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="ps-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.login.password')}</Label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="ps-10 pe-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin me-2" />
                    {language === 'ar' ? 'جاري الدخول...' : 'Signing in...'}
                  </>
                ) : (
                  t('auth.login.submit')
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{t('auth.login.noAccount')}</span>{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                {t('nav.register')}
              </Link>
            </div>

            {/* حسابات توضيحية */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-4 text-center">
                {language === 'ar' ? '🔐 حسابات توضيحية للاختبار (Demonstration Accounts)' : '🔐 Demo Accounts for Testing'}
              </p>
              
              <div className="space-y-3">
                {demoAccounts.map((account, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-muted/50 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{account.role}</p>
                        <p className="text-xs text-muted-foreground mt-1">{account.permissions}</p>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">البريد:</span>
                            <code className="text-xs bg-background px-2 py-1 rounded border border-border/50 font-mono cursor-pointer hover:bg-background/80 transition-colors"
                              onClick={() => handleCopyToClipboard(account.email, index * 2)}>
                              {account.email}
                            </code>
                            {(copiedIndex === index * 2) && (
                              <Check className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">كلمة المرور:</span>
                            <code className="text-xs bg-background px-2 py-1 rounded border border-border/50 font-mono cursor-pointer hover:bg-background/80 transition-colors"
                              onClick={() => handleCopyToClipboard(account.password, index * 2 + 1)}>
                              {account.password}
                            </code>
                            {(copiedIndex === index * 2 + 1) && (
                              <Check className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(`${account.email}`, index * 2)}
                          className="p-1.5 hover:bg-background rounded transition-colors"
                          title={language === 'ar' ? 'نسخ البريد' : 'Copy Email'}
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(account.password, index * 2 + 1)}
                          className="p-1.5 hover:bg-background rounded transition-colors"
                          title={language === 'ar' ? 'نسخ كلمة المرور' : 'Copy Password'}
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                {language === 'ar' 
                  ? '💡 يمكنك استخدام أي من الحسابات أعلاه للاختبار والتعرف على المنصة'
                  : '💡 You can use any account above for testing'}
              </p>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
