let app = getApp();

Page({
  data:{
    showMore:false,
    pic:'pic1.jpg',
    center: [
        {
          name:"待付款",
          pic:'center1.png'
        },
        {
          name:"待收货",
          pic:'center2.png'
        },
        {
          name:"待评价",
          pic:'center3.png'
        },
        {
          name:"售后",
          pic:'center4.png'
        }],
    apply: [
      {
        name:"草稿",
        pic:'apply1.png'
      },
      {
        name:"待审批",
        pic:'center2.png'
      },
      {
        name:"驳回",
        pic:'apply3.png'
      },
      {
        name:"审批通过",
        pic:'apply4.png'
      }],
    others:[
      {
        name:"收藏夹",
        pic:'center-collect.png'
      },
      {
        name:"收货地址",
        pic:'center-address.png'
      }
    ],
    indicatorDots: true,
    autoplay: true,
    info: {
      name: '我的订单',
      value: '查看全部',
      picker: false,
      bBorder: true,
    },
    info_2: {
      name: '我的申请',
      value: '查看全部',
      picker: false,
      bBorder: true,
    },
    interval: 3000,
    show_more:false,
    imgStr3:app.globalData.imgStr3,
    tagArray:[
      {pic:'jzj.png', name:'胶粘剂'},
      {pic:'cjhxp.png', name:'车间化学品'},
      {pic:'rhj.png', name:'润滑剂'},
      {pic:'qxfx.png', name:'清洗防锈'},
      {pic:'lb.png', name:'劳保'},
      {pic:'af.png', name:'安防'},
      {pic:'qj.png', name:'清洁'},
      {pic:'sgj.png', name:'手工具'},
      {pic:'bangong.png', name:'办公'},
      {pic:'all.png', name:'全部'},

    ]
  },
  loginSystem() {

  },
  onLoad(){
    let _this = this;
    //dd.alert({content: "step1"});
  },
  see_more() {
    this.setData({
      'show_more': true
    })
  },
  showMore1(e){
    this.setData({
      showMore:!this.data.showMore
    })
  }
})
