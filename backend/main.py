from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
import torch
import io
from report import generate_report

# Initialize app
app = FastAPI()

# Allow frontend to connect
app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"])

# Load pretrained xray model from huggingface
extractor = AutoFeatureExtractor.from_pretrained("nickmuchi/vit-finetuned-chest-xray-pneumonia")
model = AutoModelForImageClassification.from_pretrained("nickmuchi/vit-finetuned-chest-xray-pneumonia")
model.eval()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # Read uploaded image
    contents = await file.read()
    # Check if file is valid image type
    if file.content_type not in ["image/jpeg", "image/png"]:
       from fastapi import HTTPException
       raise HTTPException(status_code=400, detail="Only JPG and PNG images allowed")
    image = Image.open(io.BytesIO(contents)).convert('RGB')

    # Prepare image for model
    inputs = extractor(images=image, return_tensors="pt")

    # Run prediction
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)[0]

    # Get labels and scores
    labels = model.config.id2label
    findings = {labels[i]: round(float(probs[i]) * 100, 1)
                for i in range(len(probs))
                if probs[i] > 0.2}

    if not findings:
        findings = {"No Finding": 99.0}

    # Generate AI report
    report = generate_report(findings)
    return {"findings": findings, "report": report}