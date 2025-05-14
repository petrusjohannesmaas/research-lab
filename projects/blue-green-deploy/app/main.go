package main

import (
    "encoding/json"
    "net/http"
)

type Version struct {
    Version string `json:"version"`
}

func handler(w http.ResponseWriter, r *http.Request) {
    v := Version{Version: "v1"}
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(v)
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}