import global from '@/utils/global';


const Form = {
  form1: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'change': 'fChangeKsjh', 'data': [
      ], 'label': 'planname', 'value': 'planid', 'width': '350px'
    }
  ],
  form2: [
    {
      'name': 'subjectid', 'text': '科目名称', 'type': 'combox', 'changeEvt': 'fChangeKm', data: [
      ], 'label': 'subjectname', 'value': 'subjectid', 'width': '250px', 'required': true, 'validate': 'none'
    },
    {
      'name': 'paperid', 'text': '关联试卷', 'type': 'combox', data: [
      ], 'label': 'papername', 'value': 'paperid', 'width': '250px', 'required': true, 'validate': 'none'
    }
  ]
};

const Url = {};

const Submit = {
  form1: {},
  form2: {}
};

const Rules = {};

const o = global.genSubmit(Form, Submit, Rules);

const Grid = {
  grid1: {
    loading: false, // table loading
    pagination: false, // 数据存在的字段  是否分页
    border: false, // border
    checkable: true, // 是否显示全选
    objectSpanMethod: true, // 是否不显示序号
    controller: {
      'title': '操作',
      'width': 200,
      'btns': [
        {
          'method': 'fEditSubject',
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
        'field': 'subjectcode',
        'title': '科目编号',
        'align': 'center'
      },
      {
        'field': 'subjectname',
        'title': '科目名称',
        'align': 'center'
      },
      {
        'field': 'papername',
        'title': '关联试卷',
        'align': 'center'
      },
    ],
    data:[]
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '新增', 'icon': '', 'event': 'fAddSubject', 'type': 'add' },
    { 'name': '批量删除', 'icon': '', 'event': 'fDeleteByIds' },
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
