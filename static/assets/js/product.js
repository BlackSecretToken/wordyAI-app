var chatSocket;
var url = `ws://${window.location.host}/ws/product-server/`;
var connectionState = false;

var productUpDown = 0;
var skuUpDown = 0;
var stockUpDown = 0;
var categoryUpDown = 0;
var statusUpDown = 0;
var pageNum = 1;
var maxPageNum = 10;

var filterStatus = [{'id': 1, 'name': 'OPTIMIZED'},{'id': 2, 'name': 'UNOPTIMIZED'},{'id': 3, 'name': 'REJECTED'}]
var filterStatusClass = ['text-primary', 'text-warning', 'text-danger']
var filterStock = [];
var filterCategory = [];

var filterStatusValue = 0;
var filterStockValue = 0;
var filterCategoryValue = 0;
var orderQueue = ['product_title','product_sku','stockstatus_id', 'category_id', 'product_status'];

$(document).ready(function(){
    $('#product_main_page').show();
    $('#product_detail_page').hide();
    //initSidebar();
    init();

    $("#productUpDown").click(function (event) {
        productUpDown = 1 - productUpDown;
        handleOrderQueue('product_title', productUpDown);
        updateUpDownStatus();
    });
    $("#skuUpDown").click(function (event) {
        skuUpDown = 1 - skuUpDown;
        handleOrderQueue('product_sku', skuUpDown);
        updateUpDownStatus();
    });
    $("#stockUpDown").click(function (event) {
        stockUpDown = 1 - stockUpDown;
        handleOrderQueue('stockstatus_id', stockUpDown);
        updateUpDownStatus();
    });
    $("#categoryUpDown").click(function (event) {
        categoryUpDown = 1 - categoryUpDown;
        handleOrderQueue('category_id', categoryUpDown);
        updateUpDownStatus();
    });
    $("#statusUpDown").click(function (event) {
        statusUpDown = 1 - statusUpDown;
        handleOrderQueue('product_status', statusUpDown);
        updateUpDownStatus();
    });
    $("#filterStatus").change(function (event) {
        filterStatusValue = parseInt($(this).val());
        getProductData(0);
    })
    $("#filterStock").change(function (event) {
        filterStockValue = parseInt($(this).val());
        getProductData(0);
    })
    $("#filterCategory").change(function (event) {
        filterCategoryValue = parseInt($(this).val());
        getProductData(0);
    })

    $("#pullButton").click(async function (event) {
        /*
        $('#loadDataModal').modal({
            backdrop: 'static',
            keyboard: false // disable keyboard navigation as well
        })
        $("#loadDataModal").modal('show'); 
        */
        
        response = await product_download_status();
        response = await product_download_start();
        console.log(response);
    })
    $("#pushButton").click(async function (event) {

        response = await product_download_stop();
        console.log(response);
        response = await product_download_status();
    })

    $("#optimizeButton").click(async function (event) {

        response = await product_download_status();
        console.log(response); 
    })
    
    $("#dataModalCancel").click(function (event) {
        $("#loadDataModal").modal('hide');    
    })

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


async function product_download_start(){
    response = await fetch("/product/productDownloadStart", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    });
    response = await(response.json());
    
    return response;
}

async function product_download_stop(){
    response = await fetch("/product/productDownloadStop", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    });
    response = await(response.json());
    
    return response;
}

async function product_download_status(){
    response = await fetch("/product/productDownloadStatus", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    });
    response = await(response.json());
    
    return response;
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
    getProductData(1);
}


function updateUpDownStatus(){
    $('#productUpDown').empty();
    if (productUpDown === 0)
        $('#productUpDown').append('<p class="mb-0 text-black">&#8593;</p> <p class="mb-0 text-secondary">&#8595;</p>');
    else
        $('#productUpDown').append('<p class="mb-0 text-secondary">&#8593;</p> <p class="mb-0 text-black">&#8595;</p>');

    $('#skuUpDown').empty();
    if (skuUpDown === 0)
        $('#skuUpDown').append('<p class="mb-0 text-black">&#8593;</p> <p class="mb-0 text-secondary">&#8595;</p>');
    else
        $('#skuUpDown').append('<p class="mb-0 text-secondary">&#8593;</p> <p class="mb-0 text-black">&#8595;</p>');

    $('#stockUpDown').empty();
    if (stockUpDown === 0)
        $('#stockUpDown').append('<p class="mb-0 text-black">&#8593;</p> <p class="mb-0 text-secondary">&#8595;</p>');
    else
        $('#stockUpDown').append('<p class="mb-0 text-secondary">&#8593;</p> <p class="mb-0 text-black">&#8595;</p>');

    $('#categoryUpDown').empty();
    if (categoryUpDown === 0)
        $('#categoryUpDown').append('<p class="mb-0 text-black">&#8593;</p> <p class="mb-0 text-secondary">&#8595;</p>');
    else
        $('#categoryUpDown').append('<p class="mb-0 text-secondary">&#8593;</p> <p class="mb-0 text-black">&#8595;</p>');
    
    $('#statusUpDown').empty();
    if (statusUpDown === 0)
        $('#statusUpDown').append('<p class="mb-0 text-black">&#8593;</p> <p class="mb-0 text-secondary">&#8595;</p>');
    else
        $('#statusUpDown').append('<p class="mb-0 text-secondary">&#8593;</p> <p class="mb-0 text-black">&#8595;</p>');
    getProductData(0);
}

