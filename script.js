/*****************************************************************
 Wedding RSVP v4.3
 Frontend for GitHub Pages
*****************************************************************/

/***************************************************************
 CONFIGURATION
****************************************************************/

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwPlyIpaPpALxStNKio_SAsAnykgabG1zPXOYIJdIdukHfS9NRndQ88Qcs2Totm3CbL/exec";

/***************************************************************
 ELEMENTS
****************************************************************/

const form =
document.getElementById("rsvpForm");

const nameInput =
document.getElementById("name");

const emailInput =
document.getElementById("email");

const dietInput =
document.getElementById("diet");

const songInput =
document.getElementById("song");

const messageInput =
document.getElementById("message");

const attendanceInput =
document.getElementById("attendance");

const parkingInput =
document.getElementById("parking");

const attendanceButtons =
document.querySelectorAll(".attendance");

const parkingButtons =
document.querySelectorAll(".parking");

const acceptFields =
document.getElementById("acceptFields");

const declineMessage =
document.getElementById("declineMessage");

const autocomplete =
document.getElementById("autocomplete");

const submitButton =
document.getElementById("submitButton");

const loadingOverlay =
document.getElementById("loadingOverlay");

const successScreen =
document.getElementById("successScreen");

const verificationScreen =
document.getElementById("verificationScreen");

const successText =
document.getElementById("successText");

/***************************************************************
 VERIFICATION MESSAGE
****************************************************************/

const verificationMessage =
document.createElement("div");

verificationMessage.id =
"verificationMessage";

verificationMessage.className =
"verification-message hidden";

nameInput.parentNode.appendChild(
verificationMessage
);

/***************************************************************
 STATE
****************************************************************/

let guestList = [];

let filteredGuests = [];

let selectedIndex = -1;

let pageReady = false;

/***************************************************************
 INITIALIZE
****************************************************************/

window.addEventListener(

"load",

async ()=>{

    hideAcceptFields();

    hideDecline();

    await loadGuestList();

    pageReady = true;

}

);

/***************************************************************
 LOAD ENTIRE GUEST LIST
****************************************************************/

async function loadGuestList(){

    try{

        const response =
        await fetch(

            SCRIPT_URL +
            "?action=guests"

        );

        if(!response.ok){

            throw new Error(
            "Unable to load guest list."
            );

        }

        guestList =
        await response.json();

        console.log(

            "Loaded",

            guestList.length,

            "guest names."

        );

    }

    catch(error){

        console.error(error);

        guestList=[];

    }

}

/***************************************************************
 HELPERS
****************************************************************/

function normalize(text){

    return String(text)

    .toLowerCase()

    .trim()

    .replace(/\s+/g," ")

    .replace(/[^\w\s]/g,"");

}

function isVerifiedGuest(name){

    const search = normalize(name);

    return guestList.some(guest=>{

        return normalize(guest)===search;

    });

}

function clearButtons(buttons){

    buttons.forEach(button=>{

        button.classList.remove("active");

    });

}

function activateButton(button){

    button.classList.add("active");

}

function showAcceptFields(){

    acceptFields.style.display="block";

}

function hideAcceptFields(){

    acceptFields.style.display="none";

}

function showDecline(){

    declineMessage.classList.remove("hidden");

}

function hideDecline(){

    declineMessage.classList.add("hidden");

}

function showError(message){

    alert(message);

}

/***************************************************************
 AUTOCOMPLETE
****************************************************************/

function filterGuests(query){

    const search = normalize(query);

    verificationMessage.className =
    "verification-message hidden";

    verificationMessage.innerHTML="";

    if(search.length<3){

        filteredGuests=[];

        drawSuggestions();

        return;

    }

    filteredGuests = guestList

    .filter(name=>

        normalize(name)

        .includes(search)

    )

    .sort((a,b)=>{

        const aStarts =
        normalize(a).startsWith(search);

        const bStarts =
        normalize(b).startsWith(search);

        if(aStarts && !bStarts){

            return -1;

        }

        if(!aStarts && bStarts){

            return 1;

        }

        return a.localeCompare(b);

    })

    .slice(0,8);

    drawSuggestions();

}

