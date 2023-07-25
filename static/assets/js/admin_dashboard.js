const ROLE = ['User', 'Admin', 'Test'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var selectedId;

$(document).ready(async function(){

    $('#backdrop').show();
    await init();
    $('#backdrop').hide();

})

async function init() {
    response = await fetch(admin_app_url + "/user/get_user_data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    })
    response = await(response.json());
    console.log(response);

    $('#custom_data_table').DataTable().destroy();
    $('#custom_data_table tbody').empty();

    data ='';
    for(let i=0;i<response.length;i++)
    {
        let status;
        let statusStyle;
        let statusIcon;
        let statusMethod;
        let statusTitle;
        if (response[i].activate) 
        {
            status = 'Active';
            statusStyle = 'text-primary';
            statusIcon = 'bx-trash'
            statusMethod = 'deleteUserDataById'
            statusTitle = 'title = "delete user data"'
        }
        else 
        {
            status = 'Deleted';
            statusStyle = 'text-danger';
            statusIcon = 'bx-check'
            statusMethod = 'activateUserDataById'
            statusTitle = 'title = "activate user data"'
        }
        data = data + '<tr>'+
        '<td>'+
        '<input type="checkbox" class="user_main" data_id="'+ response[i].id +'">' +
        '</td>' +
        '<td>' + response[i].username+ '</td>' +
        '<td>' + response[i].email + '</td>' +
        '<td class="fw700">' + ROLE[response[i].role -1 ] + '</td>' +
        '<td class="'+ statusStyle + '">' + status + '</td>' +
        '<td><i class="bx bx-show text-primary ft24 cursor-pointer me-3" onclick="showUser(' + response[i].id + ')"></i><i title="change user role" class="bx bx-edit-alt text-primary ft24 cursor-pointer me-3" onclick=toggleUserRole("'+ response[i].id + '")></i><i '+ statusTitle + 'class="bx ' + statusIcon + ' text-danger ft24 cursor-pointer" onclick=' + statusMethod + '("'+ response[i].id + '")></i></td>'
        '</tr>';
    }   
    $('#custom_data_table tbody').append(data);
    $('#custom_data_table').DataTable()

    $('.bx-edit-alt').click(function(event) {
        const x= event.clientX;
        const y= event.clientY;
        $('#role-card').removeClass('role-card-remover');
        $('#role-card').css('left', `${x - 100}px`);
        $('#role-card').css('top', `${y}px`);
    })

}
