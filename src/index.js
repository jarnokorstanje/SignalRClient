import * as signalR from "@microsoft/signalr";

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
        //setTimeout(start, 5000);
    }
};

connection.onclose(async () => {
    await start();
});

connection.on("MessageReceived", (message) => {
    console.log(message);
});

start();
