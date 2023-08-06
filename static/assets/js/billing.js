var plan = ['Basic', 'Standard', 'Enterprise']

$(document).ready(function () {
    $('#backdrop').hide();
    planStatus();
    getFaqData();
});

function planStatus() {
    fetch("/membership/get_plan_status", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            if (response.name === '')
            {
                for(let i=0;i<plan.length;i++)
                {
                    $('#plan' + plan[i]).empty();
                    data = '<btn class="btn btn-primary px-5 my-3" onclick="choosePlan('+ i +')">Choose Plan</button>'
                    $('#plan' + plan[i]).append(data);
                }
            }
            else{
                let flag = 0;
                for(let i=0;i<plan.length;i++)
                {
                    if (plan[i] === response.name) flag = 1;
                    $('#plan' + plan[i]).empty();
                    if (flag === 0)
                        data = '<btn class="btn btn-secondary px-5 my-3">Upgrade</button>'
                    else{
                        data = '<btn class="btn btn-primary px-5 my-3" onclick="choosePlan('+ i +')">Upgrade</button>'
                    }
                        
                    $('#plan' + plan[i]).append(data);
                }
                
                $('#plan' + response.name).empty();
                data = '<p class="color4 text-primary ft18 fw700 px-5 pt-2 pb-1 rounded my-3">Your Current Plan</p>'
                $('#plan' + response.name).append(data);
                
            }
        }
    ) 
}

function choosePlan(index) {
    $('#backdrop').show();
    let mode = '';
    if ($('#modeCheck').is(':checked')) {
        mode = 'Year';
    } else {
        mode = 'Month';
    }

    fetch("/membership/choose_plan", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'name': plan[index],
            'mode': mode,
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
            planStatus();
            $('#backdrop').hide();
        }
    )
}

function doFreeTrial() {
    fetch("/membership/do_free_trial", { 
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
        }
    ) 
}

function getFaqData() {
    fetch("/membership/billing_get_faq_data", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            response = JSON.parse(response);
  
            data = '';
            for(let i=0;i<response.length;i++)
            {
                title = response[i].fields.title;
                content = response[i].fields.content;
                contentID = response[i].pk;
                data = data + '<div class="card p-4">' +
                    '<p class="fw700 ft16 text-primary">' + title + '</p>' +
                    '<div class="text-secondary mb-0" id="faq_content">' + content + '</div>' + '</div>';
                console.log(data);
            }   
            $('#faq_detail').empty();
            $('#faq_detail').append(data);
        }
    ) 
}
