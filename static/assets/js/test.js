$(document).ready(function () {

});

function clickInput(){
    event.preventDefault()
    event.stopPropagation()
    console.log('hqy!');

    $('#imageFile').trigger('click');
    while (true)
    {
        fileInput = document.getElementById('imageFile');;
        const file = fileInput.files[0];
        if (file !== '') break;
    }

    $('#uploadImage').trigger('click');
    
}
function uploadButton(){
    console.log('hay')
    fileInput = document.getElementById('imageFile');;
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    fetch("/test/upload", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: formData
    }).then(response => response.json()).then(
        
        response => {
            console.log('success');
        }
    )
}