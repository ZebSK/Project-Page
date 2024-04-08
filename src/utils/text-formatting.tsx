/** 
 * @file text-formatting.tsx
 * 
 * @description
 * Utility functions related to the formatting and styling of text
 * This includes markdown and LaTeX
 * 
 * @exports markdownToHTML - A function converting markdown and LaTeX formatting to HTML
 */ 


// Import External Libraries
import { ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

/**
 * Converts a sting into a series of markdown React components
 * @param text The text to convert
 * @returns The React component containing the markdown text
 */
export function markdownLaTeXToHTML(text: string): ReactElement<any, any> {
  // Prevents collapsing of whitespace
  const lines = text.split("\n")
  for (let i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/^ /, '&nbsp;'); // Adds a non breaking space if line begins with a space
    lines[i] = lines[i].replace(/ $/g, '&nbsp;'); // Adds a non breaking space if line ends with a space
    if (lines[i] === "" && lines.length != 1) { lines[i] = "&nbsp;"} // Adds a non breaking space to every empty line (unless all text is empty)
  }
  const whitespacedText = lines.join("\n")
  const sections = whitespacedText.split(/(\$+[^$]*\$+)/g);

  return (
    <>
      {sections.map((str, index) => {
        if (str.startsWith("$")) {
          return <Latex key={index}>{str}</Latex>
        } else {
          return <ReactMarkdown key={index}>{str}</ReactMarkdown>;
        }
      })}
    </>
  );
}