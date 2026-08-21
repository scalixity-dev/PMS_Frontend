/**
 * Styling for template document content, shared by every surface that shows it.
 *
 * Tailwind's preflight resets every `ul`/`ol` to `list-style: none`, and the
 * `prose` classes that would put the markers back never load: this project is
 * on Tailwind v4, which ignores `tailwind.config.js`, so the typography plugin
 * registered there is not active. A bulleted clause therefore rendered as flat
 * lines in the editor while the print iframe — a fresh document with no
 * preflight, falling back to the browser's own defaults — showed them fine. The
 * same lease looked different depending on where you read it.
 *
 * Blockquotes were invisible in both, for a different reason: the browser
 * default is only an indent, so a quoted clause read as ordinary text.
 *
 * Takes a scope selector rather than emitting global rules, so it cannot reach
 * the dashboard's own lists, and returns a string because the three consumers
 * inject CSS three different ways (an editor style tag, a modal style tag, and
 * a written-out print iframe).
 */
export const documentContentCss = (scope: string): string => `
    /* Preflight also flattens every heading to font-size: inherit, so H1/H2/H3
       applied the mark and still looked like body text — the toolbar button lit
       up and nothing else happened. */
    ${scope} h1,
    ${scope} h2,
    ${scope} h3,
    ${scope} h4,
    ${scope} h5,
    ${scope} h6 {
        /* 600, not 700, so bolding inside a heading is still a visible step up.
           Preflight gives strong a weight of "bolder", which over a 700 heading
           only reaches 900 — a difference Urbanist barely shows at heading
           sizes, so bold looked like it did nothing inside a heading. */
        font-weight: 600;
        color: #111827;
        line-height: 1.25;
        margin: 1.25rem 0 0.5rem;
    }
    ${scope} h1 { font-size: 1.875rem; }
    ${scope} h2 { font-size: 1.5rem; }
    ${scope} h3 { font-size: 1.25rem; }
    ${scope} h4 { font-size: 1.125rem; }
    ${scope} h5,
    ${scope} h6 { font-size: 1rem; }
    /* A heading opening the document should not push itself down the page. */
    ${scope} > :first-child { margin-top: 0; }
    /* Explicit weights rather than preflight's relative "bolder", which lands
       somewhere different depending on what it is nested in. Body text steps
       400 -> 700 and a heading steps 600 -> 800, so bold reads as bold in both. */
    ${scope} strong,
    ${scope} b { font-weight: 700; }
    ${scope} :is(h1, h2, h3, h4, h5, h6) strong,
    ${scope} :is(h1, h2, h3, h4, h5, h6) b { font-weight: 800; }
    ${scope} em,
    ${scope} i { font-style: italic; }
    ${scope} ul,
    ${scope} ol {
        padding-left: 1.5rem;
        margin: 0.75rem 0;
    }
    ${scope} ul { list-style: disc; }
    ${scope} ol { list-style: decimal; }
    ${scope} ul ul { list-style: circle; }
    ${scope} ol ol { list-style: lower-alpha; }
    ${scope} li { margin: 0.25rem 0; }
    /* StarterKit wraps list item content in a paragraph, and the paragraph rule
       would otherwise space every bullet like a paragraph break. */
    ${scope} li > p { margin: 0; }
    ${scope} blockquote {
        border-left: 3px solid #88D94C;
        padding-left: 1rem;
        margin: 0.75rem 0;
        color: #4b5563;
        font-style: italic;
    }
`;
