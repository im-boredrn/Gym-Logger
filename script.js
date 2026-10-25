const form = document.getElementById("FormLogger");

const timeIn = document.getElementById("In-Time");
const timeOut = document.getElementById("Out-Time");
const TotalTime = document.getElementById("total-time");

const tBody = document.getElementById("attendance-records");


let STotal;
let ETotal;
let duration;
let invalidForm = false;

let serialized;

let records = []

tBody.replaceChildren();

loadRows();

timeIn.addEventListener("change", () => {

    CalculateTime();
    
});

timeOut.addEventListener("change", () => {

    CalculateTime();
});

function CalculateTime()
{

    if (!timeIn.value  || !timeOut.value) 
    {
        console.log("Some Time is Empty! ");
        TotalTime.value = "Incomplete"
        invalidForm = true;
        return;
    }
    const [sHours,sMinutes] = timeIn.value.split(":").map(Number);
    const [eHours,eMinutes] = timeOut.value.split(":").map(Number);

    STotal = (sHours * 60) + sMinutes;
    ETotal = (eHours * 60) + eMinutes;




   if (validifyTime(STotal,ETotal)) return;

    duration = ETotal - STotal

    const hours = Math.floor(duration/60);
    const minutes = duration % 60;
   

    
    let timeMessage = ` ${hours} h:${minutes} m`;

 TotalTime.value = timeMessage;
}

function validifyTime(STotal, ETotal)
{

     if (STotal < 420 || STotal > 960 
        || ETotal <420 || ETotal > 960
        || STotal > ETotal )
    {
        console.log("Time must be between 7 AM and 4 PM");
        TotalTime.value = "Invalid Time!";
        invalidForm = true;
        return true;
    }
    else 
    {
        invalidForm = false;
        return false;
    }
}



if (form != null )
{
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (invalidForm != true)
    {
     captureInputs()
     console.log(timeIn)
    }
    else alert("Invalid Form");
});
}
else 
{
    alert("Form is Null");
    console.log(form);

}

function captureInputs()
{
    let formData = new FormData(form);
    let valuesArray = Array.from(formData.values())
    let formValues = [];

    valuesArray.forEach((value) => {
        formValues.push(value);
    });

    addTable(formValues);

   //  serialized = JSON.stringify(formValues); //saves vals
   //  localStorage.setItem('formData', serialized);

     saveRecords(formValues);
}

function addTable(formValues)
{

  
    let row = document.createElement("tr"); 
    tBody.appendChild(row);


    formValues.forEach((value) => {
        let newTd = document.createElement("td");
        newTd.textContent = value;
        row.appendChild(newTd);

    });

}

function saveRecords(record)
{
    records.push(record); // receives 1 record but loses the pushed records on reload.
    console.log(records);

    localStorage.setItem('attendance-records', JSON.stringify(records));
}

function loadRows() 
{
    //const saved = JSON.parse(localStorage.getItem('formData')) || [];
    const retrievedRecords = JSON.parse(localStorage.getItem('attendance-records')) || [];

    records = retrievedRecords;

    retrievedRecords.forEach(record => {
        addTable(record);
    });

   // addTable(saved);
}