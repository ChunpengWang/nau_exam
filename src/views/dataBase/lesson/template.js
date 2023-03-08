import global from '@/utils/global';

const Form = {
  form1: [
    { 'name': 'subjectcode', 'text': '科目编号', 'type': 'text', 'width': '250px' },
    { 'name': 'subjectname', 'text': '科目名称', 'type': 'text', 'width': '250px' }
  ],
  form2: [
    {
      'name': 'subjectcode',
      'text': '科目编号',
      'type': 'text',
      'width': '250px',
      'required': true,
      'validate': 'none',
      'placeholder': '请输入科目编号'
    },
    {
      'name': 'subjectname',
      'text': '科目名称',
      'type': 'text',
      'width': '250px',
      'required': true,
      'validate': 'none',
      'placeholder': '请输入科目名称'
    },
  ]
};

const Url = {
  'templateDownload': {type:'subject'}
};

const Submit = {
  form1: {},
  form2: { 'subjectid': '' }
};

const Rules = {};

const o = global.genSubmit(Form, Submit, Rules);

const Grid = {
  grid1: {
    loading: false, // table loading
    pagination: true, // 数据存在的字段  是否分页
    border: false, // border
    checkable: true, // 是否显示全选
    objectSpanMethod: true, // 是否不显示序
    controller: {
      'title': '操作',
      'width': 200,
      'hasSwitch': true,
      'switchField': 'enable',
      'btns': [
        {
          'method': 'fEdit',
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

    ],
    data: {}
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '导入', 'icon': '', 'event': 'fImport', 'type': 'import',  },
    { 'name': '新增', 'icon': '', 'event': 'fAddForm', 'type': 'add' },
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
