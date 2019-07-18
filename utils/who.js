import rpn from 'rpn.js'
//who bmi
function setOption($customOpt, $baseLine, $data, $type ,$whotype){

//网格分割线颜色
    var $splitLineOpt_1 = {
        lineStyle:{
            color:'#fff',
            width:1
        }
    };
    var $splitLineOpt_2 = {
        lineStyle:{
            color:'#000',
            width:1
        }
    };
//X、Y轴
 var $nameOpt = '';
    if($type == 'bmi' || $whotype == 3){
        var $nameOpt = {
            xName:'年龄(月)',
            yName:'体重(千克)',
            nameLocation:'middle',
            nameGap:25,
            nameTextStyle:{
                fontSize:14
            }
        };
    }else{
        var $nameOpt = {
            xName:'年龄(月)',
            yName:'体重(千克)',
            nameLocation:'middle',
            nameGap:25,
            nameTextStyle:{
                fontSize:14
            }
        };
    }
    if($whotype==3){
        var $xFormatter = function (value, index) {
            if(value === 0){
                return '出生';
            }else if(value % 12 === 0){
                return (value/12)+'岁';
            }else if(value%1 === 0){
                return value;
            }
        };
    }else{
        var $xFormatter = function (value, index) {
            if(value === 0){
                return '出生';
            }else if(value % 360 === 0){
                return (value/360)+'岁';
            }else if(value%30 == 0){
                return value/30;
            }
        };
    }

    var $yFormatter = function(value, index){
        if(index%2 === 0){
            return value;
        }else{
            return '';
        }
    };
    var $xOpt = {
        max: 13,
        min: 0,
        bottomInterval:30,
        topInterval:10
    };
    var $yOpt = {
        max: 12,
        min: 0,
        leftInterval:2,
        rightInterval:1
    };
     var $curveBgColor = '#139FDA';
    if($customOpt.sex == 1)
        $curveBgColor = '#139FDA';
    else
        $curveBgColor = 'pink';
    if($type == 'weight'){
        $nameOpt.yName = '体重(千克)';
    }else if($type == 'height'){
        $nameOpt.yName = '身长/身高(厘米)';
    }else if($type == 'hc'){
        $nameOpt.yName = '头围(厘米)';
    }else if($type == 'bmi'){
        $nameOpt.yName = 'BMI(kg/m²)'
    }else if($type == 'wfh'){
        $nameOpt.yName = '体重(千克)';
        $nameOpt.xName = '身长/身高(厘米)';
    }

    var splitLineOpt_1 = ($customOpt.splitLineOpt_1 != undefined) ? $customOpt.splitLineOpt_1 : $splitLineOpt_1;
    var splitLineOpt_2 = ($customOpt.splitLineOpt_2 != undefined) ? $customOpt.splitLineOpt_2 : $splitLineOpt_2;
    var nameOpt = ($customOpt.nameOpt != undefined) ? $customOpt.nameOpt : $nameOpt;
    var xFormatter = ($customOpt.xFormatter != undefined) ? $customOpt.xFormatter : $xFormatter;
    var yFormatter = ($customOpt.yFormatter != undefined) ? $customOpt.yFormatter : $yFormatter;
    var xOpt = ($customOpt.xOpt != undefined) ? $customOpt.xOpt : $xOpt;
    var yOpt = ($customOpt.yOpt != undefined) ? $customOpt.yOpt : $yOpt;

    var len = $baseLine.length;
    var seriesData = new Array();
    var legendData = new Array();

    for(var i = 0; i < len; i++){
        var $tmpMark = {};
        if($type == 'bmi' && len >= 10 && i < (len/2)){
            $tmpMark = {};
        }else{
            $tmpMark ={
                symbol:'circle',
                symbolSize:1,
                label:{
                     normal:{
                        show:true,
                        formatter:$baseLine[i].key,
                        color:'#000',
                        position:'inside',
                        padding:[0,0,0,30]

                     }
                },
                data:[
                    {
                        type:'max',
                        valueIndex:0
                    }
                ]
            };
        }
        legendData.push($baseLine[i].key);
        seriesData.push(
            {
                name:$baseLine[i].key,
                type:'line',
                smooth:true,
                data:$baseLine[i].value,
                showSymbol:false,
                markPoint: $tmpMark
            }
        );
    }
    //去除X Y轴上的坐标系外面的点
    $data = removeX($data,xOpt.min);
    $data = removeY($data,yOpt.min);


    if($data.length > 0){
        seriesData.push(
            {
                name: $customOpt.babyname,
                type:'line',
                showSymbol:true,
                symbolSize:function (val) {
                    if(val[2] == ''&&val[0]==0){
                        return 0;
                    }else{
                        return 12;
                    }
                },
                clipOverflow:true,
                itemStyle : {
                    normal : {
                        color:"blue",
                        lineStyle:{
                            normal:{
                                color:'blue',
                                width:1
                            }
                        },
                    }
                },
                tooltip:{
                    trigger: 'item',
                    formatter:function(param){
                        var str = '';
                        console.log(param);
                        var showvalue = $whotype == 3||$type=='wfh'?param.value[0]:(param.value[0])/30;
                        str = $customOpt.babyname+"\n"+$nameOpt.xName+'：'+showvalue.toFixed(1)+'\n'+$nameOpt.yName+'：'+(param.value[1])+'\n日期：'+(param.value[3]);

                        return str;
                    },
                    position: function (pos, params, dom, rect, size) {
                        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                        var obj = {top: pos[1]};
                         if(pos[0] > size.viewSize[0] / 2){

                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]-120;
                         }else{
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = size.viewSize[0] - pos[0]-140;
                         }
                        return obj;
                    },
                },
                data:$data
            }
        );
        legendData.push($customOpt.babyname);
    }
    return {
        textStyle:{
            color:'#fff'
        },
        backgroundColor: $curveBgColor,
        title: {
            text: $customOpt.title,
            left:'center',
            top:10,
            // bottom:15,
            right:'auto',
            textStyle:{
                color:'#fff',
                fontWeight :600,
                fontSize:16
            }
        },
        tooltip : {
            show:true,
        },
        dataZoom : {
            type:"inside"
        },
        grid: {
            left: '6%',
            right: '6%',
            bottom: '10%',
            containLabel: true,
            show:true,
            backgroundColor:'#fff'

        },
        xAxis : [
            {
                type : 'value',
                boundaryGap : false,
                interval:xOpt.bottomInterval,
                splitLine:splitLineOpt_1,
                name:nameOpt.xName,
                nameLocation:nameOpt.nameLocation,
                nameGap:nameOpt.nameGap,
                nameTextStyle:nameOpt.nameTextStyle,
                min:xOpt.min,
                max:xOpt.max,
                axisLabel:{
                    formatter:xFormatter

                },
                z:1
            },
            {
                type:'value',
                min:xOpt.min,
                max:xOpt.max,
                interval:xOpt.topInterval,
                splitLine:splitLineOpt_2,
                axisTick:{
                    show:true
                },

                axisLabel:{
                    show:false

                },
                z:2

            }
        ],
        yAxis : [
            {
                type : 'value',
                min:yOpt.min,
                max:yOpt.max,
                position:'left',
                splitLine:splitLineOpt_2,
                interval:yOpt.leftInterval,
                name:nameOpt.yName,
                nameLocation:nameOpt.nameLocation,
                nameGap:nameOpt.nameGap,
                nameTextStyle:nameOpt.nameTextStyle,
                z:2
            },
            {
                type:'value',
                min:yOpt.min,
                max:yOpt.max,
                position:'right',
                interval:yOpt.rightInterval,
                splitLine:splitLineOpt_1,
                axisLabel:{
                    show:true,
                    formatter:yFormatter
                },
                axisTick:{
                    show:false
                },
                z:1
            },

        ],
        series : seriesData
    };
}




