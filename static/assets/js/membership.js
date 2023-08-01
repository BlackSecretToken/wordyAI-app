
var stripe = Stripe('pk_test_51NEPvmA2amj9Vq4Wwg0AwR9LqTHJ1FlvyKMu0Wur1iup7h8AIhLk6DZ2IdWXJWQqLRzK6iTWYXNI82NsKpXomCCG00Dq88YF1M');

var elements = stripe.elements();
var card = elements.create('card', {
    style: {
        base: {
            lineHeight: '1.7'
        }
    }
});
var cardList = []
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

$(document).ready(async function () {
    $('#backdrop').show();
    await initPlan();
    await getCardList();
    await getInvoiceData();
    $('#backdrop').hide();
    card.mount('#card-element');

    card.on('change', function (event) {
        displayError(event);
    });

    function displayError(event) {
        let displayError = document.getElementById('card-element-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    }

});

function getDateString(date) {
    date = new Date(date * 1000);
    return `${months[date.getMonth()]} ${date.getDate()},${date.getFullYear()}`;
}

async function getInvoiceData() {
    response = await fetch("/membership/get_invoice_data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    })
    response = await(response.json());
    response = response.data;
    console.log(response);

    $('#invoice_table').DataTable().destroy();
    $('#invoice_table tbody').empty();

    if (response !== undefined){
        data ="";
        for(let i=0;i<response.length;i++)
        {
            id = response[i].id;
            amount = response[i].amount_paid / 100;
            period_start = response[i].period_start;
            period_end = response[i].period_end;
            pdf = response[i].invoice_pdf;
            currency = response[i].currency;
            period_start = getDateString(period_start);
            period_end = getDateString(period_end);
            data = data + '<tr>'+
            '<td>'+
            '<input type="checkbox" data_id="'+id+'">' +
            '</td>' +
            '<td>' + id+ '</td>' +
            '<td>' + amount  + currency + '</td>' +
            '<td>' + period_start + '</td>' +
            '<td><a href="'+ pdf + '" title="Download invoice pdf"><i class="bx bx-download text-primary ft24 cursor-pointer me-3"></i></a></td>'
            '</tr>';
        }   
        $('#invoice_table tbody').append(data);
        $('#invoice_table').DataTable()
    }
    
}

async function initPlan() {
    let planStatus = "";
    let planDueDate = "";
    let planIsEnded = 0;
    let planRemainDate = 0;
    let planTotalDate = 0;
    let percent = 0.0;
    response = await fetch("/membership/get_current_subscription", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    });
    response = await(response.json());

    console.log(response);
    if (response.status === 'Free Plan')
    {
        planTotalDate = 14;
        let currentDate;
        let endDate;
        if (response.start_date === '')
        {
            currentDate = new Date(Date.now());
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 14);
        }
        else
        {
            currentDate = new Date(response.start_date);
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 14);
        }
        planDueDate = `${months[endDate.getMonth()]} ${endDate.getDate()},${endDate.getFullYear()}`;

        wasted_date = Math.ceil((Date.now() - currentDate)/60/60/24/1000);
        if (wasted_date > planTotalDate) planIsEnded = 1;
        planRemainDate = planTotalDate - wasted_date;
        percent = Math.floor(wasted_date/planTotalDate * 100);
    }
    else
    {
        start_date = response.start_date;
        mode = response.mode;
        const currentDate = new Date(start_date * 1000);
        let endDate;
        if (mode === 'Year') 
        {
            endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
            planTotalDate = 365
        }
        else 
        {
            endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
            planTotalDate = 30
        }
        
        planDueDate = `${months[endDate.getMonth()]} ${endDate.getDate()},${endDate.getFullYear()}`;

        wasted_date = Math.ceil((Date.now()/1000 - start_date)/60/60/24);
        if (wasted_date > planTotalDate) planIsEnded = 1;
        planRemainDate = planTotalDate - wasted_date;
        percent = Math.floor(wasted_date/planTotalDate * 100);
    }

    data = '';
    data = '<div class="col-lg-6 col-12">' +
            '<div>' +
            '<p class="fw600 ft16 mb-1">Your Current Plan is ' + response.status + '</p>' +
            '<p ckass="mb-3">A simple start for everyone</p>' + 
            '</div>' + 
            '<div>' +
            '<p class="fw600 ft16 mb-1">Active until ' + planDueDate + '</p>' +
            '<p ckass="mb-3">We will send you a notification upon Subscription expiration</p>' +
            '</div>' + '</div>' +
            '<div class="col-lg-6 col-12">' +
            '<div class="card px-4 py-2 color6">' +
            '<p class="ft16 mb-2 text-col1 fw600">We need your attention?</p>' +
            '<p class="ft14 mb-0 text-col1">Your plan requires update</p>' +
            '</div>' ;

    if (planIsEnded === 1)
    {
        data = data + '<p class="ft18 fw700 text-secondary">Subscription expired!</p>' + '</div>';
    }
    else
    {
        data = data + '<div class="d-flex flex-row justify-content-between mb-2">' +
                '<p class="ft16 mb-0 fw600">Days</p>' +
                '<p class="ft16 mb-0 fw600">' + wasted_date + ' of ' + planTotalDate + ' Days</p>'+
                '</div>' +
                '<div class="progress mb-2" style="height:7px;">' +
                '<div class="progress-bar" role="progressbar" style="width: '+ percent + '%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>' +
                '</div>' +
                '<p class="mb-0 fw700 text-secondary" id="planRemainDate">'+ planRemainDate +' days remaining until your plan requires update</p>' +
                '</div>';
    }

    $('#playBody').empty();
    $('#playBody').append(data);

}

