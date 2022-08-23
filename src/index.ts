import { GUI } from "./gui";
import { SignalRConnection } from "./signalRConnection";

class SignalRClient {
    // set amount of connections to test
    private connectionAmountToTest = 250;

    constructor() {
        this.loadTest();
    }

    public async loadTest() {
        GUI.printListItem(`${this.connectionAmountToTest} connecties opzetten...`);
        let highestConnectionIndex = 0;

        for (let i = 0; i < this.connectionAmountToTest; i++) {
            const username = "connection" + i;
            const connection = new SignalRConnection(username);
            await connection.connect(username);

            if (i > highestConnectionIndex) {
                highestConnectionIndex = i;
                GUI.connectionAmount(i + 1);
            }
        }
    }
}

new SignalRClient();