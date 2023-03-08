const express = require('express');
const router = express.Router();
const JwtUtil = require('./jwt');
const multer = require('multer')
const fs = require("fs");
const connection = require('../db');
const xlsxrd = require('node-xlsx');
const path = require('path')
const crypto = require('crypto');
const mq = require('mysql-queries');
const async = require('async');
const StreamZip = require('node-stream-zip');
// md5加密
function md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

const httpCode = {
    state: 403,
    msg: '登录已过期,请重新登录'
};


//处理上传的插件
const createFolder =  (folder) => {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

const getSexByIdNO = (IdNO) => {
    if (IdNO.length === 18) {
        return IdNO.charAt(16) % 2 === 0 ? '女' : '男';
    } else if (IdNO.length === 15) {
        return IdNO.charAt(14) % 2 === 0 ? '女' : '男';
    } else {
        return '';
    }
};

//设置上传目录
const uploadFolder = './server/upload';
createFolder(uploadFolder);

// 通过 filename 属性定制文件名等信息
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
        // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + Math.floor(Math.random() * 100000000));
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    }
});

//初始化multer插件，使用stroage进行转存
const upload = multer({ storage: storage })

//token验证
router.use( (req, res, next) =>{
    // 登陆，退出，请求过滤掉，其他的所有请求都需要进行token校验
    if (
        req.url.split('/')[1] != 'dist' &&
        req.url != '/' &&
        req.url != '/favicon.ico' &&
        req.url != '/user/login'
    ) {
        let token = req.headers.token;
        let jwt = new JwtUtil(token);
        let result = jwt.verifyToken();
        // console.log("验证token: "+ result)
        // 如果考验通过就next，否则就返回登陆信息不正确
        if (result == 'err') {
            res.send(httpCode)
        } else {
            next();
        }
    } else {
        next();
    }
});




//上传图片
router.post('/upload', upload.single('img'),  (req, res) => {
  const file = req.file;
  const tmp_path = file.path;
  const target_path = './server/upload/img/' + new Date().getTime() + '.jpg';
  fs.rename(tmp_path, target_path,  (err) =>{
    // if (err) console.log('改名失败 =',err);
      fs.unlink(tmp_path,  (err) => {
        // if (err) console.log('删除文件失败 =',err);
        res.send({
            data:'/' + target_path.substring(9),
            state: 200,
            msg:'上传图片成功'
          })
      })
  })


});


//导入教师
router.post('/importteacher', upload.single('importTeacher'),  (req, res) => {

    let old = req.file.path;
    let name = req.file.path + path.parse(req.file.originalname).ext
    fs.renameSync(old, './server/upload/importTeacher/' + req.file.originalname)
    let excelFilePath = './server/upload/importTeacher/' + req.file.originalname;
    // 读取excel中所有工作表的数据
    let list = xlsxrd.parse(excelFilePath);
    // 获取excel中第一个工作表的数据
    let data = list[0].data.splice(0, 1);
    const dats = list[0].data.filter(item => item[0]) || []
    async.map(dats,(item,callback)=>{
        let pwd = md5((item[2]|| '').substr(-6,6));
        connection.query('insert into teacher (teachername,mobile,idcard,password) values("' + item[0] + '","' + item[1] + '","' + item[2] + '","' + pwd + '")',  (error, results)=> {
            if (error) {
                // console.log('插入错误')
                callback(error)
            }else{
                callback(null,item)
            }
        });
    },(err1,resp)=>{
        if(!err1){
            fs.unlinkSync('./server/upload/importTeacher/' + req.file.originalname);
            res.json({
                state:200,
                msg:'导入成功',
                data:name
            });
        }else {
          res.json({
            state:0,
            msg:'导入失败',
            data:{}
          });
        }
    })
});



