package main

import (
	"net/http"
	"log"
	"time"
	"context"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type StoredUserLogin struct {
	Name string `json:"name"`
	Hash []byte `json:"hash"`
}

type UserLogin struct {
	Name string `json:"name"`
	Password string `json:"password"`
}

type Session struct {
    Username    string
    Expiration  time.Time
}


func create_account(w http.ResponseWriter, r *http.Request, client *mongo.Client) {
	log.Println("Received request for /create-account")

	var user UserLogin

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		log.Println("Error parsing request")
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	collection := client.Database("messagingdb").Collection("userlogins")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    query := bson.M{"name": user.Name}
    var result bson.M
    err = collection.FindOne(ctx, query).Decode(&result)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
			if err != nil {
				http.Error(w, "Error creating account", http.StatusInternalServerError)
				return
			}

			newUser := StoredUserLogin{
				Name: user.Name,
				Hash: hash,
			}

			_, err = collection.InsertOne(ctx, newUser)
			if err != nil {
				http.Error(w, "Error creating account", http.StatusInternalServerError)
				return
			}

			log.Println("Account created Successfully")
			response := map[string]string{
				"message": "Account created successfully",
			}
			jsonResponse, _ := json.Marshal(response)
			w.WriteHeader(http.StatusCreated)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResponse)
			return
        } else {
            http.Error(w, "Error checking user", http.StatusInternalServerError)
			return
        }
    } else {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}
}

func login (w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	log.Println("Received request for /login")

	var userLogin UserLogin

	err := json.NewDecoder(r.Body).Decode(&userLogin)
	if err != nil {
		log.Println("Error parsing request")
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}
	collection := client.Database("messagingdb").Collection("userlogins")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    query := bson.M{"name": userLogin.Name}
    var storedUserLogin StoredUserLogin
    err = collection.FindOne(ctx, query).Decode(&storedUserLogin)
	if err == nil {
		err = bcrypt.CompareHashAndPassword(storedUserLogin.Hash, []byte(userLogin.Password))
		if err != nil {
			log.Println("Invalid password")
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		} else {
			log.Println("Password is correct")

			sessionID := uuid.New().String()

			sessions[sessionID] =  Session{
				Username:   storedUserLogin.Name,
				Expiration: time.Now().Add(24 * time.Hour),
			}

			http.SetCookie(w, &http.Cookie{
				Name:     "session_id",
				Value:    sessionID,
				Path:     "/",
				HttpOnly: true,
				Expires:  time.Now().Add(24 * time.Hour),
			})

			response := map[string]string{
				"message": "Login successfull",
			}
			jsonResponse, _ := json.Marshal(response)
			w.WriteHeader(http.StatusCreated)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResponse)
			return
		}
	} else {
		if err == mongo.ErrNoDocuments {
			log.Println("No user found")
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}
		log.Println("Error checking user")
		http.Error(w, "Error checking user", http.StatusInternalServerError)
		return
	}
}