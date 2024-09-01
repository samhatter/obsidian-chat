class MessagingAPI {
    private baseURL: string;
    private port: string | null;
    private paths: Record<string, string>

    constructor(baseURL: string, port: string | null = null) {
        this.baseURL = baseURL;
        this.port = port;
        this.paths = {
            login: "/login",
            createAccount: "/create-account",
            sendMessage: "/send-message",
            getConversation: "/get-conversation",
            getConversations: "/get-conversations",
            createConversation: "/create-conversation",
            upVote: "/upvote",
            downVote: "/downvote",
            getUser: "/get-user",
        };
    }

    private getFullURL(path: string): string {
        let url = this.baseURL;
        if (this.port) {
            url += `:${this.port}`;
        }
        url += path;
        return url;
    }

    private async sendRequest(
        method: string,
        path: string,
        body: any = null,
        headers: HeadersInit = { 'Content-Type': 'application/json' }
    ): Promise<any> {
        const url = this.getFullURL(path);
        const options: RequestInit = {
            method,
            headers,
            mode: 'cors',
            cache: 'no-cache',
            body: body ? JSON.stringify(body) : null,
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error(`Error during ${method} request to ${url}:`, error);
            throw error;
        }
    }

    async login(name: string, password: string): Promise<any> {
        return this.sendRequest('POST', this.paths.login, { name, password });
    }

    async createAccount(name: string, password: string): Promise<any> {
        return this.sendRequest('POST', this.paths.createAccount, { name, password });
    }

    async createConversation(name: string, participants: string[]): Promise<any> {
        return this.sendRequest('POST', this.paths.createConversation, { name, participants });
    }

    async getConversations(): Promise<any> {
        return this.sendRequest('GET', this.paths.getConversations);
    }
    
    async getConversation(conversationid: string): Promise<any> {
        return this.sendRequest('POST', this.paths.getConversation, {conversationid});
    }

    async sendMessage(message: string, conversationid: string): Promise<any> {
        return this.sendRequest('POST', this.paths.sendMessage, {message, conversationid});
    }

    async upVote(messageid: string, conversationid: string): Promise<any> {
        return this.sendRequest('POST', this.paths.upVote, {messageid, conversationid});
    }

    async downVote(messageid: string, conversationid: string): Promise<any> {
        return this.sendRequest('POST', this.paths.downVote, {messageid, conversationid});
    }

    async getUser(): Promise<any> {
        return this.sendRequest('GET', this.paths.getUser)
    }

}

export default MessagingAPI;
