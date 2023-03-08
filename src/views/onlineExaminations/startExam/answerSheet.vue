<template>
  <div class="cardlist">
    <div class="card-title">
      <span class="card-title-name">答题卡</span>
      <span class="card-title-countdown">{{ HH }}:{{ mm }}:{{ ss }}</span>
    </div>
    <div class="card-container">
      <div class="card-show">
        <span class="card-show-block card-show-already">已答</span>
        <span class="card-show-block card-show-current">在答</span>
        <span class="card-show-block card-show-noanswer">未答</span>
      </div>
      <div class="card-list" v-for="item in data">
        <div class="card-list-item">
          <div class="card-list-item-title">
            <span>{{ item.typename }}</span>
            <span>共{{ item.questionList.length }}题</span>
          </div>
          <div class="card-list-item-num">
            <span
              v-for="(num, index) in item.questionList"
              @click="setCurrent($event, num)"
              :class="num.isCurrent ? 'iscurrent':(num.answer && num.answer.length ? 'isready' : '') "
              >{{ num.px }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnswerSheet",
  data() {
    return {
      HH: "00",
      mm: "00",
      ss: "00",
      timerFuc: null
    };
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    ksjssj: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  mounted() {
    // console.log('answerSheet this.data = ',this.data)
    this.setTime()
  },
  created() {

  },
  methods: {

    // 倒计时
    startTime(sytime) {
      const that = this;
      this.dateFormat(sytime);
      this.timerFuc = setTimeout(() => {
        sytime = sytime - 1000;
        if (sytime > 0) {
          that.startTime(sytime);
        } else {
          //交卷处理
          clearTimeout(that.timerFuc);
          that.timerFuc = null;
          this.$emit("timeOut");
        }
      }, 1000);
    },

    // 时间格式转换
    dateFormat(leftTime) {
      const o = {
        d: Math.floor(leftTime / 1000 / 60 / 60 / 24), // 日
        h: Math.floor((leftTime / 1000 / 60 / 60) % 24), // 小时
        m: Math.floor((leftTime / 1000 / 60) % 60), // 分
        s: Math.floor((leftTime / 1000) % 60), // 秒
        ms: Math.floor(leftTime % 1000) // 毫秒
      };
      this.HH = o.h < 10 ? "0" + o.h : o.h;
      this.mm = o.m < 10 ? "0" + o.m : o.m;
      this.ss = o.s < 10 ? "0" + o.s : o.s;
      if (o.d > 0) {
        this.HH = o.h + o.d * 24;
      }
    },

    //点击答题卡
    setCurrent(evt, item) {
      // console.log('setCurrent item = ', item);
      this.$emit("setCurrentObj", item);
    },

    //获取数据设置倒计时
    async setTime() {
      // console.log('ksjssj res = ', this.ksjssj);
      let currentTime = new Date().getTime();
      let endTime = new Date(this.ksjssj + '').getTime();
      let sytime = endTime - currentTime;
      this.startTime(sytime);
    },
  }
};
</script>

<style lang="scss" scoped>
$cardBgColor: #8aaae3;
$activeBgColor: #6f8fdc;
$white: #fff;
$currentColor: #ff8e01;
$readyColor: #3f5ca0;
$cardWidth: 30px;
$cardHeight: 30px;
$lineheight: 60px;
.container {
  width: 100%;
  display: flex;
  .container-left {
    flex: 1;
  }
  .container-right {
    width: 400px;
    height: 100%;
    background-color: $cardBgColor;
    border-radius: 5px;
    .card-container {
      padding: 0px 25px;
    }
    .card-title {
      width: 100%;
      height: $lineheight;
      display: flex;
      .card-title-name {
        line-height: $lineheight;
        background-color: $activeBgColor;
        color: $white;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        border-top-left-radius: 5px;
        flex: 1;
      }
      .card-title-countdown {
        background-color: $white;
        line-height: $lineheight;
        border-top-right-radius: 5px;
        text-align: center;
        color: red;
        flex: 1;
        font-size: 16px;
        font-weight: 600;
      }
    }
    .card-show {
      display: flex;
      height: 40px;
      width: 100%;
      .card-show-block {
        flex: 1;
        line-height: 40px;
        font-size: 14px;
        color: $white;
        position: relative;
        text-align: center;
        &::before {
          content: "";
          display: block;
          width: 14px;
          height: 14px;
          background-color: $activeBgColor;
          margin-right: 5px;
          position: absolute;
          top: 58%;
          left: 18%;
          margin-top: -9px;
        }
        // i {
        //   display: inline-block;
        //   width: 14px;
        //   height: 14px;
        //   background-color: $activeFontColor;
        //   margin-right: 5px;
        // }
      }
      .card-show-already {
        &::before {
          background-color: $readyColor;
        }
      }
      .card-show-current {
        &::before {
          background-color: $currentColor;
        }
      }
      .card-show-noanswer {
        &::before {
          background-color: $white;
        }
      }
    }
    // 答题卡显示
    .card-list-item {
      margin-bottom: 20px;
      .card-list-item-title {
        width: 100%;
        height: 40px;
        background-color: $activeBgColor;
        margin-bottom: 10px;
        display: flex;
        span {
          flex: 1;
          line-height: 40px;
          color: $white;
          text-align: center;
        }
      }
      .card-list-item-num {
        span {
          display: inline-block;
          width: $cardWidth;
          height: $cardHeight;
          line-height: $cardHeight;
          text-align: center;
          background-color: $white;
          margin-right: 5px;
          margin-bottom: 6px;
          cursor: pointer;
          font-weight: 600;
        }
        .isready {
          background-color: $readyColor;
          color: $white;
        }
        .iscurrent {
          background-color: $currentColor;
          color: $white;
        }
      }
    }
  }
}
</style>
