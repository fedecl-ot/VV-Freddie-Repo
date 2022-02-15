const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello, world.');
        reject(new Error('Oh no... oh no... oh no no no no no...'));
    }, 2000);
});

promise
    .then((greeting) => {
        console.log(greeting);
    })
    .catch((error) => {
        console.log(error.message);
    });