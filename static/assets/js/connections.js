$(document).ready(function(){
    $('#backdrop').hide();
});

function checkConnection(mode){
    $('#backdrop').show();
    fetch("/user/check_connection", { 
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
                
            }
            else
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                }
                toastr.error(response.message);
            }
            $('#backdrop').hide();
        }
    )
}

function editShop(mode) {
    $('#backdrop').show();
    fetch("/user/edit_shop", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            console.log(response);
            $('#backdrop').hide();

            $('#appName').val(response.appName);
            $('#apiUrl').val(response.apiUrl);
            $('#consumerKey').val(response.consumerKey);
            $('#consumerToken').val(response.consumerToken);

            $('#shop_update_modal').modal({
                backdrop: 'static',
                keyboard: false // disable keyboard navigation as well
            })
            $("#shop_update_modal").modal('show'); 
        }
    )
}

function updateCancel() {
    $("#shop_update_modal").modal('hide'); 
}

function updateShop() {
    $('#backdrop').show();

    appName = $('#appName').val();
    apiUrl = $('#apiUrl').val();
    consumerKey = $('#consumerKey').val();
    consumerToken = $('#consumerToken').val();

    fetch("/user/update_shop", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'appName': appName,
            'apiUrl': apiUrl,
            'consumerKey': consumerKey,
            'consumerToken': consumerToken,
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
            $('#backdrop').hide();
        }
    )
    $("#shop_update_modal").modal('hide'); 
}