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
            getMessages: "/get-messages",
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

    async getConversations(): Promise<any> {
        return this.sendRequest('GET', this.paths.createAccount);
    }
}

export default MessagingAPI;
