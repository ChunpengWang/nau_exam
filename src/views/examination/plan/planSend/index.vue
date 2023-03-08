<template>
  <div class="planSend-container">

    <my-loading :myloading='isLoading'></my-loading>

    <div class="toolbar-box">
      <my-toolbar ref="myToolbar" :submit="data.Submit.form1" :form="data.Form.form1" :btns="data.Btn.btn1"
                  @transferEvt="fBtnEvt"></my-toolbar>
    </div>
    <div class="content-box">
      <div class="table-content">
        <div class="plan-list-container">
          <el-checkbox-group v-model="checkValue" @change="handleCheckedCitiesChange">
            <div class="plan-item-container" v-for="item in listData.records">
              <el-checkbox :key="item.planid" :label="item.planid" class="checkbox-icon"
                           v-if="planStatus === '1'"></el-checkbox>
              >
              <div class="title">
                <span>{{item.planname}}</span>
              </div>
              <div class="subTitle">
                <div class="subtitle-item">
                  <img src="@/assets/images/exam/plan-date.png" alt="">
                  <span>计划日期：{{item.date}}</span>
                </div>
                <div class="subtitle-item" >
                  <img src="@/assets/images/exam/student-num.png" alt="">
                  <span>考生总人数：{{item.studentnum || '-'}}</span>
                </div>

              </div>
              <div class="content">
                <div class="content-item" v-for="element in item.examCourseList">
                  <span>{{element.name }}</span>
                  <span class="date-container">{{element.date ||'-'}}</span>
                  <span class="sub-content">
                     <span class="sub-content-item">
                        <span> {{element.subjectname ||'-'}}</span>
                        <span>{{element.studentnum || 0}}人</span>
                        <span>{{element.papername}}</span>
                     </span>
                  </span>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>
        <div v-if="listData.records && !listData.records.length" class="no-data-container">暂无数据</div>
      </div>
      <div class="table-foot">
        <el-pagination background
                       size='mini'
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="listData.current"
                       :page-sizes="[10,20,30,40]"
                       :page-size="listData.size"
                       :pagerCount="5"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="listData.total">
        </el-pagination>
      </div>
    </div>

    <el-dialog v-el-drag-dialog
               class="my-el-dialog-form-container my-el-dialog-tree-container"
               title='新增发布'
               :visible.sync="dialogVisible"
               :before-close="fCancel"
               :modal-append-to-body="false"
               width="45%">
      <send @transferEvt="fBtnEvt" :template="data" ref="send"></send>
    </el-dialog>


  </div>
</template>

