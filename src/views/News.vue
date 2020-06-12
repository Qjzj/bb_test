<template>
  <div class="news">
    <h2>新闻页面</h2>
    <ul>
      <li v-for="item in data" :key="item.id">
        <router-link :to="'/news/detail/' + item.id">{{item.title}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "news",
    data() {
      return {
        data: [
          {id: 1, title: '新闻标题1', desc: '新闻1的描述'},
          {id: 2, title: '新闻标题2', desc: '新闻2的描述'},
          {id: 3, title: '新闻标题3', desc: '新闻3的描述'},
          {id: 4, title: '新闻标题4', desc: '新闻4的描述'},
          {id: 5, title: '新闻标题5', desc: '新闻5的描述'},
          {id: 6, title: '新闻标题6', desc: '新闻6的描述'},
          {id: 7, title: '新闻标题7', desc: '新闻7的描述'},
        ]
      }
    }
  }
</script>

<style scoped>

</style>
