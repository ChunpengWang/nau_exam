<template>
  <div class="add-place-container">

    <div class="add-place-box">
      <div class="my-tinymce-container">

        <div class="title-desc">*成绩发布后及格状态不可修改 ！</div>

        <div class="content-container">
          <span class="list">
            <span class="item">
              <span class="desc">考生:</span>
              {{data.studentname || '-'}}
            </span>
              <span class="item">
              <span class="desc">阅卷得分:</span>
              {{data.laborscore && data.laborscore != -1 ?data.laborscore :  '-'}}
            </span>
             <span class="item">
              <span class="desc">及格状态:</span>
               {{data.ispass == 1 ? '及格' :(data.ispass == 2 ? '不及格':'未阅卷')}}
            </span>
          </span>
          <span class="list">
            <span class="item">
              <span class="desc">身份证号:</span>
             {{data.idcard || '-'}}
            </span>
          </span>
          <span class="list">
            <span class="item">
              <span class="desc">考试计划:</span>
             {{data.jhMc || '-'}}
            </span>
          </span>
          <span class="list">
            <span class="item">
              <span class="desc">考试科目:</span>
               {{data.subjectname || '-'}}
            </span>
          </span>
        </div>

      </div>
    </div>

    <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="fBtnEvt('fFormCancel')">取 消</el-button>
          <el-button size="mini" type="primary" @click="fBtnEvt({'method':'fSendSubmit','data':data})" >发布</el-button>
      </span>

  </div>
</template>

<script>
  export default {
    props: ['template'],
    name: '',
    data() {
      return {
        data: {}
      };
    },
    mounted(){},
    async created(){
      this.data = this.template
    },
    methods:{
      fBtnEvt(evt){
        this.$emit('transferEvt', evt)
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
      .my-tree-container{
        width: pxToRem(300);
        height: 100%;
        border: 1px solid #ccc;
        min-height: pxToRem(526);
        overflow-y: scroll;
        border-radius: 10px;
        padding: pxToRem(20);
      }
      .my-tinymce-container{
        display: flex;
        flex:1;
        flex-direction: column;
        padding-left: 20px;
        height: 100%;
        overflow-y: scroll;

        .title-desc{
          color:#f2637b;
          text-align: center;
          margin-bottom: 10px;
        }

        .content-container{
          display: flex;
          flex-direction: column;
          /*border-bottom: 1px dashed #ccc;*/
          .list{
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            .item{
              flex: 1;
              color: #999;
              .desc{
                color: #333;
                min-width: 110px;
              }
            }
            .item:nth-of-type(2){
              flex: 1.3;
              /*margin-left: 15px;*/
            }
          }
        }
        .instruction{
          border:1px solid #ccc;
          padding: 10px;
          .instruction-sub{
            text-decoration: underline;
            color: #f2637b;
            font-size: 24px;
            padding: 0 4px;
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
  .start{
    color: red;
    margin-right: 2px;
  }
</style>
