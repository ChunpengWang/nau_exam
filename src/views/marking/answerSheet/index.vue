<template>
  <div class="planSend-container">

    <my-loading :myloading='isLoading'></my-loading>

    <div class="toolbar-box">
      <my-toolbar ref="myToolbar" :submit="data.Submit.form1" :form="data.Form.form1" :btns="data.Btn.btn1"
                  @transferEvt="fBtnEvt"></my-toolbar>
    </div>
    <div class="content-box">

      <div class="item-box">
        <div class="img-container">
          <img src="@/assets/images/marking/student.png" alt="">
          <div class="desc-box">
            <span class="desc-title">考生人数</span>
            <span class="desc-subTitle">共有 {{ksrsTotal}} 名考生参加本次考试计划
            <span class="subtitle-explain">（含缺考）</span>
            </span>
          </div>
        </div>
        <div class="num-container">
          <div class="num-item" v-for="item in detailData">
            <span class="num">{{item.studentnum}}</span>
            <span class="desc">{{item.name}}考生</span>
          </div>
        </div>
      </div>

      <div class="item-box">
        <div class="img-container">
          <img src="@/assets/images/marking/answerSheet.png" alt="">
          <div class="desc-box">
            <span class="desc-title">答题卡总数</span>
            <span class="desc-subTitle">共回收 {{sjrsTotal}} 张答题卡 <span class="subtitle-explain">（不含缺考/未考人员）</span></span>
          </div>
        </div>
        <div class="num-container">
          <div class="num-item"  v-for="item in detailData">
            <span class="num">{{item.answernum}}</span>
            <span class="desc">{{item.name}}回收</span>
          </div>
        </div>
      </div>

      <div class="item-box">
        <div class="img-container">
          <img src="@/assets/images/marking/answerSheetNeed.png" alt="">
          <div class="desc-box">
            <span class="desc-title">需要评阅答题卡数</span>
            <span class="desc-subTitle">共有 {{xypydtksTotal}} 张答题卡需要评阅<span class="subtitle-explain">（未阅卷数，不含已自动阅卷数）</span></span>
            <span style="margin-top: 8px;color: #999">（截止目前为止：已阅卷{{alreadyNum}}、未阅卷{{xypydtksTotal - alreadyNum < 0 ? 0 : xypydtksTotal - alreadyNum }}）</span>
          </div>
        </div>
        <div class="num-container">
          <div class="num-item" v-for="item in detailData">
            <span class="num">{{item.needmarknum}}</span>
            <span class="desc">{{item.name}}需要评阅</span>
            <span class="desc">已阅：{{item.alredaynum}}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import {getEndPlanList,getEndPlanDetail} from '@/api/marking';
  import myLoading from '@/components/loading/index';
  import myToolbar from '@/components/toolbar/index';
  import template from './template';
  import global from '@/utils/global';

  export default {
    name: '',
    data() {
      return {
        data: template,
        isLoading:false,
        detailData:[],
        sjrsTotal:0, //答题卡数
        ksrsTotal:0, // 考生人数
        xypydtksTotal:0, //需要评阅数
        alreadyNum:0, //已评阅数
      };
    },
    components: {myToolbar, myLoading },
    mounted() {},
    created() {
      this.getPlanList()
    },
    methods: {

      fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ', evt);
        switch (evt) {
          case 'fSearch':
            this.data.Submit.form1.planid ? this.getData(this.data.Submit.form1.planid):null;
            break;
        }
        switch (evt.method) {
          case 'fChangeKsjh':
             this.getData(evt.data);
            break;
        }
      },

      //获取计划列表
      async getPlanList(){
        let res = await getEndPlanList({});
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        if(!arr.length){
          this.data.Submit.form1.planid = '';
        }else{
          this.getData(this.data.Submit.form1.planid);
        }
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || [];
          }
          return item;
        })
      },

      //获取数据
      async getData(planid){
        if(!planid){
          return
        }
       this.isLoading = true;
        this.ksrsTotal = 0;
        this.sjrsTotal = 0;
        this.xypydtksTotal = 0;
        this.alreadyNum = 0;
        let res = await getEndPlanDetail({planid});
        this.detailData = (res.data || []).map(item => {
          this.ksrsTotal += item.studentnum || 0;
          this.sjrsTotal += item.answernum || 0;
          this.alreadyNum += item.alredaynum || 0;
          this.xypydtksTotal += item.needmarknum || 0;
          return item;
        });
        this.isLoading = false
      },

    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";

  .planSend-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .toolbar-box {
      margin: 0 pxToRem(20);
    }

    .content-box {
      padding: 0 pxToRem(20) 70px pxToRem(20);
      width: 100%;
      min-height: 100%;
      overflow-y: scroll;
      position: relative;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .item-box{
        flex: 1;
        border-bottom: 1px solid #ccc;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        .img-container{
          display: flex;
          flex-direction: row;
          align-items: center;
          img{
            display: block;
            width: pxToRem(136);
            margin: 0 pxToRem(50);
          }
          .desc-box{
            display: flex;
            flex-direction: column;
            color: #333;
            min-width: 230px;
            .desc-title{
              font-weight: 700;
              font-size: pxToRem(20);
            }
            .desc-subTitle{
              margin-top: 30px;
              font-size: pxToRem(16);
              .subtitle-explain{
                color: $baseColor;
                font-size: pxToRem(18);
              }
            }
          }
        }
        .num-container{
          flex-wrap: wrap;
          display: flex;
          flex-direction: row;
          align-items: center;
          .num-item{
            padding-left: pxToRem(10);
            padding-right: pxToRem(10);
            margin-right: pxToRem(20);
            margin-bottom: 15px;
            border:1px dashed  #ccc;
            display: flex;
            flex-direction: column;
            width: pxToRem(148);
            height: pxToRem(148);
            border-radius: 6px;
            justify-content: center;
            align-items: center;
            font-size: pxToRem(20);
            color: #666;
            .num{
             color: $baseColor;
              font-weight: 700;
            }
            .desc{
              margin-top: 20px;
              font-size: pxToRem(16);

            }
          }
        }
      }


    }


  }
</style>
