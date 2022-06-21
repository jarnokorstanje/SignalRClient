import * as signalR from "@microsoft/signalr";

//var uuid = require("uuid");
//var id = uuid.v4();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:49153/messagehub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("MessageReceived", (message) => {
    const dateObj = new Date(message.timestamp);
    let li = document.createElement("li");
    li.textContent = `${message.caller}: ${message.text} (${dateObj.toLocaleTimeString('nl-NL') })`;
    document.getElementById("messageList").appendChild(li);
});

connection.start().catch((error) => console.error(error));
