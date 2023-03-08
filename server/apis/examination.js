const express = require('express');
const connection = require('../db');
const router = express.Router();
const mq = require('mysql-queries');
const fs = require("fs");
const async = require('async');
const crypto = require('crypto');
const _ = require('lodash');
function getUuid () {
  const buf =crypto.randomBytes(16);
  const randomString = buf.toString('hex');
  return randomString
}





//获取考试计划列表
router.post('/getplan', (req, res, next) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
    planname = req.body.planname;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT plan.planid,plan.enddate,plan.startdate,plan.state,plan.planname FROM plan WHERE state="0"'
  if (planname) sql1 = sql1 + " AND planname= '" + planname + "'"
  sql1+=' order by planid desc limit ?,?'

  let sql2 = 'SELECT count(*) FROM plan WHERE 1=1'
  if (planname) sql2 = sql2 + " AND planname= '" + planname + "'"

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


//新增计划
router.post('/addplan',  (req, res) => {
  let resBody = { state: 0,msg:'',data:{} };
  let reqBody = req.body;
  let startDate = new Date(reqBody.startdate)
  let endDate = new Date(reqBody.enddate)
  let sqls= ["INSERT INTO plan (planname, startdate, enddate) VALUES (?,?,?)"]
  mq.queries(sqls, [[reqBody.planname,startDate,endDate]], (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '添加成功';
      resBody.state = 200;
    }else{
      resBody.msg= '添加失败'
    }
    res.send(resBody)
  })
})


//修改计划
router.post('/modifyplan',  (req, res) => {

  let resBody = { state: 0,msg:'',data:{} };
  let reqBody = req.body
  let startDate = reqBody.startdate
  let endDate = reqBody.enddate

  let sqls=[`update plan set planname = '${reqBody.planname}', startdate = '${startDate}', enddate = '${endDate}' WHERE planid = '${reqBody.id}'`]
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


//删除计划
router.post('/deleteplan',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM plan WHERE planid="'+item+'"'
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

//改变计划的状态
router.post('/changeplan',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let str = reqBody.state == '1' ? '发布' : '结束'
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return `update plan set state = '${reqBody.state}' WHERE planid = '${item}'`
  })
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if(results.every(item => item.affectedRows == 1)){
      resBody.msg = str + '成功';
      resBody.state = 200;
    }else{
      resBody.msg= str + '失败'
    }
    res.send(resBody)
  });
})


//获取所有的考试计划
router.post('/getallplan', (req, res) => {


    let state = req.body.state


  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM plan WHERE 1=1'
  if (state || state == '0') sql1 = sql1 + " AND state= '" + state + "'"

  mq.queries([sql1], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
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


//根据状态获取所有的考试计划  0未发布 1进行中 2已结束
router.post('/getallplanbystate', (req, res) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
    planname = req.body.planname,
    state = req.body.state;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM plan WHERE 1=1'
  if (planname) sql1 = sql1 + " AND planname= '" + planname + "'"
  if (state) sql1 = sql1 + " AND state= '" + state + "'"
  sql1+=' order by planid desc limit ?,?'

  let sql2= 'SELECT count(*) FROM plan WHERE 1=1'
  if (planname) sql2 = sql2 + " AND planname= '" + planname + "'"
  if (state) sql2 = sql2 + " AND state= '" + state + "'"

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

//根据计划ID 获取没被用过的考试科目
router.post('/getnotusedsubjctbyplanid', (req, res) =>{
  let planid = req.body.planid;
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      let subjectids = results[0][0]['subjectids']
      let sql2 = 'SELECT * FROM subject WHERE enable="0"'
      if (subjectids) sql2 = sql2 + " AND subjectid not in(" + subjectids + ")"
      mq.queries([sql2], [],  (err, resu) => {
      if(err){
        res.send({
          state: 0,
          msg:'查询失败',
        })
      }else{
        res.json({
          state: 200,
          data: resu[0],
        });
      }
    })
    }
  })

});


//根据科目ID 获取可用的考试试卷
router.post('/getallpaperbysubjectid', (req, res) =>{

  let subjectid = req.body.subjectid

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM paper WHERE enable="0"'
  if (subjectid) sql1 = sql1 + " AND subjectid= '" + subjectid + "'"

  mq.queries([sql1], [],  (err, results) => {
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
  })

});


//根据计划ID 获取用过的考试科目
router.post('/getplansubject', (req, res) =>{
  let planid  = req.body.planid;
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
          let jsonstr = ((results[0] || [])[0]['paperlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
          res.json({
            state: 200,
            data: JSON.parse(jsonstr),
          });
    }
  })

});

