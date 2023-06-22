var categoryData = [];
var contentData = [];

$(document).ready(async function(){
    $('#helpContent').hide();

    await getCategoryData();
    await getContentData();
    init();
})

function init() {
    for(let i=0; i<categoryData.length; i++)
    {
        data =  '<div class="flex flex-column p-3 helpcenterBorder mx-2 mb-2" onclick="showCategory('+ categoryData[i].id + ')">' +
                '<p class="ft20 fw700">' + categoryData[i].category + '</p>' +
                '<div class="helpcenterBoard text-primary ms-3">';
        for(let j=0;j<contentData[i].length;j++)
        {
            data = data + '<p class="helpcenterTextElipsis fw700 mb-1">&#x00B7;&nbsp;'+ contentData[i][j].contentName + '</p>';
        }       
        data = data + '</div>' +
               '<p class="ft18 fw700 mt-2 mb-0">' + contentData[i].length + ' articles</p>' +
               '</div>';
        $('#helpcenterCard').append(data);
    }
    
    num = Math.ceil(categoryData.length/3) * 3 - categoryData.length;
    for(let i=0; i<num; i++)
    {
        data = '<div class="flex flex-column p-3 helpcenterNoBorder mx-2 mb-2">' +
               '</div>';
        $('#helpcenterCard').append(data);
    }
}

function showCategory(id) {
    $('#helpContent').show();
    $('#helpCategory').show();
    $('#helpDetail').hide();
    $('#helpIndex').hide();

    changeCategory(id);
}

function changeCategory(id){
    data = '';
    index = 0;
    for(let i=0; i<categoryData.length; i++)
    {
        if (categoryData[i].id === id)
        {
            index = i;
            data = data + '<p class="helpcenter-category helpcenter-category-active cursor-pointer" onclick="changeCategory('+ categoryData[i].id + ')">' + categoryData[i].category + '</p>';
        }
        else
            data = data + '<p class="helpcenter-category cursor-pointer" onclick="changeCategory('+ categoryData[i].id + ')">' + categoryData[i].category + '</p>';
    }
    $('#category_category').empty();
    $('#category_category').append(data);

    changeContentName(id, index);
}

function changeContentName(id, index){
    $('#helpCategory').show();
    $('#helpContent').show();
    $('#helpDetail').hide();

    data = '<p class="text-secondary fw700 ft24">' + categoryData[index].category + '</p>';
    for(let i=0; i<contentData[index].length; i++)
    {
        data = data + '<p class="text-primary cursor-pointer" onclick="changeContent(' + id + ',' + index + ',' + i +')">&#x003E;' + contentData[index][i].contentName + '</p>';
    }
    $('#category_name').empty();
    $('#category_name').append(data);
}

function changeContent(id, index, subIndex) {
    $('#helpCategory').hide();
    $('#helpContent').show();
    $('#helpDetail').show();
    data = '<div class="mb-4">' +
           '<button class="btn btn-primary" onclick="changeCategory(' + id + ')">&#x003C; Back to help center</button>' +
           '</div>';

    data = data + '<p class="text-secondary fw700 ft24">' + contentData[index][subIndex].contentName + '</p>';
    data = data + '<div class="text-secondary">'+ contentData[index][subIndex].content +'</div>';

    data = data + '<hr/>' +
           '<div class="mt-2 d-flex flex-row justify-content-between">' +
           '<p class="ft16 fw700 mb-1">' + contentData[index][subIndex].contentName + '</p>' +
           '<p class="ft16 fw700 mb-1">Still need help?<b class="text-primary">Contact us?</b></p>' +
           '</div>' + 
           '<p class="fw700 text primary" id="audienceField">'+ contentData[index][subIndex].like +' People found this helpful</p>' +
           '<div class="d-flex flex-row">' +
           '<button type="button" class="btn btn-outline-primary me-3 p-1" onclick = "changeAudience('+ 1 + ',' + contentData[index][subIndex].id + ',' + index + ',' + subIndex + ')"><i class="bx bx-like"></i></button>'+
           '<button type="button" class="btn btn-outline-primary p-1"><i class="bx bx-dislike" onclick = "changeAudience('+ 0 + ',' + contentData[index][subIndex].id + ',' + index + ',' + subIndex +')"></i></button>'+
           '</div>'

    $('#detail_detail').empty();
    $('#detail_detail').append(data);

}

function changeAudience(status, id, index, subIndex) {
    fetch("/helpcenter/change_audience", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'status': status,
            'id': id,
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
                contentData[index][subIndex].like = response.data;
                $('#audienceField').text(response.data + ' People found this helpful');
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

function backHelpcenter(){
    window.location.href = '/helpcenter/';
}
async function getCategoryData(){
    data = await fetch("/helpcenter/get_category_data", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    });

    data = JSON.parse(await data.json());
    for(let i=0;i<data.length;i++)
    {
        category = {'id': data[i].pk, 'category': data[i].fields.category};
        categoryData.push(category);
        contentData.push([]);
    }   
}

async function getContentData(){
    data = await fetch("/helpcenter/get_content_data", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    })
    
    data = JSON.parse(await data.json());
    for(let i=0;i<data.length;i++)
    {
        contentName = data[i].fields.contentName;
        content = data[i].fields.content;
        contentID = data[i].pk;
        categoryID = data[i].fields.helpcategory;
        like = data[i].fields.like;

        order = getCategoryOrder(categoryID);
        contentData[order].push({'id': contentID, 'categoryID': categoryID, 'content': content, 'contentName': contentName, 'like': like })
    }
    console.log(contentData);
}

function getCategoryOrder(id)
{
    for(let i=0;i<categoryData.length;i++)
    {
        if (categoryData[i].id === id) return i;
    }
}

