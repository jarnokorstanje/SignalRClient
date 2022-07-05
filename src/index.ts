import * as signalR from "@microsoft/signalr";

const userInput = document.getElementById("userInput") as HTMLInputElement;
const connectButton = document.getElementById("connectButton");
const disconnectButton = document.getElementById("disconnectButton");
const statusText = document.getElementById("statusText");
const messageList = document.getElementById("messageList");

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
            disconnectButton.style.display = "none";  
            connectButton.style.display = "inline";
            statusText.style.display = "none";  
        });
}

connection.on("message", (message) => {
    connection.invoke("MessageResponse", message.guid);

    const dateObj = new Date(message.timestamp);
    printListItem(`(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: "${message.text}"`);
});

connection.on("missedMessages", (missedMessages: Message[]) => {
    if (missedMessages.length > 0) {
        printListItem("Verbonden met SignalR, gemiste berichten:");
        missedMessages.forEach(message => {
            const dateObj = new Date(message.timestamp);
            printListItem(`(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: "${message.text}"`);
        });
    } else {
        printListItem("Verbonden met SignalR, er zijn geen gemiste berichten");
    }
    
    
    
});

function printListItem(text: string) {
    const li = document.createElement("li");
    li.textContent = text;
    messageList.appendChild(li);
}

connectButton.addEventListener("click", connect);

disconnectButton.addEventListener("click", disconnect);

interface Message {
    guid: string;
    text: string;
    caller: string;
    receiver: string;
    timestamp: string;
}
