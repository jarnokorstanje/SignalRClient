import * as signalR from "@microsoft/signalr";

const userInput = document.getElementById("userInput");
const connectButton = document.getElementById("connectButton");
const messageList = document.getElementById("messageList");

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:49153/messagehub")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

connectButton.addEventListener("click", connect);

function connect() {
    connection.start()
        .catch((error) => console.error(error))
        .then(() => {
            try {
                connection.invoke("AddToGroup", userInput.value);
            }
            catch (e) {
                console.error(e.toString());
            }
        });
};

//document.getElementById("leave-group").addEventListener("click", async (event) => {
//    var groupName = document.getElementById("group-name").value;
//    try {
//        await connection.invoke("RemoveFromGroup", groupName);
//    }
//    catch (e) {
//        console.error(e.toString());
//    }
//    event.preventDefault();
//});

connection.on("message", (message) => {
    console.log(message);
    const dateObj = new Date(message.timestamp);
    let li = document.createElement("li");
    li.textContent = `(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: ${message.text}`;
    messageList.appendChild(li);
});


