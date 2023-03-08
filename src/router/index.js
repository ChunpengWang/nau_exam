import Vue from "vue";
import VueRouter from "vue-router";
import store from '@/store'

Vue.use(VueRouter);
import {getToken, getLocalStorageUser,} from '@/utils/auth';
/* Layout */
import Layout from "@/layout";
import Layout1 from "@/layout/index1";

/**
 * constantRoutes
 * 默认路由
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        way: '/dashboard',
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" }
      }
    ]
  },

];

/**
 * adminRoutes
 * 考务管理人员角色路由
 */
export const adminRoutes = [
  {
    path: "/examination",
    component: Layout,
    redirect: "/examination/plan/addPlan",
    name: "examination",
    meta: { title: "考务管理", icon: "example"},
    children: [
      {
        path: "plan",
        name: "plan",
        component: Layout1,
        way: '/examination/plan',
        redirect: "/examination/plan/addPlan",
        meta: { title: "考试计划管理", icon: require("@/assets/images/tab/plan.png")},
        children:[
          {
            path: "addPlan",
            name: "addPlan",
            way: '/examination/plan/addPlan',
            component: () => import("@/views/examination/plan/addPlan/index"),
            meta: { title: "1.创建计划", icon: '', }
          },
          {
            path: "subjectManage",
            name: "subjectManage",
            way: '/examination/plan/subjectManage',
            component: () => import("@/views/examination/plan/subjectManage/index"),
            meta: { title: "2.科目管理", icon: '' , }
          },
          {
            path: "studentLeadingIn",
            name: "studentLeadingIn",
            way: '/examination/plan/studentLeadingIn',
            component: () => import("@/views/examination/plan/studentLeadingIn/index"),
            meta: { title: "3.考生管理", icon: '', }
          },
          {
            path: "sceneManage",
            name: "sceneManage",
            way: '/examination/plan/sceneManage',
            component: () => import("@/views/examination/plan/sceneManage/index"),
            meta: { title: "4.场次管理", icon: '' , }
          },
          {
            path: "planSend",
            name: "planSend",
            way: '/examination/plan/planSend',
            component: () => import("@/views/examination/plan/planSend/index"),
            meta: { title: "5.计划发布", icon: '' , }
          },
        ]
      },
      {
        path: "score",
        name: "score",
        way: '/examination/score',
        component: Layout1,
        redirect: "/examination/score/scoreSend",
        meta: { title: "成绩管理", icon: require("@/assets/images/tab/score.png") , },
        children:[
          {
            path: "scoreSend",
            name: "scoreSend",
            way:'/examination/score/scoreSend',
            component: () => import("@/views/examination/score/scoreSend/index"),
            meta: { title: "成绩发布", icon: '' , }
          },
        ]
      },
    ]
  },

  {
    path: "/itemBank",
    component: Layout,
    redirect: "/itemBank/question",
    name: "itemBank",
    meta: { title: "题库管理", icon: "example",  },
    children: [
      {
        path: "question",
        name: "question",
        way:'/itemBank/question',
        component: () => import("@/views/itemBank/question/index"),
        meta: { title: "试题管理", icon: require("@/assets/images/tab/question.png") ,}
      },
      {
        path: "tactics",
        name: "tactics",
        way:'/itemBank/tactics',
        component: () => import("@/views/itemBank/tactics/index"),
        meta: { title: "组卷策略", icon: require("@/assets/images/tab/tactics.png"), }
      },
      {
        path: "paper",
        name: "paper",
        way:'/itemBank/paper',
        component: () => import("@/views/itemBank/paper/index"),
        meta: { title: "试卷管理", icon: require("@/assets/images/tab/paper.png"),}
      }
    ]
  },

  {
    path: "/marking",
    component: Layout,
    redirect: "/marking/answerSheet",
    name: "marking",
    meta: { title: "阅卷管理", icon: "example" , },
    children: [
      {
        path: "answerSheet",
        name: "answerSheet",
        way:'/marking/answerSheet',
        component: () => import("@/views/marking/answerSheet/index"),
        meta: { title: "答题卡回收", icon: require("@/assets/images/tab/answerSheet.png")}
      },
      {
        path: "teacher",
        name: "teacher",
        way:'/marking/teacher',
        component: () => import("@/views/marking/teacher/index"),
        meta: { title: "阅卷老师管理", icon: require("@/assets/images/tab/teacher.png") }
      },
      {
        path: "task",
        name: "task",
        way:'/marking/task',
        component: () => import("@/views/marking/task/index"),
        meta: { title: "阅卷任务管理", icon: require("@/assets/images/tab/task.png") }
      }
    ]
  },

  {
    path: "/statisticalAnalysis",
    component: Layout,
    redirect: "/statisticalAnalysis/examStatistics",
    name: "statisticalAnalysis",
    meta: { title: "统计分析", icon: "example" ,},
    children: [
      {
        path: "examStatistics",
        name: "examStatistics",
        way:'/statisticalAnalysis/examStatistics',
        component: () => import("@/views/statisticalAnalysis/examStatistics/index"),
        meta: { title: "考试统计", icon: require("@/assets/images/tab/examStatistics.png"),}
      }
    ]
  },

  {
    path: "/dataBase",
    component: Layout,
    redirect: "/dataBase/class",
    name: "dataBase",
    meta: { title: "基础信息库", icon: "example" },
    children: [
      {
        path: "class",
        name: "class",
        way:'/dataBase/class',
        component: () => import("@/views/dataBase/class/index"),
        meta: { title: "教师库", icon: require("@/assets/images/tab/class.png"),}
      },
      {
        path: "student",
        name: "student",
        way:'/dataBase/student',
        component: () => import("@/views/dataBase/student/index"),
        meta: { title: "学生库", icon: require("@/assets/images/tab/student.png") }
      },
      {
        path: "lesson",
        name: "lesson",
        way:'/dataBase/lesson',
        component: () => import("@/views/dataBase/lesson/index"),
        meta: { title: "科目库", icon: require("@/assets/images/tab/lesson.png") },
      },

    ]
  },

  {
    path: "/management",
    component: Layout,
    redirect: "/management/userManage",
    name: "management",
    meta: { title: "平台管理", icon: "example" , },
    children: [
      {
        path: "userManage",
        name: "userManage",
        way:'/management/userManage',
        component: () => import("@/views/management/userManage/index"),
        meta: { title: "用户管理", icon: require("@/assets/images/tab/userManage.png") ,}
      },
    ]
  },

];

