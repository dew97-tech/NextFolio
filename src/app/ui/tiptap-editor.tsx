"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Link as TipTapLink } from "@tiptap/extension-link";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Typography } from "@tiptap/extension-typography";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { createLowlight, common } from "lowlight";
import {
  ArrowUUpLeft,
  ArrowUUpRight,
  Code,
  Columns,
  Eye,
  HighlighterCircle,
  LinkSimple,
  ListBullets,
  ListChecks,
  ListNumbers,
  Minus,
  Paragraph,
  PencilSimple,
  Plus,
  Quotes,
  Rows,
  Table as TableIcon,
  TextB,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
  Trash,
} from "@phosphor-icons/react";
import { useState } from "react";

const lowlight = createLowlight(common);

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`flex h-8 w-8 min-w-8 shrink-0 items-center justify-center rounded transition-colors disabled:pointer-events-none disabled:opacity-30 ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-ink-muted hover:bg-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [showTableMenu, setShowTableMenu] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Write the post, or paste HTML",
      }),
      Typography,
      Highlight.configure({
        multicolor: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "underline underline-offset-4",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "article-content focus:outline-none min-h-[450px] p-4 md:p-6",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previousUrl || "");

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    setShowTableMenu(false);
  };

  const menuItem =
    "flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-foreground transition-colors hover:bg-accent";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`flex items-center gap-1.5 text-[13px] transition-colors ${
              activeTab === "write"
                ? "text-foreground underline decoration-1 underline-offset-4"
                : "text-ink-muted hover:text-foreground"
            }`}
          >
            <PencilSimple size={13} aria-hidden="true" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 text-[13px] transition-colors ${
              activeTab === "preview"
                ? "text-foreground underline decoration-1 underline-offset-4"
                : "text-ink-muted hover:text-foreground"
            }`}
          >
            <Eye size={13} aria-hidden="true" />
            Preview
          </button>
        </div>

        <div className="font-mono text-[11px] text-ink-faint">
          {editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      {activeTab === "write" ? (
        <>
          <div className="sticky top-14 z-20 flex flex-wrap items-center gap-1 border-b border-border bg-background p-2">
            <div className="flex items-center gap-0.5 border-r border-border pr-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                isActive={editor.isActive("paragraph")}
                title="Paragraph"
              >
                <Paragraph size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
                title="Heading 1"
              >
                <TextHOne size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
              >
                <TextHTwo size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
              >
                <TextHThree size={16} aria-hidden="true" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-0.5 border-r border-border px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                title="Bold (Ctrl+B)"
              >
                <TextB size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                title="Italic (Ctrl+I)"
              >
                <TextItalic size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                title="Strikethrough"
              >
                <TextStrikethrough size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive("highlight")}
                title="Highlight"
              >
                <HighlighterCircle size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                title="Inline code"
              >
                <Code size={16} aria-hidden="true" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-0.5 border-r border-border px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Bullet list"
              >
                <ListBullets size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Numbered list"
              >
                <ListNumbers size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive("taskList")}
                title="Checklist"
              >
                <ListChecks size={16} aria-hidden="true" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-0.5 border-r border-border px-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Quote"
              >
                <Quotes size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                title="Code block"
              >
                <Code size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Divider"
              >
                <Minus size={16} aria-hidden="true" />
              </ToolbarButton>
            </div>

            <div className="relative flex items-center border-r border-border px-1">
              <ToolbarButton
                onClick={() => setShowTableMenu((prev) => !prev)}
                isActive={editor.isActive("table") || showTableMenu}
                title="Table tools"
              >
                <TableIcon size={16} />
              </ToolbarButton>

              {showTableMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTableMenu(false)}
                  />
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-popover p-2">
                    {!editor.isActive("table") ? (
                      <div className="space-y-2 p-1">
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={insertTable}
                          className={menuItem}
                        >
                          <Plus size={14} aria-hidden="true" />
                          <span>Insert 3x3 table</span>
                        </button>
                        <p className="px-1 text-[11px] leading-relaxed text-ink-faint">
                          Adds a table with a header row.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="px-2 py-1 text-[11px] text-ink-faint">
                          Table
                        </p>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().addColumnAfter().run();
                            setShowTableMenu(false);
                          }}
                          className={menuItem}
                        >
                          <Columns size={14} aria-hidden="true" />
                          <span>Add column</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().addRowAfter().run();
                            setShowTableMenu(false);
                          }}
                          className={menuItem}
                        >
                          <Rows size={14} aria-hidden="true" />
                          <span>Add row</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().deleteColumn().run();
                            setShowTableMenu(false);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-danger transition-colors hover:bg-danger/10"
                        >
                          <Trash size={14} aria-hidden="true" />
                          <span>Delete column</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().deleteRow().run();
                            setShowTableMenu(false);
                          }}
                          className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-danger transition-colors hover:bg-danger/10"
                        >
                          <Trash size={14} aria-hidden="true" />
                          <span>Delete row</span>
                        </button>
                        <div className="mt-1 border-t border-border pt-1">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().deleteTable().run();
                              setShowTableMenu(false);
                            }}
                            className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-[13px] text-danger transition-colors hover:bg-danger/10"
                          >
                            <Trash size={14} aria-hidden="true" />
                            <span>Delete table</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-0.5 border-r border-border px-1">
              <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Link">
                <LinkSimple size={16} aria-hidden="true" />
              </ToolbarButton>
            </div>

            <div className="ml-auto flex items-center gap-0.5 pl-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
              >
                <ArrowUUpLeft size={16} aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
              >
                <ArrowUUpRight size={16} aria-hidden="true" />
              </ToolbarButton>
            </div>
          </div>

          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="mx-auto max-w-3xl p-6 md:p-10">
          {editor.getHTML() ? (
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          ) : (
            <p className="text-ink-faint">Nothing written yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
