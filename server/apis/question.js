const express = require('express');
const connection = require('../db');
const router = express.Router();
const mq = require('mysql-queries');
const fs = require("fs");
const async = require('async');
const crypto = require('crypto');
const moment = require('moment');
function getUuid () {
  const buf =crypto.randomBytes(16);
  const randomString = buf.toString('hex');
  return randomString
}


//获取所有可用科目列表
router.post('/getallsubject', (req, res) => {

  const sqls = ['SELECT * FROM subject WHERE enable="0"']

  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      res.json({
        state: 200,
        data: results[0],
      });
    }
  });
});



//获取试题列表
router.post('/getquestion', (req, res, next) => {

  let page = parseInt(req.body.current),
      pageSize = parseInt(req.body.size || 10),
      type = req.body.type,
      relationid = req.body.subjectid,
      enable = req.body.enable;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM question WHERE 1=1'
  if (type) sql1 = sql1 + " AND type= '" + type + "'"
  if (relationid) sql1 = sql1 + " AND relationid= '" + relationid + "'"
  if (enable) sql1 = sql1 + " AND enable= '" + enable + "'"
  sql1+=' order by questionid desc limit ?,?'


  let sql2 = 'SELECT count(*) FROM question WHERE 1=1'
  if (type) sql2 = sql2 + " AND type= '" + type + "'"
  if (relationid) sql2 = sql2 + " AND relationid= '" + relationid + "'"
  if (enable) sql2 = sql2 + " AND enable= '" + enable + "'"


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


//新增试题
router.post('/addquestion',  (req, res) => {
  let reqBodyJson = req.body.json || '{}'
  let resBody = { state: 0,msg:'',data:{} };
  let reqBody = JSON.parse(reqBodyJson)
  let sqls= ["INSERT INTO question (topic, type, way,optionlist,referenceanswer,relationid) VALUES (?,?,?,?,?,?)"]
  mq.queries(sqls, [[reqBody.topic,reqBody.type,reqBody.way,reqBody.optionlist,reqBody.referenceanswer,reqBody.relationid]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('err = ',err)
    // console.log('results = ',results)
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '添加成功';
      resBody.state = 200;
    }else{
      resBody.msg= '添加失败'
    }
    res.send(resBody)
  });
})


//修改试题
router.post('/modifyquestion',  (req, res) => {

  let reqBodyJson = req.body.json || '{}'
  let resBody = { state: 0,msg:'',data:{} };
  let reqBody = JSON.parse(reqBodyJson)
  let sqls=[`update question set topic = '${reqBody.topic}',type = '${reqBody.type}',way = '${reqBody.way}',optionlist = '${reqBody.optionlist}',referenceanswer = '${reqBody.referenceanswer}',relationid = '${reqBody.relationid}' WHERE questionid = '${reqBody.id}'`]
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '修改成功';
      resBody.state = 200;
    }else{
      resBody.msg= '修改失败'
    }
    res.send(resBody)
  });
})


//删除试题
router.post('/deletequestion',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM question WHERE questionid="'+item+'"'
  })
  let resBody = { state: 0,msg:'',data:{} };
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if(results.every(item => item.affectedRows == 1)){
      resBody.msg = '删除成功';
      resBody.state = 200;
    }else{
      resBody.msg= '删除失败'
    }
    res.send(resBody)
  });
})


