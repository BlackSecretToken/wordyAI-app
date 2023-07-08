$(document).ready(function(){
    init();
})
function init(){
    fetch("/product/getProductStatus", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            $('#activeProductCount').text(response.active_cnt);
            if (response.new_optimized_cnt > 0 )
                $('#optimizedProductCount').html(response.optimized_cnt + `/<span class="ft22 text-primary-1">+${response.new_optimized_cnt}</span>`);
            else
            $('#optimizedProductCount').html(response.optimized_cnt);
            $('#optimizeProductCount').text(response.unoptimized_cnt);
            $('#problemProductCount').text(0);
        }
    )
}