// =====================================================
// CONFIGURATION
// =====================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFKip6tu0Qx5h2qX_lyBznJ5DrLcvCdHZVN0xhiguTx8GESDDO0nOYNLHTeKzEj12E/exec";


// =====================================================
// ELEMENTS
// =====================================================

const form = document.getElementById("rsvpForm");

const attendanceInput = document.getElementById("attendance");
const parkingInput = document.getElementById("parking");

const acceptFields = document.getElementById("acceptFields");
const declineMessage = document.getElementById("declineMessage");

const attendanceButtons = document.querySelectorAll(".attendance-btn");
const parkingButtons = document.querySelectorAll(".parking-btn");

const loadingOverlay = document.getElementById("loadingOverlay");

const successScreen = document.getElementById("successScreen");
const successText = document.getElementById("successText");

const submitButton = document.getElementById("submitButton");

const dietField = document.getElementById("diet");
const songField = document.getElementById("song");
const messageField = document.getElementById("message");


// =====================================================
// INITIAL STATE
// =====================================================

acceptFields.classList.add("hidden");
declineMessage.classList.add("hidden");


// =====================================================
// HELPER FUNCTIONS
// =====================================================

function clearButtonGroup(buttons){

    buttons.forEach(btn=>{

        btn.classList.remove("active");

    });

}


function showAcceptFields(){

    acceptFields.classList.remove("hidden");

    declineMessage.classList.add("hidden");

}


function showDeclineMessage(){

    acceptFields.classList.add("hidden");

    declineMessage.classList.remove("hidden");

}


// =====================================================
// ATTENDANCE BUTTONS
// =====================================================

attendanceButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        clearButtonGroup(attendanceButtons);

        button.classList.add("active");

        attendanceInput.value = button.dataset.value;

        if(button.dataset.value === "Joyfully Accept"){

            showAcceptFields();

        }else{

            showDeclineMessage();

            parkingInput.value = "";
            clearButtonGroup(parkingButtons);

        }

    });

});


// =====================================================
// PARKING BUTTONS
// =====================================================

parkingButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        clearButtonGroup(parkingButtons);

        button.classList.add("active");

        parkingInput.value = button.dataset.value;

    });

});


// =====================================================
// VALIDATION
// =====================================================

function validateForm(){

    if(form.name.value.trim()===""){

        alert("Please enter your name.");

        return false;

    }

    if(form.email.value.trim()===""){

        alert("Please enter your email address.");

        return false;

    }

    if(attendanceInput.value===""){

        alert("Please select whether you'll be attending.");

        return false;

    }

    if(attendanceInput.value==="Joyfully Accept"){

        if(dietField.value.trim()===""){

            alert("Please tell us about your food allergies or dietary restrictions. If none, simply type 'None'.");

            return false;

        }

        if(parkingInput.value===""){

            alert("Please let us know whether you need parking.");

            return false;

        }

    }

    return true;

}


// =====================================================
// SUBMIT
// =====================================================

form.addEventListener("submit", async function(e){

    e.preventDefault();

    if(!validateForm()) return;

    submitButton.disabled = true;

    loadingOverlay.classList.remove("hidden");

    const data = {

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        attendance: attendanceInput.value,

        allergies: dietField.value.trim(),

        parking: parkingInput.value,

        song: songField.value.trim(),

        message: messageField.value.trim()

    };

    try{

        const response = await fetch(SCRIPT_URL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(data)

        });

        if(!response.ok){

            throw new Error("Server Error");

        }

        loadingOverlay.classList.add("hidden");

        form.style.display="none";

        successScreen.classList.remove("hidden");

        if(attendanceInput.value==="Joyfully Accept"){

            successText.innerHTML =
            "Thank you for your RSVP!<br><br>We can't wait to celebrate with you! ❤️";

        }else{

            successText.innerHTML =
            "Thank you for letting us know.<br><br>We'll miss celebrating with you, but we're grateful for your response. ❤️";

        }

        form.reset();

        attendanceInput.value="";
        parkingInput.value="";

        clearButtonGroup(attendanceButtons);
        clearButtonGroup(parkingButtons);

    }

    catch(error){

        loadingOverlay.classList.add("hidden");

        submitButton.disabled=false;

        alert("Oops! Something went wrong while saving your RSVP. Please try again.");

        console.error(error);

    }

});


// =====================================================
// NICE LITTLE TOUCH
// =====================================================

document.querySelectorAll("input, textarea").forEach(field=>{

    field.addEventListener("keypress",(e)=>{

        if(e.key==="Enter" && field.tagName!=="TEXTAREA"){

            e.preventDefault();

        }

    });

});
