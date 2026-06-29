const API = "http://localhost:3000"
// import { appointmentAPI } from "./api.js";
const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser')
)



let currentUserName = loggedInUser.firstName + " " + loggedInUser.middleName +" " +loggedInUser.lastName
let currentUserAge = loggedInUser.age 
let currentUserGender = loggedInUser.gender 
let loggedinID = loggedInUser.id
console.log(currentUserName);

// console.log(currentUloggedInUser.PatientAge,loggedInUser(PatientGenderser));
if (!loggedInUser) {
    window.location.replace('/pages/Patientlogin.html')
}

$('#greetings').text(loggedInUser.firstName)

const today = new Date();
const now = today.toISOString().split('T')[0];
const createdDate = new Date().toISOString().split('T')[0];
console.log(now)
// console.log(today.toLocaleDateString())
let editID = null;
let allAppointments=[]




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
            
            
            
            const appointment_data = {currentUserName,currentUserAge,currentUserGender,assigned_doctor,reason,appointment_date,appointment_time,status,isDeleted,createdDate}

            
            await fetch(`${API}/appointments?currentUserName=${currentUserName}`,{
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
    try{
        // dobt below
        // const response = await fetch(`${API}/appointments?_sort=CreatedDate&_order=asc`)
        const response = await fetch(`${API}/appointments?currentUserName=${currentUserName}`)
        
        const data =await response.json()
        console.log(data);
        showAppointments(data)
    }
    catch(e){
        console.error(e)
    }
}

function showAppointments(data){
    try{
        
                        $('#tableContent').empty();
                        let sno = 1; 
                        data.forEach(appointments => {
                            if(!appointments.isDeleted){
                                $('#tableContent').append(`
                                    <tr>
                                        <td>${sno++}</td>
                                        <td>${appointments.currentUserName}</td>
                                        <td>${appointments.currentUserAge}</td>
                                        <td>${appointments.currentUserGender}</td>
                                        <td>${appointments.reason}</td>
                                        <td>${appointments.assigned_doctor}</td>
                                        <!-- <td>25th June 2026</td> -->
                                        <td>${appointments.appointment_date}</td>
                                        <td>${appointments.appointment_time}</td>
                                        <!-- <td>${appointments.status}</td> -->
                                        <td><span class="status">${appointments.status}</span></td>
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
                }
        })
            counters();
    }
    catch(e){
        console.error(e)
    }
}

// counters function
async function counters(){
    const task = await fetch(`${API}/appointments?currentUserName=${currentUserName}`)
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
    console.log(data);
    
    $('#visitedCount').text(visitCount)
    $('#appointedCount').text(appointCount)
    $('#requestCount').text(reqCount)
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
    const task = await fetch(`${API}/appointments?currentUserName=${currentUserName}`)
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
                                    <td>${values.currentUserName}</td>
                                    <td>${values.currentUserAge}</td>
                                    <td>${values.currentUserGender}</td>
                                    <td>${values.reason}</td>
                                    <td>${values.assigned_doctor}</td>
                                    <!-- <td>25th June 2026</td> -->
                                    <td>${values.appointment_date}</td>
                                    <td>${values.appointment_time}</td>
                                    <!-- <td>${values.status}</td> -->
                                    <td><span class="status">${values.status}</span></td>
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
        sno += 1
    }    
}
function showFilters(filters) {
    console.log(filters);
    $('#tableContent').empty()
    
    filters.forEach(appointments=>{
                console.log(appointments.currentUserName);
                
                
                $('#tableContent').append(`
                            <tr>
                                <td>${appointments.TokenNumber || "-"}</td>
                                <td>${appointments.currentUserName}</td>
                                <td>${appointments.currentUserAge}</td>
                                <td>${appointments.currentUserGender}</td>
                                <td>${appointments.reason}</td>
                                <td>${appointments.assigned_doctor}</td>
                                <!-- <td>25th June 2026</td> -->
                                <td>${appointments.appointment_date}</td>
                                <td>${appointments.appointment_time}</td>
                                <!-- <td>${appointments.status}</td> -->
                                <td><span class="status">${appointments.status}</span></td>
                                <td>
                                    <button id="editBtn" class="btn bg-warning" onclick="editAppointments('${appointments.id}')">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button id="deleteBtn" class="btn bg-danger" onclick="deleteAppointments('${appointments.id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                    `)
                    console.log(appointments);
                    
            }
        )
        console.log(filters);

}

function showProfileData(data){
    console.log(data);
    // $('#tableContent').empty()
    
    data.forEach(patient=>{
                // console.log(patient.TokenNumber);
                
                
                $('#tableContent').append(`
                            
                    `)
                    console.log(appointments);
                    
            }
        )
        console.log(filters);
}

async function filterByAppointmentDate(value){
    console.log(value);
    const response = await fetch(`${API}/appointments?currentUserName=${currentUserName}&appointment_date_gte=${value}&isDeleted=false`);
    const data = await response.json();
    // const filtered = data.filter(appointment => appointment.createdDate >= value);


    showFilters(data);
}

async function filterByStatus(status){
    console.log(status);
    
    const task = await fetch(`${API}/appointments?currentUserName=${currentUserName}&status=${status}&isDeleted=false`)
    
    // console.log(status);
    // console.log(task);
    const data = await task.json()
    console.log(task);
    // data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    showFilters(data)
}

async function profileData(){
    const task = await fetch(`${API}/patients/${loggedinID}`)
    const data = await task.json()
    
    console.log(loggedinID);
    
    console.log(data.firstName);
    
    $('#fname').val(data.firstName)
    $('#mname').val(data.middleName)
    $('#lname').val(data.lastName)
    $('#profileAge').val(data.age)
    $('#profileEmailID').val(data.emailID)
    $('#profilePhoneNumber').val(data.phoneNumber)
    $('#profileAddress').val(data.address)
    $('#profileUsername').val(data.username)
    $('.profileInput').prop("disabled",false)
}
async function editProfile(){
    // const task = await fetch(`${API}/patients?id=${loggedinID}`)
    // const data = await task.json()
    const firstName =  $('#fname').val()
    const middleName = $('#mname').val()
    const lastName = $('#lname').val()
    const age = $('#profileAge').val()
    const emailID = $('#profileEmailID').val()
    const phoneNumber = $('#profilePhoneNumber').val()
    const address = $('#profileAddress').val()
    const username = $('#profileUsername').val()

    const editedData = {firstName,middleName, lastName,age, emailID, phoneNumber,address, username }
    
    await fetch(`${API}/patients/${loggedinID}`,{
        method: "PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(editedData)
    })
    
    profileData()
}


async function appointedFilter(filters){
    console.log(filters);
    $('#tableContent').empty()
    
    const task = await fetch(`${API}/appointments?currentUserName=${currentUserName}&status=${filters}&isDeleted=false`)
    const response = await task.json()
    console.log(response);
    response.forEach(appointments=>{
                console.log(appointments.currentUserName);
                
                
                $('#appointedTableContent').append(`
                            <tr>
                                <td>${appointments.TokenNumber}</td>
                                <td>${appointments.currentUserName}</td>
                                <td>${appointments.currentUserAge}</td>
                                <td>${appointments.currentUserGender}</td>
                                <td>${appointments.reason}</td>
                                <td>${appointments.assigned_doctor}</td>
                                <!-- <td>25th June 2026</td> -->
                                <td>${appointments.appointment_date}</td>
                                <td>${appointments.appointment_time}</td>
                                <!-- <td>${appointments.status}</td> -->
                                <td><span class="status">${appointments.status}</span></td>
                                <td>
                                    <button id="editBtn" class="btn bg-warning" onclick="editAppointments('${appointments.id}')">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button id="deleteBtn" class="btn bg-danger" onclick="deleteAppointments('${appointments.id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                    `)
                    console.log(appointments);
                    
            }
        )
        console.log(response);

    
}


async function requestFilter(filters){
    console.log(filters);
    $('#tableContent').empty()
    
    const task = await fetch(`${API}/appointments?currentUserName=${currentUserName}&status=${filters}&isDeleted=false`)
    const response = await task.json()
    console.log(response);
    response.forEach(appointments=>{
                console.log(appointments.currentUserName);
                
                
                $('#requestedTableContent').append(`
                            <tr>
                                <td>${appointments.TokenNumber}</td>
                                <td>${appointments.currentUserName}</td>
                                <td>${appointments.currentUserAge}</td>
                                <td>${appointments.currentUserGender}</td>
                                <td>${appointments.reason}</td>
                                <td>${appointments.assigned_doctor}</td>
                                <!-- <td>25th June 2026</td> -->
                                <td>${appointments.appointment_date}</td>
                                <td>${appointments.appointment_time}</td>
                                <!-- <td>${appointments.status}</td> -->
                                <td><span class="status">${appointments.status}</span></td>
                                <td>
                                    <button id="editBtn" class="btn bg-warning" onclick="editAppointments('${appointments.id}')">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button id="deleteBtn" class="btn bg-danger" onclick="deleteAppointments('${appointments.id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                    `)
                    console.log(appointments);
                    
            }
        )
        console.log(response);

}

$('#profileEditBtnContainer').click(()=>{
    $('.profileInput').prop("disabled",false)
    // $('.row').empty("")
    $('#workProfilInnerContaienr').append(`
        <div class="col-12 mt-3  d-flex justify-content-center">
                                    <button id="profileEditSubmitBtn" onclick="editProfile()" class=" btn w-25 text-white bg-primary">Submit</button>
                                </div>
        `)
})


$('#createdDateFilter').on('change',function(){
    const value = $(this).val()    
    filterByAppointmentDate(value)
})

$('#searchByDoctorName').on('input',async function(){
    const value = $(this).val()    
    const task = await fetch(`${API}/appointments?currentUserName=${currentUserName}&assigned_doctor:startsWith=${value}&isDeleted=false`)
    const data = await task.json();
    showFilters(data)
})

$('#requestCountBtn').click(async function(){
    let value = $(this).val()
    console.log(value);
    filterByStatus(value)
}
)
$('#visitedCountBtn').click(async function(){
    let value = $(this).val()
    filterByStatus(value)
})
$('#appointerCountBtn').click(async function(){
    let value = $(this).val()
    filterByStatus(value)
})
$('#missedCountBtn').click(async function(){
    let value = $(this).val()
    filterByStatus(value)
})

$('#modalEditBtn').click(function(e){
    updateAppointments();
})

$('#createBtn').click(function(e){
    // e.preventDefault();
    addAppointment();
})
$('#appointedDate').attr('min',now)


$('#logoutBtn').click(function () {
    localStorage.clear()
    window.location.replace('/pages/PatientLogin.html');

});


$('.dashboard').click(()=>{
    $('.profile').removeClass('active')
    $('.dashboard').addClass('active')
    $(".workSpaceRequests").removeClass('displayDashboardContent')
    $(".workSpaceRequests").addClass('noDisplayDashboardContent')
    $(".workspaceProfile").removeClass('displayDashboardContent')
    $(".workspaceProfile").addClass('noDisplayDashboardContent')
    $(".workspaceAppointments").removeClass('displayDashboardContent')
    $(".workspaceAppointments").addClass('noDisplayDashboardContent')
})

$('.upcomingAppointmentDetails').click(()=>{

    $('.upcomingAppointmentDetails').removeClass('active')
    $('.upcomingAppointmentDetails').addClass('active')
    const appointed = "Appointed"
    appointedFilter(appointed)
    $(".workspaceDashboard").addClass('noDisplayDashboardContent')
    $(".workspaceProfile").addClass('noDisplayDashboardContent')
    $(".workspaceAppointments").addClass('displayDashboardContent')
})
$('.request').click(()=>{
    
    $('.request').removeClass('active')
    $('.request').addClass('active')
    const request = "Requested"
    requestFilter(request)
    $(".workspaceDashboard").removeClass('displayDashboardContent')
    $(".workspaceDashboard").addClass('noDisplayDashboardContent')
    $(".workspaceProfile").removeClass('displayDashboardContent')
    $(".workspaceProfile").addClass('noDisplayDashboardContent')
    $(".workspaceAppointments").removeClass('displayDashboardContent')
    $(".workspaceAppointments").addClass('noDisplayDashboardContent')
    // $(".workspaceProfile").addClass('noDisplayDashboardContent')
    // $(".workspaceAppointments").addClass('noDisplayDashboardContent')
    $(".workSpaceRequests").addClass('displayDashboardContent')
})
$('.profile').click(()=>{
    
    $('.dashboard').removeClass('active')
    // $('.profile').addClass('active')
    $('.request').removeClass('active')
    $('.profile').addClass('active')
    profileData()
    $(".workspaceDashboard").addClass('noDisplayDashboardContent')
    $(".workspaceAppointments").addClass('noDisplayDashboardContent')
    $(".workspaceAppointments").removeClass('noDisplayDashboardContent')
    $(".workspaceProfile").addClass('displayDashboardContent')
})

getAppointments()
