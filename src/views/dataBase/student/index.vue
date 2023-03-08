<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>

    <!--   新增 弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container my-el-dialog-tree-container"
               :title='dialogCfg.title'
               :visible.sync="dialogCfg.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               width="60%">
      <addStudent1 ref="addStudent" @transferEvt="fBtnEvt" v-if="dialogCfg.dialogVisible"></addStudent1>
    </el-dialog>

  </div>
</template>

<script>
  import {
    restStudent,
    changeStudent,
    deleteStudent,
    modifyStudent,
    addStudent,
    getStudent,
  } from '@/api/user';
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import elDragDialog from '@/directive/el-drag-dialog';
  import addStudent1 from './addStudent';
  import global from '@/utils/global';
  import {importStudent, importStudentImg} from "@/api/common";
  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        data:template,
        dialogCfg:{
          title:'新增学生',
          dialogVisible:false
        },
        studentcode: '',
        studentname: '',
        idcard: '',
        mobile: '',
      }
    },
    components: { formGrid, addStudent1 },
    mounted(){
    },
    created(){
      this.getData();
    },
    methods:{


      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fAddCurrent':
            this.dialogCfg.dialogVisible = true;
            this.dialogCfg.title = '新增学生';
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;
        }
        switch (evt.method) {
          case 'fImportZip':
            this.importZipData(evt.data);
            break;
          case "fRestPwd":
            this.resetData(evt.data)
            break;
          case 'fEditList':
            this.dialogCfg.title = '修改学生';
            this.dialogCfg.dialogVisible = true;
            this.$nextTick(()=>{
              this.$refs.addStudent.editId = evt.data.studentid || '';
              this.$refs.addStudent.studentcode = evt.data.studentcode || '';
              this.$refs.addStudent.studentname = evt.data.studentname || '';
              this.$refs.addStudent.idcard = evt.data.idcard || '';
              this.$refs.addStudent.mobile = evt.data.mobile || '';
              this.$refs.addStudent.fileName =  evt.data.thumb || '';
              this.$refs.addStudent.imgUrl =  evt.data.thumb || '';
            });
            break;
          case 'fSubmitAddStudent':
            evt.data.editId ? this.submitData(evt.data,true) : this.submitData(evt.data);
            break;
          case 'fDeleteList':
            this.deleteData(evt.data);
            break;
          case 'fImportFile':
            this.importData(evt.data);
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSwitch':
            this.enableData(evt.data)
            break;
          case 'fSearch':
            this.studentcode = evt.data.studentcode || '';
            this.studentname = evt.data.studentname || '';
            this.idcard = evt.data.idcard || '';
            this.mobile = evt.data.mobile || '';
            this.getData(evt.data);
            break;
        }
      },

      //zip导入
      async importZipData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let file = data[0]['raw'];
        const formData = new FormData();
        formData.append('importStudentImg', file);
        let res = await importStudentImg(formData);
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:1,size:this.data.Grid.grid1.data.size});
          this.$nextTick(()=>{
            this.$refs.formGrid.$refs.myToolbar.fileList1 = [];
            this.$refs.formGrid.$refs.myToolbar.fileName1 = '未选择任何文件';
          });
        }else{
          global.showMessage(res.msg);
        }
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },



      fFormCancel(){
        this.dialogCfg.dialogVisible  =  false;
      },

      //启用 禁用
      async enableData(data){
        let res = await changeStudent({id:data.studentid,enable:data.enable});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },
      //重置
      async resetData(data){
        let res = await restStudent({id:data.studentid,idcard:data.idcard});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },

      //新增 修改
      async submitData(data,editFlag = false){
        // console.log('submitData data = ',data);
        let obj = data;
        if (editFlag) {
          obj.id = data.editId;
        }
        let res = editFlag ? await modifyStudent(obj) : await addStudent(obj);
        if (res.state == '200') {
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
          this.dialogCfg.dialogVisible = false;
        } else {
          global.showMessage(res.msg);
        }

      },

      //导入
      async importData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let file = data[0]['raw'];
        const formData = new FormData();
        formData.append('importStudent', file);
        let res = await importStudent(formData);
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


      //删除
      async deleteData(data){
        let ids = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            ids += item.studentid+','
          });
          ids = ids.slice(0,ids.length-1);
        }else{
          ids = data.studentid
        }
        let res = await deleteStudent({ids});
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
          current: data.current || 1,
          studentcode: data.studentcode || this.studentcode || '',
          studentname: data.studentname || this.studentname || '',
          idcard: data.idcard || this.idcard || '',
          mobile: data.mobile || this.mobile || '',
          size: data.size || 10
        };
        let res = await getStudent(param);
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
