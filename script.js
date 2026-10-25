const form = document.getElementById("FormLogger");
const timeIn = document.getElementById("In-Time");
const timeOut = document.getElementById("Out-Time");
const TotalTime = document.getElementById("total-time");
const tBody = document.getElementById("attendance-records");

let formValues = [];
let RawSTime = [];
let RawETime = [];
let STime;
let ETime;
let STotal;
let ETotal;
let duration;
timeIn.addEventListener("change", () => {

    RawSTime = timeIn.value.split(":"); // [17], [50]
    STime = RawSTime.join(""); // "1750"
    CalculateTime();
    
});

timeOut.addEventListener("change", () => {

    RawETime = timeOut.value.split(":");
    ETime = RawETime.join("");
    CalculateTime();
});

function CalculateTime()
{

    if (!timeIn.value  || !timeOut.value) 
    {
        console.log("Some Time is Empty! ");
        return;
    }
    const [sHours,sMinutes] = timeIn.value.split(":").map(Number);
    const [eHours,eMinutes] = timeOut.value.split(":").map(Number);

    STotal = (sHours * 60) + sMinutes;
    ETotal = (eHours * 60) + eMinutes;

    if (STotal < 420 || STotal > 960 
        || ETotal <420 || ETotal > 960)
    {
        console.log("Time must be between 7 AM and 4 PM");
        TotalTime.value = "Invalid Time!";
        return;
    }

    duration = ETotal - STotal

    const hours = Math.floor(duration/60);
    const minutes = duration % 60;
   

    
    let timeMessage = ` ${hours} h:${minutes} m`;

 TotalTime.value = timeMessage;
}



if (form != null)
{
form.addEventListener("submit", (event) => {
    event.preventDefault();
    captureInputs()
    console.log(timeIn)
});
}
else 
{
    alert("Form is null!");
    console.log(form);

}

function captureInputs()
{
    let formData = new FormData(form);
    let valuesArray = Array.from(formData.values())

    valuesArray.forEach((value) => {
        formValues.push(value);
    });

    addTable();

}

function addTable()
{

  
    let row = document.createElement("tr"); // needs 6 tds
    tBody.appendChild(row);


    formValues.forEach((value) => {
        let newTd = document.createElement("td");
        newTd.textContent = value;
        row.appendChild(newTd);

    });
    formValues.splice(0, formValues.length);
}