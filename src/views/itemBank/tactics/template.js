import global from '@/utils/global';

const Form = {
  form1: [
    { 'name': 'tacticsname', 'text': '策略名称', 'type': 'text', 'width': '250px' },
    {
      'name': 'subjectid', 'text': '关联科目', 'type': 'combox', 'data': [
      ], 'label': 'subjectname', 'value': 'subjectid', 'width': '250px'
    },
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
    checkable: true, // 是否显示全选
    objectSpanMethod: true, // 是否不显示序号
    controller: {
      'title': '操作',
      'width': 220,
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
      ]
    },
    columns: [

      {
        'field': 'tacticsname',
        'title': '策略名称',
        'align': 'center'
      },
      {
        'field': 'subjectname',
        'title': '科目名称',
        'align': 'center'
      },
      {
        'field': 'totalQuestion',
        'title': '总题数',
        'align': 'center'
      },
      {
        'field': 'totalScore',
        'title': '总分',
        'align': 'center'
      },
    ],
    data: {}
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '新增', 'icon': '', 'event': 'fAddCurrent', 'type': 'add' },
    { 'name': '批量删除', 'icon': '', 'event': 'fDeleteByIds' }
  ]
};

export default {
  Form: Form,
  Grid: Grid,
  Submit: o.Submit,
  Btn: Btn,
  Url: Url,
  Rules: o.Rules,
  lesson: [],
  typeList: []
};
