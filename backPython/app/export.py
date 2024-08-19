
# ESHTE BERE EKSPORT DUKE U KRIJUAR SI FILE TE ENCODEC
# GITHUB REPO KU BEN EKSPORT MODELN NGA PATHI I DUHUR

# import torch
# import torch.onnx
# from encodec import EncodecModel

# # Load the pre-trained model
# model = EncodecModel.encodec_model_24khz(pretrained=True)
# model.eval()

# dummy_input = torch.randn(1, 1, 24000, dtype=torch.float32)  # Batch size 1, Mono channel, 24,000 samples

# # Export the model
# torch.onnx.export(
#     model,
#     dummy_input,
#     "encodec_model.onnx",
#     input_names=["input"],
#     output_names=["output"],
#     dynamic_axes={
#         "input": {0: "batch_size", 2: "sequence"},
#         "output": {0: "batch_size", 2: "sequence"}
#     },
#     export_params=True, 
#     verbose=True,      
#     opset_version=12  
# )

