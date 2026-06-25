const API = "http://localhost:3000"
// import { appointmentAPI } from "./api.js";

// $(document).ready(()=>{
//     console.log("webapge ready");
// })

async function addAppointment(){
    try{

        $('#patientnumber').on("input blur",function(){
            const value = $(this).val();
            const numberRegex = /^[6-9]\d{9}$/
            if(numberRegex.test(value)){
                $('#numberErrorMsg').text("Correct")
            }
            else{
                $('#numberErrorMsg').text("")
            }
        })

        // console.log(new Date());
        


        const patient_name = $('#patientname').val().trim()
        const patient_age = $('#patientage').val().trim()
        const patient_gender = $('#gender').val().trim()
        const patient_number = $('#patientnumber').val().trim()
        const reason = $('#reason').val().trim()
        const assigned_doctor = $('#doctors').val().trim()
        const appointment_date = $('#appointedDate').val().trim()
        const appointment_time = $('#time').val().trim()
        
        const status = "Appointed";
        // console.log(patient_gender,assigned_doctor,appointment_date,appointment_time);
        const appointment_data = {patient_name,patient_age,patient_gender,patient_number,assigned_doctor,reason,appointment_date,appointment_time,status}

        
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
    catch(e){
        console.error(e)
    }
}

async function getAppointments(){
    const response = await fetch(`${API}/appointments`)
    const data =await response.json()
    console.log(data);
    
    showAppointments(data)
}

function showAppointments(data){
    // e.preventDefault()
    // $('#workspace').text(" ")
    data.forEach(appointments=>
        $('#table-content').append(`
                        <tr>
                            <td>1</td>
                            <td>${appointments.patient_name}</td>
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