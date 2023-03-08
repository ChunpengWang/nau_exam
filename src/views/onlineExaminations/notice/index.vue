<template>
  <div class="notice-container">
    <div class="content-box">
      <div class="title">
        考生须知
      </div>
      <div class="content">

        一、考生应讲诚信并自觉服从监考员等考试工作人员管理，不得以任何理由妨碍监考员等考试工作人员履行职责，不得扰乱考场及其他考试工作
        <br>
        二、考生应讲诚信并自觉服从监考员等考试工作人员管理，不得以任何理由妨碍监考员等考试工作人员履行职责，不得扰乱考场及其他考试工作
        <br>
        三、考生应讲诚信并自觉服从监考员等考试工作人员管理，不得以任何理由妨碍监考员等考试工作人员履行职责，不得扰乱考场及其他考试工作

      </div>
    </div>
    <div class="btn">
      <el-button style="height:40px;width:160px;border-radius: 20px;background-color: #fd9001;border-color: #fd9001;color:#fff;font-weight: 700"
                 @click.native.prevent="handleAgree" :disabled="isDisabled">
        同 意 （ {{second}} S）
      </el-button>
    </div>
  </div>
</template>

<script>
  import global from '@/utils/global';
  export default {
    name: '',
    data() {
      return {
        isDisabled:true,
        second:1, //  倒计时时间  开发模式默认1秒
      }
    },
    mounted(){},
    created(){
      this.countdown()
    },
    methods:{
      // 同意
     handleAgree(){
       if(this.isDisabled){
        global.showMessage('需要仔细阅读' + this.second + '秒',);
       }else{
         this.$emit('transferEvt', 'startExam')
       }
      },

      //倒计时
      countdown() {
        let tlsjtime = setTimeout(() => {
          this.second--;
          if (this.second === 0) {
            this.isDisabled = false;
            clearTimeout(tlsjtime);
            tlsjtime = null
          } else {
            this.countdown()
          }
        }, 1000)
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .notice-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .content-box{
      width: 51%;
      background-color: #fff;
      border-radius: 8px;
      height: 70%;
      display: flex;
      flex-direction: column;
      .title{
        height: pxToRem(90);
        font-size: pxToRem(28);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f4f5f9;
      }
      .content{
        flex: 1;
        display: flex;
        flex-direction: row;
        padding: pxToRem(25) pxToRem(40) pxToRem(40) pxToRem(40);
        font-size: pxToRem(16);
        color: #333;
        overflow-y: scroll;
        line-height: 26px;
      }

    }
    .btn{
      margin-top: 25px;
    }
  }
</style>
