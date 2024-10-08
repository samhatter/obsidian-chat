package main

import (
	"log"
	"fmt"
	"os"
	"time"
	"net/http"
	"context"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func root(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request for /")
	w.WriteHeader(http.StatusOK)
}

func startSessionCleanup(sessions map[string]Session, cleanupInterval time.Duration) {
    go func() {
        for {
            time.Sleep(cleanupInterval)
            for sessionID, session := range sessions {
                if session.Expiration.Before(time.Now()) {
                    delete(sessions, sessionID)
                }
            }
        }
    }()
}

func main() {
	ctx, cancel  := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:%s@mongodb:27017", os.Getenv("MONGO_INITDB_ROOT_USERNAME"), os.Getenv("MONGO_INITDB_ROOT_PASSWORD")))

	mongo_client, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        log.Fatal(err)
    }

	var sessions = make(map[string]Session)

	startSessionCleanup(sessions, time.Hour)

	r := mux.NewRouter()
    r.HandleFunc("/", root).Methods("GET")
	r.HandleFunc("/create-account", func(w http.ResponseWriter, r *http.Request) {create_account(w,r,mongo_client)}).Methods("POST")
	r.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {login(w,r,mongo_client, sessions)}).Methods("POST")
	r.HandleFunc("/send-message", func(w http.ResponseWriter, r *http.Request) {send_message(w,r,mongo_client,sessions)}).Methods("POST")
	r.HandleFunc("/create-conversation", func(w http.ResponseWriter, r *http.Request) {create_conversation(w,r,mongo_client,sessions)}).Methods("POST")
	r.HandleFunc("/get-conversations", func(w http.ResponseWriter, r *http.Request) {get_conversations(w,r,mongo_client,sessions)}).Methods("GET")
	r.HandleFunc("/get-conversation", func(w http.ResponseWriter, r *http.Request) {get_conversation(w,r,mongo_client,sessions)}).Methods("POST")
	r.HandleFunc("/upvote", func(w http.ResponseWriter, r *http.Request) {upvote(w,r,mongo_client,sessions)}).Methods("POST")
	r.HandleFunc("/downvote", func(w http.ResponseWriter, r *http.Request) {downvote(w,r,mongo_client,sessions)}).Methods("POST")
    r.HandleFunc("/get-user", func(w http.ResponseWriter, r *http.Request) {get_user(w,r, sessions)}).Methods("GET")
	log.Fatal(http.ListenAndServe(":8080", r))
}