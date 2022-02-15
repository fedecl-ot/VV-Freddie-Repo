function greeting() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Hello, world.');
        }, 1000);
    });
}

function response() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Hello back, human.');
        }, 4000);
    });
}

// Greeting is executed and after 2 seconds.
async function show() {
    try {
        const greet = await greeting();
        const res = await response();
        console.log(greet);
        console.log(res);
    } catch (error) {
        console.log('Oh no... oh no... oh no no no no no...');
    }
}
// Invokes async function.
show();