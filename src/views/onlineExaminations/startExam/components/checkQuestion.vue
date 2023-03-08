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
        <div class="exam-question-item-content-list">
          <ul>
            <li v-for="(listli, index) in data.optionList" :key="index">
              <span class="exam-question-item-content-list-num">{{ formatterNum(index + 1) }}、</span>
              <span class="exam-question-item-content-list-html" v-html="listli.value"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="exam-question-item-answer">
      <span>你的选择：</span>
      <span class="exam-question-item-answer-num">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            :label="listli"
            :key="index"
            v-for="(listli, index) in data.optionList"
            @change="answerChange">{{ formatterNum(index + 1) }}</el-checkbox>
        </el-checkbox-group>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckQuestion",
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
      checkList: [],

      data:{}
    };
  },
  mounted() {
    this.data = _.cloneDeep(this.qsData);
    // console.log('data == ',this.data)

    if(!this.isColligateQuestion && this.data.answer && this.data.answer.length){
      (this.data.optionList || []).forEach(item => {
        this.data.answer.forEach(element => {
          if(item.oid === element){
            this.checkList.push(item);
          }
        })
      });
      // this.answerChange();
    }
  },
  created() {},
  methods: {
    formatterNum(num) {
      switch (num) {
        case 1:
          return "A";
          break;
        case 2:
          return "B";
          break;
        case 3:
          return "C";
          break;
        case 4:
          return "D";
          break;
        case 5:
          return "E";
          break;
        case 6:
          return "F";
          break;
        case 7:
          return "F";
          break;
        default:
          return "H";
      }
    },
    answerChange() {
      let obj = {
        type:this.data.type,
        questionid:this.data.questionid,
        answer:this.checkList.map(item => item.oid)
      };
      this.$emit("setAnswerObj", obj);
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
    span {
      display: inline-block;
    }
    .exam-question-item-answer-num {
      margin-right: 20px;
    }
  }
}
</style>
