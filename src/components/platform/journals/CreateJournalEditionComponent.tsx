'use client'

import '@/css/platform/journals/journal.css'
import { Button, Modal, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from 'next/navigation';

export function CreateJournalEditionComponent(information: any) {
    let router = useRouter()
    function createEdition(args: FormData) {
        // Create edition
        let [name, description, release_date, papers] = [args.get('name'), args.get('description'), args.get('date'), args.get('papers_id')]
        fetch('/api/v1/journal/edition/create', {
            'method': 'POST',
            'body': JSON.stringify({
                'name': name,
                'description': description,
                'release_date': release_date,
                'papers': papers,
                'journal_id': information['journal_id']
            })
        }).then(r => r.json().then(data => {
            if (data['HORIZON_STATUS'] == 'SUCCESS') {
                close()
                router.refresh()
            }
        }))   
    }
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal opened={opened} onClose={close} title="Create Journal Edition"  centered className='editionModal' style={{color: 'black'}}>
                <form className='editionModalForm' action={createEdition}>
                    <TextInput label="Edition Name" name='name' placeholder="Edition Name" required />
                    <TextInput label="Edition Description" name='description' placeholder="Edition Description" required />
                    <TextInput label="Edition Release Date" name='date' type='date' placeholder="Edition Date" required />
                    <TextInput label="Edition Uploaded Papers ID (comma separated)" name='papers_id' placeholder="Edition Papers" required />
                    <Button type='submit' variant='filled' color='rgba(0, 189, 0, 1)'>Create Edition</Button>
                </form>
            </Modal>
            <Button onClick={open}>Create Edition</Button>
        </>
    )
}