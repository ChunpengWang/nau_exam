<template>
  <div class="add-place-container">

    <div class="title-container">
      <div class="title-style">{{data.papername}}</div>
      <div class="subTitle-style">
        <span>学号：{{data.studentcode}}</span>
        <span>姓名：{{data.studentname}}</span>
        <span>总分：{{data.totalscore}}</span>
        <span>得分：{{data.releassetotalscore}}</span>
      </div>
    </div>

    <div class="content-container">
      <div class="list-container" v-for="listItem in data.questionArr">
        <div class="list-title">第{{listItem.index}}大题 <span style="margin: 0 5px">{{listItem.name}}</span> (共{{listItem.num}}题，每题{{listItem.score}}分)</div>
        <div class="item-container" :key="item.questionid" v-for="(item,index) in listItem.questionList">

          <div >
            <div class="question-title-box">
<!--              <p class="index-container">{{item.px}}. </p>-->
              <div v-html="item.topic"  class="question-box" ></div>
              <p class="index-container score-box " style="margin-left: 3px;">（{{listItem.score}}分）</p>
            </div>
            <div v-if="item.type == 1 || item.type == 3 " class="my-el-radio-box">
              <el-radio
                class="my-el-radio-item"
                v-model="item['radioValue']"
                :label="value.oid"
                :key="value.oid"
                v-for="value in item.optionList">
                <div v-html="value.value" class="html-container"></div>
              </el-radio>
            </div>
            <div v-if="item.type == 2" class="my-el-radio-box">
              <el-checkbox  v-for="value in item.optionList"  :key="value.oid" class="my-el-radio-item" v-model="value.checkboxValue">
                <div v-html="value.value" class="html-container"></div>
              </el-checkbox>
            </div>
            <div v-if="item.type == 5 || item.type == 4" class="my-el-radio-box"></div>


            <div class="desc-box">
              <p class="desc-label">考生答案：</p>
              <div v-html="item.ksxxnr"></div>
            </div>
            <div class="desc-box">
              <p class="desc-label"> {{item.type == 5  || (item.type == 4 && item.way ==2 )? '参考' :'正确'}}答案：</p>
              <div v-html="item.zqda"></div>
            </div>
            <div class="desc-box">
              <p class="desc-label">本题得分：</p>
              <p class="score-box"> {{item.ksfs}}分</p>
            </div>


          </div>



        </div>
      </div>

    </div>

  </div>
</template>

<script>
  export default {
    props: ['detailData'],
    name: '',
    data() {
      return {
        data:{},
      }
    },
    mounted(){},
    async created(){
      this.data = this.detailData;
    },
    methods:{

    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .add-place-container {
    .title-container{
      padding: 20px 20px 10px 20px;
      color:#333;
      background-color: #f4f5f9;
      font-size: pxToRem(22);
      .subTitle-style{
        margin: 10px;
        font-size: pxToRem(18);
        display: flex;
        flex-direction: row;
        span{
          flex: 1;
        }
      }
    }
    .content-container{
      overflow-y: scroll;
      max-height: 60vh;
      padding: 20px 0;
      background-color: #fff;
      .big-question-container{
        color:#999;
        font-size: pxToRem(16);
        /*margin-bottom: 10px;*/
      }
      .list-container{
        .list-title {
          background-color: #f4f5f9;
          text-align: center;
          line-height: 50px;
        }
        .item-container{
          background-color: #fff;
          padding: 10px 0;
          margin: 0 20px;
          border-bottom: 1px solid #ccc;
          color:#666;
          .question-title-box{
            display: flex;
            flex-direction: row;
            position: relative;
            margin-bottom: 10px;
            /*align-items: center;*/
            /*.index-container{*/
            /*  min-width: 25px;*/
            /*  align-self: flex-start;*/
            /*}*/
            .question-box{
              padding-right: 50px;
            }
            .score-box{
              /*min-width: 66px;*/
              position: absolute;
              right: 0;
              color:$baseColor
            }
          }
          .option-box{
            margin-top: 10px;
            font-size: pxToRem(18);
          }
          .desc-box{
            color:$baseColor;
            font-size: pxToRem(20);
            /*margin-top: 10px;*/
            padding-right: pxToRem(58);
            display: flex;
            align-items: center;
            flex-direction: row;
            > p:nth-of-type(1){
              color:#333;
            }
            .score-box{
              min-width: 66px;
              color:$baseColor
            }
            .desc-label{
              min-width: pxToRem(100);
            }

          }
          .my-el-radio-box{
            display: flex;
            flex-direction: column;
            .my-el-radio-item{
              margin: 0 10px;
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .html-container{
              display: flex;
              flex-direction: row;
              align-items: center;
            }
            .option-box-container{
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
          .question-mate-option-box{
            display: flex;
            flex-direction: row;
            .option-box{
              display: flex;
              flex: 1;
              flex-direction: column;
              /*justify-content: center;*/
              align-items: center;
              .option-item{
                border: 1px solid #ccc;
                width: 100%;
                padding: 0 15px;
                margin-bottom: 15px;
                cursor: pointer;
                height: 80px;
                overflow-y: scroll;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .pitch-on{
                border-color: $baseColor;
              }
            }
            .left-option-box{

            }
            .right-option-box{

            }
            .line-option-box{

            }
          }
          .question-cooperate-option-box{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .option-box{
              width: 100%;
              display: flex;
              align-items: center;
              flex-direction: column;
              .option-item{
                width: 60%;
                display: flex;
                flex-direction: row;
                align-items: center;
                border-top: 1px solid #ccc;
                .indicia{
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 60px;
                  border-left: 1px solid #ccc;
                  border-right: 1px solid #ccc;
                  padding: 0 10px;
                }
                .html-container{
                  flex: 2;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 60px;
                  overflow-y: scroll;
                  border-right: 1px solid #ccc;
                }
              }
              .option-item:nth-last-child(1){
                border-bottom: 1px solid #ccc;
              }
            }
            .top-option-box{
              margin-bottom: 20px;
            }
          }
          .children-question-container{
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            position: relative;
            /*align-items: center;*/
            .question-box{
              padding-right: 50px;
            }
            .score-box{
              position: absolute;
              right: 0;
              color:$baseColor
            }
          }
        }
      }
    }
  }

  .question-box /deep/ img{
    max-width: 100% !important;
  }
  .html-container /deep/ img{
    max-width: 100% !important;
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
</style>
