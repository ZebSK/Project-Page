import { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';

export function markdownToHTML(text: string): ReactElement<any, any> {
    return (
        <ReactMarkdown className="reactMarkDown">{text}</ReactMarkdown>
    )
}