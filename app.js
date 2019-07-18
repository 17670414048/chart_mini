//app.jS

const url_pre = 'https://xinshengerke.hbb.net:4433/api'; //test
// const url_pre = 'http://api.tszh.wiwcc.com';
App({
    onLaunch: function() {
        var self = this;
        // 展示本地存储能力
        // console.log(wx.getLaunchOptionSync('1005'));
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    globalData: {
        // userInfo: null,
        loged: false,
        user_id: 0,
        source: 'mini',
        token: '',
        openid: '',
        apis: {
          login: '/growth/mini/login', //小程序登录
          babyAdd:'/growth/baby-info/add',//宝宝添加
          babyList:'/growth/baby-info/list',//宝宝列表
          assessmentList:'/growth/growth-assessment/list',//评估记录列表
          assessmentAdd:'/growth/growth-assessment/add',// 添加评估记录
          assessmentDel:'/growth/growth-assessment/delete',// 添加评估记录
          curveData:'/growth/curve/get-data'// 曲线
        }    
    },
    showError: function(msg) {
        wx.showModal({
            content: msg,
            showCancel: false,
            success: function(res) {

            }
        });
    },
    toast: function(e) {
        wx.showToast({
            title: e,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });

    },
    post: function(url, data, success, fail = null, complete = null) {
        var self = this;
        var requestObj = {
            url: url_pre + url,
            data: data,
            method: 'POST',
            dataType: 'json',
            header: {
                userid: this.globalData.user_id,
                source: this.globalData.source,
                token: this.globalData.token,
            }
        };
        requestObj.success = function(res) {
            if (res.data.result == 20009) {
                self.showError("请先登录");
                if (self.currentPage != 'pages/index/index') {
                    return wx.navigateTo({
                        url: '/pages/index/index',
                    })
                } else {
                    return self.showError("请先登录")
                }

            } else if (res.data.result != 0) {
                return self.showError(res.data.message)
            } else {
                return success(res.data.data);
            }

        };

        if (!fail) {

            fail = function(error) {
                self.showError("网络通讯失败");
                // console.log(error)
            }

        }
        requestObj.fail = function(error) {
            return fail(error)
        }
        if (!complete) {
            complete = function(event) {
                // console.log(event)
            }
        }
        wx.showLoading({
            title: "加载中...",
            mask: true,
        })
        requestObj.complete = function(event) {
            wx.hideLoading();
            return complete(event)
        };
        return wx.request(requestObj)
    },
    currentPage: function() {
        var pages = getCurrentPages();
        return pages[pages.length - 1].route;
    }
})