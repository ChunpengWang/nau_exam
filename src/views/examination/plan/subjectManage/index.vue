<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>
  </div>
</template>

<script>
  import {getPlanSubject,addPlanSubject,deletePlanSubject,modifyPlanSubject,getAllPlan,getNotUsedSubjectById,getAllPaperBySubjectId} from '@/api/examination';
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import global from '@/utils/global';
  export default {
    name: '',
    data() {
      return {
        data:template,
        kmList:[],
        paperList:[]
      }
    },
    components: { formGrid },
    mounted(){},
    created(){
      this.getPlanList();
    },
    methods:{

     async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
        }
        switch (evt.method) {
          case 'fAdd':
            this.submitData(evt.data);
            break;
          case 'fEditList':
            this.submitData(evt.data,true);
            break;
          case 'fChangeKsjh':
            if(evt.data && typeof evt.data != 'object'){
              this.getData({ planid: evt.data});
             await this.getFindBookKc()
            }
            break;
          case 'fDeleteList':
            this.deleteData(evt.data);
            break;
          case 'fChangeKm':
           this.getAllPaperBySubject(evt.data)
            break;
          case 'fSearch':
            if(!this.data.Submit.form1.planid){
              this.$refs.formGrid.isLoading = false;
              return global.showMessage('请选择考试计划再进行操作')
            }
            this.getData(evt.data);
            break;
        }
      },

      async getAllPaperBySubject(id=''){
         let subjectid = id || this.data.Submit.form2.subjectid
        if(! subjectid){
          return
        }
        let res = await getAllPaperBySubjectId({subjectid:id || this.data.Submit.form2.subjectid});
        if(res.state == '200'){
          this.paperList = res.data || [];
          this.data.Form.form2 = this.data.Form.form2.map(item => {
            if(item.name==='paperid'){
              item.data = res.data || [];
            }
            return item;
          })
          this.data.Submit.form2.paperid = ''
        }
      },


      //新增 修改
      async submitData(data,editFlag= false){
        this.$refs.formGrid.fFormCancel();
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });

        let subjectObj = this.kmList.find(item => item.subjectid == data.subjectid)  || {}
        let paperObj = this.paperList.find(item => item.paperid == data.paperid)  || {}
        let obj = {
          subjectid:subjectObj.subjectid,
          paperid:paperObj.paperid,
          subjectcode:subjectObj.subjectcode,
          subjectname:subjectObj.subjectname,
          papername:paperObj.papername,
          planid:this.data.Submit.form1.planid,
          id:data.id
        }


        let res = editFlag ?  await modifyPlanSubject(obj) : await addPlanSubject(obj);
         // console.log('createPlan res = ',res);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData();
          this.getFindBookKc();
          this.$refs.formGrid.fFormCancel();
        }else{
          global.showMessage(res.msg);
        }
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },

      //删除
      async deleteData(data){
        // console.log(Array.isArray(data))
        let idList = '';
        if(Array.isArray(data)){
          data.forEach(item => {
            idList += item.subjectid+','
          });
          idList = idList.slice(0,idList.length-1);
        }else{
          idList = data.subjectid
        }
        let res = await deletePlanSubject({idList,planid:this.data.Submit.form1.planid});
        // console.log('delProblemType res = ',res);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getFindBookKc();
          this.getData({ planid: this.data.Submit.form1.planid});
          this.$refs.formGrid.fFormCancel();
        }else{
          global.showMessage(res.msg);
        }

      },


      // 获取科目
      async getFindBookKc(){
        let res = await getNotUsedSubjectById({planid:this.data.Submit.form1.planid});
       // console.log('findBookKc res = ',res);
        this.kmList  = res.data || [];
        this.data.Form.form2 = this.data.Form.form2.map(item => {
           if(item.name ==='subjectid'){
             item.data = res.data || [];
           }
          return item;
        })
      },


      //获取计划列表
      async getPlanList(){
        let res = await getAllPlan({state:'0'});
        // console.log('planList res = ',res);
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

      //获取科目列表
      async getData(data={}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let param = {
          planid: data.planid || this.data.Submit.form1.planid || ''
        };
        let res = await getPlanSubject(param);
        // console.log('res = ',res)
        this.data.Grid.grid1.data = res.data || [];
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
