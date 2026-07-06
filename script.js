/*****************************************************************
 Wedding RSVP v3.1
*****************************************************************/

/***************************************************************
 CONFIGURATION
****************************************************************/

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbz5rNRi72JPB9YWSWVeIV-jywbtsb2gop9AK1dNNBJ-Ew27cMslbtgitb545tRSGElc/exec";

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
