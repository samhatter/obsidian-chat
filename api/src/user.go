package main

import (
	"net/http"
	"log"
	"strings"
	"time"
	"os"
	"context"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type UserLogin struct {
	Name string `json:"name"`
	Hash []byte `json:"hash"`
}

type UserLoginRequest struct {
	Name string `json:"name"`
	Password string `json:"password"`
}

type Session struct {
    Name    string
    Expiration  time.Time
}


func create_account(w http.ResponseWriter, r *http.Request, client *mongo.Client) {
	log.Println("Received request for /create-account")

	var user UserLoginRequest

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		log.Println("Error parsing request", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	if strings.ContainsAny(user.Name,  " ") {
		log.Println("Error parsing request")
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("userlogins")

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

			newUser := UserLogin{
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
			log.Println("Error checking user", err)
            http.Error(w, "Error checking user", http.StatusInternalServerError)
			return
        }
    } else {
		log.Println("User already exists")
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}
}

func login (w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	log.Println("Received request for /login")

	var userLogin UserLoginRequest

	err := json.NewDecoder(r.Body).Decode(&userLogin)
	if err != nil {
		log.Println("Error parsing request", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}
	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("userlogins")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    query := bson.M{"name": userLogin.Name}
    var storedUserLogin UserLogin
    err = collection.FindOne(ctx, query).Decode(&storedUserLogin)
	if err == nil {
		err = bcrypt.CompareHashAndPassword(storedUserLogin.Hash, []byte(userLogin.Password))
		if err != nil {
			log.Println("Invalid password", err)
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		} else {
			log.Println("Password is correct")

			sessionID := uuid.New().String()

			sessions[sessionID] =  Session{
				Name:   storedUserLogin.Name,
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
			log.Println("No user found", err)
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}
		log.Println("Error checking user", err)
		http.Error(w, "Error checking user", http.StatusInternalServerError)
		return
	}
}

func validate_credentials(w http.ResponseWriter, r *http.Request, sessions map[string]Session) (bool, string) {
	cookie, err := r.Cookie("session_id")
    if err != nil {
        if err == http.ErrNoCookie {
            log.Println("SessionID not found", err)
			http.Error(w, "SessionID not found", http.StatusUnauthorized)
			return false, ""
        } else {
            log.Println("Error retrieving cookie:", err)
			http.Error(w, "SessionID not found", http.StatusUnauthorized)
			return false, ""
        }
	}

	session, ok := sessions[cookie.Value]
	if !ok {
		log.Println("SessionID not valid")
		http.Error(w, "SessionID not valid", http.StatusUnauthorized)
		return false, ""
	}
	if time.Now().After(session.Expiration) {
		log.Println("SessionID expired")
		http.Error(w, "SessionID expired", http.StatusUnauthorized)
		return false, ""
	}
	
	return true, session.Name
}

func get_user (w http.ResponseWriter, r *http.Request, sessions map[string]Session) {
	log.Println("Received request for /get-user")
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	response := map[string]string {
		"message": "Get user successful",
		"name": name,
	}

	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}