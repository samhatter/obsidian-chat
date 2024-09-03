package main
import (
	"os"
	"net/http"
	"time"
	"log"
	"context"
	"encoding/json"
	 "github.com/google/uuid"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SendMessageRequest struct {
	Message string `json:"message"`
	ConversationID string `json:"conversationid"`
}

type GetConversationRequest struct {
	ConversationID string `json:"conversationid"`
}

type Message struct {
	Time time.Time `json:"time"`
	Sender string `json:"sender"`
	Message string `json:"message"`
	MessageID string `json:"messageid"`
	UpVotes []string `json:"upvotes"`
	DownVotes []string `json:"downvotes"`
}

type ConversationRequest struct {
	Name string `json:"name"`
	Participants []string `json:"participants"`
}

type ConversationResult struct {
	Name string `json:"name"`
	ConversationID string `json:"conversationid"`
}

type Conversation struct {
	Name string `json:"name"`
	Participants []string `json:"participants"`
	ConversationID string `json:"conversationid"`
	Messages []Message `json:"messages"`
}

type VoteRequest struct {
	ConversationID string `json:"conversationid"`
	MessageID string `json:"messageid"`
}

func send_message(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	log.Println("Received request for /send-message")
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var sendMessageRequest SendMessageRequest 
	err := json.NewDecoder(r.Body).Decode(&sendMessageRequest)
	if err != nil {
		log.Println("Error parsing request", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	message := Message {
		Time: time.Now(),
		Sender: name,
		Message: sendMessageRequest.Message,
		MessageID: uuid.NewString(),
		UpVotes: make([]string, 0),
		DownVotes: make([]string, 0),
	}

	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("conversations")

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
		log.Println("Could not add message to conversation", err)
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

func create_conversation(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	log.Println("Received request for /create-conversation")
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var conversationRequest ConversationRequest 
	err := json.NewDecoder(r.Body).Decode(&conversationRequest)
	if err != nil {
		log.Println("Error parsing request", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	conversation := Conversation {
		Name: conversationRequest.Name,
		Participants: append(conversationRequest.Participants, name),
		ConversationID: uuid.NewString(),
		Messages: make([]Message, 0),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("conversations")
	_, err = collection.InsertOne(ctx, conversation)
	if err != nil {
		log.Println("Error inserting conversation into databse", err)
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
	log.Println("Received request for /get-conversations")
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("conversations")
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
        log.Println("Could not query conversations", err)
		http.Error(w, "Could not query conversations", http.StatusInternalServerError)
    }

    defer cursor.Close(ctx)
	var conversationResults []ConversationResult
	for cursor.Next(ctx) {
        var conversation Conversation
        if err := cursor.Decode(&conversation); err != nil {
            log.Println("Could not decode conversation from query", err)
        } else {
			conversationResult := ConversationResult {
				Name:conversation.Name,
				ConversationID:conversation.ConversationID,
			}
			conversationResults = append(conversationResults, conversationResult)
		}
    }

	response := map[string]interface{} {
		"message": "Get conversation successful",
		"conversations": conversationResults,
	}
	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func get_conversation(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	log.Println("Received request for /get-conversation")
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var getConversationRequest GetConversationRequest 
	err := json.NewDecoder(r.Body).Decode(&getConversationRequest)
	if err != nil {
		log.Println("Error parsing request", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("conversations")
	query := bson.M{
		"conversationid": getConversationRequest.ConversationID,
		"participants": name,
	}
	var conversation Conversation
    err = collection.FindOne(ctx, query).Decode(&conversation)
	if err != nil {
		log.Println("Could not find conversation", err)
		http.Error(w,"Could not find conversation", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{} {
		"message": "Get conversation successful",
		"conversation": conversation,
	}
	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func upvote(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	log.Println("Received request for /upvote")
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var voteRequest VoteRequest 
	err := json.NewDecoder(r.Body).Decode(&voteRequest)
	if err != nil {
		log.Println("Error parsing request", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("conversations")
	filter := bson.M{"conversationid": voteRequest.ConversationID}
	update := bson.M{
        "$addToSet": bson.M{
            "messages.$[message].upvotes": name,
        },
    }
	arrayFilters := options.ArrayFilters{
        Filters: []interface{}{
            bson.M{"message.messageid": voteRequest.MessageID},
        },
    }
	updateOptions := options.UpdateOptions{
        ArrayFilters: &arrayFilters,
    }

	result, err := collection.UpdateOne(ctx, filter, update, &updateOptions)
	if err != nil {
		log.Println("Could not add upvote to message", err)
		http.Error(w, "Could not add upvote to message", http.StatusInternalServerError)
		return
	}
	if result.ModifiedCount == 0 {
		log.Println("Could not add upvote to message", err)
		http.Error(w, "Could not add upvote to message", http.StatusInternalServerError)
		return
	}

	response := map[string]string {
		"message": "Upvote added to message",
	}

	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func downvote(w http.ResponseWriter, r *http.Request, client *mongo.Client, sessions map[string]Session) {
	log.Println("Received request for /downvote")
	auth, name := validate_credentials(w,r,sessions) 
	if !auth {
		return
	}

	var voteRequest VoteRequest 
	err := json.NewDecoder(r.Body).Decode(&voteRequest)
	if err != nil {
		log.Println("Error parsing request", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
    	return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

	collection := client.Database(os.Getenv("MONGO_INITDB_DATABASE")).Collection("conversations")
	filter := bson.M{"conversationid": voteRequest.ConversationID}
	update := bson.M{
        "$addToSet": bson.M{
            "messages.$[message].downvotes": name,
        },
    }
	arrayFilters := options.ArrayFilters{
        Filters: []interface{}{
            bson.M{"message.messageid": voteRequest.MessageID},
        },
    }
	updateOptions := options.UpdateOptions{
        ArrayFilters: &arrayFilters,
    }

	result, err := collection.UpdateOne(ctx, filter, update, &updateOptions)
	if err != nil {
		log.Println("Could not add downvote to message", err)
		http.Error(w, "Could not add downvote to message", http.StatusInternalServerError)
		return
	}
	if result.ModifiedCount == 0 {
		log.Println("Could not add downvote to message", err)
		http.Error(w, "Could not add downvote to message", http.StatusInternalServerError)
		return
	}

	response := map[string]string {
		"message": "Downvote added to message",
	}

	jsonResponse, _ := json.Marshal(response)
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}