import { Message } from "./messageInterface";

export abstract class GUI {
    private static messageList: HTMLUListElement = document.getElementById("messageList") as HTMLUListElement;
    private static statusText: HTMLParagraphElement = document.getElementById("statusText") as HTMLParagraphElement;
    private static connectButton: HTMLButtonElement = document.getElementById("connectButton") as HTMLButtonElement;
    private static disconnectButton: HTMLButtonElement = document.getElementById("disconnectButton") as HTMLButtonElement;

    public static printListItem(text: string) {
        const li = document.createElement("li");
        li.textContent = text;
        GUI.messageList.appendChild(li);
    }

    public static printMessage(message: Message) {
        const dateObj = new Date(message.timestamp);
        GUI.printListItem(`(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: "${message.text}"`);
    }

    public static printMissedMessages(missedMessages: Message[]) {
        GUI.printListItem("Verbonden met SignalR, gemiste berichten:");
        missedMessages.forEach(message => {
            GUI.printMessage(message);
        });
    }

    public static setConnected() {
        GUI.disconnectButton.style.display = "inline";  
        GUI.connectButton.style.display = "none";
        GUI.statusText.style.display = "inline";
    }

    public static setDisconnected() {
        GUI.printListItem("Verbinding verbroken");
        GUI.disconnectButton.style.display = "none";  
        GUI.connectButton.style.display = "inline";
        GUI.statusText.style.display = "none";
    }
}