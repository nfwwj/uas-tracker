from fastapi import FastAPI, HTTPException
from parser import extract_uas_data
from pydantic import BaseModel
import time

app = FastAPI()

class ParseRequest(BaseModel):
    text: str

@app.post("/parse")
def parse_pdf(data: ParseRequest):
    time.sleep(1.5)
    
    if not data.text.strip():
        raise HTTPException(status_code=422, detail="No permit text provided.")
    try:
        return extract_uas_data(data.text)

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))



