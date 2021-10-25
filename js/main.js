import * as json from './formToJson.js';

const containers = document.querySelectorAll(".container"),
    messagesContainer = document.querySelector("#messages");

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

const changeValues = (data) => {
    for (const key in data) {
        const selector = newDiv.querySelector("#" + key)
        if (selector)
            selector.textContent = data[key]
    }
}

const spawnElement = (text) => {
    const newP = document.createElement("p");
    newP.textContent = text;
    messagesContainer.appendChild(newP);
}

document.querySelectorAll(".navigation").forEach(item => {
    item.addEventListener("click", () => {
        showContainer(item.dataset.navigation);
        removeInputData(item.parentElement.querySelectorAll("form input"));
    });
})

document.querySelectorAll("form").forEach(item => {
    item.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = json.toJSONString(item.parentElement);
        console.log(data);
    });
})

document.querySelector("#chat #send").addEventListener("click", (event) => {
    const input = event.target.parentElement.querySelector("input");
    const data = json.singleJSON(input);
    if (data) {
        
        spawnElement(input.value);
        //
        input.value = "";
    }
});