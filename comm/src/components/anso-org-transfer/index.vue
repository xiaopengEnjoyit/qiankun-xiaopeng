<template>
  <anso-modal :visible.sync="visible" :modalConfig="modalConfig" :buttonConfig="buttonConfig">
    <div class="change-wray">
      <div class="change-wray-left">
        <anso-Tree
          :tree-width="treeWidth"
          :tree-config="treeConfig"
          :tree-event="treeEvent"
          :defaultExpandedKeys="defaultExpandedKeys"
          ref="orgTree"
          :currentNodeKey="currentNodeKey"
          @select="checkKeys"
        ></anso-Tree>
      </div>
      <div class="change-wray-right">
        <div class="change-wray-right-top">
          指定类型：
          <el-radio-group v-model="orgType">
            <template v-for="item in categaryList">
              <el-radio :label="item" :key="item">{{ categaryInfo[item] }}</el-radio>
            </template>
          </el-radio-group>
        </div>
        <div class="org-choose-list" v-if="orgType === 'ORG'">
          <div>已选组织</div>
          <el-tree :default-expand-all="true" :data="chooseOrgTreeFormatData" :props="treeConfig.props"></el-tree>
        </div>
        <anso-transfer
          v-if="orgType === 'USER'"
          ref="org"
          :originData="gnOriginData"
          :checkedData.sync="checkedData1"
          :tranConfig="tranConfig"
        ></anso-transfer>
      </div>
    </div>
  </anso-modal>
