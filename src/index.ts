import { GUI } from "./gui";
import { SignalRConnection } from "./signalRConnection";

class SignalRClient {
    // set amount of connections to test
    private connectionAmountToTest = 20;

    constructor() {
        this.loadTest();
    }

    public async loadTest() {
        GUI.printListItem(`${this.connectionAmountToTest} connecties opzetten...`);

        for (let i = 0; i < this.connectionAmountToTest; i++) {
            const username = "user" + i;
            const connection = new SignalRConnection(username);
            connection.connect(username);
        }
    }
}

new SignalRClient();