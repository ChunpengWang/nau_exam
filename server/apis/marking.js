const express = require('express');
const connection = require('../db');
const router = express.Router();
const mq = require('mysql-queries');
const fs = require("fs");
const async = require('async');
const crypto = require('crypto');
const moment = require('moment');
const _ = require('lodash');

function getUuid () {
    const buf =crypto.randomBytes(16);
    const randomString = buf.toString('hex');
    return randomString
}


//获取已结束 和计划结束时间小于当前时间 的考试计划
router.post('/getendplan', (req, res) => {


    // 多条件查询，动态拼接sql
    let sql1 = 'SELECT plan.markstate,plan.enddate,plan.state,plan.planid,plan.planname FROM plan WHERE state IN ("1","2")'

    mq.queries([sql1], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
        if (err) {
            res.send({
                state: 0,
                msg:'查询失败',
            })
        } else {
            let currentDate = moment().endOf('day').valueOf()
            let arr = (results[0] || []).filter(item =>{
                let endDate = moment(item.enddate).endOf('day').valueOf()
                return item.state == '2' || (item.state == '1' && endDate < currentDate)
            })
            res.json({
                state: 200,
                data: arr,
            });
        }
    });
});



//获取已结束 和计划结束时间小于当前时间 的考试计划 的详细信息
router.post('/getendplandetail', (req, res) => {

    let planid = req.body.planid

    // 多条件查询，动态拼接sql
    let sql1 = 'SELECT plan.paperlist,plan.scenelist,plan.studentnum,plan.studentnumtotal FROM plan WHERE planid="'+planid+'"'
    let sql2 = 'SELECT answer.ismark,answer.isneedmark,answer.subjectcode,answer.answerflag,answer.answerstartdate FROM answer WHERE planid="'+planid+'"'

    mq.queries([sql1,sql2], [[],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
        if (err) {
            res.send({
                state: 0,
                msg:'查询失败',
            })
        } else {
            let planObj = results[0][0];
            let answerArr = results[1]

            let paperList = JSON.parse(planObj.paperlist || '[]')
            let studentNumObj = JSON.parse(planObj.studentnumtotal || '{}');
            let examCourseList = JSON.parse(planObj.scenelist || '[]').map((ele,index) => {
                let obj = paperList.find(pitem=> pitem.subjectid == ele.subjectid) || {}
                let studentnum = studentNumObj[obj.subjectcode || ''] || '' //该场考生数
                let [a,b,c] = [0,0,0]; //该场科目  答题卡数、需要评阅的、已经评阅的
                answerArr.forEach(aitem =>{
                  if(aitem.subjectcode == obj.subjectcode){
                    a++
                    if(aitem.isneedmark == 1){
                      b++
                      if(aitem.ismark == 1){
                        c++
                      }
                    }
                  }
                })


                return {
                    name:`第${index+1}场`,
                    studentnum,
                    answernum:a,
                    needmarknum:b,
                    alredaynum:c,
                };
            });


            res.json({
                state: 200,
                data: examCourseList
            });
        }
    });
});




//获取考试计划的阅卷老师
router.post('/getmarkteacher', (req, res,) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
    planid = req.body.planid,
    teachername = req.body.teachername;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM mark_teacher WHERE 1=1'
  if (planid) sql1 = sql1 + " AND planid= '" + planid + "'"
  if (teachername) sql1 = sql1 + " AND teachername= '" + teachername + "'"
  sql1+=' order by markteacherid desc limit ?,?'

    let sql2 = 'SELECT count(*) FROM mark_teacher WHERE 1=1'
    if (planid) sql2 = sql2 + " AND planid= '" + planid + "'"
    if (teachername) sql2 = sql2 + " AND teachername= '" + teachername + "'"


  const sqls = [sql1,sql2]

  mq.queries(sqls, [[page,pageSize]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      res.json({
        state: 200,
        data: {
          records:results[0],
          current:parseInt(req.body.current),
          size:pageSize,
          total: results[1][0]['count(*)']
        },
      });
    }
  });
});