//新增计划科目
router.post('/addplansubject',  (req, res) => {
  let resBody = { state: 0,msg:'',data:{} };
  let planid = req.body.planid;
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'添加失败',
      })
    } else {
      let subjectids = results[0][0]['subjectids'] || '';
      subjectids = subjectids ? (subjectids + ','+req.body.subjectid) : req.body.subjectid
      let jsonstr = ((results[0] || [])[0]['paperlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
      let paperlist = JSON.parse(jsonstr)
      paperlist.push({
        subjectid:req.body.subjectid,
        subjectname:req.body.subjectname,
        subjectcode:req.body.subjectcode,
        papername:req.body.papername,
        paperid:req.body.paperid,
        id:getUuid()
        })
      let sql2=[`update plan set subjectids = '${subjectids}', paperlist = '${JSON.stringify(paperlist)}' WHERE planid = '${req.body.planid}'`]
      // console.log('sql2 ==',sql2)
      mq.queries(sql2, [],  (err, results) => {
          if((results[0] || {})['affectedRows'] ===1){
            resBody.msg = '添加成功';
            resBody.state = 200;
          }else{
            resBody.msg= '添加失败'
          }
          res.send(resBody)
      })
    }
  })
})


//修改计划科目
router.post('/modifyplansubject',  (req, res) => {
  let resBody = { state: 0,msg:'',data:{} };
  let planid = req.body.planid;
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'添加失败',
      })
    } else {
      let subjectids = results[0][0]['subjectids'] || ''
      let jsonstr = ((results[0] || [])[0]['paperlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
      let paperlist = JSON.parse(jsonstr)
       paperlist = paperlist.map(item => {
        if(item.id === req.body.id){
          subjectids = subjectids.replace(item.subjectid,eq.body.subjectid)
           item = {
              subjectid:req.body.subjectid,
              subjectname:req.body.subjectname,
              subjectcode:req.body.subjectcode,
              papername:req.body.papername,
              paperid:req.body.paperid,
             id:getUuid()
          }
        }
        return item
      })

      let sql2=[`update plan set subjectids = '${subjectids}', paperlist = '${JSON.stringify(paperlist)}' WHERE planid = '${req.body.planid}'`]
      // console.log('sql2 ==',sql2)
      mq.queries(sql2, [],  (err, results) => {
        if((results[0] || {})['affectedRows'] ===1){
          resBody.msg = '修改成功';
          resBody.state = 200;
        }else{
          resBody.msg= '修改失败'
        }
        res.send(resBody)
      })
    }
  })
})

//删除计划科目
router.post('/deleteplansubject',  (req, res) => {
  let resBody = { state: 0,msg:'',data:{} };
  let planid = req.body.planid;
  let idList = req.body.idList || []
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'删除失败',
      })
    } else {
      let subjectids = (results[0][0]['subjectids'] || '').split(',').filter(item => !idList.includes(item)).join()
      let jsonstr = (results[0][0]['paperlist'] || '[]').replace(/\n/g,"\\n").replace(/\r/g,"\\r")
      let paperlist = JSON.parse(jsonstr).filter(item => !idList.includes(item.subjectid))
      let sql2=[`update plan set subjectids = '${subjectids}', paperlist = '${JSON.stringify(paperlist)}' WHERE planid = '${req.body.planid}'`]
      // console.log('sql2 ==',sql2)
      mq.queries(sql2, [],  (err, results) => {
        if((results[0] || {})['affectedRows'] ===1){
          resBody.msg = '删除成功';
          resBody.state = 200;
        }else{
          resBody.msg= '删除失败'
        }
        res.send(resBody)
      })
    }
  })
})