//fenton
function setFenton($data){

    var $tag = $data.gender == 0 ? 'Girls' : 'Boys';
    var $nameGapX = 20;
    var $nameGapY = 30;
    var $curveBgColor = '#fff';
 
    var $wlen = $data.base_data.weight.length;
    var $hlen = $data.base_data.height.length;
    var $hclen = $data.base_data.hc.length;
    var $wbaseLine = $data.base_data.weight;
    var $hbaseLine = $data.base_data.height;
    var $hcbaseLine = $data.base_data.hc;
    var seriesData = new Array();
    for(var i = 0; i < $wlen; i++){
        seriesData.push(
            {
                name:$wbaseLine[i].key,
                type:'line',
                smooth:true,
                data:$wbaseLine[i].value,
                showSymbol:true,
                symbolSize:0.01,
                xAxisIndex: 1,
                yAxisIndex: 1,
                clipOverflow:true,
                markPoint:{
                    symbol:'circle',
                    symbolSize:0.5,
                    label:{
                        normal:{
                            show:true,
                            formatter:$wbaseLine[i].key,
                            color:'#000',
                            position:'inside',
                            fontSize: 8,
                            backgroundColor:'#fff'
                        }
                    },
                    data:[
                        {
                            type:'average'
                        }
                    ]
                },
                lineStyle:lineTypeOpt($wbaseLine[i].key),
                label:labelOpt('weight', 40, 80)
            }
        );
    }
    for(var i = 0; i < $hlen; i++){
        seriesData.push(
            {
                name:$hbaseLine[i].key,
                type:'line',
                smooth:true,
                data:$hbaseLine[i].value,
                showSymbol:true,
                symbolSize:0.01,
                xAxisIndex: 2,
                yAxisIndex: 2,
                clipOverflow:true,
                markPoint:{
                    symbol:'circle',
                    symbolSize:0.5,
                    label:{
                        normal:{
                            show:true,
                            formatter:$hbaseLine[i].key,
                            color:'#000',
                            position:'inside',
                            fontSize:8,
                            backgroundColor:'#fff'
                        }
                    },
                    data:[
                        {
                            type:'average'
                        }
                    ]
                },
                lineStyle:lineTypeOpt($hbaseLine[i].key),
                label:labelOpt('height', 28, 80)
            }
        );
    }
    for(var i = 0; i < $hclen; i++){
        seriesData.push(
            {
                name:$hcbaseLine[i].key,
                type:'line',
                smooth:true,
                data:$hcbaseLine[i].value,
                showSymbol:true,
                symbolSize:0.01,
                xAxisIndex: 2,
                yAxisIndex: 2,
                clipOverflow:true,
                markPoint:{
                    symbol:'circle',
                    symbolSize:0.5,
                    label:{
                        normal:{
                            show:true,
                            formatter:$hcbaseLine[i].key,
                            color:'#000',
                            position:'inside',
                            fontSize:8,
                            backgroundColor:'#fff'
                        
                        }
                    },
                    data:[
                        {
                            type:'average'
                        }
                    ]
                },
                lineStyle:lineTypeOpt($hcbaseLine[i].key),
                label:labelOpt('hc', 28, 80)
            }
        );
    }




    //去除X Y轴上的坐标系外面的点
    $data.baby_data.weight = removeX($data.baby_data.weight,22);
    $data.baby_data.weight = removeY($data.baby_data.weight,0);

    $data.baby_data.height = removeX( $data.baby_data.height ,22);
    $data.baby_data.height  = removeY( $data.baby_data.height ,0);

    $data.baby_data.hc = removeX( $data.baby_data.hc,22);
    $data.baby_data.hc = removeY( $data.baby_data.hc,0);

    seriesData.push(
        {
            name: 'weight',
            type:'line',
            showSymbol:true,
            symbolSize:10,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle:{
                normal:{
                    color:'blue',
                    width:2
                }

            },
            tooltip:{
                trigger: 'item',
                formatter:function(param){
                    var str = '';
                    str = $data.baby_name+ '\n胎龄：'+(param.value[0])+' 周 \n体重:'+(param.value[1])+' (kg)';
                    return str;
                },
                position: function (pos, params, dom, rect, size) {
                    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                    var obj = {top: pos[1]};
                     if(pos[0] > size.viewSize[0] / 2){

                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]-120;
                     }else{
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = size.viewSize[0] - pos[0]-140;
                     }
                    return obj;
                },
            },
            data:$data.baby_data.weight
        }
    );

    seriesData.push(
        {
            name: 'height',
            type:'line',
            showSymbol:true,
            symbolSize:10,
            xAxisIndex: 2,
            yAxisIndex: 2,
            clipOverflow:false,
            lineStyle:{
                normal:{
                    color:'blue',
                    width:2
                }

            },
            tooltip:{
                trigger: 'item',
                formatter:function(param){
                    var str = '';
                    var str = $data.baby_name+ '\n胎龄：'+(param.value[0])+' 周\n身高：'+(param.value[1])+' 厘米';
                    return str;
                },
                position: function (pos, params, dom, rect, size) {
                    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                    var obj = {top: pos[1]};
                     if(pos[0] > size.viewSize[0] / 2){

                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]-120;
                     }else{
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = size.viewSize[0] - pos[0]-140;
                     }
                    return obj;
                },
            },
            data:$data.baby_data.height
        }
    );
    seriesData.push(
        {
            name: 'hc',
            type:'line',
            showSymbol:true,
            symbolSize: 10,
            xAxisIndex: 2,
            yAxisIndex: 2,
            lineStyle:{
                normal:{
                    color:'blue',
                    width:2
                }
            },
            tooltip:{
                trigger: 'item',
                formatter:function(param){
                    var str = '';
                    var str = $data.baby_name+ '\n胎龄：'+(param.value[0])+' 周\n头围：'+(param.value[1])+'  厘米\n';
                    return str;
                },
                position: function (pos, params, dom, rect, size) {
                    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                    var obj = {top: pos[1]};
                     if(pos[0] > size.viewSize[0] / 2){

                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]-120;
                     }else{
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = size.viewSize[0] - pos[0]-140;
                     }
                    return obj;
                },
            },
            data:$data.baby_data.hc
        }
    );
 
    return  {
        title: [{
            text: $data.title || 'Fenton',
            x: 'center',
            y: 0,
        },
        {
            text: $tag,
            top:'50%',
            left:'10%',
            textStyle:{
                fontSize:40,
                color:'#CAD2DE',
                textBorderWidth:2,
                textBorderColor:'#000'
            },
        }],
        backgroundColor: $curveBgColor,
            // animation:false,
            // addDataAnimation:false,
            // animationThreshold:0,
        grid: [
            {x: '7%', y: '7%', width: '80%', height: '85%',left:'12%',right:'5%'},
            {x: '7%', y: '7%', width: '80%', height: '85%',left:'12%',right:'5%'},
            {x: '7%', y: '7%', width: '80%', height: '85%',left:'12%',right:'5%'},
            {x: '7%', y: '7%', width: '80%', height: '85%',left:'12%',right:'5%'},
            {x: '7%', y: '7%', width: '80%', height: '85%',left:'12%',right:'5%'},
            {x: '7%', y: '7%', width: '80%', height: '85%',left:'12%',right:'5%'},
        ],
            tooltip : {
                show:true,
            },
        xAxis: [
            {
                gridIndex: 0,
                min: 22,
                max: 50.5,
                interval:2,
                axisTick:{
                    inside:true
                },
                axisLabel:{
                    show:false,

                },
                splitLine:{
                    show:false
                },
                name:'Gestational age(weeks)',
                nameLocation:'middle',
                nameGap:$nameGapX

            },
            {
                gridIndex: 1,
                min: 22,
                max: 50.5,
                interval:2,
                axisLabel:{
                    show:true,
                    formatter:function(value, index){

                        if(value % 2 === 0){
                            return value;
                        }else{
                            return '';
                        }
                    }
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:true
                },
                z:0
            },
            {
                gridIndex: 2,
                min: 22,
                max: 50.5,
                interval:2,
                axisLabel:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                }
            },
            {
                type:'category',
                gridIndex: 3,

                axisLabel:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:true,
                    interval:function(index, val){
                        if(index % 2 ===0){
                            return true;
                        }else{
                            return false;
                        }
                    },
                    lineStyle:{
                        color:['#000']
                    }
                }
            },
            {
                gridIndex: 4,
                min: 22,
                max: 50.5,
                interval:2,
                axisLabel:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                }
            },
            {
                gridIndex: 5,
                min: 22,
                max: 50.5,
                interval:2,
                axisLabel:{
                    show:false
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                }
            }
        ],
        yAxis: [
            {
                gridIndex: 0,
                min: 0,
                max: 90,
                interval:1,
                axisTick:{
                    inside:true
                },
                axisLabel:{
                    show:false
                }

            },
            {
                gridIndex: 1,
                min: 0,
                max:9,
                position:'left',
                interval:0.5,
                axisTick:{
                    show:false,

                },
                axisLabel:{
                    formatter:function(value, index){
                        if(value > 3.5){
                            return '';
                        }else{
                            return value;
                        }
                    }
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:['#000']
                    }
                },
                name:'Weight(kilograms)',
                nameLocation:'middle',
                nameGap:$nameGapY,
                nameTextStyle:{
                    padding:[0, 350, 0, 0]
                },
                z:1
            },
            {
                gridIndex: 2,
                min: -25,
                max: 65,
                position:'left',
                interval:5,
                axisLabel:{
                    show:true,
                    formatter:function(value, index){
                        if(value >= 15){
                            return value;
                        }else{
                            return '';
                        }
                    }
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                },
                name:'Centimeters',
                nameLocation:'middle',
                nameGap:$nameGapY,
                nameTextStyle:{
                    padding:[0, 0, 0, 300]
                },

            },
            {
                gridIndex: 3,
                min: -25,
                max: 65,
                interval:5,
                axisLabel:{
                    show:true,
                    formatter:function(value, index){
                        if(value >= 15){
                            return value;
                        }else{
                            return '';
                        }
                    }
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                }

            },
            {
                gridIndex: 4,
                min: 0,
                max: 9,
                position:'right',
                interval:0.5,
                axisTick:{
                    show:false,

                },
                axisLabel:{
                    formatter:function(value, index){
                        if(value > 6.5){
                            return '';
                        }else{
                            return value;
                        }
                    }
                },
                splitLine:{
                    show:true,
                    lineStyle:{
                        color:['#000']
                    }
                },
                name:'Weight(kilograms)',
                nameLocation:'middle',
                nameGap:$nameGapY,
                nameTextStyle:{
                    padding:[0, 350, 0, 0]
                },
                z:1
            },
            {
                gridIndex: 5,
                min: -25,
                max: 65,
                position:'right',
                interval:5,
                axisLabel:{
                    show:true,
                    formatter:function(value, index){
                        if(value >= 45){
                            return value;
                        }else{
                            return '';
                        }
                    }
                },
                axisTick:{
                    show:false
                },
                splitLine:{
                    show:false
                },
                name:'Centimeters',
                nameLocation:'middle',
                nameGap:$nameGapY,
                nameTextStyle:{
                    padding:[0, 0, 0, 400]
                },
            }
        ],
        series: seriesData
    };
}


