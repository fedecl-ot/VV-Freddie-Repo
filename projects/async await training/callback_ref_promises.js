function greeting() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Hello, world.');
            reject(new Error('Oh no... oh no... oh no no no no no...'));
        }, 2000);
    });
}

function response() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Hello back, human.');
            reject(new Error('Oh no... oh no... oh no no no no no...'));
        }, 4000);
    });
}

// Greeting is executed and after 2 seconds.
greeting()
    .then((greeting) => console.log(greeting));
// Response is executed 2 seconds after Greeting.
return response()
    .then((response) => console.log(response))
    .catch((error) => console.log(error.message));