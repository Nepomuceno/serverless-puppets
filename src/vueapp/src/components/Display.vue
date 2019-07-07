<template>
  <div class="content">
    <ul>
      <li v-for="image in images" v-bind:key="image">
        <img :src="image" alt="detection" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Display extends Vue {
  @Prop() private images!: string[];
  mounted() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
img {
  float: left;
  width: 192px;
  height: 144px;
}
ul {
  list-style: none;
}
</style>
