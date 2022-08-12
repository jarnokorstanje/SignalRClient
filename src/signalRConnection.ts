import * as signalR from "@microsoft/signalr";
import { GUI } from "./gui";
import { Message } from "./message";

export class SignalRConnection {
    private username: string;
    private connection: signalR.HubConnection;

    constructor(username: string) {
        this.username = username;
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:49153/messagehub")
            // .withUrl("https://signalrprototype.azurewebsites.net/messagehub")
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.on("message", (message) => {this.handleMessage(message); });
            
        this.connection.on("missedMessages", (missedMessages) => {this.handleMissedMessages(missedMessages); });
    }

    public async connect(username: string): Promise<void> {
        try {
            await this.connection.start();
            await this.connection.invoke("AddToGroup", username);
        } catch(error) {
            console.error(error);
        }
    }

    public async handleMessage(message: Message) {
        GUI.printMessage(message);
        try {
            await this.connection.invoke("MessageResponse", message.guid);
        } catch(error) {
            console.error(error);
        }
        
    }

    public async handleMissedMessages(missedMessages: Message[]) {
        if (missedMessages.length > 0) {
            GUI.printMissedMessages(missedMessages, this.username);

            // create array of guids of missedmessages
            const missedMessageIds: string[] = [];

            missedMessages.forEach(message => {
                missedMessageIds.push(message.guid);
            });

            // return guid of each missedmessage (to let the server know it has been received)
            try {
                await this.connection.invoke("MissedMessagesResponse", missedMessageIds);
            } catch(error) {
                console.error(error);
            }
        } else {
            GUI.printListItem(`${this.username} verbonden, er zijn geen gemiste berichten`);
        }
    }
}