<template>
  <div class="add-place-container">
    <div class="add-place-box">
    <div class="my-tinymce-container">


      <div class="question-item-container">
        <div class="question-item-box">
          <span class="my-label"><span class="start">*</span>关联科目：</span>
          <el-select v-model="subjectid" placeholder="请选择" class="my-el-select-container one-content-style">
            <el-option :label="item.subjectname" :value="item.subjectid" v-for="item in subjectList" :key="item.subjectid"></el-option>
          </el-select>
        </div>
      </div>

    <div class="question-item-container">
      <div class="question-item-box">
        <span class="my-label"><span class="start">*</span>题型：</span>
        <el-select v-model="questionType" placeholder="请选择" @change="handleChange" class="my-el-select-container one-content-style">
          <el-option :key= 'item.id' :label="item.name" :value="item.id" v-for="item in questionTypeList"></el-option>
        </el-select>
      </div>

      <div class="question-item-box">
        <span class="my-label"><span class="start">*</span>判分方式：</span>
        <el-select v-model="scoreWay" placeholder="请选择" @change="handleChangeWay" class="my-el-select-container one-content-style">
          <el-option :label="item.name" :value="item.id" v-for="item in scoreWayList" :key="item.id"></el-option>
        </el-select>
      </div>


    </div>




      <div class="question-item-container">
        <div class="question-item-box">
          <span class="my-label"><span class="start">*</span>题干：</span>
          <el-input
            v-model='topic'
            :rows="3"
            resize="none"
            type="textarea"
            placeholder="请输入题干"></el-input>
        </div>
      </div>


      <div class="question-item-container" v-show="questionType && questionType !='3'">
        <div class="question-item-box">
          <span class="my-label"><span class="start">*</span>选项个数：</span>
          <el-input-number v-model="optionNum" size="mini" :min="questionType=='4' || questionType=='5' ? 1 : 2" :max="6" label="请输入选项个数"></el-input-number>
          <el-button  size="mini" type="primary"  v-show="scoreWay == '1'" @click="createOption()" style="margin: 0 50px;">生成选项</el-button>
        </div>
      </div>


      <div class="question-item-container my-textarea-box-container">
        <div class="question-item-box">
          <span class="my-label"></span>
          <div class="option-list-container text-box">

            <div class="right-option-container" v-show="questionType && questionType !='5' && questionType !='4'">正确选项</div>

            <el-radio-group v-model="radioValue" class="question-radio-container" v-show="questionType =='1' || questionType =='3'">
              <div class="my-tinymce-box-select" v-for="(element,index) in optionList" :key="element.id">
                <el-radio :label="element.id" class="question-radio-item" style="display: flex;align-items: center;width:100%">
                  <div class="my-textarea-box" >
                    <el-input
                              :disabled="questionType == '3'"
                              v-model='element.value'
                              :rows="3"
                              resize="none"
                              type="textarea"
                              placeholder="请输入选项内容">
                    </el-input>
                  </div>
                </el-radio>
                <i class="el-icon-delete"
                   v-show="questionType =='1' && optionList.length > 2"
                   style="font-size: 20px;margin-left: 10px; cursor: pointer;width: 30px"
                   @click="resetOption(element,index)">
                </i>
              </div>
            </el-radio-group>


            <el-checkbox-group v-model="checkboxValue" class="question-radio-container" v-show="questionType=='2'">
              <div class="my-tinymce-box-select" v-for="(element,index) in optionList"  :key="element.id">
                <el-checkbox :label="element.id" class="question-radio-item" style="display: flex;align-items: center;width:100%">
                  <div class="my-tinymce-box">
                                        <el-input
                                                  v-model='element.value'
                                                  :rows="3"
                                                  resize="none"
                                                  type="textarea"
                                                  placeholder="请输入内容">
                                        </el-input>
                  </div>
                </el-checkbox>
                <i class="el-icon-delete"
                   v-show="optionList.length > 2"
                   style="font-size: 20px;margin-left: 10px; cursor: pointer;width: 30px"
                   @click="resetOption(element,index)">
                </i>
              </div>
            </el-checkbox-group>


            <div class="question-radio-container" v-show="questionType =='4' || questionType =='5'">
              <div class="my-tinymce-box-select" v-for="element in optionList" :key="element.id">
                <div class="my-tinymce-box">
                                                          <el-input class=""
                                                                    v-model='element.value'
                                                                    :rows="3"
                                                                    resize="none"
                                                                    type="textarea"
                                                                    placeholder="请输入内容">
                                                          </el-input>
                </div>
                <i class="el-icon-delete"
                   style="font-size: 20px;margin-left: 10px; cursor: pointer;width: 30px"
                   @click="resetOption(element)">
                </i>
              </div>
            </div>


          </div>
        </div>

      </div>



      <div class="question-item-container">
        <div class="question-item-box">
          <span class="my-label">答案解析：</span>
          <el-input
            v-model='answerDesc'
            :rows="3"
            resize="none"
            type="textarea"
            placeholder="请输入答案解析"></el-input>
        </div>
      </div>


    </div>
    </div>
    <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="fBtnEvt('fFormCancel')">取 消</el-button>
          <el-button size="mini" type="primary" @click="fSubmit" >保存</el-button>
      </span>

  </div>
