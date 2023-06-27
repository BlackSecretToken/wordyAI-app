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
}