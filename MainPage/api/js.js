$(function(){
    fetchArticle()
    $('#callModal').click(function(){
        $('#modalArticle').modal('show')
    })
    //When btn save was clicked
    $('#save').click(function(){
        let article = {
            TITLE: $('#title').val(),
            DESCRIPTION: $('#desc').val(),
            IMAGE: $('#image').val()
        }
        postArticle(article)
    })
    let search = document.getElementById('search');
search.onchange= function(){
    console.log($(this).val())
    searchArticle($('#search').val())
}
})
function postArticle(article){
    $.ajax({
        url: 'http://110.74.194.124:15011/v1/api/articles',
        method: 'POST',
        data: JSON.stringify(article),
        headers: {
            'content-type': 'application/json'
        },
        success: function(res){
            Swal.fire(
                `${res.MESSAGE}`)
              fetchArticle()
              $('#modalArticle').modal('hide')
        }, 
        error: function(er){
            console.log(er)
        }
    })
}
function fetchArticle(){
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?page=1&limit=15`,
        method: 'GET',
        success: function(res){
            console.log(res)
            appendToTable(res.DATA)
        },
        error: function(er){
            console.log(er)
        }
    })
}
function appendToTable(articles){
    let content = ''
    for (a of articles){
        content += `
        <tr>
            <th scope="row">${a.ID}</th>
            <td>${a.TITLE}</td>
            <td>${a.DESCRIPTION}</td>
            <td><img src=${a.IMAGE} /></td>
            <td><button class="btn btn-outline-danger waves" id="dID" data-id=${a.ID} onclick="deleteArticle(this)">Delete</button></td>
            <td><button class="btn btn-outline-success waves" onclick="goToDetail(${a.ID})">Detail</button></td>
          </tr>
        
        `
    }
    $('tbody').html(content)
}

function goToDetail(id){
    window.location.href= `detail.html?id=${id}`
}

function deleteArticle(btn){
    let id = $(btn).parent().siblings('th').text()
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `http://110.74.194.124:15011/v1/api/articles/${id}`,
                method: 'DELETE',
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": '*/*'
                },
                success: function(res){
                    console.table(res)
                    fetchArticle()
                },
                error: function(e){
                    console.log(e)
                }
            })
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
}





function searchArticle(title){
    $.ajax({
        url:`http://110.74.194.124:15011/v1/api/articles?title=${title}`,
        method:'GET',
        success: function(res){
            appendToTable(res.DATA)
        },
        error: function(er){
            console.log(er)
        }
    })
}