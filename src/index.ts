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
    await connection.start().catch((error) => console.error(error));
    await connection.invoke("AddToGroup", userInput.value).catch((error) => console.error(error));
    gui.setConnected();
}

async function disconnect(): Promise<void> {
    await connection.stop().catch((error) => console.error(error));
    gui.setDisconnected();
}

connection.on("message", (message) => {
    connection.invoke("MessageResponse", message.guid);
    gui.printMessage(message);
});

connection.on("missedMessages", (missedMessages: Message[]) => {
    gui.printMissedMessages(missedMessages);
});

connectButton.addEventListener("click", connect);

disconnectButton.addEventListener("click", disconnect);
