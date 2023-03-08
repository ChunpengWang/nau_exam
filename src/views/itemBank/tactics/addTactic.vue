<template>
  <div class="tactics-tree-container">

    <div class="tactics-top-container">


        <div class="tactics-name-container">
          <div class="tactics-name-box-left">
            <span class="tactics-label">策略名称：</span>
            <el-input v-model="tacticsName" placeholder="请输入策略名称" class="tactics-select"></el-input>
          </div>

          <div class="tactics-name-box-right">
            <span class="tactics-label" style="margin-left: 30px;">总分</span>
            <span class="tactics-label" style="margin-left: 20px;">{{totalScore || '-'}}</span>
          </div>

        </div>

        <div class="tactics-name-container">
          <div class="tactics-name-box-left">
            <span class="tactics-label">所属科目：</span>
            <div class="tactics-select">
              <el-select @change="handleChangeSubject" v-model="subjectid" placeholder="请选择" class="my-el-select-container one-content-style">
                <el-option :label="item.subjectname" :value="item.subjectid" v-for="item in subjectList" :key="item.subjectid"></el-option>
              </el-select>

              <div class="tactics-btn">
                <el-button size="mini" type="primary" @click="addQuestion">增加大题</el-button>
              </div>
            </div>
          </div>
          <div class="tactics-name-box-right"></div>
        </div>
    </div>

    <el-tabs v-model="activeName" style="padding: 0 8px"  class="my-el-tabs my-el-tacticsTree-tabs" closable @tab-click="handleTabClick" @tab-remove="handleTabRemove">
      <el-tab-pane :label="item.name" :name="item.id" v-for="item in questionList" :key="item.id">
        <div class="my-tinymce-container">
          <div class="question-item-container">
            <div class="question-item-box">
              <span class="my-label">题型：</span>
              <el-select v-model="item.questionType" placeholder="请选择" @change="handleChangeQuestionType(item)" class="my-el-select-container one-content-style">
                <el-option :key= 'ele.id' :label="ele.name" :value="ele.id" v-for="ele in questionTypeList"></el-option>
              </el-select>
              <span style="margin-left: 15px">可抽题量：{{item.kqtl === '' ? '-' : item.kqtl}}</span>
            </div>
          </div>
          <div class="question-item-container">
            <div class="question-item-box">
              <span class="my-label">抽取题数：</span>
              <el-input  class="my-el-select-container" v-model="item.cqsl" size="mini"
                        placeholder="请输入抽取题数" @input="handleInputScore(item)" type="number" @change="detailQuantity($event,item,'cqsl')"></el-input>
            </div>
            <div class="question-item-box">
              <span class="my-label" style="min-width: 100px">每小题分值：</span>
              <el-input class="my-el-select-container" v-model="item.fs" size="mini" type="number"
                        placeholder="请输入每小题分值"  @input="handleInputScore(item)" @change="detailQuantity($event,item,'fs')"></el-input>
            </div>

          </div>
          <div class="question-item-container">
            <div class="question-item-box text-box">
              <span class="my-label">大题总分：</span>
              <span class="one-content-style">{{item.total || '-'}}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="fBtnEvt('fFormCancel')">取 消</el-button>
          <el-button size="mini" type="primary" @click="fSubmit" >保存</el-button>
      </span>

  </div>
</template>

