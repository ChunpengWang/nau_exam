<template>
  <div class="container">
    <my-loading :myloading='isLoading'></my-loading>

    <div class="confirmation-box" v-if="step === 1">
      <Confirmation ref="confirmation" :infoData="queryData" @transferEvt="fBtnEvt"></Confirmation>
    </div>
    <div class="notice-box" v-if="step === 2">
      <Notice ref="notice"  @transferEvt="fBtnEvt"></Notice>
    </div>


    <div class="startExam-box" v-show="step === 3">
      <div class="container-left">
        <div class="exam-info">
          <div class="exam-info-item">
            <span class="exam-info-item-title">姓 名：</span><span>{{queryData.studentname ||'-'}}</span>
          </div>
          <div class="exam-info-item">
            <span class="exam-info-item-title">身份证：</span><span>{{queryData.idcard||''}}</span>
          </div>
          <div class="exam-info-item">
            <span class="exam-info-item-title">考试科目：</span><span>{{queryData.subjectname ||'-'}}</span>
          </div>

          <div class="exam-info-item">
            <span class="exam-info-item-title">考试名称：</span><span>{{queryData.planname ||'-'}}</span>
          </div>
          <div class="exam-info-item">
            <span class="exam-info-item-title">考试进度：</span>
            <el-progress :percentage="progressValue" class="my-el-exam-progress" color="#33c58f" text-color="#fff"></el-progress>
          </div>
        </div>
        <div class="exam-question">
          <template v-for="(item, index) in listData" v-if="showAnswerSheet">
            <div :class="item.questionid === currentObj.questionid? 'exam-question-block current': 'exam-question-block'">
              <radio-question
                ref="radioQuestion"
                v-if="item.type == 1"
                :qsData="item"
                @setAnswerObj="setAnswerObj"
              ></radio-question>
              <check-question
                ref="checkQuestion"
                v-if="item.type == 2"
                :qsData="item"
                @setAnswerObj="setAnswerObj"
              ></check-question>
              <judge-question
                ref="judgeQuestion"
                v-if="item.type == 3"
                :qsData="item"
                @setAnswerObj="setAnswerObj"
              ></judge-question>
              <blank-question
                ref="blankQuestion"
                v-if="item.type == 4 || item.type == 5"
                :qsData="item"
                @setAnswerObj="setAnswerObj"
              ></blank-question>
            </div>
          </template>
        </div>
        <div class="exam-button">
          <div class="change-question">
            <img src="@/assets/images/examinee/prev.png" alt="上一题" @click="submitPrev">
            <img src="@/assets/images/examinee/next.png" alt="下一题" style="margin-left: 30px" @click="submitNext">
          </div>
          <div>
            <img src="@/assets/images/examinee/done.png" alt="交卷" @click="submitExam('1')">
          </div>
        </div>
      </div>
      <div class="container-right">
        <answer-sheet
          ref="answerSheet"
          v-if="showAnswerSheet && step === 3"
          :data="myqsdata"
          :ksjssj="ksjssj"
          @setCurrentObj="setCurrentObj"
          @timeOut="timeOut"
        ></answer-sheet>
      </div>
    </div>



  </div>
</template>

