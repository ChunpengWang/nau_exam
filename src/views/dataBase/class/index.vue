<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>

    <!--    弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container my-el-dialog-tree-container"
               :title='dialogCfg.title'
               :visible.sync="dialogCfg.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               width="60%">
      <addClass ref="addClass" @transferEvt="fBtnEvt" v-if="dialogCfg.dialogVisible" :template="dialogCfg.data"></addClass>
    </el-dialog>

  </div>
</template>

<script>
  import {restTeacher,changeTeacher,deleteTeacher,modifyTeacher,addTeacher,getTeacher} from '@/api/user';
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import addClass from './addClass'; // base on element-ui
  import global from '@/utils/global';
  import {importTeacher} from "@/api/common";
  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        data:template,
        dialogCfg:{
          title:'新增教师',
          dialogVisible:false,
          data:{}
        },
        teachername: '',
        mobile: '',
        idcard: '',
      }
    },
    components: { formGrid,addClass },
    mounted(){},
    created(){
      this.getData();
    },
    methods:{
      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fAddCurrent':
            this.dialogCfg.dialogVisible = true;
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;
        }
        switch (evt.method) {
          case "fRestPwd":
            this.resetData(evt.data)
            break;
          case "fSwitch":
            this.enableData(evt.data)
            break;
          case 'fEditList':
            // console.log(evt.data);
            this.dialogCfg.title = '修改教师';
            this.dialogCfg.dialogVisible = true;
            this.$nextTick(()=>{
              this.$refs.addClass.editId = evt.data.teacherid;
              this.$refs.addClass.teachername = evt.data.teachername;
              this.$refs.addClass.mobile = evt.data.mobile;
              this.$refs.addClass.idcard = evt.data.idcard ;
              this.$refs.addClass.fileName = evt.data.thumb || '';
              this.$refs.addClass.imgUrl = evt.data.thumb || '';
            });
            break;
          case 'fSubmitAddClass':
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
          case 'fSearch':
            this.teachername = evt.data.teachername;
            this.mobile = evt.data.mobile;
            this.idcard = evt.data.idcard;
            this.getData(evt.data);
            break;
        }
      },


      // 取消
      fFormCancel(){
        this.dialogCfg.dialogVisible = false;
      },


      //导入
      async importData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let file = data[0]['raw'];
        const formData = new FormData();
        formData.append('importTeacher', file);
        let res = await importTeacher(formData);
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

      //新增 修改
      async submitData(data,editFlag = false){
        let obj = data;
        if (editFlag) {
          obj.id = data.editId;
        }
        let res = editFlag ? await modifyTeacher(obj) : await addTeacher(obj);
        console.log('submitData  res = ', res);
        if (res.state == '200') {
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
          this.dialogCfg.dialogVisible = false;
        } else {
          global.showMessage(res.msg);
        }

      },

      //启用 禁用
      async enableData(data){
        let res = await changeTeacher({id:data.teacherid,enable:data.enable});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }
      },

      //重置
      async resetData(data){
        let res = await restTeacher({id:data.teacherid,idcard:data.idcard});
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
        let ids = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            ids += item.teacherid+','
          });
          ids = ids.slice(0,ids.length-1);
        }else{
          ids = data.teacherid
        }
        let res = await deleteTeacher({ids});
        // console.log('delProblemType res = ',res);
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
          teachername: data.teachername || this.teachername || '',
          mobile: data.mobile || this.mobile || '',
          idcard: data.idcard || this.idcard || '',
          size: data.size || 10
        };
        let res = await getTeacher(param);
        console.log('findExamRoomByParamPage res = ',res);
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