//删除考试计划的阅卷老师
router.post('/clearmarkteacher',  (req, res) => {
  const reqBody = req.body
  const sql1 = 'DELETE FROM mark_teacher WHERE planid="'+reqBody.planid+'"'
  // const sql2 = `update plan set studentnum = NULL,studentnumtotal = NULL WHERE planid = '${reqBody.planid}'`
  let resBody = { state: 0,msg:'',data:{} };
  mq.queries([sql1], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results ==',results[0])
    if((results[0] || {})['affectedRows'] == 1){
      resBody.msg = '删除成功';
      resBody.state = 200;
    }else{
      resBody.msg= '删除失败'
    }
    res.send(resBody)
  });
})





//获取已结束 和计划结束时间小于当前时间 的考试计划 所有科目
router.post('/getendplansubject', (req, res) => {

  let planid = req.body.planid

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT plan.paperlist,plan.scenelist,plan.studentnum,plan.studentnumtotal FROM plan WHERE planid="'+planid+'"'
  let sql2 = 'SELECT answer.isdistribute,answer.ismark,answer.isneedmark,answer.subjectcode,answer.answerflag,answer.answerstartdate FROM answer WHERE planid="'+planid+'"'

  mq.queries([sql1,sql2], [[],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      let planObj = results[0][0];
      let answerArr = results[1]

      let paperList = JSON.parse(planObj.paperlist || '[]')
      let studentNumObj = JSON.parse(planObj.studentnumtotal || '{}');

      let newArr = []
      JSON.parse(planObj.scenelist || '[]').forEach((ele,index) => {
        let obj = paperList.find(pitem=> pitem.subjectid == ele.subjectid) || {}

        let [a,b,c,d] = [0,0,0,0]; //该场科目  答题卡数、需要评阅的、已经评阅的、已分配
        answerArr.forEach(aitem =>{
          if(aitem.subjectcode == obj.subjectcode){
            a++
            if(aitem.isneedmark == 1){ //需要评阅
              b++
              if(aitem.ismark == 1){ //已评阅
                c++
              }
              if(aitem.isdistribute == 1){ //已分配
                d++
              }
            }
          }
        })

        if(b){
          newArr.push({
            dtksl:b, //答题卡总数
            assignmentNum:d, // 已分配
            noAssignmentNum:b-d, //未分配
            completedNum:c ,// 已评阅
            noCompletedNum:d-c ,// 未评阅
            kskmmc:ele.subjectname,//考试科目名称
            qykskmId:obj.subjectcode,//科目ID
            // subjectcode:obj.subjectcode,//科目编号

          })
        }

      });


      res.json({
        state: 200,
        data: newArr
      });
    }
  });
});


//根据ID获取考试计划的阅卷老师
router.post('/getmarkteacherbyid', (req, res,) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
    planid = req.body.planid,
    subjectcode = req.body.qykskmId,
    teachername = req.body.teachername;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM mark_teacher WHERE planid="'+planid+'"'
  if (subjectcode) sql1 = sql1 + " AND subjectcode= '" + subjectcode + "'"
  if (teachername) sql1 = sql1 + " AND teachername= '" + teachername + "'"
  sql1+=' order by markteacherid desc limit ?,?'


  let sql2 = 'SELECT count(*) FROM mark_teacher WHERE planid="'+planid+'"'
  if (subjectcode) sql2 = sql2 + " AND subjectcode= '" + subjectcode + "'"
  if (teachername) sql2 = sql2 + " AND teachername= '" + teachername + "'"

  const sqls = [sql1,sql2]
  // console.log('sqls = ',sqls)

  mq.queries(sqls, [[page,pageSize]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      res.json({
        state: 200,
        data: {
          records:results[0],
          current:parseInt(req.body.current),
          size:pageSize,
          total: results[1][0]['count(*)']
        },
      });
    }
  });
});



