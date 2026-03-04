export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    return res.json({ success: false, message: '请提供视频链接' });
  }

  console.log('开始解析视频：', url);

  try {
    const apiUrl = `https://api.bugpk.com/api/short_videos?url=${encodeURIComponent(url)}`;
    console.log('调用API：', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API返回：', data);

    if (data && data.code === 200 && data.data) {
      const videoUrl = data.data.video_url || data.data.video || data.data.url;
      
      return res.json({
        success: true,
        data: {
          title: data.data.title || data.data.desc || '视频',
          cover: data.data.cover || data.data.cover_url || '',
          videos: [
            { quality: '超清', url: videoUrl },
            { quality: '高清', url: videoUrl },
            { quality: '标清', url: videoUrl }
          ]
        }
      });
    } else {
      return res.json({ 
        success: false, 
        message: data.message || '解析失败，请稍后重试' 
      });
    }
  } catch (error) {
    console.error('解析错误：', error);
    return res.json({ 
      success: false, 
      message: '解析失败：' + error.message 
    });
  }
}
