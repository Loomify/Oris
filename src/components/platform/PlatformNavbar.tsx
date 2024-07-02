import '@/css/components/platform/platform_navbar.css'
import Link from 'next/link'
import { Button, Menu, MenuDivider, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Text, rem } from '@mantine/core';
import { LogIn, LogOut, Settings, User } from 'react-feather';
import Image from 'next/image';

export function PlatformNavbar(props: any) {
    return (
        <nav className="plat-nav">
            <Link href={'/platform'} className='header_brand'>Oris</Link>
            <Menu trigger="hover" openDelay={200} closeDelay={200} transitionProps={{transition: 'fade', duration: 150}}>
                <MenuTarget>
                    <a className='profile-picture-central'><Image className='profile-picture' src={props.profileInfo['profile_pic']} alt='Profile Picture' width={40} height={40} /></a>
                </MenuTarget>
                <MenuDropdown className='dropdown'>
                    <MenuLabel>Accounts</MenuLabel>
                    {(props.profileInfo['user_role'] == 'guest') ? (<>
                        <MenuItem component={Link} href={'/platform/account'} leftSection={<LogIn style={{width: rem(20), height: rem(20)}}/>}>
                        Log In
                        </MenuItem>
                    </>) : (<>
                                            <MenuItem component={Link} href={'/platform/profile'} leftSection={<User style={{width: rem(20), height: rem(20)}} />}>Profile</MenuItem>
                        <MenuItem component={Link} href={'/platform/settings'} leftSection={<Settings style={{width: rem(20), height: rem(20)}}/>}>Settings</MenuItem>
                        <MenuItem component={Link} href={'/platform/logout'} leftSection={<LogOut style={{width: rem(20), height: rem(20)}}/>}>
                            Log Out
                        </MenuItem>
                    </>)}
                </MenuDropdown>
            </Menu>
        </nav>
    )
}