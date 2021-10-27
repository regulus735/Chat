export class Signalr {
    constructor(messagesContainer) {
        this.connection = new signalR.HubConnectionBuilder()
            // .withUrl("https://localhost:5001/chathub")
            .withUrl("https://chat-api-app.azurewebsites.net/chathub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.on("ReceiveMessage", (user, message) => {
            const newP = document.createElement("p");
            messagesContainer.appendChild(newP);
            newP.textContent = `${user}>`;

            let indexText = 0;
            const indexTyping = setInterval(() => {
                newP.textContent += message[indexText];
                indexText++;
                if(indexText === message.length)
                    clearInterval(indexTyping);
            }, 50);
        });

        // this.connection.on("UserOnline", (user, status) => {
        //     console.log(`${user} ${status}`);
        // });

        // this.connection.onclose(async () => {
        //     connection.invoke("Connection", "PrivateGroup", "Disconnected").catch(err => {
        //         return console.error(err.toString());
        //     });
        //     await this.start();
        // });

        this.start();
    }

    async start() {
        try {
            await this.connection.start();
            console.log("SignalR Connected.");
        } catch (err) {
            console.log(err);
            setTimeout(this.start, 5000);
        }
    };

    sendMessage(data, message) {
        this.connection.invoke("SendMessageToGroup", data.group, data.username, message).catch(err => {
            return console.error(err.toString());
        });
    }

    join(data) {
        return this.connection.invoke("JoinGroup", data.name, data.password);
    };
}