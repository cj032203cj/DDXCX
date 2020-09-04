App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
    this.globalData.corpId = options.query.corpId;
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
  globalData: {
    corpId:'',
    imgStr2:'../../assets/img/',
    imgStr3:'../../../assets/img/',
    imgStr4:'../../../../assets/img/',
  }
});
