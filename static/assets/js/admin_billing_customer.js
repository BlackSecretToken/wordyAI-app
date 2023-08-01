var currentId;
$(document).ready(async function(){
    $('#editCustomer').hide();
    $('#backdrop').hide();
    $('#custom_data_table').DataTable();
    $('#backdrop').show();
    await getCustomerData();
    $('#backdrop').hide();
})

async function getCustomerData() {
    $('#page1').show();
    $('#page2').hide();
    response = await fetch(admin_app_url + "/billing/get_customer_data", {
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
        data = data + '<tr>'+
        '<td>'+
        '<input type="checkbox" data_id="'+ response[i].id +'">' +
        '</td>' +
        '<td>' + response[i].customerid+ '</td>' +
        '<td>' + response[i].username + '</td>' +
        '<td>' + response[i].email + '</td>' +
        '<td><i class="bx bx-show text-primary ft24 cursor-pointer me-3" onclick="showCustomer(' + response[i].id + ')"></i><i title="edit customer data" class="bx bx-edit-alt text-primary ft24 cursor-pointer me-3" onclick=changeCustomerData("'+ response[i].id + '")></i></td>' +
        '</tr>';
    }   
    $('#custom_data_table tbody').append(data);
    $('#custom_data_table').DataTable()

}

function changeCustomerData(id) {
    $('#editCustomer').show();
    currentId = id;
    fetch("/membership/get_customer_data_by_id", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': currentId,
        })
    }).then(response => response.json()).then(

        response => {
            console.log(response);
            $('#taxid').val(response.taxid);
            $('#vatnum').val(response.vatnum);
            $('#mobile').val(response.mobile);
            $('#bill_address').val(response.bill_address);
            $('#state').val(response.state);
            $('#zipcode').val(response.zipcode);
            $('#countryList').val(response.country);
        }
    )
}

function updateCancel() {
    $('#editCustomer').hide();
}

function updateCustomer() {
    taxid = $('#taxid').val();
    vatnum = $('#vatnum').val();
    mobile = $('#mobile').val();
    bill_address = $('#bill_address').val();
    state = $('#state').val();
    zipcode = $('#zipcode').val();
    country = $('#countryList').val();

    if (taxid === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert tax id..");
        return;
    }

    if (vatnum === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert vat number..");
        return;
    }

    if (mobile === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert mobile number..");
        return;
    }

    if (country === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please select country..");
        return;
    }

    if (bill_address === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert billing address..");
        return;
    }

    if (state === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert state..");
        return;
    }

    if (zipcode === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert zipcode..");
        return;
    }

    fetch("/membership/update_customer", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': currentId,
            'taxid': taxid,
            'vatnum': vatnum,
            'mobile': mobile,
            'bill_address': bill_address,
            'state': state,
            'zipcode': zipcode,
            'country': country
        })
    }).then(response => response.json()).then(

        response => {
            if (response.status === 'success') {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                }
                toastr.success(response.message);
                window.location.href = admin_app_url + "/billing/customer";
            }
            else {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                }
                toastr.error(response.message);
            }
        }
    )
}

async function showCustomer(id) {
    $('#backdrop').show();
    response = await fetch(admin_app_url + "/billing/get_customer_data_by_id", {
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
    console.log(response);

    data = '<div class="d-flex flex-row justify-content-between mb-4">' +
    '<p class="text-secondary fw700 ft24 mb-0">'+ response.customerid +'</p>' +
    '<button class="btn btn-primary px-3" onclick="goBack()">Back</button>'+
    '</div>'+ 
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Email: </span>' + response.email +'</p>' +
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Company: </span>' + response.company +'</p>' +
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Country: </span>' + response.country +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">State: </span>' + response.state +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Zipcode: </span>' + response.zipcode +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Taxid: </span>' + response.taxid +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Vatnum: </span>' + response.vatnum +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">BillAddress: </span>' + response.bill_address +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Mobile: </span>' + response.mobile +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Created Time: </span>' + new Date(Date.parse(response.created_at)) +'</p>'+
    '<p class="text-secondary fw700 ft18 ms-3">'+ '<span class="text-primary fw700 ft18">Updated Time: </span>' + new Date(Date.parse(response.updated_at)) +'</p>';


    $('#page2').show();
    $('#page2').empty();
    $('#page2').append(data);
    $('#page1').hide();
    $('#backdrop').hide();
}

function goBack(){
    $('#page1').show();
    $('#page2').hide();
}