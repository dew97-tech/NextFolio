"use client";

import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    codeBlockPlugin,
    codeMirrorPlugin,
    CreateLink,
    headingsPlugin,
    imagePlugin,
    InsertCodeBlock,
    InsertTable,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor,
    quotePlugin,
    Separator,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface MarkdownEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export default function MarkdownEditor({ markdown, onChange }: MarkdownEditorProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          tablePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({ codeBlockLanguages: { js: "JavaScript", ts: "TypeScript", css: "CSS", html: "HTML", python: "Python" } }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <CreateLink />
                <Separator />
                <ListsToggle />
                <Separator />
                <InsertTable />
                <Separator />
                <InsertThematicBreak />
                <Separator />
                <InsertCodeBlock />
              </>
            ),
          }),
        ]}
        className="prose prose-slate dark:prose-invert max-w-none"
        contentEditableClassName="min-h-[400px] p-4"
      />
    </div>
  );
}
