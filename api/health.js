export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.json({
    status: 'ok',
    message: '视频解析服务运行正常',
    timestamp: new Date().toISOString()
  });
}
