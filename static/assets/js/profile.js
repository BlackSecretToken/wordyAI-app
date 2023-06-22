
$(document).ready(function () {
    $('#imageFile').change(function (){
        $('#imageName').text($('#imageFile').val().split('\\').pop());
    })
});

function imageClick(){
    $('#imageFile').trigger('click');
}

function imageCancel(){
    $('#imageName').text('Allowed JPG, GIF or PNG. Max size of 800K');
    $('#imageName').val('');
}

function deactivateAccount(){
    if ($('#deleteCheck').prop('checked'))
    {
        fetch("/user/deactivate_account", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: {}
        }).then(response => response.json()).then(
            
            response => {
                if (response.status === 'success')
                {
                    toastr.options = {
                        "positionClass": "toast-top-right",
                        "timeOut": "3000"
                    }
                    toastr.success(response.message);
                    
                    window.location.href = '../logoutUser';
                }
            }
        )
    }
    else
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please check confirm deactivate account");
    }
}