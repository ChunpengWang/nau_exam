<template>
  <div class="two-container-box">

    <div class="two-container">

      <div class="two-paper-container" id="paperContainer">


        <div class="list-container" v-for="listItem in questionList" :key="listItem.bigid">
          <div class="list-title">第{{listItem.index}}大题 <span style="margin: 0 5px">{{questionTypeObj[listItem.type]}}</span> (共{{listItem.num}}题，每题{{listItem.score}}分)</div>
          <div class="two-paper-list-container radio-container" v-for="(item,index) in listItem.questionList" :key="item.questionid">

            <div class="list-content-box" >

              <div class="content-position-container" style="flex: 1;padding-right: 30px">
                <div class="content-question-container">
                  <div v-html="item.topic" class="question-box" ></div>
                  <p class="question-title-style" style="margin-left: 3px;"><span
                    class="titleStyle">分值：{{listItem.score}}分</span></p>
                </div>
                <div class="content-answer-container">
                  <div v-if="item.type == '1' || item.type == '3' " class="my-el-radio-box">
                    <el-radio
                      class="my-el-radio-item"
                      v-model="item.radioValue"
                      :label="value.oid"
                      :key="value.oid"
                      v-for="value in item.optionList">
                      <div v-html="value.value" class="html-container" ></div>
                    </el-radio>
                  </div>

                  <div v-if="item.type == '2' " class="my-el-radio-box">
                    <el-checkbox v-for="value in item.optionList" :key="value.oid" class="my-el-radio-item" v-model="value.isRight == 1">
                      <div v-html="value.value" class="html-container" ></div>
                    </el-checkbox>
                  </div>

                  <div v-if="item.type == '5' || item.type == '4'" class="my-el-radio-box">
                    <div v-for="(value,key) in item.optionList" class="option-box-container">
                      <span>{{key + 1}}.</span>
                      <div v-html="value.value" class="html-container"></div>
                    </div>
                  </div>


                </div>
              </div>



            </div>


          </div>
        </div>

      </div>


    </div>
  </div>

</template>

<script>
  import global from '@/utils/global';
  import {QuestionTypeEnum} from '@/api/enum';

  export default {
    props: ['paperData'],
    name: '',
    data() {
      return {
        questionList:[],
        questionTypeObj:QuestionTypeEnum, // 题型列表
      }
    },
    mounted(){},
    created(){
      // console.log('two this.paperData = ',this.paperData);
      let list =  JSON.parse(this.paperData.questionlist || '[]')
      this.questionList = list.map((listItem,listIndex) =>{
          listItem.index = global.numberToChinese(listIndex + 1);
          listItem.questionList = listItem.questionList.map(item => {
            if(item.type =='1' || item.type == '3'){
              item.radioValue = (item.optionList.find(ele => ele.isRight == 1) || {}).oid
            }
            return item
          })
        return listItem
      })
    },
    methods:{}
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .two-container-box{
    .export-paper{
      padding-left: 30px;
      height: 50px;
      line-height: 50px;
      background-color: #fff;
    }
  }
  .two-container {
    padding: 0 30px;
    background-color: #fff;
    max-height: 60vh;
    overflow-y: scroll;
    .two-paper-container {
      background-color: #f4f5f9;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 20px 20px 0 20px;
      margin-bottom: 20px;
      overflow: hidden;
      .list-container{
        .list-title {
          background-color: #f4f5f9;
          text-align: center;
          line-height: 50px;
        }
        .two-paper-list-container{
          overflow-y: scroll;
          .list-title-box{
            height: 55px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .list-content-box{
            /*height: 135px;*/
            display: flex;
            justify-content: space-between;
            position: relative;
            background-color: #fff;
            border-radius: 10px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            padding: 20px 20px 15px 20px;
            /*padding: 20px;*/
            .content-question-container{
              display: flex;
              flex-direction: row;
              margin-bottom: 10px;
              .question-box{
                padding-right: 80px;
              }
              .question-title-style{
                position: absolute;
                right: 50px;
                /*display: flex;*/
                /*flex-direction: row;*/
                /*margin-top: 15px;*/
                /*min-width: 98px;*/
                /*align-items: center;*/
                /*align-self: flex-start;*/
                font-size: pxToRem(16);
                .titleStyle{
                  color: $baseColor;
                }
              }
            }
            .content-position-container{
              /*position: absolute;*/
              /*right: 20px;*/
              /*top:0;*/
              justify-content: center;
              display: flex;
              flex-direction: column;
              .content-answer-container{
                display: flex;
                flex-direction: column;
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
                .children-question-container{
                  display: flex;
                  flex-direction: row;
                  /*align-items: center;*/
                  margin-bottom: 10px;
                  .question-box{
                    padding-right: 80px;
                  }
                  .question-title-style{
                    position: absolute;
                    right: 50px;
                    font-size: pxToRem(16);
                    .titleStyle{
                      color: $baseColor;
                    }
                  }
                }
              }
              > .img-container {
                cursor: pointer;
                img{
                  margin-bottom: 8px;
                }
                img:nth-of-type(4){
                  margin-bottom: 0;
                }
              }

              .question-option-box{
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
              }

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
