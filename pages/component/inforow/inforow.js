// pages/info_row/info_row.js
//子组件  单行信息跳转按钮
const app = getApp()
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = 2019; i <= date.getFullYear() + 5; i++) {
  years.push("" + i+'年');
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i+'月');
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i+'日');
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i+'时');
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i+'分');
}
Component({
  mixins: [],
  data: {
    time: '',
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [],
    choose_year: '',
  },
  props: {
    info: {
      type: Object,//类型
      value: {
        // 名称
        name: '',
        // 值
        value: '',
        // 是否选择器
        picker:false,
        // 是否加边框
        bBorder:false,
        // 选择器类型
        selector:'selector',

        //是否显示右边更多icon
        no_show_more:'',
        // 是否替换icon
        other_icon:'',
        cant_click:false
      }//默认值
    },
  },
  didMount() {
    this.setData({
      choose_year: this.data.multiArray[0][0],
      'multiIndex':[date.getFullYear(),date.getMonth(),date.getDate()-1,date.getHours(),date.getMinutes()]
    })
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    bindPickerFn(e) {

      let val = e.detail.value == undefined ? this.data.info.value : e.detail.value;
      //这里针对输入框，判断e.detail.value（是否手动输入了值，没有输入直接赋值处理好的that.data.codes，如果输入了值，就直接使用e.detail.value）传递给父组件
      let myEventDetail = {
        val: val
      } // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', myEventDetail)

    },
    //获取时间日期
    bindMultiPickerChange: function(e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      })
      const index = this.data.multiIndex;
      const year = this.data.multiArray[0][index[0]].split('年')[0];
      const month = this.data.multiArray[1][index[1]].split('月')[0];
      const day = this.data.multiArray[2][index[2]].split('日')[0];
      const hour = this.data.multiArray[3][index[3]].split('时')[0];
      const minute = this.data.multiArray[4][index[4]].split('分')[0];
      // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
      let myEventDetail ={
        val: year + '-' + month + '-' + day + ' ' + hour + ':' + minute
      }
      this.triggerEvent('myevent', myEventDetail)
    },
    //监听picker的滚动事件
    bindMultiPickerColumnChange: function(e) {
      //获取年份
      if (e.detail.column == 0) {
        let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
        this.setData({
          choose_year
        })
      }
      //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      if (e.detail.column == 1) {
        let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
        let temp = [];
        if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
          for (let i = 1; i <= 31; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
          for (let i = 1; i <= 30; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else if (num == 2) { //判断2月份天数
          let year = parseInt(this.data.choose_year);
          if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
            for (let i = 1; i <= 29; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i);
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          } else {
            for (let i = 1; i <= 28; i++) {
              if (i < 10) {
                i = "0" + i;
              }
              temp.push("" + i);
            }
            this.setData({
              ['multiArray[2]']: temp
            });
          }
        }
      }
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      this.setData(data);
    },
  },
});
