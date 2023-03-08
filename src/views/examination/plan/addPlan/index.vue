<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>
  </div>
</template>

<script>
  import {deletePlan,modifyPlan,addPlan,getPlan} from '@/api/examination';
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import moment from 'moment';// 导入文件
  import global from '@/utils/global';
  export default {
    name: '',
    data() {
      return {
        data:template,
        planname:'',
      }
    },
    components: { formGrid },
    mounted(){

    },
    created(){
      this.getData();
    },
    methods:{
      fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
        }
        switch (evt.method) {
          case 'fAdd':
            let dataArr = evt.data.plandate.split(',');
            let startdate = moment(dataArr[0]).format('YYYY-MM-DD');
            let enddate = moment(dataArr[1]).format('YYYY-MM-DD');
            let addParam = {
              startdate,
              enddate,
              ...evt.data
            };
            this.submitData(addParam);
            break;
          case 'fEditList':
            let dataArr1 = evt.data.plandate.split(',');
            let startdate1 = moment(dataArr1[0]).format('YYYY-MM-DD');
            let enddate1 = moment(dataArr1[1]).format('YYYY-MM-DD');
            let updateParam = {
              startdate:startdate1,
              enddate:enddate1,
              ...evt.data,
              id:(evt.data || {}).planid
            };
            this.submitData(updateParam);
            break;
          case 'fDeleteList':
            this.deleteData(evt.data);
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.planname = evt.data.planname;
            this.getData(evt.data);
            break;
        }
      },

      //获取列表数据
      async getData(data={}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let param = {
          current: data.current || 1,
          planname: data.planname || this.planname || '',
          size: data.size || 10
        };
        let res = await getPlan(param);
        this.data.Grid.grid1.data = res.data || {};
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },



      //新增 修改
      async submitData(data){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let res = data.id ?  await modifyPlan(data) : await addPlan(data);
        // console.log('createPlan res = ',res);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({size:this.data.Grid.grid1.data.size,current:this.data.Grid.grid1.data.current});
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
        let idList = '';
        let stateList = ''
        if(Array.isArray(data)){
          data.forEach(item => {
            idList += item.planid+','
            stateList += item.state+','
          });
          idList = idList.slice(0,idList.length-1);
          stateList = stateList.slice(0,stateList.length-1);
        }else{
          idList = data.planid
          stateList = data.state
        }
        // console.log('idList = ',idList)
        let res = await deletePlan({ids:idList,stateList});
        // console.log('delProblemType res = ',res);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getData({size:this.data.Grid.grid1.data.size,current:this.data.Grid.grid1.data.current});
          this.$refs.formGrid.fFormCancel();
        }else{
          global.showMessage(res.msg);
        }

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
