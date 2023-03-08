<template>
  <div class="paper-tree-container" :class="{'preview-container':data.isPreview}">

    <div class="paper-img-container" v-if="!data.isPreview">
      <img src="@/assets/images/paper/paper1.png" alt="" v-show="step===1">
      <img src="@/assets/images/paper/paper2.png" alt="" v-show="step===2">
      <img src="@/assets/images/paper/paper3.png" alt="" v-show="step===3">
      <div class="paper-img-title">
        <span :class="{'active':step===1}">组卷策略</span>
        <span :class="{'active':step===2}">预览试卷</span>
        <span :class="{'active':step===3}">组卷完成</span>
      </div>
    </div>


    <myOne v-if="step===1" ref="one" :lessonData="data.subjectList"></myOne>

    <myTwo v-if="step===2" ref="two" @transferEvt="fBtnEvt" :paperData="paperData"></myTwo>

    <myThree v-if="step===3" ref="three"></myThree>



    <span slot="footer" class="dialog-footer" v-if="!data.isPreview">
       <span>
          <el-button size="mini" type="primary" @click="next()" v-show="step!==3">下一步</el-button>
          <el-button size="mini" @click="fBtnEvt('fPaperDone')" v-show="step===3">关闭</el-button>
       </span>

    </span>

    <span slot="footer" class="dialog-footer" v-if="data.isPreview">
        <span><el-button size="mini" @click="fBtnEvt('fFormCancel')">返回</el-button></span>
    </span>


  </div>
</template>

<script>
  import myOne from './one'
  import myTwo from './two'
  import myThree from './three'
  import elDragDialog from '@/directive/el-drag-dialog';
  export default {
    components: { myOne ,myTwo,myThree},
    directives: { elDragDialog },
    props: ['template'],
    name: '',
    data() {
      return {
        data:{},
        step: 1,
        paperData:{},
      }
    },
    mounted(){},
    created(){
      this.data = this.template;
    },
    methods:{

      //下一步
       next(){
        if(this.step === 1){
          let oneSubmitData = this.$refs.one.submit();
          if(oneSubmitData.paperName){
            this.$emit('transferEvt', { method: 'fSubmitPaper', data: oneSubmitData });
          }
        }
        if(this.step === 2){
          this.step ++;
        }
      },

      fBtnEvt(evt) {
        this.$emit('transferEvt', evt)
      },


      goStep2(data){
        this.step = 2;
        this.paperData = data
      },


    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .paper-tree-container {
    background-color: #f4f5f9;
    /*max-height: 450px;*/
    .paper-img-container{
      background-color: #fff;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      img{
        width: pxToRem(728);
      }
      .paper-img-title{
        margin-top: 10px;
        width: pxToRem(728);
        display: flex;
        span{
          flex: 1;
          text-align: right;
        }
        span:nth-of-type(1){
          text-align: left;
        }
        span:nth-of-type(2){
          text-align: center;
        }
        .active{
          color:$baseColor
        }
      }
    }
    .dialog-footer {
      width: 100%;
      height: 52px;
      display: block;
      text-align: center;
      padding: 11px 20px;
    }
  }
  .preview-container{
    padding: 20px 0;
  }
</style>
