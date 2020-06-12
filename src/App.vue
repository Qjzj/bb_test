<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
  }
</style>
