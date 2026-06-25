const API = "http://localhost:3000"
// import { appointmentAPI } from "./api.js";
const today = new Date();
const now = today.toISOString().split('T')[0];

async function addAppointment(){
    try{
        // console.log(new Date());

        // const patient_name = $('#patientname').val().trim()
        // const patient_age = $('#patientage').val().trim()
        // const patient_gender = $('#gender').val().trim()
        // const patient_number = $('#patientnumber').val().trim()
        const reason = $('#reason').val().trim()
        const assigned_doctor = $('#doctors').val().trim()
        const appointment_date = $('#appointedDate').val().trim()
        const appointment_time = $('#time').val().trim()
        
        const status = "Requested";
        
        // console.log(patient_gender,assigned_doctor,appointment_date,appointment_time);
        if(!reason || !assigned_doctor || !appointment_date || !appointment_time){
            console.log("Input is required");   
            if(!reason){
                console.log("Input Reason Required");
                $('#reasonError').text("Input Required").addClass('errorMsg')
            }
            else if (!assigned_doctor){
                console.log("Input assigned Doctor Required");
                $('#doctorError').text("Input Required").addClass('errorMsg')
            }
            // for date validation, we need to add the time slot of the current date (NEED TO DO)
            else if (!appointment_date  ){
                console.log("Input Appointed Date cannot be before today's date");
                $('#dateError').text("Input Required").addClass('errorMsg')
            }
            else if (!appointment_time){
                console.log("Input appointment Time Required");
                $('#timeError').text("Input Required").addClass('errorMsg')
            }

        }
        else{
        
            const appointment_data = {assigned_doctor,reason,appointment_date,appointment_time,status}

            
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
    // console.log(data);
    
    showAppointments(data)
}

function showAppointments(data){
    // e.preventDefault()
    // $('#workspace').text(" ")
    data.forEach(appointments=>
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
                            <td>
                                <button class="btn">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
            `)
    )
}









$('#createBtn').click(function(e){
    // e.preventDefault();
    addAppointment();
})

getAppointments()