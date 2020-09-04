let app = getApp();


//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
let domain = "http://172.26.160.40:8101";
let url = domain + '/login';

Page({
    data:{
        background: ['pic1.jpg', 'pic2.jpg', 'pic3.jpg'],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
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
    }
})
