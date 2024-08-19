from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import numpy as np
from pydub import AudioSegment
import onnxruntime as ort
import io

app = FastAPI()

@app.get("/get")
async def test():
    try:
        print("TEST") 
        return JSONResponse(content={"message": "Ok"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:

        fileContent = await file.read()

        audio = AudioSegment.from_file(io.BytesIO(fileContent), format="wav")
        decoded_audio = decode_with_encodec(audio)

        output_io = io.BytesIO()
        decoded_audio.set_frame_rate(22050).export(output_io, format="wav")

        return JSONResponse(content={"message": "File processed and saved."})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
      

def decode_with_encodec(audio):

    session = ort.InferenceSession("models/encodec_model.onnx")

    samples = np.array(audio.get_array_of_samples(), dtype=np.float32)

    input_tensor = ort.OrtValue.ortvalue_from_numpy(samples)

    outputs = session.run(None, {"input_name": input_tensor})

    output_samples = np.array(outputs[0], dtype=np.float32)
    decoded_audio = AudioSegment(
        output_samples.tobytes(), 
        frame_rate=audio.frame_rate, 
        sample_width=audio.sample_width, 
        channels=audio.channels
    )
    return decoded_audio

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)