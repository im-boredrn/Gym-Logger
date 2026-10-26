const form = document.getElementById("FormLogger");

const timeIn = document.getElementById("In-Time");
const timeOut = document.getElementById("Out-Time");
const TotalTime = document.getElementById("total-time");

const tBody = document.getElementById("attendance-records");

const displaySetting = document.getElementById('display-limit');

let STotal;
let ETotal;
let duration;
let invalidForm = false;

let serialized;

let allRecords = []

let displayLimit = document.getElementById('display-limit').value // 0,1,2,3


createListeners();

tBody.replaceChildren(); // clear rows

allRecords = loadRecords();
displayRecords(selectRecords(allRecords))




function CalculateTime() // input : time in, Output: TotalTime value
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

function validifyTime()
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





function captureRecord() // input : form , output : formValues array
{
    let formData = new FormData(form);
    let valuesArray = Array.from(formData.values())
    let formValues = [];

    valuesArray.forEach((value) => {
        formValues.push(value);
    });

    return formValues;

   
}

function addRecord(formValues) // inputs : tbody, formValues, output : new record in document
{
    let row = document.createElement("tr"); 
    tBody.appendChild(row);


    formValues.forEach((value) => {
        let newTd = document.createElement("td");
        newTd.textContent = value;
        row.appendChild(newTd);

    });

}

function selectRecords(recordCollection = []) // inputs : [records, selectedRecords], outputs: [selectedRecords[new vals]]
{
    let lowerRange = recordCollection.length - displayLimit; 
    
    // slice is exclusive of end index so I need to up it by 1
    let upperRange = recordCollection.length + 1;

    if (lowerRange <0 ) lowerRange = 0;
    let selectedRecords = recordCollection.slice(lowerRange,upperRange)

    return  selectedRecords;
}

function displayRecords(recordCollection = []) 
{

    tBody.replaceChildren();

    recordCollection.forEach(record => {
        addRecord(record);
    });

}




function clearRecords() // Inputs : [records,tbody] | Output : [wiped logs]
{
    allRecords = [];
    tBody.replaceChildren();
    localStorage.removeItem('attendance-records');
    console.log(allRecords);
}

function saveRecords(record) // Inputs : [records, a single record] | Outputs: [saved Records]
{
    allRecords.push(record); // receives 1 record but loses the pushed records on reload.
    console.log(allRecords);

    localStorage.setItem('attendance-records', JSON.stringify(allRecords));
}

function loadRecords() // Inputs : [records, add record()] | Output : [Adds saved records.]
{
    const retrievedRecords = JSON.parse(localStorage.getItem('attendance-records')) || [];
    return retrievedRecords;

}

const wipe = document.getElementById('wipe');

wipe.addEventListener("click", () =>
{
    clearRecords();
  
    alert("All Records Wiped!");
})


function createListeners()
{

    displaySetting.addEventListener("change", () => {

        if (displaySetting.value <1 || displaySetting.value >20) 
            {
                alert('out of bounds!')
                displaySetting.value = 1
            }

        displayLimit = Number(displaySetting.value)
        displayRecords(selectRecords(allRecords));


    })
 timeIn.addEventListener("change", () => {

    CalculateTime();
    
});

timeOut.addEventListener("change", () => {

    CalculateTime();
});
   
if (form != null )
{
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validifyTime())
    {
        let capturedRecord = captureRecord();

      saveRecords(capturedRecord);
      displayRecords(selectRecords(allRecords));
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

}
