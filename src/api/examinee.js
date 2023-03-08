import request from '@/utils/request';
import Qs from 'qs';



/**
 * 改变计划的状态
 id
 state
 */
export const getPlanListByIdCard = async data => {
  return request({
    url: 'examinee/getplanlistbyidcard',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 改变计划的状态
 id
 state
 */
export const getPlanByIdcard = async data => {
  return request({
    url: 'examinee/getplanbyidcard',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * h获取试卷

 */
export const getPaperById = async data => {
  return request({
    url: 'examinee/getpaperbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * h获取试卷答题卡

 */
export const getAnswerById = async data => {
  return request({
    url: 'examinee/getanswerbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 开始答题

 */
export const startExam = async data => {
  return request({
    url: 'examinee/startexam',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 提交答案

 */
export const submitAnswer = async data => {
  return request({
    url: 'examinee/submitanswer',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 根据身份证号获取成绩

 */
export const getAchievementByIdcard = async data => {
  return request({
    url: 'examinee/getachievementbyidcard',
    method: 'post',
    data: Qs.stringify(data)
  });
};
