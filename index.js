export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.json({
    message: '视频解析API服务运行正常',
    version: '1.0.0',
    endpoints: {
      parse: {
        method: 'GET',
        url: '/api/parse?url=视频链接',
        description: '解析视频链接'
      },
      download: {
        method: 'GET',
        url: '/api/download?url=视频链接',
        description: '下载视频'
      },
      health: {
        method: 'GET',
        url: '/api/health',
        description: '健康检查'
      }
    },
    usage: '请使用 /api/parse 或 /api/download 接口'
  });
}
