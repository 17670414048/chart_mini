//index.js
//获取应用实例
const app = getApp();
const date = (new Date()).getTime() / 1000;
const utils = require('./../../utils/util.js');
const dateformat = utils.formatDate(date, 'Y-M-D')
Page({
  data: {
    end: dateformat,
    time: "",
    male: false,
    gender: 0,
    name: "",
    gestationalWeek: "",
    searchText: '',
  },
  onLoad() {
    let self = this;
    if (!app.globalData.loged) {
      wx.login({
        success: res => {
          app.post(app.globalData.apis.login, {
              code: res.code,
              name: app.globalData.source
            },
            function(data) {
              app.globalData.user_id = data.user_id;
              app.globalData.source = data.source;
              app.globalData.token = data.token;
              app.globalData.openid = data.openid;
              app.globalData.loged = true;
              self.getList();
            })
        }
      })
    }
  },
  //搜索
  query: function(event) {
    this.getList()
    // wx.showToast({
    //   title: '正在搜索。。。',
    //   icon:'none',
    //   duration: 1000,
    // })
  },
  getList() {
    this.setData({
      list: []
    });
    let self = this;
    if (app.globalData.user_id) {
      app.post(app.globalData.apis.babyList, {
        name: this.data.searchText
      }, function(data) {
        console.log(data);
        if (data.list.length) {
          for (var i = 0; i < data.list.length; i++) {
            data.list[i]['created'] = utils.format(data.list[i].created_at);
          }
        } else {
          wx.showToast({
            title: '暂无宝宝信息',
            icon: 'none',
            duration: 1000,
          })
        }
        self.setData({
          list: data.list
        });
      });
    }
  },
  getSearch(e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getGestationalWeek(e) {
    this.setData({
      gestationalWeek: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    //设置事件
    this.setData({
      //给当前time进行赋值
      time: e.detail.value
    })
  },
  changeGender() {
    this.setData({
      male: !this.data.male,
    })

    if (this.data.male) {
      this.setData({
        gender: 1,
      })
    } else {
      this.setData({
        gender: 0,
      })
    }
  },
  goEvaluate() {
    let self = this;
    if (this.data.time === '' || this.data.name === '' || this.data.gestationalWeek === '') {
      wx.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 1000,
        mask: false,
      });
    } else {
      let dates = new Date(this.data.time).getTime() / 1000;
      let pregnant = this.data.gestationalWeek.split('+');
      app.post(app.globalData.apis.babyAdd, {
        user_id: app.globalData.user_id,
        birth_date: dates,
        pregnantweeks: pregnant[0],
        pregnantdays: pregnant[1],
        name: this.data.name,
        gender: this.data.gender,

      }, function(data) {
        setTimeout(() => {
          self.setData({
            time: "",
            male: false,
            gender: 0,
            name: "",
            gestationalWeek: "",
          });
          self.getList();
        }, 2000);
        let week = 0;
        if(data.pregnantweeks<37){
               week = 1;
        }
        wx.navigateTo({
          url: '/pages/growthrecord/growthrecord?id=' + data.id+'&week='+week
        });


      });
    }
  },
  go(e) {
    console.log(e);
    let week = 0
    if(e.currentTarget.dataset.week<37){
      week = 1;
    }
    wx.navigateTo({
      url: '/pages/growthrecord/growthrecord?id=' + e.currentTarget.dataset.id+'&week='+week
    });
  }
})