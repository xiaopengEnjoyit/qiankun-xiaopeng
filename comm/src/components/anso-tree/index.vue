<script>
/**
 *<anso-Tree
        :tree-width="treeWidth"
        :tree-config="treeConfig"
        :tree-event="treeEvent"
        @select="handleSelect"
        @remove="handleRemove"
        @add="handleAdd"
      ></anso-Tree>
 */
import ansoVirtualTree from '../anso-virtual-tree'
import { cloneDeep } from 'lodash'
import { flatten, treeFormat } from '../../utils'
import { ansoButton } from '..'
export default {
  name: 'AnsoTree',
  props: {
    treeEvent: {
      type: Object,
      default() {
        return {}
      }
    },
    treeConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    treeWidth: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    currentNodeKey: {
      type: [String, Number],
      default: ''
    },
    defaultExpandedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    selectConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    // 树的数据量大的时候可以开启此配置，同时在treeConfig配置高度 height: xxx xxx可以是px也可以是100%, 也可以是calc(100%-11px)
    useVirtual: {
      type: Boolean,
      default: false
    },
    nodeType: {
      required: false,
      type: Function,
      default: () => {
        return ''
      }
    },
    suffixRender: {
      required: false,
      type: Function,
      default: () => {
        return ''
      }
    }
  },
  components: { ansoVirtualTree },
  data() {
    return {
      treeValue: '',
      selected: this.selectConfig?.defaultValue || '',
      treeNodes: [],
      isExpand: true,
      treeData: [],
      popoverId: ''
    }
  },
  watch: {
    treeConfig: {
      handler(val) {
        const { data, enable, pIdKey, props, hiddenAllNode } = this.treeConfig
        let treeData = []
        // 是否转换树结构
        if (!enable) {
          treeData = data
        } else {
          treeData = treeFormat(data, props.key, pIdKey)
        }
        // 判断是否需要添加‘全部’
        if (!hiddenAllNode) {
          const allNode = {
            [props.key]: '-100',
            [props.label]: '全部',
            [props.children]: treeData
          }
          this.treeData = [allNode]
        } else {
          this.treeData = treeData
        }
      },
      deep: true,
      immediate: true
    },
    /**
     * 添加人：钱保华
     * 添加时间：2022.5.25
     * 添加原因：修改selectConfig中defaultValue的值，this.selected不会更新。
     * 添加内容：添加selectConfig.defaultValue监控
     */
    'selectConfig.defaultValue': {
      handler(val) {
        this.selected = val
      },
      immediate: true
    },
    treeValue(val) {
      this.treeValue = val.replace(/[#$%<>&\\*\s]/g, '')
      // this.$refs.tree.filter(this.treeValue)
    },
    // 父组件传过来的展开的节点值 赋值给treeNodes
    defaultExpandedKeys(val) {
      this.treeNodes = [...val]
    }
  },
  mounted() {
    this.treeNodes = [...this.defaultExpandedKeys]
    this.$emit('onCreated', this.$refs.tree)
    // 是否伸展/收缩按钮
    if (typeof this.treeConfig?.isExpand !== 'undefined') {
      this.isExpand = this.treeConfig.isExpand
    }
  },
  methods: {
    /**
     * @description:  返回建议数据
     * @param {*} queryString
     * 修改人：钱保华
     * 修改时间：2022.4.29
     * 修改原因：禁用节点在这里可以显示出来，导致可以点击
     * 修改内容：增加createFilterDisabled方法
     * @param {*} cb
     * @return {*}
     */
    querySearch(queryString, cb) {
      const { treeConfig } = this
      if (!treeConfig.data) return
      const tree = cloneDeep(treeConfig.data)
      const restaurants = treeConfig?.enable ? tree : flatten(tree)
      const results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants.filter(this.createFilterDisabled()) //restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },

    /**
     * @description: 过滤
     * @param {*} queryString
     * 修改人：钱保华
     * 修改时间：2022.4.29
     * 修改原因：禁用节点在这里可以显示出来，导致可以点击
     * 修改内容：增加disabled过滤
     * @return {*}
     */
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant[this.treeConfig?.props.label].toLowerCase().indexOf(queryString.toLowerCase()) != -1 &&
          !restaurant.disabled
        )
      }
    },
    createFilterDisabled() {
      return restaurant => {
        return !restaurant.disabled
      }
    },

    /**
     * @description:  搜索
     * 修改这里是因为，在有些情况下还需要当前选中节点的层级信息。
     * @param {*} node
     * @return {*}
     */
    handleSelect(data) {
      this.setCurrentActive(data.id)
      let node = this.$refs.tree.getNode(data.id)
      this.$emit('select', data, node)
    },
    /**
     * @description: 根据node设置树勾选
     * @param {*} node
     * @return {*}
     */
    setCheckedNodes(node) {
      this.$refs.tree.setCheckedNodes(node)
    },
    /**
     * @description: 根据key设置树勾选
     * @param {*} node
     * @return {*}
     */
    setCheckedKeys(key) {
      this.$refs.tree.setCheckedKeys(key)
    },
    /**
     * @description: 根据node 获取树勾选
     * @param {*}
     * @return {*}
     */
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    },
    /**
     * @description: 根据id设置节点高亮
     * @param {*} id
     * @return {*}
     */

    setCurrentActive(id) {
      if (this.treeConfig['show-checkbox']) {
        let data = this.$refs.tree.getCheckedKeys()
        data.push(id)
        this.setCheckedKeys(data)
      }
      this.$refs.tree.setCurrentKey(id)
      // 此处延迟.3s：因为组织树用了ele的展开动画组件el-collapse-transition(通过增减class collapse-transition类)，有.3s的延迟
      setTimeout(() => {
        document.querySelector('.el-tree').scrollTop =
          58 +
          document.querySelector('.el-tree-node.is-current.is-focusable')?.offsetTop -
          document.querySelector('.el-tree').clientHeight / 2
      }, 300)

      this.treeNodes.push(id)
    },
    /**
     * @description: 清除搜索条件
     * @param {*} id
     * @return {*}
     */
    clearSearch() {
      this.treeValue = ''
    },
    /**
     * @description:  新增
     * @param {*} data
     * @return {*}
     */
    handleAdd(data, node) {
      this.$emit('add', data, node)
    },
    /**
     * @description:  编辑
     * @param {*} data
     * @return {*}
     */
    handleEdit(data, node) {
      this.$emit('update', data, node)
    },

    /**
     * @description: 删除
     * @param {*} node
     * @param {*} data
     * @return {*}
     */
    remove(node, data) {
      this.$emit('remove', data)
    },
    /**
     * @description: 节点点击事件
     * @param {*} node  当前节点数据
     * @return {*}
     */
    handlerNodeClick(node, ...args) {
      if (node.disabled) {
        // const ele = document.querySelector('.is-focusable')
        // if (!ele.classList.contains('is-current')) {
        //   ele.classList.add('is-current')
        // }
        return
      }
      this.treeEvent['node-click'] && this.treeEvent['node-click'](node, ...args)
    },
    handlerCheckChange(node, ...args) {
      if (node.disabled) {
        // const ele = document.querySelector('.is-focusable')
        // if (!ele.classList.contains('is-current')) {
        //   ele.classList.add('is-current')
        // }
        return
      }
      this.treeEvent['check-change'] &&
        this.treeEvent['check-change'](this.$refs.tree.getCheckedKeys(), this.$refs.tree.getCheckedNodes(), ...args) //返回增加当前选中的节点参数(getCheckedNodes())
    },
    /**
     * @description: 节点过滤
     * @param {*}
     * @return {*}
     */
    filterNode(value, data) {
      if (!value) return true
      const { props } = this.treeConfig
      // console.log(data)
      // console.log(value)
      // console.log(props)
      return data[props.label].indexOf(value) !== -1
    },
    /**
     * @description: 树结构重绘
     * 修改人：钱保华
     * 修改时间：2022.4.29
     * 修改原因：有的节点需要背景色
     * 修改内容：增加data.class判断，加载自定义class
     * @param {*} node
     * @param {*} data
     * @param {*} store
     * @return {*}
     */
    renderContent({ node, data, store }) {
      const { treeConfig } = this
      const _name = treeConfig.props.label
      const _type = treeConfig.prefixField
      const _icon = treeConfig.showIcon
      // 增加节点不可点击但是可编辑功能
      return (
        <div
          class="node-content"
          on-mouseover={e => {
            if (treeConfig.add || treeConfig.edit || treeConfig.delete) {
              this.popoverId = data.id
            }
          }}
          on-mouseleave={e => {
            // this.popoverId = ''
          }}
        >
          {typeof this.nodeType == 'function' && this.nodeType(node, data, store)}
          <div
            class={['custom-tree-node', !data.disabled ? '' : 'is_disabled']}
            title={data[_name]}
            style={{ backgroundColor: data.backgroundColor ? data.backgroundColor : '' }}
          >
            {_type ? <span class="custom-tree-node-type">{data[_type]}</span> : ''}
            {_icon ? (
              <span
                class={
                  data[treeConfig.showIconLabel] == treeConfig.showIconValue
                    ? 'icon iconfont iconSize iconColorBlue icon-shebei'
                    : 'icon iconfont iconSize iconColorGreen icon-zuzhixitong'
                }
              ></span>
            ) : (
              ''
            )}
            <span class={['custom-tree-node-label', data.class ? data.class : '']}>{data[_name]}</span>
            {typeof this.suffixRender == 'function' && this.suffixRender(node, data, store)}
            {!data.disabled || data.isEdit ? (
              <span class="custom-tree-node-tool">
                {this.popoverId === data.id ? (
                  <el-popover
                    on-hide={e => {
                      this.popoverId = ''
                    }}
                    placement="bottom"
                    width="100"
                    trigger="click"
                    popper-class="tree-node-tool-operation"
                  >
                    {treeConfig.add && !treeConfig.addShow ? (
                      <div
                        class="operation-item"
                        on-click={e => {
                          e.stopPropagation()
                          this.handleAdd(data, node)
                        }}
                      >
                        <ansoButton permission={treeConfig.addPermission} type="text">
                          {treeConfig.addName || '添加子节点'}
                        </ansoButton>
                      </div>
                    ) : (
                      ''
                    )}
                    {treeConfig.edit ? (
                      <div
                        class="operation-item"
                        on-click={e => {
                          e.stopPropagation()
                          this.handleEdit(data, node)
                        }}
                      >
                        <ansoButton permission={treeConfig.editPermission} type="text">
                          编辑
                        </ansoButton>
                      </div>
                    ) : (
                      ''
                    )}
                    {treeConfig.delete ? (
                      <div
                        class="operation-item"
                        on-click={e => {
                          e.stopPropagation()
                          this.remove(node, data)
                        }}
                      >
                        <ansoButton permission={treeConfig.deletePermission} type="text">
                          删除
                        </ansoButton>
                      </div>
                    ) : (
                      ''
                    )}
                    <i
                      slot="reference"
                      class="el-icon-more"
                      on-click={e => {
                        e.stopPropagation()
                      }}
                    ></i>
                  </el-popover>
                ) : (
                  ''
                )}
                {treeConfig.num ? <span>{data.num}</span> : ''}
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
      )
    },

    /**
     * @description:  校验是否同级拖拽
     * @param {*} draggingNode
     * @param {*} dropNode
     * @param {*} type
     * 修改人：钱保华
     * 修改时间：2022.4.24
     * 修改原因：要求根节点（level===1）不能拖拽(即使是同级)
     * 修改内容：1.增加noDrop属性判断，为true则不能拖动（即使是同级）
     * 2.如果是禁用的（disabled=true），也不能移动
     * @return {*}
     */
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.noDrop || draggingNode.data.disabled) {
        return false
      } else {
        if (draggingNode.level === dropNode.level) {
          if (draggingNode.parent.id === dropNode.parent.id) {
            return type === 'prev' || type === 'next'
          }
        } else {
          return false
        }
      }
    },
    selectChange(val) {
      this.$emit('selectChange', val)
      this.$nextTick(() => {
        this.$refs['ansoTreeSelect'].blur()
      })
    },
    /**
     * 修改时间：2022-05-10
     * 修改原因：查询框清空的时候不可再查询的bug，让输入框失去焦点，再获取焦点，实现清空就出现全部查询数据
     * 修改内容：在el-autocomplete节点添加ref和@clear事件，然后下面clearAutocompleteSearch是对应的事件
     * 修改人：罗伟春
     *
     */
    clearAutocompleteSearch() {
      // this.$refs.autocomplete.value = ''
      this.$refs.autocomplete.$children[0].blur()
      this.$nextTick(() => {
        this.treeValue = ''
        this.$refs.autocomplete.focus()
      })
    }
  },

  /**
   * @description:
    <el-input
      class="inline-input"
      prefixIcon="el-icon-search"
      placeholder={placeholder}
      v-model={this.treeValue}
      clearable
      on={{
        input: val => {
          this.treeValue = val.replace(/[#$%<>&\\*\s]/g, '')
        }
      }}
    ></el-input>
   * @param {*}
   * @return {*}
   */

  render() {
    const {
      treeConfig,
      treeWidth,
      allowDrop,
      treeEvent,
      placeholder,
      treeNodes,
      currentNodeKey,
      selectConfig,
      useVirtual
    } = this
    const _name = treeConfig?.props.label
    const _options = selectConfig?.options
    return (
      <div class="anso-tree-wrap" style={{ width: this.isExpand ? treeWidth : '15px' }}>
        <div class="anso-tree" style={{ display: this.isExpand ? 'flex' : 'none' }}>
          {this.$slots.header}
          {/* 下拉框 */}
          {selectConfig?.showSelect ? (
            <div class="anso-tree-select">
              <el-select
                ref="ansoTreeSelect"
                v-model={this.selected}
                class="cus-form-select"
                filterable={selectConfig.filterable ? selectConfig.filterable : false}
                on-change={this.selectChange}
                placeholder={selectConfig.placeholder ? selectConfig.placeholder : '请选择'}
              >
                {Array.isArray(_options) &&
                  _options.map(option => (
                    <el-option
                      key={selectConfig.defaultProps ? option[selectConfig.defaultProps.value] : option['value']}
                      value={selectConfig.defaultProps ? option[selectConfig.defaultProps.value] : option['value']}
                      label={selectConfig.defaultProps ? option[selectConfig.defaultProps.name] : option['label']}
                    />
                  ))}
              </el-select>
            </div>
          ) : (
            ''
          )}
          {/* 搜索 */}
          <div class="anso-tree-search">
            {' '}
            <el-autocomplete
              class="inline-input"
              onSelect={this.handleSelect.bind(this)}
              fetch-suggestions={this.querySearch.bind(this)}
              prefixIcon="el-icon-search"
              placeholder={placeholder}
              v-model={this.treeValue}
              ref="autocomplete"
              clearable
              value-key={_name}
              maxlength={this.treeConfig.maxlength}
              onClear={this.clearAutocompleteSearch}
            ></el-autocomplete>
            {treeConfig.add && !treeConfig.addTopShow ? (
              <ansoButton
                class="plus"
                size="mini"
                icon="el-icon-plus"
                permission={treeConfig.addPermission}
                nativeOnClick={this.$emit.bind(this, 'add', {})}
              ></ansoButton>
            ) : (
              ''
            )}
          </div>
          {/* 标题 */}
          <div class="anso-tree-title">{treeConfig.title}</div>
          {/* 自定义 */}
          {this.$slots.default}
          {/* tree 添加者：罗伟春，添加虚拟节点树 2022-05-26 在组件上添加配置 :useVirtual="true", 同时在treeConfig里添加高度配置height: 'xxx', 否则不会走虚拟树，为了兼容旧的代码业务保留了el-tree*/}
          {useVirtual ? (
            <anso-virtual-tree
              ref="tree"
              highlight-current
              class={[treeConfig.draggable ? 'tree-drag-icon' : '', 'tree']}
              check-on-click-node
              current-node-key={currentNodeKey}
              attrs={{
                'node-key': 'id',
                ...treeConfig,
                title: '',
                data: this.treeData,
                'allow-drop': (...args) => allowDrop(...args),
                'render-content': (h, options) => this.renderContent(options),
                'default-expanded-keys': treeNodes
              }}
              on={{
                ...treeEvent,
                'node-click': this.handlerNodeClick,
                'check-change': this.handlerCheckChange
              }}
            ></anso-virtual-tree>
          ) : (
            <el-tree
              ref="tree"
              highlight-current
              class={[treeConfig.draggable ? 'tree-drag-icon' : '', 'tree']}
              check-on-click-node
              current-node-key={currentNodeKey}
              attrs={{
                'node-key': 'id',
                ...treeConfig,
                title: '',
                data: this.treeData,
                'allow-drop': (...args) => allowDrop(...args),
                'render-content': (h, options) => this.renderContent(options),
                'default-expanded-keys': treeNodes
              }}
              on={{
                ...treeEvent,
                'node-click': this.handlerNodeClick,
                'check-change': this.handlerCheckChange
              }}
              style="flex: 1"
            ></el-tree>
          )}
          {treeConfig.rootNodeAdd && treeConfig.data.length == 0 ? (
            <div class="anso-tree-rootNodeAdd">
              <div class="rootNodeAddTitle">请添加一级业务组织</div>
              <ansoButton
                class="rootNodeAddBtn"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                nativeOnClick={this.$emit.bind(this, 'rootNodeAddBtn', {})}
              >
                业务组织
              </ansoButton>
            </div>
          ) : (
            ''
          )}
        </div>
        {/* 伸展/收缩按钮 */}
        <div
          class="icon-wrap"
          onClick={() => {
            this.isExpand = !this.isExpand
          }}
        >
          <div class="icon-wrap-main">
            <span class={['icon', this.isExpand ? 'el-icon-caret-left' : 'el-icon-caret-right']}></span>
          </div>
        </div>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
<style lang="scss">
.tree-node-tool-operation {
  min-width: 110px;
  padding: 12px 0;

  > .operation-item {
    padding: 0 15px;
    cursor: pointer;

    .el-button--text {
      color: #262626;
      font-size: 12px;
    }

    &:hover {
      background: #f3f5f8;

      .el-button--text {
        color: #3f71f2;
      }
    }
  }
}

.anso-tree .el-tree > .el-tree-node {
  width: 100%;

  .iconSize {
    font-size: 12px;
    margin-right: 4px;
  }

  .iconColorBlue {
    color: #3171f2;
  }

  .iconColorGreen {
    color: #52c41a;
  }
}

.anso-tree-rootNodeAdd {
  position: absolute;
  left: 0;
  right: 0;
  top: 40%;
  text-align: center;

  .rootNodeAddTitle {
    font-size: 12px;
    font-weight: 400;
    color: #626262;
    margin-bottom: 8px;
  }

  .rootNodeAddBtn span {
    color: #fff !important;
  }
}
</style>
