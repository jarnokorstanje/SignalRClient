import { Message } from "./message";

export class GUI {
    private static messageList: HTMLUListElement = document.getElementById("messageList") as HTMLUListElement;
    private static statusText: HTMLParagraphElement = document.getElementById("statusText") as HTMLParagraphElement;

    public static printListItem(text: string) {
        const li = document.createElement("li");
        li.textContent = text;
        GUI.messageList.appendChild(li);
    }

    public static printMessage(message: Message) {
        const dateObj = new Date(message.timestamp);
        GUI.printListItem(`(${dateObj.toLocaleTimeString('nl-NL')}) ${message.caller}: "${message.text}"`);
    }

    public static printMissedMessages(missedMessages: Message[], username: string) {
        GUI.printListItem(`${username} verbonden, gemiste berichten:`);
        missedMessages.forEach(message => {
            GUI.printMessage(message);
        });
    }

    public static connectionAmount(amount: number) {
        GUI.statusText.innerHTML = "Aantal connecties: " + amount;
    }
}