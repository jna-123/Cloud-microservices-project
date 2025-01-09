FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN pip install django==4.2.0 \
    djangorestframework==3.14.0 \
    transformers==4.30.0 \
    torch==2.0.0 \
    gunicorn==20.1.0 \


COPY . .

EXPOSE 8001

CMD ["gunicorn", "summarizer.wsgi:application", "--bind", "0.0.0.0:8001"]