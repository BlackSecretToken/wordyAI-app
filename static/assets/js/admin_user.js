const ROLE = ['User', 'Admin', 'Test'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var selectedId;

$(document).ready(async function(){
    $('#backdrop').hide();
    $('#custom_data_table').DataTable();
    $('#subscription_data_table').DataTable();

    $('#backdrop').show();
    await getUserData();
    $('#backdrop').hide();

    $('#main-check').change(function() {
        if ($('#main-check').prop('checked')){
            $(':checkbox').each(function() {
                $(this).prop('checked', true);
            });
        }
        else{
            $(':checkbox').each(function() {
                $(this).prop('checked', false);
            });
        }
    });

    $('#subscriptionStatus').change(async function() {
        await showSubscription(selectedId);
    });


})

async function getUserData() {
    $('#page1').show();
    $('#page2').hide();
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
        '<input type="checkbox" data_id="'+ response[i].id +'">' +
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

async function showUser(id) {
    selectedId = id;
    $('#backdrop').show();
    response = await fetch(admin_app_url + "/user/get_user_data_by_id", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': id
        })
    })
    response = await(response.json());

    data = '<div class="d-flex flex-row justify-content-between mb-4">' +
    '<p class="text-secondary fw700 ft24 mb-0">'+ 'User '+ response.id +'</p>' +
    '<button class="btn btn-primary px-3" onclick="goBack()">Back</button>'+
    '</div>'+ 
    '<img class="ms-3 mb-3" style="width:200px;height:200px;border-radius:100px" src="'+ response.avatar +'"/>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Username: </span>' + response.username +'</p>' +
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Firstname: </span>' + response.firstname +'</p>' +
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Lastname: </span>' + response.lastname +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Address: </span>' + response.address +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Mobile: </span>' + response.mobile +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Language: </span>' + response.language +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Timezone: </span>' + response.timezone +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Created Time: </span>' + new Date(Date.parse(response.created_at)) +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Updated Time: </span>' + new Date(Date.parse(response.updated_at)) +'</p>';


    $('#page2').show();
    $('#page2_detail').empty();
    $('#page2_detail').append(data);
    $('#page1').hide();


    /* show billing information part  */
    await showBilling(id);
    /* show subscription information part */
    await showSubscription(id);
    /* show invoice information part */
    await showInvoice(id);

    $('#backdrop').hide();
  
}
async function showBilling(id) {
    response = await fetch(admin_app_url + "/billing/get_customer_data_by_user_id", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': id
        })
    })
    response = await(response.json());
    if (response.length > 0)
    {
        response = response[0];
        data = '<div class="d-flex flex-row justify-content-between mb-4">' +
            '<p class="text-secondary fw700 ft24 mb-0">'+ 'Customer '+ response.id +'</p>' +
            '<button class="btn btn-primary px-3" onclick="goBack()">Back</button>'+
            '</div>'+ 
            '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">CustomerId: </span>' + response.customerid +'</p>' +
            '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Email: </span>' + response.email +'</p>' +
            '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Bill Address: </span>' + response.bill_address +'</p>'+
            '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Country: </span>' + response.country +'</p>'+
            '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Created Time: </span>' + new Date(Date.parse(response.created_at)) +'</p>'+
            '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Updated Time: </span>' + new Date(Date.parse(response.updated_at)) +'</p>';
            
            $('#page2_billing').empty();
            $('#page2_billing').append(data);
    }
}

