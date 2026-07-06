/*****************************************************************
 Wedding RSVP v3.1
*****************************************************************/

/***************************************************************
 CONFIGURATION
****************************************************************/

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyak9lHK36gBg_0zC-megNjc4At4_2aIEzkdgke7v3np6kRZ36wAcfCTynBeWZiswGM/exec";

/***************************************************************
 ELEMENTS
****************************************************************/

const form = document.getElementById("rsvpForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const dietInput = document.getElementById("diet");
const songInput = document.getElementById("song");
const messageInput = document.getElementById("message");

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
 STATE
****************************************************************/

let guestList = [];

let filteredGuests = [];

let selectedIndex = -1;

let pageReady = false;

/***************************************************************
 INITIALIZE
****************************************************************/

window.addEventListener("load", async ()=>{

    hideAcceptFields();

    hideDecline();

    await loadGuestList();

    pageReady = true;

});

/***************************************************************
 LOAD GUEST LIST
****************************************************************/

async function loadGuestList(){

    try{

        const response = await fetch(

            SCRIPT_URL + "?action=guests"

        );

        if(!response.ok){

            throw new Error("Unable to load guest list.");

        }

        guestList = await response.json();

        console.log(

            "Guest list loaded:",

            guestList.length,

            "guests"

        );

    }

    catch(error){

        console.error(error);

        guestList = [];

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

/***************************************************************
 AUTOCOMPLETE
****************************************************************/

function filterGuests(query){

    const search = normalize(query);

    if(search.length < 3){

        filteredGuests = [];

        drawSuggestions();

        return;

    }

    filteredGuests = guestList

        .filter(name=>{

            return normalize(name).includes(search);

        })

        .sort((a,b)=>{

            const aStarts = normalize(a).startsWith(search);
            const bStarts = normalize(b).startsWith(search);

            if(aStarts && !bStarts) return -1;
            if(!aStarts && bStarts) return 1;

            return a.localeCompare(b);

        })

        .slice(0,8);

    drawSuggestions();

}

/***************************************************************
 DRAW SUGGESTIONS
****************************************************************/

function drawSuggestions(){

    autocomplete.innerHTML = "";

    selectedIndex = -1;

    if(filteredGuests.length===0){

        autocomplete.classList.add("hidden");

        return;

    }

    filteredGuests.forEach((guest,index)=>{

        const item = document.createElement("div");

        item.className = "autocomplete-item";

        item.textContent = guest;

        item.addEventListener("mousedown",()=>{

            selectGuest(index);

        });

        autocomplete.appendChild(item);

    });

    autocomplete.classList.remove("hidden");

}

/***************************************************************
 SELECT GUEST
****************************************************************/

function selectGuest(index){

    nameInput.value = filteredGuests[index];

    autocomplete.classList.add("hidden");

    selectedIndex = -1;

}

/***************************************************************
 NAME INPUT
****************************************************************/

nameInput.addEventListener("input",()=>{

    filterGuests(nameInput.value);

});

/***************************************************************
 KEYBOARD NAVIGATION
****************************************************************/

nameInput.addEventListener("keydown",(event)=>{

    const items =
    autocomplete.querySelectorAll(".autocomplete-item");

    if(items.length===0) return;

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

                selectedIndex=items.length-1;

            }

            break;

        case "Enter":

            if(selectedIndex>=0){

                event.preventDefault();

                selectGuest(selectedIndex);

            }

            return;

        case "Escape":

            autocomplete.classList.add("hidden");

            return;

    }

    items.forEach(item=>{

        item.classList.remove("active");

    });

    if(selectedIndex>=0){

        items[selectedIndex]

        .classList.add("active");

    }

});

/***************************************************************
 CLOSE AUTOCOMPLETE
****************************************************************/

document.addEventListener("click",(event)=>{

    if(

        !event.target.closest("#name") &&

        !event.target.closest("#autocomplete")

    ){

        autocomplete.classList.add("hidden");

    }

});

/***************************************************************
 ATTENDANCE
****************************************************************/

attendanceButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        clearButtons(attendanceButtons);

        activateButton(button);

        attendanceInput.value = button.dataset.value;

        if(button.dataset.value==="Joyfully Accept"){

            showAcceptFields();

            hideDecline();

        }

        else{

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

        parkingInput.value = button.dataset.value;

    });

});

/***************************************************************
 VALIDATION
****************************************************************/

function validateForm(){

    if(nameInput.value.trim()===""){

        showError("Please enter your name.");

        return false;

    }

    if(emailInput.value.trim()===""){

        showError("Please enter your email address.");

        return false;

    }

    if(attendanceInput.value===""){

        showError("Please select whether you'll be attending.");

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
 SIMPLE ERROR MESSAGE
****************************************************************/

function showError(message){

    alert(message);

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

}

/***************************************************************
 SHOW SUCCESS
****************************************************************/

function showSuccess(attendance){

    form.style.display="none";

    successScreen.classList.remove("hidden");

    if(attendance==="Joyfully Accept"){

        successText.innerHTML =

        "We're absolutely thrilled you'll be celebrating with us! ❤️<br><br>We can't wait to celebrate with you on our special day.";

    }

    else{

        successText.innerHTML =

        "Thank you so much for letting us know. We'll truly miss celebrating with you, but we sincerely appreciate your response and your well wishes. ❤️";

    }

}

/***************************************************************
 SHOW VERIFICATION
****************************************************************/

function showVerification(){

    form.style.display="none";

    verificationScreen.classList.remove("hidden");

}

/***************************************************************
 SUBMIT RSVP
****************************************************************/

form.addEventListener("submit", async (event)=>{

    event.preventDefault();

    if(!pageReady){

        showError("Please wait a moment while the page finishes loading.");

        return;

    }

    if(!validateForm()) return;

    submitButton.disabled = true;

    loadingOverlay.classList.remove("hidden");

    const payload={

        name:nameInput.value.trim(),

        email:emailInput.value.trim(),

        attendance:attendanceInput.value,

        allergies:dietInput.value.trim(),

        parking:parkingInput.value,

        song:songInput.value.trim(),

        message:messageInput.value.trim()

    };

    try{

        const response = await fetch(

            SCRIPT_URL,

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(payload)

            }

        );

        if(!response.ok){

            throw new Error(

                "HTTP " + response.status

            );

        }

        const text = await response.text();

        console.log("Apps Script Response:", text);

        let result;

        try{

            result = JSON.parse(text);

        }

        catch(error){

            throw new Error(

                "Apps Script returned invalid JSON.\n\n"

                + text

            );

        }

        loadingOverlay.classList.add("hidden");

        submitButton.disabled=false;

        if(!result.success){

            throw new Error(

                result.error ||

                "Unknown Apps Script error."

            );

        }

        if(result.status==="verified"){

            showSuccess(payload.attendance);

        }

        else{

            showVerification();

        }

    }

    catch(error){

        loadingOverlay.classList.add("hidden");

        submitButton.disabled=false;

        console.error(error);

        showError(

            "Unable to submit your RSVP.\n\n"

            + error.message +

            "\n\n(Open F12 → Console if you're testing.)"

        );

    }

});

/***************************************************************
 PREVENT ENTER SUBMIT
****************************************************************/

document

.querySelectorAll("input")

.forEach(input=>{

    input.addEventListener("keydown",(event)=>{

        if(

            event.key==="Enter"

            &&

            input.id!=="name"

        ){

            event.preventDefault();

        }

    });

});
