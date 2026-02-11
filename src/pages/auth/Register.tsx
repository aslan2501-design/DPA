import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ship, Mail, Lock, Eye, EyeOff, Loader2, User, Phone, KeyRound, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, UserType } from '@/contexts/AuthContext';

const Register = () => {
  const { t, language } = useLanguage();
  const { register, verifySecurityCode, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'code' | 'details'>('code');
  const [codeVerified, setCodeVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'COMMUNITY' as UserType,
    securityCode: '',
  });

  const handleVerifyCode = async () => {
    if (!formData.securityCode) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى إدخال الكود الأمني' : 'Please enter the security code',
        variant: 'destructive',
      });
      return;
    }

    const isValid = await verifySecurityCode(formData.securityCode, formData.userType);
    
    if (isValid) {
      setCodeVerified(true);
      setStep('details');
      toast({
        title: language === 'ar' ? 'تم التحقق' : 'Verified',
        description: language === 'ar' ? 'الكود الأمني صحيح' : 'Security code is valid',
      });
    } else {
      toast({
        title: language === 'ar' ? 'كود غير صالح' : 'Invalid Code',
        description: language === 'ar' ? 'الكود الأمني غير صحيح أو مستخدم مسبقاً' : 'Security code is invalid or already used',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const success = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      userType: formData.userType,
      securityCode: formData.securityCode,
    });

    if (success) {
      toast({
        title: language === 'ar' ? 'تم إنشاء الحساب' : 'Account Created',
        description: language === 'ar' ? 'تم إنشاء حسابك بنجاح' : 'Your account has been created successfully',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: language === 'ar' ? 'فشل إنشاء الحساب' : 'Registration Failed',
        description: language === 'ar' ? 'حدث خطأ أثناء إنشاء الحساب' : 'An error occurred while creating your account',
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
            <CardTitle className="text-2xl">{t('auth.register.title')}</CardTitle>
            <CardDescription>
              {step === 'code'
                ? (language === 'ar' ? 'أدخل الكود الأمني للمتابعة' : 'Enter security code to continue')
                : (language === 'ar' ? 'أكمل بيانات حسابك' : 'Complete your account details')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'code' ? (
              <div className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label>{t('auth.register.userType')}</Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value) => setFormData({ ...formData, userType: value as UserType })}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="DPA_STAFF"
                        id="staff"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="staff"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Shield className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">{t('auth.register.staff')}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="COMMUNITY"
                        id="community"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="community"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <User className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">{t('auth.register.community')}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Security Code */}
                <div className="space-y-2">
                  <Label htmlFor="securityCode">{t('auth.register.securityCode')}</Label>
                  <div className="relative">
                    <KeyRound className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="securityCode"
                      placeholder={language === 'ar' ? 'أدخل الكود الأمني' : 'Enter security code'}
                      className="ps-10"
                      value={formData.securityCode}
                      onChange={(e) => setFormData({ ...formData, securityCode: e.target.value.toUpperCase() })}
                      dir="ltr"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar'
                      ? 'الكود الأمني يُصدر من إدارة الهيئة'
                      : 'Security code is issued by the Authority administration'}
                  </p>
                </div>

                <Button onClick={handleVerifyCode} className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    language === 'ar' ? 'تحقق من الكود' : 'Verify Code'
                  )}
                </Button>

                {/* Demo Codes */}
                <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm">
                  <p className="font-medium mb-2">
                    {language === 'ar' ? 'أكواد تجريبية:' : 'Demo Codes:'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'موظف:' : 'Staff:'} <span className="font-mono">DPA-STAFF-2025</span>
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'متعامل:' : 'Community:'} <span className="font-mono">COM-001-2025</span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('auth.register.name')}</Label>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                      className="ps-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

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
                  <Label htmlFor="phone">{t('auth.register.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01012345678"
                      className="ps-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="ps-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('code')}
                    className="flex-1"
                  >
                    {language === 'ar' ? 'رجوع' : 'Back'}
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t('auth.register.submit')
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">{t('auth.register.hasAccount')}</span>{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                {t('nav.login')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
