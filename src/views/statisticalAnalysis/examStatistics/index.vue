<template>
  <div class="scoreStatistics-container">

    <my-loading :myloading='isLoading'></my-loading>

    <div class="toolbar-box">
      <my-toolbar ref="myToolbar" :submit="data.Submit.form1" :form="data.Form.form1" :btns="data.Btn.btn1"
                  @transferEvt="fBtnEvt"></my-toolbar>
    </div>

    <div class="content-box">
     <div class="item-container">
       <div class="title">{{kcName}}</div>
       <div class="content-container">
         <div class="content">
           <div class="echart-box">
             <div id="myChart" class="echart-container" :style="{width: '220px', height: '220px'}"></div>
           </div>
           <div class="desc-box">
             <div class="desc-item">
               <span class="bgc"></span>
               <span class="subtitle desc">实考</span>
               <span class="num desc">{{actualNum}}人</span>
               <span class="num rate">{{actualRate}}%</span>
             </div>
             <div class="desc-item">
               <span class="bgc bgc2"></span>
               <span class="subtitle desc">缺考</span>
               <span class="num desc">{{absenceNum}}人</span>
               <span class="num rate">{{absenceRate}}%</span>
             </div>
           </div>
         </div>
         <div class="content-desc">
           <div class="pass-rate-container">
             <span class="pass-rate-value">{{passRate}} <span class="per-cent">%</span> </span>
             <span class="pass-rate-desc">及格率</span>
           </div>
           <div class="score-container">
             <div class="score-item">
               <span class="score-score">试卷总分</span>
               <span class="score-value">{{totalScore}}</span>
             </div>
             <div class="score-item">
               <span class="score-score">及格分</span>
               <span class="score-value">{{passScore}}</span>
             </div>
             <div class="score-item">
               <span class="score-score highest">最高分</span>
               <span class="score-value">{{highestScore}}</span>
             </div>
             <div class="score-item">
               <span class="score-score lowest">最低分</span>
               <span class="score-value">{{lowestScore}}</span>
             </div>
             <div class="score-item">
               <span class="score-score average">平均分</span>
               <span class="score-value">{{averageScore}}</span>
             </div>
             <el-tooltip effect="dark" content="平均分与及格率不考虑缺考人数" placement="top-start">
               <span class="mark el-icon-question"></span>
             </el-tooltip>
           </div>
         </div>
       </div>
     </div>

<!--      <div id="myChart" :style="{width: '300px', height: '300px'}"></div>-->

    </div>
  </div>
</template>