</template>
<script>
import { ansoModal, ansoTransfer } from 'comm/src/components'
import commStore from 'comm/src/store'
import { GET_USER_INFOS_KEY, SUCCESS_CODE } from 'comm/src/config'
import { getOrgTreeList, getOrgUserList } from 'comm/src/services'
import { treeFormat, formatList } from 'comm/src/utils/utils'
export default {
  name: 'AnsoOrgTransfer',
  props: {
    systemCodes: {
      type: String,
      default: ''
    },
    orgData: {
      type: Object,
      default: () => {}
    },
    categaryList: {
      type: Array,
      default: () => {
        return ['USER'] // 可配置'ORG', 'ROLE', 'USER',默认只有USER
      }
    }
  },
  components: { ansoModal, ansoTransfer },
  data() {
    return {
      visible: false,
      rowId: '',
      gnOriginData: [],
      cusOriginData: [],
      checkedData1: [],
      checkedData2: [],
      checkedData3: [],
      checkedData4: [],
      tranConfig: {
        label1: 'userName',
        leftTitle: '未选择',
        rightTitle: '已选择'
      },
      modalConfig: {
        title: '选择人员',
        width: '720px',
        'destroy-on-close': true
      },
      buttonConfig: [
        {
          name: 'qx',
          text: '取消',
          method: () => {
            this.visible = false
          }
        },
        {
          name: 'qd',
          text: '确定',
          type: 'primary',
          method: () => {
            this.handleSubmit()
          }
        }
      ],
      /* 下拉选树配置 */
      /*树的配置 */
      treeWidth: '226px',
      treeConfig: {
        'node-key': 'id',
        'expand-on-click-node': true,
        'show-checkbox': true,
        hiddenAllNode: true,
        title: '组织',
        data: [], // 数据
        props: {
          children: 'children',
          label: 'orgName',
          key: 'id'
        },
        'default-checked-keys': []
      },
      treeEvent: {
        'node-click': this.nodeClick,
        check: this.checkKeys
      },
      currentNodeKey: '-100',
      defaultExpandedKeys: ['-100'],
      /*单选*/
      orgType: this.categaryList[0],
      // 当前选中的组织id集合
      orgIds: [],
      categaryInfo: {
        ORG: '组织',
        ROLE: '角色',
        USER: '人员'
      },
      /*组织*/
      treeOriginData: [], // 组织树的源数据,没做过format前的
      chooseOrgTreeData: [],
      chooseOrgTreeFormatData: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.getOrgTreeList()
    },
    async initData(data) {
      if (!data.type && !data.orgs) return
      this.orgType = data.type
      await this.getOrgUserList(data.orgs)
      this.treeConfig['default-checked-keys'] = data.orgs
      this.defaultExpandedKeys = data.orgs
      // this.filterChooseOrgTree(data.targetIds)
    },
    checkKeys(data, check) {
      this.getOrgUserList(check.checkedKeys)
      this.filterChooseOrgTree(check.checkedKeys)
      // if (this.orgType === 'USER') {

      // }
      // if (this.orgType === 'ORG') {

      // }
    },
    /**
     * @description: 获取权限数据  0 系统默认 1 自定义 2 租户主账号默认服务权限
     * @param {*}
     * @return {*}
     */
    // async getGnData() {
    //   let { data } = await userGnAuth({
    //     id: this.rowId,
    //     searchKey: ''
    //   })
    //   data = data || []
    //   this.gnOriginData = data.filter(v => !v.createType)
    //   this.cusOriginData = data.filter(v => v.createType)
    // },
    // 当前是组织的时候,通过树的源数据进行过滤,得到当前选中的组织树数据
    filterChooseOrgTree(ids) {
      this.chooseOrgTreeData = this.treeOriginData.filter(item => ids.includes(item.id))
      this.chooseOrgTreeFormatData = treeFormat(this.chooseOrgTreeData, 'id', 'pid')
    },

    async getOrgTreeList() {
      let params = {}
      // let currentSysCode = null
      // const currentApp = sessionStorage.getItem('currentApp')
      // const appList = commStore.getters[`${GET_USER_INFOS_KEY}/appList`]
      // if (currentApp) {
      //   currentSysCode = appList.filter(item => item.name === currentApp.split('/')[1])[0]?.subSys
      // }
      params.systemCodes = this.systemCodes //
      const { code, data } = await getOrgTreeList(params)
      if (code === SUCCESS_CODE) {
        this.treeOriginData = data
        this.treeConfig.data = treeFormat(data, 'id', 'pid')
      }
    },
    // 获取组织对应的人员
    async getOrgUserList(orgIds) {
      let param = {}
      // param.queryUserListFrom = {}
      param.orgIds = [...orgIds]
      this.orgIds = orgIds
      const { code, data } = await getOrgUserList(param)
      if (code === SUCCESS_CODE) {
        this.gnOriginData = data
        if (this.orgData?.targetIds) {
          let checkData = this.gnOriginData.filter(item => this.orgData.targetIds.includes(item.userId))
          checkData.forEach(item => {
            item.checked = true
          })
          this.checkedData1 = checkData
        }
      }
    },

    async handleSubmit() {
      let targetIdsList = []
      let data = {}
      let dataKey = '' // 获取数据对应的id
      switch (this.orgType) {
        case 'ROLE':
          dataKey = 'roleId' // todo roleId是随意写的，目前没有接口返回数据，还不知道具体是哪个字段
          break
        case 'USER':
          targetIdsList = [...this.checkedData1, ...this.checkedData2]
          dataKey = 'userId'
          break
        case 'ORG':
          targetIdsList = [...this.chooseOrgTreeData]
          dataKey = 'id'
          break
        default:
          dataKey = 'userId'
      }
      if (!targetIdsList.length) {
        console.log('targetIdsList', targetIdsList)
        this.$emit('changeOrgData', null)
        return
      }
      data.orgs = this.orgIds
      data.type = this.orgType
      data.targetIds = targetIdsList.map(item => item[dataKey])
      data.targetInfos = targetIdsList
      this.$emit('changeOrgData', data)
    }
  },
  watch: {
    orgData: {
      handler(newVal, oldVal) {
        this.initData(newVal)
      }
    },
    orgType: {
      handler(newVal, oldVal) {
        this.initData(newVal)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
