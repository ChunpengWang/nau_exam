const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const path = require('path')
const fs = require('fs')
const port = 3000;
const api = require('./apis/index');
const resolve = file => path.resolve(__dirname, file)


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(resolve('./dist')))
app.use('/upload',express.static(resolve('./upload')));
app.use('/template',express.static(resolve('./template')));
app.use(favicon(__dirname + '/dist/favicon.ico'))//__dirname代表该执行文件的父目录，注意是双下划线，否则会爆出错误

app.use(api);

app.get('/', function (req, res) {
  const html = fs.readFileSync(resolve('./dist/index.html'), 'utf-8')
  res.send(html)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

