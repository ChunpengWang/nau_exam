const express = require('express');
const connection = require('../db');
const router = express.Router();
const crypto = require('crypto');
const JwtUtil = require('./jwt');
//执行多条SQLs
const mq = require('mysql-queries');
// md5加密
function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};




//登录
router.post('/login', (req, res, next) => {
  let username = req.body.username,
      password = md5(req.body.password),
      type = req.body.type,
      sqlStr = '',
      resBody = { state: 0,msg:'',data:{} };
  if(type == '1'){
    // SELECT * FROM user WHERE account='xxx' AND password='xxx' AND enable='0'
    sqlStr = "SELECT * FROM user WHERE account='"+username+"' AND password='"+password+"' AND enable='0'"
  }else if(type == '2'){
    sqlStr = "SELECT * FROM teacher WHERE idcard='"+username+"' AND password='"+password+"' AND enable='0'"
  }else{
    sqlStr = "SELECT * FROM student WHERE idcard='"+username+"' AND password='"+password+"' AND enable='0'"
  }
  connection.query(sqlStr, (err, doc) => {
    if(err){
      resBody.msg = '账号密码不正确'
      res.send(resBody);
    }else{
        if (doc.length == 0) {
          resBody.msg = '账号密码不正确';
          res.send(resBody);
        } else {
          if (doc[0].password == password) {
            // req.session.user = doc[0].username;
            resBody.msg = '登录成功';
            resBody.state = 200;
            let idName =  ['userid', 'teacherid', 'studentid'][type -1]
            let nameStr =  ['username', 'teachername', 'studentname'][type -1]
            let idValue = doc[0][idName] || ''
            let _id = idValue.toString();
            // 将用户id传入并生成token
            let jwt = new JwtUtil(_id);
            let token = jwt.generateToken();
            resBody.data = {
                  ...doc[0],
                  token,
                  type,
                  name: doc[0][nameStr] || '',
                  id:idValue
              }
            res.send(resBody);
          } else {
            resBody.msg = '密码错误'
            res.send(resBody)
          }
        }
    }
  })

});


//修改密码
router.post('/modifypwd', (req, res, next) => {

  let pwd = md5(req.body.pwd),
      password = md5(req.body.newpwd),
      type = req.body.type,
      id = req.body.id,
      resBody = { state: 0,msg:'',data:{} };
  let idStr = ['userid', 'teacherid', 'studentid'][type -1]
  let tableStr = ['user', 'teacher', 'student'][type -1]
  let sqlStr =  'update '+tableStr+' set password = "' + password + '" WHERE '+idStr+' ="' + id + '" AND password="'+pwd+'"'
  connection.query(sqlStr, (err, doc) => {
      if(doc.affectedRows ===1){
          resBody.msg = '修改成功';
          resBody.state = 200;
      }else{
          resBody.msg= '修改失败'
      }
      res.send(resBody)
  })
});



