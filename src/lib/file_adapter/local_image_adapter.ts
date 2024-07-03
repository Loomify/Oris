import * as fs from 'fs';
import * as path from 'path';

export async function localImageAdapter(file: File, title: String) {
    // @ts-ignore
    let file_path = path.join('/public/images/', `${title}${file.name}`)
    // @ts-ignore
    if (!fs.existsSync('/public/images/')) {
        fs.mkdirSync(path.dirname(file_path), { recursive: true })
    }
    fs.writeFileSync(file_path, Buffer.from(await file.arrayBuffer()))
}