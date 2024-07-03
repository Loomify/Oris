'use client'

import { MenuItem, MenuLabel, rem } from "@mantine/core"
import { useRouter } from "next/navigation"
import { Trash2 } from "react-feather"

export function JournalEditionMenu(args: any) {
    let router = useRouter()
    function deleteJournal() {
        let journal_id = args.journalID
        // @ts-ignore
        fetch('/api/v1/journal/delete', {
            method: 'POST',
            body: JSON.stringify({
                'journal_id': journal_id
            })
        }).then((r)=>{r.json().then((data)=> {
            if (data['HORIZON_STATUS'] == 'SUCCESS') {
                router.push('/platform/journals')
            } else {
                alert('An error occurred.')
            }
        })})
    }
    return (
        <>
            <MenuLabel>Danger Zone</MenuLabel>
            <MenuItem onClick={deleteJournal} leftSection={<Trash2 style={{width: rem(20), height: rem(20), color: "red"}}/>}> Delete</MenuItem>
        </>
    )
}