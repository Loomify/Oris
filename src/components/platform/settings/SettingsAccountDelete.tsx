'use client'
import '@/css/platform/settings.css'
import { Button, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation"
import { Trash } from 'react-feather';

export function SettingsAccountDelete() {
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
            <Modal opened={opened} onClose={close} title="Account Deletion"  centered className='deletionModal' style={{backgroundColor: 'black'}}>
                <h2 className='confirmation_head'>Are you sure you would like to delete your account?</h2>
                <p>This action is irreversible and will delete all of your data, including what you have uploaded to the platform. </p>
                <br />
                <Button onClick={deleteAccount} className='submit_delete' variant='filled' type='submit' color='rgba(189, 0, 0, 1)'>Delete Account</Button>
            </Modal>
            <a onClick={open} className=' change_password' type='submit'><Trash /> Delete Account</a>
        </>
    )
}