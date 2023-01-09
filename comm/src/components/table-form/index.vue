<script>
import ansoForm from '../anso-form'
import ansoButton from '../anso-button'
import { debounce } from '../../utils'
export default {
  name: 'TableForm',
  components: {
    ansoForm
  },
  props: {
    formList: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    model: {
      type: Object,
      default: () => ({})
    },
    labelWidth: {
      type: String,
      default: ''
    },
    labelPosition: {
      type: String,
      default: 'left'
    },
    // 表单项
    formConfig: {
      type: Object,
      default: () => ({})
    },
    itemConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isOpen: false,
      socureElHeight: 47,
      elHeight: 0,
      form: {}
    }
  },
  mounted() {
    setTimeout(() => {
      this.getElementRealTimeHeight()
    }, 500)
    // this.$nextTick(() => {
    //   this.getElementRealTimeHeight()
    // })
    window.addEventListener('resize', this.getElementRealTimeHeight)
    // this.initForm()
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.getElementRealTimeHeight)
    })
  },
  methods: {
    /**
     * @description: 初始化表单字段
     * @param {*}
     * @return {*}
     */

    initForm() {
      const { formList, form } = this
      Array.isArray(formList) &&
        formList.forEach(f => {
          if (f.model || f.model === 0) {
            this.$set(form, f.field, f.model)
          } else {
            this.$set(form, f.field, '')
          }
        })
    },
    /**
     * @description: 获取元素实时高度
     * @param {*}
     * @return {*}
     * 修改人：钱保华
     * 修改时间：2022.6.24
     * 修改原因：tabs中有多个表单，动态修改formList时，展开收起显示出现问题
     * 修改内容：遍历所有.form-view，判断v.offsetHeight>0
     * 不确定某种情况下是否会对let elHeight = v?.offsetHeight || 0 语句造成影响。（目前没发现影响）
     */

    getElementRealTimeHeight() {
      this.$nextTick(() => {
        // const el = document.querySelector('.form-view')
        // let elHeight = el?.offsetHeight || 0
        // console.log(555, elHeight)
        // this.elHeight = elHeight
        // if (elHeight < 47) {
        //   this.socureElHeight = 47
        // }
        // const el = document.querySelectorAll('.form-view')
        // el.forEach(v => {
        //   if (v && v.offsetHeight > 0) {
        //     let elHeight = v?.offsetHeight || 0
        //     this.elHeight = elHeight
        //     if (elHeight < 47) {
        //       this.socureElHeight = 47
        //     }
        //   }
        // })
        if (this.$refs.formGroup && this.$refs.formGroup.offsetHeight > 0) {
          let elHeight = this.$refs.formGroup?.offsetHeight || 0
          this.elHeight = elHeight
          if (elHeight < 47) {
            this.socureElHeight = 47
          }
        }
      })
    },
    /**
     * @description: 是否展开
     * @param {*}
     * @return {*}
     */

    handleOpen() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.socureElHeight = this.elHeight
      } else {
        this.socureElHeight = 47
      }
    },

    /**
     * @description: 查询
     * @param {*}
     * @return {*}
     */

    handleQuery: debounce(function() {
      this.$emit('query', this.form)
    }, 300),

    /**
     * @description: 重置
     * @param {*}
     * @return {*}
     */

    handleReset: debounce(function() {
      this.initForm()
      this.$emit('reset', this.form)
    }, 300)
  },

  /**
   * @description:
   * @param {*}
   * @return {*}
   */
  render() {
    const {
      formList,
      form,
      isOpen,
      handleReset,
      handleQuery,
      handleOpen,
      elHeight,
      labelWidth,
      labelPosition,
      formConfig,
      itemConfig
    } = this
    return (
      // <div class="form-view-box" style={{ height: socureElHeight + 'px' }}>
      <div class="form-view-box" style={{ height: isOpen ? 'auto' : '32px', transition: 'height 0.3s' }}>
        <section class="form-view" ref="formGroup">
          <anso-form
            ref="asForm"
            class={['v-form', { isopen: isOpen }]}
            v-model={form}
            props={{
              formConfig,
              itemConfig,
              labelPosition,
              formList,
              labelWidth
            }}
          />
        </section>
        <div class="from-view-button-group">
          {elHeight > 47 && (
            <span class="is-open" onClick={handleOpen}>
              {isOpen ? '收起' : '展开'}
              <em class={isOpen ? 'el-icon-caret-top' : 'el-icon-caret-bottom'}></em>
            </span>
          )}
          <el-button size="small" plain onClick={handleReset}>
            重置
          </el-button>
          <el-button size="small" type="primary" ref="formBtn" onClick={handleQuery}>
            查询
          </el-button>
        </div>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
