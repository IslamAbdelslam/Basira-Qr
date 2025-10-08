import React, { useState, useEffect } from 'react';
import { Moon, Sun, Globe, Shield, Zap, Lock, Eye, Download, Github, Mail, Twitter, ChevronRight, Menu, X } from 'lucide-react';

const translations = {
  ar: {
    appName: 'بصيرة QR',
    tagline: 'امسح بذكاء، ابقَ آمنًا',
    hero: {
      subtitle: 'ماسح QR متقدم مع حماية أمنية مدمجة عبر VirusTotal',
      cta: 'حمّل الآن',
      learnMore: 'اعرف المزيد'
    },
    nav: {
      features: 'المميزات',
      screenshots: 'لقطات الشاشة',
      download: 'التحميل',
      development: 'التطوير',
      about: 'عن التطبيق'
    },
    features: {
      title: 'لماذا بصيرة QR؟',
      subtitle: 'تقنية متقدمة لحمايتك في عالم رقمي',
      list: [
        {
          title: 'مسح سريع ودقيق',
          desc: 'تقنية مسح متطورة تتعرف على جميع أنواع رموز QR بسرعة فائقة'
        },
        {
          title: 'حماية بتقنية VirusTotal',
          desc: 'فحص تلقائي للروابط والملفات قبل فتحها باستخدام أكثر من 70 محرك أمني'
        },
        {
          title: 'خصوصيتك أولوية',
          desc: 'لا نحفظ سجل مسحك الضوئي. بياناتك تبقى على جهازك فقط'
        },
        {
          title: 'تحذيرات فورية',
          desc: 'تنبيهات ذكية عند اكتشاف أي محتوى مشبوه أو خطير'
        },
        {
          title: 'سجل المسح الآمن',
          desc: 'احفظ وراجع عمليات المسح السابقة مع تقييم الأمان لكل منها'
        },
        {
          title: 'واجهة عصرية',
          desc: 'تصميم أنيق وسهل الاستخدام مع دعم الوضع الليلي'
        }
      ]
    },
    screenshots: {
      title: 'جولة في التطبيق',
      subtitle: 'تجربة استخدام سلسة وآمنة'
    },
    download: {
      title: 'ابدأ الحماية اليوم',
      subtitle: 'متوفر مجانًا على أندرويد و iOS',
      playStore: 'حمّل من Google Play',
      appStore: 'حمّل من App Store',
      comingSoon: 'قريبًا'
    },
    development: {
      title: 'رحلة التطوير',
      subtitle: 'شفافية كاملة في عملية البناء والتحديث',
      roadmap: 'خارطة الطريق',
      updates: 'آخر التحديثات',
      timeline: [
        {
          version: 'v1.0.0',
          date: 'يناير 2025',
          title: 'الإطلاق الأولي',
          features: ['مسح QR أساسي', 'تكامل VirusTotal', 'دعم الوضع الليلي']
        },
        {
          version: 'v1.1.0',
          date: 'مارس 2025',
          title: 'تحسينات الأمان',
          features: ['تحليل عميق للروابط', 'سجل المسح المحلي', 'مشاركة آمنة']
        },
        {
          version: 'v2.0.0',
          date: 'القادم',
          title: 'مميزات متقدمة',
          features: ['إنشاء QR مخصص', 'نسخ احتياطي مشفر', 'دعم البصمة الحيوية']
        }
      ]
    },
    footer: {
      tagline: 'امسح بأمان، عش باطمئنان',
      links: 'روابط سريعة',
      contact: 'تواصل معنا',
      rights: '© 2025 بصيرة QR. جميع الحقوق محفوظة.'
    }
  },
  en: {
    appName: 'Basira QR',
    tagline: 'Scan Smart, Stay Safe',
    hero: {
      subtitle: 'Advanced QR scanner with built-in security protection via VirusTotal',
      cta: 'Download Now',
      learnMore: 'Learn More'
    },
    nav: {
      features: 'Features',
      screenshots: 'Screenshots',
      download: 'Download',
      development: 'Development',
      about: 'About'
    },
    features: {
      title: 'Why Basira QR?',
      subtitle: 'Advanced technology to protect you in a digital world',
      list: [
        {
          title: 'Fast & Accurate Scanning',
          desc: 'Advanced scanning technology recognizes all QR code types with lightning speed'
        },
        {
          title: 'VirusTotal Protection',
          desc: 'Automatic link and file scanning before opening using 70+ security engines'
        },
        {
          title: 'Privacy First',
          desc: 'We don\'t store your scan history. Your data stays on your device only'
        },
        {
          title: 'Instant Alerts',
          desc: 'Smart notifications when suspicious or dangerous content is detected'
        },
        {
          title: 'Secure Scan History',
          desc: 'Save and review previous scans with security rating for each one'
        },
        {
          title: 'Modern Interface',
          desc: 'Sleek and easy-to-use design with dark mode support'
        }
      ]
    },
    screenshots: {
      title: 'App Tour',
      subtitle: 'Smooth and secure user experience'
    },
    download: {
      title: 'Start Protection Today',
      subtitle: 'Available free on Android & iOS',
      playStore: 'Get it on Google Play',
      appStore: 'Download on App Store',
      comingSoon: 'Coming Soon'
    },
    development: {
      title: 'Development Journey',
      subtitle: 'Full transparency in the building and update process',
      roadmap: 'Roadmap',
      updates: 'Latest Updates',
      timeline: [
        {
          version: 'v1.0.0',
          date: 'January 2025',
          title: 'Initial Launch',
          features: ['Basic QR scanning', 'VirusTotal integration', 'Dark mode support']
        },
        {
          version: 'v1.1.0',
          date: 'March 2025',
          title: 'Security Improvements',
          features: ['Deep link analysis', 'Local scan history', 'Secure sharing']
        },
        {
          version: 'v2.0.0',
          date: 'Coming Soon',
          title: 'Advanced Features',
          features: ['Custom QR creation', 'Encrypted backup', 'Biometric support']
        }
      ]
    },
    footer: {
      tagline: 'Scan safely, live confidently',
      links: 'Quick Links',
      contact: 'Contact Us',
      rights: '© 2025 Basira QR. All rights reserved.'
    }
  }
};

