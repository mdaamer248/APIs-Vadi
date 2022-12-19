import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { catchError, map, tap } from 'rxjs/operators';
import { diskStorage } from 'multer';



export const storage = {
    storage: diskStorage({
      destination: './uploads/profileimages',
      filename: async (req, file, cb) => {
        const filename: string = await path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
  
        cb(null, `${filename}${extension}`);
      },
    }),
  };
  