window.onload = function() {
    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach(bookmark => {
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click', function(e) {
            let target = e.target.parentElement
            // console.log(target)
            //target.innerHTML = '<i class="fas fa-bookmark"></i>'
            
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')
            console.log(target.dataset.post)
            let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method: 'GET',
                headers,
                mode: 'cors'
            })

            fetch(req) 
                .then(res => res.json())
                console.log(res)
                .then(data => {
            
                    if(data.bookmark) {
                        target.innerHTML = '<i class="fas fa-bookmark"></i>'
                    } else {
                        target.innerHTML = '<i class="far fa-bookmark"></i>'
                    }
                })
                .catch(e => {
                    console.log("error")
                    //console.log(e.response.data.error)
                    alert(e)
                })
        })
    })
}