<template>
  <div class="tactics-container">
    <my-loading :myloading='isLoading'></my-loading>
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>

    <!--   组卷策略-新增 弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container my-el-dialog-tree-container"
               :title='dialogCfg.title'
               :visible.sync="dialogCfg.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               width="60%">
      <addTactic v-if="dialogCfg.dialogVisible" ref="addTactic" @transferEvt="fBtnEvt"
                   :template="dialogCfg.data"></addTactic>
    </el-dialog>

  </div>
</template>

<script>
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import addTactic from './addTactic';
  import global from '@/utils/global';
  import myLoading from '@/components/loading/index';
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import {
    changeTactics,
    deleteTactics,
    getAllSubject,
    getTactics,
    addTactics,
    modifyTactics
  } from '@/api/question';
  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        isLoading:false,
        data:template,
        tacticsname:'',
        subjectid:'',
        subjectList:[],
        dialogCfg:{
          title: '', // 弹框标题
          dialogVisible: false, //控制弹框显示隐藏
          data: {} // 弹框表单数据
        }
      }
    },
    components: { formGrid,addTactic,myLoading },
    mounted(){
    },
    async created(){
      await this.getSubjectData()
      this.getData()
    },
    methods:{
      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fAddCurrent':
            this.dialogCfg.title = '新增策略';
            this.dialogCfg.dialogVisible = true;
            this.$nextTick(()=>{
              this.$refs.addTactic.subjectList = this.subjectList
            })
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;
        }
        switch (evt.method) {
          case 'fSubmit':
            this.submitData(evt.data)
            break;
          case 'fEditList':
            this.dialogCfg.dialogVisible = true;
            this.dialogCfg.title = '修改策略';
            this.$nextTick(()=>{
              this.$refs.addTactic.subjectList = this.subjectList
              this.$refs.addTactic.editId = evt.data.tacticsid || '';
              this.$refs.addTactic.subjectid = evt.data.relationid || '';
              this.$refs.addTactic.totalScore = evt.data.totalScore || '-';
              this.$refs.addTactic.tacticsName = evt.data.tacticsname || '';
              this.$refs.addTactic.questionList = (evt.data.tacticscontentarr || []).map((item,index) => {
                return {
                    id: `${index}`,
                    name: `第${index+1}大题（${item.num * item.score}分）`,
                    questionType: item.type,
                     cqsl: item.num,
                     fs: item.score,
                     total: item.num * item.score,
                     kqtl: '',
                }
              });
              this.$refs.addTactic.activeName = '0'
              this.$refs.addTactic.getStrategyNum(this.$refs.addTactic.questionList[this.$refs.addTactic.activeName])
            })
            break;
          case 'fSwitch':
            this.changeStatus(evt.data);
            break;
          case 'fDeleteList':
            this.delStrategy(evt.data);
            break;
          case 'fSearch':
            this.tacticsname = evt.data.tacticsname;
            this.subjectid = evt.data.subjectid;
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

      //启用/停用
      async changeStatus(data){
        let res = await changeTactics({id:data.tacticsid,enable:data.enable});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },

      //删除
      async delStrategy(data){
        let idList = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            idList += item.tacticsid+','
          });
          idList = idList.slice(0,idList.length-1);
        }else{
          idList = data.tacticsid
        }
        let res = await deleteTactics({ids:idList});
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }

      },

     async submitData(data){
       this.$nextTick(()=>{
         this.$refs.formGrid.isLoading = true;
       });
       let res =  data.id ? await modifyTactics(data) :await addTactics(data);
       if(res.state == '200'){
         global.showMessage(res.msg,'success');
         this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
         this.fFormCancel();
       }else{
         global.showMessage(res.msg);
       }
       this.$nextTick(()=>{
         this.$refs.formGrid.isLoading = false
       });
      },

      //获取列表
      async getData(data = {}) {
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true;
        });
          let param = {
            current:data.current || 1,
            tacticsname:data.tacticsname || this.tacticsname || '',
            subjectid:data.subjectid || this.subjectid || '',
            size:data.size || 10
          };
          let res = await getTactics(param);
          this.data.Grid.grid1.data = res.data || {};
          this.data.Grid.grid1.data.records = ((res.data || {}).records || []).map( item => {
            item.subjectname = (this.subjectList.find(ele => ele.subjectid === item.relationid) || {}).subjectname || '-'
            return item;
          });
          this.$nextTick(()=>{
            this.$refs.formGrid.isLoading = false
          });
      },


      //取消
      fFormCancel(){
        this.dialogCfg.dialogVisible = false;
      }



    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .tactics-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .table-container{
      height: 100%;
      display: flex;
      flex:1;
      position: relative;
    }
  }
</style>
