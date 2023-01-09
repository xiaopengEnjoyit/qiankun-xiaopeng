import Vue from 'vue'
let that = new Vue({})
// function num2text(options, val) {
//   let el = options.find(o => {
//     return String(o.dictCode) === String(val)
//   })
//   return el ? el.dictName : '--'
// }
export const assessColumns = [
  {
    prop: 'pointTypeName',
    label: '仪表类型'
    // render: fullData => {
    //   return num2text(that.$dictObj['pointType'], fullData['pointType'])
    // }
  },
  {
    prop: 'waterUserCode',
    label: '用户编号'
  },
  {
    prop: 'waterUserName',
    label: '用户名称',
    minWidth: '100px'
  },
  { prop: 'deviceCode', label: '设备编号' },
  { prop: 'installAddress', label: '安装地址' },
  {
    prop: 'purposeName',
    label: '表用途'
    // render: fullData => {
    //   return num2text(that.$dictObj['purpose'], fullData['purpose'])
    // }
  },
  {
    prop: 'caliberName',
    label: '口径'
    // render: fullData => {
    //   return num2text(that.$dictObj['caliber'], fullData['caliber'])
    // }
  },
  {
    prop: 'manufacturerName',
    label: '厂家'
    // render: fullData => {
    //   return num2text(that.$dictObj['manufactor'], fullData['manufacturer'])
    // }
  },
  {
    prop: 'installTime',
    label: '安装日期',
    format: 'YYYY-MM-DD'
  },
  {
    prop: 'modifyType',
    label: '变更类型',
    render: (row, prop) => {
      if (row[prop] === 1) {
        return '新增关联'
      } else if (row[prop] === 2) {
        return '取消关联'
      }
    }
  },
  { prop: 'operator', label: '变更人' },
  { prop: 'operationTime', label: '变更时间', format: 'YYYY-MM-DD' }
]
export const largeColumns = [
  {
    prop: 'waterUserCode',
    label: '用户编号'
  },
  {
    prop: 'waterUserName',
    label: '用户名称'
  },
  { prop: 'deviceCode', label: '设备编号' },
  { prop: 'installAddress', label: '安装地址' },
  {
    prop: 'purposeName',
    label: '表用途'
    // render: fullData => {
    //   return num2text(that.$dictObj['purpose'], fullData['purpose'])
    // }
  },
  {
    prop: 'caliberName',
    label: '口径'
    // render: fullData => {
    //   return num2text(that.$dictObj['caliber'], fullData['caliber'])
    // }
  },
  {
    prop: 'manufacturerName',
    label: '厂家'
    // render: fullData => {
    //   return num2text(that.$dictObj['manufactor'], fullData['manufacturer'])
    // }
  },
  {
    prop: 'installTime',
    label: '安装日期',
    format: 'YYYY-MM-DD'
  },
  {
    prop: 'modifyType',
    label: '变更类型',
    render: (row, prop) => {
      if (row[prop] === 1) {
        return '新增关联'
      } else if (row[prop] === 2) {
        return '取消关联'
      }
    }
  },
  { prop: 'operator', label: '变更人' },
  { prop: 'operationTime', label: '变更时间', format: 'YYYY-MM-DD' }
]
export const buildColumns = [
  { prop: 'id', label: '栋楼表ID', minWidth: '100px' },
  { prop: 'installAddress', label: '栋楼表地址', minWidth: '100px' },
  { prop: 'coordinate', label: '经纬度', minWidth: '100px' },
  {
    prop: 'isRealName',
    label: '是否虚拟表',
    minWidth: '100px'
  },
  {
    prop: 'relDeviceCount',
    label: '关联户表数',
    minWidth: '100px'
  },
  {
    prop: 'modifyType',
    label: '变更类型',
    render: (row, prop) => {
      if (row[prop] === 1) {
        return '新增关联'
      } else if (row[prop] === 2) {
        return '取消关联'
      }
    }
  },
  { prop: 'operator', label: '变更人' },
  { prop: 'operationTime', label: '变更时间', format: 'YYYY-MM-DD' }
]
