export class GUI {
    messageList: HTMLUListElement;

    constructor() {
        this.messageList = document.getElementById("messageList") as HTMLUListElement;
    }

    printListItem(text: string) {
        const li = document.createElement("li");
        li.textContent = text;
        this.messageList.appendChild(li);
    }
}