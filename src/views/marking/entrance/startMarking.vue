<template>
  <div class="entrance-container">

    <div class="tab-container">
      <el-tabs v-model="questionType" class="my-el-tabs my-el-entrance-tabs" @tab-click="handleTabClick">
        <el-tab-pane :label="listItem.name" :key="listItem.bigid" :name="listItem.bigid" v-for="listItem in listData" class="my-el-entrance-tab-box">


            <div class="question-container" v-for="item in listItem.questionList">
              <div class="question-box">
                <span class="index-box">{{item.px}}.</span>
                <div class="question-title-box" v-html="item.topic"></div>
                <span class="question-score">（{{item.score}}分）</span>
              </div>

              <div class="student-answer-box answer-box">
                <p class="answer-desc"> 考生答案：</p>
                <div class="answer-content" v-html="item.ksxxnr"></div>
              </div>
              <div class="right-answer-box answer-box">
                <p class="answer-desc"> 参考答案：</p>
                <div class="answer-content question-title-box" v-html="item.referenceanswer"></div>
              </div>
              <div class="give-score-box answer-box">
                <span class="answer-desc"> 给分板：</span>
                <el-input class="input-score" size="mini" v-model="item.scoreValue" type="number"
                          @change="inputChange($event,item)"></el-input>
                <span class="score-desc">不能超过本题的最大分值</span>
              </div>

            </div>

        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="score-container">
      <div class="score-title">得分板</div>
      <div class="lesson-box">
        <i class="el-icon-s-unfold"></i>
        <span style="margin-left: 3px;">{{queryData.subjectname || '-'}}</span>
      </div>
      <div class="score-content">
        <div>
          <div class="content-item" v-for="item in scoreListData.questionList">
            <span class="title-style">{{item.px}}题</span>
            <span class="dashed-style"></span>
            <span class="score-style">{{(item.scoreValue || item.scoreValue === 0)  ? item.scoreValue+'分' : '-'}}</span>
          </div>
        </div>
      </div>
      <div class="score-foot">
        <div class="score-total">
          <span class="solid-box"></span>
          <span class="score-box">得分：{{totalScore || '-'}}分</span>
          <span class="solid-box"></span>
        </div>
        <div class="btn-container">
          <el-button size="mini" class="submitBtn" @click="submitScore">提交分数</el-button>
        </div>

      </div>

    </div>


  </div>
</template>

