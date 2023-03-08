import request from '@/utils/request';
import Qs from 'qs';


/**
 * 查询用户列表

 */
export const getAllSubject = async data => {
  return request({
    url: 'question/getallsubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 查询试题列表

 */
export const getQuestion = async data => {
  return request({
    url: 'question/getquestion',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增试题

 */
export const addQuestionApi = async data => {
  return request({
    url: 'question/addquestion',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改试题

 */
export const modifyQuestion = async data => {
  return request({
    url: 'question/modifyquestion',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除试题

 */
export const deleteQuestion = async data => {
  return request({
    url: 'question/deletequestion',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 修改试题状态

 */
export const changeQuestion = async data => {
  return request({
    url: 'question/changequestion',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 根据科目和题型获取可抽试题的数量

 */
export const getQuestionNum = async data => {
  return request({
    url: 'question/getquestionnum',
    method: 'post',
    data: Qs.stringify(data)
  });
};





/**
 * 查询策略列表

 */
export const getTactics = async data => {
  return request({
    url: 'question/gettactics',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增策略

 */
export const addTactics = async data => {
  return request({
    url: 'question/addtactics',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改策略

 */
export const modifyTactics = async data => {
  return request({
    url: 'question/modifytactics',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除策略

 */
export const deleteTactics = async data => {
  return request({
    url: 'question/deletetactics',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 修改策略状态

 */
export const changeTactics = async data => {
  return request({
    url: 'question/changetactics',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 根据科目id获取可用策略
 relationid 科目id  不传为查全部
 */
export const getTacticsListBySubjectId = async data => {
  return request({
    url: 'question/gettacticsbyid',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 新增试卷

 */
export const addPaperApi = async data => {
  return request({
    url: 'question/addpaper',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 获取试卷列表

 */
export const getPaperApi = async data => {
  return request({
    url: 'question/getpaper',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 删除试卷

 */
export const deletePaperApi = async data => {
  return request({
    url: 'question/deletepaper',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改试卷状态

 */
export const changePaperApi = async data => {
  return request({
    url: 'question/changepaper',
    method: 'post',
    data: Qs.stringify(data)
  });
};
