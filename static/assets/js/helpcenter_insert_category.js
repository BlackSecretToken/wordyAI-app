
$(document).ready(function(){
    $('#category_table').DataTable();
    getCategoryData()

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

function getCategoryData(){
    $('#backdrop').show();
    fetch("/helpcenter/get_category_data", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: {}
    }).then(response => response.json()).then(
        
        response => {
            response = JSON.parse(response);
            $('#category_table').DataTable().destroy();
            $('#category_table tbody').empty();
            data='';
            for(let i=0;i<response.length;i++)
            {
                categoryName = response[i].fields.category;
                categoryID = response[i].pk;
                data = data + '<tr>'+
                '<td>'+
                '<input type="checkbox" data_id="'+categoryID+'">' +
                '</td>' +
                '<td>' + categoryName + '</td>' +
                '<td><i class="bx bx-edit-alt text-primary ft24 cursor-pointer me-3" onclick=editCategory("'+ categoryID + '")></i><i class="bx bx-trash text-danger ft24 cursor-pointer" onclick=deleteCategory("'+ categoryID + '")></i></td>'
                '</tr>';
            }   
            $('#category_table tbody').append(data);
            $('#category_table').DataTable()
            $('#backdrop').hide();
        }
    )
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
        return;
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
                getCategoryData();
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

function deleteCategory(id){
    confirmToast(' Are you going to delete category?', 
        function() { // confirm ok
            fetch("/helpcenter/delete_category", { 
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
                        getCategoryData();
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

function editCategory(id)
{
    fetch("/helpcenter/edit_category", { 
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
            categoryID = response[0].pk;
            categoryName = response[0].fields.category;
            $('#updateCategory').empty();
            data =  '<div class="mb-3 form-group">' + 
                    '<p class="text-secondary mb-1 fw600">Category Name</p>' +
                    '<input type="text" class="form-control" name="categoryU" value="' + categoryName + '"id="categoryU"/>' +
                    '</div>' +
                    '<div class="mb-3">' +
                    '<button class="btn btn-primary px-4 me-3" onclick="updateCategory('+ categoryID + ')">Edit</button>' +
                    '<button class="btn btn-primary px-4" onclick="cancel()">Cancel</button>' +
                    '</div>';
            $('#updateCategory').append(data);    
        }
    )
}

function updateCategory(id){
    category = $('#categoryU').val();
    if (category === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert category name.."); 
        return;  
    }

    fetch("/helpcenter/update_category", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'category': category,
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
            $('#updateCategory').empty();
            getCategoryData();
        }
    )
}

function cancel()
{
    $('#updateCategory').empty();
}

function deleteCategoryBulk()
{
    arr = [];
    $('#main-check').prop('checked', false);
    $(':checkbox').each(function() {
        if ($(this).prop('checked'))
        {
            arr.push(parseInt($(this).attr('data_id')));
        }    
    });
    
    fetch("/helpcenter/delete_category_bulk", { 
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
            $('#updateCategory').empty();
            getCategoryData();
        }
    )
}