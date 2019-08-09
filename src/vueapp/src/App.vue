<template>
  <v-app id="app">
    <v-content>
      <v-container fluid>
        <Detect v-on:dataused="dataused" />
        <Display :clientId="clientId" :predictions="predictions"></Display>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Detect from "./components/Detect.vue";
import Display from "./components/Display.vue";
import { IPredictionContent } from "./models/prediction";
import * as axios from "axios";

@Component({
  components: {
    Detect,
    Display
  }
})
export default class App extends Vue {
  clientId: string = Math.random()
    .toString(36)
    .replace(/[^a-zA-Z0-9]+/g, "")
    .substr(2, 15);
  /**
   *
   */
  constructor() {
    super();
  }
  private predictions: IPredictionContent[] = [];
  public mounted() {
    this.predictions = [];
  }
  public dataused(imageData: IPredictionContent) {
    console.info("Main", imageData);
    axios.default.post(
      `https://serverlesspuppets.azurewebsites.net/api/${this.clientId}/pushData`,
      imageData
    );
    //this.predictions.unshift(imageData);
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
