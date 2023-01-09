<script>
export default {
  name: 'AnsoCollapseItem',
  props: {
    openText: {
      type: String,
      default: '展开'
    },
    closeText: {
      type: String,
      default: '收起'
    },
    title: {
      type: String,
      default: '标题'
    },
    name: {
      type: [String, Number],
      default: '0'
    },
    collapseItemName: {}
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    renderCollapseItem() {
      const titleSlot = this.$scopedSlots.title
      return (
        <el-collapse-item name={this.name} class="anso-collapse-item">
          <template slot="title">
            <div class="anso-collapse-title">
              {titleSlot ? titleSlot(this.name) : <span>{this.title}</span>}
              <div class="anso-collapse-title-tips">
                {this.collapseItemName.includes(this.name) ? this.closeText : this.openText}
              </div>
            </div>
          </template>
          {this.$slots.default}
        </el-collapse-item>
      )
    }
  },
  render() {
    return this.renderCollapseItem()
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
