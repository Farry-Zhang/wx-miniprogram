Page({
  data: {
    product: null,
    id: ''
  },

  onLoad(options) {
    this.setData({ id: options.id });
    this.loadProduct();
  },

  loadProduct() {
    const db = wx.cloud.database();
    db.collection('products').doc(this.data.id).get()
      .then(res => {
        const product = res.data;
        product.createTimeFormatted = this.formatDate(product.createTime);
        this.setData({ product });
      })
      .catch(err => {
        wx.showToast({ title: '加载商品失败', icon: 'none' });
        console.error(err);
      });
  },

  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const h = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  }
});

  