//一键分配阅卷任务
router.post('/distributemarktask', (req, res,) => {

  let planid = req.body.planid;


  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT mark_teacher.tasknum,mark_teacher.markteacherid,mark_teacher.subjectcode FROM mark_teacher WHERE planid="'+planid+'"'

  let sql2 = 'SELECT answer.answerid,answer.subjectcode FROM answer WHERE planid="'+planid+'" AND isneedmark="1" AND isdistribute !="1"'


  const sqls = [sql1,sql2]
  // console.log('sqls = ',sqls)

  mq.queries(sqls, [[],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if (err) {
      res.send({
        state: 0,
        msg:'分配失败',
      })
    } else {
      let answerArr = results[1];
      let teacherArr = results[0];
      let teacherTempArr = results[0]

      let arr = [];
      answerArr.forEach(item => {
          let tarr = teacherTempArr.filter(titem => titem.subjectcode == item.subjectcode) || []
          let tidarr = tarr.map(tele => tele.markteacherid) || []
          if(tarr.length){
              let minId = Math.min(...tidarr);
              let tindex = teacherArr.findIndex(taitem => taitem.markteacherid == minId);
              teacherArr[tindex]['tasknum'] ++;
                  arr.push({
                    tid:minId,
                    tnum:teacherArr[tindex]['tasknum'],
                    aid:item.answerid,
                    subjectcode:item.subjectcode
                  })
              teacherTempArr = teacherTempArr.filter(item => item.markteacherid != minId)
          }
      })

      async.map(arr,(item,callback)=>{
        let sql3 = `update answer set isdistribute = '1',markteacherid = '${item.tid}' WHERE answerid = '${item.aid}'`
        let sql4 = `update mark_teacher set tasknum = '${item.tnum}' WHERE markteacherid = '${item.tid}'`
        mq.queries([sql3,sql4], [[],[]],  (err1, results1) => {
          if(err1){
            callback(err1)
          }else{
            callback(null,item)
          }
        })
      },(err,resp)=>{
        if(!err){
          res.json({
            state: 200,
            data: {},
            msg:'一键分配成功'
          });
        }else{
          res.json({
            state:0,
            msg:'操作失败',
            data:{}
          });
        }
      })
    }
  });
});





//获取考试计划下阅卷老师的任务量
router.post('/getmarkteachertask', (req, res) => {


    let planid = req.body.planid,
        markteacherid = req.body.markteacherid;
    // 多条件查询，动态拼接sql
    let sql1 = 'SELECT answer.subjectcode FROM answer WHERE isneedmark="1" AND markteacherid="'+markteacherid+'" AND planid="'+planid+'"'

    mq.queries([sql1], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
        if (err) {
            res.send({
                state: 0,
                msg:'查询失败',
            })
        } else {
            let obj = {};
            (results[0] || []).forEach(item =>{
               if( obj[item['subjectcode']]){
                   obj[item['subjectcode']] ++
               }else{
                   obj[item['subjectcode']] = 1
               }
            })
            res.json({
                state: 200,
                data: obj,
            });
        }
    });
});



