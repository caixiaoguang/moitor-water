var myChart;
require([
    "esri/Map",
    "esri/views/MapView",
    'esri/widgets/Zoom',
    "esri/Graphic",
    "esri/widgets/BasemapToggle",

], function (Map, MapView, Zoom, Graphic, BasemapToggle) {

    map = new Map({
        basemap: "streets",
    });

    view = new MapView({
        container: "mapView",
        map: map,
        center: [106.55, 26.54],
        zoom: 11
    });

    zoom = new Zoom({
        view: view
    });

    var basemapToggle = new BasemapToggle({
        view: view,
        secondMap: "satellite"
    });
    view.ui.add(basemapToggle, "bottom-right");

    addZoomEvent();

    initPoint(Graphic,view);

});


//缩放事件
function addZoomEvent() {
    $('.zoom-in').on('click', function () {
        zoom.zoomIn();
    });

    $('.zoom-out').on('click', function () {
        zoom.zoomOut();
    });
}

//标绘
function drawLine(view, draw, Graphic) {
    $('.draw').on('click', function () {
        view.graphics.removeAll();
        const action = draw.create("polyline");
        action.on(
            [
                "vertex-add",
                "vertex-remove",
                "cursor-update",
                "redo",
                "undo",
                "draw-complete"
            ],
            createGraphic
        );
    });

    function createGraphic(event) {
        const vertices = event.vertices;
        view.graphics.removeAll();

        const graphic = new Graphic({
            geometry: {
                type: "polyline",
                paths: vertices,
                spatialReference: view.spatialReference
            },
            symbol: {
                type: "simple-line",
                color: [4, 90, 141],
                width: 4,
                cap: "round",
                join: "round"
            }
        });

        view.graphics.add(graphic);
    }
}

//初始化监测点
function initPoint(Graphic,view) {
    $.ajax({
        url: './../lib/point.json',
        type: 'get',
        success: function (points) {
            addPoint(Graphic, points,view)
        }
    })
}

//添加监测点
function addPoint(Graphic, points,view) {
    var len = points.features.length;
    for (var i = 0; i < len; i++) {
        var item = points.features[i].geometry.coordinates;

        var point = {
            type: "point",
            longitude: item[0],
            latitude: item[1]
        };

        var simpleMarkerSymbol = {
            type: "simple-marker",
            color: [69, 137, 244],
            outline: {
                color: [255, 255, 255], // white
                width: 1
            }
        };

        var pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,
            popupTemplate: {
                title: "监测点",
                content: "<div id='chart' style='width:400px;height:200px;'></div>"
            }
        });
        view.graphics.add(pointGraphic);
    }

    view.popup.watch("title,visible", function (newValue, oldVale, property, popup) {
        if (popup.visible) {
            setTimeout(() => {
                initChart();
            }, 10)
        }

    })
}

//初始化图表
function initChart() {
    // if (myChart != null && myChart != "" && myChart != undefined) {
    //     myChart.dispose(document.getElementById("chart"));//销毁
    // }

    myChart = echarts.init(document.getElementById("chart"));
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

