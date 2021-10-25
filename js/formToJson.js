export const toJSONString = (element) => {
    let data = {};
    element.querySelectorAll("input").forEach(item => {
        data[item.name] = singleJSON(item);
    })
    return data;
}

export const singleJSON = function (item) {
    let name = item.name,
        value = item.value;

    if (name) {
        return value;
    }
}