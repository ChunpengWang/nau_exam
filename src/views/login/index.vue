<template>
  <div class="login-container">
    <div class="title-container">
      <img src="@/assets/images/index/logo.png">
      <span>{{'北亚利桑那大学在线考试系统'}}</span>
    </div>
    <div class="login-type-container">
      <el-radio-group v-model="radio">
        <el-radio :label="1" :style="{color:'#fff'}">管理端登录</el-radio>
        <el-radio :label="2" :style="{color:'#fff'}">教师端登录</el-radio>
        <el-radio :label="3"  :style="{color:'#fff'}">学生端登录</el-radio>
      </el-radio-group>
    </div>

    <div class="form-container">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
               label-position="left">
        <el-form-item prop="username">
          <el-input type="text" v-model="loginForm.username" autoComplete="on" placeholder="账号"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin"
                    v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item class="subbtn">
          <el-button style="width:100%;height:40px;border-radius: 20px;background-color: #fd9001;border-color: #fd9001;color:#fff;font-weight: 700" :loading="loading"
                     @click.native.prevent="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('账号不能为空'));
        } else {
          callback();
        }
      };
      const validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('密码不能为空'));
        } else {
          callback();
        }
      };
      return {
        radio:1,
        loginForm: {
          username: 'admin',
          password: '123456',
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePass }]
        },
        loading: false,
        pwdType: 'password'
      };
    },
    mounted(){
    },
    methods: {
      async handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            let obj = {
              ...this.loginForm,
              type:this.radio
            };
            this.$store.dispatch('user/login', obj).then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || '/' });
            }).catch(() => {
              this.loading = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  };
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/config.scss";
  .login-container{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .title-container{
      display: flex;
      flex-direction: row;
      align-items: center;
      img{
        width: pxToRem(98);
      }
      span{
        font-size: pxToRem(56);
        color: #fff;
        font-weight: 700;
        margin-left: pxToRem(40);
      }
    }
    .form-container{
      margin-top: pxToRem(100);
      .login-form{
        display: flex;
        width:  pxToRem(400);;
        flex-direction: column;
        .el-form-item {
          .el-form-item__content{
            .el-input{
              .el-input__inner{
                border-radius: 20px !important;
              }
            }
          }
        }
      }
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  @import "~@/styles/config.scss";
  .login-container{
    .login-type-container{
      margin-top: pxToRem(25);
      .el-radio-group{
        .el-radio.is-checked{
          .el-radio__input{
            .el-radio__inner{
              border-color: #fd9001;
              background: #fd9001;
            }
          }
          .el-radio__label{
            color: #fd9001;
          }
        }

        .el-radio{
          .el-radio__label{
           font-size: 16px;
          }
        }
      }
    }
  }
  </style>
