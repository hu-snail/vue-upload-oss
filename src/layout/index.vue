<template>
    <el-container class="container">
      <el-header class="header">
        <div class="left">
          <img width="16" height="16" src="../assets/moon.svg" class="moon" alt="Active darkmode">
          <a href="/" class=""><p class="dark-transition dark:text-white text-blue-400 text-xl">vue-upload-oss</p></a>
        </div>
      </el-header>
      <el-main class="main">
        <div class="main-head-wrapper">
            <div class="img-wrapper">
              <img width="100" height="100" src="../assets/logo.png" class="img-item" alt="vue logo">
              <img width="100" height="100" src="../assets/element.svg" class="img-item" alt="element logo">
              <img width="100" height="100" src="../assets/oss.svg" class="img-item" alt="oss logo">
            </div>
            <div class="content">
                <div class="title-wrapper">
                    <h1 class="title">
                        A modern <span class="bg-clip-text	linear-gradient inverse text-fill-transparent">Vue2</span> 
                    </h1>
                    <h1 class="title">
                        Collocation
                        <span class="bg-clip-text	linear-gradient inverse text-fill-transparent">Element-ui</span>  &
                        <span class="bg-clip-text	linear-gradient inverse text-fill-transparent">Ali-oss</span> 
                    </h1>
                </div>
                <slot />
            </div>
           
        </div>
      </el-main>
    </el-container>
</template>

<style lang="scss" scoped>
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
    .header {
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
        .left {
            display: flex;
            align-items: center;
            .moon {
                margin-right: 5px;
                cursor: pointer;
            }
        }
    }
    .main-head-wrapper {
        text-align: center;
        .img-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .img-item {
            margin: 10px 20px;
        }
        .h2-title {
            padding: 10px;
            font-size: 2.8rem;
            font-weight: 700;
        }
    }
}
</style>