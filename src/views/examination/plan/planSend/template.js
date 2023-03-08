import global from '@/utils/global';


const Form = {
  form1: [
    { 'name': 'planname', 'text': '计划名称', 'type': 'text', 'width': '150px', 'placeholder': '请输入计划名称' },
    {
      'name': 'status',
      'text': '状态',
      'type': 'combox',
      'data': [
        { 'name': '已结束', 'id': '2' },
        { 'name': '进行中', 'id': '1' }
      ],
      'change': 'fChangeSjzt',
      'label': 'name',
      'value': 'id',
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
  grid1: {
    loading: false, // table loading
    pagination: true, // 数据存在的字段  是否分页
    border: false, // border
    checkable: true, // 是否显示全选
    objectSpanMethod: true, // 是否不显示序号
    controller: {
      'title': '操作',
      'width': 200,
      'btns': []
    },
    columns: [],
    data: {}
  }
};

const Btn = {
  btn1: [
    { 'name': '查询', 'icon': '', 'event': 'fSearch', 'type': 'search' },
    { 'name': '新增发布', 'icon': '', 'event': 'fAddSend', 'type': 'add' },
    { 'name': '结束计划', 'icon': '', 'event': 'fEndPlanByIds' }
  ]
};

export default {
  Form: Form,
  Grid: Grid,
  Submit: o.Submit,
  Btn: Btn,
  Url: Url,
  Rules: o.Rules,
  planList: []
};