//获取用户列表
router.post('/getuser', (req, res, next) => {

    let page = parseInt(req.body.current),
        pageSize = parseInt(req.body.size || 10),
        username = req.body.username,
        account = req.body.account,
        mobile = req.body.mobile,
        idcard = req.body.idcard;
    page = (page - 1) * pageSize

    // 多条件查询，动态拼接sql
    let sql1 = 'SELECT * FROM user WHERE 1=1'
    if (account) sql1 = sql1 + " AND account= '" + account + "'"
    if (username) sql1 = sql1 + " AND username= '" + username + "'"
    if (mobile) sql1 = sql1 + " AND mobile= '" + mobile + "'"
    if (idcard) sql1 = sql1 + " AND idcard= '" + idcard + "'"
    sql1+=' order by userid desc limit ?,?'

  let sql2 = 'SELECT count(*) FROM user WHERE 1=1'
  if (account) sql2 = sql2 + " AND account= '" + account + "'"
  if (username) sql2 = sql2 + " AND username= '" + username + "'"
  if (mobile) sql2 = sql2 + " AND mobile= '" + mobile + "'"
  if (idcard) sql2 = sql2 + " AND idcard= '" + idcard + "'"


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


//新增用户
router.post('/adduser',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let pwd = md5(reqBody.password || reqBody.idcard.substr(-6,6))
  let sqls= ["INSERT INTO user (username, account, idcard,password,mobile,thumb) VALUES (?,?,?,?,?,?)"]
  mq.queries(sqls, [[reqBody.username,reqBody.account,reqBody.idcard,pwd,reqBody.mobile,reqBody.thumb]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
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


//修改用户
router.post('/modifyuser',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update user set username = '${reqBody.username}',account = '${reqBody.account}',idcard = '${reqBody.idcard}',mobile = '${reqBody.mobile}',thumb = '${reqBody.thumb}' WHERE userid = '${reqBody.id}'`]
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


//删除用户
router.post('/deleteuser',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.userIdList || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM user WHERE userid="'+item+'"'
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


//修改用户状态
router.post('/changeuser',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update user set enable = '${reqBody.enable}' WHERE userid = '${reqBody.id}'`]
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


//重置用户密码
router.post('/restuser',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let pwd = md5(reqBody.idcard.substr(-6,6))
  let sqls=[`update user set password = '${pwd}' WHERE userid = '${reqBody.id}'`]
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '重置成功';
      resBody.state = 200;
    }else{
      resBody.msg= '重置失败'
    }
    res.send(resBody)
  });
})





//获取教师列表
router.post('/getteacher', (req, res, next) => {

  let page = parseInt(req.body.current),
    pageSize = parseInt(req.body.size || 10),
    teachername = req.body.teachername,
    mobile = req.body.mobile,
    idcard = req.body.idcard;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM teacher WHERE 1=1'
  if (teachername) sql1 = sql1 + " AND teachername= '" + teachername + "'"
  if (mobile) sql1 = sql1 + " AND mobile= '" + mobile + "'"
  if (idcard) sql1 = sql1 + " AND idcard= '" + idcard + "'"
  sql1+=' order by teacherid desc limit ?,?'

  let sql2 = 'SELECT count(*) FROM teacher WHERE 1=1'
  if (teachername) sql2 = sql2 + " AND teachername= '" + teachername + "'"
  if (mobile) sql2 = sql2 + " AND mobile= '" + mobile + "'"
  if (idcard) sql2 = sql2 + " AND idcard= '" + idcard + "'"

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


//新增教师
router.post('/addteacher',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let pwd = md5(reqBody.idcard.substr(-6,6))
  let sqls= ["INSERT INTO teacher (teachername,password, idcard,mobile,thumb) VALUES (?,?,?,?,?)"]
  mq.queries(sqls, [[reqBody.teachername,pwd,reqBody.idcard,reqBody.mobile,reqBody.thumb]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
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


//修改教师
router.post('/modifyteacher',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update teacher set teachername = '${reqBody.teachername}',idcard = '${reqBody.idcard}',mobile = '${reqBody.mobile}',thumb = '${reqBody.thumb}' WHERE teacherid = '${reqBody.id}'`]
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


//删除教师
router.post('/deleteteacher',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM teacher WHERE teacherid="'+item+'"'
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


//修改教师状态
router.post('/changeteacher',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update teacher set enable = '${reqBody.enable}' WHERE teacherid = '${reqBody.id}'`]
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


//重置教师密码
router.post('/restteacher',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let pwd = md5(reqBody.idcard.substr(-6,6))
  let sqls=[`update teacher set password = '${pwd}' WHERE teacherid = '${reqBody.id}'`]
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '重置成功';
      resBody.state = 200;
    }else{
      resBody.msg= '重置失败'
    }
    res.send(resBody)
  });
})








//获取学生列表
router.post('/getstudent', (req, res, next) => {

  let page = parseInt(req.body.current),
      pageSize = parseInt(req.body.size || 10),
      studentname = req.body.studentname,
      mobile = req.body.mobile,
      idcard = req.body.idcard,
      studentcode = req.body.studentcode;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM student WHERE 1=1'
  if (studentname) sql1 = sql1 + " AND studentname= '" + studentname + "'"
  if (studentcode) sql1 = sql1 + " AND studentcode= '" + studentcode + "'"
  if (mobile) sql1 = sql1 + " AND mobile= '" + mobile + "'"
  if (idcard) sql1 = sql1 + " AND idcard= '" + idcard + "'"
  sql1+=' order by studentid desc limit ?,?'

  let sql2 = 'SELECT count(*) FROM student WHERE 1=1'
  if (studentname) sql2 = sql2 + " AND studentname= '" + studentname + "'"
  if (studentcode) sql2 = sql2 + " AND studentcode= '" + studentcode + "'"
  if (mobile) sql2 = sql2 + " AND mobile= '" + mobile + "'"
  if (idcard) sql2 = sql2 + " AND idcard= '" + idcard + "'"


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


//新增学生
router.post('/addstudent',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let pwd = md5(reqBody.idcard.substr(-6,6))
  let sqls= ["INSERT INTO student (studentname,password,idcard,mobile,thumb,studentcode,gender) VALUES (?,?,?,?,?,?,?)"]
  mq.queries(sqls, [[reqBody.studentname,pwd,reqBody.idcard,reqBody.mobile,reqBody.thumb,reqBody.studentcode,reqBody.gender]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '添加成功';
      resBody.state = 200;
    }else{
      resBody.msg= '添加失败,学号唯一'
    }
    res.send(resBody)
  });
})


//修改学生
router.post('/modifystudent',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update student set studentname = '${reqBody.studentname}',idcard = '${reqBody.idcard}',mobile = '${reqBody.mobile}',thumb = '${reqBody.thumb}',studentcode = '${reqBody.studentcode}',gender = '${reqBody.gender}' WHERE studentid = '${reqBody.id}'`]
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


//删除学生
router.post('/deletestudent',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM student WHERE studentid="'+item+'"'
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


//修改学生状态
router.post('/changestudent',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update student set enable = '${reqBody.enable}' WHERE studentid = '${reqBody.id}'`]
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


//重置学生密码
router.post('/reststudent',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let pwd = md5(reqBody.idcard.substr(-6,6))
  let sqls=[`update student set password = '${pwd}' WHERE studentid = '${reqBody.id}'`]
  mq.queries(sqls, [],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '重置成功';
      resBody.state = 200;
    }else{
      resBody.msg= '重置失败'
    }
    res.send(resBody)
  });
})





