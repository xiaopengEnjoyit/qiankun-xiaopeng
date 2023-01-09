<script>
/**
 * @description: 权限按钮
 * @param {*}
 * @return {*}
 */
export default {
  name: 'AnsoButton',
  data() {
    return {
      metaInfo: this.$route?.meta
    }
  },
  methods: {
    /**
     * @description: 校验按钮权限是否存在
     * @param {*} permission 权限
     * @return {*} boolean
     */
    isPermission() {
      const { btnTabInfo } = this.metaInfo
      const { permission } = this.$attrs
      // IOT:140011
      const permissionList = btnTabInfo || []
      let hasPermission = permissionList.some(p => p.funcCode === permission)
      if (permission === undefined) {
        hasPermission = true
      }
      if (hasPermission) {
        return (
          <el-button attrs={this.$attrs} on={this.$listeners}>
            {this.$slots.default}
          </el-button>
        )
      }
    }
  },
  render() {
    return this.isPermission()
  }
}
</script>
