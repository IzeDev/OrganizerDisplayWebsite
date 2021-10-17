// const _baseURL = "https://sba.softadmin.se/JimmyGustafsson/WebServices/ScheduleWebService/"
const _baseURL = "https://9ea6bed0-efbe-4bf8-b6f3-40791aaaf529.mock.pstmn.io/"

async function GetAccessToken(userName, password) {
    try {
        let object = {UserName: userName, Password: password};
        let requestJson = JSON.stringify(object);
        let response = await fetch(_baseURL + 'GetAccessToken', {
            method : 'Post',
            body : requestJson,
            headers : {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept' : 'application/json'
            }
        });

        let responseJson = await response.json();
        return responseJson.AccessToken;
    }
    catch (error) {
        console.log(error);
    }
}

async function GetScheduele(accessToken) {
    try {
        let object = {AccessToken: accessToken};
        let requestJson = JSON.stringify(object);
        let response = await fetch(_baseURL + 'GetUserScheduele', {
            method : 'Post',
            body : requestJson,
            headers : {
                'Content-type': 'application/json; charset=UTF-8',
                'Accept' : 'application/json'
            }
        });

        let responseJson = await response.json();
        return responseJson.CalendarItems;
    }
    catch (error) {
        console.log(error);
    }
}

async function SignIn(post) {
    let signInForm = document.getElementById("SignInForm");
    let userName = signInForm.elements["username"].value;
    let password = signInForm.elements["password"].value;
    let accessToken = await GetAccessToken(userName, password);
    sessionStorage.setItem("AccessToken", accessToken);
}

function createPresentation(presentationDiv, calendarItems) {
    let datetimeNow = new Date();
    let presentationItems = [];
    for (let index = 0; index < calendarItems.length; index++) {
        const calendarItem = calendarItems[index];
        
        if (calendarItem.IsAllDayEvent === true || calendarItem.DateCalendarItemFrom === DateCalendarItemTo) {
            let mainHeading = calendarItem.CalendarItemName;           
        }
         
        
    }
}

async function mainfunc() {
    let signInForm = document.getElementById("SignInForm");
    let presentation = document.getElementById("Presentation");

    let accessToken = sessionStorage.getItem("AccessToken");

    if (accessToken === null) {
        signInForm.style.display = "block";
        signInForm.addEventListener("submit", SignIn);
    }
    else {
        presentation.style.display = "block";
        let calendarItems = await GetScheduele(accessToken);

    }
}