//获取考试计划的学生列表
router.post('/getplanstudent', (req, res, next) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
    subjectcode = req.body.subjectcode,
    planid = req.body.planid,
    studentname = req.body.studentname,
    studentcode = req.body.studentcode;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM plan_student WHERE 1=1'
  if (planid) sql1 = sql1 + " AND planid= '" + planid + "'"
  if (subjectcode) sql1 = sql1 + " AND subjectcode= '" + subjectcode + "'"
  if (studentname) sql1 = sql1 + " AND studentname= '" + studentname + "'"
  if (studentcode) sql1 = sql1 + " AND studentcode= '" + studentcode + "'"
  sql1+=' order by planstudentid desc limit ?,?'

  let sql2 = 'SELECT count(*) FROM plan_student WHERE 1=1'
  if (planid) sql2 = sql2 + " AND planid= '" + planid + "'"
  if (subjectcode) sql2 = sql2 + " AND subjectcode= '" + subjectcode + "'"
  if (studentname) sql2 = sql2 + " AND studentname= '" + studentname + "'"
  if (studentcode) sql2 = sql2 + " AND studentcode= '" + studentcode + "'"


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



//清空考试计划的学生列表
router.post('/clearplanstudent',  (req, res) => {
  const reqBody = req.body
  const sql1 = 'DELETE FROM plan_student WHERE planid="'+reqBody.planid+'"'
  const sql2 = `update plan set studentnum = NULL,studentnumtotal = NULL WHERE planid = '${reqBody.planid}'`
  let resBody = { state: 0,msg:'',data:{} };
  mq.queries([sql1,sql2], [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if(((results[0] || [])[0] || {})['affectedRows'] == 1){
      resBody.msg = '删除成功';
      resBody.state = 200;
    }else{
      resBody.msg= '删除失败'
    }
    res.send(resBody)
  });
})



//根据计划ID 获取场次信息
router.post('/getplanscene', (req, res) =>{
  let planid  = req.body.planid;
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      res.json({
        state: 200,
        data: JSON.parse(results[0][0]['scenelist'] || '[]'),
      });
    }
  })

});

//新增计划场次
router.post('/addplanscene',  (req, res) => {
  let resBody = { state: 0,msg:'',data:{} };
  let planid = req.body.planid;
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'添加失败',
      })
    } else {
      let scenelist = JSON.parse(results[0][0]['scenelist'] || '[]')
      scenelist.push({
        subjectid:req.body.subjectid,
        subjectname:req.body.subjectname,
        startdate:req.body.startdate,
        enddate:req.body.enddate,
        id:getUuid()
      })
      let sql2=[`update plan set scenelist = '${JSON.stringify(scenelist)}' WHERE planid = '${req.body.planid}'`]
      // console.log('sql2 ==',sql2)
      mq.queries(sql2, [],  (err, results) => {
        if((results[0] || {})['affectedRows'] ===1){
          resBody.msg = '添加成功';
          resBody.state = 200;
        }else{
          resBody.msg= '添加失败'
        }
        res.send(resBody)
      })
    }
  })
})


//修改计划场次
router.post('/modifyplanscene',  (req, res) => {
  let resBody = { state: 0,msg:'',data:{} };
  let planid = req.body.planid;
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'添加失败',
      })
    } else {

      let scenelist = JSON.parse(results[0][0]['scenelist'] || '[]')
      scenelist = scenelist.map(item => {
        if(item.id === req.body.id){
          item = {
            subjectid:req.body.subjectid,
            subjectname:req.body.subjectname,
            startdate:req.body.startdate,
            enddate:req.body.enddate,
            id:getUuid()
          }
        }
        return item
      })
      let sql2=[`update plan set scenelist = '${JSON.stringify(scenelist)}' WHERE planid = '${req.body.planid}'`]
      // console.log('sql2 ==',sql2)
      mq.queries(sql2, [],  (err, results) => {
        if((results[0] || {})['affectedRows'] ===1){
          resBody.msg = '修改成功';
          resBody.state = 200;
        }else{
          resBody.msg= '修改失败'
        }
        res.send(resBody)
      })
    }
  })
})

//删除计划场次
router.post('/deleteplanscene',  (req, res) => {
  let resBody = { state: 0,msg:'',data:{} };
  let planid = req.body.planid;
  let idList = req.body.idList || []
  let sql1 = 'SELECT * FROM plan WHERE planid="'+planid+'"'
  mq.queries([sql1], [],  (err, results) => {
    if (err) {
      res.send({
        state: 0,
        msg:'删除失败',
      })
    } else {
      let scenelist = JSON.parse(results[0][0]['scenelist'] || '[]').filter(item => !idList.includes(item.id))
      let sql2=[`update plan set scenelist = '${scenelist}' WHERE planid = '${req.body.planid}'`]
      // console.log('sql2 ==',sql2)
      mq.queries(sql2, [],  (err, results) => {
        if((results[0] || {})['affectedRows'] ===1){
          resBody.msg = '删除成功';
          resBody.state = 200;
        }else{
          resBody.msg= '删除失败'
        }
        res.send(resBody)
      })
    }
  })
})




