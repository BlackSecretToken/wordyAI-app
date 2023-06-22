
$(document).ready(function () {
    //initSidebar();
    get_current_subscription();
    $('#dataModal').modal('show');

    data_tab_show('#data_tab_1');
    set_group1('#group1_1');
    set_group2('#group2_1');
});

function get_current_subscription() {
    fetch("/membership/get_current_subscription", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(      
        response => {
            $('#currentSubscription').html(response.status);
        }
    )
}

var group1=1;
var group2=1;

function data_tab_show(target){
    $('#data_tab_1').hide();
    $('#data_tab_2').hide();
    $('#data_tab_3').hide();
    $('#data_tab_4').hide();
    $('#data_tab_5').hide();
    $(target).show();
}
function data_style_change(target){
    $('#data_1').removeClass('imageDivActive');
    $("#data_1").children("svg").removeClass('svgActive');
    $('#data_2').removeClass('imageDivActive');
    $("#data_2").children("svg").removeClass('svgActive');
    $('#data_3').removeClass('imageDivActive');
    $("#data_3").children("svg").removeClass('svgActive');
    $('#data_4').removeClass('imageDivActive');
    $("#data_4").children("svg").removeClass('svgActive');
    $('#data_5').removeClass('imageDivActive');
    $("#data_5").children("svg").removeClass('svgActive');
    $(target).addClass('imageDivActive');
    $(target).children("svg").addClass('svgActive');
}
function set_group1(target){
    $('#group1_1').children("p").removeClass('circleActive');
    $('#group1_2').children("p").removeClass('circleActive');
    $('#group1_3').children("p").removeClass('circleActive');
    $(target).children("p").addClass('circleActive');
}
function set_group2(target){
    $('#group2_1').children("p").removeClass('circleActive');
    $('#group2_2').children("p").removeClass('circleActive');
    $('#group2_3').children("p").removeClass('circleActive');
    $('#group2_4').children("p").removeClass('circleActive');
    $(target).children("p").addClass('circleActive');
}

$('#bnt_next_1').click(function(){
    console.log('clicked!');
    if (group1===3)
    {
        data_tab_show('#data_tab_2');
        data_style_change('#data_2');
    }
    else
    {
        data_tab_show('#data_tab_4');
        data_style_change('#data_3');
    }
});

$('#bnt_next_2').click(function(){
    console.log('clicked!');
    data_tab_show('#data_tab_3');
    data_style_change('#data_3');
});
$('#bnt_prev_2').click(function(){
    console.log('clicked!');
    data_tab_show('#data_tab_1');
    data_style_change('#data_1');
});

$('#bnt_next_3').click(function(){
    console.log('clicked!');
    data_tab_show('#data_tab_5');
    data_style_change('#data_5');
});
$('#bnt_prev_3').click(function(){
    console.log('clicked!');
    data_tab_show('#data_tab_2');
    data_style_change('#data_2');
});

$('#bnt_next_4').click(function(){
    console.log('clicked!');
    data_tab_show('#data_tab_5');
    data_style_change('#data_5');
});
$('#bnt_prev_4').click(function(){
    console.log('clicked!');
    data_tab_show('#data_tab_1');
    data_style_change('#data_1');
});

$('#bnt_prev_5').click(function(){
    console.log('clicked!');
    if (group1 === 3)
    {
        data_tab_show('#data_tab_3');
        data_style_change('#data_3');
    }
    else
    {
        data_tab_show('#data_tab_4');
        data_style_change('#data_4');
    }
});

$('#group1_1').click(function(){
    set_group1('#group1_1');
    group1 = 1;
});
$('#group1_2').click(function(){
    set_group1('#group1_2');
    group1 = 2;
});
$('#group1_3').click(function(){
    set_group1('#group1_3');
    group1 = 3;
});

$('#group2_1').click(function(){
    set_group2('#group2_1');
    group2 = 1;
});
$('#group2_2').click(function(){
    set_group2('#group2_2');
    group2 = 2;
});
$('#group2_3').click(function(){
    set_group2('#group2_3');
    group2 = 3;
});
$('#group2_4').click(function(){
    set_group2('#group2_4');
    group2 = 4;
});

$('#btn_submit').click(function(){
    console.log('clicked!');
    applicationName = $('#applicationName').val();
    if (applicationName === '') 
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert application name..");
        return;
    }
    else
    {
        apiUrl = $('#apiUrl').val();
        consumerKey = $('#consumerKey').val();
        consumerToken = $('#consumerToken').val();
        if (group1 ===3)
        {
            if (apiUrl === '')
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error("Please insert api url..");
                return;
            }
            if (consumerKey === '')
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error("Please insert consumer key..");
                return;
            }
            if (consumerToken === '')
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error("Please insert consumer token..");
                return;
            }
            
        }
        fetch("/insertConnectData", { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                    'applicationName': applicationName,
                    'apiUrl': apiUrl,
                    'consumerKey': consumerKey,
                    'consumerToken': consumerToken,
                    'category': group1,
                    'eshopType': group2,
            })
        }).then(response => response.json()).then(      
            response => {
                if (response.status === 'success')
                {
                    window.location.href = '';
                }
            }
        )
    }
    
});

function goProductPage(){
    window.location.href = '/product/product';
}

function goBilling(){
    window.location.href = '/membership/billing';
}

