const multer  = require('multer')
const path = require('path')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
//     }
// })


const uploadFolder = 'public/uploads' 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
      const fileExt = path.extname(file.originalname)
      const fileName = file.originalname
                            .replace(fileExt, "")
                            .toLocaleLowerCase()
                            .split(" ")
                            .join("-") + "-" + Date.now();

      cb(null, fileName + fileExt);
    }
})


const upload = multer({ 
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        console.log(file);
        const types = /jpeg|jpg|png|gif/
        const extName = types.test(path.extname(file.originalname).toLowerCase())
        const mimeType = types.test(file.mimetype)

        if(extName && mimeType){
            cb(null, true)
        } else {
            cb(new Error('Only Support Images'))
        }
    }
})




module.exports = upload;