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
    function getMainHeading (isAllDayEvent, dateCalendarItemFrom, dateCalendarItemTo) {
        let dateFromDisplay = new Date(dateCalendarItemFrom).toLocaleDateString('sv-se'); 
        let dateToDisplay = new Date(dateCalendarItemTo).toLocaleDateString('sv-se');

        if (isAllDayEvent === true || dateCalendarItemFrom === dateCalendarItemTo) {

            return dateFromDisplay;    
        }
        else {
            return dateFromDisplay + " - " + dateToDisplay;     
        }
    }

    if (calendarItems.length === 0) {
        let div = document.createElement("div");
        div.id = 0;
        div.style.display = "none";

        let h1 = document.createElement("h1");
        h1.innerHTML = "Inget planerat."
        div.appendChild(h1);  
        presentationDiv.appendChild(div);              
    }
    else {
        for (let index = 0; index < calendarItems.length; index++) {
            const calendarItem = calendarItems[index];
            let mainHeading = getMainHeading(calendarItem.IsAllDayEvent, calendarItem.DateCalendarItemFrom, calendarItem.DateCalendarItemTo);        
            let subHeading = calendarItem.CalendarItemName;     
            let body = calendarItem.CalendarItemDescription;

            let div = document.createElement("div");
            div.id = index;
            div.style.display = "none";

            let h1 = document.createElement("h1");
            h1.innerHTML = mainHeading;
            div.appendChild(h1);


            let h2 = document.createElement("h2");
            h2.innerHTML = subHeading;
            div.appendChild(h2);

            let p = document.createElement("p");
            p.innerHTML = body;    
            div.appendChild(p);
            presentationDiv.appendChild(div);
        }
    }

    return presentationDiv;
}

function displayNextPresentationItem(presentation) {
    let childNodes = Array.from(presentation.childNodes);
    let currentItem = childNodes.find((element, index, array) => {
        if ((typeof element.style) !== "undefined" && element.style.display === "block") {
            return element;
        }
    });

    if ((typeof currentItem) === "undefined" ||(typeof currentItem.id) === "undefined") {
        let firstDiv = document.getElementById("0");
        firstDiv.style.display = "block";
    }
    else if (Number(currentItem.id) === childNodes.length - 2) {
        currentItem.style.display = "none";

        let firstDiv = document.getElementById("0");
        firstDiv.style.display = "block";
    }
    else {
        currentItem.style.display = "none";

        let nextDivId = (Number(currentItem.id) + 1).toString();
        let div = document.getElementById(nextDivId);
        div.style.display = "block";
    }
}

async function mainfunc() {    
    let accessToken = sessionStorage.getItem("AccessToken");
    
    if (accessToken === null) {
        let signInForm = document.getElementById("SignInForm");
        signInForm.style.display = "block";
        signInForm.addEventListener("submit", SignIn);
    }
    else {
        let presentation = document.getElementById("Presentation");
        presentation.style.display = "block";

        let calendarItems = await GetScheduele(accessToken);
        calendarItems = calendarItems.sort((firstEl, sencondEl) => {
            if (firstEl.DatetimeCalendarItemFrom < sencondEl.DatetimeCalendarItemFrom) {
                return -1;
            }
            else if(firstEl.DatetimeCalendarItemFrom > sencondEl.DatetimeCalendarItemFrom) {
                return 1;
            }
            else {
                return 0;
            }
        });

        presentation = createPresentation(presentation, calendarItems);
        displayNextPresentationItem(presentation);
        setInterval(displayNextPresentationItem, 5000, presentation);
    }
}