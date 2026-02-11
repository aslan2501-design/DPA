var wms_layers = [];


        var lyr_GoogleSatelliteHybrid_0 = new ol.layer.Tile({
            'title': 'Google Satellite Hybrid',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            })
        });
var format_Storesstores_1 = new ol.format.GeoJSON();
var features_Storesstores_1 = format_Storesstores_1.readFeatures(json_Storesstores_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Storesstores_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Storesstores_1.addFeatures(features_Storesstores_1);
var lyr_Storesstores_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Storesstores_1, 
                style: style_Storesstores_1,
                popuplayertitle: 'Stores — stores',
                interactive: true,
                title: '<img src="styles/legend/Storesstores_1.png" /> Stores — stores'
            });
var format_Buildingsbuidlings_2 = new ol.format.GeoJSON();
var features_Buildingsbuidlings_2 = format_Buildingsbuidlings_2.readFeatures(json_Buildingsbuidlings_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Buildingsbuidlings_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Buildingsbuidlings_2.addFeatures(features_Buildingsbuidlings_2);
var lyr_Buildingsbuidlings_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Buildingsbuidlings_2, 
                style: style_Buildingsbuidlings_2,
                popuplayertitle: 'Buildings — buidlings',
                interactive: true,
                title: '<img src="styles/legend/Buildingsbuidlings_2.png" /> Buildings — buidlings'
            });

lyr_GoogleSatelliteHybrid_0.setVisible(true);lyr_Storesstores_1.setVisible(true);lyr_Buildingsbuidlings_2.setVisible(true);
var layersList = [lyr_GoogleSatelliteHybrid_0,lyr_Storesstores_1,lyr_Buildingsbuidlings_2];
lyr_Storesstores_1.set('fieldAliases', {'fid': 'fid', 'id': 'id', 'Name': 'Name', 'description': 'description', 'timestamp': 'timestamp', 'begin': 'begin', 'end': 'end', 'altitudeMode': 'altitudeMode', 'tessellate': 'tessellate', 'extrude': 'extrude', 'visibility': 'visibility', 'drawOrder': 'drawOrder', 'icon': 'icon', });
lyr_Buildingsbuidlings_2.set('fieldAliases', {'fid': 'fid', 'id': 'id', 'Name': 'Name', 'description': 'description', 'timestamp': 'timestamp', 'begin': 'begin', 'end': 'end', 'altitudeMode': 'altitudeMode', 'tessellate': 'tessellate', 'extrude': 'extrude', 'visibility': 'visibility', 'drawOrder': 'drawOrder', 'icon': 'icon', });
lyr_Storesstores_1.set('fieldImages', {'fid': '', 'id': '', 'Name': '', 'description': '', 'timestamp': '', 'begin': '', 'end': '', 'altitudeMode': '', 'tessellate': '', 'extrude': '', 'visibility': '', 'drawOrder': '', 'icon': '', });
lyr_Buildingsbuidlings_2.set('fieldImages', {'fid': '', 'id': '', 'Name': '', 'description': '', 'timestamp': '', 'begin': '', 'end': '', 'altitudeMode': '', 'tessellate': '', 'extrude': '', 'visibility': '', 'drawOrder': '', 'icon': '', });
lyr_Storesstores_1.set('fieldLabels', {'fid': 'no label', 'id': 'no label', 'Name': 'no label', 'description': 'no label', 'timestamp': 'no label', 'begin': 'no label', 'end': 'no label', 'altitudeMode': 'no label', 'tessellate': 'no label', 'extrude': 'no label', 'visibility': 'no label', 'drawOrder': 'no label', 'icon': 'no label', });
lyr_Buildingsbuidlings_2.set('fieldLabels', {'fid': 'no label', 'id': 'no label', 'Name': 'no label', 'description': 'no label', 'timestamp': 'no label', 'begin': 'no label', 'end': 'no label', 'altitudeMode': 'no label', 'tessellate': 'no label', 'extrude': 'no label', 'visibility': 'no label', 'drawOrder': 'no label', 'icon': 'no label', });
lyr_Buildingsbuidlings_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});