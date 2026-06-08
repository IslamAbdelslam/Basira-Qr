// ─────────────────────────────────────────────
//  Basira QR · i18n Module
// ─────────────────────────────────────────────

const translations = {
  en: {
    app: { name: 'BasiraQr' },
    common: { ok:'OK', cancel:'Cancel', settings:'Settings', scanAgain:'Scan Again', save:'Save', edit:'Edit' },
    setup: {
      welcome:'Welcome to BasiraQr', protect:'Protect yourself from malicious QR codes',
      getKey:'Get Free API Key', enterKey:'Enter your API Key:',
      validateContinue:'Validate & Continue', privacyTitle:'Privacy Notice',
      privacy:'Your API key is stored securely on your device only. URLs are sent to VirusTotal for analysis.'
    },
    scanner: {
      title:'Scanner', active:'🛡️ BasiraQr Active', noInternetActive:'Active (No Internet)',
      pointCamera:'Point your camera at a QR code to scan it safely',
      processing:'Checking URL security...', complete:'Scan Complete',
      grantPermission:'Grant Permission', cameraRequired:'Camera Permission Required',
      cameraMsg:'BasiraQr needs camera access to scan QR codes.',
      scansInHistory:'{count} scans in history', scanningQR:'Processing QR Code...',
      analyzingUrl:'Analyzing URL...', pleaseWait:'Please wait',
      waitingForAnalysis:'This may take a moment', noInternet:'⚠️ No internet. Limited mode.',
      noInternetBanner:'No Internet – URLs open without scanning'
    },
    results: {
      title:'Scan Results', openSafely:'🌐 Open Safely', openCaution:'⚠️ Open with Caution',
      doNotOpen:'🚨 Do Not Open', openOwnRisk:'❓ Open at Own Risk',
      share:'📤 Share Results', scanAnother:'🔄 Scan Another',
      urlInfo:'📍 URL Information', domain:'Domain:', protocol:'Protocol:',
      vendorsFlagged:'Security vendors flagged this URL',
      detailedReport:'📊 Detailed Report', securityAnalysis:'🛡️ Security Analysis',
      safeToVisit:'Safe to Visit',
      safeMessage:'This URL appears safe. No security vendors flagged it as malicious.',
      safeAction:'You can safely open this link.',
      suspiciousTitle:'Potentially Suspicious',
      suspiciousMessage:'{positives} out of {total} security vendors flagged this URL.',
      suspiciousAction:'Consider avoiding this link or verify its authenticity first.',
      maliciousTitle:'⚠️ Phishing / Dangerous URL',
      maliciousMessage:'{positives} out of {total} security vendors flagged this URL as malicious or phishing.',
      maliciousAction:'Do not open this link. It may steal your data or install malware.',
      unknownTitle:'Unknown URL', unknownMessage:"This URL was not found in VirusTotal's database.",
      unknownAction:'Proceed with caution. Consider the source before visiting.',
      httpWarning:'⚠️ This URL uses HTTP instead of HTTPS – less secure',
      scanDate:'Scan Date:', responseCode:'Response Code:', vtMessage:'VT Message:',
      viewFullReport:'View Full Report on VirusTotal',
      vendorResults:'Security Vendor Results:', clean:'Clean', malicious:'Malicious'
    },
    settings: {
      title:'Settings', subtitle:'Manage your BasiraQr preferences',
      apiKey:'API Key', currentKey:'Current: {key}', notSet:'Not set', editKey:'Edit',
      removeKey:'Remove API Key', removeKeySubtitle:'Remove current API key and reset app',
      totalScans:'Total Scans', scansCount:'{count} QR codes scanned',
      clearHistory:'Clear History', clearHistorySubtitle:'Remove all scan records',
      httpsWarning:'HTTPS Warning', httpsWarningSubtitle:'Always warn about HTTP links',
      version:'Version', versionNumber:'BasiraQr v1.5.0 PWA',
      privacyPolicy:'Privacy Policy', aboutVT:'About VirusTotal',
      madeWith:'Made with ❤️ for safer QR code scanning',
      changeApiKey:'Change API Key', pasteKey:'Paste your VirusTotal API key here',
      validating:'Validating...', getKeyFree:"Don't have an API key? Get one free",
      darkMode:'Dark Mode', darkModeSubtitle:'Choose your preferred theme',
      language:'Language', languageSubtitle:'Select app language',
      appearance:'🎨 Appearance', vtIntegration:'🔑 VirusTotal Integration',
      scanHistory:'📊 Scan History', securitySettings:'🛡️ Security Settings',
      appInfo:'ℹ️ App Information', english:'English', arabic:'العربية',
      light:'☀️ Light', dark:'🌙 Dark', system:'⚙️ System',
      urlScanning:'URL Scanning', urlScanningSubtitle:'Scan URLs with VirusTotal before opening',
      colorScheme:'Color Scheme', colorSchemeSubtitle:'Pick your accent color'
    },
    errors: {
      noInternet:'No internet connection. Scanning without VirusTotal.',
      notUrl:'Not a URL', notUrlMessage:"Scanned: {data}\n\nThis QR code doesn't contain a URL.",
      scanError:'Scan Error', scanErrorMessage:'Failed to process QR code. Please try again.',
      invalidApiKey:'Invalid API Key', invalidApiKeyMessage:'The API key you entered is not valid.',
      removeApiKeyTitle:'Remove API Key',
      removeApiKeyMessage:'Are you sure you want to remove your API key?',
      clearHistoryTitle:'Clear Scan History', clearHistoryMessage:'Clear all scan history?',
      apiKeyUpdated:'API key updated successfully!',
      dangerousUrl:'Dangerous URL',
      dangerousUrlMessage:'This URL is flagged as malicious. Open anyway?',
      openAnyway:'Open Anyway', suspiciousUrl:'Suspicious URL',
      suspiciousUrlMessage:'This URL has some flags. Proceed with caution.',
      openCarefully:'Open Carefully', enterValidKey:'Please enter a valid API key',
      corsError:'CORS blocked. VirusTotal cannot be called directly from some browsers.',
      cameraNotSupported:'Camera not supported. Please use Chrome or Safari on a device with a camera.',
      apiKeyUnverified:'Network unavailable — key saved, but your first scan will confirm it.',
      successMessage:'Done!'
    }
  },
  ar: {
    app: { name:'بصيرة كيو آر' },
    common: { ok:'حسناً', cancel:'إلغاء', settings:'الإعدادات', scanAgain:'امسح مرة أخرى', save:'حفظ', edit:'تعديل' },
    setup: {
      welcome:'مرحباً بك في بصيرة كيو آر', protect:'احمِ نفسك من رموز الاستجابة السريعة الخبيثة',
      getKey:'الحصول على مفتاح API مجاناً', enterKey:'أدخل مفتاح API:',
      validateContinue:'تحقق ثم تابع', privacyTitle:'إشعار الخصوصية',
      privacy:'يُخزَّن مفتاح API الخاص بك بشكل آمن على جهازك فقط. يتم إرسال عناوين URL إلى VirusTotal للتحليل.'
    },
    scanner: {
      title:'الماسح', active:'🛡️ بصيرة كيو آر نشط', noInternetActive:'نشط (لا يوجد إنترنت)',
      pointCamera:'وجّه الكاميرا نحو رمز QR لمسحه بأمان',
      processing:'جارٍ التحقق من أمان الرابط...', complete:'اكتمل المسح',
      grantPermission:'منح الإذن', cameraRequired:'مطلوب إذن الكاميرا',
      cameraMsg:'يحتاج بصيرة كيو آر للوصول إلى الكاميرا لمسح رموز QR.',
      scansInHistory:'{count} عملية مسح في السجل', scanningQR:'جارٍ معالجة رمز QR...',
      analyzingUrl:'جارٍ تحليل الرابط...', pleaseWait:'يرجى الانتظار',
      waitingForAnalysis:'قد يستغرق هذا بعض الوقت', noInternet:'⚠️ لا يوجد اتصال بالإنترنت.',
      noInternetBanner:'لا يوجد إنترنت - ستفتح الروابط دون مسح'
    },
    results: {
      title:'نتائج المسح', openSafely:'🌐 افتح بأمان', openCaution:'⚠️ افتح بحذر',
      doNotOpen:'🚨 لا تفتح', openOwnRisk:'❓ افتح على مسؤوليتك',
      share:'📤 مشاركة النتائج', scanAnother:'🔄 مسح آخر',
      urlInfo:'📍 معلومات الرابط', domain:'النطاق:', protocol:'البروتوكول:',
      vendorsFlagged:'جهات الأمان أشارت إلى هذا الرابط',
      detailedReport:'📊 تقرير مفصل', securityAnalysis:'🛡️ تحليل الأمان',
      safeToVisit:'آمن للزيارة',
      safeMessage:'يبدو هذا الرابط آمناً. لم تشر أي جهة أمان إلى أنه خبيث.',
      safeAction:'يمكنك فتح هذا الرابط بأمان.',
      suspiciousTitle:'مشبوه محتمل',
      suspiciousMessage:'{positives} من أصل {total} جهة أمان أشارت إلى هذا الرابط.',
      suspiciousAction:'فكر في تجنب هذا الرابط أو تحقق من صحته أولاً.',
      maliciousTitle:'⚠️ رابط تصيد احتيالي / خطير',
      maliciousMessage:'{positives} من أصل {total} جهة أمان أشارت إلى أن هذا الرابط خبيث أو تصيد احتيالي.',
      maliciousAction:'لا تفتح هذا الرابط. قد يسرق بياناتك أو يثبت برامج ضارة.',
      unknownTitle:'رابط غير معروف', unknownMessage:'لم يتم العثور على هذا الرابط في قاعدة بيانات VirusTotal.',
      unknownAction:'تابع بحذر. فكر في المصدر قبل الزيارة.',
      httpWarning:'⚠️ يستخدم هذا الرابط HTTP بدلاً من HTTPS مما يجعله أقل أماناً',
      scanDate:'تاريخ المسح:', responseCode:'رمز الاستجابة:', vtMessage:'رسالة VT:',
      viewFullReport:'عرض التقرير الكامل على VirusTotal',
      vendorResults:'نتائج جهات الأمان:', clean:'نظيف', malicious:'خبيث'
    },
    settings: {
      title:'الإعدادات', subtitle:'إدارة تفضيلات بصيرة كيو آر',
      apiKey:'مفتاح API', currentKey:'الحالي: {key}', notSet:'غير محدد', editKey:'تعديل',
      removeKey:'إزالة مفتاح API', removeKeySubtitle:'إزالة المفتاح الحالي وإعادة تعيين التطبيق',
      totalScans:'إجمالي المسح', scansCount:'{count} رمز QR تم مسحه',
      clearHistory:'مسح السجل', clearHistorySubtitle:'إزالة جميع سجلات المسح',
      httpsWarning:'تحذير HTTPS', httpsWarningSubtitle:'التحذير دائماً من روابط HTTP',
      version:'الإصدار', versionNumber:'بصيرة كيو آر 1.5.0 PWA',
      privacyPolicy:'سياسة الخصوصية', aboutVT:'حول VirusTotal',
      madeWith:'صُنع بـ ❤️ لمسح أكثر أماناً لرموز QR',
      changeApiKey:'تغيير مفتاح API', pasteKey:'الصق مفتاح VirusTotal API هنا',
      validating:'جارٍ التحقق...', getKeyFree:'ليس لديك مفتاح API؟ احصل على واحد مجاناً',
      darkMode:'الوضع الداكن', darkModeSubtitle:'اختر المظهر المفضل لديك',
      language:'اللغة', languageSubtitle:'اختر لغة التطبيق',
      appearance:'🎨 المظهر', vtIntegration:'🔑 تكامل VirusTotal',
      scanHistory:'📊 سجل المسح', securitySettings:'🛡️ إعدادات الأمان',
      appInfo:'ℹ️ معلومات التطبيق', english:'English', arabic:'العربية',
      light:'☀️ فاتح', dark:'🌙 داكن', system:'⚙️ النظام',
      urlScanning:'مسح الروابط', urlScanningSubtitle:'فحص الروابط مع VirusTotal قبل الفتح',
      colorScheme:'نظام الألوان', colorSchemeSubtitle:'اختر لون التمييز'
    },
    errors: {
      noInternet:'لا يوجد اتصال بالإنترنت. يتم الفحص بدون VirusTotal.',
      notUrl:'ليس رابط', notUrlMessage:'المحتوى الممسوح: {data}\n\nهذا الرمز لا يحتوي على رابط.',
      scanError:'خطأ في المسح', scanErrorMessage:'فشل معالجة رمز QR. يرجى المحاولة مرة أخرى.',
      invalidApiKey:'مفتاح API غير صالح', invalidApiKeyMessage:'المفتاح الذي أدخلته غير صالح.',
      removeApiKeyTitle:'إزالة مفتاح API',
      removeApiKeyMessage:'هل أنت متأكد من رغبتك في إزالة مفتاح API؟',
      clearHistoryTitle:'مسح سجل المسح', clearHistoryMessage:'مسح جميع سجلات المسح؟',
      apiKeyUpdated:'تم تحديث مفتاح API بنجاح!',
      dangerousUrl:'رابط خطير',
      dangerousUrlMessage:'تم الإشارة إلى هذا الرابط على أنه خبيث. هل تريد فتحه؟',
      openAnyway:'افتح على أي حال', suspiciousUrl:'رابط مشبوه',
      suspiciousUrlMessage:'تم الإشارة إلى هذا الرابط من قبل بعض جهات الأمان.',
      openCarefully:'افتح بحذر', enterValidKey:'يرجى إدخال مفتاح API صالح',
      corsError:'تعذر الاتصال بـ VirusTotal مباشرة من المتصفح.',
      cameraNotSupported:'الكاميرا غير مدعومة. يرجى استخدام Chrome أو Safari.',
      apiKeyUnverified:'الشبكة غير متاحة — تم حفظ المفتاح، وسيتم التأكيد عند أول فحص.',
      successMessage:'تم!'
    }
  }
};

let currentLocale = 'ar';

function t(key, vars = {}) {
  const keys = key.split('.');
  let val = translations[currentLocale];
  for (const k of keys) { val = val?.[k]; if (val === undefined) break; }
  if (val === undefined) {
    val = translations['en'];
    for (const k of keys) { val = val?.[k]; }
  }
  if (typeof val !== 'string') return key;
  return val.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

function setLocale(locale) {
  currentLocale = locale;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}

function getLocale() { return currentLocale; }

window.i18n = { t, setLocale, getLocale };
