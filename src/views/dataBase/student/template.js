import global from '@/utils/global';

const Form = {
  form1: [
    { 'name': 'studentcode', 'text': '学号', 'type': 'text', 'width': '150px' },
    { 'name': 'studentname', 'text': '姓名', 'type': 'text', 'width': '150px' },
    { 'name': 'idcard', 'text': '身份证号', 'type': 'text', 'width': '200px' },
    { 'name': 'mobile', 'text': '联系电话', 'type': 'text', 'width': '200px' },
  ],
  form2: []
};

const Url = {
  'templateDownload': { type: 'student' },
};

const Submit = {
  form1: {},
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
      ],
      'hasSwitch': true,
      'switchField': 'enable'
    },
    columns: [
      {
        'field': 'studentcode',
        'title': '学号',
        'align': 'center'
      },
      {
        'field': 'studentname',
        'title': '姓名',
        'align': 'center',
      },
      {
        'field': 'thumb',
        'title': '照片',
        'align': 'center',
        'type': 'img'
      },
      {
        'field': 'gender',
        'title': '性别',
        'align': 'center',
        'formatter': (a, b, c) => {
          return ['男','女','-'][c-1];
        }

      },
      {
        'field': 'mobile',
        'title': '联系电话',
        'align': 'center'
      },
      {
        'field': 'idcard',
        'title': '身份证号',
        'align': 'center'
      }
    ],
    data: {}
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '学生照片导入', 'icon': '', 'event': 'fImportZip', 'type': 'importZip','typeName':'学生' },
    { 'name': '导入', 'icon': '', 'event': 'fImport', 'type': 'import',  },
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
