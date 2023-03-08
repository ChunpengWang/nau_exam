import global from '@/utils/global';
import {QuestionTypeEnum} from '@/api/enum';
const QuestionType = [
  ...Object.entries(QuestionTypeEnum).map(item => ({
    id: item[0],
    name: item[1]
  }))
]
const Form = {
  form1: [
    {
      'name': 'type', 'text': '题型', 'type': 'combox', 'data': [
        ...QuestionType
      ], 'label': 'name', 'value': 'id', 'width': '150px'
    },
    {
      'name': 'subjectid', 'text': '关联科目', 'type': 'combox', 'data': [
      ], 'label': 'subjectname', 'value': 'subjectid', 'width': '250px'
    },
    {
      'name': 'enable', 'text': '试题状态', 'type': 'combox', 'data': [
        { 'name': '已禁用', 'id': '1' },
        { 'name': '已启用', 'id': '0' }
      ], 'label': 'name', 'value': 'id', 'width': '150px'
    },
  ]
};


const Url = {
  'templateDownload': { type: 'question'},
};

const Submit = {
  form1: {}
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
      'hasSwitch':true,
      'switchField': 'enable',
      'btns': [
        {
          'method': 'fEditList',
          'text': '修改'
        },
        {
          'method': 'fDelete',
          'text': '删除'
        }
      ],
    },
    columns: [
      {
        'field': 'topic',
        'title': '题干',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c.length > 20 ? c.substr(0,20) + '...' : c
        }
      },
      {
        'field': 'type',
        'title': '题型',
        'align': 'center',
        'formatter': (a, b, c) => {
          return QuestionTypeEnum[c]
        }
      },
      {
        'field': 'way',
        'title': '判分形式',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c == '1'?'自动判分':'不自动判分'
        }
      },
      {
        'field': 'subjectname',
        'title': '关联科目',
        'align': 'center',
      },
    ],
    data: {
    } // pagination 为true
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '导入', 'icon': '', 'event': 'fImport', 'type': 'import' },
    { 'name': '新增', 'icon': '', 'event': 'fAddCurrent', 'type': 'add' },
    { 'name': '批量删除', 'icon': '', 'event': 'fDeleteByIds' },
  ]
};

export default {
  Form: Form,
  Grid: Grid,
  Submit: o.Submit,
  Btn: Btn,
  Url: Url,
  Rules: o.Rules,

};
