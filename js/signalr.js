export class Signalr {
    connection() {
        document.addEventListener("DOMContentLoaded", () => {

            const connection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:5001/chathub")
                .configureLogging(signalR.LogLevel.Information)
                .build();


            connection.on("ReceiveMessage", (user, message) => {
                console.log(user);
                const li = document.createElement("li");
                li.textContent = `${user}: ${message}`;
                document.getElementById("messageList").appendChild(li);
            });

            connection.on("UserOnline", (user, status) => {
                console.log(`${user} ${status}`);
            });



            document.getElementById("join").addEventListener("click", async () => {
                connection.invoke("JoinGroup", "PrivateGroup").catch(err => {
                    return console.error(err.toString());
                });
            });

            async function start() {
                try {
                    await connection.start();
                    console.log("SignalR Connected.");
                } catch (err) {
                    console.log(err);
                    setTimeout(start, 5000);
                }
            };

            connection.onclose(async () => {
                connection.invoke("Connection", "PrivateGroup", "Disconnected").catch(err => {
                    return console.error(err.toString());
                });
                await start();
            });

            start();
        });
    }

    sendMessage(name, data) {
        document.querySelector(name).addEventListener("click", async () => {
            const user = document.getElementById("user").value;
            const message = document.getElementById("message").value;
            connection.invoke("SendMessageToGroup", "PrivateGroup", user, message).catch(err => {
                return console.error(err.toString());
            });
        });
    }
}