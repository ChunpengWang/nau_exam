<template>
  <div class="task-container">
    <div class="table-container">
      <formGrid ref="formGrid" :template="data" @transferEvt="fBtnEvt" >
        <div slot="tabDesc" slot-scope="item" >
          <div class="marking-desc-container">
            <div class="marking-desc-item">
              <span class="num">{{item.tabItem.dtksl}}</span>
              <span class="desc">答题卡数量</span>
            </div>
            <div class="marking-desc-item">
              <span class="num">{{item.tabItem.assignmentNum }}</span>
              <span class="desc">已分配</span>
            </div>
            <div class="marking-desc-item">
              <span class="num">{{item.tabItem.noAssignmentNum}}</span>
              <span class="desc">未分配</span>
            </div>
            <div class="marking-desc-item">
              <span class="num" style="color:#33c58f">{{item.tabItem.rate}}%</span>
              <span class="desc">阅卷进度</span>
              <span class="desc-num">未阅卷数量({{item.tabItem.completedNum}})</span>
            </div>
            <div class="marking-desc-item">
              <span class="num" style="color:#f2637b">{{yjztStr}}</span>
              <span class="desc">分配确认状态</span>
            </div>
          </div>
        </div>
      </formGrid>
    </div>

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

  </div>
</template>

<script>
  import formGrid from '@/components/formGrid/index'
  import template from './template'
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import validateForm from '@/components/validateForm';
  import global from '@/utils/global';
  import {
    changeMarkTeacherTask,
    resetMarkTeacherTask, getEndPlanList,
    distributeMarkTask,
    getEndPlanSubject,
    getMarkTeacherById,
    getMarkTeacherTask, markStateConfirm,
  } from '@/api/marking';
  import {getAllSubject} from '@/api/question';
  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        data:template,
        planid:'',
        teachername:'',
        planList:[],
        subjectList:[],
        yjztStr:'', //阅卷状态
        formCfg2: {
          title: '增加任务量', // 弹框标题
          dialogVisible: false, //控制弹框显示隐藏
          data: {}// 弹框表单数据
        },
      }
    },
    components: { formGrid,validateForm },

    mounted(){},
    async created(){
      await this.getFindBookKc()
      this.getPlanList()

    },
    methods:{
      async fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ',evt);
        switch (evt) {
          case 'fAddCurrent':
            if(!this.data.Submit.form1.planid){
              return global.showMessage('请选择考试计划后再进行操作')
            }
            this.$confirm('此操作将一键分配该考试计划下所有数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              let res = await distributeMarkTask({planid:this.data.Submit.form1.planid});
              if(res.state == '200'){
                global.showMessage(res.msg,'success');
                this.getSeeSubject(this.data.Submit.form1.planid,1);
              }else{
                global.showMessage(res.msg);
              }
            });

            break;
          case 'fRestData':
            if(!this.data.Submit.form1.planid){
              return global.showMessage('请选择考试计划后再进行操作')
            }
            this.$confirm('此操作将重置该考试计划下所有数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              let res1 = await resetMarkTeacherTask({planid:this.data.Submit.form1.planid});
              if(res1.state == '200'){
                global.showMessage(res1.msg,'success');
                this.getSeeSubject(this.data.Submit.form1.planid,1);
              }else{
                global.showMessage(res1.msg);
              }
            });

            break;
          case 'fMarkingConfirm':
            if(!this.data.Submit.form1.planid){
              return global.showMessage('请选择考试计划后再进行操作')
            }
            this.$confirm('此操作将确认该考试计划的状态, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              let res2= await markStateConfirm({planid:this.data.Submit.form1.planid});
              if(res2.state == '200'){
                global.showMessage(res2.msg,'success');
                this.getPlanList();
              }else{
                global.showMessage(res2.msg);
              }
            });
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;
        }
        switch (evt.method) {
          case 'fAddTask':
            this.formCfg2.title = '增加任务量';
            this.data.Form.form2 = this.data.Form.form2.map(item => {
              if(item.name === 'tasknum'){
                item.text = '增加任务量';
              }
              return item;
            });
            const obj1 = this.data.tabList.filter(item => item.id === this.data.tabActiveId)[0] || {};
            if(!obj1.noAssignmentNum){
              return  global.showMessage('该科目没有多余的任务量增加了')
            }
            let objData = {
              teachername: evt.data.teachername,
              km: obj1.name,
              dqrwl: evt.data.tasknum,
              tasknum: 1,
              yjrId:evt.data.markteacherid
            };
            this.formCfg2.data = {
              submit: this.data.Submit.form2,
              form: this.data.Form.form2,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fSubmitAddTask',
            };
            for (const k in this.formCfg2.data.submit) {
              this.formCfg2.data.submit[k] = objData[k] + '';
            }
            this.formCfg2.dialogVisible = true;
            break;
          case 'fReduceTask':
            this.formCfg2.title = '减少任务量';
            if(!evt.data.tasknum){
              return  global.showMessage('该老师当前已经没有任务量了')
            }
            this.data.Form.form2 = this.data.Form.form2.map(item => {
              if(item.name === 'tasknum'){
                item.text = '减少任务量';
              }
              return item;
            });
            const obj2 = this.data.tabList.filter(item => item.id === this.data.tabActiveId)[0] || {};
            let objData2 = {
              teachername: evt.data.teachername,
              km: obj2.name,
              dqrwl: evt.data.tasknum,
              tasknum: 1,
              yjrId:evt.data.markteacherid
            };
            this.formCfg2.data = {
              submit: this.data.Submit.form2,
              form: this.data.Form.form2,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fSubmitReduceTask',
            };
            for (const k in this.formCfg2.data.submit) {
              this.formCfg2.data.submit[k] = objData2[k] + '';
            }
            this.formCfg2.dialogVisible = true;
            // console.log('fReduceTask ');
            break;
          case 'fSubmitAddTask':
            this.addOrReduce({addReduce:evt.data.tasknum,yjryId:evt.data.yjrId,isAdd:true});
            break;
          case 'fHover':
            this.getHoverData(evt.data);
            break;
          case 'fSubmitReduceTask':
            this.addOrReduce({addReduce:evt.data.tasknum,yjryId:evt.data.yjrId});
            break;
          case 'fChangeKsjh':
            if(evt.data && typeof evt.data != 'object'){
              let arr =  (this.planList || []).filter(item => item.planid === evt.data);
              this.yjztStr = arr[0]['markstate'] ? (arr[0]['markstate'] == 1 ? '未确认' : (arr[0]['markstate'] == 2 ? '已确认' : '阅卷完成')) : null;
              await this.getSeeSubject(evt.data,1);
              this.data.tabActiveId = '1';
            }
            break;
          case 'fChangeTabList':
            if(evt.data === '1'){
              this.data.Grid.grid1.columns = this.data.Grid.grid1.columns.map(item => {
                if(item.field === 'tasknum'){
                  item.type = 'hover';
                  item.width = 100;
                }
                return item;
              })
            }else{
              this.data.Grid.grid1.columns = this.data.Grid.grid1.columns.map(item => {
                if(item.field === 'tasknum'){
                  item.type = 'btn';
                  item.width = 200;
                  item.addmethod = 'fAddTask';
                  item.reducemethod = 'fReduceTask';
                }
                return item;
              })
            }
            this.getData({size:this.data.Grid.grid1.data.size,current:1});

            break;
          case 'fSizePage':
            this.getData(evt.data);
            break;
          case 'fCurrentPage':
            this.getData(evt.data);
            break;
          case 'fSearch':
            this.planid = evt.data.planid;
            this.teachername = evt.data.teachername;
            this.getData(evt.data);
            break;
        }
      },

      // 获取科目
      async getFindBookKc(){
        let res = await getAllSubject()
        this.subjectList = res.data || []
      },

      // 取消
      fFormCancel(){
        this.formCfg2.dialogVisible= false;
      },

      //获取hover数据
      async getHoverData(data){
        let resDetail = await getMarkTeacherTask({ planid: this.data.Submit.form1.planid, markteacherid: data.markteacherid }) || {}
        this.data.Grid.grid1.hoverData = [...Object.entries(resDetail.data).map(item => {
          let subjectname = (this.subjectList.find(ele=> ele.subjectcode == item[0]) || {}).subjectname
          return {
            sl: item[1],
            kskmmc: subjectname
          }
        })]
      },

      //获取人员数据
      async getData(data={}){
        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = true
        });
        let kmId =  this.data.tabActiveId === '1' ? '' : this.data.tabActiveId;
        let param = {
          planid:data.planid || this.planid ||  this.data.Submit.form1.planid || '',
          qykskmId:data.qykskmId || kmId || '',
          teachername:data.teachername || this.teachername || '',
          current: data.current || 1,
          size: data.size || 10
        };
        let res = await getMarkTeacherById(param);
        this.data.Grid.grid1.data = res.data || {};

        this.$nextTick(()=>{
          this.$refs.formGrid.isLoading = false
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
          this.yjztStr = arr[0]['markstate'] ? (arr[0]['markstate'] == 1 ? '未确认' : (arr[0]['markstate'] == 2 ? '已确认' : '阅卷完成')) : null;
          this.getSeeSubject(this.data.Submit.form1.planid);
        }
        this.data.Form.form1 =  this.data.Form.form1.map(item => {
          if(item.name==='planid'){
            item.data = res.data || [];
          }
          return item;
        });
      },

      //获取科目
      async getSeeSubject(planid,current = 0){

        let res = await getEndPlanSubject({planid});
        // console.log('findSeeSubject res =',res);
        let dtkslTotal = 0;
        let assignmentNumTotal = 0;
        let noAssignmentNumTotal = 0;
        let completedNumTotal = 0;
        let noCompletedNumTotal = 0;
        let arr = (res.data || []).map(item => {
          dtkslTotal += item.dtksl;
          assignmentNumTotal += item.assignmentNum;
          noAssignmentNumTotal += item.noAssignmentNum;
          completedNumTotal += item.completedNum;
          noCompletedNumTotal += item.noCompletedNum;
          item.name = item.kskmmc;
          item.id = item.qykskmId;
          item.icon =  !item.noAssignmentNum ? 'el-icon-success' :'el-icon-pie-chart';
          item.iconStyle =  !item.noAssignmentNum ? {
            'marginLeft': '8px',
            'color': '#33c58f'
          } :{
            'marginLeft': '8px',
            'color': '#aaa'
          };
          let rateValue =(item.completedNum || 0) / ((item.completedNum || 0) + (item.noCompletedNum || 0));
          item.rate = isNaN(rateValue) ? 0 : (rateValue * 100).toFixed(2);
          return item;
        });
        let arr1 = arr.filter(item => !item.noAssignmentNum);
        let rateValueTotal = completedNumTotal / (completedNumTotal + noCompletedNumTotal);
        arr.unshift({
          id: '1',
          name: '全部科目',
          icon: arr1.length === (res.data || []).length ? 'el-icon-success' : 'el-icon-pie-chart',
          iconStyle:  arr1.length === (res.data || []).length ? {
            'marginLeft': '8px',
            'color': '#33c58f'
          } : {
            'marginLeft': '8px',
            'color': '#aaa'
          },
          dtksl:dtkslTotal,
          assignmentNum:assignmentNumTotal,
          noAssignmentNum:noAssignmentNumTotal,
          completedNum:completedNumTotal,
          noCompletedNum:noCompletedNumTotal,
          rate: isNaN(rateValueTotal) ? 0 : (rateValueTotal * 100).toFixed(2)
        });
        this.data.tabList = _.cloneDeep(arr);

        this.getData({ planid, current: current ? current : this.data.Grid.grid1.data.current });

      },

      //增加或减少工作量
      async addOrReduce(data={}){
        let param = {
          planid: data.planid || this.data.Submit.form1.planid || '',
          yjryId: data.yjryId || '',
          qykskmId: data.qykskmId || this.data.tabActiveId ||'',
          addReduce: data.addReduce || '',
          isAdd:data.isAdd
        };
        let res = await changeMarkTeacherTask(param);
        if(res.state == '200'){
          global.showMessage(res.msg,'success');
          this.getSeeSubject(this.data.Submit.form1.planid);
          this.formCfg2.dialogVisible = false;
        }else{
          global.showMessage(res.msg);
        }
      },


    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .task-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .table-container{
      height: 100%;
      width: 100%;
      max-width: 100%;
      display: flex;
      flex:1;
      position: relative;
      .marking-desc-container{
        display: flex;
        flex-direction: row;
        padding: 10px 0;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        .marking-desc-item{
          margin-right: pxToRem(20);
          border:1px dashed  #ccc;
          display: flex;
          flex-direction: column;
          width: pxToRem(138);
          height: pxToRem(138);
          border-radius: 6px;
          justify-content: center;
          align-items: center;
          font-size: pxToRem(20);
          position: relative;
          color: #666;
          .num{
            color: #fd9001;
            font-weight: 700;
          }
          .desc{
            margin-top: 20px;
            font-size: pxToRem(16);
            padding-bottom: 25px;
          }
          .desc-num{
            position: absolute;
            bottom:4px;
            width: 100%;
            text-align: center;
            font-size: pxToRem(10);
            color:#f2637b
          }
        }
      }
    }
  }
</style>
