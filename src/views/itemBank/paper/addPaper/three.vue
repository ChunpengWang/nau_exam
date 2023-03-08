<template>
  <div class="three-container">

    <div class="three-img-container">
      <img src="@/assets/images/paper/paper-done.png" alt="">
      <span>组卷完成，请前往列表查看试卷！</span>
    </div>



  </div>
</template>

<script>
  export default {
    name: '',
    data() {
      return {

      }
    },
    mounted(){},
    created(){},
    methods:{}
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .three-container {
    .three-img-container {
      background-color: #fff;
      padding: pxToRem(60) 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: pxToRem(200);
      }
      span{
        font-size: pxToRem(20);
        color: #666;
        margin-top: pxToRem(40);
      }
    }
  }
</style>
