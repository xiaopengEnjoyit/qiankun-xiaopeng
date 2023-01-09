<script>
// 组件未完成，请不要使用
import ansoCollapseItem from './anso-collapse-item'
export default {
  name: 'AnsoCollapse',
  props: {
    collapseName: {},
    openText: {
      type: String,
      default: '展开'
    },
    closeText: {
      type: String,
      default: '收起'
    },
    collapseTitle: {
      type: String,
      default: '标题'
    },
    collapseItemName: {
      type: [String, Number],
      default: '0'
    }
  },
  components: {
    ansoCollapseItem
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    renderCollapseItemList(itemList) {
      return itemList.map(item => {
        const titleSlot = item.$scopedSlots.title
        return (
          <anso-collapse-item name={item.collapseItemName} collapseItemName={this.collapseName}>
            {titleSlot ? titleSlot(item) : <span>{item.title}</span>}
            {item.$slots.default}
          </anso-collapse-item>
        )
      })
    }
    // renderCollapseItemList2(itemList) {
    //   return itemList.map(item => {
    //     const titleSlot = this.$scopedSlots.title
    //     return (
    //       <el-collapse-item name={item.name}>
    //         <template slot="title">
    //           <div class="anso-collapse-title">
    //             {titleSlot ? titleSlot(item) : <span>{item.title}</span>}
    //             <div>{this.openText}</div>
    //           </div>
    //         </template>
    //         {this.$slots.default}
    //       </el-collapse-item>
    //     )
    //   })
    // }
  },
  render() {
    return <el-collapse prop={{ model: this.collapseName }}>{this.renderCollapseItem()}</el-collapse>
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
