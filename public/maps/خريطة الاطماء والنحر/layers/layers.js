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
var format_sedi_port_layout_1 = new ol.format.GeoJSON();
var features_sedi_port_layout_1 = format_sedi_port_layout_1.readFeatures(json_sedi_port_layout_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_port_layout_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_port_layout_1.addFeatures(features_sedi_port_layout_1);
var lyr_sedi_port_layout_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_port_layout_1, 
                style: style_sedi_port_layout_1,
                popuplayertitle: 'sedi_port_layout',
                interactive: true,
                title: '<img src="styles/legend/sedi_port_layout_1.png" /> sedi_port_layout'
            });
var format_sedi_2020_2 = new ol.format.GeoJSON();
var features_sedi_2020_2 = format_sedi_2020_2.readFeatures(json_sedi_2020_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_2020_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_2020_2.addFeatures(features_sedi_2020_2);
var lyr_sedi_2020_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_2020_2, 
                style: style_sedi_2020_2,
                popuplayertitle: 'sedi_2020',
                interactive: true,
                title: '<img src="styles/legend/sedi_2020_2.png" /> sedi_2020'
            });
var format_sedi_2010_3 = new ol.format.GeoJSON();
var features_sedi_2010_3 = format_sedi_2010_3.readFeatures(json_sedi_2010_3, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_2010_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_2010_3.addFeatures(features_sedi_2010_3);
var lyr_sedi_2010_3 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_2010_3, 
                style: style_sedi_2010_3,
                popuplayertitle: 'sedi_2010',
                interactive: true,
                title: '<img src="styles/legend/sedi_2010_3.png" /> sedi_2010'
            });
var format_sedi_2000_4 = new ol.format.GeoJSON();
var features_sedi_2000_4 = format_sedi_2000_4.readFeatures(json_sedi_2000_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_2000_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_2000_4.addFeatures(features_sedi_2000_4);
var lyr_sedi_2000_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_2000_4, 
                style: style_sedi_2000_4,
                popuplayertitle: 'sedi_2000',
                interactive: true,
                title: '<img src="styles/legend/sedi_2000_4.png" /> sedi_2000'
            });
var format_sedi_1990_5 = new ol.format.GeoJSON();
var features_sedi_1990_5 = format_sedi_1990_5.readFeatures(json_sedi_1990_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sedi_1990_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sedi_1990_5.addFeatures(features_sedi_1990_5);
var lyr_sedi_1990_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sedi_1990_5, 
                style: style_sedi_1990_5,
                popuplayertitle: 'sedi_1990',
                interactive: true,
                title: '<img src="styles/legend/sedi_1990_5.png" /> sedi_1990'
            });
var format_erosion_port_layout_6 = new ol.format.GeoJSON();
var features_erosion_port_layout_6 = format_erosion_port_layout_6.readFeatures(json_erosion_port_layout_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_erosion_port_layout_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_erosion_port_layout_6.addFeatures(features_erosion_port_layout_6);
var lyr_erosion_port_layout_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_erosion_port_layout_6, 
                style: style_erosion_port_layout_6,
                popuplayertitle: 'erosion_port_layout',
                interactive: true,
                title: '<img src="styles/legend/erosion_port_layout_6.png" /> erosion_port_layout'
            });
var format_ero_2020_7 = new ol.format.GeoJSON();
var features_ero_2020_7 = format_ero_2020_7.readFeatures(json_ero_2020_7, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_2020_7 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_2020_7.addFeatures(features_ero_2020_7);
var lyr_ero_2020_7 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_2020_7, 
                style: style_ero_2020_7,
                popuplayertitle: 'ero_2020',
                interactive: true,
                title: '<img src="styles/legend/ero_2020_7.png" /> ero_2020'
            });
var format_ero_2000_8 = new ol.format.GeoJSON();
var features_ero_2000_8 = format_ero_2000_8.readFeatures(json_ero_2000_8, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_2000_8 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_2000_8.addFeatures(features_ero_2000_8);
var lyr_ero_2000_8 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_2000_8, 
                style: style_ero_2000_8,
                popuplayertitle: 'ero_2000',
                interactive: true,
                title: '<img src="styles/legend/ero_2000_8.png" /> ero_2000'
            });
var format_ero_2010_9 = new ol.format.GeoJSON();
var features_ero_2010_9 = format_ero_2010_9.readFeatures(json_ero_2010_9, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_2010_9 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_2010_9.addFeatures(features_ero_2010_9);
var lyr_ero_2010_9 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_2010_9, 
                style: style_ero_2010_9,
                popuplayertitle: 'ero_2010',
                interactive: true,
                title: '<img src="styles/legend/ero_2010_9.png" /> ero_2010'
            });
var format_ero_1990_10 = new ol.format.GeoJSON();
var features_ero_1990_10 = format_ero_1990_10.readFeatures(json_ero_1990_10, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_ero_1990_10 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_ero_1990_10.addFeatures(features_ero_1990_10);
var lyr_ero_1990_10 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_ero_1990_10, 
                style: style_ero_1990_10,
                popuplayertitle: 'ero_1990',
                interactive: true,
                title: '<img src="styles/legend/ero_1990_10.png" /> ero_1990'
            });
var group_Erosion = new ol.layer.Group({
                                layers: [lyr_erosion_port_layout_6,lyr_ero_2020_7,lyr_ero_2000_8,lyr_ero_2010_9,lyr_ero_1990_10,],
                                fold: 'close',
                                title: 'Erosion'});
var group_Sedimentation = new ol.layer.Group({
                                layers: [lyr_sedi_port_layout_1,lyr_sedi_2020_2,lyr_sedi_2010_3,lyr_sedi_2000_4,lyr_sedi_1990_5,],
                                fold: 'close',
                                title: 'Sedimentation'});

lyr_GoogleSatelliteHybrid_0.setVisible(true);lyr_sedi_port_layout_1.setVisible(true);lyr_sedi_2020_2.setVisible(true);lyr_sedi_2010_3.setVisible(true);lyr_sedi_2000_4.setVisible(true);lyr_sedi_1990_5.setVisible(true);lyr_erosion_port_layout_6.setVisible(true);lyr_ero_2020_7.setVisible(true);lyr_ero_2000_8.setVisible(true);lyr_ero_2010_9.setVisible(true);lyr_ero_1990_10.setVisible(true);
var layersList = [lyr_GoogleSatelliteHybrid_0,group_Sedimentation,group_Erosion];
lyr_sedi_port_layout_1.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_2020_2.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_2010_3.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_2000_4.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_1990_5.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_erosion_port_layout_6.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_2020_7.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_2000_8.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_2010_9.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_ero_1990_10.set('fieldAliases', {'fid': 'fid', 'LEFT_FID': 'LEFT_FID', 'RIGHT_FID': 'RIGHT_FID', 'Shape_Leng': 'Shape_Leng', });
lyr_sedi_port_layout_1.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_2020_2.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_2010_3.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_2000_4.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_1990_5.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_erosion_port_layout_6.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_2020_7.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_2000_8.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_2010_9.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_ero_1990_10.set('fieldImages', {'fid': '', 'LEFT_FID': '', 'RIGHT_FID': '', 'Shape_Leng': '', });
lyr_sedi_port_layout_1.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_2020_2.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_2010_3.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_2000_4.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_sedi_1990_5.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_erosion_port_layout_6.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_2020_7.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_2000_8.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_2010_9.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_1990_10.set('fieldLabels', {'fid': 'no label', 'LEFT_FID': 'no label', 'RIGHT_FID': 'no label', 'Shape_Leng': 'no label', });
lyr_ero_1990_10.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});