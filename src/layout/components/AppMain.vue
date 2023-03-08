<template>
  <div class="app-main" :class="{'isDashboard': key !== '/dashboard'}">

    <div class="nav-bar-box">
      <nav-bar></nav-bar>
    </div>

    <div class="main-box">
      <div class="tab-box" v-show="key!== '/dashboard' && rootRoute!== '/onlineExaminations'" >
        <tab :routeList="routeList" :routeParent="routeParent"/>
      </div>
      <transition name="fade-transform" mode="out-in">
        <div class="app-main-container" :class="{'isContainer': key !== '/dashboard'}">
          <div class="title-container" v-show="key!== '/dashboard' && rootRoute!== '/onlineExaminations'">{{title}}</div>
          <div class="content-container" :class="{'isExam': rootRoute === '/onlineExaminations'}">
            <router-view :key="key"/>
          </div>
        </div>
      </transition>
    </div>


  </div>
</template>

<script>
import _ from 'lodash'
import Tab from "./Tab";
import NavBar from "./Navbar";
export default {
  name: "AppMain",
  components: { Tab, NavBar },
  computed: {
    key() {
      return this.$route.path;
    },
    rootRoute(){
      return `/${this.$route.fullPath.split('/')[1]}`;
    },
    title(){
      return this.$route.meta.title;
    },
    routeParent(){
      return this.$route.fullPath
    },
    routeList(){
      let list = [];
      const routeParent = `/${this.$route.fullPath.split('/')[1]}`;
      const currentRoute = `${this.$route.fullPath.split('/')[this.$route.fullPath.split('/').length - 1]}`;
      // console.log('routeParent = ',routeParent);
      // console.log('currentRoute = ',currentRoute);
      // console.log('this.$store.state.user.routes = ', this.$store.state.user.routes);
      this.$store.state.user.routes.forEach(item => {
        if(item.path === routeParent){
          list = _.cloneDeep(item.children);
          list.unshift({
            path: '/',
            way: '/',
            meta: {
              title: '返回上级',
              icon: require('@/assets/images/tab/back.png')
            }
          });
          list = list.map(item => {
            item.meta['isCurrent'] = currentRoute === item.path;
            if(item.children && item.children.length){
              item.children = item.children.map(element => {
                item.meta['isCurrent'] = currentRoute === item.path;
                return element;
              });
            }
            return item
          });
        }
      });
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";
.app-main {
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  .nav-bar-box{

  }
  .main-box{
    flex: 1;
    margin: 5px  pxToRem(40) 42px  pxToRem(40);
    display: flex;
    flex-direction: row;
    overflow: hidden;
    .tab-box{

    }
    .app-main-container{
      display: flex;
      flex: 1;
      overflow: hidden;
      flex-direction: column;

      .title-container{
        height: pxToRem(40);
        background-color: #4376d1;
        font-size: pxToRem(16);
        display: flex;
        align-items: center;
        padding: 0 pxToRem(20);
        color: #fff;
        border-top-left-radius: pxToRem(10);
        border-top-right-radius: pxToRem(10);
      }

      .content-container{
        flex: 1;
        /*background-color: blue;*/
        display: flex;
        overflow: hidden;
      }

    }
    .isContainer{
      .content-container{
        background-color: #fff;
        /*padding: 0 pxToRem(20);*/
      }
      .isExam{
        background-color: transparent;
      }
    }
  }
}
</style>


