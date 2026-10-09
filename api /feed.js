module.exports = async (req, res) => {
  // باقي الكود كما هو تماماً
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const rawData = await response.json();

    const cleanData = rawData.slice(0, 15).map(item => ({
      id: item.id,
      title: item.title,
      url: `https://example.com/details/${item.id}`
    }));

    res.status(200).json({ success: true, count: cleanData.length, items: cleanData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

  // 1. تفعيل ترويسات CORS بالكامل للسماح لأي صفحة بطلب البيانات
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // التعامل مع طلبات التحقق المسبق (Preflight Requests)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. الرابط الخارجي المراد جلبه (مثال: بيانات تجريبية مفتوحة)
  const TARGET_API = 'https://jsonplaceholder.typicode.com/posts';

  try {
    // 3. جلب البيانات مع محاكاة متصفح حقيقي من طرف سيرفر Vercel
    const response = await fetch(TARGET_API, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Target responded with status: ${response.status}`);
    }

    const rawData = await response.json();

    // 4. تنسيق البيانات وتنقيتها قبل إرسالها للواجهة
    const cleanData = rawData.slice(0, 15).map(item => ({
      id: item.id,
      title: item.title,
      url: `https://example.com/details/${item.id}`
    }));

    // إرسال النتيجة إلى واجهتك
    res.status(200).json({ success: true, count: cleanData.length, items: cleanData });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
