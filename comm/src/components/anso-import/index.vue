<!--
示例：
<anso-import
      ref="imt"
      fileCode="function_template"
      :url="url"
      :params="params"
      :showImport.sync="showImport"
      @updatePage="updatePage"
    >

    </anso-import>

    fileCode：获取文件编码参数
    url: {
        importUrl: '/api/iam/plat/function/functionImport',导入接口地址
        downUrl: '/api/iam/plat/file/downloadFile',下载接口地址
        fileUrl: '/api/iam/plat/fileTemplate/getFileId'文件编码接口地址
      },
      params: {},上传自定义参数
      title: '批量导入'//模态框标题,
      showImport:显示dialog
      fileSize：限制文件大小,默认10M
-->
<template>
  <anso-modal
    @close="closeDialog"
    @submit="handleSubmit"
    :visible.sync="visible"
    :modalConfig="modalConfig"
    ref="imo"
    :buttonConfig="buttonConfig"
  >
    <!-- 导入 -->
    <section class="imt_start" v-show="importActiveName === 0">
      <div class="imt-tips" v-if="titleMsg">
        <i class="el-icon-warning"></i>
        <span v-html="titleMsg"></span>
      </div>
      <div class="tab__footer" v-show="isUpload">
        <el-upload
          ref="uploadExcel"
          class="import_class"
          :accept="accept"
          drag
          action=""
          multiple
          :auto-upload="false"
          :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadHttpRequest"
          :on-success="handleAvatarSuccess"
          :on-change="fileChange"
          :show-file-list="false"
        >
          <i class="iconfont icon-document load-icon"></i>
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
          <p>支持扩展名：{{ accept }}，只支持单个文件上传，不超过{{ fileSize }}M</p>
          <!-- <div
            class="el-upload__tip"
            slot="tip"
          >只能上传jpg/png文件，且不超过500kb</div> -->
        </el-upload>
        <div class="import__btn link" @click="downloadTemplate" v-if="url.fileUrl !== ''">
          <i class="iconfont icon-download"></i>
          <span>下载示例模板</span>
        </div>
      </div>
      <div class="imt_file" v-show="!isUpload">
        <em class="iconfont icon-excel"></em>
        <h1>{{ loadFile.name }}</h1>
        <p>{{ loadFile.size }}</p>
        <div class="import__btn link" @click="downloadTemplate" v-if="url.fileUrl !== ''">
          <i class="iconfont icon-download"></i>
          <span>下载示例模板</span>
        </div>
      </div>
    </section>
    <!-- 导入成功 -->
    <section class="tab_success imt_start" v-if="importActiveName === 1">
      <div class="imt_file imt-sus">
        <em class="iconfont icon-success"></em>
        <h1>导入成功</h1>
        <p>共导入{{ successNum }}条</p>
        <div class="import__btn link" @click="downloadTemplate" v-if="url.fileUrl !== ''">
          <i class="iconfont icon-download"></i>
          <span>下载示例模板</span>
        </div>
      </div>
    </section>
    <!-- 导入失败1 -->
    <section class="tab__second imt_start" v-if="importActiveName === 2">
      <div class="imt_file imt-error" :class="showLoadError ? '' : 'imt_noDown'">
        <em class="iconfont icon-hint"></em>
        <h1>文件导入失败</h1>
        <p>{{ errorMsg }}</p>
        <a v-if="showLoadError" href="javascript:;" @click="downloadTemplate(true)" class="link">下载失败记录</a>
        <div class="import__btn link" @click="downloadTemplate" v-if="url.fileUrl !== ''">
          <i class="iconfont icon-download"></i>
          <span>下载示例模板</span>
        </div>
      </div>
    </section>
    <el-upload
      class="upload-btn"
      ref="uploadBtn"
      :accept="accept"
      action=""
      :auto-upload="false"
      :file-list="fileList"
      :before-upload="beforeAvatarUpload"
      :http-request="uploadHttpRequest"
      :on-success="handleAvatarSuccess"
      :on-change="fileChange"
      :show-file-list="false"
    >
      <el-button slot="trigger" size="small" ref="restBtn" class="up-btn" @click="firstChange = true"
        >重新上传</el-button
      >
    </el-upload>
  </anso-modal>
