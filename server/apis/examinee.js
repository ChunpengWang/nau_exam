const express = require('express');
const connection = require('../db');
const router = express.Router();
const mq = require('mysql-queries');
const fs = require("fs");
const async = require('async');
const moment = require('moment');
const crypto = require('crypto');
const _ = require('lodash');
function getUuid () {
  const buf =crypto.randomBytes(16);
  const randomString = buf.toString('hex');
  return randomString
}



//根据考生身份证获取正在考试计划
router.post('/getplanlistbyidcard', (req, res) => {
  const sqls = [
      `SELECT plan.planname,plan.planid FROM plan LEFT JOIN plan_student ON (plan.planid=plan_student.planid) WHERE plan.state="1" AND plan_student.idcard = "${req.body.idcard}"`
  ]
  mq.queries(sqls, [],  (err, results) =>{//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.json({
        state:0,
        msg:'操作失败',
        data:{}
      });
    } else {
      res.json({
        state: 200,
        data: results[0],
      });
    }
  });

});


//根据考生身份证获取正在考 且没有交卷的 场次信息
router.post('/getplanbyidcard', (req, res) => {
  let reqBody = req.body
  // console.log('reqBody = ',reqBody)
  let planid = reqBody.planid
  const sqls = [
    `SELECT plan.paperlist,plan.scenelist FROM plan WHERE plan.planid="${planid}"`,
    `SELECT * FROM plan_student WHERE idcard="${reqBody.idcard}" AND planid="${planid}"`,
  ]
  mq.queries(sqls, [],  (err, results) =>{//"results"为数组,其为多条SQL的执行结果.
    // console.log('results ==',results)
    if (err) {
      res.json({
        state:0,
        msg:'操作失败',
        data:{}
      });
    } else {

      const planObj= results[0][0]
      const studentArr= results[1] || []
      let paperList = JSON.parse(planObj.paperlist || '[]')
      let index = 0
      async.map(JSON.parse(planObj.scenelist || '[]'), (item,callback)=>{
        index++
        let paperData = paperList.find(ele => ele.subjectid == item.subjectid) || {}

        async.map(studentArr,(sitem,callback1)=>{
          if(sitem.subjectcode == paperData.subjectcode){
            let paperid = paperData.paperid
            let studentcode = sitem.studentcode

            const sqlss =[
              'SELECT paper.duration,paper.questionlist FROM paper WHERE paperid="'+paperid+'"',
              'SELECT answer.answerid,answer.answerstartdate,answer.answerflag FROM answer WHERE paperid="'+paperid+'" AND studentcode="'+studentcode+'" AND planid="'+planid+'" AND subjectcode="'+sitem.subjectcode+'"',
            ]
            mq.queries(sqlss, [[],[]],(err, docArr) => {
              if(err){
                callback1(err);
              }else{
                // console.log('docArr =',docArr[1])
                let duration = docArr[0][0]['duration']
                let jsonstr = (docArr[0][0]['questionlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
                let questionArr = JSON.parse(jsonstr)
                let answerObj = docArr[1][0] || {}
                if(!docArr[1].length){
                  let isNeedMarking = 0 //试卷是否需要评阅
                  for (let i = 0; i < questionArr.length; i++) {
                    if(questionArr[i]['type'] == 5){
                      isNeedMarking = 1
                      break;
                    }
                    if(questionArr[i]['type'] == 4){
                      let jjstr = (questionArr[i]['questionlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
                      const ques = JSON.parse(jjstr)
                      isNeedMarking = ques.some(qitem => qitem.way == 2) ? '1' : '0'
                    }
                  }

                  let sqlssss= ["INSERT INTO answer (paperid, studentcode,planid,subjectcode,isneedmark,studentname,idcard) VALUES (?,?,?,?,?,?,?)"]
                  mq.queries(sqlssss, [[paperid,studentcode,planid,sitem.subjectcode,isNeedMarking,sitem.studentname,sitem.idcard]],  (err1, doc1) => {//"results"为数组,其为多条SQL的执行结果.
                    // console.log('results = ',results)
                    if(err1){
                      callback1(err1);
                    }else{
                      callback1(null, {
                        duration,
                        answerid:doc1[0]['insertId'],
                        paperid,
                        ...item,
                        scenename:`第${index}场`,
                        ...sitem
                      });
                    }
                  });
                }else{
                  let isTime = false
                  if(answerObj['answerstartdate']){
                    let end = moment(answerObj['answerstartdate']).add(duration, "minute").valueOf()
                    isTime = moment().valueOf() >= end
                  }
                  // 过滤已提交过的考试 并且答题时间到了
                  let aaobj = isTime || answerObj['answerflag'] == 1 ? null : {
                    duration,
                    paperid,
                    answerid:answerObj['answerid'],
                    ...item,
                    scenename:`第${index}场`,
                    ...sitem
                  }
                  callback1(null, aaobj);
                }
              }
            })
          }else{
            callback1(null,null)
          }
        }, (err1,resp1)=>{
          if(err1){
            callback(err1)
          }else{
            callback(null,resp1.filter(ritem => ritem)[0])
          }
        })

      },(error,resparr) => {
        if(error){
          res.json({
            state:0,
            msg:'操作失败',
            data:{}
          });
        }else{
          res.json({
            state: 200,
            data: resparr.filter(item => item),
          });
        }
      })

    }
  });

});


//考生开始答题
router.post('/startexam', (req, res) => {
 let answerid = req.body.answerid

  let sqls=[
      `SELECT answer.answerstartdate FROM answer WHERE answerid="${answerid}"`
  ]
  mq.queries(sqls, [],  (err, results) =>{//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.json({
        state:0,
        msg:'操作失败',
        data:{}
      });
    } else {
      // console.log('results [0] =',results [0])
      let answerstartdate = results[0][0]['answerstartdate'] || ''
      if(!answerstartdate){
        let currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
        let sql1=[
          `update answer set answerstartdate = '${currentDate}' WHERE answerid = '${answerid}'`
        ]
        mq.queries(sql1, [],  (err1, results1) =>{
          if(err1){
            res.json({
              state:0,
              msg:'操作失败',
              data:{}
            });
          }else{
            // console.log('results1[0] =',results1[0])
            if(results1[0]['affectedRows'] === 1){
              res.json({
                state: 200,
                data: currentDate,
              });
            }
          }
        })
      }else{
        res.json({
          state: 200,
          data: moment(answerstartdate).format('YYYY-MM-DD HH:mm:ss'),
        });
      }
    }
  });

});




//获取试卷内容
router.post('/getpaperbyid', (req, res) => {

  let paperid = req.body.paperid

  const sql1 = 'SELECT paper.questionlist FROM paper WHERE paperid="'+paperid+'"'

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
      let jsonstr = (questionObj['questionlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
      let questionArr = JSON.parse(jsonstr).map(item=>{
        item.questionList = (item.questionList || []).map(ele => {
          ele.optionList = (ele.optionList || []).map(oitem => {
            let value = oitem.value
            if(ele.type == '4' && ele.way == '1'){ // 填空题 自动判分时去掉正确答案
              value = ''
            }
            return {
              oid:oitem.oid,
              value
            }
          })
          ele.referenceanswer = null
          return ele
        })
        return item
      })
      res.json({
        state: 200,
        data: questionArr,
      });
    }
  });
});

