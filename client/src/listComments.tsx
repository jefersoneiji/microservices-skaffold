const content = {
    'pending': 'This comment is awaiting moderation',
    'rejected': 'This comment has been rejected'
} as { [index: string]: string }

export const ListComments = ({ comments }: { comments: Array<any> }) => {

    return (
        <ul>
            {comments.map(elem => <li key={elem.id}>{elem.status !== 'approved' ? content[elem.status] : elem.content}</li>)}
        </ul>
    )
}

