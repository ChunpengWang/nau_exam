<template>
  <div class="dashboard-container" id="dashboardBgc">

    <div  v-for="(item,index) in list" :key="index" class="list-container">
      <div class="item-container"
           v-for="element in item"
           :key="element.id"
           @mouseover="element.isAnimate = true"
           @mouseleave="element.isAnimate = false">
        <router-link :to="element.route">
          <div class="img-container"  >
            <img :src="element.bgc" alt="" class="bgc" :class="{'animate-in' : element.isAnimate}">
          </div>
          <div class="content-container">
            <div :class="{'animate-in-content' : element.isAnimate}" class="content-style">
              <img :src="element.icon" alt="" :class="`bgc-icon${element.id}`">
              <span class="title-style">{{element.title}}</span>
              <span class="subtitle-style">{{element.subtitle.toUpperCase()}}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
  import MainData from './main'
  import _ from 'lodash'
  import { mapGetters } from "vuex";
  export default {
    name: 'Dashboard',
    data() {
      return {
        list:[],
        isAnimate:false
      }
    },
    computed: {
      ...mapGetters(["user",])
    },
    created() {
      this.list = this.user && _.chunk(MainData[['admin','teacher','student'][this.user.type-1]],3)
    },
    beforeDestroy(){
      this.list = this.list.map(item => {
        item.map(element => {
          element.isAnimate = false;
          return element;
        });
        return item;
      })
    }
  };
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";
.dashboard-container {
    display: flex;
    flex: 1;
    overflow: hidden;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .list-container{
      display: flex;
      flex-direction: row;
      width: 80%;
      margin-bottom: pxToRem(60);
      .item-container{
        cursor:pointer;
        position: relative;
        display: flex;
        flex: 1;
        height: pxToRem(300);
        .img-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          width: pxToRem(300);
          img{
            display: block;
            width: 100%;
          }
        }
        .content-container{
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          position: absolute;
          .content-style{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: pxToRem(16);
            .title-style{
              font-size: pxToRem(30);
            }
            .bgc-icon1{
              width: pxToRem(108);
            }
            .bgc-icon2{
              width: pxToRem(125);
            }
            .bgc-icon3{
              width: pxToRem(116);
            }
            .bgc-icon4{
              width: pxToRem(120);
            }
            .bgc-icon5{
              width: pxToRem(100);
            }
            .bgc-icon6{
              width: pxToRem(140);
            }
            .bgc-icon7{
              width: pxToRem(105);
            }
            .bgc-icon8{
              width: pxToRem(133);
            }

            .bgc-icon9{
              width: pxToRem(136);
            }
            .bgc-icon10{
              width: pxToRem(118);
            }
          }

        }
      }
      .animate-in{
        animation: mouseoverIn 2s;
      }
      .animate-in-content{
        animation: animateInContent 2s;
      }

}
   .list-container:nth-of-type(2){
    margin-bottom: 0;
  }
}

@keyframes mouseoverIn {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

@keyframes animateInContent {
    0% {
      transform: rotateY(0deg);
    }
    50% {
      transform: rotateY(60deg);
    }
    100% {
      transform: rotateY(0deg);
    }
  }


@media screen and(max-height: 650px) {
  .dashboard-container{
    .list-container{
      .item-container{
        height: pxToRem(250);
        .img-container{
          width: pxToRem(250);
        }
      }
    }
  }
}


</style>
