<template>
    <el-container class="container">
      <el-header class="header">
        <div class="left">
          <img width="16" height="16" src="./assets/moon.svg" class="moon" alt="Active darkmode" />
          <a href="/" class=""><p class="dark-transition dark:text-white text-blue-400 text-xl">hu-snail.dev</p></a>
        </div>
      </el-header>
      <el-main class="main">
        <div class="main-head-wrapper">
            <h2 class="h2-title"> vue-upload-oss </h2>
            <div>
              <h1 class="title">
                A modern <span class="bg-clip-text	linear-gradient inverse text-fill-transparent">Vue2</span> 
                <br/>
                Collocation
                <span class="bg-clip-text	linear-gradient inverse text-fill-transparent">Element-ui</span>  &
                <span class="bg-clip-text	linear-gradient inverse text-fill-transparent">Ali-oss</span> 
              </h1>
            </div>
        </div>
      </el-main>
    </el-container>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* background: #151621;     */
  height: 100vh;
}
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
}
.header .left {
  display: flex;
  align-items: center;
}
.header .left .moon {
  margin-right: 5px;
  cursor: pointer;
}
.main-head-wrapper {
  text-align: center;
}
.main-head-wrapper .h2-title {
  padding: 10px;
}
</style>
