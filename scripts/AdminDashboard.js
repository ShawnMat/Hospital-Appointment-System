const API = "http://localhost:3000"
let currentPage = 1;
const rowsPerPage = 5;

const today = new Date().toISOString().split('T')[0];
const loggedInUser = JSON.parse(
    localStorage.getItem('loggedInUser')
)

if (!loggedInUser) {
    window.location.replace('/pages/AdminLogin.html')
}


$('#greetings').text(loggedInUser.username)


let token = 0;

// Get Appointments

async function getAppointments(){
    const response = await fetch(`${API}/appointments`)
    const data =await response.json()
    console.log(data);
    showAppointments(data)
}

// Display Appointments

function showAppointments(data) {

    const filteredAppointments = data.filter(appointment => appointment.isDeleted === false);
    const start = (currentPage-1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredAppointments.slice(start, end);

    $('#tableContent').empty();

    paginatedData.forEach((appointment, index) => {
        $('#tableContent').append(`
            <tr>
                <td>${start + index + 1}</td>
                <td>${appointment.currentUserName}</td>
                <td>${appointment.currentUserAge}</td>
                <td>${appointment.currentUserGender}</td>
                <td>${appointment.reason}</td>
                <td>${appointment.assigned_doctor}</td>
                <td>${appointment.appointment_date}</td>
                <td>${appointment.appointment_time}</td>
                <td>${appointment.status}</td>
                <td>
                    <button class="btn btn-warning"
                        onclick="editAppointments('${appointment.id}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    <button class="btn btn-danger"
                        onclick="deleteAppointments('${appointment.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });

    renderPagination(filteredAppointments.length);
}
// rendering pages for pagination
function renderPagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    $('#dashboardPagination').empty();
    $('#dashboardPagination').append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
                Previous
            </a>
        </li>
    `);
    for(let i = 1; i <= totalPages; i++) {
        $('#dashboardPagination').append(`
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `);
    }
    $('#dashboardPagination').append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                Next
            </a>
        </li>
    `);
}
function changePage(page) {
    currentPage = page;
    getAppointments();
}
// Counters
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
    $('#requestCount').text(reqCount)
    $('#missedCount').text(missCount)
    
}

// Rejects Appointment
async function rejectAppointments(id) {
    await fetch(`${API}/appointments/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    await getAppointments();
    await counters();
}

// Doctor Token Manipulation
async function doctorToken(doc) {
    const response = await fetch(`${API}/doctors?doctor_name=${doc}`);
    const doctorData = await response.json();

    const doctor = doctorData[0];
    console.log(doc);
    console.log(doctorData);
    
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
// reseting doctor token 
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
// reset 
async function resetDay() {
    await resetDoctorTokens();
    console.log("System reset completed");
}
async function getNextToken(doctorName, appointmentDate) {
    const response = await fetch(
        `${API}/appointments?assigned_doctor=${doctorName}&appointment_date=${appointmentDate}&status=Appointed`
    );

    const data = await response.json();

    return data.length + 1;
}
// Appointment Approved
async function approvedAppointments(id) {
    const task = await fetch(`${API}/appointments/${id}`);
    const data = await task.json();

    const nextToken = await getNextToken(
        data.assigned_doctor,
        data.appointment_date
    );

    // Doctor limit check
    if (nextToken > 20) {
        alert("Doctor token limit reached for this day");
        return;
    }

    await fetch(`${API}/appointments/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Appointed",
            TokenNumber: nextToken
        })
    });

    getAppointments();
    requestFilter("Requested"); 
    appointedFilter("Appointed"); 
    counters()
}

// to Show Filters
function showFilters(filters) {
    console.log(filters);
    $('#tableContent').empty()
    
    filters.reverse().forEach(appointments=>{
                console.log(appointments.TokenNumber);
                
                
                $('#tableContent').append(`
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
// Filter based on Appointment Date
async function filterByAppointmentDate(value){
    console.log(value);
    const response = await fetch(`${API}/appointments?appointment_date_gte=${value}&isDeleted=false`);
    const data = await response.json();


    showFilters(data);
}
// filter based on Status
async function filterByStatus(status){
    const task = await fetch(`${API}/appointments?status=${status}&isDeleted=false`)
    const data = await task.json()
    showFilters(data)
}
// filter based on appointed status
async function appointedFilter(filters){
    console.log(filters);
    $('#appointedTableContent').empty();
    
    const task = await fetch(`${API}/appointments?currentUserName=${currentUserName}&status=${filters}&isDeleted=false`)
    const response = await task.json()
    console.log(response);
    response.forEach(appointments=>{
                console.log(appointments.currentUserName);
                
                
                $('#appointedTableContent').append(`
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
                                    <button id="editBtn" class="btn bg-warning" onclick="approvedAppointments('${appointments.id}')">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button id="deleteBtn" class="btn bg-danger" onclick="rejectAppointments('${appointments.id}')">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </td>
                            </tr>
                    `)
                    console.log(appointments);
                    
            }
        )
        console.log(response);

    
}
// filter based on request filter
async function requestFilter(filters){
    console.log(filters);
    $('#requestedTableContent').empty();    
    const task = await fetch(`${API}/appointments?status=${filters}&isDeleted=false`)
    const response = await task.json()
    console.log(response);
    response.forEach(appointments=>{
                
                $('#requestedTableContent').append(`
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
                                    <button id="editBtn" class="btn bg-warning" onclick="approvedAppointments('${appointments.id}')">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button id="deleteBtn" class="btn bg-danger" onclick="rejectAppointments('${appointments.id}')">
                                        <i class="bi bi-x-lg"></i>
                                    </button>
                                </td>
                            </tr>
                    `)
                    console.log(appointments);
                    
            }
        )
        console.log(response);

}
// Display Profile Date
function showProfileData(data){
    console.log(data);
    
    data.forEach(patient=>{
                // console.log(patient.TokenNumber);
                
                
                $('#tableContent').append(`
                            
                    `)
                    console.log(appointments);
                    
            }
        )
        console.log(filters);
}

// profile data
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
// Editiing Profile
async function editProfile(){

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


// rendering appointed Appointments
async function loadAppointedAppointments() {
    $('#appointedTableContent').empty();

    const response = await fetch(
        `${API}/appointments?status=Appointed&isDeleted=false`
    );

    const appointments = await response.json();

    appointments.forEach(appointment => {
        $('#appointedTableContent').append(`
            <tr>
                <td>${appointments.TokenNumber || "-"}</td>
                <td>${appointment.currentUserName}</td>
                <td>${appointment.currentUserAge}</td>
                <td>${appointment.currentUserGender}</td>
                <td>${appointment.reason}</td>
                <td>${appointment.assigned_doctor}</td>
                <td>${appointment.appointment_date}</td>
                <td>${appointment.appointment_time}</td>
                <td>
                    <span class="badge bg-primary">
                        ${appointment.status}
                    </span>
                </td>
                <td>
                    <button
                        class="btn btn-success"
                        onclick="markVisited('${appointment.id}')">
                        <i class="bi bi-check-lg"></i>
                    </button>
                </td>
            </tr>
        `);
    });
}
async function markVisited(id) {
    await fetch(`${API}/appointments/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: "Visited"
        })
    });

    loadAppointedAppointments();
    counters();
}
// Missed Appoiintments
async function updateMissedAppointments() {
    const response = await fetch(
        `${API}/appointments?status=Appointed&isDeleted=false`
    );

    const appointments = await response.json();

    for (const appointment of appointments) {
        if (appointment.appointment_date < today) {
            await fetch(`${API}/appointments/${appointment.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "Missed"
                })
            });
        }
    }
}


$('#profileEditBtnContainer').click(()=>{
    $('.profileInput').prop("disabled",false)
    $('#workProfilInnerContaienr').append(`
        <div class="col-12 mt-3  d-flex justify-content-center">
                                    <button id="profileEditSubmitBtn" onclick="editProfile()" class=" btn w-25 text-white bg-primary">Submit</button>
                                </div>
        `)
})
$('.dashboard').click(()=>{
    $('.workspaceAppointments').removeClass('seen')
    $('.workspaceAppointments').addClass('notSeen')
    $('.workSpaceRequests').removeClass('seen')
    $('.workSpaceRequests').addClass('notSeen')
    $('#workspaceDashboard').addClass('seen')
    
})
$('.appointments').click(async()=>{
    $('#workspaceDashboard').removeClass('seen')
    $('#workspaceDashboard').addClass('notSeen')
    $('.workSpaceRequests').removeClass('seen')
    $('.workSpaceRequests').addClass('notSeen')
    $('.workspaceAppointments').addClass('seen')
   
    await updateMissedAppointments();
    await loadAppointedAppointments();
})

$('.request').click(()=>{
    $('.workspaceAppointments').removeClass('seen')
    $('.workspaceAppointments').addClass('notSeen')
    $('#workspaceDashboard').removeClass('seen')
    $('#workspaceDashboard').addClass('notSeen')
    $('.workSpaceRequests').addClass('seen')
    const request = "Requested"
    requestFilter(request)

})


$('#searchByPatientName').on('input',async function(){
    const value = $(this).val()    
    const task = await fetch(`${API}/appointments?currentUserName_like=${value}&isDeleted=false`);
    const data = await task.json();
    showFilters(data)
})

$('#createdDateFilter').on('change',function(){
    const value = $(this).val()    
    filterByAppointmentDate(value)
})

$('#requestCountBtn').click(async function(){
    let value = $(this).val()
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

$('#logoutBtn').click(function () {
    localStorage.clear()
    window.location.replace('/pages/Login.html');
});
getAppointments()