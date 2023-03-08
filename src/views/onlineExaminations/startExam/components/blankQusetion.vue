<template>
  <div class="exam-question-item">
    <div class="exam-question-item-title clearfix">
      <div class="exam-question-item-type">
        <div class="exam-question-item-type-name">{{ data.typename }}</div>
        <span>{{ data.score  ? '（'+data.score+'）分' : ''}}</span>
      </div>
      <div class="exam-question-item-content">
        <div class="exam-question-item-content-title">
          <span class="exam-question-item-content-list-num">{{data.px + "、"}}</span>
          <span v-html="data.topic"></span>
        </div>
      </div>
    </div>
    <div class="exam-question-item-answer">
      <span>你的答案：</span>
      <div class="exam-question-item-answer-container">
        <span v-for="(listli, index) in data.optionnum"
              class="exam-question-item-answer-num">
        <span class="input-index">{{listli}}</span>
        <el-input type="textarea" rows="3" v-model="objData[listli]" placeholder="请输入答案" class="input-textarea" @change="answerChange($event)"></el-input>
      </span>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "BlankQuestion",
    components: {},
    props: {
      qsData: {
        type: Object,
        default: () => {
          return {};
        }
      },
    },
    data() {
      return {
        objData:{
          '1':'',
          '2':'',
          '3':'',
          '4':'',
          '5':'',
          '6':'',
          '7':'',
          '8':'',
        },
        data:{},
      };
    },
    mounted() {
      this.data = _.cloneDeep(this.qsData);
      // console.log('data == ',this.data)
      if(this.data.answer && this.data.answer.length){
        this.data.answer.forEach((item,index) => {
          this.objData[index+1] = item;
        });
        // this.answerChange();
      }

    },
    created() {
    },
    methods: {

      answerChange(val) {
        let obj1 = {};
        for(let k in this.objData){
          if(this.data.optionnum < k){
            break;
          }else{
            obj1[k] = this.objData[k]
          }
        }
        let obj = {
          type:this.data.type,
          questionid:this.data.questionid,
          answer: obj1
        };
        this.$emit("setAnswerObj",obj);
      },


    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  $cardBgColor: #8aaae3;
  .exam-question-item {
    clear: both;
    .exam-question-item-title {
      background-color: #d5e4fb;
      padding: 10px 0px;
    }
    .exam-question-item-type {
      width: 10%;
      float: left;
      .exam-question-item-type-name {
        width: 100%;
        text-align: center;
        font-weight: bold;
        margin-top: 15px;
      }
      span {
        display: inline-block;
        width: 100%;
        text-align: center;
      }
    }
    .exam-question-item-content {
      float: left;
      line-height: 20px;
      width: 90%;
      .exam-question-item-content-title {
        span {
          display: inline-block;
        }
      }
      ul {
        list-style-type: none;
        margin: 0px;
        padding: 0px;
        width: 100%;
        li {
          width: 100%;
          span {
            display: inline-block;
          }
        }
      }
    }
    .exam-question-item-answer {
      margin-left: 10%;
      margin-top: 20px;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      .exam-question-item-answer-container{
        flex: 1;
        .exam-question-item-answer-num {
          padding-left: 10px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          .input-index{
            margin-top: 5px;
          }
          .input-textarea{
            margin-left: 20px;
            width: 88%;
          }
        }
        .my-answer-container{
          padding-left: 0;
          .input-textarea{
            margin-left: 0;
          }
        }
      }
    }
  }
  .file-name{
    margin-left: 4px;
    margin-top: 10px;
    color: $baseColor;
    font-size: pxToRem(16);
  }
  .file-type-desc{
    margin-left: 15px;
    font-size: pxToRem(14);
    color: #666;
  }
</style>
