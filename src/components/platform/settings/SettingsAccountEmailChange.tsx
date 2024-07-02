'use client'
import '@/css/platform/settings.css'
import { changeAccountInformation } from '@/lib/changeEmail';
import { Button, Modal, PasswordInput, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation"
import { Mail, Trash } from 'react-feather';

export function SettingsAccountEmailChange() {
    const [opened, { open, close }] = useDisclosure(false);
    // For redirects
    let router = useRouter()

    // Delete account
    function deleteAccount() {
        fetch('/api/v1/account/delete', {
            'method': 'DELETE'
        }).then(res => res.json()).then(data => {
            if (data['HORIZON_STATUS'] == 'SUCCESS') {
                router.push('/platform/logout')
            }
        })
    }

    function leadChangeEmail(event: any) {
        changeAccountInformation(event).then((data) => {
            // @ts-ignore
            if (data['HORIZON_STATUS'] == 'LOGOUT') {
                router.push('/platform/logout')
            } else {
                // @ts-ignore
                (document.getElementById('email_change_message_status') as HTMLElement).innerHTML = data['SIG']
            }
        })
    }

    return (
        <>

            <Modal opened={opened} onClose={close} title="Email Information"  centered className='changePasswordModal' style={{backgroundColor: 'black'}}>
                        <form action={leadChangeEmail} className='change_section'>
                            <p id='email_change_message_status'></p>
                            <div className='change_email'>
                                {/* @ts-ignore */}
                                <TextInput label='Email:' name='email' required/>
                                {/* @ts-ignore */}
                                <TextInput label='Confirm Email:' name='confirm_email' required/>
                            </div>
                            {/* @ts-ignore */}
                            <PasswordInput label='Confirm Password:' type='password' name='confirm_password' placeholder='Password' required/>
                            <Button type='submit' formAction={leadChangeEmail}>Change Information</Button>
                        </form>
            </Modal>
            <a onClick={open} className=' change_password' type='submit'><Mail /> Change Email</a>
        </>
    )
}