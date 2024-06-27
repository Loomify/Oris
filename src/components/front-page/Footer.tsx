import '@/css/components/front-page/Footer.css'
import Link from 'next/link'
/*
REMINDER! THIS IS THE NAVBAR COMPONENT FOR THE FRONT PAGE AND RELATED PUBLIC-FACING PAGES, IT IS NOT FOR THE DASHBOARD.
*/

export function Footer() {
    return (
        <>
            <footer className="footer">
                <div className='footer-content'>
                    <div className='footer-left'>
                        <h1>Oris</h1>
                    </div>
                    <div className='footer-right'>
                        <div className='links'>
                            <p><strong>Platform</strong></p>
                            <ul>
                                <li><Link href='/platform/account'>Account</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
            <div className='attribution'>
                <p>©{(new Date().getFullYear())} Loom. All rights reserved.</p>
            </div>
        </>
    )
}