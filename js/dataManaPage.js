require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/views/draw/Draw"
], function (Map, MapView, Graphic, Draw, ) {
    // var graphicsLayer = new GraphicsLayer();

    subMap = new Map({
        basemap: "streets",
    });

    subView = new MapView({
        container: "subMapView",
        map: subMap,
        center: [106.43, 26.54],
        zoom: 11
    });

    initPoint(Graphic, subView);

});


function getPoint() {
    $.ajax({
        url: '../lib/point.json',
        type: 'get',
        success: function (points) {
            initTable(points)
        }
    })
}

//监测点属性表格
function initTable(points) {
    var tableData = [];
    var tableHeight = ($('html').height() - 50) / 2;
    var cellWidth = ($('html').width() - 200) / 6;

    var len = points.features.length;
    for (var i = 0; i < len; i++) {
        var item = points.features[i].geometry.coordinates;
        tableData.push({
            id: points.features[i].geometry.type,
            lon: item[0],
            lat: item[1],
            property1: Math.random() * 100,
            property2: Math.random() * 100,
            property3: Math.random() * 100,

        })
    }

    layui.table.render({
        elem: '#pointProperty'
        , height: tableHeight
        , page: true //开启分页
        , data: tableData
        , cols: [[ //表头
            { field: 'id', title: '名称', width: cellWidth - 20, sort: true, fixed: 'left' }
            , { field: 'lon', title: '经度', width: cellWidth, sort: true }
            , { field: 'lat', title: '纬度', width: cellWidth, sort: true }
            , { field: 'property1', title: '指标一', width: cellWidth, sort: true }
            , { field: 'property2', title: '指标二', width: cellWidth, sort: true }
            , { field: 'property3', title: '指标三', width: cellWidth, sort: true }
        ]]
    });

    layui.table.on('row', function (obj) {
        subView.goTo([obj.data.lon, obj.data.lat])
    });
};

//图表
function initDataChart() {

    // if (myChart != null && myChart != "" && myChart != undefined) {
    //     myChart.dispose(document.getElementById("evaluate-chart"));//销毁
    // }

    myChart = echarts.init(document.getElementById("evaluate-chart"));
    // app.title = '折柱混合';

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        legend: {
            data: ['蒸发量', '降水量', '平均温度']
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水量',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: '温度',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ],
        series: [
            {
                name: '蒸发量',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
            {
                name: '降水量',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
            },
            {
                name: '平均温度',
                type: 'line',
                yAxisIndex: 1,
                data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
            }
        ]
    };

    myChart.setOption(option);


}

function initPage() {
    getPoint();

    $('#point-manage').on('click', () => {
        $('.point-evaluate').css('display', 'none');
        $('.point-manage').css('display', 'block');
    })
    $('#point-evaluate').on('click', () => {
        $('.point-manage').css('display', 'none');
        $('.point-evaluate').css('display', 'block');
        initDataChart();
    })

    var uploadInst = layui.upload.render({
        elem: '#uploadImg' //绑定元素
        , url: '/upload/' //上传接口
        , done: function (res) {
            //上传完毕回调
        }
        , error: function () {
            //请求异常回调
        }
    });
    var uploadInst = layui.upload.render({
        elem: '#uploadVector' //绑定元素
        , url: '/upload/' //上传接口
        , done: function (res) {
            //上传完毕回调
        }
        , error: function () {
            //请求异常回调
        }
    });
    var uploadInst = layui.upload.render({
        elem: '#uploadFile' //绑定元素
        , url: '/upload/' //上传接口
        , done: function (res) {
            //上传完毕回调
        }
        , error: function () {
            //请求异常回调
        }
    });
};


initPage();