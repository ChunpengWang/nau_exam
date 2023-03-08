import request from '@/utils/request';
import Qs from 'qs';



/**
 * 获取已结束 和计划结束时间小于当前时间 的考试计划

 */
export const getEndPlanList = async data => {
    return request({
        url: 'marking/getendplan',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 获取已结束 和计划结束时间小于当前时间 的考试计划

 */
export const getEndPlanDetail = async data => {
    return request({
        url: 'marking/getendplandetail',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 获取考试计划下的阅卷老师

 */
export const getMarkTeacher = async data => {
  return request({
    url: 'marking/getmarkteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 清空考试计划下的阅卷老师

 */
export const clearMarkTeacher = async data => {
  return request({
    url: 'marking/clearmarkteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 获取考试计划下所有待评的科目

 */
export const getEndPlanSubject = async data => {
  return request({
    url: 'marking/getendplansubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 根据ID获取考试计划的阅卷老师

 */
export const getMarkTeacherById = async data => {
  return request({
    url: 'marking/getmarkteacherbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 根据ID获取考试计划的阅卷老师

 */
export const distributeMarkTask = async data => {
  return request({
    url: 'marking/distributemarktask',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 获取考试计划下阅卷老师的任务量

 */
export const getMarkTeacherTask = async data => {
    return request({
        url: 'marking/getmarkteachertask',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 获取考试计划下阅卷老师的任务量

 */
export const changeMarkTeacherTask = async data => {
    return request({
        url: 'marking/changemarkteachertask',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 重置考试计划下阅卷老师的任务量

 */
export const resetMarkTeacherTask = async data => {
    return request({
        url: 'marking/resetmarkteachertask',
        method: 'post',
        data: Qs.stringify(data)
    });
};

/**
 * 阅卷状态确认 可以阅卷了
 *

 */
export const markStateConfirm = async data => {
    return request({
        url: 'marking/markstateconfirm',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 根据计划id考试科目

 */
export const getSubjectById = async data => {
    return request({
        url: 'marking/getsubjectbyid',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 根据计划id和教师身份证号 获取待评阅的答题卡

 */
export const getAnswerById = async data => {
    return request({
        url: 'marking/getanswerbyid',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 根据计划id和教师身份证号 获取待评阅的答题卡总数

 */
export const getAnswerTotalById = async data => {
    return request({
        url: 'marking/getanswertotalbyid',
        method: 'post',
        data: Qs.stringify(data)
    });
};


/**
 * 根据答题卡id 获取答题内容

 */
export const getAnswerContentById = async data => {
  return request({
    url: 'marking/getanswercontentbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 阅卷老师提交分数

 */
export const submitScore = async data => {
  return request({
    url: 'marking/submitscore',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 根据试卷id 获取答题内容

 */
export const getPaperContentById = async data => {
  return request({
    url: 'marking/getpapercontentbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};
