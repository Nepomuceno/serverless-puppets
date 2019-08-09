<template>
  <v-container fluid grid-list-sm>
    <!--
    <v-layout row wrap>
      <v-switch v-model="filteredPuppets" label="🐶" value="dog"></v-switch>
      <v-switch v-model="filteredPuppets" label="🐭" value="mouse"></v-switch>
      <v-switch v-model="filteredPuppets" label="🐥" value="duck"></v-switch>
      <v-switch v-model="filteredPuppets" label="🐧" value="penguin"></v-switch>
      <v-switch v-model="filteredPuppets" label="🦝" value="bit"></v-switch>
    </v-layout>
    -->
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
@Component({
  components: {
    DisplayCard
  }
})
export default class Display extends Vue {
  @Prop() private predictions!: IPredictionContent[];
  private filteredPuppets: string[] = [
    "dog",
    "duck",
    "penguin",
    "mouse",
    "bit"
  ];
  public mounted() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.percentage {
  margin-left: 2px;
}
</style>
