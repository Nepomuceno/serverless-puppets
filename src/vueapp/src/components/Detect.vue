<template>
  <v-container grid-list-xl text-xs-center>
    <v-layout row wrap>
      <v-flex xs8>
        <video
          class="mirrored xs8"
          v-if="!isMobile()"
          v-show="!displayresult"
          @click="capture"
          ref="video"
        ></video>
        <DisplayCard v-if="displayresult" :prediction="prediction" />
        <input
          v-if="isMobile()"
          ref="file"
          @change="fileChanged"
          type="file"
          accept="image/*"
          value="Detect"
          capture="camera"
        />
      </v-flex>
      <div v-if="debug">{{debugMessage}}</div>
      <v-flex xs3>
        <v-switch v-model="continuous" label="Continous"></v-switch>
        <v-switch v-model="showresult" label="Display Results"></v-switch>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DisplayCard from "./DisplayCard.vue";
import { IPredictionContent } from "../models/prediction";

@Component({
  components: {
    DisplayCard
  }
})
export default class Detect extends Vue {
  private prediction: IPredictionContent | {} = {};
  private msg!: string;
  private video!: HTMLVideoElement;
  private processing!: boolean;
  private content!: Blob;
  private overlay: boolean = true;
  private displayresult: boolean = false;
  private continuous: boolean = false;
  private showresult: boolean = true;
  private debugMessage = "init";
  private debug = false;

  public fileChanged() {
    this.debugMessage = "File Changed";
    var content = document.createElement("span");
    content.textContent = "File Selected";
    var element = this.$refs.file as HTMLInputElement;
    if (element.files) {
      var ele = element.files.item(0);
      if (ele) {
        console.info(ele);
        var a = new FileReader();
        a.onload = (e: any) => {
          if (e.target && ele) {
            this.detect(ele, e.target.result);
            console.info(e.target.result);
          }
        };
        a.readAsDataURL(ele);
      }
    }
  }

  public isMobile() {
    var check = false;
    var params = new URLSearchParams(window.location.search);
    if (params.get("ismobile")) return true;
    (function(a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor);
    return check;
  }

  public mounted() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("debug")) this.debug = true;
    setInterval(() => {
      if (this.continuous && !this.displayresult) {
        this.capture();
      }
    }, 5000);
    this.video = this.$refs.video as HTMLVideoElement;
    this.video.autoplay = true;
    const constraints = {
      video: true,
      width: 640,
      height: 480
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.video = this.$refs.video as HTMLVideoElement;
      this.video.srcObject = stream;
    });
  }

  public capture() {
    let canvas = document.createElement("canvas");
    canvas.width = this.video.videoWidth | 640;
    canvas.height = this.video.videoHeight | 480;
    let context = canvas.getContext("2d");
    if (context == null) {
      return;
    }
    context.drawImage(this.video, 0, 0, 640, 480);
    let content = canvas.toDataURL("jpeg", 0.92);
    console.info(content);
    canvas.toBlob(b => {
      if (b) {
        this.detect(b, content);
      }
    });
  }

  public async detect(blob: Blob | File, dataUrl: string) {
    let request = new XMLHttpRequest();
    request.open("POST", (<any>process).env.VUE_APP_COGNITIVE_URL, true);
    request.setRequestHeader("Content-Type", "application/octet-stream");
    request.setRequestHeader(
      "Prediction-Key",
      (<any>process).env.VUE_APP_COGNITIVE_TOKEN
    );
    // request.send(blob);
    // let formData = new FormData();
    // formData.append("file", blob, "puppet-capture.jpeg");
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {
        let response = JSON.parse(request.response);
        console.info(request.response);
        this.displayPrediction(dataUrl, request.response);
        this.$emit("dataused", {
          image: dataUrl,
          predictionString: request.response,
          prediction: JSON.parse(request.response)
        });
        if (this.showresult) {
          this.displayresult = true;
          this.prediction = {
            image: dataUrl,
            predictionString: request.response,
            prediction: JSON.parse(request.response)
          };
          setTimeout(() => {
            this.displayresult = false;
          }, 5000);
        }
      }
    };
    request.send(blob);
  }

  public displayPrediction(image: string, prediction: string) {
    this.debugMessage = "Display prediction";
    let canvas = document.createElement("canvas");
    canvas.width = this.video ? this.video.videoWidth | 640 : 640;
    canvas.height = this.video ? this.video.videoHeight | 480 : 480;
    let response = JSON.parse(prediction);
    if (response.predictions) {
      response.predictions.forEach((prediction: any) => {
        if (
          prediction.probability > (<any>process).env.VUE_APP_LIMIT_BOX &&
          prediction.boundingBox
        ) {
          let ctx = canvas.getContext("2d");
          if (ctx == null) {
            return;
          }
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
        if (prediction.probability > (<any>process).env.VUE_APP_LIMIT) {
        }
      });
    } else {
      console.info("No predictions");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.mirrored {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
</style>
