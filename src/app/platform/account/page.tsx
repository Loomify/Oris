'use client';
import '@/css/platform/account.css'
import { Button, TextInput } from '@mantine/core'
import { useRouter } from 'next/navigation';
export default function Account() {
    let router = useRouter()
    function accessAccount(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        // Gets form
        let form = event.currentTarget as HTMLFormElement;
        // Gets credentials
        let [email, password] = [form.email.value, form.password.value]
        // Might be complicated but basically we are submitting the email and password to the API so we can authenticate
        fetch('/api/v1/account/access', {
            'method': 'POST',
            'body': JSON.stringify({
                'email': email,
                'password': password
            })
        }).then(d=>{/*Basically this just gets .json within promise of fetch so we can get the actual data*/d.json().then(data=>{
            console.log(data)
            if (data['HORIZ_STAT'] == "LOGGED_IN") {
                router.push('/platform')
            } else {
                let status_bar = document.getElementById('oris-status') as HTMLElement
                status_bar.innerHTML = 'Invalid credentials. Please try again.'
            }
        })})
    }
    return (
        <>
            <div className='platform'>
                <div className='account-box'>
                    <h1>Oris Account</h1>
                    <p>You can login or create an Oris account through here.</p>
                    <p id='oris-status'></p>
                    {/* Submits to our function to authenticate */}
                    <form className='access' onSubmit={accessAccount}>
                        <TextInput className='input' variant='filled' label="Email:" type="email" name='email' placeholder='df@avnce.org' required />
                        <TextInput className='input' variant='filled' label="Password:" type="password" name='password' placeholder='Password' required />
                        <Button color='#4FC1DF' type='submit'>Access Account</Button>
                    </form>
                    <p>©{new Date().getFullYear()} Loom.</p>
                </div>
            </div>
        </>
    )
}