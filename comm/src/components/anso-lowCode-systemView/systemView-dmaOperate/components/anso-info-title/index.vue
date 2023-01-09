<template>
  <div>
    <section v-for="(item, index) in list" :key="item.title">
      <p :class="index > 0 ? 'info-title' : ''">{{ item.title }}</p>
      <el-row>
        <el-col :span="child.span || 8" v-for="child in item.data" :key="child.label"
          ><span>{{ child.label }} :</span>
          <span style="padding-left: 5px">{{ child.value || '--' }}</span>
        </el-col>
      </el-row>
    </section>
  </div>
</template>
<script>
export default {
  name: 'anso-info-title',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
