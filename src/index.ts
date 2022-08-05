import * as signalR from "@microsoft/signalr";
import { Message } from "./messageInterface";
import { GUI } from "./gui";

//TODO: klasse voor signalR

const userInput: HTMLInputElement  = document.getElementById("userInput") as HTMLInputElement;
const connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
const disconnectButton: HTMLButtonElement = document.getElementById("disconnectButton") as HTMLButtonElement;

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:49153/messagehub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function connect(): Promise<void> {
    await connection.start().catch((error) => { 
        console.error(error);
        GUI.printListItem(error);
    });
    
    await connection.invoke("AddToGroup", userInput.value).catch((error) => console.error(error));
}

async function disconnect(): Promise<void> {
    await connection.stop().catch((error) => console.error(error));
    GUI.setDisconnected();
}

connectButton.addEventListener("click", connect);

disconnectButton.addEventListener("click", disconnect);

// SignalR client methods:
connection.on("message", (message) => {
    // return guid of message to delete at server 
    connection.invoke("MessageResponse", message.guid);
    GUI.printMessage(message);
});

connection.on("missedMessages", (missedMessages: Message[]) => {
    GUI.setConnected();

    if (missedMessages.length > 0) {
        GUI.printMissedMessages(missedMessages);
        
        // create array of guids of missedmessages
        const guidArray: string[] = [];
    
        missedMessages.forEach(message => {
            guidArray.push(message.guid);
        });

        // return guid of each missedmessage (to delete them at the server)
        connection.invoke("MissedMessagesResponse", guidArray);
    } else {
        GUI.printListItem("Verbonden met SignalR, er zijn geen gemiste berichten");
    }
});