//导入学生
router.post('/importstudent', upload.single('importStudent'),  (req, res) => {

    let old = req.file.path;
    let name = req.file.path + path.parse(req.file.originalname).ext
    fs.renameSync(old, './server/upload/importStudent/' + req.file.originalname)
    let excelFilePath = './server/upload/importStudent/' + req.file.originalname;
    // 读取excel中所有工作表的数据
    let list = xlsxrd.parse(excelFilePath);
    // 获取excel中第一个工作表的数据
    let data = list[0].data.splice(0, 1);
    const dats = list[0].data.filter(item => item[0]) || []
    async.map(dats,(item,callback)=>{
        let pwd = md5((item[2]|| '').substr(-6,6));
        let gender = getSexByIdNO(item[2]) == '男' ? '1':'2'
        connection.query('insert into student (studentname,mobile,idcard,password,studentcode,gender) values("' + item[0] + '","' + item[1] + '","' + item[2] + '","' + pwd + '","' + item[3] + '","' + gender + '")',  (error, results)=> {
            if (error) {
                callback(error)
            }else{
                callback(null,item)
            }
        });

    },(err1,resp)=>{
        if(!err1){
            fs.unlinkSync('./server/upload/importStudent/' + req.file.originalname);
            res.json({
                state:200,
                msg:'导入成功',
                data:name
            });
        }else{
          res.json({
            state:0,
            msg:'导入失败',
            data:{}
          });
        }
    })

});


/**
 * @function Unzip 解压文件
 * @file  压缩包的地址
 * @outfile :要解压得目录
 */
const Unzip = async (file, outfile) => {
  return new Promise((reslove, reject) => {
    const zip = new StreamZip({ file: file, storeEntries: true })
    zip.on('error', err => {
      // console.log('解压errerrerrerr', err);
      reject(false)
    });
    zip.on('ready', () => {
      if (!fs.existsSync(outfile)) { fs.mkdirSync(outfile); }
      zip.extract(null, outfile, (err, count) => {
        // console.log(err ? 'Extract error' : `Extracted ${count} entries`);
        // console.log('err 1111',err);
        if (err) {
          reject(false)
        }
        else {
          reslove(true)
        }
        zip.close();
      });
    });

  }).catch(err => {
    // console.log('eror', err);
  })
}


//导入学生照片
router.post('/importstudentimg', upload.single('importStudentImg'),  (req, res) => {

  let file=req.file; // 获取上传文件的信息对象
  let imgPath=file.path;// 获取文件的临时存放位置
  // console.log('extname ==',extname)
  const fileReader=fs.createReadStream(imgPath);// 创建一个文件读取流
  // 定义文件存储路径 当前文件夹下创建一个 public/upload文件
  const filePath='./server/upload/importStudentImg/' + req.file.originalname; // 真正的项目中图片名字是随机生成的,防止重复  这里起了一个叫做aaaaa
  //创建文件输出流
  const fileWrite=fs.createWriteStream(filePath);
  // 写入文件数据
  fileReader.pipe(fileWrite)
  // res.send({'state':200,msg:'success'}) // 给前台反馈
  fileReader.on('close', function(){
    Unzip(filePath,'./server/upload/studentImg/').then(res1=>{
      if(res1){
        fs.readdir('./server/upload/studentImg',(errf,files)=>{
          const imgArr = files.filter(item => (item.endsWith('.jpg')))
          async.map(imgArr,(item,callback)=>{
              let idCard = item.split('.jpg')[0]
               let thumb = '/upload/studentImg/' + item
              let sql1 =  `update student set thumb = '${thumb}' WHERE idcard = '${idCard}'`
              mq.queries([sql1],[], (error, results)=> {
                // console.log('results =',results[0])
                if (error) {
                  callback(error)
                }else{
                  callback(null,item)
                }
              })

          },(err1,resp)=>{
            if(!err1){
              fs.unlinkSync('./server/upload/importStudentImg/' + req.file.originalname);
              res.json({
                state:200,
                msg:'导入成功',
                data: {}
              });
            }else{
              res.json({
                state:0,
                msg:'导入失败',
                data:{}
              });
            }
          })
        })
      }else{
        res.json({
          state:0,
          msg:'导入失败',
          data:{}
        });
      }
    })
  });

});




