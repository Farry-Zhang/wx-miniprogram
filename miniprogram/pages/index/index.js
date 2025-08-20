Page({
  data: {
    products: []
  },

  onLoad() {
    this.loadProducts();
  },

  onShow() {
    // 返回首页时刷新数据
    this.loadProducts();
  },

  loadProducts() {
    wx.cloud.database().collection('products')
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        this.setData({
          products: res.data
        });
      })
      .catch(err => {
        wx.showToast({
          title: '加载商品失败',
          icon: 'none'
        });
        console.error(err);
      });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },

  goPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    });
  }
});
