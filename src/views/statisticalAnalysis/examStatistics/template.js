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
    {
      'name': 'subjectcode',
      'text': '考试科目',
      'type': 'combox',
      'data': [],
      'change': 'fChangeKc',
      'label': 'subjectname',
      'value': 'subjectcode',
      'width': '150px'
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
  grid1: {}
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
  Rules: o.Rules
};
