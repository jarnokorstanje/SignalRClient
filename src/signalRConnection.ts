import * as signalR from "@microsoft/signalr";
import { GUI } from "./gui";
import { Message } from "./message";

export class SignalRConnection {
    private connection: signalR.HubConnection;

    constructor(handleMessage: (message: Message) => void, handleMissedMessages: (missedMessages: Message[]) => void) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:49153/messagehub")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

            this.connection.on("message", handleMessage);
            
            this.connection.on("missedMessages", handleMissedMessages);
    }

    public async connect(username: string): Promise<void> {
        try {
            await this.connection.start();
            await this.connection.invoke("AddToGroup", username);
        } catch(error) {
            console.error(error);
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.connection.stop();
            GUI.setDisconnectedStyle();
        } catch(error) {
            console.error(error);
        }
    }

    public async invokeMessageResponse(messageId: string): Promise<void> {
        try {
            await this.connection.invoke("MessageResponse", messageId);
        } catch(error) {
            console.error(error);
        }
    }

    public async invokeMissedMessagesResponse(messageIds: string[]): Promise<void> {
        try {
            await this.connection.invoke("MissedMessagesResponse", messageIds);
        } catch(error) {
            console.error(error);
        }
    }
}