import '@/css/platform/account.css'
import { Input } from '@mantine/core'

export default function Account() {
    return (
        <>
            <div className='platform'>
                <div className='account-box'>
                    <h1>My account</h1>
                    <p>Log into Oris.</p>
                    <form className='login'>
                    </form>
                </div>
            </div>
        </>
    )
}