async function showSubscription(id) {
    var status = $("#subscriptionStatus").val();
    response = await fetch(admin_app_url + "/billing/get_subscription_status_id", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': id,
            'status': status
        })
    })
    response = await(response.json());
    console.log(response);

    
    $('#subscription_data_table').DataTable().destroy();
    $('#subscription_data_table tbody').empty();

    data ='';
    for(let i=0;i<response.length;i++)
    {
        statusStyle = ''
        data = data + '<tr>'+
        '<td>'+
        '<input type="checkbox" data_id="'+ response[i].id +'">' +
        '</td>' +
        '<td>' + response[i].id + '</td>' +
        '<td>' + response[i].status + '</td>' +
        '<td class="fw700">' + response[i].product_price + response[i].currency + '</td>' +
        '<td>' + response[i].product_name+ ' Membership' + '</td>' +
        '<td>' + getDateString(response[i].period_start) + '</td>' +
        '<td>' + getDateString(response[i].period_end) + '</td>' +
        '<td><i class="bx bx-show text-primary ft24 cursor-pointer me-3" onclick=""></td>'
        '</tr>';
    }   
    $('#subscription_data_table tbody').append(data);
    $('#subscription_data_table').DataTable();

}

async function showInvoice(id) {

}

function deleteUserDataById(id){
  confirmToast(' Are you going to delete user data?', 
      function() { // confirm ok
          fetch(admin_app_url + "/user/delete_user_data_by_id", { 
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
                  if (response.status === 'success')
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.success(response.message);
                      $('#category').val('');
                      getUserData();
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
      },
      function() {} // confirm cancel           
  );
}
function toggleUserRole(id) {
    selectedId = id;
}

function changeUserRole(role){
    $('#role-card').addClass('role-card-remover');
  confirmToast(' Are you going to change the user role?',   
      function() { // confirm ok
          fetch(admin_app_url + "/user/change_user_role", { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify({
                  'id': parseInt(selectedId),
                  'role': role,
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
                      $('#category').val('');
                      getUserData();
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
      },
      function() {} // confirm cancel           
  );
}

function activateUserDataById(id){
  confirmToast(' Are you going to activate the user?', 
      function() { // confirm ok
          fetch(admin_app_url + "/user/activate_user_data_by_id", { 
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
                  if (response.status === 'success')
                  {
                      toastr.options = {
                          "positionClass": "toast-top-right",
                          "timeOut": "3000"
                        }
                      toastr.success(response.message);
                      $('#category').val('');
                      getUserData();
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
      },
      function() {} // confirm cancel           
  );
}

function deleteUserBulk(){
  arr = [];
  $('#main-check').prop('checked', false);
  $(':checkbox').each(function() {
      if ($(this).prop('checked'))
      {
          arr.push(parseInt($(this).attr('data_id')));
      }    
  });

  confirmToast(' Are you going to activate the user?', 
      function() { // confirm ok
          fetch(admin_app_url + "/user/delete_user_bulk", { 
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCookie('csrftoken'),
              },
              body: JSON.stringify({
                  'ids': arr,
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
                      $('#category').val('');
                      getUserData();
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
      },
      function() {} // confirm cancel           
  );
}

function createUser() {
    username= $('#username').val();
    password= $('#password').val();
    confirm_password = $('#confirm_password').val();
    company= $('#company').val();
    email= $('#email').val();
    firstname= $('#firstname').val();
    lastname= $('#lastname').val();

    if (username === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Please insert username!');
        return;
    }
    if (company === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Please insert company name!');
        return;
    }
    if (email === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Please insert email address!');
        return;
    }
    if (firstname === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Please insert firstname!');
        return;
    }
    if (lastname === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Please insert lastname!');
        return;
    }
    if (password === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Please insert password!');
        return;
    }
    if (password !== confirm_password)
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error('Password does not match!');
        return;
    }

    fetch(admin_app_url + "/user/create_user", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'username': username,
            'email': email,
            'password': password,
            'company': company,
            'lastname': lastname,
            'firstname': firstname
        })
    }).then(response => response.json()).then(
        
        response => {
            if (response.status === 'success')
            {
                getUserData();
                $('#username').val('');
                $('#password').val('');
                $('#confirm_password').val('');
                $('#company').val('');
                $('#email').val('');
                $('#firstname').val('');
                $('#lastname').val('');
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

function goBack(){
  $('#page1').show();
  $('#page2').hide();
}

function getDateString(date) {
    date = new Date(date * 1000);
    return `${months[date.getMonth()]} ${date.getDate()},${date.getFullYear()}`;
}