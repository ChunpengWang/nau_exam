<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>
  </div>
</template>

<script>
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import moment from 'moment';// 导入文件
  import global from '@/utils/global';
  import {getPlanSubject,getPlanScene,addPlanScene,modifyPlanScene,getAllPlan,deletePlanScene} from '@/api/examination';

  export default {
    name: '',
    data() {
      return {
        data:template,
        planList:[]
      }
    },
    components: { formGrid },
    mounted(){},
    created(){
      this.getPlanList();
    },
    methods:{


      fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt.method) {
          case 'fAdd':
            if(!this.data.Submit.form1.planid){
              return global.showMessage('请选择考试计划再进行操作')
            }
            this.submitData(evt.data);
            break;
          case 'fEditList':
            if (!this.data.Submit.form1.planid) {
              return global.showMessage('请选择考试计划再进行操作');
            }
          this.submitData({...evt.data,...evt},true);
            break;
          case 'fChangeKsjh':
            if(evt.data && typeof evt.data != 'object'){
              this.getFindBookKc()
              this.getData({ planid: evt.data});
            }

            break;
          case 'fDeleteList':
            this.deleteData(evt.data);
            break;
          case 'fSearch':
            this.getData(evt.data);
            break;
        }
      },


      //新增 修改
      async submitData(data,editFlag = false){

        let dataArr = data.scenedate.split(',');
        let startdate = moment(dataArr[0]).format('YYYY-MM-DD HH:mm:ss');
        let enddate = moment(dataArr[1]).format('YYYY-MM-DD HH:mm:ss');

        let subjectObj = this.data.lesson.find(item => item.subjectid == data.subjectid)  || {}
        let obj = {
          subjectid:subjectObj.subjectid,
          subjectname:subjectObj.subjectname,
          startdate,
          enddate,
          planid:this.data.Submit.form1.planid,
          id:data.editId
        }

        let res = editFlag ?  await modifyPlanScene(obj) : await addPlanScene(obj);
        // // console.log('createPlan res = ',res);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({planid:data.planid});
          this.$refs.formGrid.fFormCancel();
        }else{
          global.showMessage(res.msg);
        }

      },

      //删除
      async deleteData(data){
        // console.log(Array.isArray(data))
        let idList = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            idList += item.id+','
          });
          idList = idList.slice(0,idList.length-1);
        }else{
          idList = data.id
        }

        let res = await deletePlanScene({idList,planid:this.data.Submit.form1.planid});
        // console.log('delProblemType res = ',res);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({ planid: this.data.Submit.form1.planid });
          this.$refs.formGrid.fFormCancel();
        }else{
          global.showMessage(res.msg);
        }

      },

      // 获取科目
      async getFindBookKc(){
        let res = await getPlanSubject({planid:this.data.Submit.form1.planid});
        this.data.lesson = res.data || [];
      },


      //获取计划列表
      async getPlanList(){
        let res = await getAllPlan({state:'0'});
        this.planList = res.data || [];
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        if(!arr.length){
          this.data.Submit.form1.planid = '';
          this.data.Grid.grid1.data = [];
        }else{
          this.getData();
          this.getFindBookKc()
        }
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || [];
          }
          return item;
        })
      },

      //获取列表数据
      async getData(data={}){
        let param = {
          planid: data.planid || this.data.Submit.form1.planid || '',
        };
        let res = await getPlanScene(param);
        // console.log('res == ',res)
        // console.log('pagePlaceList res = ',res);
        this.data.Grid.grid1.data = (res.data || []).map((item,index) => {
          item.name = '第' + (index+1)+ '场'
          return item
        });
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