//修改试题状态
router.post('/changequestion',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update question set enable = '${reqBody.enable}' WHERE questionid = '${reqBody.id}'`]
  let str = reqBody.enable == '1' ? '禁用' : '启用'
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = str + '成功';
      resBody.state = 200;
    }else{
      resBody.msg= str + '失败'
    }
    res.send(resBody)
  });
})



//获取可抽试题数量
router.post('/getquestionnum', (req, res) => {
  let type = req.body.type, relationid = req.body.subjectid;
  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT count(*) FROM question WHERE enable="0"'
  if (relationid) sql1 = sql1 + " AND relationid= '" + relationid + "'"
  if (type) sql1 = sql1 + " AND type= '" + type + "'"
  mq.queries([sql1], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      res.json({
        state: 200,
        data: results[0][0]['count(*)'],
      });
    }
  });
});






//获取策略列表
router.post('/gettactics', (req, res, next) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
     tacticsname = req.body.tacticsname,
    relationid = req.body.subjectid;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM tactics WHERE 1=1'
  if (tacticsname) sql1 = sql1 + " AND tacticsname= '" + tacticsname + "'"
  if (relationid) sql1 = sql1 + " AND relationid= '" + relationid + "'"
  sql1+=' order by tacticsid desc limit ?,?'

  let sql2 = 'SELECT count(*) FROM tactics WHERE 1=1'
  if (tacticsname) sql2 = sql2 + " AND tacticsname= '" + tacticsname + "'"
  if (relationid) sql2 = sql2 + " AND relationid= '" + relationid + "'"

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
          records:(results[0] ||[]).map(item => {
            item.tacticscontentarr = JSON.parse(item.tacticscontent || '[]')
            let totalScore = 0
            let totalQuestion = 0
            item.tacticscontentarr.forEach(ele =>{
              totalScore+=ele.num * ele.score
              totalQuestion+=parseInt(ele.num)
            })
            item.totalQuestion = totalQuestion
            item.totalScore = totalScore
            return item
          }),
          current:parseInt(req.body.current),
          size:pageSize,
          total: results[1][0]['count(*)']
        },
      });
    }
  });
});


//新增策略
router.post('/addtactics',  (req, res) => {
  let reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  // console.log('reqBody ==',reqBody)
  let sqls= ["INSERT INTO tactics (tacticsname, relationid, tacticscontent) VALUES (?,?,?)"]
  mq.queries(sqls, [[reqBody.tacticsname,reqBody.subjectid,reqBody.tacticscontent]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '添加成功';
      resBody.state = 200;
    }else{
      resBody.msg= '添加失败'
    }
    res.send(resBody)
  });
})


//修改策略
router.post('/modifytactics',  (req, res) => {

  let resBody = { state: 0,msg:'',data:{} };
  let reqBody = req.body
  let sqls=[`update tactics set tacticsname = '${reqBody.tacticsname}',relationid = '${reqBody.subjectid}',tacticscontent = '${reqBody.tacticscontent}' WHERE tacticsid = '${reqBody.id}'`]
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '修改成功';
      resBody.state = 200;
    }else{
      resBody.msg= '修改失败'
    }
    res.send(resBody)
  });
})


//删除策略
router.post('/deletetactics',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM tactics WHERE tacticsid="'+item+'"'
  })
  let resBody = { state: 0,msg:'',data:{} };
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if(results.every(item => item.affectedRows == 1)){
      resBody.msg = '删除成功';
      resBody.state = 200;
    }else{
      resBody.msg= '删除失败'
    }
    res.send(resBody)
  });
})


//修改策略状态
router.post('/changetactics',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update tactics set enable = '${reqBody.enable}' WHERE tacticsid = '${reqBody.id}'`]
  let str = reqBody.enable == '1' ? '禁用' : '启用'
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = str + '成功';
      resBody.state = 200;
    }else{
      resBody.msg= str + '失败'
    }
    res.send(resBody)
  });
})




//根据科目id获取所有可用策略列表
router.post('/gettacticsbyid', (req, res) => {
  let relationid = req.body.relationid
  let sql = 'SELECT * FROM tactics WHERE enable="0"'
  if (relationid) sql = sql + " AND relationid= '" + relationid + "'"
  mq.queries([sql], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      res.json({
        state: 200,
        data: (results[0] || []).map(item => {
          item.tacticscontentarr = JSON.parse(item.tacticscontent || '[]')
          let totalScore = 0
          let totalQuestion = 0
          item.tacticscontentarr.forEach(ele =>{
            totalScore+=ele.num * ele.score
            totalQuestion+=parseInt(ele.num)
          })
          item.totalQuestion = totalQuestion
          item.totalScore = totalScore
          return item
        }),
      });
    }
  });
});






