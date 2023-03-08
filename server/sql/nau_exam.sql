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

 Date: 08/03/2023 20:36:55
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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of answer
-- ----------------------------
BEGIN;
INSERT INTO `answer` (`answerid`, `answercontent`, `paperid`, `studentcode`, `planid`, `answerdate`, `answerflag`, `answerstartdate`, `subjectcode`, `isneedmark`, `ismark`, `isdistribute`, `markteacherid`, `laborscore`, `systemscore`, `reviewcontent`, `ispass`, `isreleasestate`, `studentname`, `releassetotalscore`, `idcard`) VALUES (43, '[{\"questionid\":290,\"type\":\"1\",\"answer\":[\"aafb452c4a30486eafdce685a5b36ccb\"],\"answerScoreValue\":10},{\"questionid\":291,\"type\":\"2\",\"answer\":[\"ff377e94be76cf8b5105bd0beb99f06b\",\"107889e020db36d417df1605d5b58f61\"],\"answerScoreValue\":0},{\"questionid\":292,\"type\":\"3\",\"answer\":[\"bc30bed2f15aac9dd970e708a555bf8a\"],\"answerScoreValue\":10},{\"questionid\":293,\"type\":\"4\",\"answer\":{\"1\":\"黄河入海流\",\"2\":\"更上一层楼\"},\"answerScoreValue\":0},{\"questionid\":294,\"type\":\"4\",\"answer\":{\"1\":\"白日依山尽，黄河入海流。\",\"2\":\"会当凌绝顶，一览众山小。\"},\"answerScoreValue\":6},{\"questionid\":295,\"type\":\"5\",\"answer\":{\"1\":\"想要看的远，就的爬的高\"},\"answerScoreValue\":23},{\"questionid\":296,\"type\":\"1\",\"answer\":[\"7130fb1476fbce2147894aab77038fd1\"],\"answerScoreValue\":10}]', 34, '001', 33, '2023-03-08 20:03:30', '1', '2023-03-08 20:28:30', '10001', '1', '1', '1', 112, '29', '30', '[{\"type\":\"4\",\"questionid\":294,\"score\":\"10\",\"scoreValue\":\"6\"},{\"type\":\"5\",\"questionid\":295,\"score\":\"40\",\"scoreValue\":\"23\"}]', '2', '2', '王柏芝', '59', '440101200502013400');
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
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of mark_teacher
-- ----------------------------
BEGIN;
INSERT INTO `mark_teacher` (`markteacherid`, `mobile`, `idcard`, `teachername`, `subjectcode`, `planid`, `tasknum`, `reviewednum`) VALUES (112, '15344873710', '440101200502013734', '卫代芙', '10001', 33, 1, 1);
INSERT INTO `mark_teacher` (`markteacherid`, `mobile`, `idcard`, `teachername`, `subjectcode`, `planid`, `tasknum`, `reviewednum`) VALUES (113, '13512907952', '440101200502019933', '展高原', '10001', 33, 0, 0);
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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of paper
-- ----------------------------
BEGIN;
INSERT INTO `paper` (`paperid`, `papername`, `enable`, `tacticsid`, `duration`, `passscore`, `questionlist`, `createtime`, `subjectid`, `totalscore`) VALUES (34, '语文联考卷', '0', 13, '100', '60', '[{\"type\":\"1\",\"num\":\"2\",\"score\":\"10\",\"questionList\":[{\"topic\":\"李白是哪个朝代的？\",\"questionid\":296,\"type\":\"1\",\"way\":\"1\",\"referenceanswer\":\"\",\"optionList\":[{\"value\":\"唐\",\"isRight\":1,\"oid\":\"7130fb1476fbce2147894aab77038fd1\"},{\"value\":\"宋\",\"isRight\":0,\"oid\":\"bbd0f0f805b9663bdb34bd3954c2aff5\"},{\"value\":\"元\",\"isRight\":0,\"oid\":\"68142b4a3afa441eddda28e48b248240\"},{\"value\":\"明\",\"isRight\":0,\"oid\":\"4a5133798c0549ea5bd4fe03a303d430\"}]},{\"topic\":\"以下被称为“诗仙”的诗人是？\",\"questionid\":290,\"type\":\"1\",\"way\":\"1\",\"referenceanswer\":\"李白是被称为“诗仙”，杜甫被称为“诗圣”。白居易被称为香山居士，也被称为醉吟先生。李清照被称为千古第一才女。\\n\",\"optionList\":[{\"value\":\"李白\",\"isRight\":1,\"oid\":\"aafb452c4a30486eafdce685a5b36ccb\"},{\"value\":\"杜甫\",\"isRight\":0,\"oid\":\"cc6960650bdba1e01dedb1203a851298\"},{\"value\":\"白居易\",\"isRight\":0,\"oid\":\"73057a14d0a4081d6e7bcede8eee47ac\"},{\"value\":\"李清照\",\"isRight\":0,\"oid\":\"3fee48b5164f1487018556b3490f2980\"}]}],\"bigid\":\"cda0e638c2ebd8ce62383c47f5929ab5\"},{\"type\":\"2\",\"num\":\"1\",\"score\":\"10\",\"questionList\":[{\"topic\":\"以下哪位是唐朝的诗人？\",\"questionid\":291,\"type\":\"2\",\"way\":\"1\",\"referenceanswer\":\"杜甫和白居易是唐朝的，陆游和李清照被是宋朝的。\\n\",\"optionList\":[{\"value\":\"陆游\",\"isRight\":0,\"oid\":\"ff377e94be76cf8b5105bd0beb99f06b\"},{\"value\":\"杜甫\",\"isRight\":1,\"oid\":\"107889e020db36d417df1605d5b58f61\"},{\"value\":\"白居易\",\"isRight\":1,\"oid\":\"8362bcec1f8930cf83fb6733e7782172\"},{\"value\":\"李清照\",\"isRight\":0,\"oid\":\"e44b49283a85c3d75a552aed21789fbe\"}]}],\"bigid\":\"81ebeaba4428e6476bc31515c76b70e3\"},{\"type\":\"3\",\"num\":\"1\",\"score\":\"10\",\"questionList\":[{\"topic\":\"李白是唐朝一位伟大的诗人，被称为“诗圣”\",\"questionid\":292,\"type\":\"3\",\"way\":\"1\",\"referenceanswer\":\"李白是唐朝的，但他被称为“诗仙”，所以这道题是错误的。\\n\",\"optionList\":[{\"value\":\"正确\",\"isRight\":0,\"oid\":\"f2e717d01612e47f3c2974a8c929c07d\"},{\"value\":\"错误\",\"isRight\":1,\"oid\":\"bc30bed2f15aac9dd970e708a555bf8a\"}]}],\"bigid\":\"6a8502e7fac8c915248a8434c486162b\"},{\"type\":\"4\",\"num\":\"2\",\"score\":\"10\",\"questionList\":[{\"topic\":\"请默写出李白的一首古诗:__。\\n请默写出杜甫的一首古诗:__。\",\"questionid\":294,\"type\":\"4\",\"way\":\"2\",\"referenceanswer\":\"李白的诗例如：《静夜思》\\n床前明月光，疑是地上霜。\\n举头望明月，低头思故乡。\\n杜甫的诗例如：《绝句》\\n两个黄鹂鸣翠柳，一行白鹭上青天。\\n窗含西岭千秋雪，门泊东吴万里船。\",\"optionList\":[{\"value\":\"\",\"oid\":\"95494cf100e73bcc262caa2b6fc6994a\"},{\"value\":\"\",\"oid\":\"b328dd4e06b549d154908dafc2213d17\"}]},{\"topic\":\"白日依山尽，___，欲穷千里目，___。\",\"questionid\":293,\"type\":\"4\",\"way\":\"1\",\"referenceanswer\":\"这是李白的一首好诗\",\"optionList\":[{\"value\":\"欲穷千里目\",\"isRight\":1,\"oid\":\"a13d409b1c6dc5072a383c7657afaadc\"},{\"value\":\"更上一层楼\",\"isRight\":1,\"oid\":\"97ca5dfded9f61e5ba5579b5fc265d2a\"}]}],\"bigid\":\"544c48c8129c3dc762834a56fb9b5f9d\"},{\"type\":\"5\",\"num\":\"1\",\"score\":\"40\",\"questionList\":[{\"topic\":\"请解释一下“白日依山尽，黄河入海流。欲穷千里目，更上一层楼。”这首古诗，作者想表达的中心思想。\",\"questionid\":295,\"type\":\"5\",\"way\":\"2\",\"referenceanswer\":\"意思是：落日依傍着远山天光辉煌，黄河冲涌起浪滔流入海疆。要放眼远眺尽览美景，唯有举步攀登向更高层楼迈上。这首诗表面上是写登楼远眺 的观景之作，却揭示了一个站得高 才能望得远的哲理，具有奋发向上 的精神，不愧是千古传诵的名作。 诗意是，白日衔山，就要落尽了，滔 滔黄河东流入海。想要看尽千里之 外的景物，还需要再登上一层楼。\",\"optionList\":[{\"value\":\"\",\"oid\":\"2d2ef10a9a9341473b7f932489a87a82\"}]}],\"bigid\":\"ac691349e1fb9eda6f05db0bc37aab7c\"}]', '2023-03-08 20:09:24', 37, '100');
INSERT INTO `paper` (`paperid`, `papername`, `enable`, `tacticsid`, `duration`, `passscore`, `questionlist`, `createtime`, `subjectid`, `totalscore`) VALUES (35, 'PMP模拟卷I', '0', 14, '120', '67', '[{\"type\":\"1\",\"num\":\"4\",\"score\":\"5\",\"questionList\":[{\"topic\":\"当一个敏捷团队进行第七次迭代时，一个新相关方加入了该项目。相关方经常联系团队成员以请求信息并质疑他们的方法。Scrum主管注意到团队的生产力下降了。对于Scrum主管来说，最好的行动方案是什么？\",\"questionid\":242,\"type\":\"1\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： 敏捷实践指南 页码：P34 章节：4.2.1 仆人式领导的职责：仆人式领导通过管理关系， 在团队内和组织中建立沟通与协作。这些关系可以帮助领导在组织中得心应手地为团队提供支持。这种支持有助于消除障碍，促进团队理顺过程。 在敏捷实践中，项目经理重要的核心工作就是消除障碍。\",\"optionList\":[{\"value\":\"清除妨碍团队进展的障碍和阻碍\",\"isRight\":1,\"oid\":\"3e7d0918ad2a3a00eb31e73d650a80ae\"},{\"value\":\"鼓励团队与相关方互动，并满足他们的需求 \",\"isRight\":0,\"oid\":\"bde34b22df49d369483fa7ff190ca82a\"},{\"value\":\"将团队从相关方和任何其他外部影响中隔离出来\",\"isRight\":0,\"oid\":\"d5422008c8711d04c2e43198b2fd020e\"},{\"value\":\"为团队提供他们需要的任何东西，以提高他们的积极性和生产力\",\"isRight\":0,\"oid\":\"c015d3542c306845cafc982cf8667942\"}]},{\"topic\":\"你被分配到一个软件开发项目。产品需求在一开始就没有明确定义。因此，决定是使用敏捷框架来开发产品。项目的其他方面将使用传统的瀑布式项目管理方法进行管理。以下哪一项可能会花费较少的时间来开发和/或实现该项目？\",\"questionid\":249,\"type\":\"1\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P88 章节：4.2.3.1 变更管理计划：描述在整个项目期间如何正式审批和采纳变更请求。 敏捷中没有变更管理计划。因此敏捷部门无须制定。\",\"optionList\":[{\"value\":\"项目章程\",\"isRight\":0,\"oid\":\"25b1fe3f4363e7e7fbe63f4a322cfef6\"},{\"value\":\"问题日志\",\"isRight\":0,\"oid\":\"555d70f45fc528b1dd634bad7b59230f\"},{\"value\":\"变更管理计划\",\"isRight\":1,\"oid\":\"d1f37934dd182604f348f423ce3c7afd\"},{\"value\":\"确认范围过程\",\"isRight\":0,\"oid\":\"93aa1d6825151e67b04b9ac128911158\"}]},{\"topic\":\" 在一个职能型组织中，一位关键的项目资源在咨询项目经理之前直接与客户进行沟通。这位资源之前经常发生这种问题，该资源已同意所有客户沟通必须先得到项目经理的批准。 项目经理应该怎么做？\",\"questionid\":243,\"type\":\"1\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P47 章节：2.4.4.2 职能型：联络员，无权限； 矩阵型：项目经理，一定权限 ；项目型：项目经理，所有权限 职能型组织中, 团队的行为只能找职能经理沟通。\",\"optionList\":[{\"value\":\"与该资源的职能经理开会，讨论该资源的行为\",\"isRight\":1,\"oid\":\"c0c41ca0a7b7cb18307e6acae9f4d29b\"},{\"value\":\"召开团队会议以识别并纠正该资源的错误\",\"isRight\":0,\"oid\":\"a5d442698a67c72a86ba66f281b59d48\"},{\"value\":\"与项目发起人召开会议，以讨论该资源的行为\",\"isRight\":0,\"oid\":\"eb6bae7dc7b1a58dbdacb4b2786983c1\"},{\"value\":\"与客户开会以确认所有沟通都应该通过项目经理\",\"isRight\":0,\"oid\":\"9c3b06a0ebd6e05807b5583d5584f11b\"}]},{\"topic\":\"项目经理与多位高管相关方一起参与一个生命周期替换项目，其中一位相关方强烈反对该项目。若要获得该相关方的支持，项目经理应该怎么做？\",\"questionid\":247,\"type\":\"1\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P512 章节：13.1.2.3 相关方分析： 相关方分析会产生相关方清单和关于相关方的各种信息， 例如，在组织内的位置、在项目中的角色、与项目的利害关系、期望、态度（对项目的支持程度），以及对项目信息的兴趣。 先进行相关方分 析，再更新参与 计划。B在D后面。 A确认其支持 不对。\",\"optionList\":[{\"value\":\"制定权力/影响力方格，以确定该相关方影响项目的能力并确认其支持\",\"isRight\":0,\"oid\":\"2735ccd10383a203e4c97e0664013f1a\"},{\"value\":\"创建相关方参与计划，以确定该相关方的项目支持水平\",\"isRight\":0,\"oid\":\"8b0dc33e92b393dce1def7bf5d0c225d\"},{\"value\":\"将该问题升级上报给项目推动者，并请求替换一个支持该项目的相关方\",\"isRight\":0,\"oid\":\"def852962cff931c5cf080b5a86dc03c\"},{\"value\":\"执行相关方分析，以确定缺乏项目支持的原因并对这些原因进行优先级排序\",\"isRight\":1,\"oid\":\"8b564abd74c653f7bd403229fec0068a\"}]}],\"bigid\":\"a579a7bd1cf80b8751a696d19d36fdbd\"},{\"type\":\"2\",\"num\":\"4\",\"score\":\"5\",\"questionList\":[{\"topic\":\"在桥梁建设项目中，项目经理正在监督和控制项目构件的各种变化。 下列哪一项最可能需要经过批准的变更请求才能进行变更?(选择四个)\",\"questionid\":256,\"type\":\"2\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P113 章节：4.6 在基准确定之前， 变更无需正式受控于实施整体变更控制过程。 不涉及基准一般不用审批。 D任务状态不需要审批E相关方登记册一般不给相关方审批\",\"optionList\":[{\"value\":\"有人建议将预测式开发方法改为混合开发方法\",\"isRight\":1,\"oid\":\"7daa4ac6a6598bc80a0a8f90be84ffa6\"},{\"value\":\"项目的运行超出了预算，需要修改成本基线以反映实际情况\",\"isRight\":1,\"oid\":\"a7cd6be317dce949e18a6c2fe5c99693\"},{\"value\":\"项目发起人想要向配置管理计划添加一个文档\",\"isRight\":1,\"oid\":\"833b936639ce99d7ab5285fd065618db\"},{\"value\":\"几项任务的修订状态需要反映在项目进度表中\",\"isRight\":0,\"oid\":\"31776481cc18dedbb0c10462d9f1c049\"},{\"value\":\"一名高级主管建议更新项目生命周期描述，以增加一个阶段\",\"isRight\":1,\"oid\":\"48961102ce2166e98bf9263ed330ffc8\"},{\"value\":\"刚刚确定了一个新的利益相关者，需要将其添加到利益相关者登记册中\",\"isRight\":0,\"oid\":\"d34be50a7af0d9ee0f512a4f5ebf7f8e\"}]},{\"topic\":\"一位项目经理正在为一家初创公司领导一个敏捷项目。虽然这是该组织的第一个此类项目，但可能会有更多类似的项目紧随其后。因此，项目经理希望确保在这个项目中获得的知识能够用于未来的项目。 下列哪一种做法将最好地支持知识转移，以造福未来的项目?(选择三个)\",\"questionid\":250,\"type\":\"2\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P104 章节：4.4.3.1 经验教训登记册：在项目早期创建。在整个项目期间，它 可以作为很多过程的输入，也可以作为输出而不断更新。 在项目或阶段结束时，把相关信息归入经验教训知识库，成为组织过程资产的一部分。 D不存在知识管理计划。 E配置管理计划不存档项目知识。\",\"optionList\":[{\"value\":\"记录在整个项目中学习到的经验教训中获得的知识\",\"isRight\":1,\"oid\":\"e01ef5b6b0883689db9c2e6ae60f7b1e\"},{\"value\":\"确保经验教训登记册最后定稿并转移到经验教训存储库\",\"isRight\":1,\"oid\":\"8ebfadf21b51c9470034f8edfb9730e8\"},{\"value\":\"与项目团队和相关相关方定期召开回顾会议\",\"isRight\":1,\"oid\":\"2ab1d11f4f406790ac525f1cf1284248\"},{\"value\":\"定期审查作为项目管理计划组成部分的知识管理计划\",\"isRight\":0,\"oid\":\"dee190b16273e23185fb525e166f8ec7\"},{\"value\":\"确保在配置管理计划中将所学到的经验记录作为配置元素列出\",\"isRight\":0,\"oid\":\"edd064cd869a2ac5b9013db4d51e6783\"}]},{\"topic\":\"一个大型建设项目正处于实施阶段。根据项目进度表，今天项目经理有三个项目新相关方的单独指导会议。 当指导这些相关方时，项目经理可能执行下列哪一个项目管理过程?(选择两个)\",\"questionid\":254,\"type\":\"2\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P379 章节：10.2 管理沟通：管理沟通是确保项目 信息及时且恰当地收集、 生成、发布、存储、 检索、管理、监督和最终处置的过程。 项目经理按计划做事，说明是在执行阶段，只有DE是执行\",\"optionList\":[{\"value\":\"制定项目章程\",\"isRight\":0,\"oid\":\"272a77b2cce02ca1318c374d1e58e4d6\"},{\"value\":\"制定沟通管理计划\",\"isRight\":0,\"oid\":\"7ec7a8584742f8774578822a4933617a\"},{\"value\":\"识别相关方\",\"isRight\":0,\"oid\":\"fe526b1eeb22a217755a8421699b83f5\"},{\"value\":\"管理沟通\",\"isRight\":1,\"oid\":\"4a26dd0bbe2d06bd801fec1c7c4a7651\"},{\"value\":\"建设团队\",\"isRight\":1,\"oid\":\"bcef343858b0f89c14faba37bdbd132c\"}]},{\"topic\":\"项目经理正在制定进度管理计划。由于客户表示需要尽早频繁地交付商业价值，因此项目经理选择将迭代计划与待办事项列表合并。该项目的进度管理计划中需要解决以下哪项？（选择三项）\",\"questionid\":255,\"type\":\"2\",\"way\":\"1\",\"referenceanswer\":\"知识点出处：PMBOK 6th 页码：P177 章节：6 项目进度管理的发展趋势和新兴实践：具有未完项的迭代型进度计划。这是一种基于适应型生命周期的滚动式规划（B），例如敏捷的产品开发方法。这种方法将需求记录在用户故事中（C），然后在建造之前按先级排序（E）并优化用户故事，最后在规定的时间盒内开发产品功能。 具有未完成项的迭代型进度计划，而非按需进度计划，因此不选A。\",\"optionList\":[{\"value\":\"在资源可用时使用看板面板来从待办事项列表拉动工作\",\"isRight\":0,\"oid\":\"638c0d8b3f3464763987c7973ac0718e\"},{\"value\":\"使用基于适应型生命周期的滚动式规划\",\"isRight\":1,\"oid\":\"2e9b98afad81c9a1ad16e235467b867d\"},{\"value\":\"以用户故事的形式记录需求\",\"isRight\":1,\"oid\":\"7f69ecd1e241f2d3c35b808fb8c2bf4d\"},{\"value\":\"在初始项目计划期间将工作包分解为活动清单\",\"isRight\":0,\"oid\":\"d97ce54c5061f75ee588ef3ff211ae2a\"},{\"value\":\"在项目待办事项中确定并优化用户故事的优先级\",\"isRight\":1,\"oid\":\"2989426ca8aeb88dc76275b3ce56307a\"}]}],\"bigid\":\"c51c0fcf34e8fa0dfbebf66ddbb4fa69\"},{\"type\":\"3\",\"num\":\"4\",\"score\":\"5\",\"questionList\":[{\"topic\":\"项目执行阶段，发现一个子团队没有为约定的项目目标工作。项目经理应该资源管理计划。\",\"questionid\":262,\"type\":\"3\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P318 章节：9.1.3.1 资源管理计划——角色与职责： • 角色 • 职权 • 职责 • 能力 子团队的工作职责不清，需要看资源管理计划。\",\"optionList\":[{\"value\":\"正确\",\"isRight\":1,\"oid\":\"a618ee6ca1adeb058c0641b98e6c7d40\"},{\"value\":\"错误\",\"isRight\":0,\"oid\":\"c00615b4c430b55a2a697301efa5fdeb\"}]},{\"topic\":\"一个使用新技术的复杂敏捷项目被技术挑战、不断变更的优先级、严格的截止日期和客户对敏捷交付方法的不熟悉所困扰。这种环境会给团队成员带来压力和挫折。他们中的许多人开始找项目经理，抱怨这些问题。项目经理首先应该提交变更请求。\",\"questionid\":266,\"type\":\"3\",\"way\":\"1\",\"referenceanswer\":\"知识点出处：敏捷实践指南 页码：P35 章节：4.2.1.2 消除组织障碍： 仆人式领导还应该关注其他冗长的过程，这些过程往往造成瓶颈问题，阻碍团队或组织的敏捷性。可能需要处理的过程或部门的例子包括，财务部门、变更控制委员会或审计部门。仆人式领导可以与他人携手合作，共同质疑和审核他们的过程，为敏捷团队和领导提供支持。 团队促进者消除组织障碍。\",\"optionList\":[{\"value\":\"正确\",\"isRight\":0,\"oid\":\"0a4e781d655ff1c0e26ded031e88ac45\"},{\"value\":\"错误\",\"isRight\":1,\"oid\":\"107445d574196294508e82e8a356f536\"}]},{\"topic\":\" 项目经理说：“我现在不能处理这件事。\\\"此时，该项目经理用撤退冲突的解决技巧。\",\"questionid\":259,\"type\":\"3\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P349 章节：9.5.2.1 撤退/回避：从实际或潜在冲突中退出，将问题推迟到准备充分的时候，或者将问题推给其他人员解决。 对项目影响不大的时候，项目经理可以选择回避。\",\"optionList\":[{\"value\":\"正确\",\"isRight\":1,\"oid\":\"397a19b337a0778cb21a03b33db4ceeb\"},{\"value\":\"错误\",\"isRight\":0,\"oid\":\"468f7a3a65423255cc823178b7ad325b\"}]},{\"topic\":\"在项目会议期间,一个团队发现三个月前关闭的问题仍然处于活跃状态,并对项目的预算产生负面影响。若要防止这种情况再次发生,项目经理可以更新问题日志，并监督纠正措施。\",\"questionid\":267,\"type\":\"3\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P96 章节：4.3.3.3 问题日志 ：问题日志可以帮助项目经理有效跟进和管理问题，确保它们得到调查和解决。作为本过程的输出，问题日志被首次创建，尽管在项目期间任何时候都可能发生问题。在整个项目生命周期应该随同监控活动更新问 题日志。 问题解决以后，要更新问题日志，同时审查问题是否真正关闭。\",\"optionList\":[{\"value\":\"正确\",\"isRight\":1,\"oid\":\"fb6d7f5085810446efc57a275dd7122e\"},{\"value\":\"错误\",\"isRight\":0,\"oid\":\"7dbbde6dd00c139f9340406bad69e9d7\"}]}],\"bigid\":\"2e78acf9ed7d26323807dcb0be2831dc\"},{\"type\":\"4\",\"num\":\"4\",\"score\":\"5\",\"questionList\":[{\"topic\":\"由于没有空，具有批准权限的相关方拒绝了参与项目开工会议的邀请。该项目时间紧迫，及时开工对于满足截止日期至关重要。项目经理应该做______？\",\"questionid\":274,\"type\":\"4\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P86 章节：4.2.2.4 Kick-off 会议：项目开工会议通常意味着规 划阶段结束和执行阶段开始， 旨在传达项目目标、获得团队对项目的承诺，以及阐明每个相关方的角色和职责。 规划已经结束， 就等着审批后执行了，此时应尽快解决。\",\"optionList\":[{\"value\":\"升级上报给项目发起人\",\"isRight\":1,\"oid\":\"b940e3eaf13632ca9466c5a87dd3c918\"}]},{\"topic\":\"你正在领导一个开发新智能手机的项目。因为你要预测需求的许多变更，并不断从相关方那里得到反馈来调整智能手机，所以工作将以小的增量迭代完成。然而，这款智能手机的摄像头将由一家拒绝以渐进方式合作的供应商开发。你为该项目选择______项目管理方法是最好的？\",\"questionid\":275,\"type\":\"4\",\"way\":\"2\",\"referenceanswer\":\"知识点出处：敏捷实践指南 页码：P26 章节：3.1.6 混合生命周期的特征：对于整个项目，没有必要使用单一的方法。为达到特定的目标，项目经常要结合不同的生命周期要素。预测、迭代、增量和/或敏捷方法的组合就是一种混合方法。 从题干描述来看，手机开发方法主要为敏捷，摄像头为预测。\",\"optionList\":[{\"value\":\"\",\"oid\":\"0825c0d7b132c1addf2fb4e0a298e391\"}]},{\"topic\":\"项目经理希望在新项目中使用一名特定供应商。该供应商目前正在为项目经理管理的另一个项目工作。项目经理希望在开始为新项目工作之前，先完成当前项目。在供应商开始为新项目工作之前，项目经理应该______？\",\"questionid\":278,\"type\":\"4\",\"way\":\"2\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P498 章节：12.3.2.5 采购审计： 审计是对采购过程的结构化审查。应该在采购合同中明确规定与审计有关的权利和义务。 买方的项目经理和卖方的项目经理都应该关注审计结果， 以便对项目进行必要调整。 注意题干中提到的问题的逻辑关系\",\"optionList\":[{\"value\":\"\",\"oid\":\"ac955e12249c83ff2979b714ddfdce80\"}]},{\"topic\":\"客户希望增加股东权益的总和，提高其在全球市场的品牌知名度。客户的主要目标是______？\",\"questionid\":271,\"type\":\"4\",\"way\":\"1\",\"referenceanswer\":\"知识点出处： PMBOK 6th 页码：P7 章节：1.2.1 有形效益的例子包括： • 货币资产； • 股东权益； • 公共事业； • 固定设施； • 工具； • 市场份额。 股东权益属于有形效益。\",\"optionList\":[{\"value\":\"提高商业价值\",\"isRight\":1,\"oid\":\"c9f503b60a152a48d5042046027b17a8\"}]}],\"bigid\":\"7615da56e5088f2805c4dc334a2b978c\"},{\"type\":\"5\",\"num\":\"2\",\"score\":\"10\",\"questionList\":[{\"topic\":\"一个期限很短的项目关键相关方希望避免质量控制。项目经理知道必须提供最低质量水平。项目经理应当使用什么工具或技术？\",\"questionid\":289,\"type\":\"5\",\"way\":\"2\",\"referenceanswer\":\"知识点出处：PMBOK 6th 页码：P282 章节：8.1.2.3 成本效益分析：成本效益分析可帮助项目经理确定规划的质量活动是否有效利用了成本。 相关方不想在控制质量上花钱，有可能导致大的返工或召回成本，要使用成本效益分析说服相关方。\",\"optionList\":[{\"value\":\"\",\"oid\":\"cda456e18d94e6836dfedcddefbfa543\"}]},{\"topic\":\"你正在管理一个项目团队，该团队最新新增来自另一个国家的成员。他们的角色已经被概述为初步的团队章程。然而，你已经注意到团队中相当缺乏对文化差异的接受，这导致了频繁的冲突。 哪一种技巧可以在这种情况下帮助你?\",\"questionid\":282,\"type\":\"5\",\"way\":\"2\",\"referenceanswer\":\"知识点出处：PMBOK 6th 页码：P336 章节：9.4 建设团队：建设团队是提高工作能力，促进团队成员互动，改善团队整体氛围，以提高项目绩效的 过程。 本过程的主要作用是，改进团队协作、增强人际关系技能、激励员工、减少摩擦以及提升整体项目绩效。\",\"optionList\":[{\"value\":\"\",\"oid\":\"9322f0810dbf31176e7364210ea90671\"}]}],\"bigid\":\"e016574be715a518710951fc18b4fdfb\"}]', '2023-03-08 20:10:02', 38, '100');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of plan
-- ----------------------------
BEGIN;
INSERT INTO `plan` (`planid`, `planname`, `startdate`, `enddate`, `state`, `subjectids`, `paperlist`, `scenelist`, `studentnum`, `studentnumtotal`, `markstate`) VALUES (31, '年终考核', '2023-03-08', '2023-03-09', '0', '37,38', '[{\"subjectid\":\"37\",\"subjectname\":\"语文\",\"subjectcode\":\"10001\",\"papername\":\"语文联考卷\",\"paperid\":\"34\",\"id\":\"84907ef96857b8ea78e2a559ffb9de29\"},{\"subjectid\":\"38\",\"subjectname\":\"PMP\",\"subjectcode\":\"10002\",\"papername\":\"PMP模拟卷I\",\"paperid\":\"35\",\"id\":\"da6244b0afa5b31a3143c06a274385c1\"}]', '[{\"subjectid\":\"37\",\"subjectname\":\"语文\",\"startdate\":\"2023-03-09 06:00:00\",\"enddate\":\"2023-03-09 21:00:00\",\"id\":\"a03e9a9d164a59b1071d3d722de66973\"},{\"subjectid\":\"38\",\"subjectname\":\"PMP\",\"startdate\":\"2023-03-09 21:00:00\",\"enddate\":\"2023-03-09 23:59:00\",\"id\":\"8dda1c170a01700c64d0a791dc727791\"}]', 21, '{\"10001\":10,\"10002\":11}', '1');
INSERT INTO `plan` (`planid`, `planname`, `startdate`, `enddate`, `state`, `subjectids`, `paperlist`, `scenelist`, `studentnum`, `studentnumtotal`, `markstate`) VALUES (32, '高等教育全国联考', '2023-03-09', '2023-03-25', '1', '37,38', '[{\"subjectid\":\"37\",\"subjectname\":\"语文\",\"subjectcode\":\"10001\",\"papername\":\"语文联考卷\",\"paperid\":\"34\",\"id\":\"b4475c2909a6eafc38e5407ab63e37a1\"},{\"subjectid\":\"38\",\"subjectname\":\"PMP\",\"subjectcode\":\"10002\",\"papername\":\"PMP模拟卷I\",\"paperid\":\"35\",\"id\":\"ed606b5e1f738c9ed71a46b7e5a1f03d\"}]', '[{\"subjectid\":\"38\",\"subjectname\":\"PMP\",\"startdate\":\"2023-03-09 09:00:00\",\"enddate\":\"2023-03-15 21:00:00\",\"id\":\"498028e6d9dc7d579748b14354405b34\"},{\"subjectid\":\"37\",\"subjectname\":\"语文\",\"startdate\":\"2023-03-16 08:18:00\",\"enddate\":\"2023-03-24 19:13:13\",\"id\":\"14670f1357c67240ebccc1afe85fd162\"}]', 21, '{\"10001\":10,\"10002\":11}', '1');
INSERT INTO `plan` (`planid`, `planname`, `startdate`, `enddate`, `state`, `subjectids`, `paperlist`, `scenelist`, `studentnum`, `studentnumtotal`, `markstate`) VALUES (33, '期中语文测试', '2023-03-09', '2023-03-10', '2', '37', '[{\"subjectid\":\"37\",\"subjectname\":\"语文\",\"subjectcode\":\"10001\",\"papername\":\"语文联考卷\",\"paperid\":\"34\",\"id\":\"149cd8234076988ef34e491414774a11\"}]', '[{\"subjectid\":\"37\",\"subjectname\":\"语文\",\"startdate\":\"2023-03-09 04:00:00\",\"enddate\":\"2023-03-10 22:00:00\",\"id\":\"98049ce516ac9855d3435e609c55575e\"}]', 2, '{\"10001\":2}', '2');
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
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of plan_student
-- ----------------------------
BEGIN;
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('王柏芝', '15000829698\n', '440101200502013400', '001', '2', '10001', 31, 130);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('钱楚琪', '19809615007', '42010119720729650X', '002', '2', '10001', 31, 131);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('马娆云', '19146798687', '420101197707103196', '009', '1', '10001', 31, 132);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('尤旻越', '15364755774', '420101196207245767', '004', '2', '10001', 31, 133);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('经冶晗', '15823757026', '42010119900926600X', '003', '2', '10001', 31, 134);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('甄斌银', '14564797644', '420101197707158955', '010', '1', '10002', 31, 135);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('傅逸意', '15802603560', '420101196306132215', '005', '1', '10001', 31, 136);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('诸队镇', '13284721023', '420101196802229294', '007', '1', '10001', 31, 137);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('甄晏飙', '15508347323', '420101196904231061', '008', '2', '10001', 31, 138);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('翁晟蓉', '14703763129', '420101196409271218', '006', '1', '10001', 31, 139);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('薛澄然', '13772049566', '420101198605251037', '015', '1', '10002', 31, 140);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('松婕昭', '15618399645', '420101198009193141', '012', '2', '10002', 31, 141);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('宋椒杏', '17013037506', '420101198304171105', '013', '2', '10002', 31, 142);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('芮峻坤', '13505344627', '420101197709148152', '011', '1', '10002', 31, 143);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('褚川灿', '17108843596', '420101198604259926', '014', '2', '10002', 31, 144);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('周翊功', '13300186402', '420101199203239750', '017', '1', '10002', 31, 145);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('吴可泳', '18236992264', '420101198703268027', '016', '2', '10002', 31, 146);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('梅高典', '17134476969', '420101199506149699', '019', '1', '10002', 31, 147);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('毕俐李', '15836785160', '420101199508292245', '020', '2', '10001', 31, 148);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('乌威晟', '13949279639', '420101199803235614', '021', '1', '10002', 31, 149);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('虞荔蕴', '17273523584', '420101199405156662', '018', '2', '10002', 31, 150);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('王柏芝', '15000829698\n', '440101200502013400', '001', '2', '10001', 31, 151);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('钱楚琪', '19809615007', '42010119720729650X', '002', '2', '10001', 31, 152);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('经冶晗', '15823757026', '42010119900926600X', '003', '2', '10001', 31, 153);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('尤旻越', '15364755774', '420101196207245767', '004', '2', '10001', 31, 154);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('傅逸意', '15802603560', '420101196306132215', '005', '1', '10001', 31, 155);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('翁晟蓉', '14703763129', '420101196409271218', '006', '1', '10001', 31, 156);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('诸队镇', '13284721023', '420101196802229294', '007', '1', '10001', 31, 157);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('甄晏飙', '15508347323', '420101196904231061', '008', '2', '10001', 31, 158);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('马娆云', '19146798687', '420101197707103196', '009', '1', '10001', 31, 159);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('甄斌银', '14564797644', '420101197707158955', '010', '1', '10002', 31, 160);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('芮峻坤', '13505344627', '420101197709148152', '011', '1', '10002', 31, 161);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('松婕昭', '15618399645', '420101198009193141', '012', '2', '10002', 31, 162);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('宋椒杏', '17013037506', '420101198304171105', '013', '2', '10002', 31, 163);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('褚川灿', '17108843596', '420101198604259926', '014', '2', '10002', 31, 164);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('薛澄然', '13772049566', '420101198605251037', '015', '1', '10002', 31, 165);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('吴可泳', '18236992264', '420101198703268027', '016', '2', '10002', 31, 166);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('虞荔蕴', '17273523584', '420101199405156662', '018', '2', '10002', 31, 167);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('周翊功', '13300186402', '420101199203239750', '017', '1', '10002', 31, 168);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('乌威晟', '13949279639', '420101199803235614', '021', '1', '10002', 31, 169);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('梅高典', '17134476969', '420101199506149699', '019', '1', '10002', 31, 170);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('毕俐李', '15836785160', '420101199508292245', '020', '2', '10001', 31, 171);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('王柏芝', '15000829698\n', '440101200502013400', '001', '2', '10001', 33, 172);
INSERT INTO `plan_student` (`studentname`, `mobile`, `idcard`, `studentcode`, `gender`, `subjectcode`, `planid`, `planstudentid`) VALUES ('钱楚琪', '19809615007', '42010119720729650X', '002', '2', '10001', 33, 173);
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
) ENGINE=InnoDB AUTO_INCREMENT=297 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of question
-- ----------------------------
BEGIN;
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (240, '一家公司启动了一个与开发新服务相关的项目，而该公司并不具有此类专业知识。项目经理了解到，运营部门不批准且可能不支持持续维护。 项目经理应该怎么做？', '1', '1', '[{\"value\":\"执行沟通需求分析，并记录该情况\",\"isRight\":0},{\"value\":\"根据之前项目的信息，创建一份风险识别核对单\",\"isRight\":0},{\"value\":\"将此活动包含在工作分解结构（WBS）中，并在发生时对其进行处理\",\"isRight\":0},{\"value\":\"评估如何获得该部门的项目支持，以减少任何负面影响\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P512 章节：13.1.2.3 相关方分析：相关方分析会产生相关方清单 和关于相关方的各种信息，例如，在组织内的位置、在项目中的角色、与项目的利害关系、期望、态度（对项目的支持程 度），以及对项目信息的兴趣。 注意相关方的核心思想就是管理相关 方的抵制与支持。\n', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (241, '一家组织正在开展一个软件应用程序开发项目，有不同的相关方参与到该项目的不同阶段。项目经理应该如何让相关方在整个项目过程中参与？', '1', '1', '[{\"value\":\"使用来自相关方的信息来制定项目需求\",\"isRight\":0},{\"value\":\"定期与所有相关方确认关键项目决策 \",\"isRight\":1},{\"value\":\"让相关方参与制定项目商业论证\",\"isRight\":0},{\"value\":\"不断与所有相关方分享项目状态报告\",\"isRight\":0}]', '知识点出处：PMBOK 6th 页码：P522 章节：13.2.3.1 相关方参与计划是项目管理计划的组成部分。 它确定用于促进相关方有效参与决策和执行的策略和行动。 解析规划好相关方的定期决策，让相关方持续参与项目。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (242, '当一个敏捷团队进行第七次迭代时，一个新相关方加入了该项目。相关方经常联系团队成员以请求信息并质疑他们的方法。Scrum主管注意到团队的生产力下降了。对于Scrum主管来说，最好的行动方案是什么？', '1', '1', '[{\"value\":\"清除妨碍团队进展的障碍和阻碍\",\"isRight\":1},{\"value\":\"鼓励团队与相关方互动，并满足他们的需求 \",\"isRight\":0},{\"value\":\"将团队从相关方和任何其他外部影响中隔离出来\",\"isRight\":0},{\"value\":\"为团队提供他们需要的任何东西，以提高他们的积极性和生产力\",\"isRight\":0}]', '知识点出处： 敏捷实践指南 页码：P34 章节：4.2.1 仆人式领导的职责：仆人式领导通过管理关系， 在团队内和组织中建立沟通与协作。这些关系可以帮助领导在组织中得心应手地为团队提供支持。这种支持有助于消除障碍，促进团队理顺过程。 在敏捷实践中，项目经理重要的核心工作就是消除障碍。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (243, ' 在一个职能型组织中，一位关键的项目资源在咨询项目经理之前直接与客户进行沟通。这位资源之前经常发生这种问题，该资源已同意所有客户沟通必须先得到项目经理的批准。 项目经理应该怎么做？', '1', '1', '[{\"value\":\"与该资源的职能经理开会，讨论该资源的行为\",\"isRight\":1},{\"value\":\"召开团队会议以识别并纠正该资源的错误\",\"isRight\":0},{\"value\":\"与项目发起人召开会议，以讨论该资源的行为\",\"isRight\":0},{\"value\":\"与客户开会以确认所有沟通都应该通过项目经理\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P47 章节：2.4.4.2 职能型：联络员，无权限； 矩阵型：项目经理，一定权限 ；项目型：项目经理，所有权限 职能型组织中, 团队的行为只能找职能经理沟通。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (244, '一家公司开始了它的第一个混合型项目。项目进度计划是根据基准来衡量的，并且产品是使用Scrum开发的。公司已经为团队进行了敏捷培训。项目的完成日期到了，团队提交他们到目前为止能够完成的内容。客户检查产品并指出一个重要的功能没有交付。造成这种情况最可能的原因是什么？', '1', '1', '[{\"value\":\"项目团队拒绝在晚上和周末工作以完成整个产品待办事项列表\",\"isRight\":0},{\"value\":\"产品负责人未包括在敏捷培训中，甚至没有分配到项目中\",\"isRight\":1},{\"value\":\"项目团队没有与客户协商如何确定产品待办事项列表的优先级\",\"isRight\":0},{\"value\":\"解进度基准太短，无法开发产品待办事项列表中的所有项目\",\"isRight\":0}]', '知识点出处：敏捷实践指南 页码：41 章节：4.3.2 产品负责人 Product Owner ：创建待办列表并排序、 确认工作优先顺序、 提供反馈 、指导开发方向 PO对接客户， 以确定是否变更以及何时变更。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (245, '敏捷教练协助团队召开会议，对团队刚刚完成的迭代进行反思和调整。教练和团队成员为讨论设置了阶段，创建了迭代过程中发生的事情的共享图片，评估在前一步中生成的数据，并决定如何处理讨论过程中确定的问题。这次会议的下一步应该是什么？', '1', '1', '[{\"value\":\"执行决策\",\"isRight\":0},{\"value\":\"结束会议\",\"isRight\":1},{\"value\":\"演示产品\",\"isRight\":0},{\"value\":\"解散参与者\",\"isRight\":0}]', '知识点出处： 敏捷实践指南 页码：P50 章节：5.2.1 回顾总结会：回顾是最重要的一个实践，原因是它能让 团队学习、改进和调整其过程。 回顾会的三个步骤，反思—改进—计划。题干中步骤完成，结束会议。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (246, '项目经理在制定项目进度计划时，希望按照符合逻辑的方式排列任务顺序，并使用至少有高级的承包商。项目经理应该查阅哪份文件？', '1', '1', '[{\"value\":\"里程碑清单\",\"isRight\":0},{\"value\":\"项目范围说明书\",\"isRight\":0},{\"value\":\"活动清单\",\"isRight\":0},{\"value\":\"活动属性\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P186 章节：6.2.3.2 活动属性：活动属性可能包括活动描述、紧前活动、紧后活动、逻辑关系、提前量和滞后量（见 6.3.2.3 节）、 资源需求、 强制日期、制约因素和假设条件 活动属性的概念', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (247, '项目经理与多位高管相关方一起参与一个生命周期替换项目，其中一位相关方强烈反对该项目。若要获得该相关方的支持，项目经理应该怎么做？', '1', '1', '[{\"value\":\"制定权力/影响力方格，以确定该相关方影响项目的能力并确认其支持\",\"isRight\":0},{\"value\":\"创建相关方参与计划，以确定该相关方的项目支持水平\",\"isRight\":0},{\"value\":\"将该问题升级上报给项目推动者，并请求替换一个支持该项目的相关方\",\"isRight\":0},{\"value\":\"执行相关方分析，以确定缺乏项目支持的原因并对这些原因进行优先级排序\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P512 章节：13.1.2.3 相关方分析： 相关方分析会产生相关方清单和关于相关方的各种信息， 例如，在组织内的位置、在项目中的角色、与项目的利害关系、期望、态度（对项目的支持程度），以及对项目信息的兴趣。 先进行相关方分 析，再更新参与 计划。B在D后面。 A确认其支持 不对。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (248, '随着项目的进展，偏差分析表明与绩效测量基准相比，实际的项目绩效会恶化。因此，对成本、进度和范围的估算不再有效。团队确定大量的新功能、变更请求和缺陷修复是差异背后的主要原因。项目经理要确保在实际进展的基础上对项目的剩余工作进行进一步的估算，最好的行动方案是什么？', '1', '1', '[{\"value\":\"将产品开发方法转换为通过短迭代来适应和度量进度\",\"isRight\":1},{\"value\":\"限制项目中允许的新功能、变更请求和缺陷修复的数量\",\"isRight\":0},{\"value\":\"请使用自下而上估算成本和进度计划估算技术以及三点估算范围\",\"isRight\":0},{\"value\":\"基于单个的基准而不是单一的综合基准来衡量进度\",\"isRight\":0}]', '知识点出处： 敏捷实践指南 页码：P18 章节：3.1 四种生命周期特征。 变更过多，说明需求是动态的，不建议使用瀑布型。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (249, '你被分配到一个软件开发项目。产品需求在一开始就没有明确定义。因此，决定是使用敏捷框架来开发产品。项目的其他方面将使用传统的瀑布式项目管理方法进行管理。以下哪一项可能会花费较少的时间来开发和/或实现该项目？', '1', '1', '[{\"value\":\"项目章程\",\"isRight\":0},{\"value\":\"问题日志\",\"isRight\":0},{\"value\":\"变更管理计划\",\"isRight\":1},{\"value\":\"确认范围过程\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P88 章节：4.2.3.1 变更管理计划：描述在整个项目期间如何正式审批和采纳变更请求。 敏捷中没有变更管理计划。因此敏捷部门无须制定。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (250, '一位项目经理正在为一家初创公司领导一个敏捷项目。虽然这是该组织的第一个此类项目，但可能会有更多类似的项目紧随其后。因此，项目经理希望确保在这个项目中获得的知识能够用于未来的项目。 下列哪一种做法将最好地支持知识转移，以造福未来的项目?(选择三个)', '2', '1', '[{\"value\":\"记录在整个项目中学习到的经验教训中获得的知识\",\"isRight\":1},{\"value\":\"确保经验教训登记册最后定稿并转移到经验教训存储库\",\"isRight\":1},{\"value\":\"与项目团队和相关相关方定期召开回顾会议\",\"isRight\":1},{\"value\":\"定期审查作为项目管理计划组成部分的知识管理计划\",\"isRight\":0},{\"value\":\"确保在配置管理计划中将所学到的经验记录作为配置元素列出\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P104 章节：4.4.3.1 经验教训登记册：在项目早期创建。在整个项目期间，它 可以作为很多过程的输入，也可以作为输出而不断更新。 在项目或阶段结束时，把相关信息归入经验教训知识库，成为组织过程资产的一部分。 D不存在知识管理计划。 E配置管理计划不存档项目知识。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (251, '随着项目的进展和可交付成果的产生，项目经理重新审查相关方参与计划，以确定可以对计划进行哪些改进，以提高相关方的参与。在这些项目文件中，哪些文件对正在执行的项目管理过程影响最大?(选择三个)', '2', '1', '[{\"value\":\"相关方登记册\",\"isRight\":1},{\"value\":\"风险登记\",\"isRight\":1},{\"value\":\"资源管理计划\",\"isRight\":0},{\"value\":\"相关方参与评估矩阵\",\"isRight\":0},{\"value\":\"问题日志\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P519 章节：13.2.1.3 项目文件 ：问题日志（E） 风险登记册（B） 相关方登记册（A） ITTO题', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (252, '项目经理刚刚从组织辞职的另一位项目经理那里接管一个正在进行的项目。在审查项目管理计划时，项目经理意识到成本偏差和进度偏差主要是负面的。项目尚未解决，还未向供应商支付已完成的工作，并且减轻次生风险正迅速耗尽预算。本应该采取哪种三项措施来避免这种情况？（选择三项）', '2', '1', '[{\"value\":\"在项目章程中实施明确的假设\",\"isRight\":1},{\"value\":\"在项目章程中增加应急预算\",\"isRight\":0},{\"value\":\"确定项目交接程序\",\"isRight\":0},{\"value\":\"确保项目治理控制措施得到批准和实施\",\"isRight\":1},{\"value\":\"在项目规划阶段确定高风险和对策\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P395 章节：11 项目风险管理的目标在于提高正面风险的概率和（或）影响，降低负面风险的概率和（或）影响，从而提高项目成功的可能性。 进度和成本同时有问题都是风险没有管理好。B章程里没风险C交接不管用', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (253, '一个将组织从职能组织结构转变为项目导向的项目刚刚启动。 如果项目成功地达到了它的目标，那么最有可能的结果是什么?(选择三个)', '2', '1', '[{\"value\":\"组织将从当前状态转移到期望的未来状态\",\"isRight\":1},{\"value\":\"项目经理将控制项目预算\",\"isRight\":1},{\"value\":\"员工将按所做的工作(工程、制造等)分组\",\"isRight\":0},{\"value\":\"项目经理将对项目有更大的权力\",\"isRight\":1},{\"value\":\"项目经理的角色将被定义为项目协调员\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P47 章节：2.4.4.2 职能型：没有权力 ；弱矩阵：中低权力； 平衡矩阵：平等权力 ；强矩阵：中高权力 ；项目型：全部权力 。 企业成功转型，项目经理拥有全部的权力。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (254, '一个大型建设项目正处于实施阶段。根据项目进度表，今天项目经理有三个项目新相关方的单独指导会议。 当指导这些相关方时，项目经理可能执行下列哪一个项目管理过程?(选择两个)', '2', '1', '[{\"value\":\"制定项目章程\",\"isRight\":0},{\"value\":\"制定沟通管理计划\",\"isRight\":0},{\"value\":\"识别相关方\",\"isRight\":0},{\"value\":\"管理沟通\",\"isRight\":1},{\"value\":\"建设团队\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P379 章节：10.2 管理沟通：管理沟通是确保项目 信息及时且恰当地收集、 生成、发布、存储、 检索、管理、监督和最终处置的过程。 项目经理按计划做事，说明是在执行阶段，只有DE是执行', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (255, '项目经理正在制定进度管理计划。由于客户表示需要尽早频繁地交付商业价值，因此项目经理选择将迭代计划与待办事项列表合并。该项目的进度管理计划中需要解决以下哪项？（选择三项）', '2', '1', '[{\"value\":\"在资源可用时使用看板面板来从待办事项列表拉动工作\",\"isRight\":0},{\"value\":\"使用基于适应型生命周期的滚动式规划\",\"isRight\":1},{\"value\":\"以用户故事的形式记录需求\",\"isRight\":1},{\"value\":\"在初始项目计划期间将工作包分解为活动清单\",\"isRight\":0},{\"value\":\"在项目待办事项中确定并优化用户故事的优先级\",\"isRight\":1}]', '知识点出处：PMBOK 6th 页码：P177 章节：6 项目进度管理的发展趋势和新兴实践：具有未完项的迭代型进度计划。这是一种基于适应型生命周期的滚动式规划（B），例如敏捷的产品开发方法。这种方法将需求记录在用户故事中（C），然后在建造之前按先级排序（E）并优化用户故事，最后在规定的时间盒内开发产品功能。 具有未完成项的迭代型进度计划，而非按需进度计划，因此不选A。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (256, '在桥梁建设项目中，项目经理正在监督和控制项目构件的各种变化。 下列哪一项最可能需要经过批准的变更请求才能进行变更?(选择四个)', '2', '1', '[{\"value\":\"有人建议将预测式开发方法改为混合开发方法\",\"isRight\":1},{\"value\":\"项目的运行超出了预算，需要修改成本基线以反映实际情况\",\"isRight\":1},{\"value\":\"项目发起人想要向配置管理计划添加一个文档\",\"isRight\":1},{\"value\":\"几项任务的修订状态需要反映在项目进度表中\",\"isRight\":0},{\"value\":\"一名高级主管建议更新项目生命周期描述，以增加一个阶段\",\"isRight\":1},{\"value\":\"刚刚确定了一个新的利益相关者，需要将其添加到利益相关者登记册中\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P113 章节：4.6 在基准确定之前， 变更无需正式受控于实施整体变更控制过程。 不涉及基准一般不用审批。 D任务状态不需要审批E相关方登记册一般不给相关方审批', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (257, '你正在为一个将使用敏捷方法进行产品开发的项目制定项目管理计划。你希望确保关键的相关方在项目的整个过程中都能了解交付的业务价值。 你的最佳行动方案是什么?(选择三个)', '2', '1', '[{\"value\":\"等到项目结束时，向相关方展示项目可交付成果\",\"isRight\":0},{\"value\":\"邀请相关方参加定期的迭代评审会议\",\"isRight\":1},{\"value\":\"根据项目待办事项列表中每个项的业务值分配故事点\",\"isRight\":0},{\"value\":\"利用信息发射器，如看板和燃烧图表\",\"isRight\":1},{\"value\":\"确保沟通管理计划指定定期向相关方报告项目状态\",\"isRight\":1}]', '知识点出处： 敏捷实践指南 页码：P55 章节：5.2.5 展示/评审： 当团队以用户故事的形式完成特定功能时，团队会定期展示工作产品。 看过展示后，产品负责人接受或拒绝故事。 A是传统项目 C是PO做的', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (258, '你正在领导并执行项目管理计划中所概述的工作。作为这个过程的一部分，你已经通过服务型领导成功地鼓舞和激励了scrum团队，以快速的速度生成项目可交付成果。因此，项目趋向于满足并超过绩效测量基准。 作为这个过程的一部分，你可能需要执行哪些活动?(选择两个）', '2', '1', '[{\"value\":\"为项目章程寻求批准\",\"isRight\":0},{\"value\":\"实施已批准的变更请求\",\"isRight\":1},{\"value\":\"确定项目相关方的全面列表\",\"isRight\":0},{\"value\":\"协助日常的站立会议\",\"isRight\":1},{\"value\":\"制定风险应对策略以应对已识别的风险\",\"isRight\":0}]', '知识点出处： PMBOK 6th   页码：P90 章节：4.3 指导与管理项目工作是为实现项目目标而领导和执行项目管理计划中所确定的工作，并实施已批准变更的过程 从题干描述来看，属于执行过程组，因此选B和D', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (259, ' 项目经理说：“我现在不能处理这件事。\"此时，该项目经理用撤退冲突的解决技巧。', '3', '1', '[{\"value\":\"正确\",\"isRight\":1},{\"value\":\"错误\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P349 章节：9.5.2.1 撤退/回避：从实际或潜在冲突中退出，将问题推迟到准备充分的时候，或者将问题推给其他人员解决。 对项目影响不大的时候，项目经理可以选择回避。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (260, '为了生产可交付的产品，你的项目必须与几个供应商签订合同。可交付成果将使用一个敏捷框架进行开发，该框架采用约束驱动的交付方式，这将影响与供应商的合同关系。 以下哪一种策略最适合这个项目?(选择三个)', '2', '1', '[{\"value\":\"根据详细的工作分解结构制定采购工作说明书\",\"isRight\":0},{\"value\":\"追求与供应商共享风险和回报的关系\",\"isRight\":1},{\"value\":\"与供应商签订合同时，采用固定价格增量\",\"isRight\":1},{\"value\":\"对每个供应商使用一个标准的固定价格合同\",\"isRight\":0},{\"value\":\"在供应商合同中包含提前取消的选项\",\"isRight\":1}]', '知识点出处：敏捷实践指南 页码：P77-78 章节：6.3 采购和合同： • 多层结构 • 强调价值交付 • 总价增量 • 固定时间和材料 • 累进的时间和材料 • 提前取消方案 • 动态范围方案 • 团队扩充 • 支持全方位供应商 敏捷的采购和合同', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (261, '项目经理资源有限,无法获得更多资源。项目经理应该使用资源平衡技术来充分利用现有资源,而不会令项目完成时间延期。', '3', '1', '[{\"value\":\"正确\",\"isRight\":0},{\"value\":\"错误\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P211 章节：6.5.2.3 资源优化： 资源平衡，改变关键路径。 资源平滑，不改变关键路径。 题干提到不能让项目延期， 因此只能用资源优化中的资源平滑。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (262, '项目执行阶段，发现一个子团队没有为约定的项目目标工作。项目经理应该资源管理计划。', '3', '1', '[{\"value\":\"正确\",\"isRight\":1},{\"value\":\"错误\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P318 章节：9.1.3.1 资源管理计划——角色与职责： • 角色 • 职权 • 职责 • 能力 子团队的工作职责不清，需要看资源管理计划。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (263, '你将与你的团队会面来确定项目的生命周期。在分析了定义和管理需求、开发可交付成果、处理变更、控制风险和成本，以及与关键相关方合作的最佳方式之后，做出了选择混合生命周期的决定。在选定项目生命周期后，关键相关方应定期参与。', '3', '1', '[{\"value\":\"正确\",\"isRight\":1},{\"value\":\"错误\",\"isRight\":0}]', '知识点出处： 敏捷实践指南 页码：P26 章 节：3.1.6 混合生命周期的特征： 对于整个项目，没有必要使用单一的方法。为达到特定的目标，项目经常要结合不同的生命周期要素。预测、 迭代、增量和/或敏捷方法的组合就是一种混合方法。混合型建议定期参与。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (264, '项目经理正在制定项目进度计划，并希望赋予团队比过去项目更多的决策权。他创建了一个甘特图，显示WBS工作包级别的活动，这些活动被分配给团队而不是个人。然后，他将工作包记录在一个看板面板的待办事项列表中。项目经理应该使用变革型领导风格，通过理想化的属性和行为使用鼓舞人心的激励来授权团队。', '3', '1', '[{\"value\":\"正确\",\"isRight\":1},{\"value\":\"错误\",\"isRight\":0}]', '知识点出处：敏捷实践指南 页码：P73 章节：6.1.2 变革就绪情况： • 积极明确的管理层支持； • 变革管理实践，包括沟通和引导； • 逐个项目应用敏捷实践 • 向团队增量地引入敏捷实践；以及 • 通过采取适用的敏捷技术和实践示范引导。 从题干看出，这明显是从瀑布型向敏捷型的变革，需要变革型领导风格。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (265, '项目经理发现项目可交付成果与发起人期望之间存在若干不一致之处，为确保一致，项目经理应该制定沟通管理计划。', '3', '1', '[{\"value\":\"正确\",\"isRight\":0},{\"value\":\"错误\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P522 章节：13.2.3.1 相关方参与计划：相关方参与计划是项目 管理计划的组成部分。 它确定用于促进相关方有效参与决策和执行的 策略和行动。 期望不一致，就要持续管理好相关方的期望。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (266, '一个使用新技术的复杂敏捷项目被技术挑战、不断变更的优先级、严格的截止日期和客户对敏捷交付方法的不熟悉所困扰。这种环境会给团队成员带来压力和挫折。他们中的许多人开始找项目经理，抱怨这些问题。项目经理首先应该提交变更请求。', '3', '1', '[{\"value\":\"正确\",\"isRight\":0},{\"value\":\"错误\",\"isRight\":1}]', '知识点出处：敏捷实践指南 页码：P35 章节：4.2.1.2 消除组织障碍： 仆人式领导还应该关注其他冗长的过程，这些过程往往造成瓶颈问题，阻碍团队或组织的敏捷性。可能需要处理的过程或部门的例子包括，财务部门、变更控制委员会或审计部门。仆人式领导可以与他人携手合作，共同质疑和审核他们的过程，为敏捷团队和领导提供支持。 团队促进者消除组织障碍。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (267, '在项目会议期间,一个团队发现三个月前关闭的问题仍然处于活跃状态,并对项目的预算产生负面影响。若要防止这种情况再次发生,项目经理可以更新问题日志，并监督纠正措施。', '3', '1', '[{\"value\":\"正确\",\"isRight\":1},{\"value\":\"错误\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P96 章节：4.3.3.3 问题日志 ：问题日志可以帮助项目经理有效跟进和管理问题，确保它们得到调查和解决。作为本过程的输出，问题日志被首次创建，尽管在项目期间任何时候都可能发生问题。在整个项目生命周期应该随同监控活动更新问 题日志。 问题解决以后，要更新问题日志，同时审查问题是否真正关闭。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (268, ' 你向项目出资人提供了项目的成本估算，他对估算不满意，因为他认为价格太高了。他要你削减项目估算的15%，你该告诉所有团队成员削减其估算的15%。', '3', '1', '[{\"value\":\"正确\",\"isRight\":0},{\"value\":\"错误\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P247 章节：7.2.3.2 估算依据： 成本估算所需的支持信息的数量和种类，因应用领域而异，不论其细程度如何，支持性文件都应该清晰、完整地说明成本估算是如何得出的。 有清晰明确的估算依据，若发起人认为还要缩减，就需 要缩减项目范围了。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (269, '项目经理建议为一个软件开发团队提供单元测试技术培训，该技术可以在编码阶段应用。另外，项目经理建议在软件开发期间采购一台服务器来运行测试用例。这个例子是______？', '4', '1', '[{\"value\":\"预防成本\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P282 章节：8.1.2.3 质量成本： 预防成本。预防特定项目的产品质量低劣所带来的相关 成本。 评估成本。评估、测量、审计和测试特定项目的产品所 带来的相关成本。 失败成本（内部/外部）。因产品与相关方需求不一致而导致的相关成本。 测试本身是评估成本，但是购买设备是预防成本。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (270, '一个使用多个供应商的项目估计将在两年内完成。在第一年结束时,发现存在重大预算超支。项目经理意识到必须将项目重新拉回控制,因此签发一项变更请求。若要支持这项变更请求,项目经理应该执行根本原因分析。', '3', '1', '[{\"value\":\"正确\",\"isRight\":1},{\"value\":\"错误\",\"isRight\":0}]', '知识点出处： PMBOK 6th 页码：P111 章节：4.5.2.2 根本原因分析关注识别问题的主要原因，它可用于识别出现偏差的原因以及项目经 理为达成项目目标应重点关注的领域。 注意监控过程组六个数据分析的工具，根本原因分析为其之一。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (271, '客户希望增加股东权益的总和，提高其在全球市场的品牌知名度。客户的主要目标是______？', '4', '1', '[{\"value\":\"提高商业价值\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P7 章节：1.2.1 有形效益的例子包括： • 货币资产； • 股东权益； • 公共事业； • 固定设施； • 工具； • 市场份额。 股东权益属于有形效益。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (272, '项目经理正在制定一个项目计划。项目赞助人得知后，立即让项目经理针对项目成本开展初始粗略评估，以满足未来财政预算的需求。 项目经理采用______评估项目成本？', '4', '1', '[{\"value\":\"类比估算\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P244 章节：7.2.2.2 成本类比估算使用以往类似项目的参数值或属性来估算。 项目的参数值和属性包括 （但不限于）范围、成本、 预算、持续时间和规模指标， 类比估算以这些项目参数值 或属性为基础来估算当前项目的同类参数或指标。一般题目中出现粗 略、需要快速估算、量级字眼，都是选 择类比估算', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (273, ' 作为向敏捷转变的一部分，一个组织为一个项目选择一个试点团队来开发一个软件工具。一位敏捷教练被分配到团队中，在整个过渡过程中指导他们。在最初的几次迭代中，教练与项目经理和团队一起指导他们进行敏捷实践，并将任务分配给团队成员。敏捷教练采用______最佳行动方案来确定团队是否获得了在没有教练的情况下执行即将到来的迭代所需的技能？', '4', '1', '[{\"value\":\"举行迭代回顾\",\"isRight\":1}]', '知识点出处：敏捷实践指南 页码：P50 章节：5.2.1 回顾总结会： 回顾是最重要的一个实践，原因是它能让团队学习、改进和调整其过程。 开始是敏捷教练分配任务，在回顾会后， 团队成员可以自组织来安排任务、 改进过程。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (274, '由于没有空，具有批准权限的相关方拒绝了参与项目开工会议的邀请。该项目时间紧迫，及时开工对于满足截止日期至关重要。项目经理应该做______？', '4', '1', '[{\"value\":\"升级上报给项目发起人\",\"isRight\":1}]', '知识点出处： PMBOK 6th 页码：P86 章节：4.2.2.4 Kick-off 会议：项目开工会议通常意味着规 划阶段结束和执行阶段开始， 旨在传达项目目标、获得团队对项目的承诺，以及阐明每个相关方的角色和职责。 规划已经结束， 就等着审批后执行了，此时应尽快解决。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (275, '你正在领导一个开发新智能手机的项目。因为你要预测需求的许多变更，并不断从相关方那里得到反馈来调整智能手机，所以工作将以小的增量迭代完成。然而，这款智能手机的摄像头将由一家拒绝以渐进方式合作的供应商开发。你为该项目选择______项目管理方法是最好的？', '4', '2', '[{\"value\":\"\"}]', '知识点出处：敏捷实践指南 页码：P26 章节：3.1.6 混合生命周期的特征：对于整个项目，没有必要使用单一的方法。为达到特定的目标，项目经常要结合不同的生命周期要素。预测、迭代、增量和/或敏捷方法的组合就是一种混合方法。 从题干描述来看，手机开发方法主要为敏捷，摄像头为预测。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (276, '每次你与你的项目发起人会面，她都要强调对于你的新的电子商务项目的成本控制的必要性。她经常询问你成本业绩方面的问题，诸如哪一个预算达到了哪一个没有达到。为了回答她的问题，你应该提供______？', '4', '2', '[{\"value\":\"\"}]', '知识点出处： PMBOK 6th 页码：P224 章节：6.6.1.1 绩效测量基准： 使用挣值分析时，将绩效测量基准与实际结果比较，以决定是否有必要进行变更、采取纠正措施或预防措施。 向发起人提供绩效测量基准，将绩效比较结果告之。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (277, '项目经理安排一次会议，让Scrum项目团队进行反思和调整。与会者在这次会议上最可能做______？', '4', '2', '[{\"value\":\"\"}]', '知识点出处：敏捷实践指南 页码：P50 章节：5.2.1 回顾总结会： 回顾是最重要的一个实践，原因是它能让团队学习、改进和调整其 过程。 回顾会三件事：总结经验 过程改进 提出计划', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (278, '项目经理希望在新项目中使用一名特定供应商。该供应商目前正在为项目经理管理的另一个项目工作。项目经理希望在开始为新项目工作之前，先完成当前项目。在供应商开始为新项目工作之前，项目经理应该______？', '4', '2', '[{\"value\":\"\"}]', '知识点出处： PMBOK 6th 页码：P498 章节：12.3.2.5 采购审计： 审计是对采购过程的结构化审查。应该在采购合同中明确规定与审计有关的权利和义务。 买方的项目经理和卖方的项目经理都应该关注审计结果， 以便对项目进行必要调整。 注意题干中提到的问题的逻辑关系', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (279, '为了开发可交付成果，项目管理计划规定，分析师应在每次迭代开始时向项目团队提供数据集。在每日站会，开发人员报告说没有可用的数据集，因为分析师离开了公司并且没有新人上岗。采取哪种措施是适当的？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P455 章节：11.7.1.2 风险登记册 · 已识别单个项目风险 · 风险责任人 · 商定的风险应对策略 · 以及具体的应对措施。 遇风险，先查册。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (280, '项目工作已经完成，且可交付成果已获验收。在项目的质保期内，识别到一个影响环境的缺陷。______应该负责解决这个问题？', '4', '2', '[{\"value\":\"\"}]', '知识点出处： PMBOK 6th 页码：P127 章节：4.7.3.2 项目交付的产品、服务或成果： 可转交给另一团队或组织，并由其在整个生命周期中进行运营、维护和支持。 本输出所指的正是把项目交付的最终产品、服务或成果（对 于阶段收尾，则是所在阶段的中间产品、服务或成果）从一个团队转交到另一个团队。 完成项目， 把项目移交出去给运营团队。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (281, '有一部分项目工作从外部资源采购，项目团队制定采购计划，并向多个供应商发出建议邀请书，团队从潜在供应商那里获得关于工作的询问，为向潜在供应商提供响应，项目团队应该怎么做？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P487 章节：12.2.2.3 投标人会议:投标人会议（又称承包商会议、供应商会议或投标前会议）是在卖方提交建议书之前，在买方和潜在卖方之间召开的会议，其目的是确保所有潜在投标人对采购要求都有清楚且一致的理解，并确保没有任何投标人会得到特别优待。 投标人会议两个作用：确保对采购要求的理解；保证公平。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (282, '你正在管理一个项目团队，该团队最新新增来自另一个国家的成员。他们的角色已经被概述为初步的团队章程。然而，你已经注意到团队中相当缺乏对文化差异的接受，这导致了频繁的冲突。 哪一种技巧可以在这种情况下帮助你?', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P336 章节：9.4 建设团队：建设团队是提高工作能力，促进团队成员互动，改善团队整体氛围，以提高项目绩效的 过程。 本过程的主要作用是，改进团队协作、增强人际关系技能、激励员工、减少摩擦以及提升整体项目绩效。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (283, '项目经理向项目赞助人通知了一项重大项目超支，赞助人想知道为什么没有在赞助人反馈前较早通知该情况，项目经理本应采取何种措施解决该问题?', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P377 章节：10.1.3.1 沟通管理计划 沟通管理计划是项目管理计划的组成部分，描述将如何规划，结构化、执行与监督项目沟通， 以提高沟通的有效性。该计划包括如下信息： · 相关方的沟通需求 凡信息，找沟通', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (284, '在项目实施期间，一些团队成员抱怨说他们对项目可交付成果不确定。若要确保项目团队按照项目范围工作，项目经理应该怎么做？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P157 章节：5.4 创建WBS:WBS是对项目团队为实现项目目标、创建所需可交付成果而需要实施的全部工作范围的层级分解。WBS 组织并定义了项目的总范围，代表着经批准的当前项目范围说明书中所规定的工作。 WBS规定了所有要做的事情，与范围说明书、WBS词典共同组成了范围基准。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (285, '一个敏捷团队成员在开发她为当前冲刺选择的用户故事时遇到了一个技术问题。在多次尝试解决这个问题失败后，团队成员向scrum master寻求建议。对于scrum master来说，最好的行动方案是什么？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：敏捷实践指南 页码：P38章节：4.2.3仆人式领导：在敏捷环境中，项目经理充当仆人式领导，其工作重点转变为引导需要帮助的人，促进团队的合作，保持与相关方的需要一致。自组织团队，若遇到问题，原则上应该让团队自己处理问题。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (286, '对于一个政府项目，项目成果会对一群当地相关方造成负面影响。这群相关方对于项目有高影响和低利益。但是他们有权终止项目。项目经理应该使用什么方法？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P512 章节：13.1.2.4 权利利益方格：基于相关方的职权级别（权力）、对项目成果的关心程度（利益）、对项目成果的影响能力（影响），或改变项目计划或执行的能力，每一种方格都可用于对相关方进行分类。 权利高、利益低，通过不断地咨询，令其满意。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (287, '由于组织结构的变化，相关方A承担了新的责任，并已经从指导管理委员会辞职. 相关方A替代者相关方B，提出与项目商业利益有关的问题. 项目经理首先应该怎么做？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P505 章节：13 识别相关方的迭代性： · 项目进入其生命周期的不同阶段； · 当前相关方不再与项目工作有关，或者在项目的相关方社区中出现了新的相关方成员； · 组织内部的相关方社区发生重大变化。 出现以上三点情况时要重新识别相关方，并更新相关方登记册', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (288, '一家咨询公司主张，由于项目经理要求的报告不包含在原始范围内，所以会产生额外费用，项目经理应该怎么做？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P489 章节：12.2.3.2 协议可包括（但不限于）： · 采购工作说明书或主要的可交付成果； · 进度计划、里程碑，或进度计划中规定的日期； · 绩效报告； · 定价和支付条款； · 检查、质量和验收标准； 范围有歧义，查看合同中对可交付成果的定义。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (289, '一个期限很短的项目关键相关方希望避免质量控制。项目经理知道必须提供最低质量水平。项目经理应当使用什么工具或技术？', '5', '2', '[{\"value\":\"\"}]', '知识点出处：PMBOK 6th 页码：P282 章节：8.1.2.3 成本效益分析：成本效益分析可帮助项目经理确定规划的质量活动是否有效利用了成本。 相关方不想在控制质量上花钱，有可能导致大的返工或召回成本，要使用成本效益分析说服相关方。', 38, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (290, '以下被称为“诗仙”的诗人是？', '1', '1', '[{\"value\":\"李白\",\"isRight\":1},{\"value\":\"杜甫\",\"isRight\":0},{\"value\":\"白居易\",\"isRight\":0},{\"value\":\"李清照\",\"isRight\":0}]', '李白是被称为“诗仙”，杜甫被称为“诗圣”。白居易被称为香山居士，也被称为醉吟先生。李清照被称为千古第一才女。\n', 37, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (291, '以下哪位是唐朝的诗人？', '2', '1', '[{\"value\":\"陆游\",\"isRight\":0},{\"value\":\"杜甫\",\"isRight\":1},{\"value\":\"白居易\",\"isRight\":1},{\"value\":\"李清照\",\"isRight\":0}]', '杜甫和白居易是唐朝的，陆游和李清照被是宋朝的。\n', 37, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (292, '李白是唐朝一位伟大的诗人，被称为“诗圣”', '3', '1', '[{\"value\":\"正确\",\"isRight\":0},{\"value\":\"错误\",\"isRight\":1}]', '李白是唐朝的，但他被称为“诗仙”，所以这道题是错误的。\n', 37, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (293, '白日依山尽，___，欲穷千里目，___。', '4', '1', '[{\"value\":\"欲穷千里目\",\"isRight\":1},{\"value\":\"更上一层楼\",\"isRight\":1}]', '这是李白的一首好诗', 37, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (294, '请默写出李白的一首古诗:__。\n请默写出杜甫的一首古诗:__。', '4', '2', '[{\"value\":\"\"},{\"value\":\"\"}]', '李白的诗例如：《静夜思》\n床前明月光，疑是地上霜。\n举头望明月，低头思故乡。\n杜甫的诗例如：《绝句》\n两个黄鹂鸣翠柳，一行白鹭上青天。\n窗含西岭千秋雪，门泊东吴万里船。', 37, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (295, '请解释一下“白日依山尽，黄河入海流。欲穷千里目，更上一层楼。”这首古诗，作者想表达的中心思想。', '5', '2', '[{\"value\":\"\"}]', '意思是：落日依傍着远山天光辉煌，黄河冲涌起浪滔流入海疆。要放眼远眺尽览美景，唯有举步攀登向更高层楼迈上。这首诗表面上是写登楼远眺 的观景之作，却揭示了一个站得高 才能望得远的哲理，具有奋发向上 的精神，不愧是千古传诵的名作。 诗意是，白日衔山，就要落尽了，滔 滔黄河东流入海。想要看尽千里之 外的景物，还需要再登上一层楼。', 37, '0');
INSERT INTO `question` (`questionid`, `topic`, `type`, `way`, `optionlist`, `referenceanswer`, `relationid`, `enable`) VALUES (296, '李白是哪个朝代的？', '1', '1', '[{\"value\":\"唐\",\"isRight\":1},{\"value\":\"宋\",\"isRight\":0},{\"value\":\"元\",\"isRight\":0},{\"value\":\"明\",\"isRight\":0}]', '', 37, '0');
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
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of student
-- ----------------------------
BEGIN;
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (62, '王柏芝', '/upload/img/1678276241585.jpg', '15000829698', '440101200502013400', '0c019b4f178cd5a96e7343674e5b1265', '0', '001', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (63, '钱楚琪', '/upload/studentImg/42010119720729650X.jpg', '19809615007', '42010119720729650X', '179adf0ede803780da8570bfe0b713a1', '0', '002', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (64, '经冶晗', '/upload/studentImg/42010119900926600X.jpg', '15823757026', '42010119900926600X', '9b131816ee082a538063c62b5f8ed7d7', '0', '003', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (65, '尤旻越', '/upload/studentImg/420101196207245767.jpg', '15364755774', '420101196207245767', '2cd00b433ace6e124d1757bbee8943d9', '0', '004', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (66, '傅逸意', '/upload/studentImg/420101196306132215.jpg', '15802603560', '420101196306132215', 'a718aaee879ee11bd01b2267d474d09f', '0', '005', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (67, '翁晟蓉', '/upload/studentImg/420101196409271218.jpg', '14703763129', '420101196409271218', 'd79003346dca381291856eb89462eac8', '0', '006', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (68, '诸队镇', '/upload/studentImg/420101196802229294.jpg', '13284721023', '420101196802229294', '14d5cf3c7f903c6598b74e9d3f21fe52', '0', '007', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (69, '甄晏飙', '/upload/studentImg/420101196904231061.jpg', '15508347323', '420101196904231061', 'f551958197dcf3178a02f4eb85afac43', '0', '008', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (70, '马娆云', '/upload/studentImg/420101197707103196.jpg', '19146798687', '420101197707103196', 'fb5756aa2f0ae039046b8089c696a1dd', '0', '009', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (71, '甄斌银', '/upload/studentImg/420101197707158955.jpg', '14564797644', '420101197707158955', '42ed857d55f9cf475f2ef09b66f15eac', '0', '010', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (72, '芮峻坤', '/upload/studentImg/420101197709148152.jpg', '13505344627', '420101197709148152', '69fc0e5cc4894a93f0210eecce817070', '0', '011', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (73, '松婕昭', '/upload/studentImg/420101198009193141.jpg', '15618399645', '420101198009193141', '4d84079de591bdb926e4183e37c92efb', '0', '012', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (74, '宋椒杏', '/upload/studentImg/420101198304171105.jpg', '17013037506', '420101198304171105', '84e89f3d78364365a1caa75d7040ecf4', '0', '013', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (75, '褚川灿', '/upload/studentImg/420101198604259926.jpg', '17108843596', '420101198604259926', 'e1f07fc65c574e2409828a46c207aede', '0', '014', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (76, '薛澄然', '/upload/studentImg/420101198605251037.jpg', '13772049566', '420101198605251037', 'dee7f0842c44025588c2360042eef2cf', '0', '015', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (77, '吴可泳', '/upload/studentImg/420101198703268027.jpg', '18236992264', '420101198703268027', '6ac429cab36737c935890154d91cb681', '0', '016', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (78, '周翊功', '/upload/studentImg/420101199203239750.jpg', '13300186402', '420101199203239750', '392d70d71b9f0461b946feb822e7511b', '0', '017', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (79, '虞荔蕴', '/upload/studentImg/420101199405156662.jpg', '17273523584', '420101199405156662', '8ea69c970694fcff851c2dee0b47be98', '0', '018', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (80, '梅高典', '/upload/studentImg/420101199506149699.jpg', '17134476969', '420101199506149699', 'ba9e46464ea43bf3a6de8bf192e91a7d', '0', '019', '1');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (81, '毕俐李', '/upload/studentImg/420101199508292245.jpg', '15836785160', '420101199508292245', '23c754d2d9836391b4ca47720fe677ec', '0', '020', '2');
INSERT INTO `student` (`studentid`, `studentname`, `thumb`, `mobile`, `idcard`, `password`, `enable`, `studentcode`, `gender`) VALUES (82, '乌威晟', '/upload/studentImg/420101199803235614.jpg', '13949279639', '420101199803235614', '30c99576527d28a4498d8502b075394d', '0', '021', '1');
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of subject
-- ----------------------------
BEGIN;
INSERT INTO `subject` (`subjectid`, `subjectcode`, `subjectname`, `enable`) VALUES (37, '10001', '语文', '0');
INSERT INTO `subject` (`subjectid`, `subjectcode`, `subjectname`, `enable`) VALUES (38, '10002', 'PMP', '0');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of tactics
-- ----------------------------
BEGIN;
INSERT INTO `tactics` (`tacticsid`, `tacticsname`, `relationid`, `tacticscontent`, `enable`) VALUES (13, '语文基础卷抽题策略', 37, '[{\"type\":\"1\",\"num\":\"2\",\"score\":\"10\"},{\"type\":\"2\",\"num\":\"1\",\"score\":\"10\"},{\"type\":\"3\",\"num\":\"1\",\"score\":\"10\"},{\"type\":\"4\",\"num\":\"2\",\"score\":\"10\"},{\"type\":\"5\",\"num\":\"1\",\"score\":\"40\"}]', '0');
INSERT INTO `tactics` (`tacticsid`, `tacticsname`, `relationid`, `tacticscontent`, `enable`) VALUES (14, 'PMP模考抽题策略', 38, '[{\"type\":\"1\",\"num\":\"4\",\"score\":\"5\"},{\"type\":\"2\",\"num\":\"4\",\"score\":\"5\"},{\"type\":\"3\",\"num\":\"4\",\"score\":\"5\"},{\"type\":\"4\",\"num\":\"4\",\"score\":\"5\"},{\"type\":\"5\",\"num\":\"2\",\"score\":\"10\"}]', '0');
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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of teacher
-- ----------------------------
BEGIN;
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (56, '王国富', 'undefined', '18580549287', '440101200902019676', 'dd1f8fd316af08ecd98eccab0b993405', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (57, '卫代芙', NULL, '15344873710', '440101200502013734', '8d61e0271b0d71030f4ac2dab7a6b483', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (58, '展高原', NULL, '13512907952', '440101200502019933', '73e406abac63e08078675092a56ee185', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (59, '吴爽', NULL, '17547359484', '440101200502016038', '259c5c9575bf6c51b0b3ef9684551a54', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (60, '斋娜兰', NULL, '13370567321', '44010120050201901X', '99677471acb5ddf1ad19b3bcecd38d49', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (61, '谢阳阳', NULL, '14769778361', '440101200502019255', 'ab097cfcb37864d90180e42ba63234c3', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (62, '边映雁', NULL, '13922879494', '440101200502012133', '657e4ecbf2330178df17a1d30aa16b82', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (63, '犁语风', NULL, '17402476856', '440101200502011499', '2e5d2d609af5690428603d04007bdbd0', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (64, '由乐安', NULL, '13172814925', '440101200502017815', '2b60b7a7fb5386eb8ae72f89547c3103', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (65, '偶涵桃', NULL, '15216678822', '440101200502011798', 'f2987467d97ee333fb24f60b64c8fd4d', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (66, '性智敏', NULL, '18657007326', '440101200502017110', 'af227e9741549eee418c67a7a78a9830', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (67, '滕卿云', NULL, '15750562185', '440101200502012889', '99cd5e84aba37b1a1bcc6dcb32b0e5a3', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (68, '皮文林', NULL, '15510839591', '440101200502018287', '0f273b8d5a04136f93b9eea6cf25607e', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (69, '融铃语', NULL, '16742331356', '440101200502016927', '3c3e95642dfcd161a25deab4eee83fc1', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (70, '戎雨梅', NULL, '13034035264', '44010120050201776X', '856cf7ce80ec4327510af0ed7e39d1b8', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (71, '仵红艳', NULL, '15348901991', '440101200502012926', '3603f6888a5b8a2895378685bc2ec15f', '0');
INSERT INTO `teacher` (`teacherid`, `teachername`, `thumb`, `mobile`, `idcard`, `password`, `enable`) VALUES (72, '沙尹', NULL, '13331013427', '440101200502012766', '1a013d0a1340a58e209b581659b3cbad', '0');
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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` (`userid`, `username`, `password`, `thumb`, `mobile`, `idcard`, `account`, `enable`) VALUES (37, '超级管理员', 'e10adc3949ba59abbe56e057f20f883e', NULL, '18812345769', '110101201602012454', 'admin', '0');
INSERT INTO `user` (`userid`, `username`, `password`, `thumb`, `mobile`, `idcard`, `account`, `enable`) VALUES (38, 'test', 'bd5ff0a05d3f9987b7e7a9119f1db94b', '', '15371132440', '440101200902012415', 'test', '0');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
