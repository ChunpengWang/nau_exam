<template>
    <div>
      <el-form class="my-validate-form" :model="formCfg.submit" :rules="formCfg.rules" ref="form" label-position="right" label-width="120px" style='text-align: center' @keyup.Enter.native="fSubmit">
        <div style="line-height: 44px;color:#f2637b;padding-left: 100px" v-if="formCfg.type ==='scoreSend'">成绩发布后及格状态不可修改 ！</div>
          <el-form-item v-for="item in formCfg.form" v-show="!item.hide" :key="item.text" :label="item.text" :prop="item.name" :class="item.noLabel?'no-label':''">
              <el-input size="mini" v-if="item.type=='text'" :placeholder="item.placeholder" v-model="formCfg.submit[item.name]" :disabled="item.noEditable" :style="{width:item.width}" :readonly="item.readonly" :class="item.noBorder?'no-border':''"></el-input>
               <el-input size="mini" :min="item.numMin || null" v-if="item.type=='number'" type="number"  @change="item.changeEvt?fBtnEvt(item.changeEvt,$event):null"
                         :placeholder="item.placeholder" v-model="formCfg.submit[item.name]" :disabled="item.noEditable" :style="{width:item.width}"></el-input>
              <div v-if="item.type=='custom'">
                  <el-input size="mini" v-model="formCfg.submit[item.name]" :disabled="item.noEditable" :style="{width:item.width}"></el-input>
                  <el-button size="mini" icon="el-icon-document" class="open-detail" @click="fBtnEvt('fOpenDetail')"></el-button>
              </div>
              <el-input size="mini" v-if="item.type=='textarea'" :placeholder="item.placeholder" type="textarea" v-model="formCfg.submit[item.name]" :disabled="item.noEditable" :style="{width:item.width}"></el-input>
              <el-input size="mini" v-if="item.type=='password'" type="password" v-model="formCfg.submit[item.name]" :style="{width:item.width}"></el-input>
              <el-select size="mini" v-if="item.type=='combox'"
              filterable
              clearable
              @change="item.changeEvt?handleSelectChange(item.changeEvt,$event):null"
              v-model="formCfg.submit[item.name]"
              placeholder="请选择"
              :multiple="item.multiple"
              :style="{width:item.width}">
                  <el-option v-for="k in item.data" :key="k.name" :label="k[item.label]" :value="k[item.value]"></el-option>
              </el-select>
            <el-switch
              v-if="item.type=='switch'"
              @change="item.changeEvt?handleSwitch(item.changeEvt,$event):null"
              v-model="formCfg.submit[item.name]"
              style="float:left"></el-switch>

              <el-checkbox v-if="item.type=='checkbox'" v-model="formCfg.submit[item.name]['checked']"></el-checkbox>
              <template v-if="item.type=='daterange'">
                <el-date-picker :style="{width:item.width}" size="mini" v-model="formCfg.submit[item.name]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </template>
            <template v-if="item.type=='datetimerange'">
              <el-date-picker :style="{width:item.width}" size="mini" v-model="formCfg.submit[item.name]" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </template>
              <el-radio-group v-if="item.type==='radio'" v-model="formCfg.submit[item.name]['checked']" fill="#ccc" @change="fSelectParent(formCfg.submit[item.name],item)">
                <el-radio v-for="v in item.data" :key="v.code" :label="v.text" border></el-radio>
              </el-radio-group>

            <el-checkbox-group  v-if="item.type==='checkboxGroup'" v-model="formCfg.submit[item.name]['checkList']" >
              <el-checkbox v-for="v in item.data" :key="v.id" :label="v.id" >{{v.content}}</el-checkbox>
            </el-checkbox-group>
            <span v-if="item.isSuffix" style="margin-left: 6px">{{item.suffixContent}}</span>
          </el-form-item>

        <el-form-item v-for="item in selectBoxList" :key="item.id">
          <el-select v-model="item.value" placeholder="请选择" size="mini"  style="width: 290px">
            <el-option
              v-for="element in item.data"
              :key="element.id"
              :label="element.kskmmc"
              :value="element.id">
            </el-option>
          </el-select>
          <i class="el-icon-remove-outline my-el-form-icon" style="margin-left: 10px; cursor: pointer"  @click="removeFormItem(item)"></i>
        </el-form-item>

        <el-form-item v-if="formCfg.type === 'addPlan' && addPlanFlag" label="监考阈值" >
         <div class="addPlan-container">
           <div class="photo-item item">
             <div class="item-container">
               <span class="item-desc">抓拍识别成功率：</span>
               <span><</span>
               <el-input size="mini" style="width: 70px" v-model="addPlanForm.zptgl" placeholder="80" type="number" @change="detailQuantity($event,'zptgl')"></el-input>
               <span>%</span>
               <el-tooltip effect="dark" content="抓拍识别成功率=考中抓怕识别成功照片数/考中抓拍照片总数 。如果低于设置值，则判定为作弊。" placement="top">
                 <span class="el-icon-question icon"></span>
               </el-tooltip>
             </div>
             <div class="item-container">
               <span class="item-desc">抓拍频率：</span>
               <span>&nbsp;</span>
               <el-input size="mini" style="width: 70px"  v-model="addPlanForm.zppl" placeholder="5" type="number" @change="detailQuantity($event,'zppl')"></el-input>
               <span>分钟一次</span>
               <span class="icon"></span>
             </div>
           </div>
           <div class="warn-item item">
             <div class="item-container">
               <span class="item-desc">警告次数：</span>
               <span>></span>
               <el-input size="mini" style="width: 70px"  v-model="addPlanForm.jgcs" placeholder="1" type="number" @change="detailQuantity($event,'jgcs')"></el-input>
               <span>次</span>
               <el-tooltip effect="dark" content="警告次数大于设置值时，判定为作弊。" placement="top">
                 <span class="el-icon-question icon"></span>
               </el-tooltip>
             </div>
           </div>
           <div class="error-item item">
             <div class="item-container">
               <span class="item-desc">异常操作：</span>
               <span>></span>
               <el-input size="mini" style="width: 70px"  v-model="addPlanForm.czyccs" placeholder="3" type="number" @change="detailQuantity($event,'czyccs')"></el-input>
               <span>次</span>
               <el-tooltip effect="dark" content="异常操作次数大于设置值时，判定为作弊。" placement="top">
                 <span class="el-icon-question icon"></span>
               </el-tooltip>
             </div>
           </div>
         </div>
        </el-form-item>



      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="fBtnEvt('fFormCancel')">取 消</el-button>
          <el-button size="mini" type="primary" @click="fSubmit">保存</el-button>
      </span>
  </div>
