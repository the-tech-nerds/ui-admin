
const updateFileStorage= async (data) =>{
    return fetch(`/api/file/update`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-cache',
        redirect: 'follow',
    }).then(async res => {
        const respons = await res.json();
         return respons;

    });

}
export {updateFileStorage as default}
