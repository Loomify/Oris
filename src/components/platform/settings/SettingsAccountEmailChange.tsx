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

    return (
        <>

            <Modal opened={opened} onClose={close} title="Email Information"  centered className='changePasswordModal' style={{backgroundColor: 'black'}}>
                        <form action={changeAccountInformation} className='change_section'>
                            <div className='change_email'>
                                {/* @ts-ignore */}
                                <TextInput label='Email:' name='email' required/>
                                {/* @ts-ignore */}
                                <TextInput label='Confirm Email:' name='confirm_email' required/>
                            </div>
                            {/* @ts-ignore */}
                            <PasswordInput label='Confirm Password:' type='password' name='confirm_password' placeholder='Password' required/>
                            <Button type='submit' formAction={changeAccountInformation}>Change Information</Button>
                        </form>
            </Modal>
            <a onClick={open} className=' change_password' type='submit'><Mail /> Change Email</a>
        </>
    )
}