<script>
  import { getAnswerContentById,getPaperContentById,submitScore } from '@/api/marking';
  import global from '@/utils/global';
  import {QuestionTypeEnum} from '@/api/enum';
  export default {
    name: '',
    data() {
      return {
        totalScore: 0,
        questionType: '',
        userId: '',
        listData: [], //试题 策略
        scoreListData: [],
        queryData:{}
      };
    },
    mounted() {
    },
    created() {
      this.userId = this.$route.query.userId;
      this.queryData = this.$route.query
      // console.log('queryData ==',this.queryData)
      this.getData();
    },
    methods: {


      //获取试卷
      async getData() {

        // 获取试卷 和参考答案
        let resPaper = await getPaperContentById({paperid:this.queryData.paperid});
        // console.log('resPaper.data =',resPaper.data)

        // 前端过滤试卷待评阅的数据
        let lindex =0
        let resFilterData = ((resPaper.data || {}).questionArr || []).filter((item,index) =>{
          item.questionList = item.questionList.map(qitem =>{
            lindex++
            qitem.px = lindex
            return qitem
          })
          if(item.type==4){
            item.questionList = item.questionList.filter(ele=> ele.way ==2)
          }
          return item.type==5 || (item.type==4 && item.questionList.some(ele=> ele.way ==2))
        })

        // 获取答题卡 考生答案
        let resAnswer = await getAnswerContentById({answerid:this.queryData.answerid});
        // console.log('resAnswer.data =',resAnswer.data);
        let getStorageListInfo = this.getListStorage();
        this.totalScore = 0;

          this.listData = resFilterData.map(item => {
            item.questionList = item.questionList.map(qitem => {
              qitem.score = item.score;
              (resAnswer.data || []).forEach( ritem=> {
                if(ritem.questionid == qitem.questionid){
                  let arr = [];
                  for (let k in ritem.answer) {
                    arr.push(` ${k}： ${ritem.answer[k]} `);
                  }
                  qitem.ksxxnr = `<p>${arr.join(`<br/><br/>`)}</p>`;
                }
              })

              //  参考答案
              // qitem.referenceanswer = '答案解析xx'

              // 当前用户已打的分
              qitem.scoreValue = '';
              getStorageListInfo.forEach(sItem => {
                if (sItem.userId === this.userId && sItem.questionId === qitem.questionid) {
                  qitem.scoreValue = sItem.score;
                  this.totalScore += isNaN(parseInt(sItem.score)) ? 0 : parseInt(sItem.score);
                }
              });

              return qitem
            })
            item.name = QuestionTypeEnum[item.type]
            return item
          })


        this.questionType = this.listData[0] ? this.listData[0].bigid : '';
        this.scoreListData = this.listData[0];
        // console.log('listData ==',this.listData)
        // console.log('scoreListData ==',this.scoreListData)
      },

      // 打分change
      inputChange(val, inputItem) {
        // console.log('val = ',val);
        // console.log('inputItem = ',inputItem);
        if (parseInt(val) > inputItem.score) {
          global.showMessage('超过该题的最大分值');
        }
        if (parseInt(val) < 0) {
          global.showMessage('请输入正数值');
        }
        this.totalScore = 0;
        let answerList = this.getListStorage() ||  [];
        this.listData = this.listData.map(listItem => {
          listItem.questionList = listItem.questionList.map(qItem => {
            //分数赋值
            if (qItem.questionid === inputItem.questionid) {
              qItem.scoreValue = parseInt(val) > inputItem.score ? inputItem.score : (parseInt(val) < 0 ? 0 : val);
            }
            //总得分
            this.totalScore += isNaN(parseInt(qItem.scoreValue)) ? 0 : parseInt(qItem.scoreValue);
            //写入缓存
            let arrFilter = answerList.filter(aItem => aItem.userId === this.userId && aItem.questionId === qItem.questionid);
            if(arrFilter.length){
              arrFilter[0].score = qItem.scoreValue
            }else{
              answerList.push({
                questionId: qItem.questionid,
                userId: this.userId,
                score: qItem.scoreValue
              });
            }

            return qItem;
          });
          return listItem;
        });
        this.scoreListData = this.listData.filter(item => item.bigid === this.questionType)[0];
        this.setListStorage(answerList);
      },

      //点击提交分数
      async submitScore() {
        let arr = [];
        let listArr = _.cloneDeep(this.listData);
        listArr.forEach(listItem => {
          listItem.questionList.forEach(qItem => {
            arr.push({
              type:qItem.type,
              questionid:qItem.questionid,
              score:qItem.score,
              scoreValue:qItem.scoreValue,
            });
          });
        });
        let arr1 = arr.filter(item => parseInt(item.scoreValue) !== 0 && !item.scoreValue);
        // console.log('arr1 =',arr1);
        if (arr1.length) {
          return global.showMessage('请全部题目打完分后再进行提交！');
        }
        this.$confirm('所有题目都已阅卷完成，是否确认提交分数?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.submitFun(arr);
        });
      },

      //提交逻辑
      async submitFun(list = []) {
        // console.log('submitFun list = ',list);
        let param ={
          answerid: this.queryData.answerid,
          planid: this.queryData.planid,
          subjectcode: this.queryData.subjectcode,
          idcard:this.$store.state.user.user.idcard,
          paperid:this.queryData.paperid,
          arrlist:JSON.stringify(list)
        }

        // console.log('submitScore param = ',param);
        let res = await submitScore(param);
        if (res.state == '200') {
          global.showMessage(res.msg, 'success');
          setTimeout(() => {
            this.$router.push({ name: 'entrance' });
          }, 1800);
        } else {
          global.showMessage(res.msg);
        }

      },

      //change Tablist
      handleTabClick(val) {
        this.scoreListData = this.listData.filter(item => item.bigid === this.questionType)[0];
      },

      //本地缓存
      setListStorage(markInfo) {
        window.localStorage.setItem('markInfo', JSON.stringify(markInfo));
      },

      //获取缓存
      getListStorage() {
        const markInfo = window.localStorage.getItem('markInfo');
        return markInfo ? JSON.parse(markInfo) : [];
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";

  .entrance-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .tab-container {
      flex: 4.5;
      overflow: hidden;

      .question-container {
        font-size: pxToRem(16);
        color: #333;
        width: 100%;
        padding: pxToRem(30) pxToRem(40) 0 pxToRem(50);

        .question-box {
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 30px;

          .index-box {
            min-width: pxToRem(32);
            align-self: flex-start;
            margin-top: 15px;
          }

          .question-title-box {
            flex: 1;
          }

          .question-score {
            color: #f2637b;
            margin-left: 2px;
            align-self: flex-start;
            margin-top: 15px;
          }
        }

        .answer-box {
          padding-left: pxToRem(32);
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;

          .answer-desc {
            min-width: 64px;
          }
        }

        .student-answer-box {
          margin-top: 5px;
        }

        .right-answer-box {
          .answer-content {
            flex: 1;
            border: 1px dashed #ccc;
            border-radius: 6px;
            min-height: 45px;
            padding: pxToRem(8) pxToRem(16);
          }
        }

        .give-score-box {
          display: flex;
          align-items: center;
          flex-direction: row;
          background-color: #f4f5f9;
          padding: 5px 15px;

          .input-score {
            width: pxToRem(100);
          }

          .score-desc {
            margin-left: 10px;
            font-size: pxToRem(14);
            color: #f2637b;
          }
        }
      }
    }

    .score-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 pxToRem(20);
      border-left: 1px solid #E4E7ED;

      .score-title {
        height: 39px;
        display: flex;
        align-items: center;
        margin-left: pxToRem(-20);
        padding-left: pxToRem(20);
        font-size: pxToRem(14);
        color: #333;
        border-bottom: 1px solid #E4E7ED;
      }

      .lesson-box {
        display: flex;
        flex-direction: row;
        align-items: center;

        i {
          font-size: 18px;
        }

        padding: 15px 0;
        font-size: pxToRem(16);
        color: #999;
      }

      .score-content {
        flex: 1;
        overflow-y: scroll;

        .content-item {
          display: flex;
          height: 40px;
          align-items: center;
          flex-direction: row;

          span {
            flex: 1
          }

          .dashed-style {
            flex: 4.5;
            border-bottom: 1px dashed #999;
          }

          .score-style {
            text-align: right;
            color: #f2637b;
          }
        }
      }

      .score-foot {
        .score-total {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin: 15px 0;

          span {
            flex: 1;
          }

          .solid-box {
            border-bottom: 1px solid #999;
          }

          .score-box {
            text-align: center;
          }
        }

        .btn-container {
          text-align: center;
          margin-bottom: 28px;

          .submitBtn {
            background: #fd9001;
            width: 100%;
            color: #fff;
            height: 50px;
            font-size: pxToRem(18);
          }
        }
      }
    }

    .question-title-box /deep/ img {
      max-width: 100% !important;
    }

  }
</style>