<script>
  import AnswerSheet from "./answerSheet";
  import RadioQuestion from "./components/radioQuestion";
  import CheckQuestion from "./components/checkQuestion";
  import BlankQuestion from "./components/blankQusetion";
  import JudgeQuestion from "./components/judgeQuestion";
  import Confirmation from "../confirmation/index";
  import Notice from "../notice/index";
  import myLoading from '@/components/loading/index';
  import global from '@/utils/global';
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import moment from 'moment';// 导入文件
  import {QuestionTypeEnum} from '@/api/enum';
  import {getPaperById,getAnswerById,submitAnswer} from '@/api/examinee';
  export default {
    directives: { elDragDialog },
    name: "",
    components: {
      Confirmation,
      Notice,
      AnswerSheet,
      RadioQuestion,
      CheckQuestion,
      BlankQuestion,
      JudgeQuestion,
      myLoading
    },
    data() {
      return {
        step:1, // 页面标识 1考生确认 2考生须知 3考试页面
        queryData:{}, // 页面参数对象
        isLoading:false,
        currentIndex: 0, //当前题目索引
        myqsdata:[], //存放 策略【试题】数据
        ksjssj: '', // 考试结束时间
        kskssj: '', // 考试开始时间
        listData: [], //试题 数据
        currentObj: null, //当前题目对象
        answerObj: {}, //提交答案得对象
        showAnswerSheet: false,  //是否展示答题卡部分
        dtkid: '',//答题卡id
        progressValue:0,//进度条
        fullPath:'/onlineExaminations/examList',
      };
    },
    created() {
      this.queryData = this.$route.query;
      // console.log('queryData ==',this.queryData)
    },
    mounted() {
      this.fullPath = this.$route.fullPath;
      this.step = localStorage.getItem('startExamStep') ? parseInt(localStorage.getItem('startExamStep')) : 1;
      this.dtkid = this.$route.query.answerid || '';
      this.init()
    },

    methods: {

      async init(){
        //答题页面时才获取试题
        if(this.step !='3'){
          return
        }
        this.showAnswerSheet = false
        this.isLoading = true;
        let currentIndex = Number(localStorage.getItem('pagination') || 0);
        let dtkId = localStorage.getItem('dtkId') || '';
        this.currentIndex = dtkId && dtkId === this.dtkid ? currentIndex : 0;
        let resPaper = await getPaperById({paperid:this.queryData.paperid})
        let resAnswer = await getAnswerById({answerid:this.queryData.answerid})
        this.kskssj = resAnswer.data.answerstartdate
        this.ksjssj = moment(this.kskssj).add(this.queryData.duration, "minute").format("YYYY-MM-DD HH:mm:ss")
        this.answerObj = {};
        let alreadyAnswer = resAnswer.data.answerArr || []
        // 接口获取答案
        alreadyAnswer.forEach(item => {
          this.answerObj[item.questionid] = {
            type:item.type,
            questionid:item.questionid,
            answer:item.answer
          }
        })

        //  接口获取策略试题
        this.myqsdata = (resPaper.data || []).map(item => {
          (item.questionList || []).map(ele=>{
              ele.typename = QuestionTypeEnum[ele.type]
              ele.score = item.score
              ele.px = this.listData.length + 1
              if(ele.type == 4 || ele.type == 5){
               ele.optionnum = (ele.optionList|| [] ).length
              }

            alreadyAnswer.forEach(aitem => {
              // console.log('aitem ==',aitem)
              if (aitem.questionid === ele.questionid){
                let arr = [];
                if(Array.isArray(aitem.answer)){
                  arr = aitem.answer
                }else{
                  for(let k in aitem.answer){
                    aitem.answer[k] ?  arr.push(aitem.answer[k]) : null;
                  }
                }
                ele['answer'] = arr;
              }
            });
            this.listData.push(ele)
            return ele
          })
          item.typename = QuestionTypeEnum[item.type]
          return item
        })


        this.currentObj = this.listData[this.currentIndex];
        // console.log('this.listData =',this.listData)
        // console.log('this.currentObj =',this.currentObj)
        this.isLoading = false;
        this.showAnswerSheet = true

        this.$nextTick(() => {
          let answerNum = 0;
          let arr = this.myqsdata.map(item => {
            item.questionList.map(element => {
              element.isCurrent = this.currentObj['questionid'] === element['questionid'];
              element.answer && element.answer.length ? answerNum++ : null;
              return element
            });
            return item;
          });
          this.myqsdata = _.cloneDeep(arr);
          this.progressValue = answerNum ? parseInt((answerNum / this.listData.length) * 100) : 0;
        });
      },


      // 答案设置
      setAnswerObj(item) {
        // console.log('setAnswerObj item = ',item);
        let answerNum = 0;
        let arr = this.myqsdata.map(eee => {
          eee.questionList.map(element => {
            if(element.questionid == item.questionid){
                  let arr1 = [];
                  if(Array.isArray(item.answer)){
                    arr1 = item.answer
                  } else{
                    for(let k in item.answer){
                      item.answer[k] ? arr1.push(item.answer[k]) : null
                    }
                  }
                  element.answer = arr1;
            }
            element.answer && element.answer.length ? answerNum++ : null;
            return element
          });
          return eee;
        });
        this.myqsdata = _.cloneDeep(arr);
        this.progressValue = answerNum ? parseInt((answerNum / this.listData.length) * 100) : 0;
        this.answerObj[item.questionid] = item;
        this.submitExam('0');
      },

      //交卷
      async submitExam(flag = '0') {
        if (flag === '1') {
          let str = this.progressValue < 100 ? '当前答题未完成' : '已全部答完';
          let str1 = this.progressValue < 100 ? '继续答题' : '取消';
          let str2 = this.progressValue < 100 ? 'warning' : 'success';
          this.$confirm(str + ', 确认交卷?', '提示', {
            confirmButtonText: '确认交卷',
            cancelButtonText: str1,
            type: str2
          }).then(() => {
            this.submitFun(flag)
          });
        } else {
          this.submitFun(flag)
        }
      },

      // 交卷逻辑
      async submitFun(flag = '0') {
         // console.log('交卷逻辑 = ',this.answerObj);
        let limitMinute = 0; // todo 限制考试前多少分钟不能交卷  开发模式下不限制
        let currentDate = moment().format('YYYY-MM-DD HH:ss:mm')
        let currentTime = new Date(currentDate).getTime();
        let startTime = new Date(this.kskssj).getTime();
        let minute = (currentTime - startTime) / 1000 / 60;
        // if(flag === '1' && minute < parseInt(limitMinute) ){
        //   return global.showMessage(`考试前${limitMinute}分钟内无法交卷`);
        // }
        let answerList = [];
        for (let i in this.answerObj) {
          let answerData;
          let arrTemp = [];
          if(Array.isArray(this.answerObj[i].answer)){
            this.answerObj[i].answer.length ? answerData = this.answerObj[i].answer : null;
          }else{
            for(let k in this.answerObj[i].answer){
              arrTemp.push(this.answerObj[i].answer[k])
            }
            arrTemp.filter(item => item).length ? answerData = this.answerObj[i].answer : null;
          }
          answerData ? answerList.push({
            questionid: this.answerObj[i].questionid,
            type: this.answerObj[i].type,
            answer: this.answerObj[i].answer,
          }) : null;
        }
        let param = {
          dtkid: this.dtkid,
          paperid: this.queryData.paperid,
          submitdate: currentDate,
          submitflag: flag, // 	交卷标识,1提交答案并交卷 0只提交答案
          answerList: JSON.stringify(answerList)
        };
        // console.log('answerList ==',answerList)
        // console.log('param ==',param)
        // let resSubmit = {};
        let resSubmit = await submitAnswer(param) || {}
        if (flag === '1' && resSubmit.state == '200') {
          global.showMessage('交卷成功', 'success');
          setTimeout(()=>{
            this.$router.replace({name: 'examList'})
          },1000)
        }
      },

      // 下一题
      submitNext() {
        if (this.currentIndex === this.listData.length - 1) {
          this.$message('最后一道题了');
          return false;
        }
        this.currentIndex++;
        this.currentObj = this.listData[this.currentIndex];
        let arr = this.myqsdata.map(item => {
          item.questionList.map(element => {
            element.isCurrent = this.currentObj['questionid'] === element['questionid'];
            return element
          });
          return item;
        });
        this.myqsdata = _.cloneDeep(arr);
      },

      // 上一题
      submitPrev() {
        if (this.currentIndex === 0) {
          this.$message('第一道题了');
          return false;
        }
        this.currentIndex--;
        this.currentObj = this.listData[this.currentIndex];
        let arr = this.myqsdata.map(item => {
          item.questionList.map(element => {
            element.isCurrent = this.currentObj['questionid'] === element['questionid'];
            return element
          });
          return item;
        });
        this.myqsdata = _.cloneDeep(arr);
      },

      // 选择答题卡索引进行跳转
      setCurrentObj(obj) {
        // console.log('setCurrentObj obj = ',obj);
        this.currentIndex = obj.px -1;
        this.currentObj = obj;
        let arr = this.myqsdata.map(item => {
          item.questionList.map(element => {
            element.isCurrent = this.currentObj['questionid'] === element.questionid;
            return element
          });
          return item;
        });
        this.myqsdata = _.cloneDeep(arr);
      },

      //倒计时结束
      timeOut(){
        global.showMessage('考试时间已结束,系统将自动交卷', 'info');
        setTimeout(()=>{
          this.submitFun('1');
        },1800);
      },

      fBtnEvt(evt){
        switch (evt) {
          case 'notice':
            this.step = 2;
            break;
          case 'startExam':
            this.step = 3;
            this.init()
            break;
        }
      },

    },
    watch: {
       step(newVal, oldVal) {
         localStorage.setItem('startExamStep', newVal)
      },
      $route(to,from){
        if(to.path === '/onlineExaminations/startExam'){
          this.$router.replace(this.fullPath);
        }else{
          this.step = 1;
        }
      },

    },
    //本地缓存当前页码和答题卡信息
    beforeUpdate() {
      localStorage.setItem('pagination', this.currentIndex);
      localStorage.setItem('dtkId', this.dtkid);
      localStorage.setItem('', this.step);
    },

    //移除本地缓存
    beforeDestroy() {
      localStorage.setItem('pagination', '0');
      localStorage.setItem('dtkId', '');
      localStorage.setItem('startExamStep', '1');
    }

  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";

  $cardBgColor: #8aaae3;
  .container {
    width: 100%;
    display: flex;
    .confirmation-box,.notice-box,.startExam-box{
      width: 100%;
    }
    .startExam-box{
      display: flex;
      .container-video{
        width: 300px;
        height: 100%;
        background-color: $cardBgColor;
        padding: 20px;
        .video-desc{
          color: #fff;
          line-height: 20px;
          font-size: 14px;
        }
      }
      .container-left {
        flex: 1;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 60px 20px 100px;
        position: relative;

        .exam-question {
          height: 100%;
          width: 100%;
          background-color: #fff;
          border-radius: 5px;
          overflow-y: scroll;
        }

        .exam-info {
          position: absolute;
          top: 0px;
          display: flex;
          width: 100%;
          flex-wrap: wrap-reverse;

          .exam-info-item {
            color: #fff;
            line-height: 30px;
            width: 30%;
            display: flex;
            flex-direction: row;

            span {
              padding-left: 20px;
            }

            .exam-info-item-title {
              box-sizing: border-box;
            }

            .my-el-exam-progress {
              flex: 1;
              padding-left: 20px;
              line-height: 30px;

              .el-progress__text {
                color: #fff;
              }
            }
          }
        }

        .exam-question-block {
          width: 100%;
          display: none;
        }

        .current {
          display: block;
        }

        .exam-button {
          margin-top: 18px;
          height: 100px;
          /*height: pxToRem(85);*/
          /*margin-top: 15px;*/
          /*line-height: 80px;*/
          /*.exam-submit {*/
          /*  float: right;*/
          /*  margin-top: 20px;*/
          /*  margin-right: 20px;*/
          /*}*/
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          img {
            width: pxToRem(180);
            cursor: pointer;
          }
        }
      }
      .container-right {
        width: 400px;
        height: 100%;
        background-color: $cardBgColor;
        border-radius: 5px;
        overflow: auto;
      }
    }

  }
  //设置滚动条显示
  ::-webkit-scrollbar {
    width: auto !important;
    height: auto !important;
    background-color: #f1f1f1;
    color: #c1c1c1;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;  /*滚动条的背景颜色*/
  }


  .model-container{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
    background: #000;
    z-index: 2000;

  }
  .model-body{
    width: 50%;
    margin-top: 15vh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 25%;
    overflow: auto;
    z-index: 2001;
    display: flex;
    border-radius: 2px;
    flex-direction: column;
    .model-header{
      padding: 20px 20px 10px;
      font-size: 18px;
      background-color: #4376d1;
      color: #fff;
      display: flex;
      justify-content: space-between;
      .icon{
        cursor: pointer;
      }
    }
    .model-content{
      height: 60vh;
      padding: 20px;
      background-color: #fff;
    }
  }

  .prompt-container{
    display: flex;
    flex-direction: row;
    //justify-content: center;
    align-items: center;
    >img{
      margin-right: 8px;
      width: 42px;
    }
  }

</style>
