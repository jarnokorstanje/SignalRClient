import * as signalR from "@microsoft/signalr";
import { Message } from "./messageInterface";
import { GUI } from "./gui";

//TODO: Klasse voor GUI anapassingen
//- classe voor signalR
// - then structuren omschrijven naar async await indien mogelijk


const userInput: HTMLInputElement  = document.getElementById("userInput") as HTMLInputElement;
const connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
const disconnectButton: HTMLButtonElement = document.getElementById("disconnectButton") as HTMLButtonElement;
const statusText: HTMLParagraphElement = document.getElementById("statusText") as HTMLParagraphElement;
const gui: GUI = new GUI();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:49153/messagehub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

function connect(): void {
    connection.start()
        .catch((error) => console.error(error))
        .then(() => {
            try {
                connection.invoke("AddToGroup", userInput.value);
                disconnectButton.style.display = "inline";  
                connectButton.style.display = "none";
                statusText.style.display = "inline";
            }
            catch(error) {
                console.error(error);
            }
        });
}

function disconnect(): void {
    connection.stop()
        .catch((error) => console.error(error))
        .then(() => {
            gui.printListItem("Verbinding verbroken");
            disconnectButton.style.display = "none";  
            connectButton.style.display = "inline";
            statusText.style.display = "none";
        });
}

connection.on("message", (message) => {
    connection.invoke("MessageResponse", message.guid);

    const dateObj = new Date(message.timestamp);
    gui.printListItem(`(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: "${message.text}"`);
});

connection.on("missedMessages", (missedMessages: Message[]) => {
    if (missedMessages.length > 0) {
        gui.printListItem("Verbonden met SignalR, gemiste berichten:");
        missedMessages.forEach(message => {
            const dateObj = new Date(message.timestamp);
            gui.printListItem(`(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: "${message.text}"`);
        });
    } else {
        gui.printListItem("Verbonden met SignalR, er zijn geen gemiste berichten");
    }      
});

connectButton.addEventListener("click", connect);

disconnectButton.addEventListener("click", disconnect);

