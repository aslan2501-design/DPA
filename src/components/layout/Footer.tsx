import { Ship, Mail, Phone, MapPin, Briefcase, Anchor, BookOpen, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Ship className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">
                  {language === 'ar' ? 'هيئة ميناء دمياط' : 'Damietta Port Authority'}
                </h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              {language === 'ar'
                ? 'منصة رقمية متكاملة لإدارة خدمات وعمليات ميناء دمياط باستخدام أحدث تقنيات نظم المعلومات الجغرافية'
                : 'An integrated digital platform for managing Damietta Port services and operations using the latest GIS technologies'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              {language === 'ar' ? 'روابط مهمة' : 'Important Links'}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.mts.gov.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-blue-600 transition-colors">
                    {language === 'ar' ? 'وزارة النقل' : 'Ministry of Transport'}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.imo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                    <Anchor className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-indigo-600 transition-colors">
                    {language === 'ar' ? 'المنظمة البحرية الدولية (IMO)' : 'IMO'}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.maritimeegypt.gov.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 group-hover:bg-teal-200 transition-colors">
                    <BookOpen className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-teal-600 transition-colors">
                    {language === 'ar' ? 'بنك معلومات النقل البحرى' : 'Maritime Info Bank'}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.ecomp.gov.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 group-hover:bg-amber-200 transition-colors">
                    <Shield className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-amber-600 transition-colors">
                    {language === 'ar' ? 'منظومة الشكاوى الموحدة' : 'Unified Complaints'}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {language === 'ar' ? 'دمياط، مصر' : 'Damietta, Egypt'}
                </span>
              </li>
              <li>
                <div className="flex items-start gap-2 mb-2">
                  <Phone className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-xs space-y-1">
                    <div dir="ltr">057-290071</div>
                    <div dir="ltr">057-2527901</div>
                    <div dir="ltr">057-2527902</div>
                    <div dir="ltr">057-291096</div>
                    <div dir="ltr">057-291097</div>
                    <div dir="ltr">057-291098</div>
                    <div dir="ltr">057-291099</div>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@dpa.gov.eg</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{' '}
            {language === 'ar'
              ? 'هيئة ميناء دمياط. جميع الحقوق محفوظة.'
              : 'Damietta Port Authority. All rights reserved.'}
          </p>
          <p className="mt-1 text-xs">
            © 2026 Abdou Saad – Web Developer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
