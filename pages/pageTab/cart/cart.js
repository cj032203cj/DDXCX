
// pages/shopCart/shopCart.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgStr3:app.globalData.imgStr3,
    empty_info: {
      image:  'nav_cart.png',
      describle: '购物车空空如也   赶紧去添加吧',
      show_btn: true,
    },
    cart_info: {
      cart_list: [],
    },
    can_click: true,
    chose_all: false,
    totalPrice: 0,
    edit_state: true,
    chose_box: {},
    goodsAttribute: 0
  },
  to_home() {
    wx.switchTab({
      url: '/pkgHome/pages/home/home',
    })
  },
  del_cart() {
    // 删除购物车请求
    let that = this
    let least_one = false
    for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
      if (this.data.cart_info.cart_list[i].be_chosed == true) {
        least_one = true
        break
      }
    }
    if (least_one == false) {
      that.toast.showToast({
        type: 'fail',
        msg:'请选择商品'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '确认删除商品？',
        success(res) {
          if (res.confirm) {
            let del_cart = []
            for (let i = 0; i < that.data.cart_info.cart_list.length; i++) {
              if (that.data.cart_info.cart_list[i].be_chosed == true) {
                del_cart.push(that.data.cart_info.cart_list[i].cartId)
              }
            }
            app.service.httpRequest({
              url: "/cartapi/deleteCart",
              methods: "post",
              data: {
                cartId: del_cart.toString(),
              }
            }).then(function (res) {
              if (res.result == 1) {
                that.setData({
                  goodsAttribute:0
                })
                that.getCartData();
              } else {
                that.toast.showToast({
                  type: 'fail',
                  msg:res.msg
                });
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
  },
  turn_edit() {
    this.setData({
      'edit_state': !this.data.edit_state,
      'chose_all':false
    })
    this.setData({
      goodsAttribute:0
    })
    for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
      let change_data_1 = "cart_info.cart_list[" + i + "].be_chosed"
      let the_this_1 = 'chose_box.' + this.data.cart_info.cart_list[i].cartId;
      this.setData({
        [change_data_1]: false,
        [the_this_1]: false
      })
    }
    this.get_all_price()
  },
  // 全选
  chose_all() {
    for (let i in this.data.chose_box) {
      let the_this = 'chose_box.' + i
      if (this.data.chose_all == false) {
        this.setData({
          [the_this]: true
        })
      } else {
        this.setData({
          [the_this]: false
        })
      }
    }

    this.setData({
      'chose_all': !this.data.chose_all
    })
    let the_data = this.data.cart_info.cart_list
    the_data.forEach((item, index) => {
      this.data.chose_all == false ? item.be_chosed = false : item.be_chosed = true
    })
    this.setData({
      'cart_info.cart_list': the_data
    })
    this.get_all_price()
  },
  // 加法函数
  numAdd(arg1, arg2) {
    let r1, r2, m, c;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      let cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
        arg1 = Number(arg1.toString().replace(".", "")) * cm;
        arg2 = Number(arg2.toString().replace(".", ""));
      }
    } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
  },
  // 乘法函数
  numMulti(arg1, arg2) {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
      m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  },
  // 计算中价格
  get_all_price() {
    let all_price = 0;
    for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
      if (this.data.cart_info.cart_list[i].be_chosed == true) {
        all_price = this.numAdd(all_price, this.numMulti(this.data.cart_info.cart_list[i].goodsNum, parseFloat(this.data.cart_info.cart_list[i].goodsPrice)))
      }
    }
    this.setData({
      'totalPrice': all_price != 0 ? all_price.toFixed(2) : all_price
    })
  },
  to_good_detail(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    app.navigateTo('/pkgBranchHome/pages/goodsDetail/goodsDetail', {
      key: "goodsId",
      value: goodsId
    })
  },
  // 选中当前
  chose_this(e) {
    let index = e.currentTarget.dataset.index;
    let change_data = "cart_info.cart_list[" + index + "].be_chosed"
    let the_this = 'chose_box.' + this.data.cart_info.cart_list[index].cartId;
    //如果没有选择的情况下，给予选中，反之不选中
    console.log(this.data.goodsAttribute)
    if(this.data.goodsAttribute==0){
      this.setData({
        goodsAttribute:this.data.cart_info.cart_list[index].goodsAttribute
      })
    }
    if(this.data.edit_state==true){
      console.log(this.data.goodsAttribute)
      console.log(this.data.cart_info.cart_list[index].goodsAttribute)
      if (this.data.goodsAttribute == this.data.cart_info.cart_list[index].goodsAttribute) {
        // for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
        //     if (this.data.cart_info.cart_list[i].be_chosed == true && i != index) {
        //         let change_data_1 = "cart_info.cart_list[" + i + "].be_chosed"
        //         let the_this_1 = 'chose_box.' + this.data.cart_info.cart_list[i].cartId;
        //
        //     }
        //     //后续开通普通商品的时候使用
        //     // if (this.data.goodsAttribute == this.data.cart_info.cart_list[i].goodsAttribute) {
        //     //     let change_data_1 = "cart_info.cart_list[" + i + "].be_chosed"
        //     //     let the_this_1 = 'chose_box.' + this.data.cart_info.cart_list[i].cartId;
        //     //     this.setData({
        //     //         [change_data_1]: false,
        //     //         [the_this_1]: false
        //     //     })
        // }
        if(this.data.cart_info.cart_list[index].be_chosed==false){
          this.setData({
            [change_data]: !this.data.cart_info.cart_list[index].be_chosed,
            [the_this]: !this.data.cart_info.cart_list[index].be_chosed
          });
        }else{
          this.setData({
            [change_data]: !this.data.cart_info.cart_list[index].be_chosed,
            [the_this]: !this.data.cart_info.cart_list[index].be_chosed,
          });
        }
        let chose_empty=false
        for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
          // if (this.data.cart_info.cart_list[i].be_chosed == false || (i > 0 && this.data.cart_info.cart_list[i] != this.data.cart_info.cart_list[i - 1])) {
          if (this.data.cart_info.cart_list[i].be_chosed == false) {
            chose_empty=false
          } else {
            chose_empty=true
            break
          }
        }
        if(chose_empty==false){
          this.setData({
            goodsAttribute:0
          })
        }

      }else{
        this.toast.showToast({
          type: 'fail',
          msg:'套餐和门店服务类不能同时下单'
        });
      }
    }else{
      if(this.data.cart_info.cart_list[index].be_chosed==false){
        this.setData({
          [change_data]: !this.data.cart_info.cart_list[index].be_chosed,
          [the_this]: !this.data.cart_info.cart_list[index].be_chosed
        });
      }else{
        this.setData({
          [change_data]: !this.data.cart_info.cart_list[index].be_chosed,
          [the_this]: !this.data.cart_info.cart_list[index].be_chosed,
        });
      }
      let chose_empty=false
      for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
        // if (this.data.cart_info.cart_list[i].be_chosed == false || (i > 0 && this.data.cart_info.cart_list[i] != this.data.cart_info.cart_list[i - 1])) {
        if (this.data.cart_info.cart_list[i].be_chosed == false) {
          chose_empty=false
        } else {
          chose_empty=true
          break
        }
      }
      let j=0
      for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
        // if (this.data.cart_info.cart_list[i].be_chosed == false || (i > 0 && this.data.cart_info.cart_list[i] != this.data.cart_info.cart_list[i - 1])) {
        if (this.data.cart_info.cart_list[i].be_chosed == true) {
          j++
        }
      }
      if(j==this.data.cart_info.cart_list.length){
        this.setData({
          chose_all:true
        })
      }else{
        this.setData({
          chose_all:false
        })
      }
      if(chose_empty==false){
        this.setData({
          goodsAttribute:0
        })
      }
    }


    this.get_all_price()
  }
  ,
  //购物车加减方式
  cart_num_fn(e) {
    let type = e.currentTarget.dataset.type, num = 0, self = this;
    let index = e.currentTarget.dataset.index;
    //按钮减少操作
    if (type == 'reduce') {
      if (this.data.can_click) {
        this.setData({
          'can_click': false
        })
        if (this.data.cart_info.cart_list[index].goodsNum == 1) {
          this.toast.showToast({
            type: 'fail',
            msg: '宝贝不能再少了哦'
          });
          this.setData({
            'can_click': true
          })
          return false
        } else if (this.data.cart_info.cart_list[index].goodsNum > 1) {
          num = this.data.cart_info.cart_list[index].goodsNum - 1
        }
      } else {
        return false
      }
    } else if (type == 'add') {
      if (this.data.can_click) {
        this.setData({
          'can_click': false
        })
        if(this.data.cart_info.cart_list[index].goodsNum<99){
          num = this.data.cart_info.cart_list[index].goodsNum + 1
        }else{
          this.toast.showToast({
            type: 'fail',
            msg: '超过最大购买数量'
          });
          num=99
        }
      } else {
        return false
      }
    } else if (type == 'input') {
      num = parseInt(e.detail.value)
      if(num>99){
        this.toast.showToast({
          type: 'fail',
          msg: '超过最大购买数量'
        });
        num=99
      }
      let change_data = "cart_info.cart_list[" + index + "].goodsNum";
      if (isNaN(Number(e.detail.value))) {
        this.setData({
          [change_data]: this.data.cart_info.cart_list[index].prevent_num
        });
        return false
      } else {
        if (e.detail.value < 1) {
          this.setData({
            [change_data]: this.data.cart_info.cart_list[index].prevent_num
          })
          return false
        } else {

        }
      }
    }
    app.service.httpRequest({
      url: "/cartapi/updateMultiCartCount",
      methods: "post",
      data: {
        cartCountList: [{
          "cartId": this.data.cart_info.cart_list[index].cartId,
          "count": num
        }]
      },
      show_loading: 'no'
    }).then(function (res) {
      //如果加减成功了
      if (res.result == 1) {
        self.getCartData('deal');
        //如果加减失败
      } else if (res.result == 0) {
        self.toast.showToast({
          type: 'fail',
          msg:res.msg
        });
        let change_data = "cart_info.cart_list[" + index + "].goodsNum";
        self.setData({
          [change_data]: self.data.cart_info.cart_list[index].prevent_num,
          'can_click': true
        })
      }
    })
  }
  ,
  toFirmOrder() {
    let least_one = false
    for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
      if (this.data.cart_info.cart_list[i].be_chosed == true) {
        least_one = true
        break
      }
    }
    if (this.data.totalPrice == 0) {
      this.toast.showToast({
        type: 'fail',
        msg:'请选择商品'
      });
    } else {
      let deal_cart = []
      for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
        if (this.data.cart_info.cart_list[i].be_chosed == true) {
          deal_cart.push(this.data.cart_info.cart_list[i].cartId)
        }
      }
      app.navigateTo("/pkgBranchPurchase/pages/firmOrder/firmOrder", {
        key: "cartId",
        value: deal_cart.toString()
      });
    }
  }
  ,
  // 获取购物车列表数据
  getCartData(type) {
    let self = this;
    app.service.httpRequest({
      methods: "post",
      url: "/cartapi/cartList",
      data: {},
      //如果是需要不显示loading框的则加上判断，此处deal为加减购物车的，不需要显示loading
      show_loading: type == 'deal' ? 'no' : undefined,
      no_login_to_login: 'no'
    }).then(function (res) {
      self.setData({
        can_click: true,
        totalPrice: 0,
        edit_state: true
      })
      if (res.msg != '无数据') {
        //关闭页面加载弹出框
        let cartList = []
        res.data[0].list.forEach((item, index) => {
          const tableData = {};
          tableData.goodsName = item.goodsName;
          tableData.goodsAttribute = item.goodsAttribute;
          tableData.goodsImages = app.globalData.imgUrl + item.goodsImages;
          tableData.goodsPrice = item.goodsPrice;
          tableData.goodsId = item.goodsId;
          tableData.goodsNum = item.goodsNum;
          tableData.prevent_num = item.goodsNum;
          let the_this = 'chose_box.' + item.cartId;
          //如果没有选择的情况下，给予选中，反之不选中
          if (self.data.chose_box[item.cartId] != undefined) {
            tableData.be_chosed = self.data.chose_box[item.cartId];
            // tableData.be_chosed = true;
          } else {
            tableData.be_chosed = false
            self.setData({
              [the_this]: false
            })
          }
          tableData.cartId = item.cartId;
          if (item.specInfo != undefined) {
            let specInfo = item.specInfo == "" ? [] : item.specInfo.split(";"); //去掉分号
            let specInfo_box = [];  //装载规格的物品
            if (specInfo != []) {
              specInfo.splice(specInfo.length - 1, 1);
              specInfo.forEach(item_2 => {
                item_2 = item_2.split(":")[1].split("&")[0];
                specInfo_box.push(item_2);
              });
            }
            tableData.specInfo_box = specInfo_box;
            // tableData.specInfo_box = [1,2];
          } else {
            tableData.specInfo_box = ' '
          }
          cartList.push(tableData);
        })
        const final_data = {}
        final_data.cart_list = cartList
        self.setData({
          'cart_info': final_data,
          'can_click': true
        })
        for (let i = 0; i < self.data.cart_info.cart_list.length; i++) {
          if (self.data.cart_info.cart_list[i].be_chosed == false) {
            self.setData({
              'chose_all': false
            });
            break
          } else {
            self.setData({
              'chose_all': true
            })
          }
        }
        self.get_all_price()
      } else {
        self.setData({
          'cart_info.cart_list': []
        })
      }
    }).catch(function (red) {
      self.setData({
        'can_click': true
      })
    })
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
  }
  ,

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.toast = this.selectComponent("#toast");
  }
  ,

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getCartData('deal')
  }
  ,

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if(this.data.edit_state!=true){
      for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
        let change_data_1 = "cart_info.cart_list[" + i + "].be_chosed"
        let the_this_1 = 'chose_box.' + this.data.cart_info.cart_list[i].cartId;
        this.setData({
          [change_data_1]: false,
          [the_this_1]: false
        })
      }
      this.setData({
        goodsAttribute:0,
        chose_all:false
      })
    }

  }
  ,

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.edit_state!=true) {

      for (let i = 0; i < this.data.cart_info.cart_list.length; i++) {
        let change_data_1 = "cart_info.cart_list[" + i + "].be_chosed"
        let the_this_1 = 'chose_box.' + this.data.cart_info.cart_list[i].cartId;
        this.setData({
          [change_data_1]: false,
          [the_this_1]: false
        })
      }
      this.setData({
        goodsAttribute:0,
        chose_all:false
      })
    }
  }
  ,

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
  ,

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
  ,

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
