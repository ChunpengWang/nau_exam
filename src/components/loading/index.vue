<template>
  <div>
    <i class="loading" v-show="false"></i>
  </div>
</template>

<script>
export default {
  name: 'loading',
  data() {
    return {

    }
  },
  props: ['myloading']
}
</script>

<style scoped>
.loading {
  position: absolute;
  width:100%;
  height:100%;
  z-index: 1000000;
  background: rgba(0,0,0,0.0980392) url('./loading1.gif') no-repeat center center ;
}
</style>
