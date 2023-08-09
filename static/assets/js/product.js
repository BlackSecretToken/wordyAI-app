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

var hide = false;
var hide_upload = false;
var hide_optimize = false;
var downloadInterval;
var uploadInterval;
var optimizeInterval;
var originalDescription;
var currentProductId;

$(document).ready(function(){
    // disable save button //
    //disableSaveButton();
    $('#product_main_page').show();
    $('#product_detail_page').hide();
    // get download status
    $('#backdrop').show();
    getDownloadStatus();
    init();
    $('#backdrop').hide();

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
        let res = await checkThreadStatus();
        if (res.status === 'success')
        {
            if (hide === false){
                $('#product_download_setting_modal').modal({
                    backdrop: 'static',
                    keyboard: false // disable keyboard navigation as well
                })
                $("#product_download_setting_modal").modal('show'); 
            }
        }
        else
        {
            toastr.options = {
                "positionClass": "toast-top-right",
                "timeOut": "3000"
              }
            toastr.error(response.message);
        }
    })
    $("#pushButton").click(async function (event) {
       
        let res = await checkThreadStatus();
        if (res.status === 'success')
        {
            $('#product_upload_modal').modal({
                backdrop: 'static',
                keyboard: false // disable keyboard navigation as well
            })
    
            $('#backdrop').show();
            response = await product_upload_start();
            $('#backdrop').hide();
            console.log(response);
            if (response.status === 'success')
            {
                $("#product_upload_modal").modal('show');
                uploadInterval = setInterval(getUploadStatus, 3000);
            }
            else{
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error(response.message);
            }
        }
        else
        {
            toastr.options = {
                "positionClass": "toast-top-right",
                "timeOut": "3000"
              }
            toastr.error(response.message);
        }
        
    })

    $("#productUploadHide").click(function (event) {
        $("#product_upload_modal").modal('hide');    
        hide_upload = true;
    })
    
    $("#productUploadStop").click(async function (event) {
        response = await product_upload_status();
        total = response.total;
        response = await product_upload_stop();
        response = await product_upload_status();
        
        if (response.upload_status === false)
        {
            // do nothing..
            $("#product_upload_modal").modal('hide');
            $('#upload_gif').hide();    
            if (uploadInterval !== undefined)
                clearInterval(uploadInterval);
            toastr.options = {
                "positionClass": "toast-top-right",
                "timeOut": "3000"
                }
            toastr.success(total +  ' products uploaded..');
            getProductStatus();
        }
        else
        {
            $('#product_upload_modal').modal({
                backdrop: 'static',
                keyboard: false // disable keyboard navigation as well
            })
            $("#product_upload_modal").modal('show');
            $('#upload_gif').show();    
        }
        
    })

    $("#optimizeButton").click(async function (event) {
        let res = await checkThreadStatus();
        if (res.status === 'success')
        {
            $('#product_optimize_modal').modal({
                backdrop: 'static',
                keyboard: false // disable keyboard navigation as well
            })

            $('#backdrop').show(); 
            response = await product_optimize_start();
            $('#backdrop').hide();
            console.log(response);
            if (response.status === 'success')
            {
                $("#product_optimize_modal").modal('show');
                optimizeInterval = setInterval(getOptimizeStatus, 3000);
            }
            else{
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error(response.message);
            }
        }
        else
        {
            toastr.options = {
                "positionClass": "toast-top-right",
                "timeOut": "3000"
              }
            toastr.error(response.message);
        }
    })
    
    $("#productOptimizeHide").click(function (event) {
        $("#product_optimize_modal").modal('hide');    
        hide_upload = true;
    })
    
    $("#productOptimizeStop").click(async function (event) {
        response = await product_optimize_status();
        total = response.total;
        response = await product_optimize_stop();
        response = await product_optimize_status();
        
        if (response.optimize_status === false)
        {
            // do nothing..
            $("#product_optimize_modal").modal('hide');
            $('#optimize_gif').hide();    
            if (optimizeInterval !== undefined)
                clearInterval(optimizeInterval);
            toastr.options = {
                "positionClass": "toast-top-right",
                "timeOut": "3000"
                }
            toastr.success(total +  ' products optimized..');
            getProductStatus();
        }
        else
        {
            $('#product_optimize_modal').modal({
                backdrop: 'static',
                keyboard: false // disable keyboard navigation as well
            })
            $("#product_optimize_modal").modal('show');
            $('#optimize_gif').show();    
        }
        
    })

    $("#productDownloadSettingCancel").click(function (event) {
        $("#product_download_setting_modal").modal('hide');    
    })

    $("#productDownloadStart").click(async function (event) {
        $("#product_download_setting_modal").modal('hide');    
        $('#product_download_modal').modal({
            backdrop: 'static',
            keyboard: false // disable keyboard navigation as well
        })
        downloadFrom = parseInt($("#downloadStartFrom").val());

        $('#backdrop').show();
        response = await product_download_start(downloadFrom);
        $('#backdrop').hide();
        console.log(response);
        if (response.status === 'success')
        {
            $("#product_download_modal").modal('show');
            downloadInterval = setInterval(getDownloadStatus, 3000);
        }
        else{
            toastr.options = {
                "positionClass": "toast-top-right",
                "timeOut": "3000"
              }
            toastr.error(response.message);
        }
    })

    $("#productDownloadHide").click(function (event) {
        $("#product_download_modal").modal('hide');   
        hide = true; 
    })

    $("#productDownloadStop").click(async function (event) {
        response = await product_download_status();
        total = response.total;
        response = await product_download_stop();
        response = await product_download_status();
        
        if (response.download_status === false)
        {
            // do nothing..
            $("#product_download_modal").modal('hide');
            $('#download_gif').hide();    
            if (downloadInterval !== undefined)
                clearInterval(downloadInterval);
            toastr.options = {
                "positionClass": "toast-top-right",
                "timeOut": "3000"
                }
            toastr.success(total +  ' products downloaded..');
            getProductStatus();
        }
        else
        {
            $('#product_download_modal').modal({
                backdrop: 'static',
                keyboard: false // disable keyboard navigation as well
            })
            $("#product_download_modal").modal('show');
            $('#download_gif').show();    
        }
        
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

    $('#saveProductButton').click(function (event) {
        var updatedDescription = ($('#productDescription').html());
        confirmToast(' Are you going to save product detail. Is it optimized well?', 
        function() { // confirm ok
            
            fetch("/product/saveProductDetail", { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    'description': updatedDescription,
                    'id': currentProductId
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
                        getProductStatus();
                        getProductData(1);
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
            
        },
        function() {} // confirm cancel           
    ); 
        
    });

})

function disableSaveButton() {
    $('#saveProductButton').prop("disabled", true);
}

function enableSaveButton() {
    $('#saveProductButton').prop("disabled", false);
}

function getOptimizeStatus() {
    fetch("/product/productOptimizeStatus", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            console.log(response);
            if (response.optimize_status === false)
            {
                // do nothing..
                $("#product_optimize_modal").modal('hide');
                $('#optimize_gif').hide();  
                if (optimizeInterval !== undefined)
                {  
                    clearInterval(optimizeInterval)
                }
                getProductStatus();
            }
            else
            {
                if (hide_optimize === false)
                {
                    $('#product_optimize_modal').modal({
                        backdrop: 'static',
                        keyboard: false // disable keyboard navigation as well
                    })
                    $("#product_optimize_modal").modal('show');   
    
                    $('#totalOptimizeCount').text(response.total);
                }
                $('#optimize_gif').show(); 
                if (optimizeInterval === undefined)
                {
                    optimizeInterval = setInterval(getOptimizeStatus, 3000);
                }
            }
        }
    )
}

function getUploadStatus() {
    fetch("/product/productUploadStatus", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            console.log(response);
            if (response.upload_status === false)
            {
                // do nothing..
                $("#product_upload_modal").modal('hide');
                $('#upload_gif').hide();  
                if (uploadInterval !== undefined)
                {  
                    clearInterval(uploadInterval)
                }
                getProductStatus();
            }
            else
            {
                if (hide_upload === false)
                {
                    $('#product_upload_modal').modal({
                        backdrop: 'static',
                        keyboard: false // disable keyboard navigation as well
                    })
                    $("#product_upload_modal").modal('show');   
    
                    $('#totalUploadCount').text(response.total);
                }
                $('#upload_gif').show(); 
                if (uploadInterval === undefined)
                {
                    uploadInterval = setInterval(getUploadStatus, 3000);
                }
            }
        }
    )
}

