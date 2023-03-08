<template>
  <div class="question-container">

    <my-loading :myloading='isLoading'></my-loading>
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" >
      </formGrid>
    </div>



<!--       试题管理-新增 弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container my-el-dialog-tree-container"
               :title='dialogCfg.title'
               :visible.sync="dialogCfg.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               width="70%">
      <addQu v-if="dialogCfg.dialogVisible" ref="addQuestion" @transferEvt="fBtnEvt" :template="dialogCfg.data"></addQu>
    </el-dialog>







  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import formGrid from '@/components/formGrid/index'
  import myLoading from '@/components/loading/index';
  import template from './template'
  import addQu from './addqu';
  import global from '@/utils/global';
  import {
    addQuestionApi,
    changeQuestion,
    deleteQuestion,
    getAllSubject,
    getQuestion,
    modifyQuestion
  } from '@/api/question';
  import {importQuestion} from "@/api/common";
  export default {
    name: '',
    directives: { elDragDialog },
    data() {
      return {
        isLoading:false,
        data:template,
        dialogCfg:{
          title: '', // 弹框标题
          dialogVisible: false, //控制弹框显示隐藏
          data: {}, // 弹框表单数据
        },
        subjectList:[],
        type:'',
        subjectid:'',
        enable:'',

      }
    },
    components: { formGrid,myLoading,addQu },
    mounted(){

    },
    async created(){

      await this.getSubjectData()
      this.getData()

    },
    methods:{

      async getSubjectData(){
        let res = await getAllSubject()
        this.subjectList = res.data || []
        this.data.Form.form1 = this.data.Form.form1.map(item => {
          if(item.name == 'subjectid'){
            item.data = this.subjectList
          }
          return item
        })
      },


      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fAddCurrent':
            this.dialogCfg.dialogVisible = true;
            this.dialogCfg.title = '新增试题';
            this.$nextTick(()=>{
              this.$refs.addQuestion.subjectList = this.subjectList
            })
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;


        }

        switch (evt.method) {
          case "fSwitch":
            this.enableData(evt.data)
            break;
          case 'fDeleteList':
            this.deleteData(evt.data);
            break;
          case 'fImportFile':
            this.importData(evt.data);
            break;

          case 'fEditList':
            this.dialogCfg.dialogVisible = true;
            this.dialogCfg.title = '修改试题';
            this.$nextTick(()=>{
              this.$refs.addQuestion.subjectList = this.subjectList
              this.$refs.addQuestion.editId = evt.data.questionid || '';
              this.$refs.addQuestion.questionType = evt.data.type || '';
              this.$refs.addQuestion.topic = evt.data.topic || '';
              this.$refs.addQuestion.scoreWay = evt.data.way || '';
              this.$refs.addQuestion.subjectid = evt.data.relationid || '';
              this.$refs.addQuestion.answerDesc = evt.data.referenceanswer || '';
              this.$refs.addQuestion.optionList = JSON.parse(evt.data.optionlist).map(item => {
                let rid = global.getRandomId()
                if(item.isRight == '1' && (evt.data.type == '1' || evt.data.type == '3')){
                  this.$refs.addQuestion.radioValue = rid
                }
                if(item.isRight == '1' && evt.data.type == '2'){
                  this.$refs.addQuestion.checkboxValue.push(rid)
                }
                return {
                  value: item.value,
                  id:rid
                }
              });
              if(evt.data.way == '2' ){
                this.$refs.addQuestion.optionList = []
              }
              this.$refs.addQuestion.optionNum = JSON.parse(evt.data.optionlist).length
              const arr = [{name:'自动判分',id:'1'},{name:'不自动判分',id:'2'}]
              this.$refs.addQuestion.scoreWayList = evt.data.type == '4'? arr:(
                  evt.data.type == '5'? arr.filter(item =>item.id === '2'):arr.filter(item =>item.id === '1')
              );
            })
            break;
          case 'fSubmit':
             this.submitData(evt.data)
            break;
          case 'fSearch':
            this.type = evt.data.type;
            this.subjectid = evt.data.subjectid;
            this.enable = evt.data.enable;
            this.getData(evt.data);
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
        }
      },


      //导入
      async importData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let file = data[0]['raw'];
        const formData = new FormData();
        formData.append('importQuestion', file);
        let res = await importQuestion(formData);
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
          this.$nextTick(()=>{
            this.$refs.formGrid.$refs.myToolbar.fileList = [];
            this.$refs.formGrid.$refs.myToolbar.fileName = '未选择任何文件';
          });
        }else{
          global.showMessage(res.msg);
        }
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },





      //启用 禁用
      async enableData(data){

        let res = await changeQuestion({id:data.questionid,enable:data.enable});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },

      //删除
      async deleteData(data){
        // console.log(Array.isArray(data))
        let idList = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            idList += item.questionid+','
          });
          idList = idList.slice(0,idList.length-1);
        }else{
          idList = data.questionid
        }
        let res = await deleteQuestion({ids:idList});
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },


      //获取试题列表数据
      async getData(data = {}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true;
        });
        let param = {
          current:data.current || 1,
          type:data.type ||  this.type || '',
          subjectid:data.subjectid ||  this.subjectid || '',
          enable:data.enable ||  this.enable || '',
          size:data.size || 10,
        };
        let res = await getQuestion(param);
        this.data.Grid.grid1.data = res.data || {};
        this.data.Grid.grid1.data.records = this.data.Grid.grid1.data.records.map(item=>{
           item.subjectname = (this.subjectList.find(ele => ele.subjectid === item.relationid) || {}).subjectname || '-'
          return item;
        });
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },


      //新增 修改
      async submitData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true;
        });
        let res = data.id ? await modifyQuestion({json:JSON.stringify(data)}) : await addQuestionApi({json:JSON.stringify(data)});
        if(res.state == '200'){
          this.fFormCancel()
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false;
        });
      },


      fFormCancel(){
        this.dialogCfg.dialogVisible = false;
      },


    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .question-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .table-container{
      height: 100%;
      width: 100%;
      max-width: 100%;
      display: flex;
      flex:1;
      position: relative;
    }
  }
</style>
