var categoryData = [];

$(document).ready(async function(){
    $('#backdrop').hide();
    $('#content_table').DataTable();
    await getCategoryData();
    getContentData();
    
    //getContentData()

    $('#main-check').change(function() {
        if ($('#main-check').prop('checked')){
            $(':checkbox').each(function() {
                $(this).prop('checked', true);
            });
        }
        else{
            $(':checkbox').each(function() {
                $(this).prop('checked', false);
            });
        }
    });
    
})

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
    }   
    categoryData.forEach((data) => {
        $('#filterCategory').append('<option value="'+data.id+'">'+ data.category + '</option>');    
    })
}

function getContentData(){
    $('#backdrop').show();
    fetch("/helpcenter/get_content_data", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            response = JSON.parse(response);
            
            $('#content_table').DataTable().destroy();
            $('#content_table tbody').empty();
            data='';
            
            for(let i=0;i<response.length;i++)
            {
                contentName = response[i].fields.contentName;
                content = response[i].fields.content;
                contentID = response[i].pk;
                categoryID = response[i].fields.helpcategory;
                data = data + '<tr>'+
                '<td>'+
                '<input type="checkbox" data_id="'+contentID+'">' +
                '</td>' +
                '<td>' + contentName + '</td>' +
                '<td>' + getCategoryName(categoryID) + '</td>' +
                '<td><i class="bx bx-edit-alt text-primary ft24 cursor-pointer me-3" onclick=editContent("'+ contentID + '")></i><i class="bx bx-trash text-danger ft24 cursor-pointer" onclick=deleteContent("'+ contentID + '")></i></td>'
                '</tr>';
            }   
            $('#content_table tbody').append(data);
            $('#content_table').DataTable()
            
            $('#backdrop').hide();
            
        }
    )
}

function getCategoryName(id) {
    for(let i=0;i<categoryData.length;i++)
    {
        if (categoryData[i].id === id) return categoryData[i].category;
    }
}

function createContent() {
    content = $('#content').html();
    contentName = $('#contentName').val();
    category = parseInt($('#filterCategory').val());
    if (category === 0)
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please select category..");   
        return;
    }
    if (contentName === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert content name..");   
        return;
    }
    if (content === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert content..");   
        return;
    }
    fetch("/helpcenter/insert_content", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'category': category,
            'content': content,
            'contentName': contentName

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
                $('#filterCategory').val(0);
                $('#content').html('');
                $('#contentName').val('');
                getContentData();
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

function deleteContent(id){
    confirmToast(' Are you going to delete content?', 
        function() { // confirm ok
            fetch("/helpcenter/delete_content", { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                body: JSON.stringify({
                    'id': parseInt(id),
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
                        getContentData();
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
}

function editContent(id)
{
    fetch("/helpcenter/edit_content", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': parseInt(id),
        })
    }).then(response => response.json()).then(
        
        response => {
            response = JSON.parse(response);
            contentName = response[0].fields.contentName;
            content = response[0].fields.content;
            contentID = response[0].pk;
            categoryID = response[0].fields.helpcategory;

            $('#filterCategory').val(categoryID);
            $('#content').html(content);
            $('#contentName').val(contentName);

            $('#createButton').hide();

            $('#updateContent').empty();
            data =  '<div class="mb-3">' +
                    '<button class="btn btn-primary px-4 me-3" onclick="updateContent('+ contentID + ')">Edit</button>' +
                    '<button class="btn btn-primary px-4" onclick="cancel()">Cancel</button>' +
                    '</div>';
            $('#updateContent').append(data);    
        }
    )
}

function updateContent(id){
    content = $('#content').html();
    contentName = $('#contentName').val();
    category = parseInt($('#filterCategory').val());
    if (category === 0)
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please select category..");   
        return;
    }
    if (contentName === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert content name..");   
        return;
    }
    if (content === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert content..");   
        return;
    }
    fetch("/helpcenter/update_content", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': id,
            'category': category,
            'content': content,
            'contentName': contentName
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
            }
            else
            {
                toastr.options = {
                    "positionClass": "toast-top-right",
                    "timeOut": "3000"
                  }
                toastr.error(response.message);
            }
            cancel();
            getContentData();
        }
    )
}

function cancel()
{
    $('#createButton').show();
    $('#updateContent').empty();
    $('#filterCategory').val(0);
    $('#content').html('');
    $('#contentName').val('');
}

function deleteContentBulk()
{
    arr = [];
    $('#main-check').prop('checked', false);
    $(':checkbox').each(function() {
        if ($(this).prop('checked'))
        {
            arr.push(parseInt($(this).attr('data_id')));
        }    
    });
    
    fetch("/helpcenter/delete_content_bulk", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'ids': arr,
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
            getContentData();
        }
    )
}
