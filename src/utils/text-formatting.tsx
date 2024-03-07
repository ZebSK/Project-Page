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
    // Splits the string into lines
    const lines = [text]
    return (
        <div>
            {/* Maps each line to a new component - this allows the removal of huge spaces around markdown lines without
                causing formatting issues with lists */}
            {lines.map((line, index) => (
                <ReactMarkdown className="reactMarkDown" key={index} children={line} />
            ))}

        </div>
    )
}