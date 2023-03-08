import request from '@/utils/request';
import Qs from 'qs';


/**
 * 登录
 1	username	登录账户
 2	password	密码
 3	type        登录类型 1-管理端 2-教师端 3学生端
 */

export const userLogin = async data => {
  return request({
    url: 'user/login',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改密码

 */
export const modifyPwd = async data => {
  return request({
    url: 'user/modifypwd',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 查询用户列表

 */
export const getUser = async data => {
  return request({
    url: 'user/getuser',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增用户

 */
export const addUser = async data => {
  return request({
    url: 'user/adduser',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改用户

 */
export const modifyUser = async data => {
  return request({
    url: 'user/modifyuser',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除用户

 */
export const deleteUser = async data => {
  return request({
    url: 'user/deleteuser',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 修改用户状态

 */
export const changeUser = async data => {
  return request({
    url: 'user/changeuser',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 重置用户密码

 */
export const restUser = async data => {
  return request({
    url: 'user/restuser',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 查询教师列表

 */
export const getTeacher = async data => {
  return request({
    url: 'user/getteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增教师

 */
export const addTeacher = async data => {
  return request({
    url: 'user/addteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改教师

 */
export const modifyTeacher = async data => {
  return request({
    url: 'user/modifyteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除教师

 */
export const deleteTeacher = async data => {
  return request({
    url: 'user/deleteteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 修改教师状态

 */
export const changeTeacher = async data => {
  return request({
    url: 'user/changeteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 重置教师密码

 */
export const restTeacher = async data => {
  return request({
    url: 'user/restteacher',
    method: 'post',
    data: Qs.stringify(data)
  });
};




/**
 * 查询学生列表

 */
export const getStudent = async data => {
  return request({
    url: 'user/getstudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增学生

 */
export const addStudent = async data => {
  return request({
    url: 'user/addstudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改学生

 */
export const modifyStudent = async data => {
  return request({
    url: 'user/modifystudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除学生

 */
export const deleteStudent = async data => {
  return request({
    url: 'user/deletestudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 修改学生状态

 */
export const changeStudent = async data => {
  return request({
    url: 'user/changestudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 重置学生密码

 */
export const restStudent = async data => {
  return request({
    url: 'user/reststudent',
    method: 'post',
    data: Qs.stringify(data)
  });
};



/**
 * 查询科目列表

 */
export const getSubject = async data => {
  return request({
    url: 'user/getsubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 新增科目

 */
export const addSubject = async data => {
  return request({
    url: 'user/addsubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};


/**
 * 修改科目

 */
export const modifySubject = async data => {
  return request({
    url: 'user/modifysubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 删除科目

 */
export const deleteSubject = async data => {
  return request({
    url: 'user/deletesubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};

/**
 * 修改科目状态

 */
export const changeSubject = async data => {
  return request({
    url: 'user/changesubject',
    method: 'post',
    data: Qs.stringify(data)
  });
};
