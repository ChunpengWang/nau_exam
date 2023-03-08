<template>
  <div class="container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" ></formGrid>
    </div>
  </div>
</template>

<script>

  import formGrid from '@/components/formGrid/index'
  import template  from './template'
  import global from '@/utils/global';
  import { getEndPlanList, getSubjectById, getAnswerById, getAnswerTotalById} from '@/api/marking';
  export default {
    components: { formGrid },
    data() {
      return {
        data: template,
        planList:[],
        subjectList:[]
      };
    },
    created(){
      this.getPlanList()
    },
    methods: {
     async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt.method) {
          case 'fGoInto':
            let status = this.planList.filter(item => item.planid === this.data.Submit.form1.planid)[0]['markstate'];
            if(status == 1){
              return global.showMessage('阅卷还未开始，无法进行阅卷！');
            }
            this.$router.push({
              name: 'startMarking',
              query: {
                ...evt.data,
                planid: this.data.Submit.form1.planid,
                userId: this.$store.state.user.user.idcard,
              }
            });
            break;
          case 'fChangeTabList':
            this.getData({current:this.data.Grid.grid1.data.current,size:this.data.Grid.grid1.data.size,type:evt.data});
            if(evt.data === '2'){
              this.data.Grid.grid1.controller = null;
            }else{
              this.data.Grid.grid1.controller = {
                'title': '操作',
                'width': 200,
                'btns': [{ 'method': 'fGoInto', 'text': '评阅' }]
              };
            }
            break;
          case 'fChangeKsjh':
            if(evt.data && typeof evt.data != "object" ){
              this.getTabListNum(evt.data);
              await this.getKcList(evt.data);
              this.getData({planid:evt.data,current: this.data.Grid.grid1.data.current,size: this.data.Grid.grid1.data.size})
            }
            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            await this.getTabListNum()
            this.getData(evt.data);
            break;
        }
      },


      // 获取列表数据
      async getData(data={}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let param = {
          current:data.current || 1,
          size:data.size || 10,
          planid:data.planid || this.data.Submit.form1.planid || '',
          subjectcode:data.subjectcode || this.data.Submit.form1.subjectcode || '',
          idcard:this.$store.state.user.user.idcard,
          type:data.type || this.data.tabActiveId || ''
        };
        if(!param.planid){
          this.$refs.formGrid.isLoading = false
          return
        }
        let res = await getAnswerById(param);
        this.data.Grid.grid1.data = res.data || {};
        this.data.Grid.grid1.data.records = (res.data.records || []).map(item => {
          item.subjectname = (this.subjectList.find(ele => item.subjectcode == ele.subjectcode) || {}).subjectname
          return item;
        });
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
        });
      },

      async getTabListNum(planid = this.data.Submit.form1.planid){
       if(!planid){
         return
       }
        let res1 = await getAnswerTotalById({planid,idcard:this.$store.state.user.user.idcard});
        let resData = res1.data || {}
        this.data.tabList = this.data.tabList.map(item => {
          if (item.id === '1') {
            item.name = `待评阅 （${resData.noCompletedNum || 0}）`;
          } else {
            item.name = `已评阅 （${resData.completedNum || 0}）`;
          }
          return item;
        });
      },

      //获取计划列表
      async getPlanList(){
        let res = await getEndPlanList({});
        this.planList = res.data || [];
        let arr = (res.data || []).filter(item => item.planid === this.data.Submit.form1.planid);
        if(!arr.length){
          this.data.Submit.form1.planid = '';
        }else{
          this.getTabListNum();
          await this.getKcList();
          this.getData();
        }
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || [];
          }
          return item;
        })
      },

      //获取科目列表
      async getKcList(planid = this.data.Submit.form1.planid){
        if(!planid){
          return
        }
        let res = await getSubjectById({planid});
        let arr = (res.data || []).filter(item => item.id === this.data.Submit.form1.subjectcode);
        if(!arr.length){
          this.data.Submit.form1.subjectcode  =  '';
        }
        this.subjectList = res.data || []
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='subjectcode'){
            item.data = res.data || []
          }
          return item;
        })

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
