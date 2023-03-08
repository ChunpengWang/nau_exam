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
          <span v-html="data.topic" ></span>
        </div>
      </div>
    </div>
    <div class="exam-question-item-answer">
      <span>你的选择：</span>
      <span
        v-for="(listli, index) in data.optionList" class="exam-question-item-answer-num">
        <el-radio v-model="radio" :label="listli" @change="answerChange">{{listli.value}}</el-radio>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "JudgeQuestion",
    components: {},
    props: {
      qsData: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {
        radio: null,
        data:{}
      };
    },
    mounted() {
      this.data = _.cloneDeep(this.qsData);
      // console.log('data == ',this.data)
      if(!this.isColligateQuestion && this.data.answer && this.data.answer.length){
        this.radio = (this.data.optionList || []).filter(item => item.oid === this.data.answer[0])[0];
        // this.answerChange();
      }
    },
    created() {
    },
    methods: {
      answerChange() {
        let obj = {
          type:this.data.type,
          questionid:this.data.questionid,
          answer:this.radio ? [this.radio.oid] : []
        };
        this.$emit("setAnswerObj",obj);
      }
    }
  };
</script>

<style lang="scss" scoped>
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
      .exam-question-item-answer-num {
        margin-right: 20px;
      }
    }
  }
</style>
