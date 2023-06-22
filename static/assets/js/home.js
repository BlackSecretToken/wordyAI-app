$(document).ready(function(){
    //initSidebar();
    $("#registerForm").submit(function (event) {
        var vForm = $(this);
    
        const formData = new FormData(vForm[0]);
    
        event.preventDefault()
        event.stopPropagation()
    
        if (vForm[0].checkValidity() === false) {
            vForm.addClass('was-validated');
        } else {
            register();
        }
    
    });

    $("#loginForm").submit(function (event) {
        var vForm = $(this);
    
        const formData = new FormData(vForm[0]);
    
        event.preventDefault()
        event.stopPropagation()
    
        if (vForm[0].checkValidity() === false) {
            vForm.addClass('was-validated');
        } else {
            login();
        }
    
    });

    $("#forgotPasswordForm").submit(function (event) {
        var vForm = $(this);
    
        const formData = new FormData(vForm[0]);
    
        event.preventDefault()
        event.stopPropagation()
    
        if (vForm[0].checkValidity() === false) {
            vForm.addClass('was-validated');
        } else {
            forgotPassword();
        }
    
    });

    $("#resetPasswordForm").submit(function (event) {
        var vForm = $(this);
    
        const formData = new FormData(vForm[0]);
    
        event.preventDefault()
        event.stopPropagation()
    
        if (vForm[0].checkValidity() === false) {
            vForm.addClass('was-validated');
        } else {
            resetPassword();
        }
    
    });

    $("#verifyEmailForm").submit(function (event) {
        var vForm = $(this);
    
        const formData = new FormData(vForm[0]);
    
        event.preventDefault()
        event.stopPropagation()
    
        window.location.href = 'login';
    
    });
    $("#resendEmail").click(function (event) {
        console.log('clicked here');
        fetch("/resendEmailVerification", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: {}
        }).then(response => response.json()).then(
            
            response => {
                if (response.status == 'success')
                {
                    toastr.options = {
                        "positionClass": "toast-top-right",
                        "timeOut": "3000"
                      }
                    toastr.success(response.message);
                }
                else{
                    toastr.options = {
                        "positionClass": "toast-top-right",
                        "timeOut": "3000"
                      }
                    toastr.error(response.message);    
                }
            }
        )
    })

});

function register(){
    
    username= $('#inputUsername').val();
    emailAddress= $('#inputEmailAddress').val();
    password= $('#inputChoosePassword').val();
    confirmPassword= $('#inputConfirmPassword').val();
    if (password !== confirmPassword)
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Password does not match!');
    }

    fetch("/registerUser", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'username': username,
            'emailAddress': emailAddress,
            'password': password

        })
    }).then(response => response.json()).then(
        
        response => {
            if (response.status == 'success')
            {
                window.location.href = '/verifyEmail';
            }
            else{
                confirmToast(response.message + '  Are you going to login to this site? Please click Ok..', 
                    function() {window.location.href = '/login';},
                    function() {window.location.href = '/register';}
                );
            }
        }
    )
    
}

function login(){
    
    username= $('#inputUsername').val();
    password= $('#inputChoosePassword').val();
    rememberMe = $('#rememberMe')[0].checked;
    fetch("/loginUser", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'username': username,
            'password': password,
            'rememberMe': rememberMe

        })
    }).then(response => response.json()).then(
        
        response => {
            if (response.status === 'success')
            {
                window.location.href = response.url;
            }
            else
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error(response.message);
            }
        }
    )
    
}

function forgotPassword(){
    
    email= $('#inputEmail').val();
    fetch("/forgotPassword", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'email': email,

        })
    }).then(response => response.json()).then(
        
        response => {
            if (response.status === 'success')
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.success(response.message);
                //window.location.href = 'resetPassword';
            }
            else
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error(response.message);
            }
        }
    )
    
}

function resetPassword() {
    password= $('#inputChoosePassword').val();
    confirmPassword= $('#inputConfirmPassword').val();
    if (password !== confirmPassword)
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Password does not match!');
    }

    fetch("/resetPassword", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'password': password
        })
    }).then(response => response.json()).then(
        
        response => {
            if (response.status == 'success')
            {
                window.location.href = '/login';
            }
            else{

            }
        }
    )
}

function gotoSignin()
{
    window.location.href = '/login';
}
