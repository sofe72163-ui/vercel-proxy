module.exports = async (req, res) => {
  // 1. تفعيل ترويسات CORS بالكامل
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. معالجة طلبات الفحص المسبق من المتصفح (Preflight Request)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. تفعيل كاش Vercel Edge لتسريع الاستجابة وحماية السيرفر من الحظر
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  try {
    // 4. الرابط الخارجي المراد سحب البيانات منه
    const TARGET_API = 'https://jsonplaceholder.typicode.com/posts';

    // 5. إرسال الطلب مع ترويسة متصفح حقيقي
    const response = await fetch(TARGET_API, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Target responded with status: ${response.status}`);
    }

    const rawData = await response.json();

    // 6. استخراج وتنسيق أول 15 عنصراً فقط
    const cleanData = rawData.slice(0, 15).map((item) => ({
      id: item.id,
      title: item.title,
      url: `https://jsonplaceholder.typicode.com/posts/${item.id}`,
    }));

    // 7. إرسال البيانات المنسقة إلى صفحة الـ HTML
    res.status(200).json({
      success: true,
      count: cleanData.length,
      items: cleanData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