//根据相关参数获取成绩
router.post('/getachievementbyid', (req, res) => {

  let page = parseInt(req.body.current),
      pageSize = parseInt(req.body.size || 10),
      planid = req.body.planid,//计划id
      subjectcode = req.body.qykskmId,//考试科目
      studentcode = req.body.studentcode, //学生学号
      studentname = req.body.studentname, // 学生姓名
      ispass = req.body.ispass,  // 及格状态
      idcard = req.body.idcard,  // 及格状态
      isreleasestate = req.body.isreleasestate; // 发布状态
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT answer.paperid,answer.answerid,answer.studentname,answer.idcard,answer.studentcode,answer.subjectcode,answer.laborscore,answer.releassetotalscore,answer.isreleasestate,answer.ispass FROM answer WHERE planid="'+planid+'"'
  if (subjectcode) sql1 = sql1 + " AND subjectcode= '" + subjectcode + "'"
  if (studentcode) sql1 = sql1 + " AND studentcode= '" + studentcode + "'"
  if (studentname) sql1 = sql1 + " AND studentname= '" + studentname + "'"
  if (idcard) sql1 = sql1 + " AND idcard= '" + idcard + "'"
  if (ispass) sql1 = sql1 + " AND ispass= '" + ispass + "'"
  if (isreleasestate) sql1 = sql1 + " AND isreleasestate= '" + isreleasestate + "'"
  sql1+=' order by answerid desc limit ?,?'

  let sql2 = 'SELECT count(*) FROM answer WHERE planid="'+planid+'"'
  if (subjectcode) sql2 = sql2 + " AND subjectcode= '" + subjectcode + "'"
  if (studentcode) sql2 = sql2 + " AND studentcode= '" + studentcode + "'"
  if (studentname) sql2 = sql2 + " AND studentname= '" + studentname + "'"
  if (ispass) sql2 = sql2 + " AND ispass= '" + ispass + "'"
  if (idcard) sql2 = sql2 + " AND idcard= '" + idcard + "'"
  if (isreleasestate) sql2 = sql2 + " AND isreleasestate= '" + isreleasestate + "'"


  // console.log('sql1,sql2 =',[sql1,sql2])
  mq.queries([sql1,sql2], [[page,pageSize],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('err = ',err)
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




//获取根据计划id 所有科目
router.post('/getplansubjectbyid', (req, res) => {

  let planid = req.body.planid

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT plan.paperlist FROM plan WHERE planid="'+planid+'"'

  mq.queries([sql1], [[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      let planObj = results[0][0];
      let paperList = JSON.parse(planObj.paperlist || '[]')

      // console.log('paperList ==',paperList)

      async.map(paperList,(item,callback)=>{
        let sql2 = 'SELECT paper.passscore,paper.totalscore FROM paper WHERE paperid="'+item.paperid+'"'
        let sql3 = 'SELECT subject.subjectname FROM subject WHERE subjectid="'+item.subjectid+'"'

        mq.queries([sql2,sql3], [[],[]],  (err1, results1) => {
          if(err1){
            callback(err1)
          }else{
            let paperObj = results1[0][0] || {}
            let subjectObj = results1[1][0] || {}

            callback(null,{
              ...item,
              ...paperObj,
              subjectname:subjectObj.subjectname || ''
            })
          }
        })


      },(err,resp)=>{
        // console.log('resp ==',resp)
         if(!err){
           res.json({
             state: 200,
             data: resp
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



//根据科目  获取试卷总分 及格分
router.post('/getachievementpassbyid', (req, res) => {

  let planid = req.body.planid,
      subjectcode = req.body.subjectcode;

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT answer.ispass FROM answer WHERE planid="'+planid+'" AND subjectcode="'+subjectcode+'"'

  mq.queries([sql1], [[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'查询失败',
      })
    } else {
      let answerArr = results[0] || [];

      res.json({
        state: 200,
        data: {
          pass:(answerArr.filter(item => item.ispass ==1)).length,
          zs:answerArr.length
        }
      });


    }
  });
});


//调整及格分
router.post('/adjustmentpassscorebyid', (req, res) => {

  let planid = req.body.planid,
      subjectcode = req.body.subjectcode,
      subjectid = req.body.subjectid,
      jgx = req.body.jgx;//新的及格线

  let sql1 = `SELECT answer.answerid,answer.releassetotalscore FROM answer WHERE planid='${planid}' AND isreleasestate='1'`
  if(subjectcode) {
    sql1+= ` AND subjectcode='${subjectcode}'`
  }

  let sql2 = `SELECT plan.subjectids FROM plan WHERE planid='${planid}'`

  // console.log('[sql1,sql2] ==',[sql1,sql2])
  mq.queries([sql1,sql2], [[],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'操作失败',
      })
    } else {
      let answerArr = results[0] || [];
      let planArr =  results[1] || []
      let subjectIdArr = ((planArr[0] || {}).subjectids || '').split(',')
      if(subjectid){
        subjectIdArr =  subjectIdArr.filter(item => item == subjectid)
      }
      async.map(answerArr,(item,callback)=>{
        let isPass = item.releassetotalscore >= jgx ? 1 : 2
        let sqls =[`update answer set ispass = '${isPass}' WHERE answerid = '${item.answerid}'`]
         mq.queries(sqls, [[]],  (err1, results1) => {
           if(err1){
             callback(err1)
           }else{
             async.map(subjectIdArr,(sitem,scallback)=>{
               let sqlss =[`update paper set passscore = '${jgx}' WHERE subjectid = '${sitem}'`]
               mq.queries(sqlss, [[]],  (serr1, sresults1) => {
                 if(serr1){
                   scallback(serr1)
                 }else{
                   scallback(null,sitem)
                 }
               })
             },(serr,sresp)=>{
                if(serr){
                  callback(serr)
                }else{
                  subjectIdArr = []
                  callback(null,item)
                }
             })
           }
         })
      },(err11,resp)=>{
        if(!err11){
          res.json({
            state: 200,
            msg:'调整成功',
            data: {}
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



//一键发布成绩
router.post('/oneclickreleaseachievementbyid', (req, res) => {

  let planid = req.body.planid,
      subjectcode = req.body.subjectcode;

  // 多条件查询，动态拼接sql
  let sqls =[`update answer set isreleasestate = '${2}' WHERE planid = '${planid}' AND subjectcode='${subjectcode}'`]
  mq.queries(sqls, [[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'操作失败',
      })
    } else {
      res.json({
        state: 200,
        msg:'一键发布成功',
        data: {}
      });
    }
  });
});



//单独发布成绩
router.post('/releaseachievementbyid', (req, res) => {

  let answerid = req.body.answerid;

  // 多条件查询，动态拼接sql
  let sqls =[`update answer set isreleasestate = '${2}' WHERE answerid = '${answerid}'`]
  mq.queries(sqls, [[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'操作失败',
      })
    } else {
      res.json({
        state: 200,
        msg:'发布成功',
        data: {}
      });
    }
  });
});





//考试统计
router.post('/planstatisticsbyid', (req, res) => {

  let planid = req.body.planid,
      subjectcode = req.body.subjectcode;

  // 多条件查询，动态拼接sql
  let sql1 = `SELECT answer.releassetotalscore,answer.ispass,answer.answerid,answer.answerstartdate FROM answer WHERE planid='${planid}' AND subjectcode='${subjectcode}'`
  let sql2 = `SELECT plan_student.planstudentid FROM plan_student WHERE planid='${planid}' AND subjectcode='${subjectcode}'`

  mq.queries([sql1,sql2], [[],[]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if (err) {
      res.send({
        state: 0,
        msg:'操作失败',
      })
    } else {
        let answerArr = results[0] || [];
        let studentArr = results[1] || [];
        let scoreArr = answerArr.map(item => item.releassetotalscore) || []

          res.json({
            state: 200,
            msg:'查询成功',
            data: {
              skrs:(answerArr.filter(item => item.answerstartdate) || []).length,
              zrs:studentArr.length,
              jgrs:(answerArr.filter(item => item.ispass == 1) || []).length,
              zgf: Math.max(...scoreArr),// 最高
              zdf: Math.min(...scoreArr), // 最低
              pjf: _.mean(scoreArr),// 平均
            }
          });



    }
  });
});


module.exports = router;



