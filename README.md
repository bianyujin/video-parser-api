# 视频解析API服务

这是一个基于Vercel的视频解析和下载代理服务，完全免费使用。

## 功能特点

- ✅ 视频解析：支持抖音、快手、B站、小红书等平台
- ✅ 视频下载：代理下载视频，绑过防盗链限制
- ✅ 完全免费：基于Vercel免费额度
- ✅ 无需维护：自动部署和扩展

## 文件结构

```
vercel-api/
├── api/
│   ├── parse.js      # 视频解析API
│   ├── download.js   # 视频下载代理API
│   └── health.js     # 健康检查API
├── vercel.json       # Vercel配置文件
├── package.json      # 项目配置
└── README.md         # 说明文档
```

## 部署步骤

### 1. 注册Vercel账号

1. 访问 https://vercel.com
2. 点击「Sign Up」
3. 选择「Continue with GitHub」
4. 授权Vercel访问你的GitHub账号

### 2. 创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名称：`video-parser-api`
3. 选择「Public」
4. 点击「Create repository」

### 3. 上传文件到GitHub

**方法一：使用GitHub网页上传**

1. 在GitHub仓库页面，点击「Add file」→「Upload files」
2. 将以下文件拖拽上传：
   - `api/parse.js`
   - `api/download.js`
   - `api/health.js`
   - `vercel.json`
   - `package.json`
   - `README.md`
3. 点击「Commit changes」

**方法二：使用Git命令行**

```bash
# 克隆仓库
git clone https://github.com/你的用户名/video-parser-api.git
cd video-parser-api

# 复制文件到仓库
# 复制所有文件到当前目录

# 提交并推送
git add .
git commit -m "初始化视频解析API"
git push origin main
```

### 4. 在Vercel导入项目

1. 登录Vercel：https://vercel.com
2. 点击「Add New...」→「Project」
3. 选择「Import Git Repository」
4. 找到 `video-parser-api` 仓库
5. 点击「Import」
6. 保持默认设置，点击「Deploy」
7. 等待部署完成（约1-2分钟）
8. 记下你的域名，如：`https://video-parser-api.vercel.app`

### 5. 测试API

在浏览器中访问：

- 健康检查：`https://你的域名.vercel.app/api/health`
- 视频解析：`https://你的域名.vercel.app/api/parse?url=视频链接`

## API使用说明

### 1. 健康检查

**请求：**
```
GET https://你的域名.vercel.app/api/health
```

**响应：**
```json
{
  "status": "ok",
  "message": "视频解析服务运行正常",
  "timestamp": "2026-03-03T14:30:00.000Z"
}
```

### 2. 视频解析

**请求：**
```
GET https://你的域名.vercel.app/api/parse?url=视频链接
```

**响应：**
```json
{
  "success": true,
  "data": {
    "title": "视频标题",
    "cover": "封面图片链接",
    "videos": [
      { "quality": "超清", "url": "视频链接" },
      { "quality": "高清", "url": "视频链接" },
      { "quality": "标清", "url": "视频链接" }
    ]
  }
}
```

### 3. 视频下载

**请求：**
```
GET https://你的域名.vercel.app/api/download?url=视频链接
```

**响应：**
直接返回视频文件流

## 小程序集成

### 1. 配置域名白名单

1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入「开发」→「开发管理」→「开发设置」
3. 找到「服务器域名」
4. 在「request合法域名」中添加：`https://你的域名.vercel.app`
5. 在「downloadFile合法域名」中添加：`https://你的域名.vercel.app`

### 2. 修改小程序代码

**修改 parseVideo 函数：**

```javascript
parseVideo() {
  const url = this.data.url.trim();
  if (!url) {
    this.setData({ error: '请输入视频链接' });
    return;
  }

  this.setData({
    loading: true,
    error: '',
    videoInfo: null
  });

  // 使用Vercel API
  wx.request({
    url: 'https://你的域名.vercel.app/api/parse',
    data: { url: url },
    method: 'GET',
    success: (res) => {
      if (res.data && res.data.success) {
        this.setData({
          loading: false,
          videoInfo: res.data.data
        });
        this.saveToHistory(res.data.data);
      } else {
        this.setData({
          loading: false,
          error: res.data.message || '解析失败'
        });
      }
    },
    fail: (err) => {
      this.setData({
        loading: false,
        error: '解析失败：' + (err.errMsg || '网络错误')
      });
    }
  });
}
```

**修改 startDownload 函数：**

```javascript
startDownload() {
  const videoUrl = this.data.videoInfo.videos[this.data.selectedQualityIndex].url;
  
  this.setData({
    downloading: true,
    downloadProgress: 0,
    error: ''
  });

  // 使用Vercel代理下载
  const proxyUrl = `https://你的域名.vercel.app/api/download?url=${encodeURIComponent(videoUrl)}`;

  this.downloadTask = wx.downloadFile({
    url: proxyUrl,
    success: (res) => {
      if (res.statusCode === 200) {
        this.saveVideoToAlbum(res.tempFilePath);
      } else {
        this.handleDownloadError(`下载失败，状态码：${res.statusCode}`);
      }
    },
    fail: (err) => {
      this.handleDownloadError(err.errMsg || '下载失败');
    }
  });

  this.downloadTask.onProgressUpdate((res) => {
    this.setData({ downloadProgress: res.progress });
  });
}
```

**修改 app.js：**

移除云开发初始化代码：

```javascript
App({
  onLaunch() {
    console.log('小程序启动');
  },
  
  globalData: {
    userInfo: null
  }
})
```

## 常见问题

### Q1: Vercel部署失败？

检查：
- 所有文件是否都已上传
- `vercel.json` 格式是否正确
- 查看Vercel部署日志

### Q2: 小程序请求失败？

检查：
- 域名是否已添加到白名单
- 域名格式是否正确（包含 https://）
- 小程序代码中的域名是否正确

### Q3: 视频下载失败？

可能原因：
- 视频源有防盗链
- 视频文件过大
- 网络问题

### Q4: 免费额度不够用？

Vercel免费额度：
- 10万次请求/月
- 100GB带宽/月
- 通常足够个人使用

## 成本说明

- ✅ Vercel：完全免费
- ✅ GitHub：完全免费
- ✅ 总成本：0元

## 技术支持

如有问题，请查看：
- Vercel部署日志
- 小程序控制台错误信息
- API响应内容

## 许可证

MIT License
