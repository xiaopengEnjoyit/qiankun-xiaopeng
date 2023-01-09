<template>
  <div class="as-quill">
    <!-- 上传图片 -->
    <el-upload
      :show-upload-list="false"
      :action="this.quillConfig.action"
      :headers="this.quillConfig.headers"
      :data="this.quillConfig.img.data"
      :multiple="false"
      :accept="this.quillConfig.img.accept"
      :on-success="handleImgSuccess"
      :on-error="handleError"
      :before-upload="beforeUploadImg"
      class="uploadImg"
    >
    </el-upload>
    <!-- 上传文件 @blur="onEditorBlur($event)"-->
    <el-upload
      :show-upload-list="false"
      :action="this.quillConfig.action"
      :headers="this.quillConfig.headers"
      :data="this.quillConfig.file.data"
      :multiple="false"
      :accept="this.quillConfig.file.accept"
      :on-success="handleFileSuccess"
      :before-upload="beforeUploadFile"
      class="uploadFile"
    >
    </el-upload>
    <quill-editor
      v-model="editorContent"
      ref="quill"
      class="as-quill-editor"
      :options="editorOption"
      @change="handleEditorChange($event)"
      @ready="onEditorReady($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
    >
    </quill-editor>
    <div class="quill-bom" v-if="maxLength">{{ TiLength }}/{{ maxLength }}</div>
  </div>
