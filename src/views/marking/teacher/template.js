import global from '@/utils/global';

const Form = {
  form1: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'change': 'fChangeKsjh', 'data': [], 'label': 'planname', 'value': 'planid', 'width': '350px'
    },
    { 'name': 'teachername', 'text': '姓名', 'type': 'text', 'width': '150px' },
  ]
};

const Url = {
  'templateDownload': { type: 'marking' }
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
    checkable: false, // 是否显示全选
    objectSpanMethod: true, // 是否不显示序号
    columns: [
      {
        'field': 'idcard',
        'title': '身份证号',
        'align': 'center'
      },
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
        'field': 'subjectname',
        'title': '阅卷科目',
        'align': 'center',
      }
    ],
    data: {} // pagination 为true
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '数据导入', 'icon': '', 'event': 'fImport', 'type': 'import' },
    { 'name': '清空数据', 'icon': '', 'event': 'fClearAllData' }
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
