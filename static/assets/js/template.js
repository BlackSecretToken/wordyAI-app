var categoryUpDown = 0;
var pageNum = 1;
var maxPageNum = 10;
var orderQueue = ['category'];

$(document).ready(function(){

    getCategoryData(0);

    $("#categoryUpDown").click(function (event) {
        categoryUpDown = 1 - categoryUpDown;
        handleOrderQueue('category', categoryUpDown);
        updateUpDownStatus();
    });
    $('#pagePrevBtn').click(function (event) {
        if (pageNum === 1) 
            pageNum = 1;
        else
            pageNum = pageNum - 1;
        handlePage();
    })
    $('#pageNextBtn').click(function (event) {
        if (pageNum === maxPageNum)    
            pageNum = maxPageNum;
        else
            pageNum = pageNum + 1;
        handlePage();
    })
    $('#pageOne').click(function (event) {
        pageNum = parseInt($('#pageOne').text());
        handlePage();
    })
    $('#pageTwo').click(function (event) {
        pageNum = parseInt($('#pageTwo').text());
        handlePage();
    })
    $('#pageThree').click(function (event) {
        pageNum = parseInt($('#pageThree').text());
        handlePage();
    })
})


function handlePage() {

    if (maxPageNum === 0 )
    {
        $('.pagination').hide();
    }
    else
    {
        $('.pagination').show();
    }

    $('#pageOne').parent().removeClass('active');
    $('#pageTwo').parent().removeClass('active');
    $('#pageThree').parent().removeClass('active');
    if (pageNum === 1)
    {
        $('#pageOne').text(pageNum);
        $('#pageTwo').text(pageNum+1);
        $('#pageThree').text(pageNum+2);
        $('#pageOne').parent().addClass('active');
    }
    else if (pageNum ===  maxPageNum)
    {
        $('#pageOne').text(pageNum-2);
        $('#pageTwo').text(pageNum-1);
        $('#pageThree').text(pageNum);
        $('#pageThree').parent().addClass('active');
    }
    else {
        $('#pageOne').text(pageNum-1);
        $('#pageTwo').text(pageNum);
        $('#pageThree').text(pageNum+1);
        $('#pageTwo').parent().addClass('active');
    }
    getCategoryData(1);
}

function handleOrderQueue(queueStr, dir)
{
    index = 0;
    for(let i=0;i<orderQueue.length;i++)
    {
        if (orderQueue[i].includes(queueStr))
        {
            index = i;
            break;
        }
    }
    orderQueue.splice(index, 1);
    if (dir === 1) queueStr = '-' + queueStr;
    orderQueue.unshift(queueStr);

}

function updateUpDownStatus(){
    $('#categoryUpDown').empty();
    if (categoryUpDown === 0)
        $('#categoryUpDown').append('<p class="mb-0 text-black">&#8593;</p> <p class="mb-0 text-secondary">&#8595;</p>');
    else
        $('#categoryUpDown').append('<p class="mb-0 text-secondary">&#8593;</p> <p class="mb-0 text-black">&#8595;</p>');

    getCategoryData(0);
}

async function getCategoryData(val){
    data = await fetch("/product/getCategoryData", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            orderQueue : orderQueue,
            pageNum : (val === 0 ) ? 1: pageNum
        })
    })
    data = data.json();
    console.log(data);
    /*
    .then(response => response.json()).then(
        
        response => {
            totalCount = response.totalCount;
            maxPageNum = Math.ceil(totalCount / 10);
            if (val === 0) {
                pageNum = 1;
                $('#pageOne').parent().removeClass('active');
                $('#pageTwo').parent().removeClass('active');
                $('#pageThree').parent().removeClass('active');
                if (pageNum === 1)
                {
                    $('#pageOne').text(pageNum);
                    $('#pageTwo').text(pageNum+1);
                    $('#pageThree').text(pageNum+2);
                    $('#pageOne').parent().addClass('active');
                }
                if (maxPageNum === 0 )
                    $('.pagination').hide();
                else
                    $('.pagination').show();
            }

            data = '';
            products = JSON.parse(response.products);

            $('#productTable').empty();
            if (totalCount > 0)
            {
                for(let i=0;i<products.length;i++)
                {
                    product = products[i];
                    data = data + '<tr>'+
                        '<td>'+
                        '<div class="d-flex">' +
                        '<img src="'+ product.fields.product_image+ '" class="user-img"></src>' +
                                '<p class="mb-0 ms-2">' + product.fields.product_title + '</p>' +
                            '</div>' +
                        '</td>' +
                        '<td>' + product.fields.product_sku + '</td>' +
                        '<td>' + getStockStatusValue(product.fields.stockstatus_id) + '</td>' +
                        '<td>' + getCategoryValue(product.fields.category_id) + '</td>' +
                        '<td class="' + filterStatusClass[product.fields.product_status] + ' fw900">'+ getProductStatusValue(product.fields.product_status)+ '</td>' +
                        '<td><i class="bx bx-edit-alt text-primary ft24 cursor-pointer" onclick=editProduct("'+ product.pk + '")></i></td>'
                        '</tr>';
                }
                
                $('#productTable').append(data);
            }
            
        }
    )
    */
}

function createCategory() {
    category = $('#category').val();
    if (category === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert category name..");   
    }
    fetch("/helpcenter/insert_category", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'category': category,

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
                $('#category').val('');
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
