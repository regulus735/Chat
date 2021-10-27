export class fetchClass {
    constructor(url, method = "POST") {
        this.url = url;
        this.params.method = method;
    }

    params = {
        method: '',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: ''
    };

    fetchData(body) {
        this.params.body = JSON.stringify(body);
        return fetch(this.url, this.params);
            // .then(response => response.json())
            // .then(data => {
            //     return 
            //     console.log('Success:', data);
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            // });
    }
}

export async function checkData(url, method, body) {
    let data = sendFetch(url, method, body)
        .then((response) => response)

    return data;
}