</template>

<script>
import global from '@/utils/global';
import {QuestionTypeEnum} from '@/api/enum';
const QuestionType = [
  ...Object.entries(QuestionTypeEnum).map(item => ({
    id: item[0],
    name: item[1]
  }))
]
export default {
  name: '',
  data() {
    return {
      questionType:'',
      questionTypeList:QuestionType,
      topic:'',
      scoreWay:'',
      scoreWayList:[],
      optionNum:1,
      optionList:[],
      radioValue:'',
      checkboxValue:[],
      answerDesc:'',
      subjectList:[],
      subjectid:'',
      editId:''

    }
  },
  mounted(){},
  created(){

  },
  methods:{
    fBtnEvt(evt){
      this.$emit('transferEvt', evt)
    },
    handleChangeWay(val){
      if(val == '2'){
        this.optionList = []
      }

    },
    //切换题型
    handleChange(val){
      this.scoreWay = '1'
      const arr = [{name:'自动判分',id:'1'},{name:'不自动判分',id:'2'}]
      this.scoreWayList = arr.filter(item =>item.id === '1')
      this.optionList = []
      if(val== '4'){
        this.scoreWayList = arr
      }else if(val == '5'){
        this.scoreWayList = arr.filter(item =>item.id === '2')
        this.scoreWay = '2'
      }else if (val == '3'){
        this.optionList = [
          {id:'1',value:'正确'},
          {id:'2',value:'错误'},
        ]
      }else if (val == '2'){

      }else if (val == '1'){

      }
    },
    createOption(){
      const oldArr = this.optionList
      let arr = []
      let newLen = this.optionNum - oldArr.length
      if(newLen <0){
        return global.showMessage('请手动选择删减的选项');
      }
      for (let i = 0; i < newLen; i++) {
        arr.push({
          id:global.getRandomId(),
          value:''
        })
      }
      this.optionList = [...oldArr,...arr]
    },
    resetOption(element,index){
      this.optionList.splice(index,1)
      if(this.questionType == '1'){
        if(element.id == this.radioValue){
          this.radioValue = ''
        }
      }
      if(this.questionType == '2'){
        this.checkboxValue = this.checkboxValue.filter(item => item != element.id)
      }
    },
    fSubmit(){
      let optionList = this.optionList
      if(!this.subjectid){
        return global.showMessage('请选择关联科目');
      }
      if(!this.questionType){
        return global.showMessage('请选择题型');
      }
      if(!this.topic.trim()){
        return global.showMessage('请输入题干');
      }

      switch (this.questionType) {
        case "1":
          if(!optionList.length){
            return global.showMessage('请生成选项');
          }
          if(optionList.some(item => !item.value.trim())){
            return global.showMessage('请输入选项内容');
          }
          if(!this.radioValue){
            return global.showMessage('请选择正确答案');
          }
          optionList = optionList.map(item=> {
            return {
              value:item.value,
              isRight:item.id == this.radioValue ? 1 : 0
            }
          })
          break;
        case "2":
          if(!optionList.length){
            return global.showMessage('请生成选项');
          }
          if(optionList.some(item => !item.value.trim())){
            return global.showMessage('请输入选项内容');
          }
          if(!this.checkboxValue.length){
            return global.showMessage('请选择正确答案');
          }
          optionList = optionList.map(item=> {
            return {
              value:item.value,
              isRight:this.checkboxValue.includes(item.id) ? 1 : 0
            }
          })
          break;
        case "3":
          if(!this.radioValue){
            return global.showMessage('请选择正确答案');
          }
          optionList = optionList.map(item=> {
            return {
              value:item.value,
              isRight:item.id == this.radioValue ? 1 : 0
            }
          })
          break;
        case "4":
          if(this.scoreWay == '1'){
            if(!optionList.length){
              return global.showMessage('请生成选项');
            }
            if(optionList.some(item => !item.value.trim())){
              return global.showMessage('请输入选项内容');
            }
          }else{
            optionList = new Array(this.optionNum).fill({value:''})
          }
          break;
        case "5":
          optionList = new Array(this.optionNum).fill({value:''})
          break;
      }

      // if(!this.answerDesc.trim()){
      //   return global.showMessage('请输入答案解析');
      // }



      let param = {
        id:this.editId,
        type:this.questionType,
        topic:this.topic,
        way:this.scoreWay,
        optionlist:JSON.stringify(optionList),
        referenceanswer:this.answerDesc,
        relationid:this.subjectid
      }

      // console.log('param ==',param)


      this.$emit('transferEvt', { method: 'fSubmit', data: param })
    },
  },

};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";
.add-place-container {
  background-color: #f4f5f9;
  .add-place-box{
    padding: 20px;
    background-color: #fff;
    display: flex;
    .my-tinymce-container{
      display: flex;
      flex:1;
      flex-direction: column;
      padding-left: 20px;
      height: 100%;
      overflow-y: scroll;
      .question-item-container{
        width: 100%;
        display: flex;
        flex-direction: row;
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
            min-width:85px;
            display: inline-block;
            .start{
              color: red;
              margin-right: 2px;
            }
          }
          .one-content-style{
            flex: 1;
          }
        }
        .text-box{
          line-height: 45px;
        }
        .my-tinymce-box{
          display: flex;
          flex: 1;
          //align-self: center;
        }
        .my-textarea-box{
          display: flex;
          flex: 1;
          min-height: 60px;
          margin-bottom: 20px;
          padding-right: 10px;
        }
        .option-list-container{
          display: flex;
          flex: 1;
          flex-direction: column;
          .right-option-container{
            color:#333;
            font-size: pxToRem(14);
            margin-bottom: 3px;
          }
          .my-tinymce-box-select{
            display: flex;
            position: relative;
            flex-direction: row;
            align-items: center;
            margin-bottom: 20px;
            .yuan-img-container{
              cursor: pointer;
              min-width: 78px;
              text-align: center;
              //position: relative;
              //height: 100%;
              //flex: 1;
              //display: flex;
              //flex-direction: column;
              .key-container{
                position: absolute;
                top:0;
                left: 0;
                .start{
                  color: red;
                  margin-right: 2px;
                }
              }
              img{
                width: 16px;
                height: 16px;
              }
            }
            .question-radio-item{
              .el-radio__label{
                width: 100% !important;
              }
            }

          }
        }
        .my-label-qa{
          color:#333;
          font-size: pxToRem(14);
          /*flex: 1;*/
          min-width: 85px;
          display: inline-block;
          .start{
            color: red;
            margin-right: 2px;
          }
        }
      }
      .my-textarea-box-container{
        margin-bottom: 0;
      }
      .add-option-box{
        display: flex;
        align-items: center;
      }
      .title-box{
        .question-item-box{
          align-items: normal;
        }
      }
    }
  }

  .dialog-footer {
    width: 100%;
    height: 52px;
    display: block;
    text-align: right;
    padding: 11px 20px;
  }
}
.file-name-container{
  margin-left: pxToRem(30);
  color:#666;
}
</style>
<style lang="scss" >
  .add-place-container{
    .add-place-box{
      .my-tinymce-container{
        .question-item-container{
          .question-item-box{
            .option-list-container{
              .question-radio-container{
                .question-radio-item{
                  .el-radio__label,.el-checkbox__label{
                    width: 100% ;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  </style>
