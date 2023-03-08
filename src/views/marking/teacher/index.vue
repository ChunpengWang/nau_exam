<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>

  </div>
</template>

<script>
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import global from '@/utils/global';
  import {getEndPlanList,getMarkTeacher,clearMarkTeacher} from '@/api/marking';
  import { importMarkTeacher} from '@/api/common';
  import {getAllSubject} from '@/api/question';
  export default {
    name: '',
    data() {
      return {
        data:template,
        planid:'',
        teachername:'',
        subjectList:[]
      }
    },
    components: { formGrid },
    mounted(){},
    async created(){
      await this.getFindBookKc()
      this.getPlanList()
    },
    methods:{
      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fClearAllData':
            this.$confirm('此操作将永久清空该考试计划下所有教师数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then( async () => {
              if(this.data.Submit.form1.planid && this.data.Grid.grid1.data.records && !this.data.Grid.grid1.data.records.length){
                return global.showMessage('请先导入数据后再执行该操作');
              }
              let res = await clearMarkTeacher({ planid: this.data.Submit.form1.planid });
              if(res.state == '200'){
                global.showMessage( res.msg,'success');
                this.getData({size:this.data.Grid.grid1.data.size,current:1});
              }else{
                global.showMessage( res.msg);
              }
            });
            break;
        }
        switch (evt.method) {
          case 'fChangeKsjh':
            evt.data ? this.getData({current:1,size:this.data.Grid.grid1.data.size,planid:evt.data}) : null;
            break;
          case 'fImportFile':
            if(!this.data.Submit.form1.planid){
              return global.showMessage('请选择考试计划后再进行操作')
            }
            this.importData(evt.data);
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.planid = evt.data.planid;
            this.teachername = evt.data.teachername;
            this.getData(evt.data);
            break;
        }
      },

      // 获取科目
      async getFindBookKc(){

        let res = await getAllSubject()
        this.subjectList = res.data || []
      },
      //导入
      async importData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let file = data[0]['raw'];

        const formData = new FormData();
        formData.append('planid', this.data.Submit.form1.planid);
        formData.append('importMarkTeacher', file);
        let res = await  importMarkTeacher(formData);
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
          current:data.current || 1,
          planid:data.planid || this.planid || this.data.Submit.form1.planid || '',
          teachername:data.teachername || this.teachername || '',
          size: data.size || 10
        };
        let res = await getMarkTeacher(param);
        this.data.Grid.grid1.data = res.data || {};
        this.data.Grid.grid1.data.records = (res.data.records || []).map(item => {
          item.subjectname = (this.subjectList.find(ele => item.subjectcode == ele.subjectcode) || {}).subjectname
          return item;
        });
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },


      //获取计划列表
      async getPlanList(){
        let res = await getEndPlanList({});
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        if(!arr.length){
          this.data.Submit.form1.planid = '';
        }else{
          this.getData();
        }
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || [];
          }
          return item;
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
