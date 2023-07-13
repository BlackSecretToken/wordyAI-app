$(document).ready(async function(){
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
        '<td><i class="bx bx-show text-primary ft24 cursor-pointer me-3" onclick="showCustomer(' + response[i].id + ')"></i></td>' +
        '</tr>';
    }   
    $('#custom_data_table tbody').append(data);
    $('#custom_data_table').DataTable()

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
    /*
    data = '<p class="text-secondary fw700 ft24">'+ response.customerid +'</p>' +
         +'<p class="text-secondary fw700 ft24">'+ response.customerid +'</p>' +
         +'<p class="text-secondary fw700">'+ response.email +'</p>' +
         +'<p class="text-secondary fw700">'+ response.company +'</p>' +
         +'<p class="text-secondary fw700">'+ response.country +'</p>' +
         +'<p class="text-secondary fw700">'+ response.state +'</p>' +
         +'<p class="text-secondary fw700">'+ response.zipcode +'</p>' +
         +'<p class="text-secondary fw700">'+ response.taxid +'</p>' +
         +'<p class="text-secondary fw700">'+ response.vatnum +'</p>' +
         +'<p class="text-secondary fw700">'+ response.bill_address +'</p>' +
         +'<p class="text-secondary fw700">'+ response.mobile +'</p>';
    */
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