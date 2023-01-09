export const pointData = {
  data: {
    t_pipe: {
      records: [
        {
          diameter_dn: 'DN300',
          laying: null,
          owner_unit: null,
          material: 'PE',
          s_depth: null,
          s_point: '3167',
          tenant_id: '1539178633815199837',
          relation_creator: null,
          create_time: '2020-12-31T16:00:00Z',
          probe_date: null,
          source_id: '1021928',
          comment: null,
          facility_code: 'GD01021928',
          length: null,
          update_user_name: 'admin',
          laying_age: null,
          e_h: null,
          update_time: '2022-08-25T02:48:56.121171Z',
          type: 'jdbc',
          laying_road: '东兴路',
          subtype: null,
          state: null,
          id: '0376f22644704b80a56fae272eebcf77',
          property: null,
          '@timestamp': '2022-08-25T09:13:02.679339500Z',
          geom: 'SRID=4326;LINESTRING(114.995895613158 27.8851767927719,114.995874875057 27.8860399213034)',
          create_user: null,
          e_point: '3168',
          diameter: 300,
          probe_unit: null,
          s_h: null,
          geometry: {
            type: 'LineString',
            coordinates: [
              [114.995895613, 27.885176793],
              [114.995874875, 27.886039921]
            ]
          },
          create_user_name: 'admin',
          facility_id: null,
          '@version': '1',
          e_depth: null,
          supervisor_unit: null,
          update_user: null
        }
      ],
      layer: {
        layerIcon: '1528990462889820243',
        code: 'pipe',
        name: '管段',
        fieldAliases: [
          {
            prop: 'facility_code',
            label: '编码'
          },
          {
            prop: 's_point',
            label: '起点号'
          },
          {
            prop: 'e_point',
            label: '终点号'
          },
          {
            prop: 's_depth',
            label: '起点埋深'
          },
          {
            prop: 'e_depth',
            label: '终点埋深'
          },
          {
            prop: 'material',
            label: '材质'
          },
          {
            prop: 'diameter',
            label: '管径'
          },
          {
            prop: 'laying',
            label: '埋设方式'
          },
          {
            prop: 'laying_age',
            label: '埋设年代'
          },
          {
            prop: 'laying_road',
            label: '所在道路'
          }
        ],
        fields: [
          {
            code: 'facility_code',
            name: '编码',
            dataType: 'varchar',
            length: 30,
            notNull: false,
            readonly: true
          },
          {
            code: 's_point',
            name: '起点号',
            dataType: 'varchar',
            length: 30,
            notNull: false,
            readonly: true
          },
          {
            code: 'e_point',
            name: '终点号',
            dataType: 'varchar',
            length: 30,
            notNull: false,
            readonly: true
          },
          {
            code: 's_depth',
            name: '起点埋深',
            dataType: 'double',
            length: 8,
            notNull: false,
            readonly: true
          },
          {
            code: 'e_depth',
            name: '终点埋深',
            dataType: 'double',
            length: 8,
            notNull: false,
            readonly: true
          },
          {
            code: 'material',
            name: '材质',
            dataType: 'varchar',
            length: 20,
            notNull: false,
            readonly: true
          },
          {
            code: 'diameter',
            name: '管径',
            dataType: 'number',
            length: 2,
            notNull: false,
            readonly: true
          },
          {
            code: 'laying',
            name: '埋设方式',
            dataType: 'varchar',
            length: 20,
            notNull: false,
            readonly: true
          },
          {
            code: 'laying_age',
            name: '埋设年代',
            dataType: 'date',
            length: 1,
            notNull: false,
            readonly: true
          },
          {
            code: 'laying_road',
            name: '所在道路',
            dataType: 'varchar',
            length: 100,
            notNull: false,
            readonly: true
          }
        ]
      }
    }
  },
  code: 200,
  message: '成功'
}

