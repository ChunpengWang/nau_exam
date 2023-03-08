<template>
  <div class="add-send-container">

    <div class="send-form-container">

      <div class="send-form-item">
       <span class="my-label">考试计划：</span>
        <el-select v-model="examName"
                   @change="handleChangeExam"
                   placeholder="请选择"
                   class="my-el-select-container send-form-item-box" >
          <el-option
            v-for="item in data.planList"
            :key="item.planid"
            :label="item.planname"
            :value="item.planid">
          </el-option>
        </el-select>
      </div>

      <div class="send-form-item">
        <div class="send-item-container">
          <span class="my-label">计划日期：</span>
          <span class="item-content">{{ infoData.date|| '-'}}</span>
        </div>
      </div>

      <div class="send-form-item">
        <div class="send-item-container">
          <span class="my-label">考生人数：</span>
          <span class="item-content">{{ infoData.studentnum|| '-'}}</span>
        </div>
      </div>

      <div class="send-form-table">
        <div class="send-form-table-item send-form-table-title">
          <span>场次名称</span>
          <span>场次时间</span>
          <span>考试科目</span>
          <span>考试试卷</span>
        </div>
        <div class="send-form-table-item" v-for="item in infoData.examCourseList">
          <span>
            {{item.name ||'-'}}
          </span>
          <span>   {{item.date ||'-'}}</span>
          <span>   {{item.subjectname ||'-'}}</span>
          <span>   {{item.papername ||'-'}}</span>
        </div>
      </div>

    </div>


     <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="fBtnEvt('fCancel')">取 消</el-button>
          <el-button size="mini" type="primary" @click="fSend">发布</el-button>
      </span>
  </div>
</template>

<script>
  import moment from 'moment';// 导入文件
  import global from '@/utils/global';
  import {changePlanState} from '@/api/examination';

  export default {
    name: '',
    props: ['template'],
    data() {
      return {
        examName:'',
        data:{},
        infoData:{},
        ksjhId:''
      }
    },
    mounted(){},
    created(){
      this.data = this.template
    },
    methods:{
      async handleChangeExam(val){
        this.ksjhId = val
        let planObj = this.data.planList.find(item => item.planid ==val)
        // console.log('planObj = ',planObj)
        this.infoData = planObj
        this.infoData.date = moment( this.infoData.startdate).format('YYYY-MM-DD')+'-' + moment( this.infoData.enddate).format('YYYY-MM-DD');
        let paperList = JSON.parse(this.infoData.paperlist || '[]')
        this.infoData.examCourseList = JSON.parse(this.infoData.scenelist || '[]').map((item,index) => {
          item.date = item.startdate + '-' + item.enddate;
          item.name = `第${index+1}场`
          item.papername = (paperList.find(ele=> ele.subjectid == item.subjectid) || {} ).papername
          return item;
        });
      },
      fBtnEvt(evt){
        this.$emit('transferEvt',evt)
      },

      //发布
      async fSend(){
        this.$emit('transferEvt', { method: 'fLoading', data: true });
        let res = await changePlanState({ids:this.ksjhId,state:'1'});
        console.log('examPublish res = ',res);
        this.$emit('transferEvt', { method: 'fLoading', data: false });
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.$emit('transferEvt','fSend')
        }else{
          global.showMessage(res.msg);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .add-send-container {
    background-color: #f4f5f9;

    .send-form-container {
      background-color: #fff;
      padding: 20px pxToRem(30) 35px pxToRem(30);
      .send-form-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
        .my-label {
          color: #333;
          font-size: pxToRem(14);
          min-width: 85px;
          display: inline-block;
        }
        .send-form-item-box {
          flex: 1;
        }
        .send-item-container{
          flex: 1;
          display: flex;
          line-height: 35px;
         .item-content{
           flex: 1;
         }
        }
      }
      .send-form-table{
        /*display: grid;*/
        border:1px solid #ccc;
        border-radius: 5px;
        .send-form-table-item{
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr;
          color: #333;
          font-size: pxToRem(14);
          min-height: pxToRem(40);
          justify-items: center;
          align-items: center;
          border-bottom: 1px solid #ccc;
        }
        .send-form-table-title{
          background-color: #f4f5f9;
        }
        .send-form-table-item:last-child{
          border-bottom: none;
        }
      }
    }
    .dialog-footer {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: pxToRem(30);
    }
  }
</style>
