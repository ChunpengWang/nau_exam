<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>
  </div>
</template>

<script>

  import { importPlanStudent} from '@/api/common';
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import global from '@/utils/global';
  import {getPlanStudent,clearPlanStudent,getAllPlan} from '@/api/examination';
  import {getAllSubject} from '@/api/question';

  export default {
    name: '',
    data() {
      return {
        data:template,
        subjectcode:'',
        studentcode:'',
        studentname:'',
        subjectList:[]
      }
    },
    components: { formGrid },
    mounted(){

      //

    },
    async created(){
      await  this.getFindBookKc();
      this.getPlanList();
    },
    methods:{


     async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fClearAllData':
            this.$confirm('此操作将永久删除该考试计划下所有的考生数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then( async () => {
              if(this.data.Submit.form1.planid && this.data.Grid.grid1.data.records && !this.data.Grid.grid1.data.records.length){
               return global.showMessage('请先导入数据后再执行该操作');
              }
              let res = await clearPlanStudent({ planid: this.data.Submit.form1.planid });
              if(res.state == '200'){
                global.showMessage( res.msg,'success');
                this.getData({size:this.data.Grid.grid1.data.size});
              }else{
                global.showMessage( res.msg);
              }
            });
            break;
        }
        switch (evt.method) {
          case 'fImportFile':
            if(!this.data.Submit.form1.planid){
              this.$refs.formGrid.isLoading = false;
              return global.showMessage('请选择考试计划再进行操作')
            }
            this.importData(evt.data);
            break;
          case 'fChangeKsjh':
            this.getData({ planid: evt.data ,current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.subjectcode = evt.data.subjectcode;
            this.studentcode = evt.data.studentcode;
            this.studentname =  evt.data.studentname;
            this.getData(evt.data);
            break;
        }
      },


      //获取计划列表
      async getPlanList(){
        let res = await getAllPlan({state:'0'});
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        if(!arr.length){
          this.data.Submit.form1.planid = '';
          this.data.Grid.grid1.data = {};
        }else{
          await this.getFindBookKc()
          this.getData();
        }
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || [];
          }
          return item;
        })
      },

      //导入
      async importData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let file = data[0]['raw'];

        const formData = new FormData();
        formData.append('planid', this.data.Submit.form1.planid);
        formData.append('importPlanStudent', file);
        let res = await  importPlanStudent(formData);
        // console.log('importStudent res = ',res);
        if(res.state == '200'){
          global.showMessage( res.msg,'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
          this.$nextTick(()=>{
            this.$refs.formGrid.$refs.myToolbar.fileList = [];
            this.$refs.formGrid.$refs.myToolbar.fileName = '未选择任何文件';
          });
        }else{
          global.showMessage( res.msg);
        }
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },

      //获取列表数据
      async getData(data={}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let param = {
          current: data.current || 1,
          planid: this.data.Submit.form1.planid,
          subjectcode: data.subjectcode || this.subjectcode ||  '',
          studentcode: data.studentcode || this.studentcode || '',
          studentname: data.studentname || this.studentname || '',
          size: data.size || 10
        };
        let res = await getPlanStudent(param);
        this.data.Grid.grid1.data = res.data || {};
        this.data.Grid.grid1.data.records = (res.data.records || []).map(item => {
          item.subjectname = (this.subjectList.find(ele => item.subjectcode == ele.subjectcode) || {}).subjectname
          return item;
        });
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },

      // 获取科目
      async getFindBookKc(){

        let res = await getAllSubject()
        this.subjectList = res.data || []
        this.data.Form.form1 = this.data.Form.form1.map(item => {
          if(item.name == 'subjectcode'){
            item.data = this.subjectList
          }
          return item
        })
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
