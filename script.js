/*****************************************************************
 Wedding RSVP v3.0
 By ChatGPT ❤️
******************************************************************/

/***************************************************************
 CONFIGURATION
****************************************************************/

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-pMd8LCJQAQV_4ofv2SdKybBEF0OmbhO7r53qvBhjG14UIWkKJoLTFj93dsDr-l4/exec";

/***************************************************************
 ELEMENTS
****************************************************************/

const form = document.getElementById("rsvpForm");

const attendanceInput = document.getElementById("attendance");
const parkingInput = document.getElementById("parking");

const acceptFields = document.getElementById("acceptFields");
const declineMessage = document.getElementById("declineMessage");

const submitButton = document.getElementById("submitButton");

const loadingOverlay = document.getElementById("loadingOverlay");

const successScreen = document.getElementById("successScreen");

const verificationScreen = document.getElementById("verificationScreen");

const successText = document.getElementById("successText");

const autocomplete = document.getElementById("autocomplete");

const nameInput = document.getElementById("name");

const dietInput = document.getElementById("diet");

const parkingButtons =
document.querySelectorAll(".parking");

const attendanceButtons =
document.querySelectorAll(".attendance");

/***************************************************************
 STATE
****************************************************************/

let guestSuggestions = [];

let selectedSuggestion = -1;

let guestVerified = false;

acceptFields.style.display = "none";
declineMessage.style.display = "none";

/***************************************************************
 BUTTON HELPERS
****************************************************************/

function clearButtons(buttons){

    buttons.forEach(button=>{

        button.classList.remove("active");

    });

}

function activateButton(button){

    button.classList.add("active");

}

function hideAcceptFields(){

    acceptFields.style.display="none";

}

function showAcceptFields(){

    acceptFields.style.display="block";

}

function showDecline(){

    declineMessage.classList.remove("hidden");

}

function hideDecline(){

    declineMessage.classList.add("hidden");

}

/***************************************************************
 ATTENDANCE
****************************************************************/

attendanceButtons.forEach(button=>{

button.addEventListener("click",()=>{

clearButtons(attendanceButtons);

activateButton(button);

attendanceInput.value =
button.dataset.value;

if(button.dataset.value==="Joyfully Accept"){

showAcceptFields();

hideDecline();

}else{

hideAcceptFields();

showDecline();

parkingInput.value="";

clearButtons(parkingButtons);

}

});

});

/***************************************************************
 PARKING
****************************************************************/

parkingButtons.forEach(button=>{

button.addEventListener("click",()=>{

clearButtons(parkingButtons);

activateButton(button);

parkingInput.value=
button.dataset.value;

});

});

/***************************************************************
 LOAD GUEST SUGGESTIONS
****************************************************************/

async function fetchGuestSuggestions(query){

try{

const response = await fetch(

SCRIPT_URL +
"?action=guests&q=" +
encodeURIComponent(query)

);

const data = await response.json();

guestSuggestions = data;

drawSuggestions();

}

catch(error){

console.error(error);

}

}

/*****************************************************************
 DRAW AUTOCOMPLETE
******************************************************************/

function drawSuggestions(){

    autocomplete.innerHTML = "";

    selectedSuggestion = -1;

    if(guestSuggestions.length===0){

        autocomplete.classList.add("hidden");

        return;

    }

    guestSuggestions.forEach((guest,index)=>{

        const item = document.createElement("div");

        item.className = "autocomplete-item";

        item.innerHTML = guest;

        item.addEventListener("click",()=>{

            nameInput.value = guest;

            guestVerified = true;

            autocomplete.classList.add("hidden");

        });

        autocomplete.appendChild(item);

    });

    autocomplete.classList.remove("hidden");

}

/*****************************************************************
 NAME INPUT
******************************************************************/

nameInput.addEventListener("input",()=>{

    guestVerified = false;

    const value = nameInput.value.trim();

    if(value.length < 3){

        autocomplete.classList.add("hidden");

        return;

    }

    fetchGuestSuggestions(value);

});

/*****************************************************************
 KEYBOARD NAVIGATION
******************************************************************/

nameInput.addEventListener("keydown",(event)=>{

    const items =
    autocomplete.querySelectorAll(".autocomplete-item");

    if(items.length===0) return;

    if(event.key==="ArrowDown"){

        event.preventDefault();

        selectedSuggestion++;

        if(selectedSuggestion>=items.length){

            selectedSuggestion=0;

        }

    }

    if(event.key==="ArrowUp"){

        event.preventDefault();

        selectedSuggestion--;

        if(selectedSuggestion<0){

            selectedSuggestion=items.length-1;

        }

    }

    items.forEach(item=>{

        item.classList.remove("active");

    });

    if(selectedSuggestion>=0){

        items[selectedSuggestion]
        .classList.add("active");

    }

    if(event.key==="Enter" && selectedSuggestion>=0){

        event.preventDefault();

        items[selectedSuggestion].click();

    }

});

/*****************************************************************
 CLOSE DROPDOWN
******************************************************************/

document.addEventListener("click",(event)=>{

    if(!event.target.closest(".field")){

        autocomplete.classList.add("hidden");

    }

});

/*****************************************************************
 VALIDATION
******************************************************************/

function validateForm(){

    if(nameInput.value.trim()===""){

        alert("Please enter your name.");

        return false;

    }

    if(document.getElementById("email").value.trim()===""){

        alert("Please enter your email address.");

        return false;

    }

    if(attendanceInput.value===""){

        alert("Please select your attendance.");

        return false;

    }

    if(attendanceInput.value==="Joyfully Accept"){

        if(dietInput.value.trim()===""){

            alert(
            "Please tell us about any dietary restrictions. If none, simply type 'None'."
            );

            return false;

        }

        if(parkingInput.value===""){

            alert("Please let us know whether you need parking.");

            return false;

        }

    }

    return true;

}

/*****************************************************************
 SUBMIT
******************************************************************/

form.addEventListener("submit",async(event)=>{

event.preventDefault();

if(!validateForm()) return;

submitButton.disabled=true;

loadingOverlay.classList.remove("hidden");

const payload={

name:nameInput.value.trim(),

email:document
.getElementById("email")
.value.trim(),

attendance:attendanceInput.value,

allergies:dietInput.value.trim(),

parking:parkingInput.value,

song:document
.getElementById("song")
.value.trim(),

message:document
.getElementById("message")
.value.trim(),

verified:guestVerified

};

try{

const response=await fetch(

SCRIPT_URL,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(payload)

}

);

const result=await response.json();

loadingOverlay.classList.add("hidden");

form.style.display="none";

if(result.status==="verified"){

successScreen.classList.remove("hidden");

if(payload.attendance==="Joyfully Accept"){

successText.innerHTML=

"We're absolutely thrilled you'll be celebrating with us! ❤️<br><br>See you on our special day.";

}else{

successText.innerHTML=

"Thank you for letting us know. We'll truly miss celebrating with you, but we sincerely appreciate your response.";

}

}

else{

verificationScreen
.classList.remove("hidden");

}

}

catch(error){

loadingOverlay.classList.add("hidden");

submitButton.disabled=false;

alert(

"Oops! Something went wrong. Please try again."

);

console.error(error);

}

});

/*****************************************************************
 PREVENT ACCIDENTAL ENTER
******************************************************************/

document
.querySelectorAll("input")

.forEach(input=>{

input.addEventListener("keydown",(event)=>{

if(event.key==="Enter"

&&

input.id!=="name"){

event.preventDefault();

}

});

});
