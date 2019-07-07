<template>
  <div id="app">
    <Detect v-on:dataused="dataused" />
    <Display :images="images"></Display>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Detect from "./components/Detect.vue";
import Display from "./components/Display.vue";

@Component({
  components: {
    Detect,
    Display
  }
})
export default class App extends Vue {
  private images: string[] = [];
  mounted() {
    this.images = [];
  }
  dataused(imageData: string) {
    console.info("Main", imageData);
    this.images.push(imageData);
  }
}
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
