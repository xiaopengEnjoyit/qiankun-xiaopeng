<script>
export default {
  name: 'formTopTitle',
  props: {
    formTop: {
      required: true,
      type: Object,
      default: () => {
        return {
          title: '',
          btns: []
        }
      }
    }
  },
  render() {
    return (
      <div class="form-top">
        <span class="title">
          <i
            class="el-icon-arrow-left"
            onClick={() => {
              this.$router && this.$router.go(-1)
            }}
          ></i>
          {this.formTop.title}
        </span>
        <div class="btns">
          {this.formTop.btns.map(m => {
            let { type, size, disabled, label, method } = m
            return (
              <el-button
                type={type}
                size={size}
                disabled={disabled}
                onClick={() => {
                  typeof method === 'function' && method(this.form)
                }}
              >
                {label}
              </el-button>
            )
          })}
        </div>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
.form-top {
  display: flex;
  position: static;
  align-items: center;
  justify-content: space-between;
  padding-top: 25px;
  font-weight: 600;
  padding-bottom: 22px;
  position: sticky;
  top: 0px;
  z-index: 1000;
  background: #fff;

  .title {
    font-size: 18px;
    color: #262626;
    display: flex;
    align-items: center;
    > i {
      margin-right: 5px;
      cursor: pointer;
    }
  }

  .btns {
    > * {
      margin-left: 10px;
    }
  }
}
</style>
