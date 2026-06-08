# بصيرة كيو آر (Basira QR) 🛡️

ماسح رموز QR آمن ومدعوم بـ VirusTotal — تطبيق ويب تقدمي (PWA).

---

## 🌐 الرابط المباشر

**صفحة التعريف:** [islamabdelslam.github.io/Basira-Qr](https://islamabdelslam.github.io/Basira-Qr/)
**التطبيق:** [islamabdelslam.github.io/Basira-Qr/app.html](https://islamabdelslam.github.io/Basira-Qr/app.html)

---

## ✨ المميزات

- 📷 مسح رموز QR مباشرة من الكاميرا
- 🔐 فحص الروابط تلقائياً عبر VirusTotal
- 🌍 دعم العربية والإنجليزية (RTL/LTR)
- 📱 يعمل بدون اتصال بالإنترنت (PWA)
- 🎨 ثيمات متعددة وألوان قابلة للتخصيص
- 🛡️ لا يُرسَل مفتاح API إلى أي خادم — يُحفظ محلياً فقط

---

## 📲 التثبيت (Add to Home Screen)

1. افتح رابط التطبيق في **Chrome** أو **Safari**
2. اضغط على قائمة المتصفح ← **"إضافة إلى الشاشة الرئيسية"**
3. يعمل التطبيق الآن مثل أي تطبيق مثبَّت

---

## 🔑 مفتاح VirusTotal API

يحتاج التطبيق إلى مفتاح API مجاني من VirusTotal للفحص:
👉 [virustotal.com/gui/join-us](https://www.virustotal.com/gui/join-us)

المفتاح يُحفظ فقط على جهازك ولا يُرسَل لأي طرف ثالث.

---

## 🏗️ هيكل المشروع

```
docs/               ← PWA + صفحة التعريف (GitHub Pages)
  index.html        ← صفحة التعريف
  app.html          ← تطبيق PWA
  js/               ← وحدات JavaScript
  css/              ← الأنماط
  tests/            ← مجموعة الاختبارات (افتح في المتصفح)
cloudflare-worker/  ← مصدر Worker للوكيل (CORS Proxy)
  worker.js         ← كود Cloudflare Worker مع قائمة Origins المسموح بها
  README.md         ← تعليمات النشر الذاتي
```

---

## 🧪 الاختبارات

افتح `docs/tests/index.html` مباشرة في المتصفح — لا حاجة لأي تثبيت.

---

## ☁️ Cloudflare Worker

التطبيق يستخدم Worker لتجاوز قيود CORS.
لإعداد Worker خاص بك: راجع [`cloudflare-worker/README.md`](./cloudflare-worker/README.md)

---

## 📄 الرخصة

[MIT License](./LICENSE)
