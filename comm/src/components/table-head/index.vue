<script>
import ansoButton from '../anso-button'
import { debounce } from '../../utils'
/**
 * 表格头部
 */
export default {
  name: 'TableHead',
  /**
   * @description:
   * @param {*} h
   * @param {*} props
   * @return {*}
   */
  methods: {
    /**
     * @description: 按钮方法调用
     * @param {*} function 防抖
     * @return {*}
     */
    handleMethods: debounce(function(btn) {
      btn.methods && btn.methods()
    }, 300),
    /**
     * @description: >1 个批量下拉展示
     * @param {*} buttons  按钮组
     * @return {*}
     */
    createButtons(buttons) {
      const batch = []
      const ordinary = []
      let len = buttons.length
      for (let i = 0; i < len; i++) {
        // 这里直接根据‘批量’两个字来判断是否合并显示，不合理。存在有这两个字，但不需要合并的情况
        if (buttons[i].name.includes('批量') && !buttons[i].noMerge) {
          batch.push(buttons[i])
        } else {
          ordinary.push(buttons[i])
        }
      }
      if (batch.length > 1) {
        const { btnTabInfo } = this.$route?.meta
        const permissionList = btnTabInfo || []
        return (
          <div>
            {this.createOrdinaryButton(ordinary)}
            <el-dropdown class="dropdown">
              <el-button icon="iconfont icon-product-category">
                批量<i class="el-icon-caret-bottom el-icon-caret-top"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                {batch.map(item => {
                  let hasPermission = permissionList.some(p => p.funcCode === item.permission)
                  if (item.permission === undefined) {
                    hasPermission = true
                  }

                  return hasPermission ? (
                    <el-dropdown-item nativeOnClick={() => item.methods && item.methods()}>
                      {item.name}
                    </el-dropdown-item>
                  ) : (
                    ''
                  )
                })}
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        )
      } else {
        return this.createOrdinaryButton(buttons)
      }
    },
    /**
     * @description: 按钮渲染
     * @param {*} buttons 按钮组
     * @return {*}
     */
    createOrdinaryButton(buttons) {
      return buttons.map(btn => {
        return btn.custom ? (
          btn.custom()
        ) : (
          <ansoButton
            size={btn.size}
            type={btn.type}
            icon={btn.icon}
            onClick={this.handleMethods.bind(this, btn)}
            permission={typeof btn.permission === 'function' ? btn.permission() : btn.permission}
            disabled={typeof btn.disabled === 'function' ? btn.disabled() : btn.disabled}
            class={btn.class}
          >
            {btn.name}
          </ansoButton>
        )
      })
    }
  },
  render() {
    const { title, subtitle, buttons } = this.$attrs.headerConfig
    return (
      <div class="table-head">
        <div class="table-head-title">
          {title}
          {subtitle ? <span class="sub_title">{subtitle}</span> : ''}
        </div>
        {Array.isArray(buttons) ? <div class="table-head-btns">{this.createButtons(buttons)}</div> : ''}
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
