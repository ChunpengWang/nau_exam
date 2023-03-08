import global from '@/utils/global';

const Form = {
  form1: [
    { 'name': 'teachername', 'text': '姓名', 'type': 'text', 'width': '150px' },
    { 'name': 'mobile', 'text': '联系电话', 'type': 'text', 'width': '150px' },
    { 'name': 'idcard', 'text': '身份证号', 'type': 'text', 'width': '150px' }
  ],
  form2: []
};

const Url = {
  'templateDownload': { type:'teacher' }
};

const Submit = {
  form1: {},
  form2: { 'id': '' }
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
      'width': 250,
      'hasSwitch':true,
      'switchField': 'enable',
      'btns': [
        {
          'method': 'fRestPwd',
          'text': '重置密码'
        },
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
        'field': 'teachername',
        'title': '教师姓名',
        'align': 'center'
      },
      {
        'field': 'mobile',
        'title': '联系电话',
        'align': 'center'
      },
      {
        'field': 'idcard',
        'title': '身份证号',
        'align': 'center',
      },
    ],
    data: {}
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '数据导入', 'icon': '', 'event': 'fImport', 'type': 'import' },
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
  Rules: o.Rules
};
