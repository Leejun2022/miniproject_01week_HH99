function login() {
    window.location.href = "/login"
}

function mypage(getUrl) {
     window.location.href = "/"
}

function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/'
}

function heart_click() {
    alert("하트를 눌렀습니다!")
}

function post() {
    let url = $('#url-input').val()
    let today = new Date().toISOString()
    if (url == "") {
        alert("URL을 입력하세요!")
    } else {
        $.ajax({
            type: 'POST',
            url: '/posting',
            data: {url_give:url, date_give:today},
            success: function (response) {
                if (response['msg']) {
                    alert(response['msg'])
                } else {
                    alert(response['msg'])
                }
                window.location.reload()
            }
        });
    }
}

function listing(username) {
    if (username == undefined) {
        username = ""
    }
    $('#card-div').empty()
    $.ajax({
        type: 'GET',
        url: `/posting?username_give=${username}`,
        data: {},
        success: function (response) {
            let rows = response['posts']
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let artist = rows[i]['artist']
                let album_title = rows[i]['album_title']
                let album_img = rows[i]['album_img']
                let genre = rows[i]['genre']
                let url = rows[i]['melon_url']
                let temp_html = `<div class="album-card" onclick="openModal('${url}')">
                                    <div class="album-img-div">
                                        <img src="${album_img}"
                                             class="album-img">
                                        <i onclick="heart_click()" class="fa-solid fa-heart"></i>
                                    </div>
                                    <div class="album-item">
                                        <span class="music-title">${title}</span>
                                        <span class="music-artist">${artist}</span>
                                        <span class="album-title">${album_title}</span>
                                        <span class="album-genre" id="genre">${genre}</span>
                                    </div>
                                </div>`
                $('#card-div').append(temp_html)
            }
        }
    });
}

function genre(genre_key, genre_key2, genre_key3, username) {
    if (username == undefined) {
        username = ""
    }
    $('.album-card').remove()
    $.ajax({
        type: 'GET',
        url: `/posting?username_give=${username}`,
        data: {},
        success: function (response) {
            let rows = response['posts']
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let artist = rows[i]['artist']
                let album_title = rows[i]['album_title']
                let album_img = rows[i]['album_img']
                let genre = rows[i]['genre']
                let url = rows[i]['melon_url']
                let temp_html = `<div class="album-card" onclick="openModal('${url}')">
                                    <div class="album-img-div">
                                        <img src="${album_img}"
                                             class="album-img">
                                        <i onclick="heart_click()" class="fa-solid fa-heart"></i>
                                    </div>

                                    <div class="album-item">
                                        <span class="music-title">${title}</span>
                                        <span class="music-artist">${artist}</span>
                                        <span class="album-title">${album_title}</span>
                                        <span class="album-genre" id="genre">${genre}</span>
                                    </div>
                                </div>`
                if (genre.includes(genre_key) || genre.includes(genre_key2) || genre.includes(genre_key3)) {
                    $('#card-div').append(temp_html)
                }
            }
        }
    });
}

function openModal(getUrl, username) { //getUrl부분이 클릭할 때 가져오는 url
    $('#modalCard').remove() // append 하는 부분을 하나의 div로 묶고 id값 줘서 remove 해주면 기존 데이터 삭제됨
    $('#modalBox').removeClass('displayNone') // 클릭하면 displayNone 클래스가 지워지면서 모달창이 나타남
    if (username == undefined) {
        username = ""
    }
    $.ajax({
        type: 'GET',
        url: `/posting?username_give=${username}`,
        data: {},
        success: function (response) {
            let rows = response['posts']
            for (let i = 0; i < rows.length; i++) {
                let title = rows[i]['title']
                let artist = rows[i]['artist']
                let album_title = rows[i]['album_title']
                let album_img = rows[i]['album_img']
                let genre = rows[i]['genre']
                let url = rows[i]['melon_url']
               // {# 클릭할 때 url 값을 가져오기 ()괄호 안에 '' 작은따옴표 꼭 넣어야함 #}
                if (url == getUrl) {
                    let temp_html = `<div class="modalFlexbox" id="modalCard">
                                        <div class="songImg">
                                            <img src="${album_img}">
                                        </div>
                                        <div class="wrap1">
                                            <span class="music-title">${title}</span>
                                            <span class="music-artist">${artist}</span>
                                            <br>
                                            <span class="album-title">${album_title}</span>
                                            <span class="album-genre" id="genre">${genre}</span>
                                        </div>
                                    </div>`
                    $('#modalInfo').append(temp_html)
                    comment_get(getUrl)
                    $('#commentBtn').removeAttr("onclick")
                    $('#commentBtn').attr("onclick",`comment_post('${url}')`)

                }
            }
        }
    })
}

function comment_get(getUrl) {
    $('#modalCommentsWrap').empty()
    $.ajax({
        type: 'GET',
        url: '/comment',
        data: {},
        success: function (response) {
            let rows = response['comments']
            console.log(rows)
            for (let i = 0; i < rows.length; i++) {
                let comment = rows[i]['comment']
                let url = rows[i]['url']
                if (url == getUrl) {
                    let temp_html = `<div class="container card mb-3 modalComments">
                                            <div class="row g-0 comment">
                                                <figure class="image is-48x48">
                                                    <img class="is-rounded" src="https://bulma.io/images/placeholders/128x128.png">
                                                </figure>
                                                <div class="col-md-11 commentProfileBody">
                                                    <div class="card-body">
                                                        <p class="card-title">닉네임</p>
                                                        <p class="card-text">${comment}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
                    $('#modalCommentsWrap').append(temp_html)
                }
            }
        }
    });
}


function comment_post(getUrl) {
    let comment = $('#commentWrite').val()
    let today = new Date().toISOString()
    let url = getUrl
    if (comment == "") {
        alert("댓글을 입력해주세요.")
    } else {
        $.ajax({
            type: 'POST',
            url: '/comment',
            data: {comment_give: comment, date_give: today, url_give: url},
            success: function (response) {
                alert(response['msg'])
                window.location.reload()
            }
        });
    }
}


$(document).mouseup(function (e) {
    let ModalBox = $('#modalBox');
    if (ModalBox.has(e.target).length === 0) {
        ModalBox.addClass("displayNone");
    }
});

function closeBtn() {
    $('#modalBox').addClass('displayNone')
}
