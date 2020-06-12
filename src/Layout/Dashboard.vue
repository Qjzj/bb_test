<template>
  <div class="dashboard">
    <div class="__nav" v-if="!navHide">
      <router-link
        v-for="menu in menuData"
        :key="menu.path"
        :to="menu.path"
      >{{menu.title}}</router-link>
    </div>
    <div class="__container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Dashboard",
    data() {
      return {
        menuData: [
          {
            path: '/',
            title: '首页'
          },
          {
            path: '/about',
            title: '关于'
          },
          {
            path: '/news',
            title: '新闻'
          }
        ]
      }
    },
    computed: {
      navHide() {
        return this.$route.meta && this.$route.meta.hideNav
      }
    }
  }
</script>

<style scoped lang="scss">
  .dashboard {
    display: flex;
    flex-direction: column;

    .__nav {
      display: flex;
      align-items: center;
      padding: 0 50px;
      height: 60px;
      border-bottom: 1px solid #ccc;

      a {
        margin-right: 20px;
      }
    }

    .__container {
      flex: 1;
    }
  }
</style>
