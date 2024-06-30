import '@/css/components/platform/platform_sidebar.css'
import { Book, BookOpen, Bookmark, Search } from 'react-feather'
export function PlatformSidebar(args: any) {
    return (
        <div className="sidebar">
            <a className='sidebar-item'>
                <Book />
                Papers
            </a>
            <a className='sidebar-item'>
                <BookOpen />
                Journals
            </a>
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