//获取科目列表
router.post('/getsubject', (req, res, next) => {

  let page = parseInt(req.body.current),
      pageSize = parseInt(req.body.size || 10),
      subjectcode = req.body.subjectcode,
      subjectname = req.body.subjectname;
  page = (page - 1) * pageSize

  // 多条件查询，动态拼接sql
  let sql1 = 'SELECT * FROM subject WHERE 1=1'
  if (subjectcode) sql1 = sql1 + " AND subjectcode= '" + subjectcode + "'"
  if (subjectname) sql1 = sql1 + " AND subjectname= '" + subjectname + "'"
  sql1+=' order by subjectid desc limit ?,?'

  let sql2 = 'SELECT  count(*) FROM subject WHERE 1=1'
  if (subjectcode) sql2 = sql2 + " AND subjectcode= '" + subjectcode + "'"
  if (subjectname) sql2 = sql2 + " AND subjectname= '" + subjectname + "'"


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


//新增科目
router.post('/addsubject',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls= ["INSERT INTO subject (subjectcode,subjectname) VALUES (?,?)"]
  mq.queries(sqls, [[reqBody.subjectcode,reqBody.subjectname]],  (err, results) => {//"results"为数组,其为多条SQL的执行结果.
    // console.log('results = ',results)
    if((results[0] || {})['affectedRows'] ===1){
      resBody.msg = '添加成功';
      resBody.state = 200;
    }else{
      resBody.msg= '添加失败,科目编号不能重复'
    }
    res.send(resBody)
  });
})


//修改科目
router.post('/modifysubject',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update subject set subjectcode = '${reqBody.subjectcode}',subjectname = '${reqBody.subjectname}' WHERE subjectid = '${reqBody.id}'`]
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


//删除科目
router.post('/deletesubject',  (req, res) => {
  const reqBody = req.body
  const arr = (reqBody.ids || '').split(',')
  const sqls = arr.map(item => {
    return 'DELETE FROM subject WHERE subjectid="'+item+'"'
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


//修改科目状态
router.post('/changesubject',  (req, res) => {
  const reqBody = req.body
  let resBody = { state: 0,msg:'',data:{} };
  let sqls=[`update subject set enable = '${reqBody.enable}' WHERE subjectid = '${reqBody.id}'`]
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
