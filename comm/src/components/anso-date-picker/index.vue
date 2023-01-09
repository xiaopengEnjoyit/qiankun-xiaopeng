<script>
import DatePicker from '../date-picker'
import { PICKER_OPTIONS } from './date-picker.conf'
export default {
  name: 'AnsoDatePicker',
  props: ['value'],
  data() {
    return {
      pickValue: '',
      pickerOptions: {} //PICKER_OPTIONS
    }
  },
  watch: {
    pickValue: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  /**
   * 修改人：钱保华
   * 修改原因：有自定义的pickerOptions，但是不需要显示周期（isCycleAlive），这种无法实现。
   * 修改内容：改为pickerOptions和isCycleAlive分开判断，互不影响。
   * 备注：注释部分为原码
   */
  render(h) {
    this.pickValue = this.value
    const { isCycleAlive, pickerOptions } = this.$attrs
    // if (isCycleAlive && pickerOptions) {
    //   this.pickerOptions = Object.assign(this.pickerOptions, pickerOptions)
    // }
    if (pickerOptions) {
      this.pickerOptions = pickerOptions
    }
    if (isCycleAlive) {
      this.pickerOptions = Object.assign(this.pickerOptions, PICKER_OPTIONS)
    }
    return (
      <DatePicker
        v-model={this.pickValue}
        attrs={{
          placeholder: '选择日期',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期',
          ...this.$attrs,
          pickerOptions: this.pickerOptions //isCycleAlive ? this.pickerOptions : {}
        }}
        on={{ ...this.$listeners }}
      ></DatePicker>
    )
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
