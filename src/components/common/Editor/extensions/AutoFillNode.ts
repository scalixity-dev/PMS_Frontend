import { Node, mergeAttributes } from '@tiptap/core';
import {
  labelForToken,
  tokenForLabel,
} from '../../../../pages/Dashboard/features/Documents/autoFillFields';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    autoFillNode: {
      insertAutoFillNode: (label: string, token?: string) => ReturnType;
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

    const attributes = mergeAttributes(HTMLAttributes, {
      'data-auto-fill-pill': 'true',
      'data-token': token,
      'data-label': label,
      class: 'auto-fill-pill',
    });
    // `label`/`token` are node attributes, not HTML ones. Drop the raw copies
    // mergeAttributes carries over so the markup stays valid.
    delete (attributes as Record<string, unknown>).label;
    delete (attributes as Record<string, unknown>).token;

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
    };
  },
});
