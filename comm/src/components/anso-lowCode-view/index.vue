<template>
  <div class="height-parent">
    <div class="content-drag">
      <div class="content-parent">
        <div id="content-view">
          <grid-layout
            v-if="renderLayout.length > 0"
            ref="gridlayout"
            :layout.sync="renderLayout"
            :col-num="configWidth"
            :row-height="1"
            :margin="[10, 10]"
            :is-draggable="false"
            :is-resizable="false"
            :vertical-compact="false"
            :use-css-transforms="true"
          >
            <grid-item
              v-for="(item, i) in renderLayout"
              :key="`${item.comName}${i}`"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
            >
              <component :is="item.comName" :config="item"></component>
              <!-- <slot name="grid" :config="item"></slot> -->
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
import { layoutInfo } from '../../services'
import { cloneDeep } from 'lodash'

export default {
  name: 'ansoLowCodeView',
  components: {
    GridLayout,
    GridItem
  },
  props: {
    id: {
      type: String,
      default: '1593063013871693830'
    }
  },
  data() {
    return {
      configWidth: 1,
      selfHeight: 1,
      selfWidth: 1,
      layout: [],
      renderLayout: [],
      colNum: 0
    }
  },
  async mounted() {
    if (this.id) {
      const { data, code } = await layoutInfo(this.id)
      if (code === 200) {
        this.layout = JSON.parse(data.layoutJson).layout
        this.configHeight = JSON.parse(data.layoutJson).configHeight
        this.configWidth = JSON.parse(data.layoutJson).configWidth
      }
    }
    let dom = document.getElementById('content-view')
    this.selfWidth = this.colNum = dom.getBoundingClientRect().width
    this.selfHeight = dom.getBoundingClientRect().height
    this.initLayout()
    window.addEventListener('resize', () => {
      this.$nextTick(() => {
        let dom = document.getElementById('content-view')
        this.selfHeight = dom.getBoundingClientRect().height
        this.initLayout()
      })
    })
  },
  beforeDestroy() {},
  methods: {
    initLayout() {
      this.renderLayout = cloneDeep(this.layout)
      this.renderLayout.forEach(e => {
        e.h = e.h * (this.selfHeight / this.configHeight)
        e.y = e.y * (this.selfHeight / this.configHeight)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.flex {
  display: flex;
}
.content-drag {
  height: 100%;
  display: flex;
  #content-view {
    height: 100%;
    background-repeat: no-repeat;
    overflow: hidden;
  }
  .content-parent {
    flex: 1;
    overflow: auto;
    background: #f8f9fa;
  }
}
.vue-grid-item {
  background: white;
}
.height-parent {
  height: 100%;
}
</style>