async function getCardList() {
    response = await fetch("/membership/get_card_list", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    })
    response = await(response.json());
    
    console.log(response);
    data = response.data;
    
    item = '';
    if (data !== undefined) {
        for(let i=0;i<data.length;i++)
        {
            cardList.push(data[i].id);
            index = cardList.length - 1;
            item = item + '<div class="card p-3">' +
                    '<div class="d-flex flex-row justify-content-between align-items-center">' + 
                    '<img class="cardImg" src="../static/assets/images/membership/'+ data[i].brand.substring(0,4)+'card.png"/>'+
                    '<div class="d-flex flex-row">' +
                    '<button class="btn px-4 ms-2 btn-danger" onclick="deleteCard('+ index +')">Delete</button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="d-flex flex-row mt-3">' +
                    '<p class="mb-0 me-3 fw700">';
            if (data[i].name === null)    
                item =item + 'card' + '</p>';
            else
                item =item + data[i].name + '</p>';

            if ( i === 0 )
                item = item + '<span class="badge rounded-pill bg-primary">Primary</span>';
            else
                item = item + '<span class="badge rounded-pill bg-danger cursor-pointer" onclick="setCardPrimary(' + index + ')">Set Primary</span>';
            
            item = item + '</div>' + '<div class="d-flex flex-row mt-3 justify-content-between">' +
                    '<p class="mb-0 fw700">**** **** **** ' + data[i].last4 + '</p>' +
                    '<p class="mb-0">Card expires at ' + data[i].exp_month + '/' + data[i].exp_year + '</p>' +
                    '</div>' +
                    '</div>';
        }
    }
    $('#cardField').empty();
    $('#cardField').append(item);

}
function setCardPrimary(id) {
    fetch("/membership/set_card_primary", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            id: cardList[id]
        })
    }).then(response => response.json()).then(
        response => {
            if (response.status === 'success') {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                }
                toastr.success(response.message);
            }
            getCardList();
        }
    )
}

function deleteCard(id) {
    fetch("/membership/delete_card", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            id: cardList[id]
        })
    }).then(response => response.json()).then(
        response => {
            if (response.status === 'success') {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                }
                toastr.success(response.message);
            }
            getCardList();
        }
    )
}

function crateCustomer() {
    email = $('#email').val();
    taxid = $('#taxid').val();
    vatnum = $('#vatnum').val();
    mobile = $('#mobile').val();
    bill_address = $('#bill_address').val();
    state = $('#state').val();
    zipcode = $('#zipcode').val();
    country = $('#countryList').val();

    if (email === '') {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
        }
        toastr.error("Please insert billing email address..");
        return;
    }

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

    fetch("/membership/create_customer", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'email': email,
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
                window.location.href = "/user/billing";
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

function createCard() {
    stripe.createToken(card).then(function (result) {
        if (result.error) {
            // Inform the user if there was an error.
            var errorElement = document.getElementById('card-element-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server to charge the user.
            console.log(result.token.id);
            fetch("/membership/create_card", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    token_id: result.token.id,
                })
            }).then(response => response.json()).then(

                response => {
                    if (response.status === 'success') {
                        toastr.options = {
                            "positionClass": "toast-top-right",
                            "timeOut": "3000"
                        }
                        toastr.success(response.message);
                        getCardList();
                    }
                    else {
                        toastr.options = {
                            "positionClass": "toast-top-right",
                            "timeOut": "3000"
                        }
                        toastr.error(response.message);
                    }
                    card.clear();
                }
            )
        }
    });

}

