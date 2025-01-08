from fastapi import FastAPI, HTTPException
from transformers import MarianMTModel, MarianTokenizer
from pydantic import BaseModel

app = FastAPI()

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

@app.post("/translate")
async def translate(request: TranslationRequest):
    try:
        model_name = f'Helsinki-NLP/opus-mt-{request.source_lang}-{request.target_lang}'
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        
        inputs = tokenizer(request.text, return_tensors="pt")
        translated = model.generate(**inputs)
        result = tokenizer.decode(translated[0], skip_special_tokens=True)
        
        return {"translated_text": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))