/***************************************************************
 DRAW AUTOCOMPLETE
****************************************************************/

function drawSuggestions(){

    autocomplete.innerHTML="";

    selectedIndex=-1;

    if(filteredGuests.length===0){

        autocomplete.classList.add("hidden");

        return;

    }

    filteredGuests.forEach((guest,index)=>{

        const item =
        document.createElement("div");

        item.className =
        "autocomplete-item";

        item.textContent = guest;

        item.addEventListener(

        "mousedown",

        ()=>{

            chooseGuest(index);

        });

        autocomplete.appendChild(item);

    });

    autocomplete.classList.remove("hidden");

}

/***************************************************************
 CHOOSE GUEST
****************************************************************/

function chooseGuest(index){

    const guest =
    filteredGuests[index];

    nameInput.value = guest;

    autocomplete.classList.add("hidden");

    verificationMessage.className =
    "verification-message verified";

    verificationMessage.innerHTML =

    "❤️ We found your invitation! We can't wait to celebrate with you.";

}

/***************************************************************
 NAME INPUT
****************************************************************/

nameInput.addEventListener(

"input",

()=>{

    filterGuests(

        nameInput.value

    );

}

);

nameInput.addEventListener(

"blur",

()=>{

    autocomplete.classList.add("hidden");

    const value =

    nameInput.value.trim();

    if(value.length<3){

        verificationMessage.className=

        "verification-message hidden";

        verificationMessage.innerHTML="";

        return;

    }

    if(isVerifiedGuest(value)){

        verificationMessage.className=

        "verification-message verified";

        verificationMessage.innerHTML=

        "❤️ We found your invitation! We can't wait to celebrate with you.";

    }

    else{

        verificationMessage.className=

        "verification-message unverified";

        verificationMessage.innerHTML=

        "We couldn't automatically match your name with our guest list. You're still welcome to submit your RSVP, and we'll personally review it before confirming your invitation.";

    }

});

/***************************************************************
 KEYBOARD NAVIGATION
****************************************************************/

nameInput.addEventListener(

"keydown",

(event)=>{

    const items=

    autocomplete.querySelectorAll(

        ".autocomplete-item"

    );

    if(items.length===0){

        return;

    }

    switch(event.key){

        case "ArrowDown":

            event.preventDefault();

            selectedIndex++;

            if(selectedIndex>=items.length){

                selectedIndex=0;

            }

            break;

        case "ArrowUp":

            event.preventDefault();

            selectedIndex--;

            if(selectedIndex<0){

                selectedIndex=

                items.length-1;

            }

            break;

        case "Enter":

            if(selectedIndex>=0){

                event.preventDefault();

                chooseGuest(

                    selectedIndex

                );

            }

            break;

        case "Escape":

            autocomplete.classList.add(

                "hidden"

            );

            break;

    }

    items.forEach(item=>{

        item.classList.remove(

            "active"

        );

    });

    if(selectedIndex>=0){

        items[selectedIndex]

        .classList.add("active");

    }

});

/***************************************************************
 CLOSE AUTOCOMPLETE
****************************************************************/

document.addEventListener(

"click",

(event)=>{

    if(

        !event.target.closest("#name")

        &&

        !event.target.closest("#autocomplete")

    ){

        autocomplete.classList.add(

            "hidden"

        );

    }

});

/***************************************************************
 ATTENDANCE
****************************************************************/

attendanceButtons.forEach(button=>{

    button.addEventListener(

    "click",

    ()=>{

        clearButtons(

            attendanceButtons

        );

        activateButton(button);

        attendanceInput.value=

        button.dataset.value;

        if(

            button.dataset.value===

            "Joyfully Accept"

        ){

            showAcceptFields();

            hideDecline();

        }

        else{

            hideAcceptFields();

            showDecline();

            parkingInput.value="";

            clearButtons(

                parkingButtons

            );

        }

    });

});

/***************************************************************
 PARKING
****************************************************************/

