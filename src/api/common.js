import request from '@/utils/request';


/**
 * 上传图片

 */
//
export const uploadApi = async formData => {
    return request.post(`upload`, formData);
};


/**
 * 导入教师数据

 */
//
export const importTeacher = async formData => {
    return request.post(`/importteacher`, formData);
};

/**
 * 导入学生数据

 */
//
export const importStudent = async formData => {
    return request.post(`/importstudent`, formData);
};

/**
 * 导入学生照片数据

 */
//
export const importStudentImg = async formData => {
    return request.post(`/importstudentimg`, formData);
};

/**
 * 导入科目数据

 */
//
export const importSubject = async formData => {
    return request.post(`/importsubject`, formData);
};



/**
 * 导入试题数据

 */
//
export const importQuestion = async formData => {
    return request.post(`/importquestion`, formData);
};


/**
 * 导入考生数据

 */
//
export const importPlanStudent = async formData => {
  return request.post(`/importplanstudent`, formData);
};


/**
 * 导入阅卷老师数据

 */
//
export const importMarkTeacher = async formData => {
  return request.post(`/importmarkteacher`, formData);
};
