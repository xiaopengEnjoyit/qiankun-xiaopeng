### 数据类型转换
let ds = new this.$dv()
let dv = ds.createView().source(data)
dv.transform({
type: 'fold',
fields: ['supplyingWater', 'minimumFlow'],
key: 'type',
value: 'value'
})
dv.rows.map(res => {
if (res.type === 'supplyingWater') {
    res.type = '供水量'
} else if (res.type === 'minimumFlow') {
    res.type = '最小流量'
}
})
this.chartConfig.data = dv.rows