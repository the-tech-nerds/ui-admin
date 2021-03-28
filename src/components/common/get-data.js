const FetchData = ({url, method='GET', callback}) => {
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        redirect: 'follow',
    })
        .then(async res => {
            const response = await res.json();
            if (response.code === 200) {
                callback(response, true);
            } else {
                callback(response, false);
            }
        })
        .catch(error => {
            callback({message: error}, false)
        })
}

export default FetchData
