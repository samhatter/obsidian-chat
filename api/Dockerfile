FROM golang:1.23.0-alpine3.19

WORKDIR /app

COPY ./src .

RUN go mod download

RUN go build -o api .

EXPOSE 8080

CMD ["./api"]
