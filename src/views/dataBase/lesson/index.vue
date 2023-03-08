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
  import {changeSubject,deleteSubject,modifySubject,addSubject,getSubject} from "@/api/user";
  import {importSubject} from "@/api/common";
  export default {
    name: '',
    data() {
      return {
        data:template,
        subjectcode:'',
        subjectname:'',
      }
    },
    components: { formGrid },

    mounted(){},
    created() {
      this.getData();

    },
    methods:{
      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt.method) {
          case 'fImportFile':
            this.importData(evt.data);
            break;
          case 'fSwitch':
            this.enableData(evt.data);
            break;
          case 'fAdd':
            this.submitData(evt.data);
            break;
          case 'fEditList':
            this.submitData(evt.data,true);
            break;
          case 'fDeleteList':
            this.deleteData(evt.data);
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.subjectname = evt.data.subjectname;
            this.subjectcode = evt.data.subjectcode;
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
        formData.append('importSubject', file);
        let res = await importSubject(formData);
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
        let res = await changeSubject({id:data.subjectid,enable:data.enable});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },


      //新增 修改
      async submitData(data,editFlag = false){
        let param ={
          subjectcode: data.subjectcode || '',
          subjectname: data.subjectname	 || '',
        };
        if(editFlag){
          param.id = data.subjectid
        }
        let res = editFlag ? await modifySubject(param): await addSubject(param);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
          this.$refs.formGrid.fFormCancel();
        }else{
          global.showMessage(res.msg);
        }
      },


      //删除
      async deleteData(data){
        let idList = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            idList += item.subjectid+','
          });
          idList = idList.slice(0,idList.length-1);
        }else{
          idList = data.subjectid
        }
        let res = await deleteSubject({ids:idList});
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
          this.$refs.formGrid.isLoading = true
        });
        let param = {
          current:data.current || 1,
          size:data.size || 10,
          subjectcode:data.subjectcode || this.subjectcode || '',
          subjectname:data.subjectname || this.subjectname || '',
        };
        let res = await getSubject(param);
        // console.log('查询考试科目 res  = ',res);
        this.data.Grid.grid1.data = res.data || {};
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
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
