<template>
  <swiper ref="mySwiper" :options="swiperOptions" class="swiperContainer">
    <template v-if="data.length">
      <swiper-slide
        class="swiperItem"
        v-for="item in data"
        :key="item"
      >
        <img :src="item" alt="">
      </swiper-slide>
    </template>
    <swiper-slide
      v-else
      class="swiperItem"
    >占位符</swiper-slide>
  </swiper>
</template>

<script>
  import {Swiper, SwiperSlide,} from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
  export default {
    components: {
      Swiper,
      SwiperSlide
    },
    props: {
      data: {
        type: Array,
        default: () => ([])
      }
    },
    data() {
      return {
        swiperOptions: {
          autoplay: {
            delay: 1000,
            disableOnInteraction: false,
          },
          loop: true,
        }
      }
    }

  }
</script>

<style scoped lang="scss">
.swiperContainer {
  height: 120px;

  .swiperItem {
    width: 100%;
    background-color: pink;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