</template>

<script>


import global from '@/utils/global';
export default {
  name: 'validateForm',
  data() {
    return {
      fileList: [],
      selectBoxList: [],
      addPlanForm:{
        zptgl:80,
        zppl:5,
        jgcs:1,
        czyccs:3,
      },
      addPlanFlag:false,
      checkList:[]
    };
  },
  props: ['formCfg'],
  created() {
    this.addPlanFlag = this.formCfg.addPlanData && this.formCfg.addPlanData.yjkzt && this.formCfg.addPlanData.yjkzt === 1
    if(this.addPlanFlag){
      this.addPlanForm = {
        zptgl: this.formCfg.addPlanData.zptgl || '',
        zppl: this.formCfg.addPlanData.zppl || '',
        jgcs: this.formCfg.addPlanData.jgcs || '',
        czyccs: this.formCfg.addPlanData.czyccs || ''
      };
    }
    // console.log('this.formCfg = ', this.formCfg)
  },
  mounted() {

  },
  methods: {

    detailQuantity(val,type){
      let str = '' + val;
      if (str.indexOf('.') !== -1) {
        global.showMessage('不能为小数');
        let str2 = str.split('.')[0];
        this.addPlanForm[type] = parseInt(str2);
      }
      if(val < 0){
        global.showMessage('不能为负数');
        this.addPlanForm[type] = str.indexOf('.') !== -1 ? Math.abs(parseInt(str.split('.')[0])) :  Math.abs(val);
      }
    },

    //change switch
    handleSwitch(changeEvt,event) {
      if(this.formCfg.type === 'addPlan'){
        this.addPlanFlag = event
      }
      this.fBtnEvt(changeEvt,event)
    },

    //change select
    handleSelectChange(changeEvt,event){
      if(changeEvt === 'fChangeKsxs'){
        if (event === '1') {
          this.formCfg.form = this.formCfg.form.map(item => {
            item.hide = false;
            return item;
          });
        } else {
          this.formCfg.form = this.formCfg.form.map(item => {
            if (item.name === 'yjkzt') {
              item.hide = true;
            }
            return item;
          });
        }
      }
      this.fBtnEvt(changeEvt,event)
    },



    //添加筛选项
    addFormItem(){
      console.log('this.formCfg = ',this.formCfg);
      this.selectBoxList.push({
        id: (Math.random() *1000) + '',
        name:'kcid_' +((Math.random() * 1000)),
        value: '',
        data:this.formCfg.lesson
      })

    },

    //移除筛选项
    removeFormItem(item){
      this.selectBoxList = this.selectBoxList.filter(element => item.id !== element.id);
    },

    fChangePic(file, fileList, name) {
        const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
        if (!isJPG) {
          this.$message.error('只能上传jpg，png格式图片')
        }
        this.formCfg.submit[name + '_file_send'] = file.raw
        this.formCfg.submit[name + '_url'] = ''
        this.$forceUpdate()// 刷新dom
    },
    handleExceed(file, fileList) {
        this.$message.warning('只能选择1个文件!')
    },
    handlePreview() {},
    fRemovePic(file, fileList, name) {
        delete this.formCfg.submit[name + '_file_send']
    },
    fReloadCombox(url, index) {
        api.get(url).then(resp => {
            this.formCfg.form[index].data = resp.data
            this.$forceUpdate()// 刷新dom
        })
    },
    fSubmit() {
      this.$refs['form'].validate(resp => {
        if (resp) {
          let temp = null
          let flag = false
          for (var j in this.formCfg.submit) {
              if (j.indexOf('_file') > 0) {
                  flag = true
              }
          }
          if (flag) {
            var o = this.fGetFormSubmit({}) // 获取表单内容
            temp = new FormData()
            // temp.append('form', JSON.stringify(o))
            for (var m in o) {
                temp.append(m, o[m])
            }
            for (var k in this.formCfg.submit) {
                if (k.indexOf('_file') > 0) {
                    temp.append(k, this.formCfg.submit[k])
                }
            }
            this.gUpload(window.baseURL + this.formCfg.url, temp, this.fOk)
          } else {
            temp = this.fGetFormSubmit({})
            for(var k in temp){
              if(Array.isArray(temp[k]) && !temp[k].length){
                // console.log('是数组且没选')
                 return this.$message({
                  type: 'warning',
                  message: '请检查校验'
                });
                break;
              }
              if(temp[k]==='') delete temp[k]
            }
            // const url = temp['id']?this.formCfg.url.updateUrl:this.formCfg.url.saveUrl
            // const url = this.formCfg.url.addForm2Url;
            // console.log(url)
            // console.log('表单提交temp = ',temp);

            // this.$emit('transferEvt', { title: 'loading', data: true });
            let objSelect = {};
            if(this.selectBoxList.length){
              this.selectBoxList.forEach(item => {
                objSelect[item.name] = item.value;
              })
            }
            let param = {
              method: this.formCfg.method,
              data: {...temp,...objSelect},
            };
            if(this.formCfg.addFlag){
              param.flag = this.formCfg.addFlag;
            }
            if(this.formCfg.sectionsId){
              param.sectionsId = this.formCfg.sectionsId
            }
            if(this.formCfg.editId){
              param.editId = this.formCfg.editId
            }

            if(this.formCfg.type === 'addPlan' && this.addPlanFlag){
              param.data = {
                ...this.addPlanForm,
                ...param.data
              }
            }

            // console.log('temp = ',temp)
            console.log('param = ',param)
            this.$emit('transferEvt', param);
          }
        } else {
           this.$message({
               type: 'warning',
               message: '请检查校验'
           })
        }
      })
    },
    fOk() {
        this.$message({
            type: 'success',
            message: '操作成功'
        })
        this.fBtnEvt('fOk')
    },
    fGetFormSubmit(temp) {
            for (const k in this.formCfg.submit) {
                    if (k.indexOf('/') !== -1) {
                        const str = k.split('/')[0] + '.' + k.split('/')[1]
                        var flag = this.formCfg.submit[k] instanceof Array
                        temp[str] = flag ? this.formCfg.submit[k].join(',') : this.formCfg.submit[k]
                    } else if (typeof this.formCfg.submit[k] === 'object' && this.formCfg.submit[k] !== null) { // []:ids {}:checkbox
                        if (this.formCfg.submit[k]['type']) {
                            if (this.formCfg.submit[k]['type'] === 'checkbox') {
                            temp[k] = this.formCfg.submit[k]['checked'] === true ? '1' : '0'
                            } else if (this.formCfg.submit[k]['type'] === 'radio') {
                            temp[k] = this.formCfg.submit[k]['checked']
                            } else if (this.formCfg.submit[k]['type'] === 'checkboxGroup') {
                              temp[k] = this.formCfg.submit[k]['checkList']
                            }
                        } else {
                            temp[k] = this.formCfg.submit[k].join(',')
                        }
                    } else if (k.indexOf('assword') !== -1 && this.formCfg.submit[k] !== '') { // 所有密码都要加密提交
                        // 解密一次
                        const temp1 = this.formCfg.submit[k]
                        try {
                            const str = secret.Decrypt(temp1)
                            if (str.length === 0) { // 解密失败  需要加密
                            temp[k] = secret.Encrypt(temp1)
                            } else { // 解密成功  说明用户没有修改密码
                            temp[k] = this.formCfg.submit[k]
                            }
                        } catch (error) {
                            console.log(error)
                            temp[k] = secret.Encrypt(temp1)
                        }
                    } else {
                    temp[k] = this.formCfg.submit[k]
                    }
            }
            return temp
    },
    fFileChange(a) {
        const fileList = a.target.files
        this.formCfg.submit[a.target.dataset.name + '_file'] = fileList[0]
    },
    fBtnEvt(evt,event) {
      let goUp = event?{method:evt,data:event}:evt
      this.$emit('transferEvt', goUp)
    },
    fSelectParent(evt, row) {
      const showItem = evt.checked
      let hideItem = null
      row.data.forEach(item => {
        if (item.text !== showItem) hideItem = item.text
      })
      this.formCfg.form.forEach(v => {
        if (v.text === showItem) {
          v.hide = false
        } else if (v.text === hideItem) {
          v.hide = true
        }
      })
    },
    fBeforeClose() {
      // 清空form 内容  填充默认checkbox
      for (const k in this.formCfg.submit) {
        if (this.formCfg.submit[k] && (typeof this.formCfg.submit[k] === 'object')) {
          if (this.formCfg.submit[k]['type']) {
            var temp = null
            if (this.formCfg.submit[k]['type'] === 'checkbox') {
              this.formCfg.form.forEach(item => {
                if (item.name === k) {
                  temp = item.checked
                }
              })
              this.formCfg.submit[k]['checked'] = temp
            } else if (this.formCfg.submit[k]['type'] === 'radio') {
              let showItem = null
              let hideItem = null
              this.formCfg.form.forEach(item => {
                if (item.name === k) {
                  temp = item.checked
                  showItem = item.checked
                  item.data.forEach(v => {
                    if (v.text !== showItem)hideItem = v.text
                  })
                } else if (item.text === showItem) {
                  item.hide = false
                } else if (item.text === hideItem) {
                  item.hide = true
                }
              })
              this.formCfg.submit[k]['checked'] = temp
            }
          } else {
            this.formCfg.submit[k] = []
          }
        } else {
          this.formCfg.submit[k] = ''
        }
      }
      // 清空图片信息
      this.fileList = []
      // 清空校验
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    }
  }
}
</script>
<style lang="scss">
  .my-validate-form{
    .el-form-item {
      margin-bottom: 18px;
      .el-form-item__label {
        line-height: 28px;
        min-width: 72.67px;
      }
      .el-form-item__content {
        line-height: 28px;
      }
    }
    .no-label{
      .el-form-item__label {
        min-width: 150px;
      }
      .no-border{
        .el-input__inner{
         padding-left: 0;
        }
      }
    }
    .no-border{
      .el-input__inner{
        border:none !important;
      }
    }
  }
