import { Node, mergeAttributes } from '@tiptap/core';
import {
  labelForToken,
  tokenForLabel,
} from '../../../../pages/Dashboard/features/Documents/autoFillFields';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    autoFillNode: {
      insertAutoFillNode: (label: string, token?: string) => ReturnType;
      insertSignatureField: (label: string, anchor: string) => ReturnType;
    };
  }
}

/**
 * A pill in the editor that serialises as a `{{token}}`.
 *
 * The two halves are deliberately different. `renderHTML` runs for
 * `editor.getHTML()`, which is what gets saved and later handed to
 * DocumentsService.renderTemplate, so it has to emit the token the renderer
 * substitutes. `addNodeView` runs for the editor's own DOM, so the author sees
 * "Lease Start Date" rather than `{{startDate}}`.
 *
 * Before this the pill emitted its label as plain text, which the renderer had
 * no reason to touch, so a finished lease read "Lease Start Date" where the
 * date belonged.
 */
export const AutoFillNode = Node.create({
  name: 'autoFillNode',
  group: 'inline',
  inline: true,
  atom: true,
  // Lets an author pick a placed pill up and move it, which is the only way to
  // reorder one without deleting and re-adding it.
  draggable: true,

  addAttributes() {
    return {
      label: {
        default: '',
        parseHTML: (element) =>
          element.getAttribute('data-label') ??
          element.getAttribute('label') ??
          labelForToken(element.getAttribute('data-token') ?? '') ??
          element.textContent ??
          '',
      },
      /** DocuSign anchor for a signature/initials/date field, if this is one. */
      anchor: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-anchor') ?? '',
      },
      token: {
        default: '',
        parseHTML: (element) => {
          const explicit = element.getAttribute('data-token');
          if (explicit) return explicit;

          // Heal a pill saved before tokens existed: it carries only its label,
          // so look the token back up rather than leaving a dead placeholder.
          const legacyLabel =
            element.getAttribute('data-label') ??
            element.getAttribute('label') ??
            element.textContent ??
            '';
          return tokenForLabel(legacyLabel.trim()) ?? '';
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-auto-fill-pill]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const token = typeof node.attrs.token === 'string' ? node.attrs.token : '';
    const label = typeof node.attrs.label === 'string' ? node.attrs.label : '';
    const anchor =
      typeof node.attrs.anchor === 'string' ? node.attrs.anchor : '';

    const attributes = mergeAttributes(HTMLAttributes, {
      'data-auto-fill-pill': 'true',
      'data-token': token,
      'data-label': label,
      'data-anchor': anchor,
      class: anchor ? 'auto-fill-pill signature-pill' : 'auto-fill-pill',
    });
    // `label`/`token` are node attributes, not HTML ones. Drop the raw copies
    // mergeAttributes carries over so the markup stays valid.
    delete (attributes as Record<string, unknown>).label;
    delete (attributes as Record<string, unknown>).token;
    delete (attributes as Record<string, unknown>).anchor;

    // A signature field carries the DocuSign anchor as text, because that is
    // what DocuSign searches the document for. It has to be invisible: printed
    // as-is the finished lease would read "**signature_0**" where the signing
    // box belongs. Same 1px white span the appended signature block uses.
    if (anchor) {
      return [
        'span',
        attributes,
        ['span', { style: 'color: #ffffff; font-size: 1px;' }, anchor],
        label,
      ];
    }

    // A pill with no known token would silently render as nothing, so fall
    // back to its label: visible and obviously unfilled beats invisible.
    return ['span', attributes, token ? `{{${token}}}` : label];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('span');
      dom.className = 'auto-fill-pill';
      dom.setAttribute('data-auto-fill-pill', 'true');
      dom.setAttribute('data-token', String(node.attrs.token ?? ''));
      dom.setAttribute('data-label', String(node.attrs.label ?? ''));
      if (node.attrs.anchor) {
        dom.setAttribute('data-anchor', String(node.attrs.anchor));
        dom.classList.add('signature-pill');
      }
      dom.contentEditable = 'false';
      dom.textContent =
        String(node.attrs.label || '') ||
        labelForToken(String(node.attrs.token || '')) ||
        String(node.attrs.token || '');
      return { dom };
    };
  },

  addCommands() {
    return {
      insertAutoFillNode:
        (label: string, token?: string) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs: { label, token: token ?? tokenForLabel(label) ?? '' },
            })
            .run(),

      insertSignatureField:
        (label: string, anchor: string) =>
        ({ chain }) =>
          chain()
            .insertContent({ type: this.name, attrs: { label, anchor } })
            .run(),
    };
  },
});
