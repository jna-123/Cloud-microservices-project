FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install fastapi==0.68.1 \
                uvicorn==0.15.0 \
                transformers==4.11.3 \
                torch==1.9.0 \
                pydantic==1.8.2 \
                sentencepiece==0.1.96 \
                sacremoses==0.0.53

COPY . .
EXPOSE 8003

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8003"]