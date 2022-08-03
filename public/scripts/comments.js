window.onload = function() {
    const comment = document.getElementById('comment')
    const commentHolder = document.getElementById('comment-holder')

    comment.addEventListener('keypress', function(e){
        if(e.key === 'Enter') {
            if(e.target.value) {
                let postId = comment.dataset.post
                let data = {
                    body: e.target.value
                }

                let req = generateRequest(`/api/comments/${postId}`, 'POST', data)
                    fetch(req)
                        .then(res => res.json())
                        .then(data => {
                            let commentElement = createComment(data)
                            commentHolder.insertBefore(commentElement, commentHolder.children[0])
                            e.target.value = ''
                        })
                        .catch(e => {
                            console.log(e.message)
                            alert(e.message)
                        })

            } else {
                alert('Please Enter A Valid Comment')
            }
        }
    })

}

function generateRequest(url, method, body) {
    let headers = new Headers()
    headers.append('Accept', 'Application/JSON')
    headers.append('content-type', 'Application/JSON')

    let req = new Request(url, {
        method,
        headers,
        body: JSON.stringify(body),
        mode: 'cors'
    })

    return req
}

function createComment(comment) {
    console.log(comment.user.profilePics)
    let innerHtml = `
        <img src="${comment.user.profilePics}" class="rounded-circle mx-3 my-3" 
        style="width: 40px">
        <div class="media-body my-3">
            <p>${comment.body}</p>
            <div class="my-3">
                <input type="text" class="form-control" placeholder="Press Enter to Reply" 
                name="reply" data-comment=${comment._id}>
            </div>
        </div>
    `

    let div = document.createElement('div') 
    div.className = 'media border'
    div.innerHTML = innerHtml
    return div
    
}
