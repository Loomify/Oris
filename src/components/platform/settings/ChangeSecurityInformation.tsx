'use client'
import '@/css/platform/settings_security.css'
import { Button, Modal, PasswordInput, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation"
import { Key } from 'react-feather';

export function ChangeSecurityInformation() {
    const [opened, { open, close }] = useDisclosure(false);
    // For redirects
    let router = useRouter()
    
    function changePassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // Gets form
        let form = event.currentTarget as HTMLFormElement;
        // Gets credentials
        let [current_password, new_password, confirm_new_password] = [form.current_password.value, form.new_password.value, form.confirm_new_password.value]
        if (new_password != confirm_new_password) {
            (document.getElementById('message_status') as HTMLParagraphElement).innerHTML = 'Passwords do not match.'
            return
        }
        // Change password route
        fetch('/api/v1/account/renew_credentials', {
            'method': 'POST',
            'body': JSON.stringify({
                'current_password': current_password,
                'new_password': new_password,
                'confirm_new_password': confirm_new_password
            })
        }).then((r) => {r.json().then(data => {
            if (data['HORIZON_STATUS'] == 'RENEWED_CREDENTIALS') {
                router.push('/platform/logout')
            } else {
                (document.getElementById('message_status') as HTMLParagraphElement).innerHTML = data['status']
            }
        })})               
    }
    return (
        <>
            <Modal opened={opened} onClose={close} title="Change Password"  centered className='changePasswordModal' style={{backgroundColor: 'black'}}>
                <form onSubmit={changePassword}>
                    <Text id='message_status'></Text>
                    <PasswordInput name='current_password' label='Current Password' required />
                    <PasswordInput name='new_password' label='New Password' required />
                    <PasswordInput name='confirm_new_password' label='Confirm New Password' required />
                    <br />
                    <Button className='submit_password_change' variant='filled' type='submit' color='rgba(31, 146, 204, 0.8)'>Change Password</Button>
                </form>
            </Modal>
            <a onClick={open} className='change_password' type='submit' color='rgba(31, 146, 204, 0.8)'><Key /> Change Password</a>
        </>
    )
}