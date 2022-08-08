import { Message } from "./messageInterface";
import { GUI } from "./gui";
import { SignalRConnection } from "./signalRConnection";

//TODO: index klasse

const userInput: HTMLInputElement  = document.getElementById("userInput") as HTMLInputElement;
const connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
const disconnectButton: HTMLButtonElement = document.getElementById("disconnectButton") as HTMLButtonElement;
const signalRConnection: SignalRConnection = new SignalRConnection(handleMessage, handleMissedMessages);

connectButton.addEventListener("click", () => {signalRConnection.connect(userInput.value);});

disconnectButton.addEventListener("click", signalRConnection.disconnect);

function handleMessage(message: Message) {
    signalRConnection.connection.invoke("MessageResponse", message.guid);
    GUI.printMessage(message);
}

function handleMissedMessages(missedMessages: Message[]) {
    GUI.setConnected();

    if (missedMessages.length > 0) {
        GUI.printMissedMessages(missedMessages);
        
        // create array of guids of missedmessages
        const guidArray: string[] = [];
    
        missedMessages.forEach(message => {
            guidArray.push(message.guid);
        });

        // return guid of each missedmessage (to delete them at the server)
        signalRConnection.connection.invoke("MissedMessagesResponse", guidArray);
    } else {
        GUI.printListItem("Verbonden met SignalR, er zijn geen gemiste berichten");
    }
}