/**
 * teacherRoutes
 * 阅卷老师角色路由
 */
export const teacherRoutes = [
  {
    path: "/marking",
    component: Layout,
    redirect: "/marking/entrance",
    name: "marking",
    meta: { title: "在线阅卷", icon: "example" , },
    children: [
      {
        path: "entrance",
        name: "entrance",
        way:'/marking/entrance',
        component: () => import("@/views/marking/entrance/index"),
        meta: { title: "阅卷入口", icon: require("@/assets/images/tab/entrance.png"),}
      },
      {
        path: "startMarking",
        name: "startMarking",
        way:'/marking/startMarking',
        component: () => import("@/views/marking/entrance/startMarking"),
        meta: { title: "阅卷入口 > 开始阅卷", icon: require("@/assets/images/tab/entrance.png"),hidden:true,}
      },
    ]
  },

];

/**
 * studentRoutes
 * 学生角色路由
 */
export const studentRoutes = [


  {
    path: "/onlineExaminations",
    component: Layout,
    redirect: "/onlineExaminations/examList",
    name: "onlineExaminations",
    meta: { title: "在线考试", icon: "example",  },
    children: [
      {
        path: "examList",
        name: "examList",
        way:'/onlineExaminations/examList',
        component: () => import("@/views/onlineExaminations/examList/index"),
        meta: { title: "考试列表", icon: require("@/assets/images/tab/knowledge.png"),  }
      },
      {
        path: "confirmation",
        name: "confirmation",
        way:'/onlineExaminations/confirmation',
        component: () => import("@/views/onlineExaminations/confirmation/index"),
        meta: { title: "考前信息确认", icon: require("@/assets/images/tab/knowledge.png"), }
      },
      {
        path: "notice",
        name: "notice",
        way:'/onlineExaminations/notice',
        component: () => import("@/views/onlineExaminations/notice/index"),
        meta: { title: "考生须知", icon: require("@/assets/images/tab/knowledge.png"),  }
      },
      {
        path: "startExam",
        name: "startExam",
        way:'/onlineExaminations/startExam',
        component: () => import("@/views/onlineExaminations/startExam/index"),
        meta: { title: "开始考试", icon: require("@/assets/images/tab/knowledge.png"), }
      },
    ]
  },

  {
    path: "/personalCenter",
    component: Layout,
    redirect: "/personalCenter/resultsEnquiry",
    name: "personalCenter",
    meta: { title: "个人中心", icon: "example",  },
    children: [
      {
        path: "resultsEnquiry",
        name: "resultsEnquiry",
        way:'/personalCenter/resultsEnquiry',
        component: () => import("@/views/personalCenter/resultsEnquiry/index"),
        meta: { title: "成绩查询", icon: require("@/assets/images/tab/resultsEnquiry.png") }
      }
    ]
  },

];

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  if (getToken() && getLocalStorageUser()) {
    if (to.path === '/login') {
      next({path: '/'});
    } else if(!store.state.user.routes){
      //动态添加路由
      store.dispatch("user/setRoutes").then(()=>{
        next({path: to.fullPath})
      })
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
})


export default router;
