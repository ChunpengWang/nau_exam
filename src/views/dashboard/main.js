
const student = [

  {
    id: 9,
    title: '在线考试',
    subtitle: 'test',
    bgc: require('@/assets/images/index/bg8.png'),
    icon: require('@/assets/images/index/bgicon8.png'),
    isAnimate: false,
    route: 'onlineExaminations',
    roles: ''
  },
  {
    id: 10,
    title: '成绩查询',
    subtitle: 'query',
    bgc: require('@/assets/images/index/bg9.png'),
    icon: require('@/assets/images/index/bgicon9.png'),
    isAnimate: false,
    route: 'personalCenter',
    roles: ''
  }
];

const teacher = [
  {
    id: 3,
    title: '在线阅卷',
    subtitle: 'marking',
    bgc: require('@/assets/images/index/bg3.png'),
    icon: require('@/assets/images/index/bgicon3.png'),
    isAnimate: false,
    route: 'marking',
    roles: 'zxyj'
  }
];

const admin = [
  {
    id: 1,
    title: '考务管理',
    subtitle: 'Examination',
    bgc: require('@/assets/images/index/bg1.png'),
    icon: require('@/assets/images/index/bgicon1.png'),
    isAnimate: false,
    route: 'examination',
    roles: 'kwgl'
  },
  {
    id: 2,
    title: '题库管理',
    subtitle: 'Item bank',
    bgc: require('@/assets/images/index/bg2.png'),
    icon: require('@/assets/images/index/bgicon2.png'),
    isAnimate: false,
    route: 'itemBank',
    roles: 'tkgl'
  },
  {
    id: 3,
    title: '阅卷管理',
    subtitle: 'marking',
    bgc: require('@/assets/images/index/bg3.png'),
    icon: require('@/assets/images/index/bgicon3.png'),
    isAnimate: false,
    route: 'marking',
    roles: 'zxyj'
  },
  {
    id: 6,
    title: '统计分析',
    subtitle: 'statistical',
    bgc: require('@/assets/images/index/bg7.png'),
    icon: require('@/assets/images/index/bgicon7.png'),
    isAnimate: false,
    route: 'statisticalAnalysis',
    roles: 'tjfx'
  },
  {
    id: 7,
    title: '基础信息库',
    subtitle: 'data base',
    bgc: require('@/assets/images/index/bg4.png'),
    icon: require('@/assets/images/index/bgicon4.png'),
    isAnimate: false,
    route: 'dataBase',
    roles: 'jcxxk'
  },
  {
    id: 8,
    title: '平台管理',
    subtitle: 'MANAGEMENT',
    bgc: require('@/assets/images/index/bg8.png'),
    icon: require('@/assets/images/index/bgicon5.png'),
    isAnimate: false,
    route: 'management',
    roles: 'ptgl'
  }
];

export default {
  admin,
  teacher,
  student
};

