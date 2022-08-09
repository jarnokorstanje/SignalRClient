import { Message } from "./message";
import { GUI } from "./gui";
import { SignalRConnection } from "./signalRConnection";

class SignalRClient {
    private userInput: HTMLInputElement = document.getElementById("userInput") as HTMLInputElement;
    private connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
    private disconnectButton: HTMLButtonElement = document.getElementById("disconnectButton") as HTMLButtonElement;
    private signalRConnection: SignalRConnection;

    constructor() {
        this.signalRConnection = new SignalRConnection(this.handleMessage, this.handleMissedMessages);
        this.connectButton.addEventListener("click", () => { this.signalRConnection.connect(this.userInput.value);});
        this.disconnectButton.addEventListener("click", () => { this.signalRConnection.disconnect();});
    }

    public handleMessage = (message: Message) => {
        this.signalRConnection.invokeMessageResponse(message.guid);
        GUI.printMessage(message);
    }

    public handleMissedMessages = (missedMessages: Message[]) => {
        GUI.setConnectedStyle();

        if (missedMessages.length > 0) {
            GUI.printMissedMessages(missedMessages);

            // create array of guids of missedmessages
            const missedMessageIds: string[] = [];

            missedMessages.forEach(message => {
                missedMessageIds.push(message.guid);
            });

            // return guid of each missedmessage (to let the server know it has been received)
            this.signalRConnection.invokeMissedMessagesResponse(missedMessageIds);
        } else {
            GUI.printListItem("Verbonden met SignalR, er zijn geen gemiste berichten");
        }
    }
}

new SignalRClient();