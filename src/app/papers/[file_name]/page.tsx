import path from "path"
import * as fs from 'fs'
import '@/css/paper_storage.css'

export default function PaperStorage(args: any) {
    // serve stored file in storage
    if (process.env.file_storage_method?.toLowerCase() == 'local') {
        let file_name = args.params.file_name
        // @ts-ignore
        let file_path = path.join(process.env.file_storage_path, file_name)
        if (fs.existsSync(file_path)) {
            let file = fs.readFileSync(file_path)
            let file_type = 'application/pdf'
            return (
                <div className="file">
                    <embed src={`data:${file_type};base64,${file.toString('base64')}`} type={`${file_type}`} width="100%" height="1000px"></embed>
                </div>
            )
        } else {
            return (
                <div className="not-found">
                    <h1>File not found.</h1>
                    <p>It seems that the file that you were attempting to find could not be found.</p>
                </div>
            )
        }
    } else {
        return (
            <div className="not-found">
                <h1>File storage method not supported.</h1>
                <p>It seems that the file storage method that the server is using is not supported by the platform. Please do not rely on this route for file storage.</p>
            </div>
        )
    }
}