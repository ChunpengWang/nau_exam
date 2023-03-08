import global from '@/utils/global';

const Form = {
  form1: [
    {
      'name': 'planid',
      'text': '考试计划',
      'type': 'combox',
      'change': 'fChangeKsjh',
      'data': [],
      'label': 'planname',
      'value': 'planid',
      'width': '350px'
    },
    { 'name': 'subjectcode', 'text': '考试科目', 'type': 'combox', 'data': [], 'label': 'subjectname', 'value': 'subjectcode', 'width': '150px' },
    { 'name': 'studentcode', 'text': '学号', 'type': 'text', 'width': '150px' },
    { 'name': 'studentname', 'text': '姓名', 'type': 'text', 'width': '150px' },
    {
      'name': 'isreleasestate', 'text': '成绩状态', 'type': 'combox', 'data': [
        { 'name': '全部', 'id': '' },
        { 'name': '未发布', 'id': '1' },
        { 'name': '已发布', 'id': '2' }
      ], 'label': 'name', 'value': 'id', 'width': '150px'
    },
    {
      'name': 'ispass', 'text': '及格状态', 'type': 'combox', 'data': [
        { 'name': '全部', 'id': '' },
        { 'name': '及格', 'id': '1' },
        { 'name': '不及格', 'id': '2' }
      ], 'label': 'name', 'value': 'id', 'width': '150px'
    },
  ],
  form2: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'changeEvt': 'fChangeKsjh2', data: [], 'label': 'planname', 'value': 'planid', 'width': '250px', 'required': true, 'validate': 'none'
    },
    {
      'name': 'subjectcode', 'text': '考试科目', 'type': 'combox', data: [
      ], 'label': 'subjectname', 'value': 'subjectcode', 'width': '250px', 'validate': 'none'
    }
  ],
  form3: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'changeEvt': 'fChangeKsjh3', data: [], 'label': 'planname', 'value': 'planid', 'width': '300px', 'required': true, 'validate': 'none'
    },
    {
      'name': 'subjectcode', 'text': '考试科目', 'type': 'combox', data: [], 'changeEvt': 'fChangeKskm3',
      'label': 'subjectname', 'value': 'subjectcode', 'width': '300px', 'validate': 'none'
    },
    {
      'name': 'totalscore',
      'text': '总分',
      'type': 'text',
      'width': '300px',
      'readonly': true,
      'noBorder': true
    },
    {
      'name': 'passscore',
      'text': '当前及格分',
      'type': 'text',
      'width': '300px',
      'readonly': true,
      'noBorder': true
    },
    // {
    //   'name': 'dtjgfbl',
    //   'text': '当前及格人数比例',
    //   'type': 'text',
    //   'width': '300px',
    //   'readonly': true,
    //   'noBorder': true,
    //   'noLabel': true
    // },
    {
      'name': 'tzjgf',
      'text': '调整及格分',
      'type': 'number',
      'width': '300px',
      'changeEvt': 'fChangeScore',
      'required': true,
      'validate': 'none',
      'placeholder': '请输入调整及格分'
    },
    // {
    //   'name': 'tzjgfbl',
    //   'text': '调整后及格人数比例',
    //   'type': 'text',
    //   'width': '300px',
    //   'readonly': true,
    //   'noBorder': true,
    //   'noLabel': true
    // }
  ]
};

const Url = {};

const Submit = {
  form1: {},
  form2: { 'id': '' },
  form3: { 'id': '' }
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
      'width': 110,
      'type': 'score',
      'btns': [
        {
          'method': 'fDetail',
          'text': '查看详情'
        },
        {
          'method': 'fSend',
          'text': '发布'
        }
      ],
    },
    columns: [
      {
        'field': 'idcard',
        'title': '身份证',
        'align': 'center'
      },
      {
        'field': 'studentcode',
        'title': '学号',
        'align': 'center'
      },
      {
        'field': 'studentname',
        'title': '姓名',
        'align': 'center'
      },
      {
        'field': 'subjectname',
        'title': '考试科目',
        'align': 'center'
      },
      {
        'field': 'laborscore',
        'title': '阅卷得分',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c == -1 ? '-' : c;
        }
      },
      {
        'field': 'releassetotalscore',
        'title': '发布成绩',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c == -1 ? '-' : c;
        }
      },
      {
        'field': 'isreleasestate',
        'title': '成绩状态',
        'align': 'center',
        'type': 'status',
        'flag': 'score'
      },
      {
        'field': 'ispass',
        'title': '及格状态',
        'align': 'center',
        'type': 'status',
        'flag': 'scoreSend'
      },
    ],
    data: {

    } // pagination 为true
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '调整及格分', 'icon': '', 'event': 'fAdjust' },
    { 'name': '一键发布', 'icon': '', 'event': 'fSendAll' },
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