//获取试卷列表
router.post('/getpaper', (req, res) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
    papername = req.body.papername,
    subjectid = req.body.subjectid;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM paper WHERE 1=1'
  if (papername) sql1 = sql1 + " AND papername= '" + papername + "'"
  if (subjectid) sql1 = sql1 + " AND subjectid= '" + subjectid + "'"
  sql1+=' order by paperid desc limit ?,?'


  let sql2 = 'SELECT count(*) FROM paper WHERE 1=1'
  if (papername) sql2 = sql2 + " AND papername= '" + papername + "'"
  if (subjectid) sql2 = sql2 + " AND subjectid= '" + subjectid + "'"

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



//新增组卷 同时生成试卷
router.post('/addpaper',  (req, res) => {
  let paperName = req.body.paperName,
    duration = req.body.duration,
    passValue = req.body.passValue,
    totalScore = req.body.totalScore,
    tacticsId = req.body.tacticsId;
  // console.log('reqBody ==',req.body)
  mq.queries(['SELECT * FROM tactics WHERE tacticsid="'+tacticsId+'"'], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'添加失败',
      })
    } else {

      let tacticsObj = results[0][0] || {}
      let subjectId = tacticsObj.relationid
      let tacticsContent = JSON.parse(tacticsObj.tacticscontent || '[]')
      async.map(tacticsContent, (item, callback) =>{
          // SELECT * FROM `lz_adv` WHERE `status` = 1 ORDER BY RAND() LIMIT 1;
          let type = item.type
          let num = item.num
          let sql = `SELECT * FROM question WHERE enable="0" AND relationid="${subjectId}" AND type="${type}" ORDER BY RAND() LIMIT ${num}`
          connection.query(sql, (err, doc) => {
            if(err){
              callback(err);
            }else{
              item.questionList = (doc || []).map(ele => {
                return {
                  topic:ele.topic,
                  questionid:ele.questionid,
                  type:ele.type,
                  way:ele.way,
                  referenceanswer:ele.referenceanswer,
                  optionList: JSON.parse(ele.optionlist || '[]').map(oitem => {
                    oitem.oid= getUuid();
                    return oitem
                  })
                }
              })
              item.bigid= getUuid();
              callback(null, item);
            }
          })
      }, (err,itemObj) =>{
         if(err){
           res.send({
             state: 0,
             msg:'添加失败',
           })
         }else{
           let questionlist = JSON.stringify(itemObj)
           let currenttime = moment().format('YYYY-MM-DD HH:mm:ss')
           let sqls= ["INSERT INTO paper (papername, tacticsid, duration,passscore,questionlist,subjectid,totalscore,createtime) VALUES (?,?,?,?,?,?,?,?)"]
           mq.queries(sqls, [[paperName,tacticsId,duration,passValue,questionlist,subjectId,totalScore,currenttime]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
             // console.log('results = ',results)
             // console.log('err = ',err)
             if((results[0] || {})['affectedRows'] ===1){
               res.json({
                 state: 200,
                 data: {
                   id:results[0]['insertId'],
                   paperName:paperName,
                   tacticsId:tacticsId,
                   duration:duration,
                   passValue:passValue,
                   questionlist,
                 }
               });
             }else{
               res.send({
                 state: 0,
                 msg:'添加失败',
               })
             }

           });
         }
      });






    }
  });

})



//删除试卷
router.post('/deletepaper',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM paper WHERE paperid="'+item+'"'
  })
  let resBody = { state: 0,msg:'',data:{} };
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if(results.every(item => item.affectedRows == 1)){
      resBody.msg = '删除成功';
      resBody.state = 200;
    }else{
      resBody.msg= '删除失败'
    }
    res.send(resBody)
  });
})


//修改试卷状态
router.post('/changepaper',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update paper set enable = '${reqBody.enable}' WHERE paperid = '${reqBody.id}'`]
  let str = reqBody.enable == '1' ? '禁用' : '启用'
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = str + '成功';
      resBody.state = 200;
    }else{
      resBody.msg= str + '失败'
    }
    res.send(resBody)
  });
})







module.exports = router;