</style>

<style scoped lang="scss">

  @import "~@/styles/config.scss";
  .my-validate-form{
    max-height: 60vh;
    overflow-y: scroll;
    .my-el-form-icon{
      color:$baseColor;
      font-size: 22px;
    }
  }

  .addPlan-container{
    display: flex;
    flex-direction: column;
    .item{
      display: flex;
      flex-direction: column;
      border:1px solid #ccc;
      margin-bottom: 8px;
      padding: 8px pxToRem(15);
      border-radius: 4px;
      .item-container{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 6px;
        span{
          flex: 1;
        }
        .item-desc{
          flex: 1.8;
          text-align: left;
        }
        .icon{
          color:#f7ad4c;
          font-size: 18px;
          cursor: pointer;
        }
      }
    }
  }

  .verification-container{
    .verification-desc{
      color:#f2637b;
      padding-left: 8px;
      text-align: left;
      margin-bottom: 10px;
    }
    .verification-content{
      border: 1px solid #ccc;
      padding: 10px;
    }

  }

.dialog-footer {
    width: 100%;
    height: 30px;
    display: block;
    text-align: right;
    margin-top: 35px;
}
.open-detail {
    position: absolute;
    right: -188px;
    top: 0;
}
.pic_box {
    /* margin: 0;
    padding: 0;
    width: 0;
    height: 0; */
    padding-top: 10px;
}
</style>
