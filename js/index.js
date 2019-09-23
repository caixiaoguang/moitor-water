var myChart;
require([
    "esri/Map",
    "esri/views/MapView",
    'esri/widgets/Zoom',
    "esri/Graphic",
    "esri/widgets/BasemapToggle",
    "esri/views/layers/FeatureLayerView"

], function (Map, MapView, Zoom, Graphic, BasemapToggle, FeatureLayerView) {

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

    featureLayerView = new FeatureLayerView();

    addZoomEvent();

    initPoint(Graphic, view);
    initRightTable(points, Graphic);

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
function initPoint(Graphic, view) {
    addPoint(Graphic, points, view)

}

//添加监测点
function addPoint(Graphic, points, view) {
    var len = points.features.length;
    for (var i = 0; i < len; i++) {
        var item = points.features[i].geometry.coordinates;
        var properties = points.features[i].properties;
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
            id: properties.index,
            geometry: point,
            symbol: simpleMarkerSymbol,
            popupTemplate: {
                title: "监测点" + properties.index,
                width: 200,
                content: '经度：' + item[0] + '</br>' + '纬度：' + item[1] + '</br>' + '指标一：' + (properties.property1).toFixed(3) + '</br>' + '指标二：' + (properties.property2).toFixed(3)
            }
        });
        view.graphics.add(pointGraphic);
    }

    view.popup.watch("title,visible", function (newValue, oldVale, property, popup) {
        if (popup.visible && popup.title) {
            var idString = popup.title.split('监测点')[1];
            var id = Number(idString);
            focusPoint(id, Graphic);
        }

    })
}


function focusPoint(id, Graphic) {

    var highlightLayer = view.graphics.find(layer => {
        return layer.id === 'highlight'
    });

    if (highlightLayer) {
        view.graphics.remove(highlightLayer);
    }


    var layer = view.graphics.find(layer => {
        return layer.id === id
    })
    var lon = layer.geometry.longitude;
    var lat = layer.geometry.latitude;

    var point = {
        type: "point",
        longitude: lon,
        latitude: lat,
    };

    var simpleMarkerSymbol = {
        type: "simple-marker",
        color: [238, 97, 41],
        outline: {
            color: [255, 255, 255], // white
            width: 1
        }
    };


    var pointGraphic = new Graphic({
        id: 'highlight',
        geometry: point,
        symbol: simpleMarkerSymbol,
        popupTemplate: layer.popupTemplate
    });
    view.graphics.add(pointGraphic);

    var trs = $("div[lay-id = 'rightPointProperty'] tbody:first tr");

    trs.css('background', '#fff');

    if (trs[id - 1]) {
        $(trs[id - 1]).css('background', 'orange')
    }






}

//监测点属性表格
function initRightTable(points, Graphic) {
    var tableData = [];
    var len = points.features.length;
    for (var i = 0; i < len; i++) {
        var item = points.features[i].geometry.coordinates;
        var properties = points.features[i].properties;
        tableData.push({
            id: points.features[i].properties.index,
            name: '监测点' + properties.index,
            lon: item[0],
            lat: item[1],
            property1: properties.property1,
            property2: properties.property2,
            property3: properties.property1,

        })
    }

    layui.table.render({
        elem: '#rightPointProperty'
        , page: false //不开启分页
        , data: tableData
        , limit: 20
        , cols: [[ //表头
            { field: 'name', title: '名称',  fixed: 'left' }
            , { field: 'lon', title: '经度', }
            , { field: 'lat', title: '纬度', }
            , { field: 'property1', title: '指标一', }
            , { field: 'property2', title: '指标二', }
        ]]
    });

    layui.table.on('row(rightPointProperty)', function (obj) {
        view.goTo([obj.data.lon, obj.data.lat]);
        focusPoint(obj.data.id, Graphic)
    });
};

