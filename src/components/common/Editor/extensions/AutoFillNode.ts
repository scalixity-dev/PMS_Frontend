import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    autoFillNode: {
      insertAutoFillNode: (label: string) => ReturnType;
    };
  }
}

export const AutoFillNode = Node.create({
  name: 'autoFillNode',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-auto-fill-pill]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const attributes = mergeAttributes(HTMLAttributes, {
      'data-auto-fill-pill': 'true',
      class: 'auto-fill-pill',
    });

    const label = typeof HTMLAttributes.label === 'string' ? HTMLAttributes.label : '';

    return ['span', attributes, label];
  },

  addCommands() {
    return {
      insertAutoFillNode:
        (label: string) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs: { label },
            })
            .run(),
    };
  },
});


