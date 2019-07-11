<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-switch v-model="filteredPuppets" label="🐶" value="dog"></v-switch>
      <v-switch v-model="filteredPuppets" label="🐭" value="mouse"></v-switch>
      <v-switch v-model="filteredPuppets" label="🐥" value="chick"></v-switch>
      <v-switch v-model="filteredPuppets" label="🐧" value="penguin"></v-switch>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3 v-for="prediction in filteredPredictions" v-bind:key="prediction.image">
        <v-card class="elevation-3">
          <v-img :src="prediction.image" alt="detection" />
          <v-card-title primary-title>
            <h2>Who is here ?</h2>
            <ShowChips :predictions="prediction.prediction.predictions" />
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import ShowChips from "./ShowChips.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IPredictionContent } from "../models/prediction";
@Component({
  components: {
    ShowChips
  }
})
export default class Display extends Vue {
  @Prop() private predictions!: IPredictionContent[];
  private filteredPuppets: string[] = ["dog", "chick", "penguin", "mouse"];
  public mounted() {}
  get filteredPredictions() {
    return this.predictions.filter(x =>
      x.prediction.predictions.some(
        z => this.filteredPuppets.indexOf(z.tagName.toLowerCase()) > -1
      )
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.percentage {
  margin-left: 2px;
}
</style>
