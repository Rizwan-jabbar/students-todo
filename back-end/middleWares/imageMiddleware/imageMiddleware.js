import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination : function(req , file , cb){
        cb(null , uploadDir);;
    },

    filename : function(req , file , cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null , file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

const filterImage = function(req , file , cb) {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null , true);
}
    else{
        cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false);
    }
}

const upload = multer({storage : storage , fileFilter : filterImage , limits : {fileSize : 5 * 1024 * 1024}})

export default upload;  