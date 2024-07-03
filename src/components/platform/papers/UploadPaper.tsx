'use client'
import '@/css/components/platform/papers/UploadPaper.css'
import { Upload } from 'react-feather'

export function UploadPaper(args: any) {
    function fileUploadChange(event: any) {
        let file_text = document.getElementById('file_text') as HTMLElement
        file_text.innerText = `File selected: ${event.target.files[0].name}`
    }
    return (
        <>
            <label className='file_input'>
                <input type='file' name='file' className='file_upload' accept={args.accept} onChange={fileUploadChange} required />
                <span id='file_text'><Upload /> Choose a file</span>
            </label>
        </>
    )
}