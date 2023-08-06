var categoryData = [];
var editorData;

$(document).ready(async function(){
    //editorData = new FroalaEditor('#content');
    ClassicEditor
        .create( document.querySelector( '#content' ) )
        .then( editor => {
                editorData = editor;
        } )
        .catch( error => {
                console.error( error );
        } );
    
    $('#backdrop').hide();
    $('#content_table').DataTable();
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


function getContentData(){
    $('#backdrop').show();
    fetch(admin_app_url + "/helpcenter/faq_get_content_data", { 
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
                title = response[i].fields.title;
                content = response[i].fields.content;
                contentID = response[i].pk;
                data = data + '<tr>'+
                '<td>'+
                '<input type="checkbox" data_id="'+contentID+'">' +
                '</td>' +
                '<td>' + title + '</td>' +
                '<td>' + content + '</td>' +
                '<td><i class="bx bx-edit-alt text-primary ft24 cursor-pointer me-3" onclick=editContent("'+ contentID + '")></i><i class="bx bx-trash text-danger ft24 cursor-pointer" onclick=deleteContent("'+ contentID + '")></i></td>'
                '</tr>';
            }   
            $('#content_table tbody').append(data);
            $('#content_table').DataTable()
            
            $('#backdrop').hide();
            
        }
    )
}

function createContent() {
    //content = editorData.html.get();
    content = editorData.getData();
    //content = $('#content').html();
    title = $('#title').val();

    if (title === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert title..");   
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
    fetch(admin_app_url + "/helpcenter/faq_insert_content", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'title': title,
            'content': content,
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
                editorData.setData('');
                $('#title').val('');
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
            fetch(admin_app_url + "/helpcenter/faq_delete_content", { 
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
    fetch(admin_app_url + "/helpcenter/faq_edit_content", { 
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
            title = response[0].fields.title;
            content = response[0].fields.content;
            contentID = response[0].pk;

            console.log(content);

            editorData.setData(content);
            //$('#content').html(content);
            $('#title').val(title);

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
    //content = editorData.html.get();
    content = editorData.getData();
    title = $('#title').val();
    if (title === '')
    {
        toastr.options = {
            "positionClass": "toast-top-right",
            "timeOut": "3000"
          }
        toastr.error("Please insert title..");   
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
    fetch(admin_app_url + "/helpcenter/faq_update_content", { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({
            'id': id,
            'content': content,
            'title': title
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
    editorData.setData('');
    $('#title').val('');
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
    
    fetch(admin_app_url + "/helpcenter/faq_delete_content_bulk", { 
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
