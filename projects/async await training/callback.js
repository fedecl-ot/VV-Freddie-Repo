function greeting(callback) {
    setTimeout(() => {
        callback('Hello, world.');
    }, 2000);
}

function response(callback) {
    setTimeout(() => {
        callback('Hello back, human.');
    }, 4000);
}

// Greeting is executed and after 2 seconds.
greeting((callback) => {
    console.log(callback);
});

// Response is executed 2 seconds after Greeting.
response((callback) => {
    console.log(callback);
});
