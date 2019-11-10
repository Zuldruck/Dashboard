FROM python:3.7-alpine

WORKDIR /app

COPY . /app

RUN apk add --no-cache gcc musl-dev linux-headers libffi-dev libressl-dev
RUN pip3 install -r requirements.txt

EXPOSE 5000

CMD ["python3", "index.py"]