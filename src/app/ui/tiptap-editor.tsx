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
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListCheck,
  Quote,
  Code,
  Highlighter,
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Minus,
  Pilcrow,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Columns,
  Rows,
} from "lucide-react";
import { useState } from "react";

const lowlight = createLowlight(common);

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
        placeholder: "Tell your story, draft your engineering guide, or paste your HTML article...",
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
          class: "text-primary underline hover:text-primary/80",
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
    const url = window.prompt("Enter URL:", previousUrl || "");

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

  const ToolbarButton = ({
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
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`h-8 w-8 min-w-8 rounded-lg transition-all text-xs font-semibold flex items-center justify-center shrink-0 disabled:opacity-30 disabled:pointer-events-none ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs font-bold"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "write"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          {editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      {activeTab === "write" ? (
        <>
          <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card/95 backdrop-blur">
            <div className="flex items-center gap-0.5 pr-1 border-r border-border/50">
              <ToolbarButton
                onClick={() => editor.chain().focus().setParagraph().run()}
                isActive={editor.isActive("paragraph")}
                title="Paragraph"
              >
                <Pilcrow className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
                title="Heading 1"
              >
                <Heading1 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-0.5 px-1 border-r border-border/50">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                isActive={editor.isActive("highlight")}
                title="Highlight"
              >
                <Highlighter className="w-4 h-4 text-amber-500" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                title="Inline Code"
              >
                <Code className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-0.5 px-1 border-r border-border/50">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive("taskList")}
                title="Task Checklist"
              >
                <ListCheck className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-0.5 px-1 border-r border-border/50">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive("codeBlock")}
                title="Code Block"
              >
                <Code className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Divider"
              >
                <Minus className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="relative flex items-center px-1 border-r border-border/50">
              <ToolbarButton
                onClick={() => setShowTableMenu((prev) => !prev)}
                isActive={editor.isActive("table") || showTableMenu}
                title="Table Tools"
              >
                <TableIcon className="w-4 h-4" />
              </ToolbarButton>

              {showTableMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTableMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 z-50 w-56 bg-white dark:bg-[#0b1329] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl p-2.5 space-y-1.5 ring-1 ring-black/10 dark:ring-white/10">
                    {!editor.isActive("table") ? (
                      <div className="p-1 space-y-2">
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={insertTable}
                          className="w-full text-left px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold flex items-center gap-2.5 transition-colors text-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Insert 3x3 Table</span>
                        </button>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1 leading-relaxed">
                          Creates a responsive data table with a styled header row.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs">
                        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                          Table Editing
                        </div>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().addColumnAfter().run();
                            setShowTableMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                        >
                          <Columns className="w-3.5 h-3.5 text-primary" />
                          <span>Add Column</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().addRowAfter().run();
                            setShowTableMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium transition-colors"
                        >
                          <Rows className="w-3.5 h-3.5 text-primary" />
                          <span>Add Row</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().deleteColumn().run();
                            setShowTableMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Column</span>
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            editor.chain().focus().deleteRow().run();
                            setShowTableMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Row</span>
                        </button>
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-1 mt-1">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              editor.chain().focus().deleteTable().run();
                              setShowTableMenu(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 flex items-center gap-2 font-semibold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Entire Table</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-0.5 px-1 border-r border-border/50">
              <ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Link">
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
            </div>

            <div className="flex items-center gap-0.5 pl-1 ml-auto">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </ToolbarButton>
            </div>
          </div>

          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="p-6 md:p-10 max-w-3xl mx-auto">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() || "<p className='text-muted-foreground italic'>Nothing written yet...</p>" }}
          />
        </div>
      )}
    </div>
  );
}
