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
var format_sedi_port_layout_3 = new ol.format.GeoJSON();
var features_sedi_port_layout_3 = format_sedi_port_layout_3.readFeatures(json_sedi_port_layout_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_port_layout_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_port_layout_3.addFeatures(features_sedi_port_layout_3);
var lyr_sedi_port_layout_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_port_layout_3, 
                style: style_sedi_port_layout_3,
                popuplayertitle: 'sedi_port_layout',
                interactive: true,
                title: '<img src="styles/legend/sedi_port_layout_3.png" /> sedi_port_layout'
            });
var format_sedi_2020_4 = new ol.format.GeoJSON();
var features_sedi_2020_4 = format_sedi_2020_4.readFeatures(json_sedi_2020_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_2020_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_2020_4.addFeatures(features_sedi_2020_4);
var lyr_sedi_2020_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_2020_4, 
                style: style_sedi_2020_4,
                popuplayertitle: 'sedi_2020',
                interactive: true,
                title: '<img src="styles/legend/sedi_2020_4.png" /> sedi_2020'
            });
var format_sedi_2010_5 = new ol.format.GeoJSON();
var features_sedi_2010_5 = format_sedi_2010_5.readFeatures(json_sedi_2010_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_2010_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_2010_5.addFeatures(features_sedi_2010_5);
var lyr_sedi_2010_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_2010_5, 
                style: style_sedi_2010_5,
                popuplayertitle: 'sedi_2010',
                interactive: true,
                title: '<img src="styles/legend/sedi_2010_5.png" /> sedi_2010'
            });
var format_sedi_2000_6 = new ol.format.GeoJSON();
var features_sedi_2000_6 = format_sedi_2000_6.readFeatures(json_sedi_2000_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_2000_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_2000_6.addFeatures(features_sedi_2000_6);
var lyr_sedi_2000_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_2000_6, 
                style: style_sedi_2000_6,
                popuplayertitle: 'sedi_2000',
                interactive: true,
                title: '<img src="styles/legend/sedi_2000_6.png" /> sedi_2000'
            });
var format_sedi_1990_7 = new ol.format.GeoJSON();
var features_sedi_1990_7 = format_sedi_1990_7.readFeatures(json_sedi_1990_7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_1990_7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_1990_7.addFeatures(features_sedi_1990_7);
var lyr_sedi_1990_7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_1990_7, 
                style: style_sedi_1990_7,
                popuplayertitle: 'sedi_1990',
                interactive: true,
                title: '<img src="styles/legend/sedi_1990_7.png" /> sedi_1990'
            });
var format_erosion_port_layout_8 = new ol.format.GeoJSON();
var features_erosion_port_layout_8 = format_erosion_port_layout_8.readFeatures(json_erosion_port_layout_8, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_erosion_port_layout_8 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_erosion_port_layout_8.addFeatures(features_erosion_port_layout_8);
var lyr_erosion_port_layout_8 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_erosion_port_layout_8, 
                style: style_erosion_port_layout_8,
                popuplayertitle: 'erosion_port_layout',
                interactive: true,
                title: '<img src="styles/legend/erosion_port_layout_8.png" /> erosion_port_layout'
            });
var format_ero_2020_9 = new ol.format.GeoJSON();
var features_ero_2020_9 = format_ero_2020_9.readFeatures(json_ero_2020_9, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_2020_9 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_2020_9.addFeatures(features_ero_2020_9);
var lyr_ero_2020_9 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_2020_9, 
                style: style_ero_2020_9,
                popuplayertitle: 'ero_2020',
                interactive: true,
                title: '<img src="styles/legend/ero_2020_9.png" /> ero_2020'
            });
var format_ero_2000_10 = new ol.format.GeoJSON();
var features_ero_2000_10 = format_ero_2000_10.readFeatures(json_ero_2000_10, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_2000_10 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_2000_10.addFeatures(features_ero_2000_10);
var lyr_ero_2000_10 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_2000_10, 
                style: style_ero_2000_10,
                popuplayertitle: 'ero_2000',
                interactive: true,
                title: '<img src="styles/legend/ero_2000_10.png" /> ero_2000'
            });
var format_ero_2010_11 = new ol.format.GeoJSON();
var features_ero_2010_11 = format_ero_2010_11.readFeatures(json_ero_2010_11, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_2010_11 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_2010_11.addFeatures(features_ero_2010_11);
var lyr_ero_2010_11 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_2010_11, 
                style: style_ero_2010_11,
                popuplayertitle: 'ero_2010',
                interactive: true,
                title: '<img src="styles/legend/ero_2010_11.png" /> ero_2010'
            });
