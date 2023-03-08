<template>
  <div class="tab-container">

    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          :unique-opened="true"
          :default-active="routeParent"
          class="el-menu-vertical-demo my-el-menu-container"
          @select="handleSelect"
          background-color="transparent"
          text-color="#fff"
          :router="true"
          active-text-color="#fff">
          <div :key="index" v-for="(route,index) in routeList" v-if="!route.meta.hidden">

            <el-submenu :key="route.way" :index="route.way" v-if="route.children && route.children.length">
              <template slot="title">
                <img :src="route.meta.icon" alt="">
                <span>{{route.meta.title}}</span>
<!--                <span class="el-icon-caret-right my-icon-arrow"></span>-->
              </template>
              <el-menu-item
                class="my-children-menu-item"
                :index="item.way"
                :key="item.way"
                v-for="item in route.children.filter(ele => !ele.meta.hidden)">
                <span>{{item.meta.title}}</span>
              </el-menu-item>
            </el-submenu>

            <el-menu-item :index="route.way" v-else :class="{'isBack':route.way === '/'}" >
              <img :src="route.meta.icon" alt="">
              <span slot="title">{{route.meta.title}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    data(){
      return{}
    },
    props:['routeList','routeParent'],
    methods:{
      handleSelect(index,indexPath){
        // console.log(index, indexPath);
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "~@/styles/config.scss";
  .tab-container {
    width: pxToRem(240);
    height: 100%;
    margin-right: pxToRem(20);
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    background-color: transparent;
  }
</style>
