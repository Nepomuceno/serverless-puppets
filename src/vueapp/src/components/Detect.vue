<template>
  <div class="hello">
    <video class="mirrored" ref="video"></video>
    <br />
    <button @click="capture">Capture</button>
    <canvas class="mirrored" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Detect extends Vue {
  private msg: string;
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private processing: boolean;
  private content: Blob;
  mounted() {
    this.video = this.$refs.video as HTMLVideoElement;
    this.canvas = this.$refs.canvas as HTMLCanvasElement;
    this.video.autoplay = true;
    const constraints = {
      video: true,
      width: 640,
      height: 480
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.video = this.$refs.video as HTMLVideoElement;
      this.video.srcObject = stream;
      this.canvas.width = this.video.videoWidth | 640;
      this.canvas.height = this.video.videoHeight | 480;
    });
    setInterval(() => {}, 3000);
  }
  capture() {
    var context = this.canvas.getContext("2d");
    context.drawImage(this.video, 0, 0, 640, 480);
    var content = this.canvas.toDataURL("jpeg", 0.92);
    console.info(content);
    this.canvas.toBlob(b => {
      this.detect(b);
    });
  }

  async detect(blob: Blob) {
    var request = new XMLHttpRequest();
    request.open("POST", process.env.VUE_APP_COGNITIVE_URL, true);
    request.setRequestHeader(
      "Content-Type",
      "application/multipart/form-data; charset=UTF-8"
    );
    request.setRequestHeader(
      "Prediction-Key",
      process.env.VUE_APP_COGNITIVE_TOKEN
    );
    var formData = new FormData();
    formData.append("file", blob, "puppet-capture.jpeg");
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {
        this.canvas;
        var response = JSON.parse(request.response);
        if (response.predictions) {
          response.predictions.forEach(prediction => {
            if (prediction.probability > 0.3) {
              var ctx = this.canvas.getContext("2d");
              ctx.beginPath();
              ctx.lineWidth = 10 * prediction.probability;
              ctx.strokeStyle = "black";

              ctx.rect(
                prediction.boundingBox.left * 640,
                prediction.boundingBox.top * 480,
                prediction.boundingBox.width * 640,
                prediction.boundingBox.height * 480
              );
              ctx.stroke();
              ctx.lineWidth = 1;
              ctx.strokeStyle = "red";
              ctx.strokeText(
                prediction.tagName,
                prediction.boundingBox.left * 640,
                prediction.boundingBox.top * 480
              );
              console.info(prediction);
            }
          });
        } else {
          console.info("No predictions");
        }
        this.$emit("dataused", this.canvas.toDataURL());
      }
    };
    request.send(blob);
  }

  //var formData = new FormData();
  //formData.append('file', frame.blob, 'my-screenshot.' + frame.format);
  //var request = new XMLHttpRequest();
  //request.open('POST', '/api/upload', true);
  //request.setRequestHeader('Content-Type', 'application/multipart/form-data; charset=UTF-8');
  //request.send(formData);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.mirrored {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
