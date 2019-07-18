//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';
var util = require('../../utils/who.js');
const app = getApp();
const utils = require("./../../utils/util.js");
var chart = null;

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/baseinfo/baseinfo',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    option: null,
    ec: {
      onInit: function (canvas, width, height) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        return chart;
      }
    },
    time2: "", //评估时间
    weight: "", //体重
    height: "", //身高
    head: "", //头围
    //imgUrls: [], //患者滑动卡片
    activeStyle: 0, // 激活的按钮
    activeChartInfo: 0, //下方激活的按钮
    indicatorDots: true,
    currentNum: 0, // 激活的卡片
    styleArr: [
      "WHO百分位",
      "Fenton",
      "中国九市",
      "WHO标准分(0~5)",
      "BMI-Zscores(0~5)",
      "BMI-Percentiles(0~5)",
      "CDC"
    ],
    babyInfoArr: [
      "矫正体重",
      "矫正身长",
      "矫正头围",
      "体重",
      "身长",
      "头围",
      "身高别体重"
    ],
    isAddOrDel: false
  },
  
  getphoto(e){
    console.log('++++');
    var opt = {
      x: 20,
      y: 20,
      width: 150,
      height: 100,
      destWidth: 150,
      destHeight: 100,
      canvasId: 'mychart-line',
    }
    this.canvasPhoto.canvasToTempFilePath(opt);
  },
  
  onLoad(options) {
    this.setData({
      babyId: options.id,
      isCorrent: options.week
    });
    var self = this;
    app.post(app.globalData.apis.curveData,{
      stand_type:1,
      curve_type:1,
      correct:options.week,
      baby_id:options.id
    },function(data){

      wx.showToast({
        title: "正在加载中。。",
        icon: 'loading',
        duration: 3000,
        success: (result) => {

 self.createCurve(1,data,1);
 setTimeout(() => {
  chart.setOption(self.data.option);
 }, 500);
        },
        fail: () => {},
        complete: () => {}
    });
  
      });
this.getInfo();
this.canvasPhoto = this.selectComponent('#mychart-dom-line');

// this.curveData(1,1,1);
// setTimeout(() => {
//   chart.setOption(self.data.option);
//  }, 500);
//     console.log(this.data.option);
//     console.log(chart);

  },

  showCurve(e) {
    //是否早产儿 0不是 1是，不是就没有矫正数据
    var isCorrent =  this.data.isCorrent;
    this.setData({
      activeStyle: e.target.dataset.index,
        activeChartInfo: 0
    
    });
    let style = this.data.activeStyle;
    if (style === 1 || style === 4 || style === 5) {
      this.setData({
        babyInfoArr: []
      });
    } else if (this.data.activeStyle === 2) {
      if(isCorrent){
      this.setData({
        babyInfoArr: [
          "矫正体重",
          "矫正身长",
          "矫正头围",
          "体重",
          "身长",
          "头围"
        ]
      });
      }else{
        this.setData({
          babyInfoArr: [
            "体重",
            "身长",
            "头围"
          ]
        });
      }
    } else if (style === 0 || style === 3 || style === 6) {
      if (isCorrent) {
        this.setData({
          babyInfoArr: [
            "矫正体重",
            "矫正身长",
            "矫正头围",
            "体重",
            "身长",
            "头围",
            "身长比体重"
          ]
        });
      }else{
      this.setData({
        babyInfoArr: [
          "体重",
          "身长",
          "头围",
          "身长比体重"
        ]
      });
      }
    }
    var $standType = e.target.dataset.first;
    var $correct = isCorrent;
    // if ($standType ==4){
    //     var fen = 0;
    //     if (isfenton == 0){
    //       // fentonheight();
    //         isfenton = 1;
    //         myChart.resize();
    //     }
    // }else{
    //     var fen = 1;
    //     if (isfenton==1){
    //        // whoheight();
    //         isfenton = 0;
    //         myChart.resize();
    //     }
    // }
    this.curveData($standType, 1, $correct);
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
     setTimeout(() => {
      chart.setOption(self.data.option, {
        notMerge: true,
        lazyUpdate: false,
        silent: false
      });
    }, 1000);
    setTimeout(()=>{
      wx.hideLoading()
    },2000);
  },
  showCurveType(e) {
    this.setData({
      activeChartInfo: e.target.dataset.index
    });
    var $standType = this.data.activeStyle + 1;
    var  $curveType = e.target.dataset.first;
    if(e.target.dataset.first>=7){
      $curveType = 11%(e.target.dataset.first);
    }else if(e.target.dataset.first>3){
      $curveType = (e.target.dataset.first) - 3;
    }else{
      $curveType = e.target.dataset.first;
    }
    var $correct = this.data.isCorrent;
    this.curveData($standType, $curveType, $correct);
    var self = this;
     setTimeout(() => {
      chart.setOption(self.data.option, {
        notMerge: true,
        lazyUpdate: false,
        silent: false
      });
    }, 500);
  },
  //获取曲线数据
  curveData($standType, $curveType, $correct) {
    if(this.data.isAddOrDel){
      this.setData({
        activeStyle: 0,
          activeChartInfo: 0
      
      });
    }
    var self = this;
    app.post(app.globalData.apis.curveData,{
      stand_type:$standType,
      curve_type:$curveType,
      correct:$correct,
      baby_id:self.data.babyId
    },function(data){
      if ($standType <= 4 ) {
        console.log('111');
 self.createCurve($curveType, data, $standType)

      
      } else if ($standType <=6) {
        console.log('222');
     self.bmiCurve(data, $standType)

      } else {
        console.log('333');
     self.createCDC($curveType, data, $standType)
    
      }
    });
    this.setData({
      isAddOrDel: false
    });

  },
  //生成曲线
  createCurve($curveType, $res, $standType) {
    var $opt = '';
    if ($standType == 2) {
      $opt = util.setFenton($res);
    } else {
      var yInterval = 2;
      var xInterval = 10;
      var $type = '';
      if ($curveType == 1) {
        $type = 'weight';
      } else if ($curveType == 2) {
        $type = 'height';
        yInterval = 5;
      } else if ($curveType == 3) {
        $type = 'hc';
      } else {
        $type = 'wfh';
        xInterval = 5
      }
      var $customOpt = {
        sex: $res.gender,
        title: $res.title,
        babyname: $res.baby_name,
        xOpt: {
          min: $res.x_min,
          max: $res.x_max,
          bottomInterval: 10,
          topInterval: xInterval
        },
        yOpt: {
          min: $res.y_min,
          max: $res.y_max,
          leftInterval: yInterval,
          rightInterval: 1
        },
        yFormatter: function (value, index) {
          if (index % $customOpt.yOpt.leftInterval === 0) {
            return value;
          } else {
            return '';
          }
        }
      };
      if ($standType == 3) {
        $customOpt.xOpt.bottomInterval = 1;
        $customOpt.xOpt.topInterval = 1;
        $opt = util.setOption($customOpt, $res.base_data, $res.baby_data, $type, 3);

      } else {
        if (($res.x_max - $res.x_min) < 50) {
          $customOpt.xOpt.max = $curveType == 4 ? $res.x_max : $res.x_max - 9;
          $customOpt.xOpt.bottomInterval = 5;
        } else if (($res.x_max - $res.x_min) < 100) {
          $customOpt.xOpt.max = $curveType == 4 ? $res.x_max : $res.x_max - 5;
          $customOpt.xOpt.bottomInterval = 10;
        } else {
          $customOpt.xOpt.bottomInterval = 30;
        }
        if ($curveType == 4) {
          $customOpt.xFormatter = function (value, index) {
            if (value % 5 == 0) {
              return value;
            } else {
              return '';
            }
          };
        }
        if ($standType == 1) {
          var $whotype = 1; //百分位
        } else if ($standType == 4) {
          var $whotype = 2; //标准分
        }
        $opt = util.setOption($customOpt, $res.base_data, $res.baby_data, $type, $whotype);
           
      }
    }
   // return $opt;
    this.setData({
      option: $opt
    });

  },

  //bmi曲线
  bmiCurve($res, $standType) {
    var $opt = '';
    var $customOpt = {
      sex:$res.gender,
      title: $res.title,
      babyname: $res.baby_name,
      xOpt: {
        min: $res.x_min,
        max: $res.x_max,
        bottomInterval: 1,
        topInterval: 1
      },
      yOpt: {
        min: $res.y_min,
        max: $res.y_max,
        leftInterval: 1,
        rightInterval: 0.2
      },
      yFormatter: function (value, index) {
        if (value % $customOpt.yOpt.leftInterval === 0) {
          return value;
        } else {
          return '';
        }
      },
      xFormatter: function (value, index) {
        if (value % 1 != 0) return '';
        if (value === 0) {
          return '出生';
        } else if (value % 12 === 0) {
          return (value / 12) + '岁';
        } else {
          return value;
        }
      }
    };

    $opt = util.setOption($customOpt, $res.base_data, $res.baby_data, 'bmi');
    this.setData({
      option: $opt
    });
  },
  createCDC($curveType, $res, $standType) {
    var $opt = '';
    // if ($standType == 2) {
    //   $opt = util.setFenton($res);
    // } else {
      var yInterval = 1;
      var yrightInterval = 0.5;
      var $type = '';
      var xtInterval = 1;
      var xbInterval = 1;
      if (($res.x_max - $res.x_min) > 12) {
        xtInterval = 3;
      }
      if ($curveType == 1) {
        $type = 'weight';
        yrightInterval = 0.5;
      } else if ($curveType == 2) {
        $type = 'height';
        yInterval = 5;
        yrightInterval = 2.5
      } else if ($curveType == 3) {
        $type = 'hc';
        yInterval = 2;
        yrightInterval = 1;
      } else {
        $type = 'wfh';
        xtInterval = 1;
        xbInterval = 1;

      }
      var $customOpt = {
        sex:$res.gender,
        title: $res.title,
        babyname: $res.baby_name,
        xOpt: {
          min: $res.x_min,
          max: $res.x_max,
          bottomInterval: xbInterval,
          topInterval: xtInterval
        },
        yOpt: {
          min: $res.y_min,
          max: $res.y_max,
          leftInterval: yInterval,
          rightInterval: yrightInterval
        },
        xFormatter: function (value, index) {
          if (value % xtInterval === 0) {
            return value;
          } else {
            return '';
          }
        }
      };
      $opt = util.setCDC($customOpt, $res.base_data, $res.baby_data, $type);
    // }
    this.setData({
      option: $opt
    });
  },
  //获取评估记录
  getInfo() {
    let self = this;
    let length
    if (this.data.imgUrls) {
      length = this.data.imgUrls.length
    }
    return new Promise((resolve, reject) => {
      app.post(
        app.globalData.apis.assessmentList,
        {
          baby_id: this.data.babyId
        },
        function(data) {
          let arrList = [];
          for (var i = 0; i < data.list.length; i++) {
            var date = utils.format(data.list[i].evaluation_date);
            data.list[i]["year"] = date.substr(0, 4);
            data.list[i]["md"] = date.substr(5, 5);
          }
          console.log(data);
          self.setData({
            imgUrls: data.list, //患者滑动卡片
          });
          resolve(length)
        }
      );
    });
  },
  //删除评估记录
  delInfo(e) {
    let self = this;
    app.post(app.globalData.apis.assessmentDel, {
      id: e.target.dataset.key
    }, function (data) {
      wx.showToast('删除成功');
      self.getInfo().then((length)=>{
        if (self.data.currentNum === length - 1 && length !== 1) {
          self.setData({
          currentNum: self.data.currentNum - 1 ,// 防止白屏
          isAddOrDel: true
        });
        } 
      })
     self.curveData(1, 1, 1);
    });
  },
  //添加滑动信息卡片
  confirmAdd() {
    let self = this;
    if (
      this.data.time2 === "" ||
      this.data.weight === "" ||
      this.data.height === "" ||
      this.data.head === ""
    ) {
      wx.showToast({
        title: "请将信息填写完整",
        icon: "none",
        duration: 1500,
        mask: false
      });
    } else {
      let dates = new Date(this.data.time2).getTime() / 1000;
      app.post(app.globalData.apis.assessmentAdd, {
        baby_id: this.data.babyId,
        evaluation_date: dates,
        growth_weight: this.data.weight,
        growth_height: this.data.height,
        growth_headcircle: this.data.head
      }, function (data) {
        self.getInfo().then(()=>{
          wx.pageScrollTo({
            duration: 300,
            selector: "#footScroll"
          });
        })
        self.setData({
          isAddOrDel: true
        });
        self.curveData(1, 1, 1);
      });
      // 清空数据
      this.setData({
        weight: "",
        height: "",
        head: "",
        time2: ""
      });
    }
  },
  bindTimeChange2: function (e) {
    //设置事件
    this.setData({
      //给当前time进行赋值
      time2: e.detail.value
    });
  },
  getWeight(e) {
    this.setData({
      weight: e.detail.value
    });
  },
  getHeight(e) {
    this.setData({
      height: e.detail.value
    });
  },
  getHead(e) {
    this.setData({
      head: e.detail.value
    });
   },
  changeCard(e) {
    this.setData({
      currentNum: e.detail.current
    });
  },

});
