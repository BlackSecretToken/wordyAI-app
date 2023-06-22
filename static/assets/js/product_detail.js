
$(document).ready(function(){
    product_id = $('#bucketProductId').text()
    
})

async function init()
{
    await getProductDataById(product_id);
}
function goBack(){
    window.location.href = '/product/product'
}

async function getProductDataById(){

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