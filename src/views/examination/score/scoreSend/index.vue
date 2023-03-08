<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>

    <!--  弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container my-el-dialog-tree-container"
               :title='dialogCfg.title'
               :visible.sync="dialogCfg.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               width="60%">
      <dataDetail ref="dataDetail" @transferEvt="fBtnEvt" v-if="dialogCfg.dialogVisible" :detailData="detailData"></dataDetail>
    </el-dialog>

    <!--    表单表格-新增 弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container"
               :title='formCfg.title'
               :visible.sync="formCfg.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               width="40%">
      <validateForm ref="validateForm" v-if="formCfg.dialogVisible" :formCfg="formCfg.data"
                    @transferEvt="fBtnEvt"></validateForm>
    </el-dialog>

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

    <!--    表单表格-新增 弹框-->
    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container my-el-dialog-tree-container"
               :title='sendDialogCfg.title'
               :visible.sync="sendDialogCfg.dialogVisible"
               :before-close="fFormCancel"
               :modal-append-to-body="false"
               :close-on-click-modal="false"
               width="40%">
      <sendDialog ref="sendDialog" v-if="sendDialogCfg.dialogVisible" :template="sendDialogCfg.data"
                   @transferEvt="fBtnEvt"></sendDialog>
    </el-dialog>


  </div>
</template>

