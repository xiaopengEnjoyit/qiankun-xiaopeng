<template>
  <div class="mapLayerCard">
    <div class="cards-content">
      <div class="cards" :style="{ left: `-${cardsIndex * 100}px` }">
        <div
          :class="['cards-item', index === cardsIndex ? 'active' : '']"
          v-for="(item, index) in list"
          :key="index"
          @click="cardsClick(item.value, index)"
        >
          <span class="card-text">{{ item.text }}</span>
          <img class="card-img" :src="item.img" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mapLayerCard',
  data() {
    return {
      active: '',
      cardsIndex: 0,
      list: [
        { text: '标记图', value: 'biaoji', img: require('../img/标记图.png') },
        { text: '卫星图', value: 'weixing', img: require('../img/卫星图.png') }
        // { text: '简洁图', value: 'jianjie', img: require('../img/简洁图.png') }
      ]
    }
  },
  methods: {
    cardsClick(value, index) {
      this.active = value
      this.cardsIndex = index
      this.$emit('changeMapType', value, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.mapLayerCard {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #fff;
  padding: 4px;
  border-radius: 4px;
}
.cards-content {
  width: 96px;
  height: 60px;
  overflow: hidden;
  transition: width 0.5s;
  position: relative;
  cursor: pointer;
}
.cards {
  width: 200px;
  position: absolute;
  transition: left 0.5s;
}
.cards-content:hover {
  width: 200px;
  transition: width 0.5s;
  //   background: #fff;
  //   padding: 5px;
}
.cards-content:hover .cards {
  left: 0 !important;
  transition: left 0.5s;
}

.cards-item {
  position: relative;
  width: 96px;
  height: 60px;
  border: 1px solid #fff;
  box-sizing: border-box;
  float: left;
  &:not(:nth-child(1)) {
    margin-left: 4px;
  }
  .card-text {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 44px;
    height: 20px;
    line-height: 20px;
    background: #3171f2;
    border-radius: 0px 0px 4px 0px;
    color: #fff;
    padding: 0 5px;
  }
  .card-img {
    width: 100%;
    height: 100%;
  }
}
.active {
  border: 1px solid #3171f2;
}
</style>