</template>

<script>
import { importExcel, exportExcel, getFileCode } from '../../services'
export default {
  name: 'ansoImport',
  props: {
    fileCode: String,
    url: {
      type: Object,
      default() {
        return {
          importUrl: '',
          downUrl: '',
          fileUrl: ''
        }
      }
    },
    params: {
      type: Object,
      default: () => ({})
    },
    fileSize: {
      type: Number,
      default: 10
    },
    showImport: {
      type: Boolean,
      default: false
    },
    titleMsg: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: '.xls,.xlsx'
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      showLoadError: false,
      successNum: 0,
      fileParams: {},
      errorFileID: '',
      templateName: 'template',
      errorMsg: '',
      modalConfig: {
        title: '',
        width: '484px'
      },
      buttonConfig: [
        {
          name: 'reset',
          text: '重新上传',
          method: () => {
            this.$refs.restBtn.$el.click()
          }
        },
        {
          name: 'qx',
          text: '取消',
          method: () => {
            this.closeDialog()
          }
        },
        {
          name: 'import',
          text: '导入',
          type: 'primary',
          method: () => {
            this.submitUpload()
          }
        }
      ],
      isUpload: true,
      loadFile: {
        name: '',
        size: ''
      },
      // visible: false,
      importActiveName: 0,
      action: '', //`${process.env.VUE_APP_BASEURL + this.importUrl}`,
      headers: {
        Authorization:
          JSON.parse(sessionStorage.getItem('token')).token_type +
          ' ' +
          JSON.parse(sessionStorage.getItem('token')).access_token
      },
      // successCount: 0,
      failData: [],
      fileList: [],
      menuOptions: [],
      firstChange: true
      // percentage: 0
    }
  },
  watch: {
    importActiveName: {
      handler(n, o) {
        if (n === 0) {
          if (o === 1 || o === 2) {
            this.buttonConfig = [
              {
                name: 'reset',
                text: '重新上传',
                method: () => {
                  this.$refs.restBtn.$el.click()
                }
              },
              {
                name: 'qx',
                text: '取消',
                method: () => {
                  this.closeDialog()
                }
              },
              {
                name: 'import',
                text: '导入',
                type: 'primary',
                method: () => {
                  this.submitUpload()
                }
              }
            ]
          } else {
            this.buttonConfig = [
              {
                name: 'qx',
                text: '取消',
                method: () => {
                  this.closeDialog()
                }
              },
              {
                name: 'import',
                text: '导入',
                type: 'primary',
                method: () => {
                  this.submitUpload()
                }
              }
            ]
          }
        } else if (n === 1) {
          this.buttonConfig = [
            {
              name: 'reset',
              text: '重新上传',
              method: () => {
                this.$refs.restBtn.$el.click()
              }
            },
            {
              name: 'wc',
              text: '完成',
              type: 'primary',
              method: () => {
                this.closeDialog()
              }
            }
          ]
        } else if (n === 2) {
          this.buttonConfig = [
            {
              name: 'clo',
              text: '关闭',
              method: () => {
                this.closeDialog()
              }
            },
            {
              name: 'reset',
              text: '重新上传',
              type: 'primary',
              method: () => {
                this.$refs.restBtn.$el.click()
              }
            }
          ]
        }
      },
      immediate: true
    },
    title: {
      handler(n, o) {
        this.modalConfig.title = n
      },
      immediate: true
    },
    showImport: {
      handler(n, o) {
        this.visible = n
        n && this.init()
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.importActiveName = 0
      // this.visible = true
      this.successCount = 0
      this.failData = []
      this.firstChange = true
      this.showLoadError = false
      this.getFileCode()
    },
    async getFileCode() {
      if (this.url.fileUrl === '') {
        return false
      }
      let url = this.url.fileUrl
      if (this.fileCode) {
        url = `${url}/${this.fileCode}`
      }
      const { code, data } = await getFileCode('', url)
      this.fileParams = data || {}
    },
    // 取消
    closeDialog() {
      this.$refs.uploadBtn && this.$refs.uploadBtn.clearFiles() //清除上传文件对象
      this.$refs.uploadExcel && this.$refs.uploadExcel.clearFiles()
      this.fileList = [] //清空选择的文件列表
      this.importActiveName = null
      this.isUpload = true
      this.failData = []
      // this.visible = false
      this.$emit('update:showImport', false)
    },
    async downloadTemplate(type) {
      let fileId = this.fileParams.fileId
      if (type === true) {
        fileId = this.errorFileID
      }
      if (fileId) {
        await exportExcel({ fileId: fileId }, this.url.downUrl)
      } else {
        this.$message.error('模板不存在')
      }
    },
    beforeAvatarUpload(file) {},
    /**
     * @auther qbh
     * @time 2021-12-15
     * @description:文件发生改变触发
     * @description：firstChange为true表示选择文件进入，false表示文件上传成功或失败进入
     * @param {*}
     * @return {*}
     * @example
     */
    fileChange(file, fileList) {
      let fn = file.name.substring(file.name.lastIndexOf('.'))
      if (this.accept.indexOf(fn) > -1) {
        if (this.firstChange) {
          if (this.importActiveName === 1 || this.importActiveName === 2) {
            this.isUpload = false
            this.importActiveName = 0
          }

          if (file.size / 1024 / 1024 < this.fileSize) {
            if (fileList.length > 1) {
              fileList.shift()
              this.fileList = fileList
            } else {
              this.fileList = fileList
            }
            this.loadFile.name = file.name
            if (file.size / 1024 / 1024 < 1) {
              this.loadFile.size = parseInt((file.size / 1024) * 10) / 10 + 'KB'
            } else {
              this.loadFile.size = parseInt((file.size / 1024 / 1024) * 10) / 10 + 'M'
            }
            if (this.buttonConfig[0].text && this.buttonConfig[0].text === '取消') {
              this.buttonConfig.unshift({
                name: 'reset',
                text: '重新上传',
                method: () => {
                  this.$refs.restBtn.$el.click()
                }
              })
            }
            this.isUpload = false
          } else {
            this.$message.error(`请选择少于${this.fileSize}M的文件`)
          }
        }
        this.firstChange = false
      } else {
        this.$message.error(`请上传后缀为${this.accept}的文件`)
      }
    },
    // 自定义上传方法
    async uploadHttpRequest() {
      const loading = this.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        target: '.anso-dialog',
        text: '拼命上传中，请等待'
      })
      const formData = new FormData() //FormData对象，添加参数只能通过append('key', value)的形式添加
      formData.append('file', this.fileList[0].raw) //添加文件对象
      Object.keys(this.params).forEach(v => {
        formData.append(v, this.params[v])
      })
      const { code, data, message } = await importExcel(formData, this.url.importUrl)
      loading.close()
      if (code === 200) {
        if (data.status) {
          // 上传成功
          this.importActiveName = 1
          this.successNum = data.importDataSize
          this.$emit('updatePage')
        } else {
          // 上传失败
          this.errorMsg = data.message
          this.importActiveName = 2
          if (data.fileId) {
            this.showLoadError = true
            this.errorFileID = data.fileId
          } else {
            this.showLoadError = false
          }
        }
      }
    },
    handleAvatarSuccess(res, file) {
      // this.$refs.uploadBtn && this.$refs.uploadBtn.clearFiles() //上传成功之后清除历史记录
      // this.$refs.uploadExcel && this.$refs.uploadExcel.clearFiles() //上传成功之后清除历史记录
      // this.loadFile.name = ''
      // this.loadFile.size = ''
      // this.fileList = []
    },
    // 点击上传：手动上传到服务器，此时会触发组件的http-request
    submitUpload() {
      if (!this.fileList.length) {
        return this.$message({ type: 'info', message: '请选择文件' })
      }
      this.uploadHttpRequest()
      // this.$refs.uploadExcel.submit()
    },
    handleSubmit() {}
  }
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
