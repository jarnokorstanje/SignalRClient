import * as signalR from "@microsoft/signalr";

//var uuid = require("uuid");
//var id = uuid.v4();

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:49153/messagehub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
    }
};

connection.onclose(async () => {
    await start();
});

connection.on("MessageReceived", (message) => {
    const dateObj = new Date(message.timestamp);
    let li = document.createElement("li");
    li.textContent = `${message.caller}: ${message.text} (${dateObj.toLocaleTimeString('nl-NL') })`;
    document.getElementById("messageList").appendChild(li);
});

start();