function getDownloadStatus() {
    fetch("/product/productDownloadStatus", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            console.log(response);
            if (response.download_status === false)
            {
                // do nothing..
                $("#product_download_modal").modal('hide');
                $('#download_gif').hide();  
                if (downloadInterval !== undefined)
                {  
                    clearInterval(downloadInterval)
                }
                getProductStatus();
            }
            else
            {
                if (hide === false)
                {
                    $('#product_download_modal').modal({
                        backdrop: 'static',
                        keyboard: false // disable keyboard navigation as well
                    })
                    $("#product_download_modal").modal('show');   
    
                    $('#totalDownloadCount').text(response.total);
                }
                $('#download_gif').show(); 
                if (downloadInterval === undefined)
                {
                    downloadInterval = setInterval(getDownloadStatus, 3000);
                }
            }
        }
    )
}
async function product_optimize_start(){
    response = await fetch("/product/productOptimizeStart", { 
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

async function product_upload_start(){
    response = await fetch("/product/productUploadStart", { 
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
async function product_download_start(downloadFrom){
    response = await fetch("/product/productDownloadStart", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            page: Math.floor(downloadFrom/10 + 1)
        })
    });
    response = await(response.json());
    
    return response;
}

async function product_optimize_stop(){
    response = await fetch("/product/productOptimizeStop", { 
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

async function product_upload_stop(){
    response = await fetch("/product/productUploadStop", { 
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

async function product_optimize_status(){
    response = await fetch("/product/productOptimizeStatus", { 
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

async function product_upload_status(){
    response = await fetch("/product/productUploadStatus", { 
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
    getProductStatus();
    $('#filterStatus').empty();
    filterStatus.forEach((status) => {
        $('#filterStatus').append('<option value="'+status.id+'">'+ status.name + '</option>')
    })
    await getStockData() 
    await getCategoryData()
    await handlePage();
    await updateUpDownStatus();
    
    console.log("Hay");
    //initWebSocket();
}

function getProductStatus(){
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
    $('#filterStock').empty();
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
    $('#filterCategory').empty();
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
    if (response.product_status == 1) // optimized product
        $('#productDescription').append(response.product_updated_description);
    else
        $('#productDescription').append(response.product_description);

    $('#productSKU').val(response.product_sku);
    $('#productPrice').val(response.product_price);
    $('#productStockStatus').val(getStockStatusValue(response.stockstatus_id));
    $('#productCategory').val(getCategoryValue(response.category_id));
    originalDescription = response.product_description;
    currentProductId = product_id;    
}

function productOptimize(){

    $('#backdrop').show();
    
    content = ($('#productDescription').html());
    index = content.indexOf('<ul>');
    contentEnd = content.slice(index-1);
    contentStart = content.slice(0,index-1);
    contentStart = contentStart.replace(/\n/," ");
    contentStart = contentStart.replace(/<p>/g, "");
    contentStart = contentStart.replace(/<\/p>/g, " ");

    console.log(contentStart);
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
            $('#backdrop').hide();
            enableSaveButton();
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

async function checkThreadStatus(){
    response = await fetch("/product/checkThreadStatus", { 
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