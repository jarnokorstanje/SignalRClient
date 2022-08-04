import * as signalR from "@microsoft/signalr";
import { Message } from "./messageInterface";
import { GUI } from "./gui";

//TODO: klasse voor signalR

const userInput: HTMLInputElement  = document.getElementById("userInput") as HTMLInputElement;
const connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
const disconnectButton: HTMLButtonElement = document.getElementById("disconnectButton") as HTMLButtonElement;
const gui: GUI = new GUI();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:49153/messagehub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function connect(): Promise<void> {
    await connection.start().catch((error) => { 
        console.error(error);
        gui.printListItem(error);
    });
    
    await connection.invoke("AddToGroup", userInput.value).catch((error) => console.error(error));
}

async function disconnect(): Promise<void> {
    await connection.stop().catch((error) => console.error(error));
    gui.setDisconnected();
}

connectButton.addEventListener("click", connect);

disconnectButton.addEventListener("click", disconnect);

// SignalR client methods:
connection.on("message", (message) => {
    // return guid of message to delete at server 
    connection.invoke("MessageResponse", message.guid);
    gui.printMessage(message);
});

connection.on("missedMessages", (missedMessages: Message[]) => {
    gui.setConnected();

    if (missedMessages.length > 0) {
        gui.printMissedMessages(missedMessages);
        
        // create array of guids of missedmessages
        const guidArray: string[] = [];
    
        missedMessages.forEach(message => {
            guidArray.push(message.guid);
        });

        // return guid of each missedmessage (to delete them at the server)
        connection.invoke("MissedMessagesResponse", guidArray);
    } else {
        gui.printListItem("Verbonden met SignalR, er zijn geen gemiste berichten");
    }
});
