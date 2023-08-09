
$(document).ready(async function(){
    $('#backdrop').hide();
    
})

function savePrompt() {
    prompt = $('#prompt').text();
    key =  $('#key').text();
    model =  $('#model').val();
    console.log(prompt);
    fetch(admin_app_url + "/openai/savePrompt", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'prompt': prompt,
            'key': key,
            'model': model,
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

function checkPrompt(){
    $('#backdrop').show();
    title = $('#title').text();
    description = $('#description').text();
    fetch(admin_app_url + "/openai/checkPrompt", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'title': title,
            'description': description
        })
    }).then(response => response.json()).then(
        
        response => {
            console.log(response.message);
            $('#newDescription').text(response.message);
            $('#backdrop').hide();
        }
    )
}

