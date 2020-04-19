function toggle() {
    console.log("Called");
    var n = document.getElementById("name");
    var cp = document.getElementById("conf_pass");
    var bt = document.getElementById("bottom-text");
    var b = document.getElementById("submit-button");
    if (n.style.display === "none") {
        n.style.display = "block";
        cp.style.display = "block";
        b.innerHTML = "Create Account";
        bt.innerHTML = `Already Registered? <a onclick="toggle()" href="#">Sign in</a>`;
    } else  {
        n.style.display = "none";
        cp.style.display = "none";
        b.innerHTML = "Login";
        bt.innerHTML = `Not registered? <a onclick="toggle()" href="#">Create an account</a>`
    }
}

function submit() {
    console.log("submit button pressed");
    if(document.getElementById("name").style.display === "block") { // if user is to be registered
        var data = {
            name: document.getElementById("name").value,
            username: document.getElementById("uname").value,
            password: document.getElementById("pass").value,
            confpassword: document.getElementById("conf_pass").value
        }
        if (!(data.password === data.confpassword)) {
            alert("Passwords do not match");
        } else {
            postSignUpData(data)
        }
    } else { //if user is to be logged in
        var data = {
            username: document.getElementById("uname").value,
            password: document.getElementById("pass").value,
        }
        console.log(data);
        postSignInData(data);
    }
}

function postSignInData(data) {
    fetch("/api/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if(response.status !== 200) {
            console.log("Error: Status code: " + response.status);
            status = "Failure"
            return;
        }
        response.json().then( result => {
            console.log(result);
            react(result.status); // Authenticated, Failure
        })
    }).catch( err => {
        console.log('Fetch Error :-S', err);
    });
}

function postSignUpData(data) {
    fetch("/api/signUp", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if(response.status !== 200) {
            console.log("Error: Status code: " + response.status);
            return;
        }
        response.json().then( result => {
            console.log(result.status); // exists, success, failure
            react(result.status);
        })
    }).catch( err => {
        console.log('Fetch Error :-S', err);
    });
}

function react(response) {
    if (response == "User Exists") {
        alert("Username exists");
    } else if(response == "Success") {
        alert("User Successfully created");
        window.location.reload();
    } else if( response == "Authenticated") {
        alert("User successfully logged in");
        // TODO change window location to logged in page
    } else if(response == "Invalid") {
        alert("Entered wrong username or password");
    } else {
        alert("There was an internal error in creating the user");
        window.location.reload();
    }
}

function getCurrencyData() {
    fetch("/api/getCurr", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({ 'num': email })
    }).then(response => {
        if(response.status !== 200) {
            console.log("Error: Status code: " + response.status);
            return;
        }
        response.json().then( data => {
            console.log(data.INR);
            document.getElementById("xcval1").innerHTML =  `1 USD = ${data.INR} INR`;
            document.getElementById("xcval2").innerHTML =  `1 USD = ${data.GBP} GBP`;
            document.getElementById("xcval3").innerHTML =  `1 USD = ${data.JPY} JPY`;
            return data.INR;
        })
    }).catch( err => {
        console.log('Fetch Error :-S', err);
    })
}