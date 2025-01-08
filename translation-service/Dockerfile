FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install fastapi==0.68.1 \
                uvicorn==0.15.0 \
                transformers==4.11.3 \
                torch==1.9.0 \
                pydantic==1.8.2

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8003"]