const App = () => {
  const [lang, setLang] = useState('ar');
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');
  const toggleTheme = () => setIsDark(!isDark);

  const featureIcons = [Zap, Shield, Lock, Eye, Download, Globe];

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-teal-50 text-gray-900'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 
            ? isDark ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-white/95 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://i.ibb.co/RTdkHqxC/1024T.png" 
                alt="بصيرة QR Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                {t.appName}
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {[t.nav.features, t.nav.screenshots, t.nav.download, t.nav.development].map((item, i) => (
                <a 
                  key={i}
                  href={`#${['features', 'screenshots', 'download', 'development'][i]}`}
                  className={`transition-colors hover:text-teal-400 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleLang}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden mt-4 py-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              {[t.nav.features, t.nav.screenshots, t.nav.download, t.nav.development].map((item, i) => (
                <a
                  key={i}
                  href={`#${['features', 'screenshots', 'download', 'development'][i]}`}
                  className={`block px-4 py-3 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-block animate-bounce mb-6">
            <img 
              src="https://i.ibb.co/RTdkHqxC/1024T.png"
              alt="بصيرة QR Logo"
              className="w-32 h-32 object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {t.appName}
          </h1>
          
          <p className="text-2xl md:text-3xl mb-4 font-semibold">
            {t.tagline}
          </p>
          
          <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#download"
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {t.hero.cta}
            </a>
            <a
              href="#features"
              className={`px-8 py-4 rounded-xl font-semibold border-2 ${isDark ? 'border-teal-400 hover:bg-teal-400/10' : 'border-teal-600 hover:bg-teal-50'} transition-all duration-300`}
            >
              {t.hero.learnMore}
            </a>
          </div>

          {/* Floating QR Code Animation */}
          <div className="mt-16 relative">
            <div className="w-64 h-64 mx-auto relative animate-pulse">
              <div className={`absolute inset-0 rounded-3xl ${isDark ? 'bg-gradient-to-br from-teal-500/20 to-blue-600/20' : 'bg-gradient-to-br from-teal-100 to-blue-100'} blur-3xl`}></div>
              <div className={`relative w-full h-full rounded-2xl ${isDark ? 'bg-white' : 'bg-gray-900'} p-4 shadow-2xl`}>
                <div className="grid grid-cols-8 gap-1 h-full">
                  {[...Array(64)].map((_, i) => (
                    <div
                      key={i}
                      className={`${Math.random() > 0.5 ? (isDark ? 'bg-gray-900' : 'bg-white') : (isDark ? 'bg-white' : 'bg-gray-900')} rounded-sm`}
                      style={{
                        animation: `pulse ${1 + Math.random()}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.features.title}
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.list.map((feature, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={i}
                  className={`p-8 rounded-2xl ${isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300`}
                >
                  <div className={`w-14 h-14 rounded-xl ${isDark ? 'bg-gradient-to-br from-teal-500 to-blue-600' : 'bg-gradient-to-br from-teal-400 to-blue-500'} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.screenshots.title}
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.screenshots.subtitle}
            </p>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 snap-center"
              >
                <div className={`rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} p-4 shadow-2xl`}>
                  <div className={`aspect-[9/16] rounded-2xl ${isDark ? 'bg-gradient-to-br from-teal-900/50 to-blue-900/50' : 'bg-gradient-to-br from-teal-50 to-blue-50'} flex items-center justify-center`}>
                    <Eye className={`w-16 h-16 ${isDark ? 'text-teal-400' : 'text-teal-600'} opacity-30`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-20 px-6">
        <div className="container mx-auto">
          <div className={`rounded-3xl ${isDark ? 'bg-gradient-to-br from-teal-900/30 to-blue-900/30 border border-teal-500/20' : 'bg-gradient-to-br from-teal-100 to-blue-100'} p-12 md:p-16 text-center backdrop-blur-lg shadow-2xl`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.download.title}
            </h2>
            <p className={`text-lg mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.download.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="#"
                className={`flex items-center gap-3 px-8 py-4 ${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <Download className="w-6 h-6" />
                {t.download.playStore}
              </a>
              <div className="relative">
                <a
                  href="#"
                  className={`flex items-center gap-3 px-8 py-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl font-semibold opacity-50 cursor-not-allowed`}
                >
                  <Download className="w-6 h-6" />
                  {t.download.appStore}
                </a>
                <span className={`absolute -top-3 ${isRTL ? 'left-4' : 'right-4'} px-3 py-1 ${isDark ? 'bg-teal-500' : 'bg-teal-600'} text-white text-xs rounded-full`}>
                  {t.download.comingSoon}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Section */}
      <section id="development" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.development.title}
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.development.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {t.development.timeline.map((item, i) => (
              <div
                key={i}
                className={`relative ${isRTL ? 'pr-16 border-r-4' : 'pl-16 border-l-4'} ${isDark ? 'border-teal-500' : 'border-teal-600'} pb-12 last:pb-0`}
              >
                <div className={`absolute ${isRTL ? '-right-3' : '-left-3'} top-0 w-6 h-6 rounded-full ${isDark ? 'bg-teal-500' : 'bg-teal-600'} border-4 ${isDark ? 'border-gray-900' : 'border-white'}`}></div>
                
                <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white'} rounded-2xl p-6 shadow-xl backdrop-blur-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 ${isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-700'} rounded-full text-sm font-semibold`}>
                      {item.version}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-teal-600'} flex-shrink-0 mt-0.5`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'} backdrop-blur-lg border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://i.ibb.co/RTdkHqxC/1024T.png"
                  alt="بصيرة QR Logo"
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold">{t.appName}</span>
              </div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t.footer.links}</h3>
              <ul className="space-y-2">
                {[t.nav.features, t.nav.screenshots, t.nav.download, t.nav.development].map((item, i) => (
                  <li key={i}>
                    <a href={`#${['features', 'screenshots', 'download', 'development'][i]}`} className={`${isDark ? 'text-gray-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t.footer.contact}</h3>
              <div className="flex gap-4">
                <a href="https://github.com" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} flex items-center justify-center transition-colors`}>
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:info@basiraqr.com" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} flex items-center justify-center transition-colors`}>
                  <Mail className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" className={`w-10 h-10 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} flex items-center justify-center transition-colors`}>
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;