import * as signalR from "@microsoft/signalr";
import { Message } from "./messageInterface";
import { GUI } from "./gui";

//TODO: - klasse voor signalR
// - then structuren omschrijven naar async await indien mogelijk

const userInput: HTMLInputElement  = document.getElementById("userInput") as HTMLInputElement;
const connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
const disconnectButton: HTMLButtonElement = document.getElementById("disconnectButton") as HTMLButtonElement;
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
                gui.setConnected();
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
            gui.setDisconnected();
        });
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
