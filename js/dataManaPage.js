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

    layui.table.on('row(dataManage)', function (obj) {
        subView.goTo([obj.data.lon, obj.data.lat])
    });
};

//图表
function initDataChart() {

    // if (myChart != null && myChart != "" && myChart != undefined) {
    //     myChart.dispose(document.getElementById("evaluate-chart"));//销毁
    // }

    myChart = echarts.init(document.getElementById("evaluate-chart"));

    let option = {
        title: {
            text: "监测数据",
            x: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: "vertical",
            left: "left",
            data: ["指标一", "指标二", "指标三", "指标四", "指标五"]
        },
        series: [{
            name: "监测指标",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [{
                value: 335,
                name: "指标一"
            },
            {
                value: 310,
                name: "指标二"
            },
            {
                value: 234,
                name: "指标三"
            },
            {
                value: 135,
                name: "指标四"
            },
            {
                value: 1548,
                name: "指标五"
            }
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)"
                }
            }
        }]
    };
    myChart.setOption(option);
}

function initPage() {
    initTable(points);

    $('#point-manage').on('click', () => {
        $('.point-evaluate').css('display', 'none');
        $('.point-manage').css('display', 'block');
    })
    $('#point-evaluate').on('click', () => {
        $('.point-manage').css('display', 'none');
        $('.point-evaluate').css('display', 'block');
        initDataChart();
    })

    $('.layui-tab >ul li:lt(4)').on('click', () => {
        $('.right-card').css('display', 'block');
    });
    $('.layui-tab >ul li:gt(3)').on('click', () => {
        $('.right-card').css('display', 'none');
    });


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
    var uploadInst = layui.upload.render({
        elem: '#uploadPath' //绑定元素
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