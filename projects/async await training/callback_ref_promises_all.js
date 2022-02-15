const greeting = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello, world.');
        reject(new Error('Oh no... oh no... oh no no no no no...'));
    }, 2000);
});

const response = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('Hello back, human.');
        reject(new Error('Oh no... oh no... oh no no no no no...'));
    }, 4000);
});

// Both msj are shown when last promise got solved.
Promise.all([greeting, response])
    .then((result) => {
        console.log(result[0]);
        console.log(result[1]);
    })
    .catch((error) => {
        console.log(error.message);
    });
