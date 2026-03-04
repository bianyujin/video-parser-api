export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    return res.json({ success: false, message: '请提供视频链接' });
  }

  console.log('开始下载视频：', url);

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'Connection': 'keep-alive'
    };

    if (url.includes('douyin.com') || url.includes('douyinvod.com')) {
      headers['Referer'] = 'https://www.douyin.com/';
      headers['Origin'] = 'https://www.douyin.com';
    } else if (url.includes('kuaishou.com')) {
      headers['Referer'] = 'https://www.kuaishou.com/';
    } else if (url.includes('bilibili.com') || url.includes('bilivideo.com')) {
      headers['Referer'] = 'https://www.bilibili.com/';
      headers['Origin'] = 'https://www.bilibili.com';
    } else if (url.includes('xiaohongshu.com')) {
      headers['Referer'] = 'https://www.xiaohongshu.com/';
    }

    console.log('请求头：', headers);

    const response = await fetch(url, { headers });

    console.log('响应状态：', response.status);

    if (!response.ok) {
      return res.json({ 
        success: false, 
        message: `下载失败，状态码：${response.status}` 
      });
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

    const reader = response.body.getReader();
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      totalSize += value.length;
      res.write(Buffer.from(value));
      
      if (totalSize % (1024 * 1024) === 0) {
        console.log('已下载：', (totalSize / 1024 / 1024).toFixed(2) + 'MB');
      }
    }

    console.log('下载完成，总大小：', (totalSize / 1024 / 1024).toFixed(2) + 'MB');
    res.end();

  } catch (error) {
    console.error('下载错误：', error);
    return res.json({ 
      success: false, 
      message: '下载失败：' + error.message 
    });
  }
}
