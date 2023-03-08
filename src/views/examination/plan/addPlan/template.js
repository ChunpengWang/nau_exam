import global from '@/utils/global';
import moment from 'moment';// 导入文件

const Form = {
  form1: [
    { 'name': 'planname', 'text': '计划名称', 'type': 'text', 'width': '150px', 'placeholder': '请输入计划名称' },

  ],
  form2: [
    {
      'name': 'planname',
      'text': '计划名称',
      'type': 'text',
      'width': '320px',
      'required': true,
      'validate': 'none',
      'placeholder': '请输入计划名称'
    },
    { 'name': 'plandate', 'text': '计划日期', 'type': 'daterange', 'width': '320px', 'required': true, 'validate': 'none' },


  ]
};

const Url = {};

const Submit = {
  form1: {},
  form2: { 'planid': '' }
};

const Rules = {};

const o = global.genSubmit(Form, Submit, Rules);


const Grid = {
  grid1: {
    loading: false, // table loading
    pagination: true, // 数据存在的字段  是否分页
    border: false, // border
    checkable: true, // 是否显示全选
    objectSpanMethod: true, // 是否不显示序号
    controller: {
      'title': '操作',
      'width': 200,
      'btns': [
        {
          'method': 'fEditPlan',
          'text': '修改'
        },
        {
          'method': 'fDelete',
          'text': '删除'
        }
      ]
    },
    columns: [

      {
        'field': 'planname',
        'title': '计划名称',
        'align': 'center'
      },
      {
        'field': 'plandate',
        'title': '计划日期',
        'type': 'date',
        'align': 'center',
        'width': 200,
        'formatter': (a, b, c) => {
          return moment(a['startdate']).format('YYYY-MM-DD')+'-' + moment(a['enddate']).format('YYYY-MM-DD');
        }
      },
    ],
    data: {

    } // pagination 为true
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '创建', 'icon': '', 'event': 'fAddForm', 'type': 'add' },
    { 'name': '批量删除', 'icon': '', 'event': 'fDeleteByIds' }
  ]
};

export default {
  Form: Form,
  Grid: Grid,
  Submit: o.Submit,
  Btn: Btn,
  Url: Url,
  Rules: o.Rules
};
