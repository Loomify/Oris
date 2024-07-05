import '@/css/components/platform/platform_sidebar.css'
import Link from 'next/link'
import { Book, BookOpen, Bookmark, Search, Settings, User } from 'react-feather'
export function PlatformSidebar(args: any) {
    return (
        <div className="sidebar">
            <Link href={'/platform/papers'} className='sidebar-item'>
                <Book />
                Papers
            </Link>
            <Link href={'/platform/journals'} className='sidebar-item'>
                <BookOpen />
                Journals
            </Link>
            <Link href={'/platform/profile'} className='sidebar-item'>
                <User />
                Profile
            </Link>
            <Link href={'/platform/settings'} className='sidebar-item'>
                <Settings />
                Settings
            </Link>
        </div>
    )
}