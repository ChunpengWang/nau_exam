<template>
  <div class="add-place-container">

    <div class="add-place-box">

      <div class="my-tinymce-container">


        <div class="question-item-container">
          <div class="question-item-box">
            <span class="my-label"><span class="start">*</span>姓名：</span>
            <el-input class="my-el-select-container" v-model="username" size="mini"
                      placeholder="请输入姓名" ></el-input>
          </div>
          <div class="question-item-box">
            <span class="my-label"><span class="start">*</span>账号：</span>
            <el-input class="my-el-select-container" v-model="account" size="mini"
                      placeholder="请输入登录账号"  ></el-input>
          </div>
        </div>

        <div class="question-item-container">
          <div class="question-item-box">
            <span class="my-label"><span class="start">*</span>身份证号：</span>
            <el-input class="my-el-select-container" v-model="idcard" size="mini"
                      placeholder="请输入身份证号码" ></el-input>
          </div>
          <div class="question-item-box">
            <span class="my-label">密码：</span>
            <el-input class="my-el-select-container" :disabled="!!editId" v-model="password" size="mini"
                      placeholder="不填默认身份证后6位"  ></el-input>
          </div>
        </div>

        <div class="question-item-container">
          <div class="question-item-box">
            <span class="my-label"><span class="start">*</span>联系电话：</span>
            <el-input class="my-el-select-container" v-model="mobile" size="mini"
                      placeholder="请输入联系电话" ></el-input>
          </div>
        </div>

        <div class="question-item-container">
          <div class="question-item-box">
            <span class="my-label">用户照片：</span>
            <el-upload
              class="upload-demo my-upload-demo"
              ref="upload"
              action=""
              :on-change="handleChange"
              :file-list="fileList"
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="mini">选取文件</el-button>
            </el-upload>
            <span class="file-name-container">{{fileName}}</span>
          </div>
        </div>
        <div class="question-item-container"  v-if="imgUrl" style="display:flex;justify-content: center;align-items: center;">
          <img :src="imgBaseUrl+imgUrl" alt="" style="width: 100px; height: 100px;">
        </div>


      </div>


    </div>

    <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="fBtnEvt('fFormCancel')">取 消</el-button>
          <el-button size="mini" type="primary" @click="fSubmit" >保存</el-button>
      </span>

  </div>
</template>

<script>
  import global from '@/utils/global';
  import {uploadApi} from '@/api/common';
  export default {
    name: '',
    data() {
      return {
        imgBaseUrl:global.fileBaseUrl,
        username:'',
        account:'',
        idcard:'',
        password:'',
        mobile:'',
        editId: '',
        fileList:[],
        fileName:'未选择任何文件',
        imgUrl:'',
      }
    },
    mounted(){},
    created(){

    },
    methods:{
      fBtnEvt(evt){
        this.$emit('transferEvt', evt)
      },
      fSubmit(){
        if(!this.username.trim()){
          return global.showMessage('请输入姓名');
        }
        if(!this.account.trim()){
          return global.showMessage('请输入登录账号');
        }
        if(!this.idcard.trim()){
          return global.showMessage('请输入身份证号码');
        }
        if(!this.mobile.trim()){
          return global.showMessage('请输入联系电话');
        }


        let param = {
          username:this.username.trim(),
          account:this.account.trim(),
          idcard:this.idcard.trim(),
          password:this.password.trim(),
          mobile:this.mobile.trim(),
        };

        if(this.editId){
          param.editId = this.editId;
        }

        if(this.imgUrl){
          param.thumb = this.imgUrl;
        }

        this.$emit('transferEvt', { method: 'fSubmit', data: param })
      },
      async handleChange(file) {
        this.fileName = file.name;
        this.fileList = [file]
        let formData = new FormData();
        formData.append('img', file['raw']);
        let res = await uploadApi(formData)
        this.imgUrl = res.data || ''
      },
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .add-place-container {
    background-color: #f4f5f9;
    .add-place-box{
      padding: 20px;
      background-color: #fff;
      display: flex;
      .my-tinymce-container{
        display: flex;
        flex:1;
        flex-direction: column;
        padding-left: 20px;
        height: 100%;
        overflow-y: scroll;
        .question-item-container{
          width: 100%;
          display: flex;
          flex-direction: row;
          margin-bottom: pxToRem(20);
          .question-item-box{
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-right: pxToRem(20);
            .my-label{
              color:#333;
              font-size: pxToRem(14);
              /*flex: 1;*/
              min-width:85px;
              display: inline-block;
              .start{
                color: red;
                margin-right: 2px;
              }
            }
            .one-content-style{
              flex: 1;
            }
          }
          .text-box{
            line-height: 45px;
          }
          .my-tinymce-box{
            display: flex;
            flex: 1;
            //align-self: center;
          }
          .my-textarea-box{
            display: flex;
            flex: 1;
            min-height: 60px;
            margin-bottom: 20px;
            padding-right: 10px;
          }
          .option-list-container{
            display: flex;
            flex: 1;
            flex-direction: column;
            .right-option-container{
              color:#333;
              font-size: pxToRem(14);
              margin-bottom: 3px;
            }
            .my-tinymce-box-select{
              display: flex;
              position: relative;
              flex-direction: row;
              align-items: center;
              margin-bottom: 20px;
              .yuan-img-container{
                cursor: pointer;
                min-width: 78px;
                text-align: center;
                //position: relative;
                //height: 100%;
                //flex: 1;
                //display: flex;
                //flex-direction: column;
                .key-container{
                  position: absolute;
                  top:0;
                  left: 0;
                  .start{
                    color: red;
                    margin-right: 2px;
                  }
                }
                img{
                  width: 16px;
                  height: 16px;
                }
              }

            }
          }
          .my-label-qa{
            color:#333;
            font-size: pxToRem(14);
            /*flex: 1;*/
            min-width: 85px;
            display: inline-block;
            .start{
              color: red;
              margin-right: 2px;
            }
          }
        }
        .my-textarea-box-container{
          margin-bottom: 0;
        }
        .add-option-box{
          display: flex;
          align-items: center;
        }
        .title-box{
          .question-item-box{
            align-items: normal;
          }
        }
      }
    }

    .dialog-footer {
      width: 100%;
      height: 52px;
      display: block;
      text-align: right;
      padding: 11px 20px;
    }
  }
  .file-name-container{
    margin-left: pxToRem(30);
    color:#666;
  }
</style>
