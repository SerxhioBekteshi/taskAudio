<template>
  <div>HELLO WORLD FROM TASK</div>
  <div>
    <input type="file" @change="handleFileUpload" />
    <button @click="uploadFile">Upload</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ort, { env } from "onnxruntime-web";
import { FFmpeg } from "@ffmpeg/ffmpeg";

// env.wasm.wasmPaths = {
//   "ort-wasm.wasm": "node_modules/onnxruntime-web/dist/ort-wasm.wasm",
//   // "ort-wasm-simd.wasm": "node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
//   "ort-wasm-threaded.wasm":
//     "node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm",
// };

export default defineComponent({
  name: "Task Page",
  components: {},
  setup() {
    const file = ref<any>();
    const encodedFile = ref<any>();

    const ffmpeg = new FFmpeg();

    const handleFileUpload = (event: any) => {
      file.value = event.target.files[0];
    };

    const loadFFmpeg = async () => {
      if (!ffmpeg.loaded) {
        console.log("FFmpeg loaded.");

        await ffmpeg.load();
      }
    };

    const uploadFile = async () => {
      if (!file.value) return;

      const formData = new FormData();
      formData.append("file", file.value);

      try {
        const audioBuffer = await convertTo24kHz(file.value);

        const encodedAudio = await encodeWithEnCodec(audioBuffer);

        // await uploadEncodedAudio(encodedAudio);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    const convertTo24kHz = async (file: File) => {
      await loadFFmpeg();

      //Read the file and create a Uint8Array from it
      const data = await file.arrayBuffer();
      const uint8Array = new Uint8Array(data);

      // Write the file
      console.log("To write");
      ffmpeg.writeFile("input.mp3", uint8Array);
      console.log("To be written");

      // Run the FFmpeg command to convert the audio to 24kHz
      const timeout = 60000;

      const abortController = new AbortController();
      const signal = abortController.signal;

      try {
        console.log("TO BE EXECUTED "); //"-ar", "24000",
        await ffmpeg.exec(
          ["-v", "verbose", "-i", "input.mp3", "-ar", "24000", "output.mp3"],
          timeout,
          {
            signal,
          }
        );
        console.log("EXECUTED ");

        const fileList = await ffmpeg.listDir("/");
        console.log("Files in FFmpeg FS:", fileList);

        // Read the output file
        const output = await ffmpeg.readFile("output.mp3");

        console.log(output, "OUTPUT");

        return new Blob([output], { type: "audio/mpeg" });
      } catch (error) {
        console.error("Error during FFmpeg processing:", error);
      }

      return null;
      // return output.buffer;
    };

    const encodeWithEnCodec = async (audioBuffer: any) => {
      try {
        const session = await ort.InferenceSession.create(
          "./models/model.onnx"
        );

        console.log(session, "SESSION");
        const inputTensor = new ort.Tensor(
          "float32",
          new Float32Array(audioBuffer)
        );

        const output = await session.run({ input: inputTensor });
        return output;
      } catch (Error) {
        console.log(Error, "ERROR");
      }
    };

    // ffmpeg.on("log", ({ type, message }) => {
    //   console.log(`FFmpeg log [${type}]: ${message}`);
    // });

    const uploadEncodedAudio = async (encodedAudio: any) => {
      const response = await fetch("http://localhost:1112/api/task/upload", {
        // i CAN USE AXIOS HERE TOO
        method: "POST",
        body: encodedAudio,
      });
      const result = await response.json();
      console.log(result, "RESULT");
    };

    return {
      handleFileUpload,
      uploadFile,
      convertTo24kHz,
      encodeWithEnCodec,
      uploadEncodedAudio,
    };
  },
});
</script>
