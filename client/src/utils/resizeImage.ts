import Jimp from 'jimp';

export async function processImage(file: File) {
    try{
        let result = await readFileAsync(file);
        const image = await Jimp.read(result);
        image.resize(356, 290);
        return await image.getBufferAsync(Jimp.MIME_PNG);
    }
    catch(e){
        console.error(e);
    }
    
  }

  async function readFileAsync(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as Buffer);
        reader.onerror = error => reject(error);
    });
  }
