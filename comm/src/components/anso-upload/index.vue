<!--
 * @Description:
 * @Version: 2.0
 * @Autor: Zengpinsi
 * @Date: 2022-05-17 09:40:12
 * @LastEditors: Seven
 * @LastEditTime: 2022-08-29 16:52:59
-->
<template>
  <div class="custom-project-import">
    <el-upload
      class="upload"
      :show-file-list="false"
      :headers="headers"
      :accept="accept"
      :action="actionUrl"
      :multiple="multiple"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-change="fileChange"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-success="handlerSuccess"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :data="uploadData"
      ref="upload"
    >
      <el-button size="mini" @click="upload" icon="el-icon-upload2" v-if="modelType !== 'detail'"
        ><slot>上传附件</slot></el-button
      >
    </el-upload>
    <span class="tips" v-show="fileList && !fileList.length"> {{ placeholder || '最多上传10个' }}</span>
    <ul :style="{ 'flex-wrap': isTable ? '' : 'wrap' }">
      <li v-for="(item, index) of fileList" :key="`file${item.fileId}`" :id="item.fileId" @click="downFile(item)">
        <span class="down-btn">{{ item.fileName }}</span
        ><span class="el-icon-delete" @click.stop="delFile(index, item)" v-if="modelType !== 'detail'"></span>
        <span
          class="el-icon-zoom-in"
          @click.stop="checkImg(item)"
          v-if="item.fileName.includes('png') || item.fileName.includes('jpeg') || item.fileName.includes('jpg')"
        ></span>
      </li>
    </ul>
    <!-- <el-image style="width: 100px; height: 100px" :src="curUrl" :preview-src-list="srcList"> </el-image> -->
  </div>
</template>

<script>
export default {
  name: 'ansoUpload',
  model: {
    prop: 'fileList',
    event: 'change'
  },
  props: {
    actionUrl: {
      required: false,
      type: String,
      default: () => {
        return '/api/file/files-batch-anon'
      }
    },
    multiple: {
      required: false,
      type: Boolean,
      default: () => {
        return false
      }
    },
    limit: {
      required: false,
      type: Number,
      default: () => {
        return 10
      }
    },
    fileList: {
      required: false,
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      required: false,
      type: String,
      default: () => {
        return '上传文件'
      }
    },
    accept: {
      required: false,
      type: String,
      default: () => {
        return '.xls,.xlsx'
      }
    },
    isTable: {
      required: false,
      type: Boolean,
      default: () => {
        return true
      }
    },
    uploadData: {
      required: false,
      type: Object,
      default: () => {
        return {}
      }
    },
    // 单个文件上传大小，单位M
    fileSize: {
      required: false,
      type: Number,
      default: 10
    },
    modelType: {
      required: false,
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      headers: {
        Authorization:
          JSON.parse(sessionStorage.getItem('token')).token_type +
          ' ' +
          JSON.parse(sessionStorage.getItem('token')).access_token
      },
      item: null,
      curUrl: '',
      srcList: []
    }
  },
  methods: {
    handlePreview() {},
    handleRemove() {},
    beforeUpload(file) {
      let fileExt = file.name.replace(/.+\./gi, '')
      let fileSize = file.size / 1024 / 1024
      if (fileSize > this.fileSize) {
        this.$message({ type: 'error', message: `文件太大，请上传小于${this.fileSize}M的文件` })
        return false
      }
      if (this.accept.indexOf(fileExt.toLowerCase()) == -1) {
        this.$message({ type: 'error', message: '请上传后缀名为xlsx或xls的附件!' })
        return false
      }
    },
    beforeRemove() {},
    handleExceed() {},
    upload() {
      // if (this.limit === 1) {
      //   this.$refs['upload'].clearFiles()
      //   this.$emit('update:fileList', [])
      // }
    },
    fileChange(file, fileList) {
      if (fileList.length > 1 && this.limit === 1) {
        fileList.shift()
      }
    },
    handlerSuccess(response, file, fileList) {
      if (this.fileList.length >= this.limit) {
        return this.$message({ type: 'error', message: `文件上传数量不超过${this.limit}份` })
      }
      let temp = fileList.map(el => {
        if (el?.response) {
          return {
            fileName: el.response.data[0].fileName,
            fileId: el.response.data[0].id
          }
        } else {
          return {
            fileName: el.fileName,
            fileId: el.fileId
          }
        }
      })
      this.srcList = temp.map(t => {
        return `/api/file/view?fileId=${t.fileId}`
      })
      this.$emit('update:fileList', temp)
    },
    async delFile(index, item) {
      if (item?.id) {
        let params = item.id
        let { code, data, message } = await this.$service.base.delFile(params)
        if (code === 200) {
          this.fileList.splice(index, 1)
          this.$message({ type: 'success', message: '删除成功!' })
        } else {
          this.$message({ type: 'error', message })
        }
      } else {
        this.fileList.splice(index, 1)
      }
    },
    checkImg(item) {
      this.curUrl = `/api/file/view?fileId=${item.fileId}`
    },
    handleError(err, file, fileList) {
      this.$message({ type: 'error', message: '上传失败!' })
    },
    downFile(item) {
      let ele = document.createElement('a') // 创建下载链接
      // ele.download = filename //设置下载的名称
      ele.style.display = 'none' // 隐藏的可下载链接
      ele.href = `/api/file/downloadFile?fileId=${item.fileId}`
      // 绑定点击时间
      document.body.appendChild(ele)
      ele.click()
      // 然后移除
      document.body.removeChild(ele)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-project-import {
  display: flex;
  .upload {
    /deep/ .el-upload {
      .el-button {
        height: 20px !important;
        padding: 3px 12px !important;
      }
    }
  }

  .tips {
    color: #8c8c8c;
    font-weight: 400;
    font-size: 12px;
    margin-left: 8px;
  }

  ul {
    display: flex;
    align-items: center;
    margin: 0px;
    padding: 0px;
    flex-wrap: wrap;

    li {
      margin: 0px;
      padding: 0px;
      list-style: none;
      display: flex;
      margin-left: 8px;
      align-items: center;

      > span {
        font-size: 5px;
        margin-left: 8px;
        cursor: pointer;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: normal;
      }
    }
  }
}
</style>
