import global from '@/utils/global';

const Form = {
  form1: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'change': 'fChangeKsjh', 'data': [
      ], 'label': 'planname', 'value': 'planid', 'width': '350px'
    }
  ],
};

const Url = {};

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
    checkable: false, // 是否显示全选
    objectSpanMethod: true, // 是否不显示序号
    columns: [
      {
        'field': 'studentname',
        'title': '姓名',
        'align': 'center'
      },
      {
        'field': 'idcard',
        'title': '身份证号',
        'align': 'center'
      },
      {
        'field': 'subjectname',
        'title': '考试科目',
        'align': 'center'
      },
      {
        'field': 'releassetotalscore',
        'title': '分数',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c == -1 ? '-' : c;
        }
      },
      {
        'field': 'ispass',
        'title': '成绩结果',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c == 1 ? '及格' : '不及格';
        }
      }
    ],
    data: {}
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' }
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
