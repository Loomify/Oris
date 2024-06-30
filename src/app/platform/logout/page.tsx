'use client'

import { useRouter } from "next/navigation"

export default function AccountLogout() {
    let router = useRouter()
    // All of this just to logout 😭
    fetch('/api/v1/account/logout').then((res)=>{res.json().then(r=>{
        if (r['HORIZON_STATUS'] == "logged_out") {
            router.push('/platform/account')
        }
    })
    })
}