export const mapData = [
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: '050121a2d4c44274b9c04d2612ad5272',
    tenantId: '0',
    tenantName: '全局',
    configType: 'Standard',
    configTypeName: '标准',
    configJson:
      '{"urls":["http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7&key=7ff727fd4a7ad57442e3282643f227ee","http://wprd02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7&key=7ff727fd4a7ad57442e3282643f227ee"],"maxZoom":24,"maxNativeZoom":18,"center":[114.93448200173,27.8126828753472],"minZoom":6,"zoom":8,"resolutions":[0.703125,0.3515625,0.17578125,0.087890625,0.0439453125,0.02197265625,0.010986328125,0.0054931640625,0.00274658203125,0.001373291015625,0.0006866455078125,0.00034332275390625,0.000171661376953125,0.0000858306884765625,0.00004291534423828125,0.000021457672119140625,0.000010728836059570312,0.000005364418029785156,0.000002682209014892578,0.000001341104507446289,6.705522537231445E-7,3.3527612686157227E-7],"source":"XYZ","layerName":"高德标准","projection":"EPSG:4326","type":"TileLayer"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: 'ac5be413bb4d4ceaaf624bf0a14fb407',
    tenantId: '0',
    tenantName: '全局',
    configType: 'Image',
    configTypeName: '影像',
    configJson:
      '{"urls":["http://wprd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6&key=7ff727fd4a7ad57442e3282643f227ee","http://wprd02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6&key=7ff727fd4a7ad57442e3282643f227ee"],"maxZoom":24,"maxNativeZoom":18,"center":[114.93448200173,27.8126828753472],"minZoom":6,"zoom":8,"source":"XYZ","layerName":"高德影像","projection":"EPSG:4326","type":"TileLayer"}',
    remark: null
  }
]

export const pipeData = [
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: 'dd2d368adafa482e8a7376b244282b47',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:pipe&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","format":"image/png","icon":"1528990462889820243","units":"degrees","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:pipe","name":"wmts服务","projection":"EPSG:4326","layerName":"管段","opacity":1}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: '4bab697c6ad94ec894492a3115b3a444',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:watermeter&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1528989963767644186","units":"degrees","projection":"EPSG:4326","layerName":"水表","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:watermeter"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: '251b298d9ca0464080e99277306e13ad',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:other_point&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1527535320211112018","units":"degrees","projection":"EPSG:4326","layerName":"其他管点","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:other_point"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: '1ebb98d34ca14db5836c4f70d5694c20',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:dma&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1527535320211112018","units":"degrees","projection":"EPSG:4326","layerName":"DMA","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:dma"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: '33e8bf1433314dfd8318ce7ec63973a2',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:monitor&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1527535320211112018","units":"degrees","projection":"EPSG:4326","layerName":"监测点","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:monitor"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: 'a6d2546b81e044af8fcc519806efdc88',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:valve&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1557209599680053335","units":"degrees","projection":"EPSG:4326","layerName":"阀门","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:valve"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: '71356b7618ae43babd5513caa89e1c33',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:water_point&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1557210285584990270","units":"degrees","projection":"EPSG:4326","layerName":"接水点","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:water_point"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: 'a76d961d04534611b455dff37760bc8d',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:fittings&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1527535320211112018","units":"degrees","projection":"EPSG:4326","layerName":"管件","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:fittings"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: '64407ee7750841869b736f9e86181e1e',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:facility&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1557212108356190261","units":"degrees","projection":"EPSG:4326","layerName":"管网设施","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:facility"}',
    remark: null
  },
  {
    createUser: null,
    createUserName: null,
    createTime: null,
    updateUser: null,
    updateUserName: null,
    updateTime: null,
    id: 'a24856f7eb94407581fb98be3a912c57',
    tenantId: null,
    tenantName: null,
    configType: 'wmts',
    configTypeName: 'wmts服务',
    configJson:
      '{"fullUrl":"http://10.0.20.144:31080/geoserver/gwc/service/wmts?layer=develop:hydrant&style=&tilematrixset=EPSG:4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png","name":"wmts服务","format":"image/png","icon":"1557212227692527669","units":"degrees","projection":"EPSG:4326","layerName":"消防栓","type":"wmts","version":"1.0.0","url":"http://10.0.20.144:31080/geoserver/gwc/service/wmts","axisOrientation":"neu","layer":"develop:hydrant"}',
    remark: null
  }
]