function labelOpt($name, $rotate, $index){
    return {
        normal:{
            show:true,
            fontSize:25,
            formatter:function(param){
                // console.log(param);
                if(param.seriesName == 'P97' && param.dataIndex == $index){
                    return $name;
                }else{
                    return '';
                }
            },
            position:'top',
            rotate:$rotate,
            color: '#000'
        }
    };
   
}

function lineTypeOpt($name){
    var $type = '';
    if($name == 'P50'){
        $type = 'solid';
    }else if($name == 'P10' || $name == 'P90'){
        $type = 'dashed';
    }else{
        $type = 'dotted';
    }
    return {
        normal:{
            type:$type
        }
    };
}
//cdc
function setCDC($customOpt, $baseLine, $data, $type){
    var maincolor = $customOpt.sex == 0 ? '#f36598' : '#5996c8';
    //网格分割线颜色
    var $splitLineOpt_1 = {
        lineStyle:{
            color:'#fff',
            width:1
        }
    };
    var $splitLineOpt_2 = {
        lineStyle:{
            color:maincolor,
            width:2
        }
    };
    //X、Y轴
    var $nameOpt = {
        xName:'年龄(月)',
        yName:'',
        nameLocation:'middle',
        nameGap:30,
        nameTextStyle:{
            fontSize:14
        }
    };

    var $xFormatter = function (value, index) {
        if(value % 3 === 0){
            return value;
        }else{
            return '';
        }
    };
    var $yFormatter = function(value, index){
        if(value%1 === 0){
            return value;
        }else{
            return '';
        }
    };


    var $xOpt = {
        max: 36,
        min: 0,
        bottomInterval:1,
        topInterval:3
    };
    var $yOpt = {
        max: 19,
        min: 0,
        leftInterval:1,
        rightInterval:0.5
    };
    var $curveBgColor = '#fff';
    if($type == 'weight'){
        $nameOpt.yName = '体重(千克)';
    }else if($type == 'height'){
        $nameOpt.yName = '身长/身高(厘米)';
    }else if($type == 'hc'){
        $nameOpt.yName = '头围(厘米)';
    }else if($type == 'wfh'){
        $nameOpt.yName = '体重(千克)';
        $nameOpt.xName = '身长/身高(厘米)';
    }

   var splitLineOpt_1 = ($customOpt.splitLineOpt_1 != undefined) ? $customOpt.splitLineOpt_1 : $splitLineOpt_1;
    var splitLineOpt_2 = ($customOpt.splitLineOpt_2 != undefined) ? $customOpt.splitLineOpt_2 : $splitLineOpt_2;
    var nameOpt = ($customOpt.nameOpt != undefined) ? $customOpt.nameOpt : $nameOpt;
    var xFormatter = ($customOpt.xFormatter != undefined) ? $customOpt.xFormatter : $xFormatter;
    var yFormatter = ($customOpt.yFormatter != undefined) ? $customOpt.yFormatter : $yFormatter;
    var xOpt = ($customOpt.xOpt != undefined) ? $customOpt.xOpt : $xOpt;
    var yOpt = ($customOpt.yOpt != undefined) ? $customOpt.yOpt : $yOpt;

    var len = $baseLine.length;
    var seriesData = new Array();
    var legendData = new Array();


    for(var i = 0; i < len; i++){
        legendData.push($baseLine[i].key);
        //循环处理值保留小数点后3位
        var vv = $baseLine[i].value;
        for(var j = 0; j < vv.length;j++){
            vv[j][1] = Math.round(vv[j][1]*Math.pow(10,3))/Math.pow(10,3);
        }
        seriesData.push(
            {
                name:$baseLine[i].key,
                type:'line',
                smooth:true,
                data:$baseLine[i].value,
                showSymbol:false,
                markPoint:{
                    symbol:'circle',
                    symbolSize:1,
                    label:{
                         normal:{
                            show:true,
                            formatter:$baseLine[i].key,
                            // color:maincolor,
                            position:'right'
                         }
                    },
                    data:[
                        {
                            type:'max',
                            valueIndex:0
                        }
                    ]
                },
                lineStyle:{
                    normal:{
                        color:maincolor
                    }
                }
            }
        );
    }

    //去除X Y轴上的坐标系外面的点
    $data = removeX($data,xOpt.min);
    $data = removeY($data,yOpt.min);

    if($data.length > 0){
        seriesData.push(
            {
                name: $customOpt.babyname,
                type:'line',
                showSymbol:true,
                symbolSize:function (val) {
      
                        return 8;
                },
                itemStyle : {
                    normal : {
                        color:"blue",
                        lineStyle:{
                            normal:{
                                color:'blue',
                                width:1
                            }
                        },
                    }
                },
                tooltip:{
                    trigger:'item',
                    formatter:function(param){
                        if(param.value[2] == 0){
                            var str = $customOpt.babyname+ '\n'+$nameOpt.xName+'：'+(param.value[0])+'\n'+$nameOpt.yName+'：'+(param.value[1]);
                        }else{
                            var str =$customOpt.babyname+ '\n'+$nameOpt.xName+'：'+(param.value[0])+'\n'+$nameOpt.yName+'：'+(param.value[1])+'\n百分比：'+(param.value[2]);
                        }
                        return str;
                    },
                    position: function (pos, params, dom, rect, size) {
                        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
                        var obj = {top: pos[1]};
                         if(pos[0] > size.viewSize[0] / 2){

                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = pos[0]-120;
                         }else{
                            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = size.viewSize[0] - pos[0]-140;
                         }
                        return obj;
                    },
                },
                data:$data
            }
        );
        legendData.push($customOpt.babyname);
    }

    return {
        textStyle:{
            color:maincolor
        },
        backgroundColor: $curveBgColor,
        title: {
            text: $customOpt.title,
            left:'center',
            top:30,
            right:'auto',
            textStyle:{
                color:maincolor
            }

        },
        dataZoom : {
            type:"inside"
        },
        tooltip : {
            show:true
        },

        grid: {
            left: '6%',
            right: '6%',
            bottom: '10%',
            containLabel: true,
            show:true,
            backgroundColor:'#fff'

        },
        xAxis : [
            {
                type : 'value',
                boundaryGap : false,
                interval:xOpt.bottomInterval,
                splitLine:splitLineOpt_1,
                name:nameOpt.xName,
                nameLocation:nameOpt.nameLocation,
                nameGap:nameOpt.nameGap,
                nameTextStyle:nameOpt.nameTextStyle,
                min:xOpt.min,
                max:xOpt.max,
                axisLabel:{
                    formatter:xFormatter
                },
                axisTick:{
                    lineStyle:{
                        color:maincolor
                    }
                },
                z:1
            },
            {
                type:'value',
                min:xOpt.min,
                max:xOpt.max,
                interval:xOpt.topInterval,
                splitLine:splitLineOpt_2,
                axisTick:{
                    show:true,
                    lineStyle:{
                        color:maincolor
                    }
                },

                axisLabel:{
                    show:false

                },
                z:2,
                axisLine:{
                    lineStyle:{
                        color:maincolor
                    }
                }

            }
        ],
        yAxis : [
            {
                type : 'value',
                min:yOpt.min,
                max:yOpt.max,
                position:'left',
                splitLine:splitLineOpt_2,
                interval:yOpt.leftInterval,
                name:nameOpt.yName,
                nameLocation:nameOpt.nameLocation,
                nameGap:nameOpt.nameGap,
                nameTextStyle:nameOpt.nameTextStyle,
                z:2,
                axisLine:{
                    lineStyle:{
                        color:maincolor
                    }
                }
            },
            {
                type:'value',
                min:yOpt.min,
                max:yOpt.max,
                position:'right',
                interval:yOpt.rightInterval,
                splitLine:splitLineOpt_1,
                axisLabel:{
                    show:true,
                    formatter:yFormatter
                },
                axisTick:{
                    show:false
                },
                z:1
            },

        ],
        series : seriesData
    };
}

