#!/bin/sh
while true; do
  {
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"version\": \"2\"}"
  } | nc -l -p 8000
done