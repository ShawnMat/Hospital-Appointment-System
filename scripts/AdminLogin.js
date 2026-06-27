const API = "http://localhost:3000"

$('#username').on('input blur', function () {
    let value = $(this).val().trim();
    $('#usernameError').text('');
    if (!value) {
        $('#usernameError').text('UserName is required').addClass("error")
    }
});
$('#password').on('input blur', function () {
    let value = $(this).val().trim();
    $('#passwordError').text('');
    if (!value) {
        $('#passwordError').text('Password is required').addClass("error");
    }
});

// login works even after empty input fields


async function checkUser(){
    const username = $('#username').val().trim()
    const password = $('#password').val().trim()

    const response = await fetch(`${API}/admin`)
    const data = await response.json()
    const validUser = data.find(user=>
        user.username === username && user.password === password
    )
    
    if(!validUser){
        // add toaster
        alert("User does not exists")
    }
    else{
        console.log("helllo");
        
        localStorage.setItem('loggedInUser',JSON.stringify(validUser))
        setTimeout(() => {
            console.log("wokring");
            window.location.replace("/pages/AdminDashboard.html")
        }, 1000);
    }
    
        
    }

$('#adminLoginBtn').click((e)=>{
    e.preventDefault();
    checkUser()
})