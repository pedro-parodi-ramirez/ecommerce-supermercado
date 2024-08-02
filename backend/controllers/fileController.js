import path from 'path';
import { variables } from '../config/config.js';

const rootPath = variables.PATH;

class FileController {
    static uploadFile = async (file, newName) => {
        let auxString = file.name.split('.');   // In case there are more dots in file name
        const fileExtension = auxString[auxString.length - 1];
        const publicPath = '/image/avatar/' + newName + '.' + fileExtension;
        const pathToFile = path.join(rootPath + '/../frontend/public' + publicPath);

        try {
            file.mv(pathToFile, (error) => {
                if (error) {
                    console.error(error);
                    return false;
                }
            });
            return publicPath;
        } catch (e) {
            console.log("Error saving file.\n" + e.message);
            return false;
        }
    }
}

export default FileController;