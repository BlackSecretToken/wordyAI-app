$(document).ready(function(){
    init();
})
function init(){
    fetch("/product/productDownloadStatus", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            if (response.download_status === false)
            {
                $('#download_gif').hide();
            }
            else
            {
                $('#download_gif').show();
            }
        }
    )

    fetch("/product/productUploadStatus", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            if (response.upload_status === false)
            {
                $('#upload_gif').hide();
            }
            else
            {
                $('#upload_gif').show();
            }
        }
    )
}