<script>

  import formGrid from '@/components/formGrid/index'
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import template from './template'
  import dataDetail from './detail'; // base on element-ui
  import global from '@/utils/global';
  import validateForm from '@/components/validateForm';
  import sendDialog from './sendDialog';
  import {
    getEndPlanList,
    getPaperContentById,
    getAnswerContentById
  } from '@/api/marking';
  import {
    adjustmentPassScoreById,
    getAchievementById,
    getPlanSubjectById, oneClickReleaseAchievementById, releaseAchievementById
  } from "@/api/examination";
  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        data:template,
        sendDialogCfg:{
          title:'单独考生成绩发布',
          dialogVisible:false,
          data:{}
        },
        planList:[],
        dialogCfg:{
          title:'查看详情',
          dialogVisible:false
        },
        studentcode:  '',
        studentname:'',
        isreleasestate: '',
        ispass: '',
        subjectcode: '',
        detailData:{},
        formCfg: {
          title: '一键发布', // 弹框标题
          dialogVisible: false, //控制弹框显示隐藏
          data: {}// 弹框表单数据
        },
        formCfg2: {
          title: '调整及格分', // 弹框标题
          dialogVisible: false, //控制弹框显示隐藏
          data: {}// 弹框表单数据
        },
        subjectList:[]
      }
    },
    components: { formGrid ,dataDetail,validateForm,sendDialog},
    mounted(){
    },
    created(){
      this.getPlanList();
    },
    methods:{



     async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fSendAll':
            this.formCfg.dialogVisible = true;
            this.formCfg.data = {
              submit: this.data.Submit.form2,
              form: this.data.Form.form2,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fSubmitSendAll',
              type:'scoreSend',
            };
            break;
          case 'fAdjust':
            this.formCfg2.dialogVisible = true;
            for(let k in this.data.Submit.form3){
              this.data.Submit.form3[k] = ''
            }
            this.formCfg2.data = {
              submit: this.data.Submit.form3,
              form: this.data.Form.form3,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fSubmitAdjust',
            };
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;
        }
        switch (evt.method) {
          case 'fSubmitAdjust':
            let subjectArr = this.data.Form.form3.find(item => item.name === 'subjectcode') || {};
            let subjectObj = (subjectArr.data || []).find(element => element.subjectcode === evt.data.subjectcode) || {};
              let adjustParam = {
                planid:evt.data.planid,
                subjectcode:evt.data.subjectcode,
                subjectid:subjectObj.subjectid || '',
                jgx:evt.data.tzjgf
              }
            let res1 = await adjustmentPassScoreById(adjustParam);
            if (res1.state == '200') {
              global.showMessage(res1.msg, 'success');

              this.getKcList(adjustParam.planid,'form3');
              if(adjustParam.subjectcode){
                await this.getRateData(adjustParam.planid,adjustParam.subjectcode,'old');
                this.getRateData(adjustParam.planid,adjustParam.subjectcode)
              }else{
                this.data.Submit.form3.totalscore = this.data.Submit.form3.passscore = 0;
              }

              this.getData();
              this.fFormCancel();
            } else {
              global.showMessage(res1.msg);
            }
            break;
          case 'fChangeScore':
            if(this.data.Submit.form3.planid && this.data.Submit.form3.subjectcode){
              this.getRateData(this.data.Submit.form3.planid,this.data.Submit.form3.subjectcode)
            }
            break;
          case 'fSubmitSendAll':
            let res = await oneClickReleaseAchievementById({planid: evt.data.planid, subjectcode: evt.data.subjectcode});
            if (res.state == '200') {
              global.showMessage(res.msg, 'success');
              this.getData();
              this.fFormCancel();
            } else {
              global.showMessage(res.msg);
            }
            break;
          case 'fChangeKsjh':
            if(evt.data && typeof evt.data != 'object'){
              await  this.getKcList(evt.data);
              this.getData({ planid: evt.data });
            }
            break;
          case 'fChangeKsjh2':
            this.getKcList(evt.data,'form2');
            break;
          case 'fChangeKsjh3':
            this.getKcList(evt.data,'form3');
            if(this.data.Submit.form3.subjectcode){
              await this.getRateData(evt.data,this.data.Submit.form3.subjectcode,'old');
              if(this.data.Submit.form3.tzjgf){
                this.getRateData(evt.data,this.data.Submit.form3.subjectcode)
              }
            }else{
              this.data.Submit.form3.totalscore = this.data.Submit.form3.passscore = 0;
            }
            break;
          case 'fChangeKskm3':
            let arr = [];
            this.data.Form.form3.forEach(item =>{
              if(item.name === 'subjectcode'){
                arr = item.data.filter(element => element.subjectcode === evt.data);
              }
            });
            if(arr.length){
              let obj = arr[0] || {};
              this.data.Submit.form3.totalscore = obj.totalscore || 0;
              this.data.Submit.form3.passscore =  obj.passscore || 0;
              this.getRateData(this.data.Submit.form3.planid,evt.data,'old')
            }
            if(this.data.Submit.form3.tzjgf){
              this.getRateData(this.data.Submit.form3.planid,evt.data)
            }
            break;
          case 'fDetail':
            this.openDetail(evt.data);
            break;
          case 'fSend':
            if(evt.data.isreleasestate == 2){
              return  global.showMessage('该考生的成绩已经发布过了');
            }
            let jhObj = this.planList.find(item => item.planid === this.data.Submit.form1.planid) || {}
            this.sendDialogCfg.dialogVisible = true
            this.sendDialogCfg.data = {
                  ...evt.data,
                  jhMc:jhObj.planname || ''
            }
            break;
          case 'fSendSubmit':
           this.updateFbStatus(evt.data)
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.studentcode = evt.data.studentcode;
            this.isreleasestate = evt.data.isreleasestate;
            this.ispass = evt.data.ispass;
            this.subjectcode = evt.data.subjectcode;
            this.studentname = evt.data.studentname;
            this.getData(evt.data);
            break;
        }
      },

      //获取及格线比例
      async getRateData(planid,subjectcode,type='new'){
        // let res = await getAchievementPassById({planid,subjectcode});
        // // console.log('findQualifiedRatio res = ',res);
        // let obj = res.data || {};
        // let pass = obj.pass || 0;
        // let zs = obj.zs || 0;
        // if(type === 'old'){
        //   this.data.Submit.form3.dtjgfbl = isNaN(pass / zs) ? 0 :  ((pass / zs)*100).toFixed(2) +'%';
        // }else{
        //   this.data.Submit.form3.tzjgfbl = isNaN(pass / zs) ? 0 :  ((pass / zs)*100).toFixed(2) +'%';
        // }
      },

      // 取消
      fFormCancel(){
        this.dialogCfg.dialogVisible = this.formCfg.dialogVisible = this.formCfg2.dialogVisible = this.sendDialogCfg.dialogVisible = false;
      },



      //查看试卷详情
      async openDetail(data){

        // 获取试卷 和参考答案
        let resPaper = await getPaperContentById({paperid:data.paperid});
        // console.log('resPaper.data =',resPaper.data)
        let resPaperData = resPaper.data || {}

        //总得分
        resPaperData['releassetotalscore'] = data.releassetotalscore == -1 ?'-':data.releassetotalscore

        // 获取答题卡 考生答案
        let resAnswer = await getAnswerContentById({answerid:data.answerid});
        // console.log('resAnswer.data =',resAnswer.data);

        if(!resAnswer.data.length){
          return global.showMessage('该考生答题卡没有分数，无法查看详情');
        }


        resPaperData.questionArr =  (resPaperData.questionArr || []).map((item,index) => {
          item.index = global.numberToChinese(index + 1);
          item.questionList = item.questionList.map((qitem,qindex)=>{
            let descStr = `<p><span>${qindex + 1}.</span> `;
            qitem.topic =  descStr + qitem.topic;


            //考生答案
            (resAnswer.data || []).forEach(ritem =>{
              if(ritem.questionid == qitem.questionid){
                if(qitem.type == 5 || qitem.type == 4){
                  let arr = [];
                  for(let k in ritem.answer){
                    arr.push(` ${k}. ${ritem.answer[k]} `)
                  }
                  qitem['ksxxnr'] = `<p>${arr.join(';')}</p>`;
                }else{
                  let str = ''
                  qitem.optionList = qitem.optionList.map((oitem,oindex) =>{
                    (ritem.answer || []).forEach(aaitem=>{
                      if(aaitem == oitem.oid){
                        if(qitem.type == 1){
                          str = String.fromCharCode(64 + parseInt(oindex + 1)) + ' ';
                          qitem['radioValue'] = oitem.oid;
                        }else if(qitem.type == 2){
                          str += String.fromCharCode(64 + parseInt(oindex + 1)) + ' ' + '；';
                          oitem.checkboxValue = true;
                        }else if(qitem.type == 3){
                          qitem['radioValue'] = oitem.oid;
                          str = oitem.value + ' ';
                        }
                      }
                    })
                    oitem.value = `<p>${String.fromCharCode(64 + parseInt(oindex + 1))}. ${oitem.value}</p>`;
                    return oitem
                  })
                  qitem['ksxxnr'] = `<p>${str}</p>`;
                }
                //  考生得分
                qitem.ksfs = ritem.answerScoreValue || 0
              }
            })



            //正确答案
            if(qitem.type == 5 || qitem.type == 4){
              if(qitem.way == 1){
                qitem['zqda'] = `<p>${qitem.optionList.map(oitem => oitem.value).join(';')}</p>`;
              }else{
                qitem['zqda'] = `<p>${qitem.referenceanswer || '答案解析'}</p>`;
              }
            }else if(qitem.type == 1 || qitem.type == 2){
              qitem['zqda'] = '';
              qitem.optionList.forEach((v1, i1) => {
                if(v1.isRight ==1){
                  qitem['zqda'] += String.fromCharCode(64 + parseInt(i1 + 1)) + ' ';
                }
              });
              qitem['zqda'] = `<p>${qitem['zqda']}</p>`;
            }else if(qitem.type == 3){
              qitem['zqda'] = qitem.optionList.filter(oitem => oitem.isRight ==1)[0]['value'];
              qitem['zqda'] = `<p>${qitem['zqda']}</p>`;
            }

            return qitem
          })
          return item
        })

        this.detailData = {
          ...resPaperData,
          ...data
        };
        this.dialogCfg.dialogVisible = true;
      },



      // 发布
      async updateFbStatus(data){
        let res = await releaseAchievementById({answerid:data.answerid});
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.sendDialogCfg.dialogVisible = false
          this.getData({ planid: this.data.Submit.form1.planid,current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size });
          this.$refs.formGrid.fFormCancel();
        }else{
          global.showMessage(res.msg);
        }

      },

      //获取计划列表
      async getPlanList(){
        let res = await  getEndPlanList({});
        this.planList = res.data || [];
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        let arr1 = (res.data || []).filter(item => item.planid === this.data.Submit.form2.planid);
        let arr2 = (res.data || []).filter(item => item.planid === this.data.Submit.form3.planid);
        if(!arr.length){
          this.data.Submit.form1.planid = this.data.Submit.form1.subjectcode =  '';
          this.data.Grid.grid1.data = {}
        }else{
          await this.getKcList(this.data.Submit.form1.planid);
          this.getData()
        }
        if(!arr1.length){
          this.data.Submit.form2.planid =  this.data.Submit.form2.subjectcode =  '';
        }else{
          this.getKcList(this.data.Submit.form2.planid,'form2');
        }
        if(!arr2.length){
          this.data.Submit.form3.planid = this.data.Submit.form3.tzjgf =
            this.data.Submit.form3.subjectcode = this.data.Submit.form3.totalscore = this.data.Submit.form3.passscore =
            this.data.Submit.form3.dtjgfbl = this.data.Submit.form3.tzjgfbl =  '';
        }else{
          this.getKcList(this.data.Submit.form3.planid,'form3');
        }

        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || []
          }
          return item;
        });
        this.data.Form.form2 =  this.data.Form.form2.map(item => {
          if(item.name==='planid'){
            item.data = res.data || []
          }
          return item;
        });
        this.data.Form.form3 =  this.data.Form.form3.map(item => {
          if(item.name==='planid'){
            item.data = res.data || []
          }
          return item;
        })
      },


      //获取课程列表
      async getKcList(planid,type='form1'){
        let res = await  getPlanSubjectById({planid});
        this.subjectList = res.data || []
        if(type === 'form2'){
          let arr = (res.data || []).filter(item => item.subjectcode === this.data.Submit.form2.subjectcode);
          if(!arr.length){
            this.data.Submit.form2.subjectcode  =  '';
          }
          this.data.Form.form2 =  this.data.Form.form2.map(item => {
            if(item.name==='subjectcode'){
              item.data = res.data || []
            }
            return item;
          })
        }else if(type === 'form3'){
          let arr = (res.data || []).filter(item => item.subjectcode === this.data.Submit.form3.subjectcode);
          if(!arr.length){
            this.data.Submit.form3.subjectcode  =  '';
          }
          this.data.Form.form3 =  this.data.Form.form3.map(item => {
            if(item.name==='subjectcode'){
              item.data = res.data || []
            }
            return item;
          })
        }
        else {
          let arr = (res.data || []).filter(item => item.subjectcode === this.data.Submit.form1.subjectcode);
          if(!arr.length){
            this.data.Submit.form1.subjectcode  =  '';
          }
          this.data.Form.form1 =  this.data.Form.form1.map(item => {
            if(item.name==='subjectcode'){
              item.data = res.data || []
            }
            return item;
          })
        }

      },

      //获取列表
      async getData(data={}){
        let planid = data.planid || this.data.Submit.form1.planid || '';
        if (!planid) {
          return;
        }
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true;
        });
        let param = {
          current: data.current || 1,
          planid,
          subjectcode: data.subjectcode || this.subjectcode ||  this.data.Submit.form1.subjectcode || '',
          studentcode: data.studentcode || this.studentcode || '',
          studentname: data.studentname || this.studentname || '',
          isreleasestate: data.isreleasestate || this.isreleasestate || '',
          ispass: data.ispass || this.ispass || '',
          size: data.size || 10
        };

        let res = await getAchievementById(param);
        // console.log('findByParamPage res = ',res);
        if (res.state != '200'){
          global.showMessage(res.msg)
        }
        this.data.Grid.grid1.data = res.data || {};
        this.data.Grid.grid1.data.records = ( this.data.Grid.grid1.data.records || []).map(item => {
            item.subjectname = (this.subjectList.find(ele => ele.subjectcode == item.subjectcode) || {}).subjectname
          return item;
        })
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