//增加或减少考试计划下阅卷老师的任务量
router.post('/changemarkteachertask', (req, res) => {


    let planid = req.body.planid,
        markteacherid = req.body.yjryId,
        subjectcode = req.body.qykskmId,
        isAddFlag = req.body.isAdd,
        addReducenum = req.body.addReduce || 0;

    // 多条件查询，动态拼接sql
    let sql1 = `SELECT mark_teacher.tasknum FROM mark_teacher WHERE planid='${planid}' AND markteacherid='${markteacherid}' AND subjectcode='${subjectcode}'`
    let sql2 = `SELECT answer.answerid FROM answer WHERE planid='${planid}' AND markteacherid='${markteacherid}' AND isdistribute='1' AND subjectcode='${subjectcode}'`
    let sql5 = `SELECT answer.answerid FROM answer WHERE planid='${planid}' AND isneedmark='1' AND isdistribute='0' AND subjectcode='${subjectcode}'`

    mq.queries([sql1,sql2,sql5], [[],[],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
        // console.log('results = ',results)
        if (err) {
            res.send({
                state: 0,
                msg:'操作失败',
            })
        } else {
            // console.log('results ==',results)
            let answerArr = results[1] || [];
            let notAnswerArr = results[2] || [];
            let teacherTaskNum = results[0][0]['tasknum'] || 0;
            let newArr = []
            if(isAddFlag){ //增加
                if(notAnswerArr.length > addReducenum){
                    newArr = _.sampleSize(notAnswerArr,addReducenum)
                }else{
                    if(notAnswerArr.length){
                        let num1 = addReducenum - notAnswerArr.length
                        newArr = [..._.sampleSize(answerArr,num1),...notAnswerArr]
                    }else{
                        newArr = _.sampleSize(answerArr,addReducenum)
                    }
                }
            }else { //减少
                newArr = _.sampleSize(answerArr,addReducenum)
            }

            // console.log('newArr ==',newArr)

            async.map(newArr,(item,callback)=>{
                let sql3='',sql4='';
                if(isAddFlag){
                    teacherTaskNum++
                     sql3 = `update answer set isdistribute = '1',markteacherid = '${markteacherid}' WHERE answerid = '${item.answerid}'`
                     sql4 = `update mark_teacher set tasknum = '${teacherTaskNum}' WHERE markteacherid = '${markteacherid}'`
                }else{
                    teacherTaskNum--
                    sql3 = `update answer set isdistribute = '0',markteacherid = '${0}' WHERE answerid = '${item.answerid}'`
                    sql4 = `update mark_teacher set tasknum = '${teacherTaskNum}' WHERE markteacherid = '${markteacherid}'`
                }

                mq.queries([sql3,sql4], [[],[]],  (err1, results1) => {
                    if(err1){
                        callback(err1)
                    }else{
                        callback(null,item)
                    }
                })
            },(err,resp)=>{
                if(!err){
                    res.json({
                        state: 200,
                        data: {},
                        msg:'操作成功'
                    });
                }else{
                  res.json({
                    state:0,
                    msg:'操作失败',
                    data:{}
                  });
                }
            })
        }
    });

});




//重置考试计划下阅卷老师的任务量
router.post('/resetmarkteachertask', (req, res) => {


    let planid = req.body.planid;
    // 多条件查询，动态拼接sql
    let sql1 = `update answer set isdistribute = '0',markteacherid = '${0}' WHERE planid = '${planid}' AND isneedmark = '1'`
    let sql2 = `update mark_teacher set tasknum = '${0}' WHERE planid = '${planid}'`

    mq.queries([sql1,sql2], [[],[]],  (err, results) => {
        if (err) {
            res.send({
                state: 0,
                msg:'重置失败',
            })
        } else {
            res.json({
                state: 200,
                data: {},
                msg:'重置成功',
            });
        }
    });
});



//阅卷分配状态确认
router.post('/markstateconfirm', (req, res) => {


    let planid = req.body.planid;
    // 多条件查询，动态拼接sql
    let sql1 = `update plan set markstate = '2' WHERE planid = '${planid}'`

    mq.queries([sql1], [[],[]],  (err, results) => {
        if (err) {
            res.send({
                state: 0,
                msg:'确认失败',
            })
        } else {
            res.json({
                state: 200,
                data: {},
                msg:'确认成功',
            });
        }
    });
});


//获取所有可用科目列表  根据计划id
router.post('/getsubjectbyid', (req, res) => {


    const sqls = [
        'SELECT * FROM subject WHERE enable="0"',
        'SELECT plan.subjectids FROM plan WHERE planid="'+req.body.planid+'"',
    ]

    mq.queries(sqls, [[],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
        if (err) {
            res.send({
                state: 0,
                msg:'查询失败',
            })
        } else {

            let subjectList = results[0] || []
            let planSubjectids = (results[1][0]['subjectids'] || '').split(',')

            res.json({
                state: 200,
                data: subjectList.filter(item => planSubjectids.includes(item.subjectid+'')),
            });
        }
    });
});




