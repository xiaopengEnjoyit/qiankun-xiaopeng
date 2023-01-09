<script>
export default {
  name: 'ansoTitle',
  props: {
    title: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    }
  },
  render() {
    if (this.title) {
      return (
        <div class="header-title">
          <span>{this.title}</span>
        </div>
      )
    }
    return false
  }
}
</script>
<style lang="scss" scoped>
.header-title {
  padding-bottom: 5px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 15px;
  > span {
    line-height: 12px;
    border-left: 3px solid #3171f2;
    display: inline-block;
    padding-left: 5px;
  }
}
</style>
