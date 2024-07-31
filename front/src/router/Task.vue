<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
    "
  >
    <div>
      <!-- <div class="flex flex-column gap-3">
        <div>
          <input type="file" @change="handleFileSelection" />
          <button @click="uploadFile">Upload</button>
        </div>
        <div className="flex gap-3">
          <div v-if="blob">
            <audio controls>
              <source :src="blob" :type="blobType" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      </div> -->

      <FileUpload
        mode="advanced"
        @select="handleFileUploadSelection($event)"
        :multiple="false"
        @uploader="uploadFile"
        accept="audio/*"
        :custom-upload="true"
        @error="handleError"
        :showCancelButton="false"
        :maxFileSize="6000000"
      >
        <template #content>
          <div className="flex gap-3">
            <div v-if="blob">
              <audio controls>
                <source :src="blob" :type="blobType" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        </template>
      </FileUpload>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ort, { env } from "onnxruntime-web";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import FileUpload from "primevue/fileupload";
import { useToast } from "primevue/usetoast";

export default defineComponent({
  name: "Task Page",
  components: { FileUpload },
  setup() {
    const file = ref<File | null>(null);
    const encodedFile = ref<any>();
    const toast = useToast();
    const blob = ref<string | null>(null);
    const blobType = ref<string | undefined>();

    const ffmpeg = new FFmpeg();

    const handleFileSelection = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const selectedFile = input.files[0];
        file.value = selectedFile;
        blob.value = URL.createObjectURL(selectedFile);
        blobType.value = selectedFile.type;
      }
    };

    const handleFileUploadSelection = (event: any) => {
      if (event.files && event.files.length > 0) {
        const selectedFile = event.files[0];
        file.value = selectedFile;
        blob.value = URL.createObjectURL(selectedFile);
        blobType.value = selectedFile.type;
      }
    };

    const loadFFmpeg = async () => {
      if (!ffmpeg.loaded) {
        console.log("FFmpeg loaded.");
        await ffmpeg.load();
      }
    };

    const uploadFile = async () => {
      if (!file.value) return;

      // const formData = new FormData();
      // formData.append("file", file.value);

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

        return new Blob([output], { type: "audio/*" });
      } catch (error) {
        console.error("Error during FFmpeg processing:", error);
      }

      return null;
      // return output.buffer;
    };

    const encodeWithEnCodec = async (audioBuffer: any) => {
      try {
        const session = await ort.InferenceSession.create(
          "/models/model.onnx",
          {
            executionProviders: ["webgl", "wasm"],
          }
        );

        console.log(session, "SESSION");
        const inputTensor = new ort.Tensor(
          "float32",
          new Float32Array(audioBuffer)
        );

        // const output = await session.run({ input: inputTensor });

        const inputName = session.inputNames[0];
        const output = await session.run({ [inputName]: inputTensor });

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

    const handleError = (event: any) => {
      toast.add({
        life: 3000,
        detail: "awd",
        severity: "error",
        summary: "error image custom",
      });
    };

    return {
      handleFileSelection,
      uploadFile,
      convertTo24kHz,
      encodeWithEnCodec,
      uploadEncodedAudio,
      handleError,
      handleFileUploadSelection,
      blob,
      blobType,
    };
  },
});
</script>
