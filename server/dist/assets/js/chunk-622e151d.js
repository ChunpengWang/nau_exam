(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-622e151d"],{"0284":function(t,i,s){"use strict";s("19dd")},1105:function(t,i,s){t.exports=s.p+"assets/img/bgicon4.png"},"19dd":function(t,i,s){},"1f58":function(t,i,s){t.exports=s.p+"assets/img/bgicon9.png"},"293e":function(t,i,s){t.exports=s.p+"assets/img/bg2.png"},"296e":function(t,i,s){t.exports=s.p+"assets/img/bg1.png"},"45e1":function(t,i,s){t.exports=s.p+"assets/img/bg4.png"},"48b9":function(t,i,s){t.exports=s.p+"assets/img/bg3.png"},"541f":function(t,i,s){t.exports=s.p+"assets/img/bg9.png"},"59f7":function(t,i,s){t.exports=s.p+"assets/img/bgicon8.png"},"66d5":function(t,i,s){t.exports=s.p+"assets/img/bg7.png"},9406:function(t,i,s){"use strict";s.r(i);var e=function(){var t=this,i=t._self._c;return i("div",{staticClass:"dashboard-container",attrs:{id:"dashboardBgc"}},t._l(t.list,(function(s,e){return i("div",{key:e,staticClass:"list-container"},t._l(s,(function(s){return i("div",{key:s.id,staticClass:"item-container",on:{mouseover:function(t){s.isAnimate=!0},mouseleave:function(t){s.isAnimate=!1}}},[i("router-link",{attrs:{to:s.route}},[i("div",{staticClass:"img-container"},[i("img",{staticClass:"bgc",class:{"animate-in":s.isAnimate},attrs:{src:s.bgc,alt:""}})]),i("div",{staticClass:"content-container"},[i("div",{staticClass:"content-style",class:{"animate-in-content":s.isAnimate}},[i("img",{class:"bgc-icon".concat(s.id),attrs:{src:s.icon,alt:""}}),i("span",{staticClass:"title-style"},[t._v(t._s(s.title))]),i("span",{staticClass:"subtitle-style"},[t._v(t._s(s.subtitle.toUpperCase()))])])])])],1)})),0)})),0)},n=[],a=s("5530"),o=(s("d81d"),[{id:9,title:"在线考试",subtitle:"test",bgc:s("eb9e"),icon:s("59f7"),isAnimate:!1,route:"onlineExaminations",roles:""},{id:10,title:"成绩查询",subtitle:"query",bgc:s("541f"),icon:s("1f58"),isAnimate:!1,route:"personalCenter",roles:""}]),c=[{id:3,title:"在线阅卷",subtitle:"marking",bgc:s("48b9"),icon:s("d4f3"),isAnimate:!1,route:"marking",roles:"zxyj"}],r=[{id:1,title:"考务管理",subtitle:"Examination",bgc:s("296e"),icon:s("c85d"),isAnimate:!1,route:"examination",roles:"kwgl"},{id:2,title:"题库管理",subtitle:"Item bank",bgc:s("293e"),icon:s("ded1"),isAnimate:!1,route:"itemBank",roles:"tkgl"},{id:3,title:"阅卷管理",subtitle:"marking",bgc:s("48b9"),icon:s("d4f3"),isAnimate:!1,route:"marking",roles:"zxyj"},{id:6,title:"统计分析",subtitle:"statistical",bgc:s("66d5"),icon:s("9bf3"),isAnimate:!1,route:"statisticalAnalysis",roles:"tjfx"},{id:7,title:"基础信息库",subtitle:"data base",bgc:s("45e1"),icon:s("1105"),isAnimate:!1,route:"dataBase",roles:"jcxxk"},{id:8,title:"平台管理",subtitle:"MANAGEMENT",bgc:s("eb9e"),icon:s("d3be"),isAnimate:!1,route:"management",roles:"ptgl"}],u={admin:r,teacher:c,student:o},l=s("2ef0"),g=s.n(l),b=s("2f62"),p={name:"Dashboard",data:function(){return{list:[],isAnimate:!1}},computed:Object(a["a"])({},Object(b["b"])(["user"])),created:function(){this.list=this.user&&g.a.chunk(u[["admin","teacher","student"][this.user.type-1]],3)},beforeDestroy:function(){this.list=this.list.map((function(t){return t.map((function(t){return t.isAnimate=!1,t})),t}))}},d=p,m=(s("0284"),s("2877")),f=Object(m["a"])(d,e,n,!1,null,"4c16a7b6",null);i["default"]=f.exports},"9bf3":function(t,i,s){t.exports=s.p+"assets/img/bgicon7.png"},c85d:function(t,i,s){t.exports=s.p+"assets/img/bgicon1.png"},d3be:function(t,i,s){t.exports=s.p+"assets/img/bgicon5.png"},d4f3:function(t,i,s){t.exports=s.p+"assets/img/bgicon3.png"},ded1:function(t,i,s){t.exports=s.p+"assets/img/bgicon2.png"},eb9e:function(t,i,s){t.exports=s.p+"assets/img/bg8.png"}}]);