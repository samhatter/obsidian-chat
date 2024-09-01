package main
import (
	"net/http"
	"time"
	"log"
	"context"
	"encoding/json"
	"math/rand"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type SendMessageRequest struct {
	Message string `json:"message"`
	ConversationID uint64 `json:"conversationid"`
}

type GetMessageRequest struct {
	ConversationID uint64 `json:"conversationid"`
}

type Message struct {
	Time time.Time `json:"time"`
	Sender string `json:"sender"`
	Message string `json:"message"`
	MessageID uint64 `json:"messageid"`
	Likes []string `json:"likes"`
}

type ConversationRequest struct {
	Name string `json:"name"`
	Participants []string `json:"participants"`
}

type ConversationResult struct {
	Name string `json:"name"`
	ConversationID uint64 `json:"conversationid"`
}

type Conversation struct {
	Name string `json:"name"`
	Participants []string `json:"participants"`
	ConversationID uint64 `json:"conversationid"`
	Messages []Message `json:"messages"`
}

func validate_credentials(w http.ResponseWriter, r *http.Request, sessions map[string]Session) (bool, string) {
	cookie, err := r.Cookie("session_id")
    if err != nil {
        if err == http.ErrNoCookie {
            log.Println("SessionID not found")
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

func send_message(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var sendMessageRequest SendMessageRequest 
	err := json.NewDecoder(r.Body).Decode(&sendMessageRequest)
	if err != nil {
		log.Println("Error parsing request")
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	message := Message {
		Time: time.Now(),
		Sender: name,
		Message: sendMessageRequest.Message,
		MessageID: rand.Uint64(),
		Likes: make([]string, 0),
	}

	collection := client.Database("messagingdb").Collection("conversations")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    filter := bson.M{
		"conversationid": sendMessageRequest.ConversationID,
		"participants":   name,
	}
	update := bson.M {
        "$push": bson.M{
            "messages": message,
        },
    }
	result, err := collection.UpdateOne(ctx, filter, update)

	if err != nil {
		log.Println("Could not add message to conversation")
		http.Error(w, "Could not add message to conversation", http.StatusInternalServerError)
		return
	}

	if result.ModifiedCount == 0 {
		log.Println("Could not add message to conversation")
		http.Error(w, "Could not add message to conversation", http.StatusInternalServerError)
		return
	}

	response := map[string]string {
		"message": "Message added to conversation",
	}

	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func create_conversations(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var conversationRequest ConversationRequest 
	err := json.NewDecoder(r.Body).Decode(&conversationRequest)
	if err != nil {
		log.Println("Error parsing request")
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	conversation := Conversation {
		Name: conversationRequest.Name,
		Participants: append(conversationRequest.Participants, name),
		ConversationID: rand.Uint64(),
		Messages: make([]Message, 0),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

	collection := client.Database("messagingdb").Collection("conversations")
	_, err = collection.InsertOne(ctx, conversation)
	if err != nil {
		http.Error(w, "Error creating conversation", http.StatusInternalServerError)
		return
	}

	response := map[string]string {
		"message": "Conversation added",
	}

	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func get_conversations(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

	collection := client.Database("messagingdb").Collection("conversations")
	filter := bson.M{"participants": name}
	cursor, err := collection.Find(ctx, filter)
    if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Println("No conversations")
			response := map[string]interface{} {
				"message": "No conversations",
				"conversations": make([]ConversationResult,0),
			}
		
			jsonResponse, _ := json.Marshal(response)
			w.WriteHeader(http.StatusCreated)
			w.Header().Set("Content-Type", "application/json")
			w.Write(jsonResponse)
		}
        log.Println("Could not query conversations")
		http.Error(w, "Could not query conversations", http.StatusInternalServerError)
    }

    defer cursor.Close(ctx)

	var conversationResults []ConversationResult
	for cursor.Next(context.TODO()) {
        var conversation Conversation
        if err := cursor.Decode(&conversation); err != nil {
            log.Println("Could not decode conversation from query")
        } else {
			conversationResult := ConversationResult {
				Name:conversation.Name,
				ConversationID:conversation.ConversationID,
			}
			conversationResults = append(conversationResults, conversationResult)
		}
    }

	response := map[string]interface{} {
		"message": "No conversations",
		"conversations": conversationResults,
	}
	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func get_messages(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var getMessageRequest GetMessageRequest 
	err := json.NewDecoder(r.Body).Decode(&getMessageRequest)
	if err != nil {
		log.Println("Error parsing request")
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

	collection := client.Database("messagingdb").Collection("conversations")
	query := bson.M{
		"collectionid": getMessageRequest.ConversationID,
		"participants": name,
	}
	var conversation Conversation
    err = collection.FindOne(ctx, query).Decode(&conversation)
	if err != nil {
		log.Println("Could not find conversation")
		http.Error(w,"Could not find conversation", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{} {
		"message": "No conversations",
		"message_list": conversation.Messages,
	}
	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}