//传入X值，去除在坐标系X轴外的点
function removeX($data,X) {
   let $data_array = [];

    for(var i=0;i<$data.length;i++){
        // 存在小于X的值就要处理
        if($data[i][0]< X){
            // 若当前值的后一个值存在
            if($data[i+1] && !$data[i-1]){
                // 若当前值的后一个值大于X
                if($data[i+1][0] >X){
                    $data_array.push($data[i])
                    var Y =getZeroX($data[i][0],$data[i][1],$data[i+1][0],$data[i+1][1],X);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push(arr);
                }
            }
            // 若当前值的前一个值存在
            if($data[i-1] && !$data[i+1]){
                // 若当前值的前一个值大于X
                if($data[i-1][0] >X){
                    var Y =getZeroX($data[i][0],$data[i][1],$data[i-1][0],$data[i-1][1],X);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push(arr);
                    $data_array.push($data[i])
                }
            }
            // 若当前值的前一个值存在和后一个值都存在
            if($data[i-1] && $data[i+1]){
                //前后值都大于X
                if($data[i-1][0] >X && $data[i+1][0] >X){
                    var Y1 =getZeroX($data[i][0],$data[i][1],$data[i-1][0],$data[i-1][1],X);
                    var arr1 = [X.toString(),Y1.toString(),''];
                    var Y2 =getZeroX($data[i][0],$data[i][1],$data[i+1][0],$data[i+1][1],X);
                    var arr2 = [X.toString(),Y2.toString(),''];
                    $data_array.push(arr1);
                    $data_array.push($data[i]);
                    $data_array.push(arr2);
                }
                //前后值都小于X
                if($data[i-1][0] <X && $data[i+1][0] <X){
                    $data_array.push($data[i]);
                }
                // 前值小于0，后值大于0
                if ($data[i-1][0] <X && $data[i+1][0] >X){
                    var Y =getZeroX($data[i][0],$data[i][1],$data[i+1][0],$data[i+1][1],X);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push($data[i]);
                    $data_array.push(arr);
                }
                // 前值大于0，后值小于0
                if($data[i-1][0] >X && $data[i+1][0] <X){
                    var Y =getZeroX($data[i][0],$data[i][1],$data[i-1][0],$data[i-1][1],X);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push(arr);
                    $data_array.push($data[i]);
                }
            }
        }else{
            $data_array.push($data[i]);
        }
    }
    for(var i = 0;i < $data_array.length; i++){
        if(rpn.calCommonExp($data_array[i][0]) < X){
            $data_array[i][0]=null;
        }
    }
    return $data_array;
}
//传入Y值，去除在坐标系Y轴外的点
function removeY($data,Y) {
    let $data_array = [];
    for(var i=0;i<$data.length;i++){
        // 存在小于Y的值就要处理
        if($data[i][1]< Y){
            // 若当前值的后一个值存在
            if($data[i+1] && !$data[i-1]){
                // 若当前值的后一个值大于Y
                if($data[i+1][1] >Y){
                    $data_array.push($data[i])
                    var X =getZeroY($data[i][0],$data[i][1],$data[i+1][0],$data[i+1][1],Y);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push(arr);
                }
            }
            // 若当前值的前一个值存在
            if($data[i-1] && !$data[i+1]){
                // 若当前值的前一个值大于Y
                if($data[i-1][1] >Y){
                    var X =getZeroY($data[i][0],$data[i][1],$data[i-1][0],$data[i-1][1],Y);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push(arr);
                    $data_array.push($data[i])
                }
            }
            // 若当前值的前一个值存在和后一个值都存在
            if($data[i-1] && $data[i+1]){
                //前后值都大于Y
                if($data[i-1][1] >Y && $data[i+1][1] >Y){
                    var X1 =getZeroY($data[i][0],$data[i][1],$data[i-1][0],$data[i-1][1],Y);
                    var arr1 = [X1.toString(),Y.toString(),''];
                    var X2 =getZeroY($data[i][0],$data[i][1],$data[i+1][0],$data[i+1][1],Y);
                    var arr2 = [X2.toString(),Y.toString(),''];
                    $data_array.push(arr1);
                    $data_array.push($data[i]);
                    $data_array.push(arr2);
                }
                //前后值都小于Y
                if($data[i-1][1] <Y && $data[i+1][1] <Y){
                    $data_array.push($data[i]);
                }
                // 前值小于Y，后值大于Y
                if ($data[i-1][1] <Y && $data[i+1][1] >Y){
                    var X =getZeroY($data[i][0],$data[i][1],$data[i+1][0],$data[i+1][1],Y);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push($data[i]);
                    $data_array.push(arr);
                }
                // 前值大于Y，后值小于Y
                if($data[i-1][1] >Y && $data[i+1][1] <Y){
                    var X =getZeroY($data[i][0],$data[i][1],$data[i-1][0],$data[i-1][1],Y);
                    var arr = [X.toString(),Y.toString(),''];
                    $data_array.push(arr);
                    $data_array.push($data[i]);
                }
            }
        }else{
            $data_array.push($data[i]);
        }
    }
    for(var i = 0;i < $data_array.length; i++){
        if(rpn.calCommonExp($data_array[i][1]) < Y ){
            $data_array[i]=[null,null,null];
        }
        // if($data_array[i][3]==0){
        //     $data_array[i] = {
        //         value: $data_array[i],
        //         symbolSize : 10,
        //         showSymbol:true,
        //         itemStyle: {        // 数据级个性化折线样式
        //             normal: {
        //                 color: 'green'
        //             }
        //         }
        //     };
        // }
    }
    return $data_array;
}
function getZeroX($a1,$b1,$a2,$b2,X) {
    var a1 = rpn.calCommonExp($a1);
    var b1 = rpn.calCommonExp($b1);
    var a2 = rpn.calCommonExp($a2);
    var b2 = rpn.calCommonExp($b2);
    var value = (a1*b2 - b1*a2)/(a1 - a2) + (b1-b2) * X/(a1-a2);
    var Y = Math.round(value*Math.pow(10,3))/Math.pow(10,3);
    return Y;
}
function getZeroY($a1,$b1,$a2,$b2,Y) {
    var a1 = rpn.calCommonExp($a1);
    var b1 = rpn.calCommonExp($b1);
    var a2 = rpn.calCommonExp($a2);
    var b2 = rpn.calCommonExp($b2);
    var value = (a2*b1 - a1*b2)/(b1 - b2) + Y * (a1 - a2)/ (b1 - b2);
    var X = Math.round(value*Math.pow(10,3))/Math.pow(10,3);
    return X;
}
module.exports = {
    setOption:setOption,
    setCDC:setCDC,
    setFenton:setFenton   
  }