Page({
  data: {
    title: '',
    price: '',
    location: '',
    contact : '',
    image: '',      // 本地临时路径，用于预览
    imageFileID: '' // 云存储文件ID，提交给数据库
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onPriceInput(e) {
    this.setData({ price: e.detail.value });
  },

  onLocationInput(e) {
    this.setData({ location: e.detail.value });
  },
  onContactInput(e) {
    this.setData({ contact : e.detail.value });
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempPath = res.tempFilePaths[0];
        this.setData({ image: tempPath });

        wx.showLoading({ title: '上传图片中...' });

        wx.cloud.uploadFile({
          cloudPath: `product_images/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`,
          filePath: tempPath,
          success: uploadRes => {
            wx.hideLoading();
            this.setData({ imageFileID: uploadRes.fileID });
            wx.showToast({ title: '图片上传成功', icon: 'success' });
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({ title: '图片上传失败', icon: 'none' });
            console.error('上传失败:', err);
          }
        });
      },
      fail: () => {
        wx.showToast({ title: '请选择图片', icon: 'none' });
      }
    });
  },

  async submit() {
    const { title, price, location, contact, imageFileID } = this.data;

    if (!title.trim()) {
      wx.showToast({ title: '请输入商品名称', icon: 'none' });
      return;
    }
    if (!price || isNaN(price)) {
      wx.showToast({ title: '请输入有效价格', icon: 'none' });
      return;
    }
    if (!location.trim()) {
      wx.showToast({ title: '请输入商品位置', icon: 'none' });
      return;
    }
    if (!contact .trim()) {
      wx.showToast({ title: '联系方式（请备注QQ/wx/电话）', icon: 'none' });
      return;
    }
    if (!imageFileID) {
      wx.showToast({ title: '请上传商品图片', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    try {
      const loginRes = await wx.cloud.callFunction({ name: 'quickstartFunctions' });
      const openid = loginRes.result.openid;

      await wx.cloud.database().collection('products').add({
        data: {
          title: title.trim(),
          price: Number(price),
          location: location.trim(),
          contact: contact.trim(),
          image: imageFileID,
          userId: openid,
          createTime: new Date(),
          status: 'available'
        }
      });

      wx.hideLoading();
      wx.showToast({ title: '发布成功', icon: 'success' });

      // 清空表单数据
      this.setData({
        title: '',
        price: '',
        location: '',
        contact: '',
        image: '',
        imageFileID: ''
      });

      // 延迟跳转首页，触发刷新
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1000);

    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
      console.error('提交失败:', err);
    }
  }
});