</template>
<script>
// import emptyImg from 'comm/src/assets/images/empty.png'
import { quillEditor, Quill } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { titleConfig } from './titleConfig'
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
  props: {
    quillConfig: {
      type: Object,
      default() {
        return {
          action: '/api/file/files-anon', //上传接口
          headers: {
            //请求头
            Authorization:
              JSON.parse(sessionStorage.getItem('token')).token_type +
              ' ' +
              JSON.parse(sessionStorage.getItem('token')).access_token
          },
          file: {
            accept: '.xls,.xlsx,.doc,.docx,.ppt,.pptx,.text,.zip,.rtf', //支持文件上传的格式
            size: 10, //文件上传的大小
            data: { systemCode: 'UMS' } //上传需要的额外参数
          },
          img: {
            accept: '.bmp,.jpg,jpeg,.png,.tiff,.gif,.svg,.psd', //支持图片上传的格式
            size: 3, //图片上传的大小
            data: { systemCode: 'UMS' } //上传需要的额外参数
          }
        }
      }
    },
    maxLength: {
      //输入长度限制  0不限制
      type: Number,
      default() {
        return 0
      }
    },
    content: {
      type: String
    },
    container: {
      type: Array,
      default() {
        return [
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
        ]
      }
    },
    placeholder: {
      type: String,
      default: '请在这里输入...'
    }
  },
  watch: {
    content: {
      handler(n, o) {
        this.editorContent = n
        this.$nextTick(() => {
          let len = this.$refs.quill.quill.getLength()
          this.TiLength = len - 1
        })
      },
      // 立即处理 进入页面就触发
      immediate: true
    }
  },

  data() {
    return {
      editorContent: '',
      TiLength: 0,
      editorOption: {
        placeholder: this.placeholder,
        modules: {
          toolbar: {
            container: this.container,
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector('.uploadImg input').click() // 劫持原来的图片点击按钮事件
                }
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
      if (res.code === 200) {
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
      } else {
        this.$message.error(res.message)
      }
    },
    handleImgSuccess(res, file, fileList) {
      if (res.code === 200) {
        let quill = this.$refs.quill.quill
        let length = quill.getSelection().index //光标位置
        // 插入图片  图片地址
        quill.insertEmbed(length, 'image', `/api/file/view?fileId=${res.data.id}`)
        // 调整光标到最后
        quill.setSelection(length + 1) //光标后移一位
      } else {
        this.$message.error(res.message)
      }
    },
    beforeUploadImg(file) {
      let fn = file.name.substring(file.name.lastIndexOf('.'))
      if (this.quillConfig.img.accept.indexOf(fn) < 0) {
        this.$message.error(`请上传后缀为${this.quillConfig.img.accept}的图片`)
        return false
      } else if (file.size / 1024 / 1024 > this.quillConfig.img.size) {
        this.$message.error(`请选择少于${this.quillConfig.img.size}M的图片`)
        return false
      }
    },
    beforeUploadFile(file) {
      let fn = file.name.substring(file.name.lastIndexOf('.'))
      if (this.quillConfig.file.accept.indexOf(fn) < 0) {
        this.$message.error(`请上传后缀为${this.quillConfig.file.accept}的文件`)
        return false
      } else if (file.size / 1024 / 1024 > this.quillConfig.file.size) {
        this.$message.error(`请选择少于${this.quillConfig.file.size}M的文件`)
        return false
      }
    },
    handleError(err, file, fileList) {
      this.$message.error('上传失败！')
    },
    /**
     * 复制粘贴数量巨大的时候会出现限制字符无效的情况，所以text.length > this.maxLength做了这个判断解决，但是如果有图片等非文本会出现错误。
     * 消息中心使用时没有图片，所以暂时不处理。
     */
    handleEditorChange(val) {
      if (this.maxLength) {
        let text = val.text.replace('\n', '')
        if (text.length > this.maxLength) {
          val.quill.deleteText(this.maxLength, text.length - this.maxLength)
        }
        // val.quill.deleteText(this.maxLength, 1)
        if (this.editorContent === '') {
          this.TiLength = 0
        } else {
          this.TiLength = val.quill.getLength() - 1
          setTimeout(() => {
            let length = ''
            if (val.quill.getSelection()) {
              length = val.quill.getSelection().index
            }
            if (this.maxLength === this.TiLength && length === 0) {
              val.quill.setSelection(this.TiLength)
            }
          }, 0)
        }
      }
      val.html = document.querySelector('.ql-container .ql-editor').innerHTML
      // val.text = document.querySelector('.ql-container .ql-editor').innerText
      this.editorContent = val.html
      this.$emit('handleChange', val)
      // this.$emit('update:editorContent', val) //这里没有直接返回html，是因为有的情况下只需要text内容，所以全部返回。
    },
    onEditorReady(val) {
      setTimeout(() => {
        for (let item of titleConfig) {
          let tip = document.querySelector('.quill-editor ' + item.Choice)
          if (!tip) continue
          tip.setAttribute('title', item.title)
        }
      }, 300)
    },
    // 失去焦点重置超链接的输入位置
    onEditorBlur(quill) {
      let e = document.querySelector('.ql-tooltip,.ql-editing')
      if (e) {
        setTimeout(() => {
          let top = parseInt(e.style.top)
          let conTop = document.querySelector('.ql-container').clientHeight
          let maxTop = conTop - 38
          if (top > maxTop) {
            e.style.top = maxTop + 'px'
          }
        }, 300)
        let input = e.querySelector('input')
        input.setAttribute('maxlength', 200)
      }
    },
    onEditorFocus(quill) {
      let e = document.querySelector('.ql-tooltip')
      if (e) {
        setTimeout(() => {
          let top = parseInt(e.style.top)
          let conTop = document.querySelector('.ql-container').clientHeight
          let maxTop = conTop - 38
          if (top > maxTop) {
            e.style.top = maxTop + 'px'
          }
        }, 300)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.as-quill {
  height: 100%;

  &-editor {
    height: 100%;
  }
  /deep/.ql-container {
    color: #262626;
    font-size: 14px;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    a,
    p,
    strong,
    em,
    u,
    s,
    ol,
    ul,
    sub,
    sup {
      white-space: pre-wrap;
    }
    a {
      color: #3171f2 !important;
      cursor: pointer !important;
      &:hover {
        text-decoration: underline;
      }
    }
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
  /deep/.ql-snow .ql-picker {
    line-height: 24px;
  }
  /deep/.ql-tooltip.ql-editing {
    left: 0 !important;
  }
  /deep/.ql-tooltip {
    margin-top: 0 !important;
    left: 0 !important;
  }
  .quill-bom {
    text-align: right;
    margin-right: 10px;
    margin-bottom: -5px;
    color: #bfbfbf;
    font-size: 12px;
  }
}
.uploadFile,
.uploadImg {
  display: none;
}
</style>
<style lang="scss">
@import './index';
.ql-snow.ql-toolbar .ql-upload {
  background: url('../../assets/images/upload.png');
  background-size: 16px 16px;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