async function init(){
    filterStatus.forEach((status) => {
        $('#filterStatus').append('<option value="'+status.id+'">'+ status.name + '</option>')
    })
    await getStockData() 
    await getCategoryData()
    await handlePage();
    await updateUpDownStatus();
    //initWebSocket();
}

async function getStockData(){
    response = await fetch("/product/getStockData", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    });
    response = await(response.json());
    
    response = JSON.parse(response);
    filterStock = response;
    response.forEach((data) => {
        $('#filterStock').append('<option value="'+data.pk+'">'+ data.fields.status + '</option>');    
    })

}

async function getCategoryData(){
    response = await fetch("/product/getCategoryData", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    });

    response = await(response.json());    
        
    response = JSON.parse(response);
    filterCategory = response;
    response.forEach((data) => {
        $('#filterCategory').append('<option value="'+data.pk+'">'+ data.fields.category_name + '</option>');    
    })
        
    
}
async function getProductData(val){
    
    response = await fetch("/product/getProductData", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            filterStatus : filterStatusValue,
            filterStock : filterStockValue,
            filterCategory : filterCategoryValue,
            orderQueue : orderQueue,
            pageNum : (val === 0 ) ? 1: pageNum
        })
    });

    response = await(response.json());
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
function editProduct(product_id)
{
    $('#product_main_page').hide();
    $('#product_detail_page').show();
    getProductDataById(product_id);
}

function getCategoryValue(category_id)
{

    for(let i=0;i<filterCategory.length;i++)
    {
        if (category_id === filterCategory[i].pk)
            return filterCategory[i].fields.category_name;
    }
}

function getStockStatusValue(stockstatus_id)
{
    for(let i=0;i<filterStock.length;i++)
    {
        if (stockstatus_id === filterStock[i].pk)
            return filterStock[i].fields.status;
    }
}

function getProductStatusValue(productstatus_id)
{
    filterStatus
    for(let i=0;i<filterStatus.length;i++)
    {
        if (productstatus_id === filterStatus[i].id)
        {
            return  filterStatus[i].name;
        }
    }
}

async function getProductDataById(product_id){

    response = await fetch("/product/getProductDataById", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            id: product_id
        })
    });
    
    response = await (response.json());
    response = JSON.parse(response);

    $('#productTitle').val(response.product_title);
    $('#productDescription').empty();
    $('#productDescription').append(response.product_description);
    $('#productSKU').val(response.product_sku);
    $('#productPrice').val(response.product_price);
    $('#productStockStatus').val(getStockStatusValue(response.stockstatus_id));
    $('#productCategory').val(getCategoryValue(response.category_id));
        
}

function productOptimize(){
    $('.modal').modal('show');
    content = ($('#productDescription').html());
    index = content.indexOf('<ul>');
    contentEnd = content.slice(index-1);
    contentStart = content.slice(0,index-1);
    contentStart = contentStart.replace(/\n/," ");
    contentStart = contentStart.replace(/<p>/g, "");
    contentStart = contentStart.replace(/<\/p>/g, " ");


    fetch("/product/productOptimize", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            message: contentStart
        })
    }).then(response => response.json()).then(
        
        response => {
            $('#productDescription').empty()
            $('#productDescription').append(response.message + contentEnd);
            $('.modal').modal('hide');
        }
    )
}

function goBack(){
    $('#product_main_page').show();
    $('#product_detail_page').hide();
}

function initWebSocket() {

    chatSocket = new WebSocket(url);

    chatSocket.onmessage = function(e) {
        let data = JSON.parse(e.data)
        switch (data.type) {
            case "connection":
                console.log(data.message);
                connectionState = true;
                break;
            case "chat":
                console.log(data.message);
                break;
            default:
                console.log("hey default");
                break;
        }
    }
    //while(!connectionState);

    //sendMessage("Hey this is the start!");
}

function sendMessage(message){
    chatSocket.send(JSON.stringify({
        'message': message
    }))
}