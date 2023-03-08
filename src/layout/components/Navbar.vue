<template>
  <div class="navBar-container">

    <div class="left-container">
      <div class="img-container">
        <img src="@/assets/images/index/logo.png" alt="">
      </div>
      <div class="title-container">{{ '北亚利桑那大学在线考试系统' }}</div>
    </div>

    <div class="right-container">
      <el-dropdown class="dropdown-container" trigger="click" style="cursor: pointer;">
        <span class="el-dropdown-link">
        {{ user ? user.name : '' }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided @click.native="formCfg2.dialogVisible=true">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>


    <!--    表单表格-新增 弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container"
               :title='formCfg2.title'
               :visible.sync="formCfg2.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               width="40%">
      <validateForm ref="validateForm" v-if="formCfg2.dialogVisible" :formCfg="formCfg2.data"
                    @transferEvt="fBtnEvt"></validateForm>
    </el-dialog>


  </div>
</template>

<script>
import global from '@/utils/global';
import validateForm from '@/components/validateForm';
import {mapGetters} from "vuex";
import {modifyPwd} from '@/api/user';
import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
const Form = {
  form1: [
    {
      'name': 'pwd',
      'text': '老密码',
      'type': 'password',
      'width': '300px',
      'required': true,
      'validate': 'none',
    },
    {
      'name': 'newpwd',
      'text': '新密码',
      'type': 'password',
      'width': '300px',
      'required': true,
      'validate': 'none',
    },
    {
      'name': 'confirmnewpwd',
      'text': '确认新密码',
      'type': 'password',
      'width': '300px',
      'required': true,
      'validate': 'none',
    },
  ]
}
  const Submit = {
    form1: {},
  };
  const o = global.genSubmit(Form, Submit, {});

export default {
  directives: { elDragDialog },
  data() {
    return {
      formCfg2: {
        title: '修改密码', // 弹框标题
        dialogVisible: false, //控制弹框显示隐藏
        data: {
          submit: Submit.form1,
          form: Form.form1,
          rules: o.Rules,
          url: {},
          method: 'fSubmitModifyPwd',
        }// 弹框表单数据
      },
    }
  },
  computed: {
    ...mapGetters(["user",])
  },
  components: {validateForm},
  methods: {
    async fBtnEvt(evt) {
      if(evt ==='fFormCancel'){
        this.fFormCancel()
      }
      switch (evt.method) {
        case 'fSubmitModifyPwd':
          // console.log('evt = ', evt)
          if(evt.data.newpwd.trim() != evt.data.confirmnewpwd.trim()){
            return global.showMessage('两次密码不一致');
          }
            let res = await modifyPwd({
              ...evt.data,
              type:this.user.type,
              id:this.user.id
            })
            if(res.state == 200){
              global.showMessage(res.msg,'success');
              this.formCfg2.dialogVisible = false
              this.formCfg2.data.submit = {newpwd:'',confirmnewpwd:'',pwd:''}
            }
          break;
      }
    },
    // 取消
    fFormCancel() {
      // console.log('取消')
      this.formCfg2.dialogVisible = false;
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      location.reload();
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";

.navBar-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .left-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-left: pxToRem(60);
    padding-top: pxToRem(50);

    .img-container {
      img {
        width: pxToRem(56);
      }
    }

    .title-container {
      margin-left: pxToRem(23);
      font-size: pxToRem(38);
      color: #fff;
    }

  }

  .right-container {
    border: 1px solid #fff;
    border-radius: pxToRem(8);
    margin: pxToRem(40) pxToRem(40) 0 0;
    height: pxToRem(40);

    .dropdown-container {
      color: #fff;
      font-size: pxToRem(14);
      display: flex;
      justify-content: center;
      align-items: center;
      /*padding: pxToRem(8) pxToRem(14);*/
      height: 100%;

      .el-dropdown-link {
        padding: pxToRem(8) pxToRem(14)
      }

      .user-dropdown {
        width: 100%;
      }
    }

    .my-arrow {
      margin-left: pxToRem(14);
    }
  }
}


/*<= 1366的设备屏幕*/
@media screen and(max-width: 1366px) {
  .navBar-container {
    .left-container {
      padding-top: pxToRem(40);

      .img-container {
        img {
          width: pxToRem(46);
        }
      }

      .title-container {
        font-size: pxToRem(36);
      }
    }

    .right-container {
      margin-top: pxToRem(30);
    }
  }
}


</style>