var format_ero_1990_12 = new ol.format.GeoJSON();
var features_ero_1990_12 = format_ero_1990_12.readFeatures(json_ero_1990_12, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_1990_12 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_1990_12.addFeatures(features_ero_1990_12);
var lyr_ero_1990_12 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_1990_12, 
                style: style_ero_1990_12,
                popuplayertitle: 'ero_1990',
                interactive: true,
                title: '<img src="styles/legend/ero_1990_12.png" /> ero_1990'
            });
var group_Erosion = new ol.layer.Group({
                                layers: [lyr_erosion_port_layout_8,lyr_ero_2020_9,lyr_ero_2000_10,lyr_ero_2010_11,lyr_ero_1990_12,],
                                fold: 'close',
                                title: 'Erosion'});
var group_Sedimentation = new ol.layer.Group({
                                layers: [lyr_sedi_port_layout_3,lyr_sedi_2020_4,lyr_sedi_2010_5,lyr_sedi_2000_6,lyr_sedi_1990_7,],
                                fold: 'close',
                                title: 'Sedimentation'});

lyr_GoogleSatelliteHybrid_0.setVisible(true);lyr_Storesstores_1.setVisible(true);lyr_Buildingsbuidlings_2.setVisible(true);lyr_sedi_port_layout_3.setVisible(true);lyr_sedi_2020_4.setVisible(true);lyr_sedi_2010_5.setVisible(true);lyr_sedi_2000_6.setVisible(true);lyr_sedi_1990_7.setVisible(true);lyr_erosion_port_layout_8.setVisible(true);lyr_ero_2020_9.setVisible(true);lyr_ero_2000_10.setVisible(true);lyr_ero_2010_11.setVisible(true);lyr_ero_1990_12.setVisible(true);
var layersList = [lyr_GoogleSatelliteHybrid_0,lyr_Storesstores_1,lyr_Buildingsbuidlings_2,group_Sedimentation,group_Erosion];
lyr_Storesstores_1.set('fieldAliases', {'fid': 'fid', 'id': 'id', 'Name': 'Name', 'description': 'description', 'timestamp': 'timestamp', 'begin': 'begin', 'end': 'end', 'altitudeMode': 'altitudeMode', 'tessellate': 'tessellate', 'extrude': 'extrude', 'visibility': 'visibility', 'drawOrder': 'drawOrder', 'icon': 'icon', });
lyr_Buildingsbuidlings_2.set('fieldAliases', {'fid': 'fid', 'id': 'id', 'Name': 'Name', 'description': 'description', 'timestamp': 'timestamp', 'begin': 'begin', 'end': 'end', 'altitudeMode': 'altitudeMode', 'tessellate': 'tessellate', 'extrude': 'extrude', 'visibility': 'visibility', 'drawOrder': 'drawOrder', 'icon': 'icon', });
lyr_sedi_port_layout_3.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_2020_4.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_2010_5.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_2000_6.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_1990_7.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_erosion_port_layout_8.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_2020_9.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_2000_10.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_2010_11.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_1990_12.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_Storesstores_1.set('fieldImages', {'fid': '', 'id': '', 'Name': '', 'description': '', 'timestamp': '', 'begin': '', 'end': '', 'altitudeMode': '', 'tessellate': '', 'extrude': '', 'visibility': '', 'drawOrder': '', 'icon': '', });
lyr_Buildingsbuidlings_2.set('fieldImages', {'fid': '', 'id': '', 'Name': '', 'description': '', 'timestamp': '', 'begin': '', 'end': '', 'altitudeMode': '', 'tessellate': '', 'extrude': '', 'visibility': '', 'drawOrder': '', 'icon': '', });
lyr_sedi_port_layout_3.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_2020_4.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_2010_5.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_2000_6.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_1990_7.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_erosion_port_layout_8.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_2020_9.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_2000_10.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_2010_11.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_1990_12.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_Storesstores_1.set('fieldLabels', {'fid': 'no label', 'id': 'no label', 'Name': 'no label', 'description': 'no label', 'timestamp': 'no label', 'begin': 'no label', 'end': 'no label', 'altitudeMode': 'no label', 'tessellate': 'no label', 'extrude': 'no label', 'visibility': 'no label', 'drawOrder': 'no label', 'icon': 'no label', });
lyr_Buildingsbuidlings_2.set('fieldLabels', {'fid': 'no label', 'id': 'no label', 'Name': 'no label', 'description': 'no label', 'timestamp': 'no label', 'begin': 'no label', 'end': 'no label', 'altitudeMode': 'no label', 'tessellate': 'no label', 'extrude': 'no label', 'visibility': 'no label', 'drawOrder': 'no label', 'icon': 'no label', });
lyr_sedi_port_layout_3.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_2020_4.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_2010_5.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_2000_6.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_1990_7.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_erosion_port_layout_8.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_2020_9.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_2000_10.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_2010_11.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_1990_12.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_1990_12.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});