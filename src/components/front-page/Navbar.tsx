import '@/css/components/front-page/Navbar.css'
import { Button } from '@mantine/core'
import Link from 'next/link';
/*
REMINDER! THIS IS THE NAVBAR COMPONENT FOR THE FRONT PAGE AND RELATED PUBLIC-FACING PAGES, IT IS NOT FOR THE DASHBOARD.
*/

export function Navbar() {
    return (
        <>
            <nav className="navbar">
                <h1>Oris</h1>
                <ul>
                    <Button component={Link} href='/platform/account'>Account</Button>
                </ul>
            </nav>
        </>
    )
}