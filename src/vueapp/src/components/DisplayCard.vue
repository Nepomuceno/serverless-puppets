<template>
  <v-card class="elevation-3">
    <v-img :src="prediction.image" alt="detection" />
    <v-card-title primary-title>
      <h2>Who is here ?</h2>
      <ShowChips :predictions="prediction.prediction.predictions" />
    </v-card-title>
  </v-card>
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
export default class DisplayCard extends Vue {
  @Prop() private prediction!: IPredictionContent;
  public mounted() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
