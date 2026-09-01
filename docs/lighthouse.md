# قياسات Lighthouse

قيست على **البناء الإنتاجي المُولَّد مسبقاً (prerender)** عبر خادم ملفات ثابت على
`localhost:8081`، بـ Lighthouse 12 و Chrome headless. التقارير الخام:
`lh-ar-mobile.json` · `lh-ar-desktop.json` · `lh-en-mobile.json` · `lh-en-desktop.json`.

## النتائج

| | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| عربي — جوال | **94** | **100** | **100** | **100** | 2.9 ث | **0** |
| عربي — ديسكتوب | **100** | **100** | **100** | **100** | 0.7 ث | **0** |
| إنجليزي — جوال | **92** | **100** | **100** | **100** | 3.0 ث | **0** |
| إنجليزي — ديسكتوب | **100** | **100** | **100** | **100** | 0.7 ث | 0.001 |

المطلوب كان Performance ≥ 90 على الجوال و100 لبقية الفئات — **مُحقَّق في الحالات الأربع**.

الأداء بقي فوق الحد رغم فيديو Hero بحجم 10 MB، لأن عنصر الـLCP هو صورة الـposter
المُحمَّلة مسبقاً بـ`fetchpriority="high"`، والفيديو يأتي بعدها بـ`preload="metadata"`.

**CLS صفر:** كل صورة وفيديو يحمل `width`/`height` أو `aspect-ratio` قبل التحميل،
وللـposter نسخة أفقية وأخرى رأسية فلا يوجد قفز عند تبديل المقاس.

## ملاحظات على الأرقام المتبقية

- `uses-long-cache-ttl`: خادم الاختبار لا يضبط رؤوس التخزين المؤقت. تُضبط عند
  النشر — كل الأصول تحمل بصمة محتوى في اسمها فتصلح لـ`max-age=31536000, immutable`.
- حجم النقل مرتفع في تقرير Lighthouse لأنه يحتسب تنزيل فيديو الـHero كاملاً.
  هذه تكلفة مقصودة: البريف نصّ على عدم التضحية بجودة الـHero من أجل رقم أعلى.

## إعادة التشغيل

```bash
npm run build
npm run serve:prod        # بدون -s: المخرجات صفحات ثابتة لكل مسار

export CHROME_PATH="/path/to/chrome"
npx lighthouse@12 http://localhost:8081/ar --output=json \
  --output-path=./docs/lh-ar-mobile.json \
  --only-categories=performance,accessibility,best-practices,seo
```
