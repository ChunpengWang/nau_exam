<template>
  <div class="container">
    <my-loading :myloading='isLoading'></my-loading>

    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>


  <!--   试卷管理-一键组卷 弹框-->
  <el-dialog v-el-drag-dialog
             class="my-el-dialog-form-container my-el-dialog-tree-container"
             :title='dialogCfg.title'
             :visible.sync="dialogCfg.dialogVisible"
             :before-close="fFormCancel"
             :modal-append-to-body="false"
             width="60%">
    <addPaper @transferEvt="fBtnEvt" ref="addPaper" v-if="dialogCfg.dialogVisible"
               :template="dialogCfg.data"></addPaper>
  </el-dialog>

  </div>
</template>

<script>
  import formGrid from '@/components/formGrid/index'
  import myLoading from '@/components/loading/index';
  import template from './template'
  import global from '@/utils/global';
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import addPaper from './addPaper/index';
  import {
    changePaperApi,
    getAllSubject,
    deletePaperApi,
    getPaperApi,
    addPaperApi,
  } from '@/api/question';
  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        isLoading:false,
        data:template,
        subjectid:'',
        papername:'',
        subjectList:[],
        dialogCfg:{
          title: '', // 弹框标题
          dialogVisible: false, //控制弹框显示隐藏
          data: {} // 弹框表单数据
        },
      }
    },
    components: { formGrid,addPaper,myLoading},
    mounted(){},
    async created(){
     await this.getSubjectData()
      this.getData();
    },
    methods:{
      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        if (evt.title && evt.title === 'loading') {
          this.isLoading = evt.data;
          return;
        }
        switch (evt) {
          case 'fPaperDone':
            this.getData({size:this.data.Grid.grid1.data.size});
            this.fFormCancel();
            break;
          case 'fAddCurrent':
            this.dialogCfg.title = '一键组卷';
            this.dialogCfg.dialogVisible = true;
            this.dialogCfg.data = {subjectList:this.subjectList};
            this.$nextTick(() => {
              this.$refs.addPaper.step = 1;
            });
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;
        }
        switch (evt.method) {
          case 'fOpenDetail':
           this.dialogCfg = {
             title: '预览试卷',
             dialogVisible: true,
             data: {isPreview:true}
           };
            this.$nextTick(async () => {
              this.$refs.addPaper.step = 2;
              this.$refs.formGrid.isLoading = true;
              await this.$refs.addPaper.goStep2(evt.data);
              this.$refs.formGrid.isLoading = false;
            });
            break;
          case 'fSwitch':
            this.changeStatus(evt.data);
            break;
          case 'fSubmitPaper':
            this.submitData(evt.data);
            break;
          case 'fDeleteList':
            this.delExamPaper(evt.data);
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.papername = evt.data.papername;
            this.subjectid = evt.data.subjectid;
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
        let res = await changePaperApi({id:data.paperid,enable:data.enable});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },





      //获取列表数据
      async getData(data={}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true;
        });
        let param = {
          current:data.current || 1,
          papername:data.papername || this.papername || '',
          subjectid:data.subjectid || this.subjectid || '',
          size:data.size || 10
        };
        let res = await getPaperApi(param);
        this.data.Grid.grid1.data = res.data || {};
        this.data.Grid.grid1.data.records = ((res.data || {}).records || []).map( item => {
          item.subjectname = (this.subjectList.find(ele => ele.subjectid === item.subjectid) || {}).subjectname || '-'
          return item;
        });
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },

      //新增
      async submitData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let res = await addPaperApi(data);
        if(res.state == '200'){
          await this.$refs.addPaper.goStep2(res.data);
        }else{
          global.showMessage(res.msg);
        }
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },



      //删除
      async delExamPaper(data){
        let sjzIdList = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            sjzIdList += item.paperid+','
          });
          sjzIdList = sjzIdList.slice(0,sjzIdList.length-1);
        }else{
          sjzIdList = data.paperid
        }
        // console.log('idList = ',idList)
        let res = await deletePaperApi({ids:sjzIdList});
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }

      },

      // 关闭弹框
      fFormCancel() {
        this.dialogCfg.dialogVisible   = false;
      },


    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .container {
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
