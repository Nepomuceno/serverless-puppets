<template>
  <div>
    <div v-for="data in predictions" :key="data.tagName">
      <v-chip
        v-if="data.probability > 0.1"
        :color="getColorClass(data.tagName)"
        :text-color="getForegroundColorClass(data.tagName)"
        class="elevation-1 left"
      >
        <v-avatar class="grey lighten-4 elevation-1">{{getIcon(data.tagName)}}</v-avatar>
        {{data.tagName + " "}}
        <span class="ml-3 right">{{(data.probability*100).toFixed(2) + '%'}}</span>
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IPrediction } from "../models/prediction";
@Component
export default class ShowChips extends Vue {
  @Prop() private predictions!: IPrediction[];
  public mounted() {}
  public getIcon(tagName: string): string {
    switch (tagName) {
      case 'Penguin':
        return '🐧';
        break;
      case 'Mouse':
      case 'Rat':
        return '🐭';
        break;
      case 'Dog':
        return '🐶';
        break;
      case 'Chick':
      case 'Duck':
        return '🐥';
        break;
      case 'Bit':
        return '🦝';
        break;
      default:
        return '❓';
        break;
    }
  }
  public getForegroundColorClass(tagName: string): string {
    switch (tagName) {
      case 'Penguin':
        return 'white';
        break;
      case 'Mouse':
      case 'Rat':
        return 'black';
        break;
      case 'Dog':
        return 'white';
        break;
      case 'Chick':
      case 'Duck':
        return 'black';
        break;
      case 'Bit':
        return 'black';
        break;
      default:
        return 'white';
        break;
    }
  }
  public getColorClass(tagName: string): string {
    switch (tagName) {
      case 'Penguin':
        return 'black';
        break;
      case 'Mouse':
      case 'Rat':
      case 'Bit':
        return 'dark-grey';
        break;
      case 'Dog':
        return 'brown';
        break;
      case 'Chick':
      case 'Duck':
        return 'yellow';
        break;
      default:
        return '❓';
        break;
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
