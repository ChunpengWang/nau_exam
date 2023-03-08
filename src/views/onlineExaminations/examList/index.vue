<template>
  <div class="examList-container">
    <div class="content-box">
      <div class="back-btn">
        <el-button size="mini" @click="back" >返回</el-button>
      </div>
      <div class="select-container">
        <el-select v-model="planValue" placeholder="请选择考试计划" class="my-el-exam-select-container" @change="changePlan">
          <el-option v-for="item in planList" :key="item.planid" :label="item.planname" :value="item.planid"></el-option>
        </el-select>
      </div>
      <div style="flex: 1;overflow-y: scroll">
        <div class="scene-list-container" style="margin-top: 0" :key="index" v-for="(eee,index) in list">
          <div class="desc-container">
            当前场次：{{eee.scenename}}  {{eee.startdate}} ~ {{eee.enddate}}
          </div>
          <div class="list-container">
            <div class="item-container">
              <div class="item-box">
                <span class="exam-name">{{eee.subjectname}}</span>
                <el-button class="btn" size="mini" type="primary" @click="entry(eee)" >考试信息确认</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="scene-list-container no-data-container" style="margin-top: 0" v-if="!list.length">
           该考试计划下的场次还未到时间
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  import {getPlanListByIdCard,getPlanByIdcard} from '@/api/examinee';
  import global from '@/utils/global';
  export default {
    name: '',
    data() {
      return {
        planValue:'',
        list:[],
        planList:[]
      }
    },
    mounted(){},
    created(){
     this.getPlanData()
    },
    methods:{
      //获取考试计划数据
      async getPlanData(){
        let res = await  getPlanListByIdCard({idcard:this.$store.state.user.user.idcard});
        this.planList = res.data || [];
        if( this.planList.length){
          this.planValue = this.planList[0].planid;
          this.getData(this.planValue);
        }
      },
      //获取列表数据
      async getData(planid){
        let res = await getPlanByIdcard({idcard:this.$store.state.user.user.idcard,planid});
        if (res.state == '200') {
         this.list = res.data || [];
        } else {
          global.showMessage(res.msg);
        }
      },
      //考试计划change
      changePlan(val){
        if(val){
          this.getData(val);
        }

      },
      //进入考试
      async entry(eee){

        let checkinTime = 30 // todo 设置30分钟后不能进入考试  开发阶段默认不限制
        let currentTime = new Date().getTime();
        let ccksTime = new Date(eee.startdate).getTime();
        const minute = (currentTime - ccksTime) /1000/60;
        const limitFlag = (minute - checkinTime) > 0;
        // if(checkinTime && checkinTime > 0 && limitFlag){
        //   return global.showMessage(`考试已开始${checkinTime}分钟，禁止参加该次考试！`);
        // }

        let obj = this.planList.find(item=> item.planid == this.planValue) || {}
        this.$router.push({
          name: 'startExam', query: {
            ...eee,
            planname: obj.planname || '', //计划名称
          }
        });
      },
      //返回
      back(){
        this.$router.push({path: '/dashboard'})
      },

    },
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .examList-container {
    /*background-color: skyblue;*/
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .content-box{
      width: 51%;
      /*background-color: slategrey;*/
      height: 100%;
      display: flex;
      flex-direction: column;
      padding-top: pxToRem(58);
      > div {
        margin-top: 20px;
      }
      .scene-list-container{
        > div {
          margin-top: 20px;
        }
        .desc-container{
          font-size: pxToRem(20);
          color: #fff;
          /*font-weight: 700;*/
        }
        .list-container{
          overflow-y: scroll;
          display: grid;
          grid-template-columns: repeat(auto-fill, 33.33%);
          .item-container:nth-of-type(3n-1){
            padding: 0 pxToRem(17);
          }
          .item-container:nth-of-type(3n){
            padding-left: pxToRem(33);
          }
          .item-container:nth-of-type(3n+1){
            padding-right: pxToRem(33);
          }
          .item-container{
            .item-box{
              width: 100%;
              background-color: #fff;
              height: pxToRem(140);
              border-radius: 6px;
              display: flex;
              /*justify-content: center;*/
              font-size: pxToRem(18);
              padding: pxToRem(15) pxToRem(20);
              align-items: center;
              margin-bottom: pxToRem(25);
              flex-direction: column;
              position: relative;
              .exam-name{
                display: flex;
                align-self: flex-start;
                padding-top: pxToRem(10);
                overflow:hidden;
                text-overflow:ellipsis;
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp:3;
              }
              .btn{
                display: flex;
                align-self: flex-end;
                position: absolute;
                bottom: pxToRem(15);
              }
            }
          }
        }
      }
      .no-data-container{
        height:45%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: pxToRem(26);
        color:#fff;
      }

    }
  }
</style>
