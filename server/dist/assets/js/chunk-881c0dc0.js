(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-881c0dc0"],{"0dea":function(e,o,t){},"37e9":function(e,o,t){},"70bb":function(e,o,t){"use strict";t("37e9")},"7b3e0":function(e,o,t){"use strict";t("0dea")},"9ed6":function(e,o,t){"use strict";t.r(o);var r=function(){var e=this,o=e._self._c;return o("div",{staticClass:"login-container"},[o("div",{staticClass:"title-container"},[o("img",{attrs:{src:t("7910")}}),o("span",[e._v(e._s("北亚利桑那大学在线考试系统"))])]),o("div",{staticClass:"login-type-container"},[o("el-radio-group",{model:{value:e.radio,callback:function(o){e.radio=o},expression:"radio"}},[o("el-radio",{style:{color:"#fff"},attrs:{label:1}},[e._v("管理端登录")]),o("el-radio",{style:{color:"#fff"},attrs:{label:2}},[e._v("教师端登录")]),o("el-radio",{style:{color:"#fff"},attrs:{label:3}},[e._v("学生端登录")])],1)],1),o("div",{staticClass:"form-container"},[o("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{autoComplete:"on",model:e.loginForm,rules:e.loginRules,"label-position":"left"}},[o("el-form-item",{attrs:{prop:"username"}},[o("el-input",{attrs:{type:"text",autoComplete:"on",placeholder:"账号"},model:{value:e.loginForm.username,callback:function(o){e.$set(e.loginForm,"username",o)},expression:"loginForm.username"}})],1),o("el-form-item",{attrs:{prop:"password"}},[o("el-input",{attrs:{name:"password",type:e.pwdType,autoComplete:"on",placeholder:"密码"},nativeOn:{keyup:function(o){return!o.type.indexOf("key")&&e._k(o.keyCode,"enter",13,o.key,"Enter")?null:e.handleLogin.apply(null,arguments)}},model:{value:e.loginForm.password,callback:function(o){e.$set(e.loginForm,"password",o)},expression:"loginForm.password"}})],1),o("el-form-item",{staticClass:"subbtn"},[o("el-button",{staticStyle:{width:"100%",height:"40px","border-radius":"20px","background-color":"#fd9001","border-color":"#fd9001",color:"#fff","font-weight":"700"},attrs:{loading:e.loading},nativeOn:{click:function(o){return o.preventDefault(),e.handleLogin.apply(null,arguments)}}},[e._v(" 登 录 ")])],1)],1)],1)])},n=[],a=t("c7eb"),i=t("5530"),l=t("1da1"),s=(t("d9e2"),t("14d9"),{data:function(){var e=function(e,o,t){o?t():t(new Error("账号不能为空"))},o=function(e,o,t){o?t():t(new Error("密码不能为空"))};return{radio:1,loginForm:{username:"admin",password:"123456"},loginRules:{username:[{required:!0,trigger:"blur",validator:e}],password:[{required:!0,trigger:"blur",validator:o}]},loading:!1,pwdType:"password"}},mounted:function(){},methods:{handleLogin:function(){var e=this;return Object(l["a"])(Object(a["a"])().mark((function o(){return Object(a["a"])().wrap((function(o){while(1)switch(o.prev=o.next){case 0:e.$refs.loginForm.validate((function(o){if(!o)return console.log("error submit!!"),!1;e.loading=!0;var t=Object(i["a"])(Object(i["a"])({},e.loginForm),{},{type:e.radio});e.$store.dispatch("user/login",t).then((function(){e.loading=!1,e.$router.push({path:e.redirect||"/"})})).catch((function(){e.loading=!1}))}));case 1:case"end":return o.stop()}}),o)})))()}}}),c=s,u=(t("70bb"),t("7b3e0"),t("2877")),d=Object(u["a"])(c,r,n,!1,null,"59df5530",null);o["default"]=d.exports}}]);