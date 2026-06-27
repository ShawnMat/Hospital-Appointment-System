const API = "http://localhost:3000"
const today = new Date().toISOString().split('T')[0];
const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser')
)

if (!loggedInUser) {
    window.location.replace('/pages/AdminLogin.html')
}
// need to add localstorage


// const lastReset = localStorage.getItem("lastResetDate");
// if (lastReset !== today) {
//     await resetDay();
//     localStorage.setItem("lastResetDate", today);
// }
let token = 0;

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
    
        data.reverse().forEach(appointments=>{
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

async function doctorToken(doc) {
    const response = await fetch(`${API}/doctors?doctor_name=${doc}`);
    const doctorData = await response.json();

    const doctor = doctorData[0];

    if (!doctor) {
        console.log("Doctor not found");
        return false;
    }

    if (doctor.Tokens <= 0) {
        console.log("Token limit reached");
        return false;
    }

    await fetch(`${API}/doctors/${doctor.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Tokens: doctor.Tokens - 1
        })
    });

    return true;
}
async function resetDoctorTokens() {
    const response = await fetch(`${API}/doctors`);
    const doctors = await response.json();

    for (const doctor of doctors) {
        await fetch(`${API}/doctors/${doctor.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Tokens: 20
            })
        });
    }

    console.log("All doctor tokens reset to 20");
}
async function resetDay() {
    await resetDoctorTokens();
    console.log("System reset completed");
}
// console.log(sampleDataValue);
async function getNextToken() {
    const response = await fetch(`${API}/appointments?status=Appointed`);

    const appointedPatients = await response.json();

    return appointedPatients.length + 1;
}

async function approvedAppointments(id){
    const task = await fetch(`${API}/appointments/${id}`)
    const data = await task.json()
    // console.log(data)
    // doctorToken(id)
    
    const success = await doctorToken(data.assigned_doctor);
    if (!success) {
        alert("Doctor token limit reached");
        return;
    }

    const nextToken = await getNextToken();

    // CAN I CHECK THE CONDITION WHERE THE TOKEN EXCEEDS 20 COUNT??

    await fetch(`${API}/appointments/${id}`,{
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(
                    {
                        "status" : "Appointed",
                        "TokenNumber" : nextToken
                    }
                )
            })
}


function showFilters(filters) {
    console.log(filters);
    $('#tableContent').empty()
    
    filters.reverse().forEach(appointments=>{
            // allAppointments.push(appointments)
                // console.log(appointments.id);
                console.log(appointments.TokenNumber);
                
                
                $('#tableContent').append(`
                            <tr>
                                <td>${appointments.TokenNumber}</td>
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
                    
            }
        )
        console.log(filters);

}




async function filters(value){
    // const statusFilter = $('#statusFilter').val()
    // const doctorFilter = $('#doctorFilter').val()
    // const createdDateFilter = $('#createdDateFilter').val()

    const task = await fetch(`${API}/appointments`)
    const data = await task.json()
    
    showFilters(data,value)


    // data.reverse().forEach(appointments=>{
    //         // allAppointments.push(appointments)
    //         if(appointments.status == statusFilter && appointments.assigned_doctor == doctorFilter && appointments.CreatedDate == createdDateFilter && appointments.isDeleted === false){
    //             console.log(appointments.id);
                
    //             $('#tableContent').append(`
    //                         <tr>
    //                             <td>1</td>
    //                             <td>${appointments.PatientName}</td>
    //                             <td>${appointments.PatientAge}</td>
    //                             <td>${appointments.PatientGender}</td>
    //                             <td>${appointments.reason}</td>
    //                             <td>${appointments.assigned_doctor}</td>
    //                             <!-- <td>25th June 2026</td> -->
    //                             <td>${appointments.appointment_date}</td>
    //                             <td>${appointments.appointment_time}</td>
    //                             <!-- <td>${appointments.status}</td> -->
    //                             <td><span class="status">${appointments.status}</span></td>
    //                             <td>
    //                                 <button id="checkBtn" class="btn" onclick = "approvedAppointments('${appointments.id}')" >
    //                                     <i class="bi bi-check2-circle"></i>
    //                                 </button>
    //                                 <button id="rejectBtn" class="btn" onclick="rejectAppointments('${appointments.id}')">
    //                                     <i class="bi bi-x-circle"></i>
    //                                 </button>
    //                             </td>
    //                         </tr>
    //                 `)
    //                 console.log(appointments);
                    
    //         }}
    //     )
    }



$('#statusFilter').change(async function(){
    
    let value = $(this).val()
    const task = await fetch(`${API}/appointments?status=${value}`)
    const data = await task.json()
    showFilters(data)
}
)
$('#doctorFilter').change(async function(){
    
    let value = $(this).val()
    const task = await fetch(`${API}/appointments?assigned_doctor=${value}`)
    const data = await task.json()
    showFilters(data)
}
)
// $("#filters").on("input",{
//     const status = $(this).val()
// })
$('#logoutBtn').click(function () {
    localStorage.clear()
    window.location.replace('/pages/Login.html');
});
getAppointments()