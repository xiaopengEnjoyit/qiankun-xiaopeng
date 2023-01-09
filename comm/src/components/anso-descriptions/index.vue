<template>
  <div>
    <!-- 详情编辑 -->
    <section class="desc-title" v-if="descConfig.isEdit">
      <p>{{ descConfig.title }}</p>
      <div class="desc-title-save">
        <anso-button type="primary" size="small" @click="handleEdit" v-if="isEdit" :permission="descConfig.permission"
          >编辑</anso-button
        >
        <div v-else>
          <el-button type="info" size="small" @click="handleCanl">取消</el-button>
          <el-button type="primary" size="small" @click="handleSave">保存</el-button>
        </div>
      </div>
    </section>
    <!-- 详情内容 -->
    <section :class="[descConfig.bottom ? 'desc-bottom' : '', 'desc-con']">
      <el-descriptions :size="size" border>
        <el-descriptions-item v-for="item in descConfig.data" :key="item.label">
          <template slot="label">
            {{ item.label }}
            <span style="color: #f56c6c" v-if="item.visible">*</span>
          </template>
          <template v-if="item.type === 'tips'">
            <el-input v-if="item.key && !isEdit" v-model="form[item.key]"></el-input>
            <el-tooltip v-else effect="light" :content="item.value" placement="bottom-start">
              <span :class="'line' + item.line">{{ item.value }}</span>
            </el-tooltip>
          </template>

          <template v-else-if="item.type === 'img'">
            <img
              v-if="item.value && item.value.indexOf('icon') === -1"
              :src="`/api/file/view?fileId=${item.value}`"
              class="desc-img"
            />
            <i v-else :class="['iconfont', item.value]"></i>
          </template>
          <template v-else>
            <el-input v-if="item.key && !isEdit" v-model="form[item.key]" @input="handleChange($event)"></el-input>
            <span v-else :class="'line' + item.line">{{ item.value }}</span>
          </template>
        </el-descriptions-item>
      </el-descriptions>
    </section>
  </div>
</template>
<script>
/**
 * {
    data: [
      {
        label: '测试',  
        value: 'test',
        key: 'name', //需要编辑时对应的key，保存时会传回去
        line:5//超过多少行显示...
        type：img：图片，tips：带有tips提示
      }
    ],
    isEdit: true, //是否有编辑按钮
    bottom: true, //是否有底部的虚线
    title: '用户基本信息', //左侧标题
    permission: 'ACL:140037'//编辑按钮的权限编码
  }
 * 保存时触发save
 * 
 * 
 */
export default {
  name: 'AnsoDescriptions',
  props: {
    descConfig: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: () => 'mini'
    }
  },
  data() {
    return {
      isEdit: true,
      form: {}
    }
  },
  methods: {
    // 取消
    handleCanl() {
      this.isEdit = true
    },
    // 编辑
    handleEdit() {
      this.isEdit = false
      this.descConfig.data.forEach(v => {
        if (v.key) {
          this.form[v.key] = v.value
        }
      })
    },
    // 保存
    handleSave() {
      this.isEdit = true
      this.$emit('save', this.form)
    },
    handleChange() {
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './index';
</style>
