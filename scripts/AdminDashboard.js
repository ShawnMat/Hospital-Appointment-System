const API = "http://localhost:3000"
const today = new Date();
const now = today.toISOString().split('T')[0];
let token = 0;
// let tokenLimit = 20;
console.log(now)
let sampleDataValue = "";

// Get Appointments

async function getAppointments(){
    const response = await fetch(`${API}/appointments`)
    const data =await response.json()
    console.log(data);
    showAppointments(data)
}

// Display Appointments

function showAppointments(data){
    // e.preventDefault()
    // $('#workspace').text(" ")
    try{
        console.log(data);
    
        data.forEach(appointments=>{
            // allAppointments.push(appointments)
            if(appointments.status == "Requested" && appointments.isDeleted === false){
                console.log(appointments.id);
                
                $('#tableContent').append(`
                            <tr>
                                <td>1</td>
                                <td>${appointments.PatientName}</td>
                                <td>${appointments.PatientAge}</td>
                                <td>${appointments.PatientGender}</td>
                                <td>${appointments.reason}</td>
                                <td>${appointments.assigned_doctor}</td>
                                <!-- <td>25th June 2026</td> -->
                                <td>${appointments.appointment_date}</td>
                                <td>${appointments.appointment_time}</td>
                                <!-- <td>${appointments.status}</td> -->
                                <td><span class="status">${appointments.status}</span></td>
                                <td>
                                    <button id="checkBtn" class="btn" onclick = "approvedAppointments('${appointments.id}')" >
                                        <i class="bi bi-check2-circle"></i>
                                    </button>
                                    <button id="rejectBtn" class="btn" onclick="rejectAppointments('${appointments.id}')">
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                </td>
                            </tr>
                    `)
                    console.log(appointments);
                    
            }}
        )
        // counters();
    }
    catch(e){
        console.log(e)
    }
    
}


async function rejectAppointments(id){
    const task = await fetch(`${API}/appointments/${id}`)
    const data = await task.json()

    const modal = new bootstrap.Modal(document.getElementById("rejectAppointmentModal"))
    modal.show()
}

async function doctorToken(doc){
    // setTimeout(()=>{
    //     console.log(data);
    // },10000)
   
    // sampleDataValue = data;
    const response = await fetch(`${API}/doctors?doctor_name=${doc}`)
    const doctorData = await response.json()

    const doctorTokens = doctorData.Tokens
    if(doctorTokens < 1){
        console.log("Token Limit Reached! Cannot assign anymore patiens to this Doctor");   
    }
    else{
        doctorTokens -= 1
        await fetch(`${API}/doctors?doctor_name=doc`,{
            method: "PATCH",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {
                    "Tokens" : doctorTokens
                }
            )
        })

    }
    
    
}
// console.log(sampleDataValue);


async function approvedAppointments(id){
    const task = await fetch(`${API}/appointments/${id}`)
    const data = await task.json()
    // console.log(data)
    // doctorToken(id)
    token +=1

    // CAN I CHECK THE CONDITION WHERE THE TOKEN EXCEEDS 20 COUNT??

    if(data.assigned_doctor === "AsokKumar"){
        let doc = data.assigned_doctor
        doctorToken(doc)
    }
    else if(data.assigned_doctor === "DavidJames"){
        let doc = data.assigned_doctor
        doctorToken(doc)
    }
    else if(data.assigned_doctor === "SophiaPrince"){
        let doc = data.assigned_doctor
        doctorToken(doc)
    }
    await fetch(`${API}/appointments/${id}`,{
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(
                    {
                        "status" : "Appointed",
                        "TokenNumber" : token
                    }
                )
            })
    // data.status = "Appointed"
    // console.log(data.status)
    
}

getAppointments()

