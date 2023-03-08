import global from '@/utils/global';
import moment from "moment";

const Form = {
  form1: [
    { 'name': 'papername', 'text': '试卷名称', 'type': 'text', 'width': '150px' },
    {
      'name': 'subjectid', 'text': '关联科目', 'type': 'combox', 'data': [
      ], 'label': 'subjectname', 'value': 'subjectid', 'width': '250px'
    },
  ]
};

const Url = {};

const Submit = {
  form1: {  }
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
      'width': 140,
      'hasSwitch':true,
      'switchField': 'enable',
      'btns': [

        {
          'method': 'fDelete',
          'text': '删除'
        }
      ]
    },
    columns: [
      {
        'field': 'papername',
        'title': '试卷名称',
        'align': 'center',
        'type': 'openDetail'
      },
      {
        'field': 'subjectname',
        'title': '考试科目',
        'align': 'center'
      },
      {
        'field': 'duration',
        'title': '考试时长',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c + '分钟';
        }
      },
      {
        'field': 'passscore',
        'title': '及格分数',
        'align': 'center'
      },
      {
        'field': 'createtime',
        'title': '创建时间',
        'align': 'center',
        'formatter': (a, b, c) => {
          return c ? moment(c).format('YYYY-MM-DD HH:mm:ss') :'-'
        }
      },
    ],
    data: {

    }
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '一键组卷', 'icon': '', 'event': 'fAddCurrent', 'type': 'add' },
    { 'name': '批量删除', 'icon': '', 'event': 'fDeleteByIds' },
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
