<template>
  <div class="as-quill">
    <!-- 上传图片 -->
    <!-- <el-upload
      :show-upload-list="false"
      :headers="headers"
      :multiple="false"
      :on-success="handleImgSuccess"
      :action="action"
      class="uploadImg"
    >
    </el-upload> -->
    <!-- 上传文件 -->
    <el-upload
      :show-upload-list="false"
      :headers="headers"
      :multiple="false"
      :on-success="handleFileSuccess"
      type="drag"
      :action="action"
      class="uploadFile"
    >
    </el-upload>
    <quill-editor v-model="quillHtml" ref="quill" class="as-quill-editor" :options="editorOption"> </quill-editor>
  </div>
</template>
<script>
// import upImg from '../../assets/images/upload'
import { quillEditor, Quill } from 'vue-quill-editor'
// import { ImageExtend, QuillWatch } from 'quill-image-extend-module'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// Quill.register('modules/ImageExtend', ImageExtend)
let Link = Quill.import('formats/link')
// 自定义a链接
class FileBlot extends Link {
  // 继承Link Blot
  static create(value) {
    let node = undefined
    if (value && !value.href) {
      // 适应原本的Link Blot
      node = super.create(value)
    } else {
      // 自定义Link Blot
      node = super.create(value.href)
      node.innerText = value.innerText
      node.href = value.href
      node.id = value.id
      node.setAttribute('title', value.innerText)
      node.setAttribute('data-value', value.dataValue)
    }
    return node
  }
}
FileBlot.blotName = 'link'
FileBlot.tagName = 'A'
//注册FileBlot
Quill.register(FileBlot)
export default {
  name: 'ansoQuillEditor',
  components: {
    quillEditor
  },
  data() {
    return {
      quillHtml: '',
      action: '/api/file/files-anon', //`${process.env.VUE_APP_BASEURL}/api/file/files-anon`
      headers: {
        Authorization:
          JSON.parse(sessionStorage.getItem('token')).token_type +
          ' ' +
          JSON.parse(sessionStorage.getItem('token')).access_token
      },
      editorOption: {
        placeholder: '请在这里输入',
        modules: {
          ImageExtend: {
            loading: true, // 可选参数 是否显示上传进度和提示语
            name: 'file', // 图片参数名
            size: 10, // 可选参数 图片大小，单位为M，1M = 1024kb
            action: '/api/file/files-anon', // 服务器地址, 如果action为空，则采用base64插入图片
            // response 为一个函数用来获取服务器返回的具体图片地址
            // 例如服务器返回{code: 200; data:{ url: 'xxx.com'}}
            // 则 return res.data.url

            headers: xhr => {
              xhr.setRequestHeader(
                'Authorization',
                JSON.parse(sessionStorage.getItem('token')).token_type +
                  ' ' +
                  JSON.parse(sessionStorage.getItem('token')).access_token
              )
            }, // 可选参数 设置请求头部
            response: res => {
              console.log(111, res)
              return `/api/file/view?fileId=${res.data.id}`
            },
            start: () => {
              console.log('start')
            }, // 可选参数 自定义开始上传触发事件
            end: () => {
              console.log('end')
            }, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
            error: () => {
              console.log('error')
            }, // 可选参数 自定义网络错误触发的事件
            sizeError: () => {}, //图片超过大小的回调
            change: (xhr, formData) => {
              console.log(2222, formData)
              formData.append('systemCode', 'UMS')
            } // 可选参数 选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
          },
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              // [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['clean'],
              ['link', 'image', 'upload']
            ], // container为工具栏，此次引入了全部工具栏，也可自行配置
            handlers: {
              // image: function(value) {
              //   if (value) {
              //     document.querySelector('#uploadImg input').click() // 劫持原来的图片点击按钮事件
              //   }
              // },
              image: function() {
                // QuillWatch.emit(this.quill.id)
              },
              upload: value => {
                if (value) {
                  document.querySelector('.uploadFile input').click()
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    handleFileSuccess(res, file) {
      let fileNameLength = file.name.length
      // 插入链接
      let quill = this.$refs.quill.quill
      let length = quill.getSelection().index
      // 插入图片  图片地址
      // quill.insertEmbed(length, 'link', res.data.path)
      quill.insertEmbed(
        length,
        'link',
        {
          href: res.data.path,
          innerText: res.data.fileName
        },
        'api'
      )
      quill.setSelection(length + fileNameLength)
    }
    // change(e) {
    //   let file = e.target.files[0]
    //   console.log(file)
    //   const formData = new FormData()
    //   formData.append('file', file)
    //   this.upLoadFile(e, formData)
    // },
    // async upLoadFile(e, formData) {
    //   try {
    //     const { code, data } = await this.$POST('/api/file/files-anon', formData)
    //     if (code === 200) {
    //       let quill = this.$refs.quill.quill
    //       // const formdata = _.extend({}, this.formdata)
    //       let length = quill.getSelection().index //光标位置
    //       // 插入图片  图片地址
    //       quill.insertEmbed(length, 'image', `/api/file/view?fileId=${data.id}`)
    //       // 调整光标到最后
    //       quill.setSelection(length + 1) //光标后移一位
    //       e.target.value = ''
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.as-quill {
  height: 500px;
  &-editor {
    height: 100%;
  }
  /deep/.ql-container {
    height: calc(100% - 67px);
  }
  /deep/.ql-snow .ql-picker.ql-size {
    width: 65px;
  }
  /deep/.ql-snow .ql-picker.ql-header {
    width: 70px;
  }
  /deep/.ql-snow .ql-picker.ql-font {
    width: 90px;
  }
}
.uploadFile {
  display: none;
}
</style>
<style lang="scss">
@import './index';
.ql-snow.ql-toolbar .ql-upload {
  background: url('../../assets/img/upload.png');
  background-size: 16px 16px;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
