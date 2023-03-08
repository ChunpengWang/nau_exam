import request from '@/utils/request';
import Qs from 'qs';



/**
 * 查询用户列表

 */
export const getPlan = async data => {
  return request({
    url: 'examination/getplan',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增用户

 */
export const addPlan = async data => {
  return request({
    url: 'examination/addplan',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改用户

 */
export const modifyPlan = async data => {
  return request({
    url: 'examination/modifyplan',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除用户

 */
export const deletePlan = async data => {
  return request({
    url: 'examination/deleteplan',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 获取所有考试计划

 */
export const getAllPlan = async data => {
  return request({
    url: 'examination/getallplan',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 获取不同状态的考试计划
 state 0未发布 1已发布 2已结束
 */
export const getAllPlanByState = async data => {
  return request({
    url: 'examination/getallplanbystate',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * //根据计划ID 获取没被用过的考试科目

 */
export const getNotUsedSubjectById = async data => {
  return request({
    url: 'examination/getnotusedsubjctbyplanid',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * //根据科目ID 获取关联的试卷

 */
export const getAllPaperBySubjectId = async data => {
  return request({
    url: 'examination/getallpaperbysubjectid',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 查询用户列表

 */
export const getPlanSubject = async data => {
  return request({
    url: 'examination/getplansubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增用户

 */
export const addPlanSubject = async data => {
  return request({
    url: 'examination/addplansubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改用户

 */
export const modifyPlanSubject = async data => {
  return request({
    url: 'examination/modifyplansubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除用户

 */
export const deletePlanSubject = async data => {
  return request({
    url: 'examination/deleteplansubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 获取考试计划下的考试数据

 */
export const getPlanStudent = async data => {
  return request({
    url: 'examination/getplanstudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 清空考试计划下的考生数据

 */
export const clearPlanStudent = async data => {
  return request({
    url: 'examination/clearplanstudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};




/**
 * 查询计划场次

 */
export const getPlanScene = async data => {
  return request({
    url: 'examination/getplanscene',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增计划场次

 */
export const addPlanScene = async data => {
  return request({
    url: 'examination/addplanscene',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改计划场次

 */
export const modifyPlanScene = async data => {
  return request({
    url: 'examination/modifyplanscene',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除计划场次

 */
export const deletePlanScene = async data => {
  return request({
    url: 'examination/deleteplanscene',
    method: 'post',
    data: Qs.stringify(data)
  });
};




/**
 * 改变计划的状态
id
 state
 */
export const changePlanState = async data => {
  return request({
    url: 'examination/changeplan',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 根据相关参数查询成绩

 */
export const getAchievementById = async data => {
  return request({
    url: 'examination/getachievementbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 根据相关参数查询成绩

 */
export const getPlanSubjectById = async data => {
  return request({
    url: 'examination/getplansubjectbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 获取及格线比例

 */
export const getAchievementPassById = async data => {
  return request({
    url: 'examination/getachievementpassbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 调整及格分

 */
export const adjustmentPassScoreById = async data => {
  return request({
    url: 'examination/adjustmentpassscorebyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 一键发布考试计划下的成绩

 */
export const oneClickReleaseAchievementById = async data => {
  return request({
    url: 'examination/oneclickreleaseachievementbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 单独发布考试计划下的成绩

 */
export const releaseAchievementById = async data => {
  return request({
    url: 'examination/releaseachievementbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 单独发布考试计划下的成绩

 */
export const planStatisticsById = async data => {
  return request({
    url: 'examination/planstatisticsbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};
