window.onload = function() {

    const commentHolder = document.getElementById('comment-holder')

    commentHolder.addEventListener('keypress', function(e) {
        if(commentHolder.hasChildNodes(e.target)) {
            if(e.key === 'Enter') {
                let commentId = e.target.dataset.comment
                let value = e.target.value

                if(value) {
                    let data = {
                        body: value
                    }
                    let req = generateRequest(`/api/comments/replies/${commentId}`, 'POST', data)
                    fetch(req)
                        .then(res => res.json())
                        .then(data => {
                            let replyElement = createReplyComment(data)
                            let parent = e.target.parentElement
                            parent.previousElementSibling.appendChild(replyElement)
                            e.target.value = ''
                        })
                        .catch(e => {
                            console.log(e.message)
                            alert(e.message)
                        })
                        
                } else {
                    alert('Please Enter A Valid Reply')
                }
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

function createReplyComment(reply) {
    console.log(reply.profilePics)
    let innerHtml = `
        <img src="${reply.profilePics}" class="align-self-start mr-3 rounded-circle" 
        style="width: 40px">
        <div class="media-body">
            <p>${reply.body}</p>
        </div>
    `

    let div = document.createElement('div') 
    div.className = 'media mt-3'
    div.innerHTML = innerHtml
    return div
}