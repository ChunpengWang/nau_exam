<template>
  <div class="container">
    <!-- 搜索框 功能按钮 -->
    <el-form :inline="true" :model="submit" class="toolbar" @keyup.Enter.native="fBtnEvt('fSearch')" @keyup.Esc.native="fBtnEvt('fEsc')">
      <template v-for='item in form'>
        <el-form-item :label='item.flag === "score" ? item.text :item.text+":"' :key="item.name" :class=" item.flag === 'score' ? 'score-item' : ''">
          <template v-if='item.type=="text"'>
            <el-input :style="{width:item.width}" v-model='submit[item.name]' size="mini" :placeholder="item.placeholder ? item.placeholder : `请输入${item.text}` " :disabled="item.disabled"></el-input>
          </template>
          <template v-if='item.type=="combox"'>
            <el-select :clearable="!item.noClearable" filterable :style="{width:item.width}" v-model="submit[item.name]" size="mini" @change="fChange(item,$event)" placeholder='请选择'>
              <template v-for='k in item.data'>
                <el-option :label='k[item.label]' :value='k[item.value]' :key="k.id"></el-option>
              </template>
            </el-select>
          </template>
          <template v-if='item.type=="comboxTree"'>
            <el-select v-model="submit[item.name]" placeholder="请选择" :style="{width:item.width}" size="mini">
              <el-option :value="mineStatusValue" style="height: auto">
                <el-tree
                  ref="myTree"
                  :data="item.treeData"
                  node-key="id"
                  :props="item.defaultProps"
                  show-checkbox
                  :highlight-current="true"
                  @check="handleCheck">
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                        <el-tooltip class="item" effect="dark" :content="node.label" placement="top-start">
                          <span> {{ node.label }} </span>
                        </el-tooltip>
                  </span>
                </el-tree>
              </el-option>
            </el-select>
          </template>
          <template v-if="item.type=='daterange'">
            <el-date-picker :style="{width:item.width}" size="mini" v-model="submit[item.name]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </template>
          <template v-if="item.type=='date'">
            <el-date-picker :style="{width:item.width}" size="mini" v-model="submit[item.name]" type="date" placeholder="请选择日期">
            </el-date-picker>
          </template>
        </el-form-item>
      </template>

      <template v-for="item in btns">
        <el-form-item class="search-container" v-if="item.type ==='search'">
          <el-button :key="item.name" type="primary" size="mini" :disabled="item.disabled" :icon="item.icon"
                     @click='fBtnEvt(item.event)' :title="item.name">{{item.name}}
          </el-button>
        </el-form-item>

        <el-form-item v-if="item.type ==='back'">
          <el-button :key="item.name" size="mini" :disabled="item.disabled" :icon="item.icon"
                     @click='fBtnEvt(item.event)' :title="item.name">{{item.name}}
          </el-button>
        </el-form-item>

        <el-form-item class="export-container" v-if="item.type ==='export'">
          <el-button :key="item.name" size="mini" :disabled="item.disabled" :icon="item.icon"
                     @click='fBtnEvt(item.event)' :title="item.name">{{item.name}}
          </el-button>
        </el-form-item>
        <div class="my-upload-container" v-if="item.type ==='import'">
          <span class="my-upload-title">{{item.name}}:</span>
          <div class="my-upload-content">
            <el-upload
              class="upload-demo my-upload-demo"
              ref="upload"
              action=""
              :on-change="handleChange"
              :file-list="fileList"
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="mini">选取文件</el-button>
            </el-upload>
            <span class="file-name-container">{{fileName}}</span>
          </div>
          <el-button :class="item.flag === 'student' ? 'student-btn-style leading-in-btn' : 'leading-in-btn'" size="mini" :icon="item.icon" type="primary" @click="fBtnEvt({'method':item.event,'data':fileList})">导入
          </el-button>
          <el-button size="mini" @click="fBtnEvt('templateDownload')" class="template-download" icon="">{{ '导入模板下载'}}</el-button>
        </div>

        <div class="my-upload-container" v-if="item.type ==='importZip'">
          <span class="my-upload-title">{{item.name}}:</span>
          <div class="my-upload-content">
            <el-upload
              class="upload-demo my-upload-demo"
              ref="upload"
              action=""
              :on-change="handleChange1"
              :file-list="fileList1"
              :show-file-list="false"
              :auto-upload="false">
              <el-button slot="trigger" size="mini">选取压缩包</el-button>
            </el-upload>
            <span class="file-name-container">{{fileName1}}</span>
          </div>
          <el-button size="mini" :icon="item.icon" type="primary" @click="fBtnEvt({'method':item.event,'data':fileList1})" class="leading-in-btn">导入
          </el-button>
          <el-button size="mini" type="text" class="template-download" style="border-color:transparent;">必须为.zip后缀文件，照片命名为{{item.typeName}}的身份证号，照片格式后缀固定为.jpg</el-button>
        </div>
      </template>

      <div v-if="explain && explain.content" :style="{color: 'red',marginBottom:'8px',...explain.style}">{{explain.content}}
        <el-tooltip class="item" effect="dark" :content="explain.desc" placement="right">
          <span v-if="explain.desc" class="el-icon-question" style="margin-left: 5px;font-size: 16px;cursor: pointer" ></span>
        </el-tooltip>
      </div>
      <div class="my-btn-container">
        <template v-for="item in btns" v-if="item.type !== 'back' && item.type !== 'search' && item.type !== 'export' && item.type !== 'import' && item.type !== 'importExcel'  && item.type !== 'importZip'">

          <el-dropdown class="moreBtn" size="mini" :key="item.name" v-if="item.type==='more'" @command="handleCommand">
            <el-button size="mini">
              {{item.name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="cell in item.children" :command="cell.event" :key="cell.name">{{cell.name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button v-else-if="item.btnMark" v-has="fReturnStr(item.btnMark)" :key="item.name"
                     size="mini" :disabled="item.disabled" :icon="item.icon" @click='fBtnEvt(item.event)'
                     :title="item.name">{{item.name}}
          </el-button>

          <el-button v-else :class="{'right-btn':item.rightFlag}" :key="item.name" :type="item.type==='add'?'primary':(item.type==='text'?'text':'')" size="mini"
                     :disabled="item.disabled" :icon="item.icon"
            @click='fBtnEvt(item.type==="add"?item:item.event)' :title="item.name">
            {{item.name}}{{item.value ? ' '+item.value:''}}
          </el-button>


        </template>
      </div>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: '',
    props: ['submit', 'form', 'btns','explain'],
    data() {
      return {
        fileList: [],
        fileName:'未选择任何文件',
        fileList1: [],
        fileName1:'未选择任何文件',
        fileExcelList: [],
        fileExcelName:'未选择任何文件',
        fileCertificateList: [],
        fileCertificateName:'未选择任何文件',

        mineStatusValue:'',
        openedIds: [],
        treeKey: '',
        currentNode: null,
        //树的配置
        treeProp: {
          children: 'childList',
          label: 'name',
          isLeaf: 'isLeaf'
        },
        selectOrg: {
          orgsid: []
        },
        defaultCheckList:[],
        index:0

      }
    },
    mounted(){},
    created(){

    },
    methods:{

      nodeSelected(data) {
        this.currentNode = data;
      },
      treeExpand(data) {
        this.openedIds.push(data.id);
      },
      treeCollapse(data) {
        const index = this.openedIds.indexOf(data.id);
        if (index > -1) {
          this.openedIds.splice(index, 1);
        }
      },

      handleCheckChange(data, checked, indeterminate) {
        // 获取当前选择的id在数组中的索引
        const indexs = this.selectOrg.orgsid.indexOf(data.id);
        // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
        if (indexs < 0 && this.selectOrg.orgsid.length === 1 && checked) {
          // console.log('only one')
          // this.$message({
          //   message: '只能选择一个区域！',
          //   type: 'error',
          //   showClose: true
          // });
          // 设置已选择的节点为false 很重要
          // this.$refs.myTree[0].setChecked(data, false);
          this.defaultCheckList = [];
          this.$refs.myTree[0].setCheckedKeys([]);
          this.$refs.myTree[0].setChecked(data, true);
          this.selectOrg.orgsid = [];
          this.selectOrg.orgsid.push(data.id);
        } else if (this.selectOrg.orgsid.length === 0 && checked) {
          // 发现数组为空 并且是已选择
          // 防止数组有值，首先清空，再push
          this.selectOrg.orgsid = [];
          this.selectOrg.orgsid.push(data.id);
        } else if (
          indexs >= 0 &&
          this.selectOrg.orgsid.length === 1 &&
          !checked
        ) {
          // 再次直接进行赋值为空操作
          this.selectOrg.orgsid = [];
        }

      },

      handleCheck(data,checkData){
        // console.log('当复选框被点击的时候触发')
        this.$emit('transferEvt', { method: 'fCheckTreeData', data: checkData.checkedNodes });
      },
      handleChange(file) {
        // console.log('handleChange = ',file);
        this.fileName = file.name;
        this.fileList = [file]
      },
      handleChangeExcel(file) {
        this.fileExcelName = file.name;
        this.fileExcelList = [file];
      },
      handleChangeCertificate(file) {
        this.fileCertificateName = file.name;
        this.fileCertificateList = [file];
      },
      handleChange1(file) {
        // console.log('handleChange = ',file);
        this.fileName1 = file.name;
        this.fileList1 = [file]
      },
      fReturnStr(str) {
        return this.$route.name+'_'+str
      },
      fBtnEvt(evt) {
        this.$emit('transferEvt', evt)
      },
      handleCommand(msg) {
        this.$emit('transferEvt', msg)
      },
      fChange(row, evt) {
        if (row['change']) {
          this.$emit('transferEvt', { method: row['change'], data: evt })
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .container {
    min-height: 44px;
    .toolbar {
      .el-form-item{
        margin-bottom: 0 !important;
        line-height: 44px;
        /*.el-form-item__content{*/
        /*}*/
      }
      .search-container{
        margin-left: pxToRem(108);
      }

      .my-upload-container{
        height: 44px;
        border-top: 0.55px solid #ccc;
        display: flex;
        align-items: center;
        position: relative;
        .my-upload-title{
          font-size: 14px;
          color: #606266;
          font-weight: 700;
          padding-right: 12px;
        }
        .my-upload-content{
          display: flex;
          align-items: center;
          min-width: 150px;
        }
        .my-upload-demo{}
        .file-name-container{
          margin-left: pxToRem(30);
          color:#666;
        }
        .leading-in-btn{
          margin-left: 10px;
        }
        .student-btn-style{
          margin-left: 55px;
        }
        .template-download{
          position: absolute;
          right: 0;
          color: #409EFF;
          /*border-color: #c6e2ff;*/
          /*background-color: #ecf5ff;*/
          border-color: #ccc;
        }
        /*border-bottom: 0.55px solid #ccc;*/
        .student-question-style{
          margin-left: 5px;
          color: #fd9001;
          font-size: 18px;
          cursor: pointer;
        }
        .student-certificate-container{
          display: flex;
          flex: 1;
          align-items: center;
          margin-left: 60px;
        }
      }

      .my-btn-container{
        border-top: 0.55px solid #ccc;
        line-height: 44px;
        .right-btn{
          float: right;
          margin-top: 7px;
          /*
          color: $baseColor;
          border-color: $baseColor;
           */
        }
      }

      .moreBtn {
        margin: 0 10px;
      }
    }
  }


</style>
