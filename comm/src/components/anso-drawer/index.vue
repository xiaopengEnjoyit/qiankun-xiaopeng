<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Seven
 * @Date: 2022-10-11 15:08:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-22 17:00:39
-->

<script>
export default {
  name: 'ansoDrawer',
  props: {
    title: {
      require: false,
      type: String,
      default: () => {
        return ''
      }
    },
    appendToBody: {
      require: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    destroyOnClose: {
      require: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    size: {
      require: false,
      type: String,
      default: () => {
        return 'small'
      }
    },
    direction: {
      require: false,
      type: String,
      default: () => {
        return 'rtl' // 取值范围{rtl / ltr / ttb / btt}
      }
    },
    isValidate: {
      require: false,
      type: Boolean,
      default: () => {
        return false
      }
    },
    isShowFooter: {
      require: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    customClass: {
      require: false,
      type: String,
      default: () => {
        return 'custom-drawer'
      }
    },
    titleRender: {
      require: false,
      type: Function,
      default: () => {
        return () => {}
      }
    },
    wrapperClosable: {
      require: true,
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  data() {
    return {
      drawer: false
    }
  },
  methods: {
    close(done) {
      typeof done === 'function' && done()
      this.drawer = false
      this.$emit('cancel')
    },
    submit() {
      if (this.isValidate) {
        this.$emit('submitValidate')
      } else {
        this.$emit('submit')
        this.drawer = false
      }
    },
    submitValidate() {
      this.$emit('submitValidate')
    },
    open() {
      this.drawer = true
    },
    returnWidth() {
      switch (this.size) {
        case 'small':
          return '484px'
        case 'large':
          return '900px'
      }
    }
  },
  render(h) {
    return (
      <el-drawer
        props={this.$attrs}
        title={this.title}
        visible={this.drawer}
        with-header={!!this.title}
        before-close={this.close}
        append-to-body={this.appendToBody}
        custom-class={this.customClass}
        destroy-on-close={this.destroyOnClose}
        size={this.returnWidth()}
        wrapperClosable={this.wrapperClosable}
        on={{
          close: () => {
            this.$emit('close')
          }
        }}
      >
        <template slot="title">{this.titleRender && this.titleRender()}</template>
        <div class="drawer-body">
          <div class="drawer-main">{this.$slots.default}</div>
          {this.isShowFooter ? (
            this.$slots?.footer ? (
              <div class="drawer-footer">{this.$slots.footer}</div>
            ) : (
              <div class="drawer-footer">
                <el-button onClick={this.close}>取消</el-button>
                <el-button type="primary" onClick={this.submit}>
                  确定
                </el-button>
              </div>
            )
          ) : (
            ''
          )}
        </div>
      </el-drawer>
    )
  }
}
</script>

<style lang="scss" scoped>
$padding: 16px 24px;
.drawer-body {
  display: flex;
  flex-direction: column;
  height: 100%;

  .drawer-main {
    flex: 1;
    padding: $padding;
    overflow-y: auto;
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    height: 28px;
    padding: 16px 24px;
    // position: absolute;
    // bottom: 0;
    background: white;
    width: calc(100% - 56px);
    // border-top: 1px solid #eeeeee;

    > button {
      // margin: 10px 24px;
    }
  }
}
/deep/.el-drawer__body {
  overflow: hidden;
}
</style>

<style lang="scss">
$padding: 16px 24px;
.custom-drawer {
  .el-drawer__header {
    margin: 0;
    padding: $padding;
    height: 56px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);

    > span {
      font-weight: 500;
      font-size: 16px;
      color: #262626;
    }

    > button {
      outline: none;
    }
    .el-dialog__close {
      font-size: 14px;
      color: #bfbfbf;
    }
  }
}
</style>
