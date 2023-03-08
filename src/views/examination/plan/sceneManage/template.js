import global from '@/utils/global';

const Form = {
  form1: [
    {
      'name': 'planid', 'text': '考试计划', 'type': 'combox', 'change': 'fChangeKsjh', 'data': [
      ], 'label': 'planname', 'value': 'planid', 'width': '350px'
    }
  ],
  form2: [

    { 'name': 'scenedate', 'text': '场次时间', 'type': 'datetimerange', 'width': '320px', 'required': true, 'validate': 'none' },
    {
      'name': 'subjectid', 'text': '考试科目', 'type': 'combox', 'changeEvt': 'fChangeLx', data: [
      ], 'label': 'subjectname', 'value': 'subjectid', 'width': '320px', 'required': true, 'validate': 'none'
    }
  ]
};

const Url = {};

const Submit = {
  form1: {},
  form2: { }
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
          'method': 'fEditLesson',
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
        'field': 'name',
        'title': '场次名称',
        'align': 'center',
      },
      {
        'field': 'datestr',
        'title': '场次时间',
        'align': 'center',
        'width': 350,
        'formatter': (a, b, c) => {
          return `${a['startdate'] || ''}~${a['enddate'] || ''}`;
        }

      },
      {
        'field': 'subjectname',
        'title': '考试科目',
        'align': 'center',

      }
    ],

    data: []   // pagination 为false  不分页
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '新增', 'icon': '', 'event': 'fAddLesson', 'type': 'add' },
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
  lesson: []
};
