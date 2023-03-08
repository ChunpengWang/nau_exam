<template>
  <div class="container">

    <div class="table-content">
      <el-table
        @sort-change="handleSortChange"
        style="border: 1px solid #ccc"
        ref="table"
        height="100%"
        :data="gridCfg.pagination ? gridCfg.data.records : gridCfg.data"
        v-loading="gridCfg.loading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.1)"
        highlight-current-row
        :border='gridCfg.border'
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :cell-class-name="cellClassName"
        @row-click="(row,columns,event)=>{ fRowClick(row,columns,event,gridCfg) }"
        @select-all="fCheckAll"
        @expand-change="fExpandRow"
        @selection-change="handleSelectionChange"
        :span-method="arraySpanMethod"
        :show-summary="gridCfg.isShowSummary"
        @select="selectMemoryFn"
        >
        <el-table-column
          type="selection"
          :selectable='checkboxT'
          width="48"
          v-if="gridCfg.checkable">
        </el-table-column>

        <el-table-column
          v-if="!gridCfg.objectSpanMethod"
          type="index"
          label="序号"
          width="50"
          align="center"
          :index="indexMethod">
        </el-table-column>

        <template v-for="item in gridCfg.columns">
          <el-table-column
            v-if="item.type==='state'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width">
            <template slot-scope="scope">  <!-- user.state -->
              <span :class="'state'+scope.row[item.field]" :title="scope.row[item.field]=='1'?item.msg.fail:item.msg.success"></span>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.type==='img'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width">
            <template slot-scope="scope">
              <viewer :images="[imgUrl+scope.row[item.field]]">
                <img v-if="scope.row[item.field]" class="grid_img" :src="imgUrl+scope.row[item.field]" alt=""
                     height="60px">
              </viewer>
            </template>
          </el-table-column>


          <el-table-column
            v-else-if="item.type==='editable'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row[item.field]" class="edit-input" size="mini" :style='{width:item.inputWidth}'/>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.type==='rate'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">
              <el-rate disabled v-model="scope.row[item.field]"></el-rate>
            </template>
          </el-table-column>


          <el-table-column
            v-else-if="item.type==='button'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">
              <span v-if="scope.row[item.field]">{{scope.row[item.field]}}</span>
              <el-button size="mini" v-else @click="fBtnEvt({'method':item.info[1],'data':scope.row})" >{{item.info[0]}}</el-button>
            </template>
          </el-table-column>
          <!-- 一条数据多行显示 -->
          <el-table-column
            v-else-if="item.type==='creatRows'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">
              <div class="rowList" v-for="(m,index) in scope.row[item.field]" :key="index">
                <div v-if="item.info.type==='time'">
                  <div class="cell" v-if="item.info['cellFiled'].indexOf(',')!==-1">
                    {{  timeFormat(m[item.info['cellFiled'].split(',')[0]])  }} ~ {{  timeFormat(m[item.info['cellFiled'].split(',')[1]])  }}
                  </div>
                </div>
                <div class="cell" v-if="item.info.type==='list'" >
                  {{ fGetCellList( m[item.info['itemsList']], item.info['cellField'] , item.info['character']  ) }}
                </div>
                <div class="cell" v-if="item.info.type==='normal'">{{  m[item.info['cellFiled']] }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.type==='arrList'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
          >
            <template slot="header" slot-scope="scope" v-show="item.customHeader">
              <span>{{item.title}}</span>
              <el-tooltip class="item" effect="dark" :content="item.headerDesc" placement="top">
                <span v-if="item.headerDesc" class="el-icon-question" style="margin-left: 5px;font-size: 16px;cursor: pointer" ></span>
              </el-tooltip>
            </template>

            <template slot-scope="scope">

              <div class="" v-if="item.isArray">
                <div :style="{textAlign: 'center',width:'100%',...item.style}">
                    <div>
                      <span >{{ scope.row[item.field][0][0].text }}</span>
                    </div>
                  <div style="display: flex;flex-direction: column;">
                    <span :style="ele.style" v-for="ele in scope.row[item.field][1]">{{ ele.text }}</span>
                  </div>

                </div>
              </div>



              <div class="rowList" v-for="(m,index) in scope.row[item.field]" :key="index" v-else>
                <div :style="{textAlign: 'center',width:'100%',...item.style}">
                  <span :style="m.style" @click="m.isClick ? fBtnEvt({'method':'fShowPicture','data':scope.row}) : null">{{ m.text }}</span>
                </div>

              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.type==='table'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="false"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
            :class-name="item.className"
          >
            <template slot-scope="scope">
              <div class="tabList" :class="{'one':scope.row[item.field].length === 1}">
                <span v-for="(m,index) in scope.row[item.field]" :key="index">{{m.bz}}</span>
              </div>
            </template>
          </el-table-column>


          <el-table-column
            v-else-if="item.type==='openDialog'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" v-for="oItem in item.btns" :key="oItem.text" @click="fBtnEvt({'method':oItem.method,'data':scope.row})">{{oItem.text}}</el-button>
            </template>
          </el-table-column>


          <el-table-column
            v-else-if="item.type==='openDetail'"
            :prop="item.field"
            :label="item.title"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">

              <div class="" style="display: flex;flex-direction: row; align-items: center;justify-content: center">
                <el-button size="mini" type="text" @click="fBtnEvt({'method':'fOpenDetail','data':scope.row})">
                  <span v-html="scope.row[item.field]"></span>
                </el-button>

              </div>

            </template>
          </el-table-column>


          <el-table-column
            v-else-if="item.type==='status'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :sort-method="item.sortMethod"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">
              <div v-if="item.flag ==='question'">
                <i
                  :class="scope.row[item.field]===2 ?'el-icon-success':(scope.row[item.field]===3 ?' el-icon-circle-close' : (scope.row[item.field]===4 ? 'el-icon-delete' : 'el-icon-remove') )"
                  :style="scope.row[item.field]===2 ?'color:#33c58f':(scope.row[item.field]===3 ?' color:red' :'color:#ccc')"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] === 1 ? '未发布' : (scope.row[item.field] === 2 ? '已发布' : (scope.row[item.field] === 3 ? '已禁用' : '已废弃')) }}</span>
              </div>
              <div v-else-if="item.flag ==='paper'">
                <i
                  :class="scope.row[item.field]===2 ?'el-icon-success': 'el-icon-remove'"
                  :style="scope.row[item.field]===2?'color:#33c58f':'color:#ccc'"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] === 2 ? '已发布' : (scope.row[item.field] === 1 ? '未发布':'正在发布中') }}</span>
              </div>
              <div v-else-if="item.flag ==='score'">
                <i
                  :class="scope.row[item.field]==2 ?'el-icon-success': 'el-icon-remove'"
                  :style="scope.row[item.field]==2?'color:#33c58f':'color:#ccc'"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] == 2 ? '已发布' : '未发布' }}</span>
              </div>
              <div v-else-if="item.flag ==='scoreSend'">
                <i
                  :class="scope.row[item.field]==1 ?'el-icon-success': (scope.row[item.field]== 2 ? 'el-icon-error' : 'el-icon-remove')"
                  :style="scope.row[item.field]==1?'color:#33c58f':(scope.row[item.field]== 2 ? 'color:#f2637b' : 'color:#ccc')"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] == 1 ? '及格' : (scope.row[item.field]== 2 ? '不及格' : '未阅卷') }}</span>
              </div>

              <div v-else-if="item.flag ==='examinationRecord'">
                <i
                  :class="scope.row[item.field]===2 ?'el-icon-success': (scope.row[item.field]=== 3 ? 'el-icon-error' : 'el-icon-remove')"
                  :style="scope.row[item.field]===2?'color:#33c58f':(scope.row[item.field]=== 3 ? 'color:#f2637b' : 'color:#ccc')"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] === 2 ? '及格' : (scope.row[item.field]=== 3 ? '不及格' : '未开始/正在考试') }}</span>
              </div>

              <div v-else-if="item.flag ==='tactics'">
                <i
                  :class="scope.row[item.field]===1 ?'el-icon-success': 'el-icon-circle-close'"
                  :style="scope.row[item.field]===1?'color:#33c58f':'color:red'"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] === 1 ? '已启用' : '已停用' }}</span>
              </div>

              <div v-else-if="item.flag ==='signInDetail'">
                <i
                  :class="scope.row[item.field]?'el-icon-success': 'el-icon-remove'"
                  :style="scope.row[item.field]?'color:#33c58f':'color:#ccc'"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] ? '已签到' : '未签到' }}</span>
              </div>
              <div v-else-if="item.flag ==='registerAudit'">
                <i
                  :class="scope.row[item.field] === 3?'el-icon-success': 'el-icon-circle-close'"
                  :style="scope.row[item.field]===3?'color:#33c58f':'color:red'"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field]===3 ? '已通过' : '已驳回' }}</span>
              </div>

              <div v-else-if="item.flag ==='checkAfterExamination'">
                <i
                  :class="scope.row[item.field]?'el-icon-success': 'el-icon-remove'"
                  :style="scope.row[item.field]?'color:#33c58f':'color:#ccc'"></i>
                <span style="margin-left: 10px">{{ scope.row[item.field] ? '已确认' : '未确认' }}</span>
              </div>



              <div v-else>
                <span>{{scope.row[item.field] }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.type==='switch'"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :sort-method="item.sortMethod"
            :align="item.align"
            :width="item.width"
          >
            <template slot-scope="scope">
              <el-switch
                @change="fBtnEvt({'method':'fSwitch','data':scope.row})"
                class="switch"
                style="margin-right: 5px"
                v-model="scope.row[item.field]"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="停用">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.type==='render'"
            :render-header="renderHeader"
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :sort-method="item.sortMethod"
            :align="item.align"
            :width="item.width">
            <template slot-scope="scope">
              <div >
                <span>{{scope.row[item.field] }}</span>
              </div>
            </template>

          </el-table-column>

          <el-table-column
            v-else-if="item.type==='hover'"
            :prop="item.field"
            :label="item.title"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="right">
                <p v-for="item in gridCfg.hoverData">{{item.kskmmc}} {{ item.sl }}</p>
                <div slot="reference" class="name-wrapper" @mouseenter="enter(scope.row)">
                  {{scope.row[item.field]}}
                </div>
              </el-popover>
            </template>
          </el-table-column>

          <el-table-column
            v-else-if="item.type==='btn'"
            :prop="item.field"
            :label="item.title"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :align="item.align"
            :width="item.width">
            <template slot-scope="scope">
              <div class="" style="display:flex; flex-direction: row;justify-content: center;align-items: center">
                <span style="margin-right: 10px"> {{scope.row[item.field]}}</span>
                <el-button icon="el-icon-plus"  @click="fBtnEvt({'method':item.addmethod,'data':scope.row})" class="change-task-btn"></el-button>
                <el-button icon="el-icon-minus"  @click="fBtnEvt({'method':item.reducemethod,'data':scope.row})" class="change-task-btn"></el-button>
              </div>
            </template>
          </el-table-column>


          <el-table-column
            v-else
            :prop="item.field"
            :label="item.title"
            :show-overflow-tooltip="true"
            :formatter="item.formatter"
            :key="item.title"
            :sortable="item.sortable"
            :sort-method="item.sortMethod"
            :align="item.align"
            :width="item.width">
            <template slot="header" slot-scope="scope" v-show="item.customHeader">
              <span>{{item.title}}</span>
              <el-tooltip class="item" effect="dark" :content="item.headerDesc" placement="top">
                <span v-if="item.headerDesc" class="el-icon-question" style="margin-left: 5px;font-size: 16px;cursor: pointer" ></span>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          v-if="gridCfg.editable"
          label="操作"
          width="50"
          align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='fEdit(scope.row)'>编辑</el-button>
          </template>
        </el-table-column>

        <el-table-column
          v-if="gridCfg.controller"
          :label="gridCfg.controller.title"
          :width="gridCfg.controller.width"
          align="center">
          <template slot-scope="scope">
            <div v-if="gridCfg.controller.type === 'score'">
              <div v-show="scope.row[gridCfg.controller.field] === 2">
                <el-button v-for="(item,index) in gridCfg.controller.btns1" :key="index" size="mini" type="text" :icon="item.icon" @click="fBtnEvt({'method':item.method,'data':scope.row})">{{item.text}}</el-button>
              </div>
              <div v-show="scope.row[gridCfg.controller.field] !== 2">
                <el-button v-for="(item,index) in gridCfg.controller.btns" :key="index" size="mini" type="text" :icon="item.icon" @click="fBtnEvt({'method':item.method,'data':scope.row})">{{item.text}}</el-button>
              </div>
            </div>
            <div v-else>
              <template v-if="!gridCfg.controller.isHideBtn || (gridCfg.controller.isHideBtn && scope.row[gridCfg.controller.hideBtnField] != gridCfg.controller.hideBtnValue)">
                <el-switch
                    v-if="gridCfg.controller.hasSwitch"
                    @change="fBtnEvt({'method':'fSwitch','data':scope.row})"
                    class="switch"
                    style="margin-right: 5px"
                    v-model="scope.row[gridCfg.controller.switchField]"
                    :active-value="'0'"
                    :inactive-value="'1'"
                    active-text="启用"
                    inactive-text="停用">
                </el-switch>
                <el-button v-for="(item,index) in gridCfg.controller.btns" :key="index" size="mini" type="text"
                           :icon="item.icon" @click="fBtnEvt({'method':item.method,'data':scope.row})">{{ item.text }}
                </el-button>
              </template>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="table-foot" v-if="gridCfg.pagination">
      <el-pagination background
                     size='mini'
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="gridCfg.data.current"
                     :page-sizes="[10,20,30,40]"
                     :page-size="gridCfg.data.size"
                     :pagerCount="5"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="gridCfg.data.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import global from '@/utils/global';
  export default {
    props: ['gridCfg'],
    data() {
      return {
        baseURL: window.baseURL,
        sortType:1,
        getRowKeys(row){
          return row.id
        },
        expands:[],
        imgUrl:global.fileBaseUrl,
        switchValue:false,
        selectedRow: []
      }
    },
    mounted(){},
    created(){
      this.renderHeaderClick()
    },
    methods: {


      //复选框
      checkboxT(row, rowIndex) {
        if (this.gridCfg.hasForbidden) {
          // console.log('row = ', row);
          if(row.username == '超级管理员'){
            return false;//禁用
          } else {
            return true;//不禁用
          }
        }
        return true
      },

      cellClassName({ row, column, rowIndex, columnIndex }){
        if(this.gridCfg.hoverFlag && column.property === 'rwl') {
          return 'hoverClass'
        }
      },
      timeFormat(num){
        return moment(num).format('MM-DD HH:mm')
      },
      indexMethod(index) {
        return index + 1
      },
      // 设置分页记忆二位数组方法
      selectMemoryFn (selection, row) {
        if(this.gridCfg.selectRemember) {
          // 因为翻页点选后selection会出现为undefined的元素，需要进行是否存在判断
          if (selection && selection.find(item => item && (item.kssfz === row.kssfz))) {
            // 选中新增一行
            this.addRows([row])
          } else {
            // 取消删除一行
            this.removeRows([row])
          }
        }
      },
      handleSelectionChange(val) {
        if(this.gridCfg.selectRemember){
          this.gridCfg.checkedRowsRemember = this.selectedRow;
        }
        this.gridCfg.checkedRows = val
      },
      fCheckAll(val) {
        if(this.gridCfg.selectRemember){
          if (val.length > 1) {
            this.addRows(this.gridCfg.data.records)
          } else {
            this.removeRows(this.gridCfg.data.records)
          }
          this.gridCfg.checkedRowsRemember = this.selectedRow;
        }
        this.gridCfg.checkedRows = val
      },
      handleSizeChange(val) {
        if(this.gridCfg.pagination){
          this.$emit('transferEvt', {'method':'fSizePage','data':{current:this.gridCfg.data.current,size:val}})
        }
      },
      handleCurrentChange(val) {
        if(this.gridCfg.pagination){
          this.$emit('transferEvt', {'method':'fCurrentPage','data':{current:val,size:this.gridCfg.data.size}})
        }
      },

      // 选中table已有数据
      toggleSelection (rows) {
        if (rows && rows.length) {
          rows.forEach(row => {
            this.$nextTick(() => {
              const checked = this.gridCfg.data.records.find(tableRow => tableRow.kssfz === row.kssfz);
              checked ? this.$refs.table.toggleRowSelection(checked) : null;
            })
          })
        } else {
          this.$refs.table.clearSelection()
        }
      },

      // 添加选中行
      addRows (rows) {
        for (const item of rows) {
          // 如果选中的数据中没有这条就添加进去
          if (!this.selectedRow.find(i => i.kssfz === item.kssfz)) {
            this.selectedRow.push(item)
          }
        }
      },

      // 取消选中行
      removeRows (rows) {
        if (this.selectedRow && this.selectedRow.length) {
          for (const item of rows) {
            this.selectedRow = this.selectedRow.filter(i => i.kssfz !== item.kssfz)
          }
        }
      },

      fEdit(data) {
        //   this.$emit('gridEdit', data)
        this.$emit('transferEvt', {'method':'fEdit','data':data})
      },
      fDolayout() {
        this.$refs.table.doLayout()
      },
      fExpandRow(row,expanded,c){
        if(expanded.length){
          this.expands=[row.id]
        }
        this.$emit('transferEvt', {'method':'fOpenRow','data':row})
      },
      fExpandToggle(row){
        this.$refs['table'].toggleRowExpansion(row)
      },
      fBtnEvt(evt){
        this.$emit('transferEvt',{'method':evt.method,'data':evt.data})
      },
      fGetCellList(arr,name,character){
        let temp = []
        arr.forEach(item=>{
          temp.push(item[name])
        })
        return temp.join(character)
      },
      fCreateCell(item,str){
        if(str.indexOf('+')!=-1){
          return item[str.split('+')[0]] + '---' + item[str.split('+')[1]]
        }else{
          return item[str]
        }
      },
      fRowClick(row,b,c,gridCfg){
        if(gridCfg.rowClick){
          this.$emit('transferEvt',{'method':'fRowClick','data':row})
        }
      },
      // 合并行或列的计算方法
      arraySpanMethod({ row, column, rowIndex, columnIndex }){
        // console.log('row = ', row);
        // console.log('column = ', column);
        // console.log('rowIndex = ', rowIndex);
        // console.log('columnIndex = ', columnIndex);
        // if (row.mergeFlag) {
        //   if (columnIndex !== 5) {
        //     if (rowIndex % 2 === 0) {
        //       return {
        //         rowspan: 2,
        //         colspan: 1
        //       };
        //     } else {
        //       return {
        //         rowspan: 0,
        //         colspan: 0
        //       };
        //     }
        //   }
        // }
      },
      // 监听整体数据排序
      handleSortChange(event){
        // console.log('handleSortChange event = ',event);
        const sortType = event.order === 'ascending' ? 'asc' : 'desc';
        const prop = event.prop || '';
        if(this.gridCfg.sortChange){
          this.$emit('transferEvt', {'method':'fSortChange','data':{sortType,prop}})
        }
      },

      //鼠标进入
      enter(item){
        this.$emit('transferEvt', { method: 'fHover', data: item })
      },

      //自定义表头
      renderHeader(h, { column }) { // h即为cerateElement的简写，具体可看vue官方文档
        return h(
          'div',
          [
            h('span', {
              class:'renderHeader'
            },column.label),
            h('i', {
              class: 'el-icon-question renderHeader',
              style: 'color:#409eff;margin-left:5px;'
            })
          ],
        );
      },

      //
      renderHeaderClick(){
        this.$nextTick(() => {
          $('.renderHeader').each((index,item) => {
              $(item).click(()=>{
                this.$emit('transferEvt', { method: 'fClick', data: {} })
              })
          })
        });

      }



  }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .container {
    width: 100%;
    height:100%;
    position: relative;
    .table-content {
      width:100%;
      position: absolute;
      top: 0;
      bottom: 40px;
      .el-table .el-table__header-wrapper .el-table__header .has-gutter th {
        background-color: #edf1f1;
        .cell { padding: 6px 0 6px 14px; }
      }
      .el-table .el-table__fixed .el-table__header thead th{
        background-color: #edf1f1;
        .cell {
          padding-top:6px;
          padding-bottom:6px;
        }
      }
      .el-table__fixed-right .el-table__fixed-header-wrapper .el-table__header th {
        background-color: #edf1f1;
        .cell {
          padding-top:6px;
          padding-bottom:6px;
        }
      }
      .el-table--mini td, .el-table--mini th {
        padding:3px 0;
      }
      .el-button--small, .el-button--small.is-round {
        padding: 3px 0;
      }
      .rowList {
        .cell {
          height: 32px;
          line-height: 32px;
        }
      }
      .tabList{
        display: flex;
        flex: 1;
        flex-direction: column;
        > span{
          flex: 1;
          line-height: 45px;
          border-bottom: 1px solid #EBEEF5;
        }
        > span:last-child{
          border-bottom: none;
        }
      }
      .one{
        > span{
          border:none;
        }
      }
      .change-task-btn{
        width: 30px;
        display: flex;
        padding: 0;
        justify-content: center;
        align-items: center;
        height: 30px;
        border-color: $baseColor;
        color: $baseColor;
      }
    }
    .table-foot {
      width:100%;
      position: absolute;
      bottom:3px;
      text-align: right;
    }
    .el-table__expand-column .cell
    {
      display: none;
    }
  }
  .state1 {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #ccc;
    position: relative;
    top: 4px;
  }
  .state0 {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #66b1ff;
    position: relative;
    top: 4px;
  }
  .grid_img {
    vertical-align: middle;
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

  .tabRowContent{
    display: flex;
    flex-direction: column;
    .desc{
      min-width: 80px;
    }
    .get-info{
      margin-bottom: 20px;
    }
    .picture-info{
      display: flex;
      flex-direction: row;
      .picture-table{
       flex: 1;
        display: flex;
        flex-direction: column;
        .table-container {
          margin-bottom: 40px;
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          flex: 1;
          .table-item {
            display: grid;
            height: 50px;
            grid-template-columns: repeat(auto-fill, 10%);
            .item-container{
              border-right: 1px solid #ccc;
              border-top: 1px solid #ccc;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              img{
                width: 90px;
                max-width: 100%;
                max-height: 100%;
                height: 90px;
              }
            }
          }
          .table-item:nth-of-type(1){
            height: 120px;
          }
        }
      }
    }
  }

  .inspection-expand-container{
    display: flex;
    flex-direction: row;
    >div{
      display: flex;
      flex: 1;
      width: 20%;
      flex-direction: column;
      margin-right: pxToRem(20);
      border-right: 1px solid #ccc;
      >span{
        font-size: pxToRem(15);
        margin-bottom: 5px;
        .desc{
          min-width: 150px;
          text-align: right;
          display: inline-block;
        }
      }
    }
    >div:nth-of-type(5){
      border-right: none;
      margin-right: 0;
    }
    .student-info-container{
      flex-direction: row;
      justify-content: flex-end;
      .student_img{
        margin: 0 20px;
        //height: 100px;
        width: 100px;
      }
    }

  }

</style>
