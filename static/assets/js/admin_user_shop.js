var categoryData = [];
var editorData;
var currentId;

$(document).ready(async function(){

    $('#updateContent').hide();
    $('#backdrop').hide();
    $('#content_table').DataTable();

    getContentData();
    
})

function getContentData(){
    $('#backdrop').show();
    fetch(admin_app_url + "/user/get_shop_data", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            
            $('#content_table').DataTable().destroy();
            $('#content_table tbody').empty();
            data='';
            
            for(let i=0;i<response.length;i++)
            {
                contentID = response[i].id;
                username = response[i].username;
                email = response[i].email;
                datatype = response[i].datatype;
                eshopType = response[i].eshopType;
                appName = response[i].appName;
                data = data + '<tr>'+
                '<td>'+
                '<input type="checkbox" data_id="'+contentID+'">' +
                '</td>' +
                '<td>' + username + '</td>' +
                '<td>' + email + '</td>' +
                '<td>' + datatype + '</td>' +
                '<td>' + eshopType + '</td>' +
                '<td>' + appName + '</td>' +
                '<td><i class="bx bx-edit-alt text-primary ft24 cursor-pointer me-3" onclick=editContent("'+ contentID + '")></i></td>'
                '</tr>';
            }   
            $('#content_table tbody').append(data);
            $('#content_table').DataTable()
            
            $('#backdrop').hide();
            
        }
    )
}


function editContent(id)
{
    fetch(admin_app_url + "/user/get_shop_data_by_id", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': parseInt(id),
        })
    }).then(response => response.json()).then(
        
        response => {
            currentId = id;
            $('#updateContent').show();
            $('#appName').val(response[0].appName);
            $('#apiUrl').val(response[0].apiUrl);
            $('#consumerKey').val(response[0].consumerKey);
            $('#consumerToken').val(response[0].consumerToken);
        }
    )
}

function cancel()
{
    $('#updateContent').hide();
}

function updateContent(){

    appName = $('#appName').val();
    apiUrl = $('#apiUrl').val();
    consumerKey = $('#consumerKey').val();
    consumerToken = $('#consumerToken').val();
    
    fetch(admin_app_url + "/user/update_shop_data", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': currentId,
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
            cancel();
            getContentData();
        }
    )
}