//获取所有可用科目列表  根据计划id 和老师id
router.post('/getanswerbyid', (req, res) => {

    let page = parseInt(req.body.current),
        pageSize = parseInt(req.body.size || 10),
        type = req.body.type, // 1待评阅 2已评阅
        subjectcode = req.body.subjectcode,
        idcard = req.body.idcard,
        planid = req.body.planid;
    page = (page - 1) * pageSize


    const sqls = [`SELECT mark_teacher.markteacherid FROM mark_teacher WHERE planid='${planid}' AND idcard='${idcard}'`]
    mq.queries(sqls, [[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
        if (err) {
            res.send({
                state: 0,
                msg:'查询失败',
            })
        } else {
            let markteacherid = results[0][0]['markteacherid'] || ''

            if(markteacherid){

                let sql1 = 'SELECT answer.releassetotalscore,answer.paperid,answer.answerid,answer.ismark,answer.subjectcode,answer.laborscore,answer.systemscore FROM answer WHERE markteacherid="'+markteacherid+'" AND planid="'+planid+'"'
                if (type) sql1 = sql1 + " AND ismark= '" + (type == 1?'0':'1') + "'"
                if (subjectcode) sql1 = sql1 + " AND subjectcode= '" + subjectcode + "'"
                sql1+=' order by answerid desc limit ?,?'

                let sql2 = 'SELECT count(*) FROM answer WHERE markteacherid="'+markteacherid+'" AND planid="'+planid+'"'
                if (type) sql2 = sql2 + " AND ismark= '" + (type == 1?'0':'1') + "'"
                if (subjectcode) sql2 = sql2 + " AND subjectcode= '" + subjectcode + "'"


                mq.queries([sql1,sql2], [[page,pageSize],[]],  (err1, results1) => {
                    if(!err1){
                        res.json({
                            state: 200,
                            data: {
                                records:results1[0],
                                current:parseInt(req.body.current),
                                size:pageSize,
                                total: results1[1][0]['count(*)']
                            },
                        });
                    }else{
                        res.send({
                            state: 0,
                            msg:'查询失败',
                        })
                    }
                })

            }  else {
                res.send({
                    state: 0,
                    msg:'查询失败',
                })
            }

        }
    });
});



//获取所有可用科目列表  根据计划id 和老师id
router.post('/getanswertotalbyid', (req, res) => {

    let planid = req.body.planid,
        idcard = req.body.idcard;
    const sqls = [`SELECT mark_teacher.markteacherid FROM mark_teacher WHERE planid='${planid}' AND idcard='${idcard}'`]

    mq.queries(sqls, [[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
        if (err) {
            res.send({
                state: 0,
                msg:'查询失败',
            })
        } else {
            let markteacherid = results[0][0]['markteacherid'] || ''
            if(markteacherid){
                let sql1 = `SELECT answer.ismark FROM answer WHERE markteacherid='${markteacherid}' AND planid='${planid}'`
                mq.queries([sql1], [[]],  (err1, results1) => {
                    if(!err1){
                        let answerArr = results1[0] || []
                        let completedNum = (answerArr.filter(item => item.ismark == 1) || []).length

                        res.json({
                            state: 200,
                            data: {
                                noCompletedNum: answerArr.length - completedNum,
                                completedNum
                            },
                        });
                    }else{
                      res.json({
                        state:0,
                        msg:'操作失败',
                        data:{}
                      });
                    }
                })

            }else{
                res.send({
                    state: 0,
                    msg:'查询失败',
                })
            }
        }
    });
});



//获取答题卡信息内容
router.post('/getanswercontentbyid', (req, res) => {

  let answerid = req.body.answerid

  const sql1 = 'SELECT answer.answercontent FROM answer WHERE answerid="'+answerid+'"'

  mq.queries([sql1], [[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results[0])
    // console.log('err = ',err)
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      let answerObj = results[0][0]
      let str = (answerObj['answercontent'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
      res.json({
        state: 200,
        data: JSON.parse(str),

        // data: JSON.parse(str).map(item=>{
        //       return {
        //         answer:item.answer,
        //         type:item.type,
        //         questionid:item.questionid,
        //       }
        //     }),
      });
    }
  });
});




//获取试卷内容
router.post('/getpapercontentbyid', (req, res) => {

  let paperid = req.body.paperid

  const sql1 = 'SELECT paper.totalscore,paper.papername,paper.questionlist FROM paper WHERE paperid="'+paperid+'"'

  mq.queries([sql1], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results[0])
    // console.log('err = ',err)
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      let questionObj = results[0][0] || {}
      let jsonstr = (questionObj['questionlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r");

        let questionArr = JSON.parse(jsonstr)
      res.json({
        state: 200,
        data: {
            papername:questionObj.papername || '',
            totalscore:questionObj.totalscore || '',
            questionArr
        }
      });
    }
  });
});



//阅卷提交分数
router.post('/submitscore', (req, res) => {

  let planid = req.body.planid,
    answerid = req.body.answerid,
    subjectcode = req.body.subjectcode,
    idcard = req.body.idcard,
    paperid = req.body.paperid,
    arrlist = req.body.arrlist;



  let sqls = [
    `SELECT mark_teacher.reviewednum FROM mark_teacher WHERE planid='${planid}' AND subjectcode='${subjectcode}' AND idcard='${idcard}'`,
    `SELECT answer.systemscore,answer.answercontent FROM answer WHERE answerid='${answerid}'`,
    `SELECT paper.passscore FROM paper WHERE paperid='${paperid}'`,
  ]
  mq.queries(sqls, [],  (err1, results1) => {
    if(!err1){
      let reviewednum = ((results1[0] || [] )[0] || {}).reviewednum || 0
      let systemscore = ((results1[1] || [] )[0] || {}).systemscore || 0
      let answercontentstr = (((results1[1] || [] )[0] || {}).answercontent || '').replace(/\n/g,"\\n").replace(/\r/g,"\\r");
      let passscore = ((results1[2] || [] )[0] || {}).passscore || 0;
        let str = (arrlist || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
        let laborscore = 0

        let answercontent = []
        let ssList = JSON.parse(str) || []
        ssList.forEach(item => {
            laborscore += parseInt(item.scoreValue)
        });
        answercontent = JSON.parse(answercontentstr).map(aitem=> {
            ssList.forEach(sitem => {
                if(aitem.questionid == sitem.questionid){
                    aitem.answerScoreValue = parseInt(sitem.scoreValue)
                }
            })
            return aitem
        })

        // console.log('answercontent ==',answercontent)
      let totalScore =  parseInt(laborscore) + parseInt(systemscore)
      let ispass = totalScore >= parseInt(passscore) ? '1' : '2'

      let sql1=[
        `update answer set answercontent = '${JSON.stringify(answercontent)}', reviewcontent = '${arrlist}',ismark = '${1}',releassetotalscore = '${totalScore}',ispass = '${ispass}',laborscore = '${laborscore}' WHERE answerid = '${answerid}'`,
          `update mark_teacher set reviewednum = '${reviewednum +1}' WHERE  planid='${planid}' AND subjectcode='${subjectcode}' AND idcard='${idcard}'`
      ]
      mq.queries(sql1, [],  (err, results) => {
        if (err) {
          res.send({
            state: 0,
            msg:'操作失败',
          })
        } else {
          res.json({
            state: 200,
            msg:'提交成功',
            data: {}
          });
        }
      });
    }else{
      res.send({
        state: 0,
        msg:'操作失败',
      })
    }
  })




});




module.exports = router;
