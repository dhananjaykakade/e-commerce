const multer = require('multer');



const storage = multer.diskStorage({
    destination:(req,file,cb) => {
      cb=(null,'./uploads/');
    },
    filename:(req,file,cb) => {
      cb(null,Date.now+'-'+file.originalname)
    }
})


// const filefilter = (req,file,cb)=>{
//     if (file.mimetype==='image/jpg'||file.mimetype==='image/png') {
//         cb(null,true)
//     }else
//     cb({message:'not uploaded because file format'},false)
// }

const upload = multer({
    storage:storage,
    // fileFilter:filefilter
})

module.exports = upload