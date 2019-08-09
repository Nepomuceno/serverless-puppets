<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs3 v-for="prediction in predictions" v-bind:key="prediction.image">
        <DisplayCard :prediction="prediction" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IPredictionContent } from "../models/prediction";
import DisplayCard from "./DisplayCard.vue";
import * as signalR from "@aspnet/signalr";
@Component({
  components: {
    DisplayCard
  }
})
export default class Display extends Vue {
  private apiBaseUrl: string = "https://serverlesspuppets.azurewebsites.net";
  @Prop() private predictions!: IPredictionContent[];
  @Prop() clientId!: string;

  private connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.apiBaseUrl}/api/${this.clientId}`)
    .build();

  private filteredPuppets: string[] = [
    'Dog',
    'Duck',
    'Penguin',
    'Mouse',
    'Bit'
  ];
  public async mounted() {
    this.connection.on("pushData", x => this.pushPrediction(x));
    await this.connection.start();
  }

  public pushPrediction(prediction: IPredictionContent) {
    this.predictions.unshift(prediction);
  }

  async beforeDestroy() {
    if (this.connection) {
      await Promise.all([this.connection.stop()]);
      console.log("connection stopped");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.percentage {
  margin-left: 2px;
}
</style>
