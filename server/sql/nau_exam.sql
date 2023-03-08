/*
 Navicat Premium Data Transfer

 Source Server         : 本机
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : nau_exam_copy

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 07/03/2023 23:20:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answer
-- ----------------------------
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer` (
  `answerid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '考生答案id',
  `answercontent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '答案内容 json数据存储；例如，[{试题ID，试题题型，答案内容}，...]',
  `paperid` int DEFAULT NULL COMMENT '关联试卷ID',
  `studentcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '关联考生学号',
  `planid` int DEFAULT NULL COMMENT '关联考试计划ID',
  `answerdate` datetime DEFAULT NULL COMMENT '提交答案的时间',
  `answerflag` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '提交答案标识  0只提交答案 1提交答案并交卷',
  `answerstartdate` datetime DEFAULT NULL COMMENT '答题开始时间',
  `subjectcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '科目编号',
  `isneedmark` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否需要评阅 1为需要',
  `ismark` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否已评阅 1为已评',
  `isdistribute` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否分配阅卷老师  0为分配 1已分配',
  `markteacherid` int DEFAULT NULL COMMENT '关联阅卷老师ID',
  `laborscore` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '-1' COMMENT '人工阅卷得分',
  `systemscore` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '-1' COMMENT '系统得分（自动判分）',
  `reviewcontent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '人工阅卷内容 json [{题型 题目ID 分值 得分},..]',
  `ispass` enum('1','2','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '及格状态 1及格 2不及格  0未判分',
  `isreleasestate` enum('1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '1' COMMENT '成绩发布状态 1未发布 2已发布',
  `studentname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '关联考生姓名',
  `releassetotalscore` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '-1' COMMENT '发布总成绩',
  `idcard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '关联考生身份证号',
  PRIMARY KEY (`answerid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of answer
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for mark_teacher
-- ----------------------------
DROP TABLE IF EXISTS `mark_teacher`;
CREATE TABLE `mark_teacher` (
  `markteacherid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `mobile` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '联系电话',
  `idcard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '身份证号',
  `teachername` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '教师姓名',
  `subjectcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '关联科目编号',
  `planid` int DEFAULT NULL COMMENT '考试计划ID',
  `tasknum` int DEFAULT '0' COMMENT '任务量',
  `reviewednum` int DEFAULT '0' COMMENT '已评阅数量',
  PRIMARY KEY (`markteacherid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of mark_teacher
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for paper
-- ----------------------------
DROP TABLE IF EXISTS `paper`;
CREATE TABLE `paper` (
  `paperid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '试卷ID',
  `papername` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '试卷名称',
  `enable` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '试卷状态 0启用 1禁用',
  `tacticsid` int DEFAULT NULL COMMENT '关联策略id',
  `duration` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '考试时长，单位为分钟',
  `passscore` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '及格分',
  `questionlist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '试题内容，json数据存储；\n[\n{大题型，每小题分数，唯一id，[{小题题干，选项，唯一ID，大题id，是否为正确答案}，...]},\n...\n]',
  `createtime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `subjectid` int DEFAULT NULL COMMENT '关联科目id',
  `totalscore` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '总分',
  PRIMARY KEY (`paperid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of paper
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for plan
-- ----------------------------
DROP TABLE IF EXISTS `plan`;
CREATE TABLE `plan` (
  `planid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '考试计划id',
  `planname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '计划名称',
  `startdate` date DEFAULT NULL COMMENT '开始时间',
  `enddate` date DEFAULT NULL COMMENT '结束时间',
  `state` enum('0','1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '计划状态 0未发布 1已发布 2已结束',
  `subjectids` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '关联科目ID,多个用逗号隔开',
  `paperlist` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '关联试卷数据，json存储  【{科目ID，科目名称，试卷ID，试卷名称},…】',
  `scenelist` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '关联场次数据，json存储 【{场次开始时间，结束数据，考试科目}，。。。】',
  `studentnum` int DEFAULT NULL COMMENT '关联考生总人数',
  `studentnumtotal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '考生科目统计 {科目编号：考生人数}',
  `markstate` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '1' COMMENT '阅卷任务状态  1未确认 2已确认 3阅卷完成',
  PRIMARY KEY (`planid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of plan
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for plan_student
-- ----------------------------
DROP TABLE IF EXISTS `plan_student`;
CREATE TABLE `plan_student` (
  `studentname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '学生姓名',
  `mobile` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '联系电话',
  `idcard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '身份证号',
  `studentcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '学生学号',
  `gender` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '3' COMMENT '性别，1男，2女，3未知',
  `subjectcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '科目编号',
  `planid` int DEFAULT NULL COMMENT '考试计划ID',
  `planstudentid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
  PRIMARY KEY (`planstudentid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of plan_student
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `questionid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '试题id',
  `topic` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '题目',
  `type` enum('1','2','3','4','5') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '题型 1单选2多选3判断4填空5问答',
  `way` enum('1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '判分方式 1自动判分2自动',
  `optionlist` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '选项+答案 json存',
  `referenceanswer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '参考答案',
  `relationid` int DEFAULT NULL COMMENT '关联科目ID',
  `enable` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否禁用，1为禁用',
  PRIMARY KEY (`questionid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=240 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of question
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `studentid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '学生id',
  `studentname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '学生姓名',
  `thumb` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像',
  `mobile` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '联系电话',
  `idcard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '身份证号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '登录密码',
  `enable` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否禁用，1为禁用',
  `studentcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '学生学号',
  `gender` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '3' COMMENT '性别，1男，2女，3未知',
  PRIMARY KEY (`studentid`) USING BTREE,
  UNIQUE KEY `studentcode` (`studentcode`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of student
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for subject
-- ----------------------------
DROP TABLE IF EXISTS `subject`;
CREATE TABLE `subject` (
  `subjectid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '科目id',
  `subjectcode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '科目编号',
  `subjectname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '科目名称',
  `enable` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '禁用状态，1为禁用',
  PRIMARY KEY (`subjectid`,`subjectcode`) USING BTREE,
  UNIQUE KEY `subjectcode` (`subjectcode`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of subject
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for tactics
-- ----------------------------
DROP TABLE IF EXISTS `tactics`;
CREATE TABLE `tactics` (
  `tacticsid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '策略id',
  `tacticsname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '策略名称',
  `relationid` int DEFAULT NULL COMMENT '关联科目id',
  `tacticscontent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '策略内容： json数据存储。数组里的对象为一个大题一个大题的配置。例如：[{题型，抽题数，每题分数},{题型，抽题数，每题分数},...]',
  `enable` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否禁用，1为禁用',
  PRIMARY KEY (`tacticsid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of tactics
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `teacherid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '教师id',
  `teachername` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '教师姓名',
  `thumb` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像',
  `mobile` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '联系电话',
  `idcard` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '身份证号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '登录密码',
  `enable` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否禁用，1为禁用',
  PRIMARY KEY (`teacherid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of teacher
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userid` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户姓名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '密码',
  `thumb` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '头像',
  `mobile` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '联系电话',
  `idcard` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '身份证号',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '登录账号',
  `enable` enum('1','0') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0' COMMENT '是否禁用；1为禁用',
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` (`userid`, `username`, `password`, `thumb`, `mobile`, `idcard`, `account`, `enable`) VALUES (37, '超级管理员', 'e10adc3949ba59abbe56e057f20f883e', NULL, '18812345769', '110101201602012454', 'admin', '0');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
