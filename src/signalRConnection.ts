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
        await this.connection.start().catch((error) => { 
            console.error(error);
            GUI.printListItem(error);
        });

        await this.connection.invoke("AddToGroup", username).catch((error) => console.error(error));
    }

    public async disconnect(): Promise<void> {
        await this.connection.stop().catch((error) => console.error(error));
        GUI.setDisconnected();
    }

    public async invokeMessageResponse(messageId: string) {
        await this.connection.invoke("MessageResponse", messageId);
    }

    public async invokeMissedMessagesResponse(messageIds: string[]) {
        await this.connection.invoke("MissedMessagesResponse", messageIds);
    }
}