parkingButtons.forEach(button=>{

    button.addEventListener(

    "click",

    ()=>{

        clearButtons(

            parkingButtons

        );

        activateButton(button);

        parkingInput.value=

        button.dataset.value;

    });

});

/***************************************************************
 VALIDATION
****************************************************************/

function validateForm(){

    if(nameInput.value.trim()===""){

        showError(

        "Please enter your name."

        );

        return false;

    }

    if(emailInput.value.trim()===""){

        showError(

        "Please enter your email address."

        );

        return false;

    }

    if(attendanceInput.value===""){

        showError(

        "Please let us know whether you'll be attending."

        );

        return false;

    }

    if(attendanceInput.value==="Joyfully Accept"){

        if(dietInput.value.trim()===""){

            showError(

            "Please tell us your dietary restrictions. If you have none, simply type 'None'."

            );

            return false;

        }

        if(parkingInput.value===""){

            showError(

            "Please let us know whether you'll need parking."

            );

            return false;

        }

    }

    return true;

}

/***************************************************************
 SUCCESS SCREEN
****************************************************************/

function showSuccess(attendance){

    form.style.display="none";

    successScreen.classList.remove("hidden");

    if(attendance==="Joyfully Accept"){

        successText.innerHTML=

        "❤️ Thank you!<br><br>We're absolutely thrilled that you'll be celebrating with us. We can't wait to see you on our special day!";

    }

    else{

        successText.innerHTML=

        "Thank you for letting us know. We'll truly miss celebrating with you, but we sincerely appreciate your response and your warm wishes. ❤️";

    }

}

/***************************************************************
 VERIFICATION SCREEN
****************************************************************/

function showVerification(){

    form.style.display="none";

    verificationScreen.classList.remove("hidden");

}

/***************************************************************
 RESET FORM
****************************************************************/

function resetForm(){

    form.reset();

    attendanceInput.value="";

    parkingInput.value="";

    clearButtons(attendanceButtons);

    clearButtons(parkingButtons);

    hideAcceptFields();

    hideDecline();

    autocomplete.classList.add("hidden");

    verificationMessage.className=

    "verification-message hidden";

    verificationMessage.innerHTML="";

}

/***************************************************************
 PREVENT ACCIDENTAL ENTER SUBMIT
****************************************************************/

document

.querySelectorAll("input")

.forEach(input=>{

    input.addEventListener(

    "keydown",

    (event)=>{

        if(

            event.key==="Enter"

            &&

            input.id!=="name"

        ){

            event.preventDefault();

        }

    });

});

/***************************************************************
 SUBMIT RSVP
****************************************************************/

form.addEventListener(

"submit",

async(event)=>{

    event.preventDefault();

    if(!pageReady){

        showError(

        "Please wait a moment while the guest list finishes loading."

        );

        return;

    }

    if(!validateForm()){

        return;

    }

    submitButton.disabled=true;

    loadingOverlay.classList.remove("hidden");

    const payload={

        name:nameInput.value.trim(),

        email:emailInput.value.trim(),

        attendance:attendanceInput.value,

        allergies:dietInput.value.trim(),

        parking:parkingInput.value,

        song:songInput.value.trim(),

        message:messageInput.value.trim(),

        verified:isVerifiedGuest(

            nameInput.value

        )

    };

    const formData = new URLSearchParams();

    Object.keys(payload).forEach(key=>{

        formData.append(

            key,

            payload[key]

        );

    });

    try{

        const response = await fetch(

            SCRIPT_URL,

            {

                method:"POST",

                body:formData

            }

        );

        const text = await response.text();

        console.log(

            "Apps Script Response:",

            text

        );

        const result = JSON.parse(text);

        loadingOverlay.classList.add("hidden");

        submitButton.disabled=false;

        if(!result.success){

            throw new Error(

                result.error ||

                "Unknown server error."

            );

        }

        if(result.status==="verified"){

            showSuccess(

                payload.attendance

            );

        }

        else{

            showVerification();

        }

    }

    catch(error){

        console.error(error);

        loadingOverlay.classList.add("hidden");

        submitButton.disabled=false;

        showError(

            "Unable to submit your RSVP.\n\n"

            + error.message

        );

    }

});
