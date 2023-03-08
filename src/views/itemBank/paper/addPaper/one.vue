<template>
  <div class="one-container">

    <div class="question-item-container">
      <div class="question-item-box">
        <span class="my-label">考试科目：</span>
        <el-select v-model="lessonName" placeholder="请选择" class="my-el-select-container one-content-style"  @change="handleChangeLesson">
          <el-option :key= 'item.subjectid' :label="item.subjectname" :value="item.subjectid" v-for="item in lesson"></el-option>
        </el-select>
      </div>
      <div class="question-item-box">
        <span class="my-label">组卷策略：</span>
        <el-select v-model="tacticsName" placeholder="请选择" class="my-el-select-container one-content-style" @change="handleChangeTactics">
          <el-option :key= 'item.tacticsid' :label="item.tacticsname" :value="item.tacticsid" v-for="item in tacticsList"></el-option>
        </el-select>
      </div>

    </div>


    <div class="question-item-container">
      <div class="question-item-box">
        <span class="my-label">试卷名称：</span>
        <el-input v-model="paperName" placeholder="请输入试卷名称" class="my-el-input-container" ></el-input>
      </div>
    </div>

    <div class="question-item-container">
      <div class="question-item-box">
        <span class="my-label">总分：</span>
       <span>{{totalScore || '-'}}</span>
      </div>
    </div>
    <div class="question-item-container">
      <div class="question-item-box">
        <span class="my-label">及格线：</span>
        <el-input v-model="passValue" placeholder="请输入及格线" class="my-el-input-container"></el-input>
      </div>
      <div class="question-item-box">
        <span class="my-label">考试时长：</span>
        <el-input v-model="duration" placeholder="请输入考试时长" class="my-el-input-container" ></el-input>
        <span style="margin-left: 10px;">分钟</span>
      </div>

    </div>


  </div>
</template>

<script>
  import {getTacticsListBySubjectId} from '@/api/question';
  import global from '@/utils/global';
  export default {
    props: ['lessonData'],
    name: '',
    data() {
      return {
        lesson:[],
        tacticsList:[],
        typeName:'',
        lessonName: '',
        tacticsName:'',
        paperName:'',
        totalScore:0,
        passValue:'',
        duration:''
      }
    },
    mounted(){},
    created(){
      this.lesson = this.lessonData || []
    },
    methods:{

      //考试科目change
      async handleChangeLesson(val){
        let res = await getTacticsListBySubjectId({relationid:val});
        this.tacticsList = res.data || [];
        this.tacticsName = '';
      },

      //组卷策略change
      async handleChangeTactics(val){
       this.tacticsList.forEach(item => {
          if(item.tacticsid === val){
            this.totalScore = item.totalScore
          }
        })
      },

      submit(){


        if(!this.lessonName){
          return global.showMessage('请选择考试科目');
        }
        if(!this.tacticsName){
          return global.showMessage('请选择组卷策略');
        }
        if(!this.paperName.trim()){
          return global.showMessage('请输入试卷名称');
        }
        if(!this.passValue.trim()){
          return global.showMessage('请输入及格线');
        }
        if(!this.duration.trim()){
          return global.showMessage('请输入考试时长');
        }
        if(this.totalScore && this.passValue.trim() > this.totalScore){
          return global.showMessage('及格线不能大于总分');
        }

        return  {
          paperName:this.paperName, // 名称
          duration:this.duration, //时长
          passValue:this.passValue, // 及格线
          tacticsId:this.tacticsName, // 策略id
          totalScore:this.totalScore, // 策略id
        }


      }


    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .one-container {
    background-color: #fff;
    display: flex;
    flex:1;
    flex-direction: column;
    max-height: 60vh;
    padding: 0 60px;
    overflow-y: scroll;
    .question-item-container{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-bottom: pxToRem(20);
      .question-item-box{
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-right: pxToRem(20);
        .my-label{
          color:#333;
          font-size: pxToRem(14);
          /*flex: 1;*/
          min-width: 85px;
          display: inline-block;
        }
        .one-content-style{
          flex: 1;
        }
        .my-el-input-container{
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          //.tactics-btn{
          //  line-height: 45px;
          //}
        }
      }
      .text-box{
        line-height: 45px;
      }

    }
  }
</style>
