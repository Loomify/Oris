'use client'
import '@/css/components/platform/settings/EditProfilePicture.css'
import { Button } from '@mantine/core'
import { useState } from 'react';
import { Upload } from 'react-feather';
export function EditProfilePicture(args: any) {
    const [profile_picture_preview, setPreview] = useState(null);
    function capturePreview(event: any) {
        const file = event.target.files[0];
        const fread = new FileReader();
        fread.onloadend = () => {
            // @ts-ignore
            setPreview(fread.result);
        }
        fread.readAsDataURL(file);
    }
    function updateProfilePicture(info: FormData) {
        let [profile_picture] = [info.get('profile_picture')];
        let image_contents = null;
        const reader = new FileReader();
        reader.onloadend = () => {
            image_contents = reader.result;
            fetch('/api/v1/platform/profile_picture', {
                'method': 'POST',
                'body': JSON.stringify({
                    'profile_picture': image_contents,
                })}).then((r) => {r.json().then((data) => {
                    if (data['HORIZON_STATUS'] == 'UPDATED_PROFILE_PICTURE') {
                        window.location.reload();
                    }
                })})
        }
        reader.readAsDataURL(profile_picture as Blob);
    }
    return (
        <div className='profile_picture_section'>
            <img className='profile_preview' src={profile_picture_preview || (args.profile_picture || "/default_pfp.png")} />
            <form action={updateProfilePicture}>
                <input type="file" name="profile_picture" onChange={capturePreview} accept="image/*" />
                <Button type="submit" color='green'><Upload /> Upload</Button>
            </form>
        </div>
    )
}