// app.js
App({
    onLaunch() {
      wx.cloud.init({
        env: 'cloud1-1gmi1bc370b58235', // 替换成你的云开发环境 ID
        traceUser: true
      });
    }
  });
  
