'use client';

import { Button, Input, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function PreviewImage() {
    let router = useRouter();
    const [preview, setPreview] = useState(null);
    function fileInputReferencer(event: any) {
        const file = event.target.files[0];
        const fread = new FileReader();
        fread.onloadend = () => {
            // @ts-ignore
            setPreview(fread.result);
        }
        fread.readAsDataURL(file);
    }
    async function saveSubmit(info: FormData) {
        let [profile_picture, organization] = [info.get('profile_picture'), info.get('organization')]
        let image_contents = null;
        const reader = new FileReader();
        reader.onloadend = () => {
            image_contents = reader.result;
            fetch('/api/v1/platform/profile', {
                'method': 'POST',
                'body': JSON.stringify({
                    'profile_picture': image_contents,
                    'organization': organization
                })
            }).then((res) => {
                res.json().then((d) => {
                    if (d['status'] == 'error') {
                        router.refresh()
                    }
                })
            })
        }
        reader.readAsDataURL(profile_picture as Blob);
    }
    return (
        <form method='POST' action={saveSubmit}>
            <div className="image_setup">
                <Input id="file_input" type='file' name="profile_picture" onChange={fileInputReferencer} accept="image/*" required />
                {/* @ts-ignore */}
                {(preview && preview.startsWith('data:')) ? (
                    <>
                        <img src={preview} alt='preview' className="preview" />
                    </>
                ) : (<>
                        <img src='/default_pfp.png' alt='preview' className="preview" />
                </>)}
            </div>
            <TextInput label='Organization Name' variant='filled' name='organization' required />
            <br />
            <Button type='submit'>Finish setup</Button>
        </form>
    )
}