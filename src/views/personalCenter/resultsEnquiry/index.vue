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
  import {getEndPlanList} from "@/api/marking";
  import {getAchievementByIdcard} from "@/api/examinee";
  import {getPlanSubjectById} from "@/api/examination";
  export default {
    name: '',
    data() {
      return {
        data:template,
        subjectList:[]
      }
    },
    components: { formGrid },
    mounted(){},
    created(){
      this.getPlanList();
    },
    methods:{
      async getSubjectData(planid){
        let res = await  getPlanSubjectById({planid});
        this.subjectList  = res.data || []
      },
     async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt.method) {
          case 'fChangeKsjh':
            if(evt.data && typeof evt.data != 'object'){
              await this.getSubjectData(evt.data)
              this.getData({ planid: evt.data,current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size  });
            }
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.getData(evt.data);
            break;
        }
      },


      //获取计划列表
      async getPlanList(){
        let res = await getEndPlanList({});
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        if (!arr.length) {
          this.data.Submit.form1.planid = '';
          this.data.Grid.grid1.data = {};
        } else {
          await this.getSubjectData(this.data.Submit.form1.planid)
          this.getData();
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
          current: data.current || 1,
          planid: data.planid || this.data.Submit.form1.planid || '',
          size: data.size || 10,
          idcard:this.$store.state.user.user.idcard || ''
        };
        let res = await getAchievementByIdcard(param);
        this.data.Grid.grid1.data = res.data || {};
        this.data.Grid.grid1.data.records = this.data.Grid.grid1.data.records.map(item => {
          item.subjectname = (this.subjectList.find(ele => ele.subjectcode == item.subjectcode) || {}).subjectname
          return item
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
