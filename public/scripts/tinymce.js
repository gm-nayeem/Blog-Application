window.onload = function() {
    tinymce.init({
        selector: '#tiny-mce-post-body',
        plugins: 'a11ychecker advcode casechange export formatpainter image editimage linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tableofcontents tinycomments tinymcespellchecker',
        toolbar: 'a11ycheck addcomment showcomments casechange checklist code export formatpainter image editimage pageembed permanentpen table tableofcontents',
        toolbar_mode: 'floating',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',  
        automatic_uploads: true,
        images_upload_url: '/uploads/postimage',
        relative_urls: false,
        images_upload_handler: function(blobInfo, success, failure) {
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON')

            let formData = new FormData()
            formData.append('post-image', blobInfo.blob(), blobInfo.filename())

            let req = new Request('/uploads/postimage', { 
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData
            })

            fetch(req)
                .then(res => res.json())
                .then(data => console.log(data))
                // .catch(() => failure('HTTP Error'))
        }

    })
}



