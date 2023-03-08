<template>
  <div class="formGrid-container">

    <my-loading :myloading='isLoading'></my-loading>
    <div class="toolbar-box">
      <my-toolbar ref="myToolbar" :submit="data.Submit.form1" :form="data.Form.form1" :btns="data.Btn.btn1" :explain="data.explainObj"
                  @transferEvt="fBtnEvt"></my-toolbar>
    </div>

    <slot name="tableBoth"></slot>

    <div class="table-box" v-if="data.tabTable">
      <el-tabs v-model="data.tabActiveId" :class="data.tableBoth?'formGrid-tabs-both':''" class="my-el-formGrid-tabs my-el-tabs"
               @tab-click="fBtnEvt({'method':'fChangeTabList','data':data.tabActiveId})">
        <el-tab-pane :label="item.name" :name="item.id" v-for="item in data.tabList" class="my-el-tab-pane-box" :key="item.id">
          <span slot="label" v-if="item.icon">{{item.name}} <i :class="item.icon" :style="item.iconStyle" ></i></span>
          <span slot="label" v-if="item.tipContent">{{item.name}}
                   <el-tooltip class="item" effect="dark" :content="item.tipContent" placement="top">
          <span class="el-icon-question" :style="item.tipContentStyle ? {fontSize:'16px',cursor:'pointer',...item.tipContentStyle} :  {fontSize:'16px',cursor:'pointer'}" ></span>
        </el-tooltip>
            </span>
          <slot name="tabDesc" :tabItem="item" ></slot>
          <my-table ref="myTable" :gridCfg="data.Grid.grid1" @transferEvt="fBtnEvt">
<!--            <slot  slot="rowContent" name="tabRowContent" :tabItem="item" ></slot>-->
          </my-table>
        </el-tab-pane>
      </el-tabs>
      <div v-if="!data.tabList.length" class="no-data-container">暂无数据</div>
    </div>


    <div class="table-box" v-if="!data.tabTable" :class="data.isTabTitle? 'table-title-box':''">
      <slot name="tabTitle"></slot>
      <my-table ref="myTable" :gridCfg="data.Grid.grid1" @transferEvt="fBtnEvt"></my-table>
    </div>


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


  </div>
</template>

