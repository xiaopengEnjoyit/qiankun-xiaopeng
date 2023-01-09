<script>
export default {
  name: 'AnsoTransfer',
  props: {
    originData: {
      type: Array,
      default: () => []
    },
    tranConfig: {
      type: Object,
      default: () => ({
        label1: 'name',
        leftTitle: '可选权限',
        rightTitle: '已选权限',
        disabled: false
      })
    }
  },
  data() {
    return {
      clearClick: false,
      optional: 0,
      input1: '',
      input2: '',
      checkAll: false,
      isIndeterminate: false,
      leftData: [],
      rightData: [],
      checkedData: [],
      filterData: [],
      filterRight: []
    }
  },
  watch: {
    input1(n, o) {
      this.input1 = this.input1.replace(/[#$%<>&\\*\s]/g, '')
      if (n) {
        this.filterData = this.leftData.filter(val => this.handleFilter(val, n))
      } else {
        this.filterData = this.leftData
      }
      this.leftNum()
    },
    input2(n, o) {
      this.input2 = this.input2.replace(/[#$%<>&\\*\s]/g, '')
      if (n) {
        this.filterRight = this.rightData.filter(val => this.handleFilter(val, n))
      } else {
        this.filterRight = this.rightData
      }
    },
    rightData(n, o) {
      this.filterRight = n
      this.leftNum()
      this.checkedData = []
      this.originData.forEach(v => {
        let label = ''
        if (this.tranConfig.label2) {
          label = `${v[this.tranConfig.label1]} (${v[this.tranConfig.label2]})`
        } else {
          label = v[this.tranConfig.label1]
        }
        if (n.includes(label)) {
          this.checkedData.push(v)
        }
      })
      this.$emit('update:checkedData', this.checkedData)
    },
    originData: {
      handler(n, o) {
        // if (n && n.length) {
        // console.log('bbbb', n)
        this.init()
        // }
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true
    }
  },
  methods: {
    init() {
      this.rightData = []
      this.leftData = []
      this.filterData = []
      this.checkedData = []
      this.originData.forEach(v => {
        let label = ''
        if (this.tranConfig.label2) {
          label = `${v[this.tranConfig.label1]} (${v[this.tranConfig.label2]})`
        } else {
          label = v[this.tranConfig.label1]
        }
        if (v.checked) {
          this.rightData.push(label)
        }
        this.leftData.push(label)
      })
      this.filterData = this.leftData
      this.filterRight = this.rightData
      this.optional = this.leftData.length - this.rightData.length
    },
    handleCheckAllChange(val) {
      if (val || this.clearClick) {
        // 过滤掉不能选的数据
        if (this.tranConfig.customDisabled && this.tranConfig.customDisabled.length) {
          let data = this.filterData.filter(v => !this.tranConfig.customDisabled.includes(v))
          this.rightData = [...new Set([...data, ...this.rightData])]
        } else {
          this.rightData = [...new Set([...this.filterData, ...this.rightData])]
        }
      } else {
        let arr = []
        this.rightData.forEach(v => {
          if (
            !this.filterData.includes(v) ||
            (this.tranConfig.customDisabled && this.tranConfig.customDisabled.includes(v))
          ) {
            arr.push(v)
          }
        })
        this.rightData = arr
        this.isIndeterminate = false
      }
      this.clearClick = false
    },
    handleDataChange(value) {
      this.rightData = value
      let are = false
      let none = false
      this.filterData.forEach(v => {
        if (value.includes(v)) {
          are = true
        } else {
          none = true
        }
      })
      if (are) {
        if (none) {
          //半选
          this.checkAll = false
          this.isIndeterminate = true
        } else {
          // 全选
          this.checkAll = true
          this.isIndeterminate = false
        }
      } else {
        // 没有选中项
        this.checkAll = false
        this.isIndeterminate = false
      }
      this.clearClick = false
    },
    handleFilter(val, n) {
      return val.indexOf(n) > -1
    },
    handleClear() {
      if (!this.tranConfig.disabled) {
        // 过滤不能清除的数据，其余清除
        this.clearClick = true
        let data = []
        if (this.tranConfig.customDisabled && this.tranConfig.customDisabled.length) {
          data = this.rightData.filter(v => this.tranConfig.customDisabled.includes(v))
        }

        this.rightData = data
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    handleRemoveItem(i) {
      this.rightData.splice(i, 1)
      if (this.rightData.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      } else {
        this.isIndeterminate = true
        this.checkAll = false
      }
      this.clearClick = false
    },
    leftNum() {
      this.optional = 0
      this.filterData.forEach(v => {
        if (!this.rightData.includes(v)) {
          this.optional++
        }
      })
      if (this.optional === 0) {
        if (this.filterData.length) {
          // 全选
          this.checkAll = true
          this.isIndeterminate = false
        } else {
          // 没数据
          this.checkAll = false
          this.isIndeterminate = false
        }
      } else if (this.optional === this.filterData.length) {
        // 没有选中项
        this.checkAll = false
        this.isIndeterminate = false
      } else {
        // 半选
        this.checkAll = false
        this.isIndeterminate = true
      }
    }
  },
  render() {
    return (
      <div class="tran-all">
        <section>
          <div class="tran-head">
            <div class="tran-head-left">
              {this.tranConfig.leftTitle} (<span>{this.optional}</span>)
            </div>
            <div class="tran-head-right">
              <el-input
                placeholder="搜索"
                clearable
                prefix-icon="el-icon-search"
                v-model={this.input1}
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="tran-con">
            <div class="tran-con-cka">
              <el-checkbox
                indeterminate={this.isIndeterminate}
                v-model={this.checkAll}
                onChange={this.handleCheckAllChange}
                disabled={this.tranConfig.disabled}
              >
                全选
              </el-checkbox>
              <div class="tran-line"></div>
            </div>
            <div class="tran-con-item">
              <el-checkbox-group
                v-model={this.rightData}
                onChange={this.handleDataChange}
                disabled={this.tranConfig.disabled}
              >
                {this.filterData.map(item => (
                  <el-checkbox
                    label={item}
                    title={item}
                    disabled={this.tranConfig.customDisabled && this.tranConfig.customDisabled.includes(item)}
                  >
                    {item}
                  </el-checkbox>
                ))}
              </el-checkbox-group>
            </div>
          </div>
        </section>
        <section>
          <div class="tran-head">
            <div class="tran-head-left">
              {this.tranConfig.rightTitle} (<span>{this.rightData.length}</span>)
            </div>
            <div class="tran-head-right">
              <el-input
                placeholder="搜索"
                prefix-icon="el-icon-search"
                v-model={this.input2}
                clearable
                size="mini"
              ></el-input>
            </div>
          </div>
          <div class="tran-con tran-con-right">
            <div class="tran-con-list">
              <ul>
                {this.filterRight.map((item, i) => (
                  <li>
                    <span title={item}>{item}</span>
                    {!this.tranConfig.customDisabled || !this.tranConfig.customDisabled.includes(item) ? (
                      <i
                        class={[this.tranConfig.disabled ? '' : 'icon-show', 'iconfont icon-no']}
                        onClick={this.handleRemoveItem.bind(this, i)}
                      ></i>
                    ) : (
                      ''
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            class={this.tranConfig.disabled ? 'tran-con-noclear' : 'tran-con-clear'}
            onClick={this.handleClear.bind(this)}
          >
            清空
          </div>
        </section>
      </div>
    )
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
