<template>
  <div id="app">
    <img src="@/assets/images/index/bg.png" id="appBgc" :style="imgContainer" alt=""/>
    <div class="foot-container">
      {{'©2023北亚利桑那大学-软件工程-王春朋毕业项目'}}
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
    return {imgContainer:{}}
  },
  created() {
    this.imgContainer = {
      'width': `${window.document.body.clientWidth}px`,
      'height': `${window.document.body.clientHeight}px`,
    }
  }
};
</script>
<style lang="scss">
  @import "~@/styles/config.scss";
  #app {
    background-color: #3f5ca2;
    position: relative;
    #appBgc{
      position: absolute;
      top:0;
      left: 0;
    }
    .foot-container{
      position: absolute;
      width: 100%;
      bottom: 20px;
      margin-top: 8px;
      left: 0;
      display: flex;
      font-size: 14px;
      justify-content: center;
      align-items: center;
      color: #fff;
      img {}
    }
  }

</style>