<script>
  import myTable from '../table/index';
  import myToolbar from '../toolbar/index';
  import myLoading from '../loading/index';
  import elDragDialog from '@/directive/el-drag-dialog'; // base on element-ui
  import validateForm from '@/components/validateForm';
  import global from '@/utils/global';

  export default {
    components: {
      myTable,
      myToolbar,
      myLoading,
      validateForm,
    },
    directives: { elDragDialog },
    props: ['template'],
    data() {
      return {
        data: {}, // 数据
        isLoading: false, // 页面loading
        formCfg: {
          title: '', // 弹框标题
          dialogVisible: false, //控制弹框显示隐藏
          data: {}// 弹框表单数据
        },
      };
    },
    mounted() {
    },
    created() {
      this.data = this.template;
    },
    methods: {

      async fBtnEvt(evt) {
        console.log('formGrid fBtnEvt = ', evt);
        if (evt.type && evt.type === 'add') {
          switch (evt.event) {
            case 'fAddCurrent':
              this.$emit('transferEvt',evt.event);
              break;
            case 'fAddLesson':
              if(!this.data.Submit.form1.planid){
                return global.showMessage('请选择考试计划再进行操作');
              }
              this.data.Form.form2 = this.data.Form.form2.map(item => {
                if(item.text==='考试科目'){
                  item.data =  this.data.lesson || [];
                }
                return item;
              });
              this.formCfg.data = {
                submit: this.data.Submit.form2,
                form: this.data.Form.form2,
                rules: this.data.Rules,
                url: this.data.Url,
                method: 'fAdd',
                lesson: this.data.lesson
              };
              for (const k in this.formCfg.data.submit) {
                this.formCfg.data.submit[k] = '';
              }
              this.formCfg.title = evt.name;
              this.formCfg.dialogVisible = true;
              this.$nextTick(() => {
                this.$refs.validateForm.$refs.form.resetFields();
              });
              break;
            case 'fAddSubject':
              if(!this.data.Submit.form1.planid){
                return global.showMessage('请选择考试计划再进行操作');
              }
              this.formCfg.data = {
                submit: this.data.Submit.form2,
                form: this.data.Form.form2,
                rules: this.data.Rules,
                url: this.data.Url,
                method: 'fAdd'
              };
              for (const k in this.formCfg.data.submit) {
                // if(typeof this.formCfg.data.submit[k])
                if(this.formCfg.data.submit[k].checkList){
                  this.formCfg.data.submit[k].checkList = []
                }else{
                  this.formCfg.data.submit[k] = '';
                }

              }
              this.formCfg.title = evt.name;
              this.formCfg.dialogVisible = true;
              this.$nextTick(() => {
                this.$refs.validateForm.$refs.form.resetFields();
              });
              break;
            default:
              this.formCfg.data = {
                submit: this.data.Submit.form2,
                form: this.data.Form.form2,
                rules: this.data.Rules,
                url: this.data.Url,
                method: 'fAdd'
              };
              for (const k in this.formCfg.data.submit) {
                // if(typeof this.formCfg.data.submit[k])
                if(this.formCfg.data.submit[k].checkList){
                  this.formCfg.data.submit[k].checkList = []
                }else{
                  this.formCfg.data.submit[k] = '';
                }

              }
              this.formCfg.title = evt.name;
              this.formCfg.dialogVisible = true;
              this.$nextTick(() => {
                this.$refs.validateForm.$refs.form.resetFields();
              });
          }
          return;
        } else if (evt.title && evt.title === 'loading') {
          this.isLoading = evt.data;
          return;
        }

        switch (evt) {
          case 'fSearch':
            this.fSearch();
            break;
          case 'fEsc':
            this.fEsc();
            break;
          case 'fDeleteByIds':
            this.fDeleteByIds();
            break;
          case 'templateDownload':
            this.templateDownload();
            break;
          case 'fFormCancel':
            this.fFormCancel();
            break;
          default:
            !evt.method ? this.$emit('transferEvt', evt) : null;
        }

        switch (evt.method) {
          case 'fImport':
            this.fImport(evt.data);
            break;
          case 'fImportZip':
            this.fImport(evt.data,'zip');
            break;
          case 'fEditPlan':
            this.formCfg.data = {
              submit: this.data.Submit.form2,
              form: this.data.Form.form2,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fEditList',
              type:'addPlan',
              editId: evt.data.id,
              addPlanData: evt.data
            };
            for (const k in this.formCfg.data.submit) {
              this.formCfg.data.submit[k] = evt.data[k] + '';
            }
            const start = new Date(evt.data.startdate);
            const end = new Date(evt.data.enddate);
            this.formCfg.title = '修改';
            this.formCfg.dialogVisible = true;
            this.$nextTick(()=>{
              this.$set(this.$refs.validateForm.formCfg.submit,'plandate', [start, end])
            });
            break;
          case 'fEditLesson':
            this.data.Form.form2 = this.data.Form.form2.map(item => {
              if(item.text==='考试科目'){
                item.data =  this.data.lesson || [];
              }
              return item;
            });
            this.formCfg.data = {
              submit: this.data.Submit.form2,
              form: this.data.Form.form2,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fEditList',
              editId: evt.data.id,
              lesson: this.data.lesson
            };
            const start1 = new Date(evt.data.startdate);
            const end1 = new Date(evt.data.enddate);
            this.formCfg.data.submit.scenedate = [start1,end1];
            this.formCfg.data.submit.subjectid = evt.data.subjectid;
            // start1.setTime(start1.getTime() - 3600 * 1000 * 24 * 30);
            this.formCfg.title = '修改';
            this.formCfg.dialogVisible = true;
            break;
          case 'fEditSubject':
            await this.$parent.getFindBookKc()
            await this.$parent.getAllPaperBySubject(evt.data.subjectid)
            let arrKm = this.$parent.kmList.filter(item => item.subjectid === evt.data.subjectid);
            if(!arrKm.length){
              this.$parent.kmList  = [...this.$parent.kmList,{...evt.data}];
            }
            this.data.Form.form2 = this.data.Form.form2.map(item => {
              if (item.name === 'subjectid') {
                item.data = this.$parent.kmList;
              }
              return item;
            });
            this.formCfg.data = {
              submit: this.data.Submit.form2,
              form: this.data.Form.form2,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fEditList'
            };
            for (const k in this.formCfg.data.submit) {
              if(k === 'paperid'){
                this.formCfg.data.submit[k] = parseInt(evt.data[k]);
              }else{
                this.formCfg.data.submit[k] = evt.data[k];
              }
            }
            this.formCfg.title = '修改';
            this.formCfg.dialogVisible = true;
            break;
          case 'fEdit':
            this.formCfg.data = {
              submit: this.data.Submit.form2,
              form: this.data.Form.form2,
              rules: this.data.Rules,
              url: this.data.Url,
              method: 'fEditList'
            };
            let checkListArr = [];
            if (evt.data.examSubjectBookVoList && evt.data.examSubjectBookVoList.length) {
              checkListArr = evt.data.examSubjectBookVoList.map(item => {
                return item.kcId;
              });
            }
            for (const k in this.formCfg.data.submit) {
              if(this.formCfg.data.submit[k].checkList){
                this.formCfg.data.submit[k].checkList = checkListArr || [];
              }else{
                this.formCfg.data.submit[k] = evt.data[k] + '';
              }
            }
            this.formCfg.title = '修改';
            this.formCfg.dialogVisible = true;
            break;
          case 'fDelete':
            // console.log('---表格删除---');
            this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('transferEvt', { method: 'fDeleteList', data: evt.data });
            });
            break;
          default:
            const param = {
              method: evt.method || '',
              data: evt.data || {}
            };
            if (evt.flag) {
              param.flag = evt.flag;
            }
            if (evt.sectionsId) {
              param.sectionsId = evt.sectionsId;
            }
            if (evt.editId) {
              param.editId = evt.editId;
            }
            evt.method ? this.$emit('transferEvt', param) : null;
        }
      },


      //表格查询
      fSearch() {
        // console.log('---表格查询---');
        this.isLoading = true;
        const temp = {};
        if (this.data.Grid.grid1.pagination) {
          // temp['current'] = this.data.Grid.grid1.data.current;
          temp['size'] = this.data.Grid.grid1.data.size;
        }
        for (const m in this.data.Submit.form1) {
          temp[m] = this.data.Submit.form1[m];
        }
        for (const k in temp) {
          if (temp[k] === '') {
            delete temp[k];
          }
        }
        this.$emit('transferEvt', { 'method': 'fSearch', 'data': temp });
      },

      //批量删除
      fDeleteByIds() {
        const data = this.data.Grid.grid1.checkedRows;
        // console.log(data);
        if (!data || !data.length) {
          return global.showMessage('请至少选择一条要操作的数据');
        }
        this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('transferEvt', { method: 'fDeleteList', data: data });
        });
      },




      //数据导入
      fImport(data,type='file') {
        if(data && !data.length){
          return global.showMessage('请选择文件后再进行导入操作');
        }
        if(type === 'zip'){
          this.$emit('transferEvt', { method: 'fImportZip', data: data });
        }else if(type === 'excel'){
          this.$emit('transferEvt', { method: 'fImportExcel', data: data });
        } else{
          this.$emit('transferEvt', { method: 'fImportFile', data: data });
        }
      },


      //导入模块下载
      async templateDownload() {
        const type1 = (this.data.Url.templateDownload || {}).type
        // console.log('type1 ==',type1)
        if(type1 === 'teacher'){
          window.location.href = global.fileBaseUrl + '/template/teacherImportExample.xlsx';
        }else if(type1 === 'student'){
          window.location.href = global.fileBaseUrl + '/template/studentImportExample.xlsx';
        }else if(type1 === 'subject'){
          window.location.href = global.fileBaseUrl + '/template/subjectImportExample.xlsx';
        }else if(type1 === 'question'){
          window.location.href = global.fileBaseUrl + '/template/questionImportExample.xlsx';
        }else if(type1 === 'planStudent'){
          window.location.href = global.fileBaseUrl + '/template/planStudentImportExample.xlsx';
        }else if(type1 === 'marking'){
          window.location.href = global.fileBaseUrl + '/template/markTeacherImportExample.xlsx';
        }
      },

      //esc
      fEsc() {
        this.data.Form.form1.forEach(item => {
          this.data.Submit.form1[item.name] = '';
        });
      },

      // 关闭弹框
      fFormCancel() {
        this.formCfg.dialogVisible = false;
      }

    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";

  .formGrid-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
    max-width: 100%;

    .toolbar-box {
      width: 100%;
      padding: 0 pxToRem(20);
    }

    .table-box {
      width: 100%;
      display: flex;
      padding: 0 pxToRem(20);
      position: relative;
      flex: 1;

      /*flex-direction: column;*/
      .my-tree-container{
        /*width: pxToRem(300);*/
        width: 300px;
        /*height: 100%;*/
        border: 1px solid #ccc;
        min-height: pxToRem(526);
        overflow-y: scroll;
        border-radius: 10px;
        padding: pxToRem(20);
        margin-bottom: 40px;
        margin-right: 10px;
        .my-tree-list-container{
          display: flex;
          flex-direction: column;
          color: #333;
          font-size: pxToRem(14);
          .desc{
            margin-bottom: 10px;
          }
          .list-container{
            overflow-y: scroll;
            flex: 1;
            display: flex;
            flex-direction: column;
            .item-container{
              cursor: pointer;
              line-height: 36px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .select-active{
              background-color: #edf4ff;
              color: $baseColor;
            }
          }
        }
      }
    }
    .tree-table-box{
      height: 200px;
    }
    .table-title-box{
      flex-direction: column;
    }

  }
  .no-data-container{
    display: flex;
    height: 100%;
    width: 100%;
    position: absolute;
    flex: 1;
    color: #666;
    font-size: pxToRem(18);
    align-items: center;
    justify-content: center;
  }
</style>
