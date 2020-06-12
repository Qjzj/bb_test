<template>
  <div>
    <h2>新闻详情 {{id}}</h2>
  </div>
</template>

<script>
  export default {
    name: "NewDetail",
    computed: {
      id() {
        return this.$route.params.id
      }
    }
  }
</script>

<style scoped>

</style>
