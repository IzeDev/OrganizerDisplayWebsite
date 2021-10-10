const _baseURL = " https://sba.softadmin.se/JimmyGustafsson/WebServices/ScheduleWebService/"

async function GetAccessTokenOLD(userName, password) {
    try {
        let object = {UserName: userName, Password: password};
        let requestJson = JSON.stringify(object);
        let response = await fetch(_baseURL + 'GetAccessToken', {
            method : 'Post',
            // mode: 'no-cors',        
            body : requestJson,
            headers : {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin' : '*'
            }
        });

        response.text

        console.log(response);
        let responseJson = response.json();
    }
    catch (error) {
        console.log(error);
    }
}

async function GetAccessToken(userName, password) {
    try {
        let object = {UserName: userName, Password: password};
        let requestJson = JSON.stringify(object);

        var xhr = new XMLHttpRequest();
        xhr.open("Post", _baseURL + 'GetAccessToken', true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        // xhr.mode = 'no-cors';


        xhr.onreadystatechange = function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log(this.response);
            }
        }

        xhr.send(requestJson);

        // let response = await fetch(_baseURL + 'GetAccessToken', {
        //     method : 'Post',
        //     mode: 'no-cors',        
        //     body : requestJson,
        //     headers : {
        //         'Content-type': 'application/json; charset=UTF-8'
        //     }
        // });

        // response.text

        // console.log(response);
        // let responseJson = response.json();
    }
    catch (error) {
        console.log(error);
    }
}

async function SignIn(post) {
    post.preventDefault();
    let signInForm = document.getElementById("SignInForm");
    let userName = signInForm.elements["username"].value;
    let password = signInForm.elements["password"].value;
    await GetAccessToken(userName, password);
}

function mainfunc() {
    let signInForm = document.getElementById("SignInForm");
    signInForm.addEventListener("submit", SignIn);
}