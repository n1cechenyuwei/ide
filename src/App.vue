<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/common.scss';
html,body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  background-color: #282a36 !important;
}
.c_write {
  color: #fff;
}

</style>