<script>
  import moment from 'moment';// 导入文件
  import formGrid from '@/components/formGrid/index';
  import myLoading from '@/components/loading/index';
  import myToolbar from '@/components/toolbar/index';
  import template from './template';
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import send from './send';
  import global from '@/utils/global';
  import {getAllPlanByState,changePlanState,getAllPlan} from '@/api/examination';

  export default {
    directives: { elDragDialog },
    name: '',
    data() {
      return {
        data: template,
        listData: {
          records: []
        },
        dialogVisible: false,
        checkValue: [],
        endList: [],
        planStatus: '1',
        planname: '',
        isLoading: false
      };
    },
    components: { formGrid, myToolbar, send, myLoading },
    mounted() {
    },
    created() {
      this.data.Submit.form1.status = '1';
      this.getPlanList();
      this.getData();
    },
    methods: {

      handleSizeChange(val) {
        this.getData({ current: this.listData.current, size: val });
      },

      handleCurrentChange(val) {
        this.getData({ current: val, size: this.listData.size });
      },

      fBtnEvt(evt) {
        console.log('currentPage fBtnEvt evt = ', evt);
        if (evt.type && evt.type === 'add' && evt.event === 'fAddSend') {
          this.dialogVisible = true;
        }

        switch (evt) {
          case 'fCancel':
            this.fCancel();
            break;
          case 'fSend':
            this.getData({ planStatus: '1' });
            this.fCancel();
            break;
          case 'fEndPlanByIds':
            if (this.planStatus !== '1') {
              return global.showMessage('请在进行中的考试计划中进行该操作');
            }
            this.endData();
            break;
          case 'fSearch':
            this.planStatus = this.data.Submit.form1.status;
            this.planname = this.data.Submit.form1.planname;
            let param = {
              planStatus: this.data.Submit.form1.status,
              planname: this.data.Submit.form1.planname,
              current: this.listData.current,
              size: this.listData.size
            };
            this.getData(param);
            break;
        }

        switch (evt.method) {
          case 'fLoading':
            this.isLoading = evt.data;
            break;
        }

      },

      //结束计划
      async endData() {
        if(!this.checkValue.length){
          return global.showMessage('请选择要结束的计划');
        }
        let res = await changePlanState({ 'ids': this.checkValue.join() ,state:'2'});
        if (res.state == '200') {
         global.showMessage(res.msg,'success');
          this.getData({ current: this.listData.current, size: this.listData.size });
        } else {
          global.showMessage(res.msg);
        }
      },

      //选择要结束的计划项
      async handleCheckedCitiesChange(val) {
        if (val && !val.length) {
          this.endList = []
          return global.showMessage('请选择要结束的项');
        }
        this.endList = val;
      },

      //取消
      fCancel() {
        this.dialogVisible = false;
      },

      //获取计划列表
      async getPlanList() {
        let res = await getAllPlan({state:'0'});
        this.data.planList = res.data || [];
      },

      //获取列表数据
      async getData(data = {}) {
        this.isLoading = true;
        let param = {
          current: data.current || 1,
          planname: data.planname || this.planname || '',
          state: data.planStatus || this.planStatus || '',
          size: data.size || 10
        };
        let res = await getAllPlanByState(param);
        this.listData = res.data || {};
        this.listData.records = this.listData.records.map(item => {
          item.date = moment(item.startdate).format('YYYY-MM-DD') + '-' + moment(item.enddate).format('YYYY-MM-DD');
          let paperList = JSON.parse(item.paperlist || '[]')
          let studentNumObj = JSON.parse(item.studentnumtotal || '{}')
          item.examCourseList = JSON.parse(item.scenelist || '[]').map((ele,index) => {
            ele.date = ele.startdate + '-' + ele.enddate;
            ele.name = `第${index+1}场`
            let obj = paperList.find(pitem=> pitem.subjectid == ele.subjectid) || {}
            ele.papername = obj.papername
            ele.studentnum = studentNumObj[obj.subjectcode || ''] || ''
            return ele;
          });
          return item;
        });
        this.isLoading = false;
      },

    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";

  .planSend-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .toolbar-box {
      margin: 0 pxToRem(20);
    }

    .content-box {
      width: 100%;
      height: 100%;
      position: relative;
      .table-content {
        border-radius: 10px;
        border: 1px solid #ccc;
        /*width: 100%;*/
        left: pxToRem(20);
        right: pxToRem(20);
        position: absolute;
        top: 0;
        bottom: 40px;
        padding: 20px;
        overflow-y: scroll;

        .plan-list-container {
          .plan-item-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 15px;

            .checkbox-icon {
              position: absolute;
              top: 10px;
              left: 10px;

              .el-checkbox__label {
                visibility: hidden !important;
              }
            }

            .title {
              color: #333;
              font-size: pxToRem(30);
              margin-bottom: pxToRem(20);
              margin-top: pxToRem(10);
              position: relative;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              .export-arrangement{
                position: absolute;
                right: 0;
              }
            }

            .subTitle {
              display: grid;
              width: 100%;
              grid-auto-flow: column;
              grid-template-columns: 1fr 1fr ;
              justify-items: center;

              .subtitle-item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;

                img {
                  width: pxToRem(40);
                }

                span {
                  margin-left: pxToRem(10);
                  font-size: pxToRem(14);
                  color: #666;
                }
              }
            }

            .content {
              width: 100%;
              display: grid;
              grid-template-columns: repeat(auto-fill, 100%);

              .content-item {
                background-color: #f4f5f9;
                border: 1px solid #ccc;
                border-radius: 6px;
                min-height: 50px;
                margin-right: 0;
                margin-top: 15px;
                display: grid;
                grid-template-columns: 1fr 2fr 3fr;
                align-items: center;
                padding: 0 0 0 pxToRem(40);
                font-size: pxToRem(14);
                color: #333;

                .date-container{
                  height: 100%;
                  align-items: center;
                  display: flex;
                  border-right: 1px solid #ccc;
                }

                .sub-content {
                  display: flex;
                  flex-direction: column;

                  .sub-content-item {
                    display: flex;
                    flex-direction: row;
                    height: 45px;
                    justify-content: center;
                    align-items: center;
                    border-bottom: 1px solid #ccc;

                    > span {
                      flex: 1;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    }
                  }

                  > .sub-content-item:last-child{
                    border-bottom: none;
                  }
                }

                .num-container {
                  color: $baseColor;
                  margin-left: 4px;
                }
              }

              .content-item:nth-of-type(2n+2) {
                margin-right: 0;
              }
            }
          }
        }
      }

      .table-foot {
        position: absolute;
        left: pxToRem(20);
        right: pxToRem(20);
        bottom: 3px;
        /*width: 100%;*/
        text-align: right;
      }
    }

    .no-data-container{
      display: flex;
      height: 100%;
      flex: 1;
      color: #666;
      font-size: pxToRem(18);
      align-items: center;
      justify-content: center;
    }


    /* //element-ui table的去除右侧滚动条的样式 */
    ::-webkit-scrollbar {
      width: 1px;
      height: 1px;
    }

    /* // 滚动条的滑块 */
    ::-webkit-scrollbar-thumb {
      background-color: #a1a3a9;
      border-radius: 0px;
    }
  }
</style>