<script>
  import global from '@/utils/global';
  import {QuestionTypeEnum} from '@/api/enum';
  import {getQuestionNum} from '@/api/question';
  const QuestionType = [
    ...Object.entries(QuestionTypeEnum).map(item => ({
      id: item[0],
      name: item[1]
    }))
  ]
  export default {
    props: ['template'],
    name: '',
    data() {
      return {
        subjectList:[], //科目列表
        subjectid:'', //关联科目
        questionTypeList:QuestionType, // 题型列表
        data:{},
        activeName: '', //tabvalue
        totalScore:0, //总分
        tacticsName:'', //策略名称
        editId:'',
        questionList: [{
          id: '0',
          name: '第1大题（0分）',
          questionType:'', // 题型
          cqsl: '', //抽取数量
          fs: '', //每题分值
          kqtl:'',  //可抽题量
          total:'' // 当前大题总分
        }],
      }
    },
    mounted(){},
    async created(){
      this.data = this.template;
    },
    methods:{
      fBtnEvt(evt){
        this.$emit('transferEvt', evt)
      },

      //抽取数量change
      detailQuantity(val,item,type){
        let str = '' + val;
        if (str.indexOf('.') !== -1) {
          let str2 = str.split('.')[0];
          item[type] = parseInt(str2);
          this.handleInputScore(item);
        }
      },

      ////科目change
      handleChangeSubject(){
        this.getStrategyNum(this.questionList[this.activeName])
      },

      /// 题型切换
      handleChangeQuestionType(item){
        this.getStrategyNum(item)
      },

      //计算分值
      handleInputScore(item){
        this.totalScore = 0;
        item.total = _.isNaN(item.cqsl * item.fs) ? 0 :item.cqsl * item.fs;
        let arr = item.name.split('（');
        item.name = `${arr[0]}（${item.total}分）`;
        this.questionList.forEach(element => {
          this.totalScore += element.total
        });
      },


      //tab切换
      handleTabClick(){},

      //添加大题
      addQuestion(){
        let index  = this.questionList.length;
        this.questionList.push({
          id: index+ '',
          name: '第' + (index+1) + '大题（0分）',
          questionType:'',
          cqsl: '',
          fs: '',
          total:'',
          kqtl:''
        });
      },

      //移除大题
      handleTabRemove(targetName) {
        let index  = this.questionList.length;
        if(index === 1){
          return;
        }
        let arr  =  this.questionList.filter(item => item.id !== targetName);
        this.totalScore = 0;
        this.questionList = arr.map((item,index) => {
          item.id = index + '';
          item.name = '第' + (index + 1) + '大题（' + item.name.split('（')[1];
          this.totalScore += item.total;
          return item;
        });
        this.activeName = this.questionList[targetName] ? targetName : (targetName - 1) + '';
      },


      //提交
      fSubmit(){
        if(!this.tacticsName.trim()){
          return global.showMessage('请输入策略名称');
        }
        if(!this.subjectid){
          return global.showMessage('请选择所属科目');
        }

        let arr = _.cloneDeep(this.questionList);

        if(arr.some(item =>!item.questionType).length){
          return global.showMessage('请选择题型');
        }
        if(arr.some(item =>!item.cqsl).length){
          return global.showMessage('请输入抽题数量');
        }
        if(arr.some(item =>!item.fs).length){
          return global.showMessage('请输入每小题分值');
        }

        let tacticscontent = arr.map(item => {
          return{
            type:item.questionType,
            num:item.cqsl,
            score:item.fs
          }
        })

        let obj = {
          id:this.editId,
          subjectid:this.subjectid,
          tacticsname:this.tacticsName,
          tacticscontent:JSON.stringify(tacticscontent),
        }


        // console.log('obj = ',obj);

        this.$emit('transferEvt', { method: 'fSubmit', data: obj })

      },



      // 根据条件获取可抽题量
     async getStrategyNum(item = {}){
        let param = {
          subjectid: this.subjectid || '',
          type: item.questionType || '',
        };
        let res = await getQuestionNum(param);
        item.kqtl = res.data || 0
      },


    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .tactics-tree-container {
    background-color: #f4f5f9;
    /*max-height: 480px;*/
    .tactics-top-container{
      .tactics-name-container {
        .bh-container {
          margin-bottom:10px;
        }
      }
    }
    /*.my-tree-container{*/
    /*  width: pxToRem(400)!important;*/
    /*}*/

    .dialog-footer {
      width: 100%;
      height: 52px;
      display: block;
      text-align: right;
      padding: 11px 20px;
    }
  }
</style>