<script>
  import myToolbar from '@/components/toolbar/index';
  import myLoading from '@/components/loading/index';
  import template from './template'
  import echarts from 'echarts'
  import global from '@/utils/global';
  import {getEndPlanList} from "@/api/marking";
  import {getPlanSubjectById, planStatisticsById} from "@/api/examination";
  export default {
    name: '',
    data() {
      return {
        isLoading:true,
        data:template,
        kcName:'', //课程名称
        actualNum:0, // 实际参考人数
        actualRate:0, // 实际参考人数占比
        absenceNum:0, // 缺席人数
        absenceRate:0, // 缺席人数占比
        totalNum:0,//总人数
        passRate:0,//及格率
        totalScore:0,//总分
        passScore:0,//及格分
        highestScore:0,//最高分
        lowestScore:0,//总最低分
        averageScore:0,//平均分
        kmList:[]  // 科目列表
      }
    },
    components: {myToolbar,myLoading },
    mounted(){
      this.getAnnulusOption()
    },
    created(){
      this.getPlanList()

    },
    methods:{
      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fSearch':
            if(this.data.Submit.form1.planid && this.data.Submit.form1.subjectcode){
              this.getData(this.data.Submit.form1)
            }else{
              global.showMessage('请选择参数进行查询')
            }
            break;
        }
        switch (evt.method) {
          case 'fChangeKsjh':
            if(evt.data){
              await this.getKcList(evt.data);
              if(this.data.Submit.form1.subjectcode){
                this.getData({ planid: evt.data });
                this.kcName = this.kmList.filter(item => item.subjectcode === this.data.Submit.form1.subjectcode)[0].subjectname;
              }
            }
            break;
          case 'fChangeKc':
            if(this.data.Submit.form1.planid && evt.data ){
              this.getData({subjectcode:evt.data})
            }
            this.kcName = this.kmList.filter(item => item.subjectcode === evt.data)[0].subjectname;
            break;
        }
      },

      //获取计划列表
      async getPlanList(){
        let res = await  getEndPlanList({});
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        if(!arr.length){
          this.data.Submit.form1.planid =  this.data.Submit.form1.subjectcode = this.data.Submit.form1.ssxxbh = '';
        }else{
          await this.getKcList(this.data.Submit.form1.planid);
        }
        if(this.data.Submit.form1.planid && this.data.Submit.form1.subjectcode){
          this.getData()
        }
        // console.log('planList res = ',res);
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || []
          }
          return item;
        })
      },



      //获取课程列表
      async getKcList(planid){
        let res = await  getPlanSubjectById({planid});
        this.kmList  = res.data || [];
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
      },




      //获取接口数据
      async getData(data={}){
        this.isLoading = true;
        let param = {
          planid: data.planid || this.data.Submit.form1.planid || '',
          subjectcode: data.subjectcode || this.data.Submit.form1.subjectcode || ''
        };
        let kmObj = this.kmList.find(item => item.subjectcode == param.subjectcode) || {}
        let res = await planStatisticsById(param);
        let resData = res.data || {};
        this.actualNum = resData.skrs || 0;
        this.absenceNum = (resData.zrs - resData.skrs)  || 0;
        this.totalNum = resData.zrs || 0;
        this.actualRate = isNaN(this.actualNum / this.totalNum) ? 0 : ((this.actualNum / this.totalNum) * 100).toFixed(2);
        this.absenceRate = isNaN(this.absenceNum / this.totalNum) ? 0 : ((this.absenceNum / this.totalNum) * 100).toFixed(2);
        this.passRate =  isNaN((resData.jgrs || 0) / this.totalNum) ? 0 : (((resData.jgrs || 0) / this.totalNum) * 100).toFixed(2);
        this.totalScore = kmObj.totalscore ||  0;
        this.passScore = kmObj.passscore || 0;
        this.highestScore = resData.zgf ? (resData.zgf === -1 ? 0 : resData.zgf) : 0;
        this.lowestScore = resData.zdf ? (resData.zdf === -1 ? 0 : resData.zdf) : 0;
        this.averageScore = resData.pjf ? ((resData.pjf === 'NaN' || resData.pjf < 0) ? 0 : resData.pjf) : 0;
        this.getAnnulusOption();
        this.isLoading = false;
      },

      //重置echarts
      getAnnulusOption (actualNum = this.actualNum,totalNum = this.totalNum){
        let value = parseFloat(((actualNum / totalNum) * 100).toFixed(2));
        let optionObj = {
          value: isNaN(value) ? 0 : value,  //100以内
          name:'',
          title:'',
          descValue:totalNum,
          backgroundColor:null,
          color:['#3aa1ff','#eceef6'],
          fontSize:16,
          domEle:document.getElementById("myChart")//必填
        };
        const option = {
          backgroundColor: optionObj.backgroundColor || '#fff',
          color: optionObj.color || ['#38a8da', '#d4effa'],
          title: {
            text: optionObj.title,
            top: '3%',
            left: '1%',
            textStyle: {
              color: '#333',
              fontStyle: 'normal',
              fontWeight: 'normal',
              fontFamily: 'sans-serif',
              fontSize: 16
            }
          },
          series: [{
            name: '来源',
            type: 'pie',
            radius: ['60%', '75%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                textStyle: {
                  fontSize: optionObj.fontSize || 12,
                  fontWeight: 'bold'
                },
                // formatter: '{b}\n{c}'
                formatter: `考生人数\n\n${optionObj.descValue}`
              }
            },
            data: [{
              value: optionObj.value,
              name: name,
              label: {
                normal: {
                  show: true
                }
              }
            }, { value: 100 - optionObj.value, name: '' }]
          }]
        };
        echarts.init(optionObj.domEle).setOption(option);
      }

    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .scoreStatistics-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .toolbar-box{
      margin: 0 pxToRem(20);
    }
    .content-box{
      padding: 20px pxToRem(20) 100px pxToRem(20);
      /*display: grid;*/
      flex: 1;
      /*grid-template-columns: 1fr 1fr 1fr;*/
      /*grid-column-gap: 20px;*/
      /*grid-row-gap: 20px;*/
      .item-container{
        width: 100%;
        height: 100%;
        border-radius: 8px;
        border:1px solid #ccc;
        /*padding: 0 pxToRem(20);*/
        /*height: 100%;*/
        /*height: 300px;*/
        display: flex;
        flex: 1;
        flex-direction: column;
        .title{
          line-height: 40px;
          padding-left: 20px;
          font-size: pxToRem(14);
          color: #666;
          border-bottom:1px solid #ccc;
        }
        .content-container{
          display: flex;
          flex: 1;
          flex-direction: row;
          padding: 40px 0 120px 0;
          .content{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .echart-box{
              /*flex: 2;*/
              .echart-container{
                float: right;
                /*display: flex;*/
                /*flex: 1;*/
                /*justify-content: center;*/
                /*align-items: center;*/
                > div{
                  /*float: right;*/
                }
              }
              /*justify-content: flex-end;*/
              /*justify-content: center;*/
              /*align-items: center;*/
              /*background-color: skyblue;*/
            }
            .desc-box{
              /*flex: 1;*/
              display: flex;
              flex-direction: column;
              .desc-item{
                margin-top: 30px;
                display: flex;
                flex: 1;
                flex-direction: row;
                align-items: center;
                font-size: pxToRem(26);
                .bgc{
                  display: inline-block;
                  width: 30px;
                  height: 20px;
                  border-radius: 5px;
                  background-color: #3aa1ff;
                  margin-right:20px;
                }
                .bgc2{
                  background-color: #eceef6;
                }
                .subtitle{
                  font-size: pxToRem(18);
                }
                .desc{
                  margin-right: 50px;
                  color: #666;
                }
                .num{
                  font-weight: 700;
                  color: #333;
                }
                .rate{

                }
              }
              .desc-item:nth-of-type(2){
                /*margin-top: 30px;*/
              }
            }
          }
          .content-desc{
            flex: 1;
            border-left: 1px solid #ccc;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .pass-rate-container{
              display: flex;
              flex-direction: column;
              color: #333;
              font-size: pxToRem(16);
              .pass-rate-value{
                font-size: pxToRem(50);
                color: #fd9001;
                .per-cent{
                  color: #333;
                  font-size: pxToRem(16);
                }
              }
            }
            .score-container{
              position: relative;
              margin-top: pxToRem(25);
              width: 300px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              border:1px solid #ccc;
              border-radius: 8px;
              padding: 0 25px;
              .score-item{
                display: flex;
                width: 100%;
                border-bottom: 1px solid #ccc;
                height: 50px;
                justify-content: space-between;
                align-items: center;
                color:#333;
                .highest{
                  color:#33c58f;
                }
                .lowest{
                  color:#f2637b;
                }
                .average{
                  color:#3aa1ff;
                }
              }
              .score-item:nth-of-type(5){
                border-bottom: none;
              }
              .mark{
                position: absolute;
                bottom: 0;
                line-height: 50px;
                width: 25px;
                cursor: pointer;
                color: $baseColor;
                font-size: 16px;
                text-align: center;
                right: 0;
              }
            }
          }
        }

      }
    }
  }
</style>
