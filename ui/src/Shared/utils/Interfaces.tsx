export interface ConversationResult {
    conversationid: string;
    name: string;
}
  
export interface Message {
    time: Date;
    sender: string;
    message: string; 
    messageid: string; 
    upvotes: string[];
    downvotes: string[];
}
  
export interface Conversation {
    name: string;
    participants: string[]; 
    conversationid: string;
    messages: Message[];
}