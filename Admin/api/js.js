// main function
$(function () {
    getArticle();

    $('#callModal').click(function () {
        $('#modalArticle').modal('show')
        $('#title').val('')
        $('#description').val('')
        $('#image').val('')
        // set 'Add Record' as title of add modal
        $('#modalTitle').text('Add Record')
    })

    // when click on button Save
    $('#btnSave').click(function () {
        let newArticles = {
            TITLE: $('#title').val(),
            DESCRIPTION: $('#description').val(),
            IMAGE: $('#image').val()
        }
        // check condition to know if Add or Edit
        if ($('#modalTitle').text() == 'Add Record') {
            postArticle(newArticles)
        } else {
            console.log($('#modalTitle').text())
            updateArticle(newArticles, $('#id').val())

        }
    })

    // when user search for title
    /* with JavaScript
    // let _search = document.getElementById('search');
    // _search.onkeyup = function (){
    //     searchArticle($('#search').val())
    // }

    /* with jQuery*/
    /*real time search */
    $('#search').keyup(function () {
        searchArticleByTitle($(this).val())
    })
})

// search title of the article
function searchArticleByTitle(title) {
    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?title=${title}&page=1&limit=2`,
        method: 'GET',
        success: function (response) {
            appendToTable(response.DATA)
        },

        error: function (error) {
            console.log(error)
        }

    })
}

// post article
function postArticle(newArticles) {
    $.ajax({
        url: 'http://110.74.194.124:15011/v1/api/articles',
        method: 'POST',
        data: JSON.stringify(newArticles),
        headers: {
            'content-type': 'application/json'
        },
        success: function (response) {
            Swal.fire(
                `${response.MESSAGE}`
            )
            getArticle()
            $('#modalArticle').modal('hide')
        },

        error: function (error) {

        }
    })
}

// get article
function getArticle() {

    $.ajax({
        url: `http://110.74.194.124:15011/v1/api/articles?page=1&limit=2`,
        method: 'GET',
        success: function (response) {
            console.log(response)
            appendToTable(response.DATA)
        },

        error: function (error) {
            console.log(error)
        }

    })

}

// append to table
function appendToTable(articles) {
    let content = ''
    for (a of articles) {
        content += `
            <tr>
                    <th scope="row">${a.ID}</th>
                    <td><b>${a.TITLE}</b></td>
                    <td>${a.DESCRIPTION}</td>
                    <td><img class='img' src='${a.IMAGE}'/></td>
                    <td>
                        <button class="btn btn-outline-danger waves" onclick="deleteArticles(this)">Delete</button>
                        <button class="btn btn-outline-success waves" onclick="goToDetail(${a.ID})">View</button>
                        <button class="btn btn-outline-info waves" onclick="showModal('${a.TITLE}', '${a.DESCRIPTION}', '${a.IMAGE}', '${a.ID}')">Edit</button>
                    </td>
                </tr>
        `
    }

    $('tbody').html(content);
}

function showModal(ti, de, im, id) {
    console.log(ti, de, im, id)
    $('#modalArticle').modal('show')
    $('#title').val(ti)
    $('#description').val(de)
    $('#image').val(im)
    $('#id').val(id)
    $('#modalTitle').text('Edit Record')
}

function updateArticle(newArticles, id) {
    $.ajax({
        url: 'http://110.74.194.124:15011/v1/api/articles/' + id,
        method: 'PUT',
        data: JSON.stringify(newArticles),
        headers: {
            'content-type': 'application/json'
        },
        success: function (response) {
            Swal.fire(
                `${response.MESSAGE}`
            )
            getArticle()
            $('#modalArticle').modal('hide')
        },

        error: function (error) {

        }
    })
}

function goToDetail(id) {
    window.location.href = `OriAMSdetail.html?id=${id}`

}

// delete article
function deleteArticles(btn) {
    let _id = $(btn).parent().siblings('th').text()
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
                url: `http://110.74.194.124:15011/v1/api/articles/${_id}`,
                method: 'DELETE',
                success: function (response) {
                    console.table(response)
                    getArticle()
                },

                error: function (error) {
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