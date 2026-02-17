import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'students-todo',
        allowed_formats: ['jpg','jpeg','png','webp'],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
