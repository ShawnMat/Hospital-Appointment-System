const API = "http://localhost:3000"
// import { appointmentAPI } from "./api.js";
const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser')
)

if (!loggedInUser) {
    window.location.replace('/pages/Patientlogin.html')
}
const today = new Date();
const now = today.toISOString().split('T')[0];
// sampleDate = "2026/"
console.log(now)
// console.log(today.toLocaleDateString())
let editID = null;
let allAppointments=[]
// $('#search').input("input blur",
//     allAppointments.forEach(appointment=>{
//         if($(this).val()== appointment.assigned_doctor)
//     })
// )




async function addAppointment(){
    try{
        const reason = $('#reason').val().trim()
        const assigned_doctor = $('#doctors').val().trim()
        const appointment_date = $('#appointedDate').val().trim()
        const appointment_time = $('#time').val().trim()
        const status = "Requested";
        const isDeleted = false
        // console.log(patient_gender,assigned_doctor,appointment_date,appointment_time);
        if(!reason || !assigned_doctor || !appointment_date || !appointment_time){
            console.log("Input is required");   
            if(!reason){
                console.log("Input Reason Required");
                $('#reasonError').text("Input Required").addClass('errorMsg')
            }
            if (!assigned_doctor){
                console.log("Input assigned Doctor Required");
                $('#doctorError').text("Input Required").addClass('errorMsg')
            }
            // for date validation, we need to add the time slot of the current date (NEED TO DO)
            if (!appointment_date){
                console.log("Input Appointed Date cannot be before today's date");
                $('#dateError').text("Input Required").addClass('errorMsg')
            }
            if (!appointment_time){
                console.log("Input appointment Time Required");
                $('#timeError').text("Input Required").addClass('errorMsg')
            }

        }
        else{
        
            const appointment_data = {assigned_doctor,reason,appointment_date,appointment_time,status,isDeleted}

            
            await fetch(`${API}/appointments`,{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(appointment_data)
            })
            const modal = bootstrap.Modal.getInstance(document.getElementById("createAppointmentModal"))
            modal.hide()
            getAppointments()
        }
    }
    catch(e){
        console.error(e)
    }
}

async function getAppointments(){
    const response = await fetch(`${API}/appointments`)
    const data =await response.json()
    showAppointments(data)
}

function showAppointments(data){
    $('#table-content').empty()
        data.reverse().forEach(appointments=>{
            // allAppointments.push(appointments)
            if(appointments.isDeleted == false){
                $('#table-content').append(`
                                <tr>
                                    <td>1</td>
                                    <td>${appointments.reason}</td>
                                    <td>${appointments.assigned_doctor}</td>
                                    <!-- <td>25th June 2026</td> -->
                                    <td>${appointments.appointment_date}</td>
                                    <td>${appointments.appointment_time}</td>
                                    <!-- <td>${appointments.status}</td> -->
                                    <td><span class="status">${appointments.status}</span></td>
                                    <td>${appointments.TokenNumber}</td>
                                    <td>
                                        <button id="editBtn" class="btn" onclick="editAppointments('${appointments.id}')">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button id="deleteBtn" class="btn" onclick="deleteAppointments('${appointments.id}')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                    `)
            }}
        )
        counters();
}

// counters function
async function counters(){
    const task = await fetch(`${API}/appointments`)
    const data = await task.json()  
    console.log(data);
     
    const visitCount = data.filter(appointments=>
        appointments.status === "Visited" && appointments.isDeleted === false
    ).length
    const appointCount = data.filter(appointments=>
        appointments.status == "Appointed" && appointments.isDeleted === false
    ).length
    const reqCount = data.filter(appointments=>
        appointments.status == "Requested" && appointments.isDeleted === false
    ).length
    const missCount = data.filter(appointments=>
        appointments.status == "Missed" && appointments.isDeleted === false
    ).length

    $('#visitedCount').text(visitCount)
    $('#appointedCount').text(appointCount)
    $('#requestedCount').text(reqCount)
    $('#missedCount').text(missCount)
    
}





async function deleteAppointments(id){
    await fetch(`${API}/appointments/${id}`,{
        method: "PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "isDeleted" : true
        }
        )
    })
    getAppointments();
}

async function editAppointments(id){
    editID = id;
    const task = await fetch(`${API}/appointments/${id}`)
    const data = await task.json()

    $('#editReason').val(data.reason)
    $('#editDoctors').val(data.assigned_doctor)
    $('#editAppointedDate').val(data.appointment_date)
    $('#editTime').val(data.appointment_time)


    const modal = new bootstrap.Modal(document.getElementById("editAppointmentModal"))
    modal.show()
}




async function updateAppointments(){
    const reason = $('#editReason').val().trim()
    const assigned_doctor = $('#editDoctors').val().trim()
    const appointment_date = $('#editAppointedDate').val().trim()
    const appointment_time = $('#editTime').val().trim()


    const appointmentData = {reason,assigned_doctor,appointment_date,appointment_time}
    await fetch(`${API}/appointments/${editID}`,{
        method: "PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(appointmentData)
    })
    getAppointments();

}


async function filterAppointments(){
    const task = await fetch(`${API}/appointments`)
    const data = await task.json()  
    console.log(data);
    data.forEach(values=>{
        
        if(values.status === "Visited" && values.isDeleted === false){
            showFilterAppointments(values)
        }
        else if(values.status === "Requested" && values.isDeleted === false){
            showFilterAppointments(values)
        }
        else if(values.status === "Appointed" && values.isDeleted === false){
            showFilterAppointments(values)
        }
        else if(values.status === "Missed" && values.isDeleted === false){
            showFilterAppointments(values)
        }
    })

    function showFilterAppointments(values){
        let sno = 1;
    
        $('#table-content').empty()
        $('#table-content').append(`
                                <tr>
                                    <td>1</td>
                                    <td>${values.reason}</td>
                                    <td>${values.assigned_doctor}</td>
                                    <!-- <td>25th June 2026</td> -->
                                    <td>${values.appointment_date}</td>
                                    <td>${values.appointment_time}</td>
                                    <!-- <td>${values.status}</td> -->
                                    <td><span class="status">${values.status}</span></td>
                                    <td>
                                        <button id="editBtn" class="btn" onclick="editAppointments('${values.id}')">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                        <button id="deleteBtn" class="btn" onclick="deleteAppointments('${values.id}')">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
        `)
        sno += 1
    }    
}


$('#modalEditBtn').click(function(e){
    updateAppointments();
})

$('#createBtn').click(function(e){
    // e.preventDefault();
    addAppointment();
})
$('#appointedDate').attr('min',now)

// $('#filter').click(()=>{
//     filterAppointments()
// })

$('#filter').click(()=>{
    $('.filterContents').toggleClass('show')
})

$('#logoutBtn').click(function () {
    localStorage.clear()
    window.location.replace('/pages/PatientLogin.html');

});

getAppointments()