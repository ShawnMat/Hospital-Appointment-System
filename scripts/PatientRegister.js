const API = "http://localhost:3000"


// gender validation if no input is chosen



// what about babies who are few months old?
$('#age').on('input blur', function () {
    let value = $(this).val().trim();
    $('#ageError').text('');
    if (!value) {
        $('#ageError').text('Age Required');
    }
    else if (value < 0) {
        $('#ageError').text('Age cannot be negative').addClass("error")
    }
    else if (value > 150) {
        $('#ageError').text('Age cannot be above 150').addClass("error")
    }
});



// add country code for phone number regex

$('#phoneNumber').on('input blur', function () {

    let value = $(this).val().trim();
    const phoneNumberRegex = /^[6-9]\d{9}$/;
    $('#contactNumberError').text('');
    if (!value) {
        $('#phoneNumberError').text('Contact Required').toggleClass("error")
    }
    else if (!phoneNumberRegex.test(value)) {
        $('#phoneNumberError').text('Enter valid 10-digit number').toggleClass("error")
    }
});

// Proper email regex is needed

$('#emailID').on('input blur', function () {

    let value = $(this).val().trim();
    const emailIDRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $('#emailAddressError').text('');

    if (!value) {
        $('#emailIDError').text('Email Required').addClass("error")
    }
    else if (!emailIDRegex.test(value)) {
        $('#emailIDError').text('Invalid Email').addClass("error")
    }
});

$('#user').on('input blur', function () {

    let value = $(this).val().trim();
    const usernameRegex = /^[A-Za-z0-9_]{4,20}$/;

    $('#usernameError').text('');

    if (!value) {
        $('#usernameError').text('Username Required').addClass("error")
    }
    else if (!usernameRegex.test(value)) {
        $('#usernameError').text('4-20 chars only (A-Z, 0-9, _)').addClass("error")
    }
});

$('#pwd').on('input blur', function () {

    let value = $(this).val();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;

    $('#passwordError').text('');

    if (!value) {
        $('#passwordError').text('Password Required').addClass("error")
    }
    else if (!passwordRegex.test(value)) {
        $('#passwordError').text('Weak Password').addClass("error")
    }
});

$('#confirmPwd').on('input blur', function () {

    let value = $(this).val();

    $('#confirmPasswordError').text('');

    if (!value) {
        $('#confirmPasswordError').text('Required').addClass("error")
    }
    else if (value !== $('#pwd').val()) {
        $('#confirmPasswordError').text('Passwords do not match').addClass("error")
    }
});
async function registerPatient(){

    const firstName = $('#firstName').val().trim()
    const middleName = $('#middleName').val().trim()
    const lastName = $('#lastName').val().trim()
    // const firstName = $('#firstName').val().trim()
    const age = $('#age').val().trim()
    const emailID = $('#emailID').val().trim()
    const phoneNumber = $('#phoneNumber').val().trim()
    const address = $('#address').val().trim()
    const username = $('#user').val().trim()
    const password = $('#pwd').val().trim()
    const confirmPassword = $('#confirmPwd').val().trim()


    if(password !== confirmPassword){
        alert("Passowrds do not match")
    }
    else{
        const patientData = {firstName,middleName,lastName,age,emailID,phoneNumber,address,username,password}
        console.log(patientData);
        
        await fetch(`${API}/patients`,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify(patientData)
        })
        console.log("wokring");

        setTimeout(() => {
            console.log("wokring");
            
            window.location.href = "/pages/PatientLogin.html";
        }, 1000);
        
    }

}  






$('#registerBtn').click((e)=>{
    e.preventDefault();
    registerPatient()
})