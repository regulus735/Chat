export class Signalr {
    constructor(messagesContainer) {
        this.connection = new signalR.HubConnectionBuilder()
            // .withUrl("https://localhost:5001/chathub")
            .withUrl("https://chat-api-app.azurewebsites.net/chathub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.on("ReceiveMessage", (user, message) => {
            //paragraph z imieniem
            const nameP = document.createElement("p");
            nameP.textContent = `${user}>`;
            messagesContainer.appendChild(nameP);

            //message w paragraphie
            const messageP = document.createElement("span");
            messageP.style = "color: white";
            nameP.appendChild(messageP);

            let indexText = 0;
            const indexTyping = setInterval(() => {
                messageP.textContent += message[indexText];
                indexText++;
                if (indexText === message.length)
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