//导入科目
router.post('/importsubject', upload.single('importSubject'),  (req, res) => {

    let old = req.file.path;
    let name = req.file.path + path.parse(req.file.originalname).ext
    fs.renameSync(old, './server/upload/importSubject/' + req.file.originalname)
    let excelFilePath = './server/upload/importSubject/' + req.file.originalname;
    // 读取excel中所有工作表的数据
    let list = xlsxrd.parse(excelFilePath);
    // 获取excel中第一个工作表的数据
    let data = list[0].data.splice(0, 1);
    const dats = list[0].data.filter(item => item[0]) || []

    async.map(dats,(item,callback)=>{
        connection.query('insert into subject (subjectcode,subjectname) values("' + item[0] + '","' + item[1] + '")',  (error, results)=> {
            if (error) {
                callback(error)
            }else{
                callback(null,item)
            }
        });
    },(err1,resp)=>{
        if(!err1){
            fs.unlinkSync('./server/upload/importSubject/' + req.file.originalname);
            res.json({
                state:200,
                msg:'导入成功',
                data:name
            });
        }else{
          res.json({
            state:0,
            msg:'导入失败',
            data:{}
          });
        }
    })


});

//处理导入试题逻辑
function dealOption(type,optionValue,optionRight,way){
  let optionlist = []
  if(type == '1' || type == '2' || type == '3' || (type == '4' && way == '1')){
    let arr1 = (optionValue || '').split('①[')
    let arr2=  (arr1[1] || '').split('②[')
    let arr3=  (arr2[1] || '').split('③[')
    let arr4=  (arr3[1] || '').split('④[')
    let arr5=  (arr4[1] || '').split('⑤[')
    let arr6=  (arr5[1] || '').split('⑥[')
    let o1 = (arr2[0] || '').substr(0,(arr2[0] || '').lastIndexOf(']'))
    let o2 = (arr3[0] || '').substr(0,(arr3[0] || '').lastIndexOf(']'))
    let o3 = (arr4[0] || '').substr(0,(arr4[0] || '').lastIndexOf(']'))
    let o4 = (arr5[0] || '').substr(0,(arr5[0] || '').lastIndexOf(']'))
    let o5 = (arr6[0] || '').substr(0,(arr6[0] || '').lastIndexOf(']'))
    let o6 = (arr6[1] || '').substr(0,(arr6[1] || '').lastIndexOf(']'))
    let optionArr = [o1,o2,o3,o4,o5,o6]
    let rightAnswerArr = (optionRight || '').split(',') || []
    optionlist = (optionArr.filter(item => item) || []).map((item,index) => {
      const indexStr = ['①','②','③','④','⑤','⑥'][index]
      return{
        value:item,
        isRight:rightAnswerArr.includes(indexStr) ? 1 : 0
      }
    })
  }else{
    optionlist = ((optionValue || '').split(',') || []).map(item => {
      return{
        value:''
      }
    })
  }

  // console.log('optionlist ==',optionlist)

  return JSON.stringify(optionlist)
}

//导入试题
router.post('/importquestion', upload.single('importQuestion'),  (req, res) => {

    // console.log('req ==',req.path)
    let old = req.file.path;
    let name = req.file.path + path.parse(req.file.originalname).ext
    fs.renameSync(old, './server/upload/importQuestion/' + req.file.originalname)
    let excelFilePath = './server/upload/importQuestion/' + req.file.originalname;
    // 读取excel中所有工作表的数据
    let list = xlsxrd.parse(excelFilePath);
    // 获取excel中第一个工作表的数据
    let data = list[0].data.splice(0, 1);
    const dats = list[0].data.filter(item => item[0]) || []

    async.map(dats,(item,callback)=>{

        let type = item[1],
            way = item[2],
            topic = item[3],
            optionValue = item[4],
            optionRight = item[5],
            referenceanswer = item[6];
        // console.log('item==',item)

        const optionlist = dealOption(type,optionValue,optionRight,way)
        connection.query('SELECT * FROM subject WHERE subjectcode="'+item[0]+'"', (err, doc) => {
            if(err){
                callback(err)
            }else{
                const subjectId = ((doc|| [])[0]||{}).subjectid
                let sqls= ["INSERT INTO question (topic, type, way,optionlist,referenceanswer,relationid) VALUES (?,?,?,?,?,?)"]
                mq.queries(sqls, [[topic,type,way,optionlist,referenceanswer,subjectId]],  (error, results) => {
                    if(error){
                        callback(error)
                    }else{
                        callback(null,item)
                    }
                })
            }
        })

    },(err1,resp)=>{
        if(!err1){
            fs.unlinkSync('./server/upload/importQuestion/' + req.file.originalname);
            res.json({
            state:200,
            msg:'导入成功',
            data:name
          });
        }else{
          res.json({
            state:0,
            msg:'导入失败',
            data:{}
          });
        }
    })

});



