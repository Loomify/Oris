import '@/css/components/platform/platform_sidebar.css'
import Link from 'next/link'
import { Book, BookOpen, Bookmark, Search } from 'react-feather'
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
            <a className='sidebar-item'>
                <Search />
                Explore
            </a>
            <a className='sidebar-item'>
                <Bookmark />
                Saved
            </a>
        </div>
    )
}