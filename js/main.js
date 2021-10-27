import * as json from './formToJson.js';
import { Signalr } from './signalr.js';
import { fetchClass } from './fetchData.js';

const containers = document.querySelectorAll(".container"),
    messagesContainer = document.querySelector("#messages");

const url = "https://localhost:5001/api/room/";

const roomParams = {
    username: null,
    group: null,
    connection: null,
    //do przycisku enter
    isInRoom: false
};
roomParams.connection = new Signalr(messagesContainer);

const showContainer = (id) => {
    containers.forEach(e => {
        if (e.id == id)
            e.classList.remove("hide");
        else
            e.classList.add("hide");
    });
}

const removeInputData = (inputs) => {
    inputs.forEach(e => {
        e.value = "";
    });
}

const removeMessages = () => {
    while (messagesContainer.firstChild)
        messagesContainer.removeChild(messagesContainer.firstChild);
}

const changeBorderColor = (element, response) => {
    element.querySelectorAll("input").forEach(e => {
        !response && e.name != 'username' ? e.classList.add('wrong_border') : e.classList.remove('wrong_border');
    });
}

document.querySelectorAll(".navigation").forEach(item => {
    item.addEventListener("click", () => {
        if (item.parentElement.id == "chat") {
            roomParams.isInRoom = false;
            removeMessages();
        }

        showContainer(item.dataset.navigation);
        removeInputData(item.parentElement.querySelectorAll("input"));
        changeBorderColor(item.parentElement, true);
    });
})

document.querySelectorAll("form").forEach(item => {
    item.addEventListener("submit", async event => {
        event.preventDefault();
        const data = json.toJSONString(item);

        if (item.id == "createForm") {
            const checkData = new fetchClass(url + "create");

            const status = await checkData.fetchData(data).then(data => {
                return data.status;
            }).catch((error) => {
                return console.error('Error:', error);
            });

            if (status != 200) {
                changeBorderColor(item, false);
                return;
            }
        }

        roomParams.username = data["username"];
        roomParams.group = data["name"];
        roomParams.connection.join(data).then(() => {
            showContainer(item.querySelector("button").dataset.navigation);
            removeInputData(item.parentElement.querySelectorAll("form input"));
            document.querySelector("#roomName").textContent = `${roomParams.group}'s room`;
            roomParams.isInRoom = true;
        })
            .catch(err => {
                changeBorderColor(item, false);
                return console.error(err.toString());
            });;
    })
});

const sendButton = document.querySelector("#chat #send");
const sendMessage = () => {
    const input = event.target.parentElement.querySelector("input");
    if (input.value) {
        roomParams.connection.sendMessage(roomParams, input.value);
        input.value = "";
    }
};

sendButton.addEventListener("click", (event) => {
    sendMessage();
});

document.addEventListener('keydown', (e) => {
    if (roomParams.isInRoom && e.key === 'Enter' && !e.repeat)
        sendMessage();

});
