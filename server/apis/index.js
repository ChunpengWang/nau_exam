const express = require('express');
const router = express.Router();

const common = require('./common.js'); //公共API 导入/上传
const user = require('./user.js'); //用户相关API
const question = require('./question.js'); //试题相关API
const examination = require('./examination.js');//考务相关API
const examinee = require('./examinee.js');//考生相关API
const marking = require('./marking.js');//阅卷相关API

router.use(common);
// 配置路由
router.use('/user', user);
router.use('/question', question);
router.use('/examination', examination);
router.use('/examinee', examinee);
router.use('/marking', marking);

module.exports = router;
