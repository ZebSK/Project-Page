import { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';

/** 
 * @file This module contains everything that to do with formatting text 
 * @module TextFormatting
 */ 

/**
 * Converts a sting into a series of markdown React components
 * @param text The text to convert
 * @returns The React component containing the markdown text
 */
export function markdownToHTML(text: string): ReactElement<any, any> {
    // Allows keeping of whitespace
    text = text.replace(/ /g, '&nbsp;'); // Replaces spaces with non breaking spaces
    text = text.replace(/\n{2,}/g, match => { // Adds a non breaking space between new lines
        return '&nbsp;\n'.repeat(match.length - 1) + '&nbsp;\n';
      });      
    if (text.endsWith('\n')) { text += '&nbsp;'; } // Adds a non breaking space if new line at end
    if (text.startsWith('\n')) { text = '&nbsp;' + text; } // Adds a non breaking space if new line at start

    return (
        <ReactMarkdown className="reactMarkDown">{text}</ReactMarkdown>
    )
}