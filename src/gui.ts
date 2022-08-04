import { Message } from "./messageInterface";

export class GUI {
    messageList: HTMLUListElement;
    statusText: HTMLParagraphElement;
    connectButton: HTMLButtonElement;
    disconnectButton: HTMLButtonElement;

    constructor() {
        this.messageList = document.getElementById("messageList") as HTMLUListElement;
        this.statusText = document.getElementById("statusText") as HTMLParagraphElement;
        this.connectButton = document.getElementById("connectButton") as HTMLButtonElement;
        this.disconnectButton = document.getElementById("disconnectButton") as HTMLButtonElement;
    }

    printListItem(text: string) {
        const li = document.createElement("li");
        li.textContent = text;
        this.messageList.appendChild(li);
    }

    printMessage(message: Message) {
        const dateObj = new Date(message.timestamp);
        this.printListItem(`(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: "${message.text}"`);
    }

    printMissedMessages(missedMessages: Message[]) {
        this.printListItem("Verbonden met SignalR, gemiste berichten:");
        missedMessages.forEach(message => {
            this.printMessage(message);
        });
    }

    setConnected() {
        this.disconnectButton.style.display = "inline";  
        this.connectButton.style.display = "none";
        this.statusText.style.display = "inline";
    }

    setDisconnected() {
        this.printListItem("Verbinding verbroken");
        this.disconnectButton.style.display = "none";  
        this.connectButton.style.display = "inline";
        this.statusText.style.display = "none";
    }
}