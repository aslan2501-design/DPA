import { Link } from 'react-router-dom';
import {
  Ship,
  Menu,
  Moon,
  Sun,
  Globe,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { canSeeWarehouseRequests, canSeeHydrography } from '@/lib/rbac';

const Header = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.dashboard'), href: '/dashboard', auth: true },
    { label: t('nav.requests'), href: '/requests', auth: true },
    { label: t('nav.complaints'), href: '/complaints', auth: true },
    { label: t('nav.map'), href: '/map', auth: true },
    { label: language === 'ar' ? 'تحليل النحر والاطماء' : 'Hydrography', href: '/hydrography', auth: true },
  ];

  // Define role checks
  const isAgency = user?.classification === 'agency' || user?.email === 'agency@dpa.gov.eg';
  const isShipping = user?.classification === 'shipping' || user?.email === 'dpa-community@dpa.gov.eg';

  // Filter links based on authentication and role permissions
  const filteredLinks = navLinks.filter((link) => {
    if (!link.auth && !link.staffOnly) return true;
    if (!isAuthenticated) return false;
    if (link.staffOnly) return user?.userType === 'DPA_STAFF' || user?.userType === 'ADMIN';
    // Hide warehouse link for Maritime Agency
    if (link.href === '/requests/warehouse' && isAgency) return false;
    // Hide hydrography link for Maritime Agency and Shipping Company
    if (link.href === '/hydrography' && (isAgency || isShipping)) return false;
    // Hide hydrography link if user doesn't have permission
    if (link.href === '/hydrography' && !canSeeHydrography(user?.userType, user?.classification)) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Ship className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">
                {language === 'ar' ? 'ميناء دمياط' : 'Damietta Port'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'المنصة الذكية' : 'Smart Platform'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              <Globe className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline">{user?.fullName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  {user?.userType === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        {t('nav.admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">{t('nav.register')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'ar' ? 'right' : 'left'}>
                <nav className="flex flex-col gap-4 mt-8">
                  {filteredLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <>
                      <hr className="my-4" />
                      <Link
                        to="/login"
                        className="text-lg font-medium text-foreground hover:text-primary"
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                        to="/register"
                        className="text-lg font-medium text-foreground hover:text-primary"
                      >
                        {t('nav.register')}
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
