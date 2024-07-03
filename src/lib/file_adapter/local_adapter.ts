import * as fs from 'fs';
import * as path from 'path';

export async function localStorageAdapter(file: File, title: String) {
    // @ts-ignore
    let file_path = path.join(process.env.file_storage_path, `${title}${file.name}`)
    // @ts-ignore
    if (!fs.existsSync(process.env.file_storage_path)) {
        fs.mkdirSync(path.dirname(file_path), { recursive: true })
    }
    fs.writeFileSync(file_path, Buffer.from(await file.arrayBuffer()))
}