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
               :close-on-click-modal="false"
               width="60%">

      <addUserC ref="addUser" @transferEvt="fBtnEvt" v-if="dialogCfg.dialogVisible"></addUserC>
    </el-dialog>

  </div>
</template>

<script>
import {getUser, addUser, modifyUser, deleteUser, changeUser, restUser} from '@/api/user';
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import addUserC from './addUser'; // base on element-ui
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import global from '@/utils/global';
  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        data:template,
        username:  '',
        account:  '',
        mobile:  '',
        idcard:  '',
        dialogCfg:{
          title:'新增用户',
          dialogVisible:false
        },
      }
    },
    components: { formGrid,addUserC},
    mounted(){},
    created(){
      this.getData()
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
            this.dialogCfg.title = '修改用户';
            this.dialogCfg.dialogVisible = true;
            this.$nextTick(()=>{
              this.$refs.addUser.editId = evt.data.userid || '';
              this.$refs.addUser.username = evt.data.username || '';
              this.$refs.addUser.account = evt.data.account || '';
              this.$refs.addUser.idcard = evt.data.idcard || '';
              // this.$refs.addUser.password = evt.data.password || '';
              this.$refs.addUser.mobile = evt.data.mobile || '';
              this.$refs.addUser.fileName = evt.data.thumb || '';
              this.$refs.addUser.imgUrl = evt.data.thumb || '';
            });
            break;
          case 'fDeleteList':
            this.deleteData(evt.data);
            break;
          case 'fSubmit':
            evt.data.editId ? this.submitData(evt.data,true) : this.submitData(evt.data);
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.username = evt.data.username;
            this.account = evt.data.account;
            this.mobile = evt.data.mobile;
            this.idcard = evt.data.idcard;
            this.getData(evt.data);
            break;
        }
      },



      fFormCancel(){
        this.dialogCfg.dialogVisible = false;
      },


      //获取列表数据
      async getData(data={}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let param = {
          current: data.current || 1,
          username: data.username || this.username || '',
          account: data.account || this.account || '',
          mobile: data.mobile || this.mobile || '',
          size: data.size || 10
        };
        let res = await getUser(param);
        this.data.Grid.grid1.data = res.data || {};
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },

      //启用 禁用
      async enableData(data){

        let res = await changeUser({id:data.userid,enable:data.enable});
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }

      },

      //重置
      async resetData(data){
        let res = await restUser({id:data.userid,idcard:data.idcard});
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
        let userIdList = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            userIdList += item.userid+','
          });
          userIdList = userIdList.slice(0,userIdList.length-1);
        }else{
          userIdList = data.userid
        }
        let res = await deleteUser({userIdList});
        // console.log('delProblemType res = ',res);
        if(res.state == '200'){
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
        }else{
          global.showMessage(res.msg);
        }

      },

      //新增 修改
      async submitData(data,editFlag = false){
        let param = {
          username:data.username || '',
          account:data.account || '',
          idcard:data.idcard || '',
          password:data.password || '',
          mobile:data.mobile || '',
          thumb:data.thumb || ''
        };

        if (editFlag) {
          param.id = data.editId
        }
        let res = editFlag ? await modifyUser(param) : await addUser(param);
        // console.log('submitData  res = ', res);
        if (res.state == '200') {
          global.showMessage(res.msg, 'success');
          this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size});
          this.dialogCfg.dialogVisible = false;
        } else {
          global.showMessage(res.msg);
        }

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