//导入考生
router.post('/importplanstudent', upload.single('importPlanStudent'),  (req, res) => {

  // console.log('reg.body==',req.body)
  // console.log('reg.file==',req.file)
  let planid = req.body.planid
  let old = req.file.path;
  let name = req.file.path + path.parse(req.file.originalname).ext
  fs.renameSync(old, './server/upload/importPlanStudent/' + req.file.originalname)
  let excelFilePath = './server/upload/importPlanStudent/' + req.file.originalname;
  // 读取excel中所有工作表的数据
  let list = xlsxrd.parse(excelFilePath);
  // 获取excel中第一个工作表的数据
  let data = list[0].data.splice(0, 1);
  const dats = list[0].data.filter(item => item[0]) || []
  let sujectTotal = {}
    async.map(dats,(item,callback)=>{
        if(sujectTotal[item[4]]){
            sujectTotal[item[4]]++
        }else{
            sujectTotal[item[4]] = 1
        }
        let gender = getSexByIdNO(item[2]) == '男' ? '1':'2'
        let sql1 = 'insert into plan_student (studentname,mobile,idcard,studentcode,subjectcode,planid,gender) values("' + item[0] + '","' + item[1] + '","' + item[2] + '","' + item[3] + '","' + item[4] + '","' + planid + '","' + gender + '")'
        // console.log('sql1 ==',sql1)
        mq.queries([sql1],[], (error, results)=> {
            // console.log('results =',results[0])
            if (error) {
                callback(error)
            }else{
                callback(null,results[0][0])
            }
        });

    },(err,resp)=>{
        fs.unlinkSync('./server/upload/importPlanStudent/' + req.file.originalname);
        let sql2=[`update plan set studentnum = '${dats.length}',studentnumtotal = '${JSON.stringify(sujectTotal)}' WHERE planid = '${planid}'`]
        mq.queries(sql2, [],  (error, results) => {
            if(error){
              res.json({
                state:0,
                msg:'导入失败',
                data:{}
              });
            }else{
                res.json({
                    state:200,
                    msg:'导入成功',
                    data:name
                });
            }

        })
    })



});




//导入阅卷老师
router.post('/importmarkteacher', upload.single('importMarkTeacher'),  (req, res) => {


  let planid = req.body.planid
  let old = req.file.path;
  let name = req.file.path + path.parse(req.file.originalname).ext
  fs.renameSync(old, './server/upload/importMarkTeacher/' + req.file.originalname)
  let excelFilePath = './server/upload/importMarkTeacher/' + req.file.originalname;
  // 读取excel中所有工作表的数据
  let list = xlsxrd.parse(excelFilePath);
  // 获取excel中第一个工作表的数据
  let data = list[0].data.splice(0, 1);
  const dats = list[0].data.filter(item => item[0]) || []
  async.map(dats,(item,callback)=>{
    let sql1 = 'insert into mark_teacher (teachername,mobile,idcard,subjectcode,planid) values("' + item[0] + '","' + item[1] + '","' + item[2] + '","' + item[3] + '","' + planid + '")'
    // console.log('sql1 ==',sql1)
    mq.queries([sql1],[], (error, results)=> {
      // console.log('results =',results[0])
      if (error) {
        callback(error)
      }else{
        callback(null,results[0][0])
      }
    });

  },(err,resp)=>{
    if(!err){
      fs.unlinkSync('./server/upload/importMarkTeacher/' + req.file.originalname);
      res.json({
        state:200,
        msg:'导入成功',
        data:name
      });
    }else{
      res.json({
        state:0,
        msg:'导入失败',
        data:{}
      });
    }

  })



});




module.exports = router;
