import { Injectable } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private renderer = new marked.Renderer();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Configure options for marked
    marked.setOptions({
      renderer: this.renderer,
      gfm: true,
      breaks: true,
      pedantic: false
    });

    // Customize code block rendering to include language class for syntax highlighting
    this.renderer.code = ({ text, lang, escaped }: { text: string, lang?: string, escaped?: boolean }) => {
      const language = lang || 'plaintext';
      return `<pre><code class="hljs language-${language}">${text}</code></pre>`;
    };
  }

  /**
   * Parses markdown string to HTML with sanitization
   */
  parse(markdown: string): string {
    if (!markdown) {
      return '';
    }
    
    try {
      // Convert markdown to HTML
      const html = marked.parse(markdown) as string;
      
      // Sanitize the HTML to prevent XSS attacks (only in browser environment)
      if (isPlatformBrowser(this.platformId)) {
        return DOMPurify.sanitize(html, {
          ADD_ATTR: ['target'],  // Allow target attribute for links
          USE_PROFILES: { html: true }  // Use HTML profile for sanitization
        });
      }
      
      return html;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '';
    }
  }
}
