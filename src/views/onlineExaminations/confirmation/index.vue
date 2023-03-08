<template>
  <div class="confirmation-container">
    <div class="content-box">
      <div class="title">
        考前信息确认
      </div>
      <div class="content">
        <div class="info">

          <div class="form-item">
            <span class="label">考试计划：</span>
            <span class="txt">{{infoData.planname || ''}}</span>
          </div>
          <div class="form-item">
            <span class="label">考试科目：</span>
            <span class="txt">{{infoData.subjectname || ''}}</span>
          </div>
          <div class="form-item">
            <span class="label">场次时间：</span>
            <span class="txt">{{infoData.scenename || ''}} {{infoData.startdate || ''}} {{infoData.enddate || ''}}</span>
          </div>

          <div class="form-item">
            <span class="label">考试时长：</span>
            <span class="txt">{{infoData.duration || '-'}}分钟</span>
          </div>
          <div class="form-item">
            <span class="label">姓名：</span>
            <span class="txt">{{infoData.studentname || ''}}</span>
          </div>
          <div class="form-item">
            <span class="label">身份证号：</span>
            <span class="txt">{{infoData.idcard || ''}}</span>
          </div>

        </div>
        <div class="img">
          <div class="form-item">
            <span class="label">照片：</span>
            <img :src="imgUrl" alt="">
          </div>
        </div>
      </div>
      <div class="desc">请务必使用谷歌浏览器，非谷歌浏览器进行答题会出现闪退现像</div>
      <div class="btn">
        <div class="countDown" v-if="isShowCountDown">离考试开始：<span>{{HH}}</span>时<span>{{mm}}</span>分 <span>{{ss}}</span>秒</div>
        <img v-show="!isDisabled" src="@/assets/images/examinee/start-exam.png" alt="">
        <img v-show="isDisabled" src="@/assets/images/examinee/start-exam-disabled.png">
        <span @click="next">进入考试</span>
      </div>

    </div>
  </div>
</template>

<script>
  import global from '@/utils/global';
  import moment from 'moment';// 导入文件
  import {startExam} from '@/api/examinee';
  export default {
    name: '',
    props:['infoData'],
    data() {
      return {
        imgUrl:'',
        isDisabled:false,  //是否禁用进入考试按钮
        HH:'00',
        mm:'00',
        ss:'00',
        timerFuc: null,
        isShowCountDown:false, //是否展示距离考试开始的倒计时
      }
    },
    mounted(){},
    created(){
      this.imgUrl = global.fileBaseUrl + this.$store.state.user.user.thumb;
      this.getNoWDate()
    },
    methods:{
      async next(){
        if(!this.isDisabled){
          let res = await startExam({answerid:this.infoData.answerid})
          if(res.state==200){
            this.$emit('transferEvt', 'notice')
          }
        }
      },
      async getNoWDate(){
        let currentTime = moment().valueOf();
        let endTime = new Date(this.infoData.startdate || '').getTime();
        let sytime = endTime - currentTime;
        if(sytime > 0){
          this.isShowCountDown = true;
          // this.isDisabled = true  // todo 不到考试时间是否进入  开发模式默认可以进入
          this.startTime(sytime);
        }
      },


      // 倒计时
      startTime(sytime) {
        const that = this;
        this.dateFormat(sytime);
        this.timerFuc = setTimeout(() => {
          sytime = sytime - 1000;
          if (sytime > 0) {
            that.startTime(sytime);
          } else {
            clearTimeout(that.timerFuc);
            that.timerFuc = null;
            this.ss = '00';
            this.isDisabled = false
          }
        }, 1000);
      },

      // 时间格式转换
      dateFormat(leftTime) {
        const o = {
          d: Math.floor(leftTime / 1000 / 60 / 60 / 24), // 日
          h: Math.floor((leftTime / 1000 / 60 / 60) % 24), // 小时
          m: Math.floor((leftTime / 1000 / 60) % 60), // 分
          s: Math.floor((leftTime / 1000) % 60), // 秒
          ms: Math.floor(leftTime % 1000) // 毫秒
        };
        this.HH = o.h < 10 ? "0" + o.h : o.h;
        this.mm = o.m < 10 ? "0" + o.m : o.m;
        this.ss = o.s < 10 ? "0" + o.s : o.s;
        if (o.d > 0) {
          this.HH = o.h + o.d * 24;
        }
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .confirmation-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .content-box{
      width: 51%;
      background-color: #fff;
      border-radius: 8px;
      height: 80%;
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
        padding: pxToRem(30) pxToRem(80) 0 pxToRem(80);
        font-size: pxToRem(16);
        .label{
          color: #333;
        }
        .info{
          flex: 2;
          display: flex;
          flex-direction: column;
          .form-item{
            line-height: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            .label{
              min-width: 75px;
              text-align: right;
              display: inline-block;
            }
            .txt{
              color: #666;
              margin-left: pxToRem(30);
            }
            .device{
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              >img{
                width: 18px;
                margin: 0px 0px 0px 8px;
              }
            }
          }
        }
        .img{
          flex: 1;
          .form-item{
            line-height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            .label{
              /*min-width: 75px;*/
              /*text-align: right;*/
              display: flex;
              align-self: flex-start;
            }
            > img{
                width: pxToRem(118);
                height: pxToRem(158);
            }
          }
        }
      }

      .desc {
        padding-left: pxToRem(80);
        color: red;
        font-size: 14px;
        margin-bottom: 2px;
      }
      .btn{
        position: relative;
        height: pxToRem(80);
        .countDown{
          color: #ec808d;
          font-size: pxToRem(22);
          position: absolute;
          right: pxToRem(300);
          height: pxToRem(80);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        > img{
          width: pxToRem(220);
          position: absolute;
          right: pxToRem(60);
          cursor: pointer;
        }
        > span{
          cursor: pointer;
          width: pxToRem(220);
          position: absolute;
          right: pxToRem(60);
          height: pxToRem(80);
          font-size: pxToRem(20);
          font-weight: 700;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      padding-bottom: pxToRem(60);
    }
  }
</style>
