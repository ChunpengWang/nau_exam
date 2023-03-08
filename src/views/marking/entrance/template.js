import global from '@/utils/global';


const Form = {
  form1: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'change': 'fChangeKsjh', 'data': [], 'label': 'planname', 'value': 'planid', 'width': '350px'
    },
    {
      'name': 'subjectcode', 'text': '考试科目', 'type': 'combox', 'change': 'fChangeKskm', 'data': [], 'label': 'subjectname', 'value': 'subjectcode', 'width': '350px'
    }
  ]
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
    controller: {
      'title': '操作',
      'width': 200,
      'btns': [
        {
          'method': 'fGoInto',
          'text': '评阅'
        }
      ]
    },
    columns: [
      {
        'field': 'subjectname',
        'title': '考试科目',
        'align': 'center'
      },
      {
        'field': 'systemscore',
        'title': '客观题得分',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c == -1 ? '-' : c;
        }
      },
      {
        'field': 'laborscore',
        'title': '主观题得分',
        'align': 'center',
        'formatter': (a, b, c) => {
          return  c == -1 ? '-' : c;
        }
      },
      {
        'field': 'releassetotalscore',
        'title': '总得分',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c == -1 ? '-' : c;
        }
      }
    ],
    data: {

    } // pagination 为false
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
  tabTable: true,
  tabList: [
    {
      id: '1',
      name: '待评阅'
    },
    {
      id: '2',
      name: '已评阅'
    }
  ],
  tabActiveId: '1'
};
