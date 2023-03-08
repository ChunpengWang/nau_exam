import global from '@/utils/global';

const Form = {
  form1: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'change': 'fChangeKsjh', 'data': [], 'label': 'planname', 'value': 'planid', 'width': '350px'
    },
    { 'name': 'teachername', 'text': '姓名', 'type': 'text', 'width': '150px' },
  ],
  form2: [
    {
      'name': 'teachername',
      'text': '姓名',
      'type': 'text',
      'width': '300px',
      'readonly': true,
      'noBorder': true
    },

    {
      'name': 'km',
      'text': '科目',
      'type': 'text',
      'width': '300px',
      'readonly': true,
      'noBorder': true
    },
    {
      'name': 'dqrwl',
      'text': '当前任务量',
      'type': 'text',
      'width': '300px',
      'readonly': true,
      'noBorder': true
    },
    {
      'name': 'tasknum',
      'text': '增加任务量',
      'type': 'number',
      'numMin': '1',
      'width': '300px',
      'required': true,
      'validate': 'none',
      'placeholder': '请输入任务量'
    }
  ]
};

const Url = {};

const Submit = {
  form1: {},
  form2: { 'yjrId': '' }
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
        'title': '姓名',
        'align': 'center'
      },
      {
        'field': 'tasknum',
        'title': '任务量',
        'align': 'center',
        'width': 100,
        'type': 'hover'
      },
      {
        'field': 'reviewednum',
        'title': '已评',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c || 0
        }
      }
    ],
    hoverData: [],
    hoverFlag: true,
    data: {}
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '一键分配', 'icon': '', 'event': 'fAddCurrent', 'type': 'add' },
    { 'name': '重置', 'icon': '', 'event': 'fRestData' },
    { 'name': '阅卷分配确认', 'icon': '', 'event': 'fMarkingConfirm', 'rightFlag': true },
    { 'name': '*阅卷任务分配确认后方可进行阅卷', 'icon': '', 'type': 'text', 'value': '', 'event': 'fText', 'rightFlag': true }
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
  tabList: [],
  tabActiveId: '1', //默认全部科目
};