//获取答题卡信息
router.post('/getanswerbyid', (req, res) => {

  let answerid = req.body.answerid

  const sql1 = 'SELECT answer.answercontent,answer.answerstartdate FROM answer WHERE answerid="'+answerid+'"'

  mq.queries([sql1], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results[0])
    // console.log('err = ',err)
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      let answerObj = results[0][0]
      // console.log('answerObj ==',answerObj)
      let str = answerObj['answercontent'] || '[]'
       str = str.replace(/\n/g,"\\n").replace(/\r/g,"\\r")
      let answerArr = JSON.parse(str).map(item=>{
        return {
          answer:item.answer,
          type:item.type,
          questionid:item.questionid
        }
      })
      res.json({
        state: 200,
        data: {
          answerArr,
          answerstartdate: moment(answerObj.answerstartdate).format('YYYY-MM-DD HH:mm:ss')
        },
      });
    }
  });
});



//考生提交答案
router.post('/submitanswer', (req, res) => {
  let dtkid = req.body.dtkid,
      paperid = req.body.paperid,
      submitdate = req.body.submitdate,
      submitflag = req.body.submitflag,
      answerList = req.body.answerList;

  let answerListArr = JSON.parse(answerList)

   //  交卷时自动判分
   // console.log('answerListArr ==',answerListArr)
  if(submitflag == 1){
    let sqls=[
      `SELECT paper.passscore,paper.questionlist FROM paper WHERE paperid = '${paperid}'`,
      `SELECT answer.isneedmark FROM answer WHERE answerid = '${dtkid}'`
    ]
    mq.queries(sqls, [],  (err1, results1) =>{
      if(err1){
        res.json({
          state:0,
          msg:'操作失败',
          data:{}
        });
      }else{
        let questionObj = (results1[0] || [])[0] || {}
        let answerObj = (results1[1] || [])[0] || {}
        let jsonstr = (questionObj['questionlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r");
        let scoreValue = 0
        let questionArr = JSON.parse(jsonstr)
        // console.log('questionArr ==',questionArr)
        questionArr.forEach(item=> {
          item.questionList.forEach(qitem => {
            answerListArr = answerListArr.map(aitem => {
              if(qitem.questionid == aitem.questionid){
                let answerScoreValue = 0
                if(qitem.type == 1 || qitem.type == 3){
                  let isRightArr = qitem.optionList.filter(oitem => aitem.answer[0] == oitem.oid && oitem.isRight == 1) || []
                  if(isRightArr.length){
                    scoreValue+= parseInt(item.score)
                    answerScoreValue = parseInt(item.score)
                  }
                }else if(qitem.type == 2){
                  let a1 =  qitem.optionList.filter(oitem => oitem.isRight == 1).map(ooitem => ooitem.oid)
                  if(aitem.answer.every(item=> a1.includes(item)) && aitem.answer.length == a1.length){
                    scoreValue+= parseInt(item.score)
                    answerScoreValue = parseInt(item.score)
                  }
                }else if(qitem.type == 4 && qitem.way == 1){
                  let index = 0
                  for(let k in aitem.answer){
                    if(qitem.optionList[k-1]['value'] == aitem.answer[k].trim()){
                      index ++
                    }
                  }
                  if(index == qitem.optionList.length){
                    scoreValue+= parseInt(item.score)
                    answerScoreValue = parseInt(item.score)
                  }
                }
                aitem.answerScoreValue = answerScoreValue
              }
              return aitem
            })
          })
        })

        // console.log('scoreValue ==',scoreValue)
       // return  console.log('answerListArr ==',answerListArr)
        let resAnswerList = _.cloneDeep(answerListArr)

        // console.log('resAnswerList = ',resAnswerList)


        let sqlstr =  `update answer set releassetotalscore = '${scoreValue}',systemscore = '${scoreValue}',answercontent = '${JSON.stringify(resAnswerList)}',answerdate = '${submitdate}',answerflag = '${submitflag}'`
        if(answerObj.isneedmark != 1){
          let ispass = scoreValue >= questionObj.passscore ? '1' : '2'
          sqlstr +=`,ispass = '${ispass}'`
        }
        sqlstr += ` WHERE answerid = '${dtkid}'`

        mq.queries([sqlstr], [],  (err, results) =>{
          if((results[0] || {})['affectedRows'] === 1){
            res.json({
              state: 200,
              data: {},
            });
          }
        })

      }
    })
  }

  else {

    let sql1=[
      `update answer set answercontent = '${answerList}',answerdate = '${submitdate}',answerflag = '${submitflag}' WHERE answerid = '${dtkid}'`
    ]
    mq.queries(sql1, [],  (err1, results1) =>{
      if((results1[0] || {})['affectedRows'] === 1){
        res.json({
          state: 200,
          data: {},
        });
      }
    })
  }





});



//根据身份证号获取成绩
router.post('/getachievementbyidcard', (req, res, next) => {

  let page = parseInt(req.body.current),
      pageSize = parseInt(req.body.size || 10),
      planid = req.body.planid,
      idcard = req.body.idcard;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT answer.studentname,answer.idcard,answer.subjectcode,answer.releassetotalscore,answer.ispass FROM answer WHERE planid="'+planid+'" AND idcard="'+idcard+'" AND isreleasestate="2" order by answerid desc limit ?,?'
  let sql2 = 'SELECT count(*) FROM answer WHERE planid="'+planid+'" AND idcard="'+idcard+'" AND isreleasestate="2"'

// console.log('[sql1,sql2] ==',[sql1,sql2])
  mq.queries([sql1,sql2], [[page,pageSize]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
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



module.exports = router;


