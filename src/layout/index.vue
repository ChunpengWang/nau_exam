<template>
  <div class="app-wrapper">
    <app-main/>
  </div>
</template>

<script>
import {AppMain } from "./components";
export default {
  name: "Layout",
  components: { AppMain }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
}
</style>
