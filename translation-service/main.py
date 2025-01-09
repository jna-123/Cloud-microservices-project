from fastapi import FastAPI, HTTPException
from transformers import MarianMTModel, MarianTokenizer
from pydantic import BaseModel
import torch

app = FastAPI()
models = {}
tokenizers = {}

class TranslationRequest(BaseModel):
    text: str
    direction: str 

def load_model(direction):
    if direction not in models:
        if direction == "e2a":
            model_name = "Helsinki-NLP/opus-mt-en-ar"
        else:
            model_name = "Helsinki-NLP/opus-mt-ar-en"  
        tokenizers[direction] = MarianTokenizer.from_pretrained(model_name)
        models[direction] = MarianMTModel.from_pretrained(model_name)
    return models[direction], tokenizers[direction]

@app.post("/translate")
async def translate(request: TranslationRequest):
    try:
        if request.direction not in ["e2a", "a2e"]:
            raise HTTPException(status_code=400, detail="Direction must be 'e2a' or 'a2e'")
        model, tokenizer = load_model(request.direction)
        inputs = tokenizer(request.text, return_tensors="pt", padding=True)
        with torch.no_grad():
            translated = model.generate(**inputs)
        translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)
        return {
            "original_text": request.text,
            "translated_text": translated_text,
            "direction": request.direction
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}