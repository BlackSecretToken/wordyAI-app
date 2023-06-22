$(document).ready(function () {
    
});

function updatePassword() {
    currentPassword = $('#currentPassword').val();
    newPassword = $('#newPassword').val();
    confirmPassword = $('#confirmPassword').val();
    console.log(currentPassword);
    if (newPassword !== confirmPassword)
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Password does not match!");
        return;
    }
    if (newPassword === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert new password!");
        return;
    }
    fetch("/user/update_password", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            currentPassword : currentPassword,
            newPassword : newPassword,
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

function twostepVerification(){
    window.location.href = '../twostepVerification';
}
