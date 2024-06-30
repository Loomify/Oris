'use client'

import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"

export function SettingsAccountDelete() {
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
            <Button onClick={deleteAccount} variant='filled' type='submit' color='rgba(189, 0, 0, 1)'>Delete Account</Button>
    )
}