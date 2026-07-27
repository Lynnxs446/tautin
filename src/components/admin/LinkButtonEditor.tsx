"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  PlusIcon,
  TrashIcon,
  Bars3Icon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { LinkItem } from "@/lib/types";
import { ICON_MAP, detectIconName } from "@/components/home/LinkButton";

// =============================================
// Available icons in the admin icon picker
// =============================================
const ICON_OPTIONS = [
  { name: "WhatsApp", label: "WhatsApp" },
  { name: "Instagram", label: "Instagram" },
  { name: "TikTok", label: "TikTok" },
  { name: "Shopee", label: "Shopee" },
  { name: "Link", label: "Link" },
  { name: "Globe", label: "Website" },
  { name: "ShoppingBag", label: "Shopping" },
  { name: "Envelope", label: "Email" },
  { name: "Phone", label: "Telepon" },
  { name: "Chat", label: "Chat" },
  { name: "Star", label: "Bintang" },
  { name: "Heart", label: "Hati" },
  { name: "Music", label: "Musik" },
  { name: "Camera", label: "Foto" },
  { name: "Play", label: "Video" },
  { name: "Book", label: "Buku" },
  { name: "Briefcase", label: "Kerja" },
  { name: "Store", label: "Toko" },
  { name: "Tag", label: "Tag" },
];

interface LinkButtonEditorProps {
  initialLinks: LinkItem[];
}

interface EditFormProps {
  link: Partial<LinkItem>;
  onSave: (data: Partial<LinkItem>) => void;
  onCancel: () => void;
  saving: boolean;
}

function EditForm({ link, onSave, onCancel, saving }: EditFormProps) {
  const [label, setLabel] = useState(link.label ?? "");
  const [url, setUrl] = useState(link.url ?? "");
  const [icon, setIcon] = useState(link.icon ?? "Link");
  const [userSelectedIcon, setUserSelectedIcon] = useState(Boolean(link.icon && link.icon !== "Link"));

  // Handle URL or Label change with auto-icon suggestion if user hasn't manually picked an icon
  function handleUrlChange(val: string) {
    setUrl(val);
    if (!userSelectedIcon) {
      const suggested = detectIconName(val, label);
      if (suggested !== "Link") {
        setIcon(suggested);
      }
    }
  }

  function handleLabelChange(val: string) {
    setLabel(val);
    if (!userSelectedIcon) {
      const suggested = detectIconName(url, val);
      if (suggested !== "Link") {
        setIcon(suggested);
      }
    }
  }

  function selectIcon(iconName: string) {
    setIcon(iconName);
    setUserSelectedIcon(true);
  }

  return (
    <div className="edit-form">
      <div className="edit-form-row">
        <div className="edit-form-field">
          <label className="edit-label">Label</label>
          <input
            type="text"
            className="input-base edit-input"
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="WhatsApp / Instagram / TikTok"
          />
        </div>
        <div className="edit-form-field">
          <label className="edit-label">URL / No. WhatsApp</label>
          <input
            type="text"
            className="input-base edit-input"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://wa.me/628123456789 atau 08123456789"
          />
        </div>
      </div>

      {/* Icon picker */}
      <div className="edit-form-field">
        <label className="edit-label">Icon</label>
        <div className="icon-grid">
          {ICON_OPTIONS.map((opt) => {
            const IconComp = ICON_MAP[opt.name] ?? LinkIcon;
            return (
              <button
                key={opt.name}
                type="button"
                className={`icon-opt ${icon === opt.name ? "selected" : ""}`}
                onClick={() => selectIcon(opt.name)}
                title={opt.label}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span className="icon-opt-name">{opt.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="edit-form-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => onSave({ label, url, icon })}
          disabled={saving || !label || !url}
        >
          <CheckIcon className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          <XMarkIcon className="w-4 h-4" />
          Batal
        </button>
      </div>
    </div>
  );
}

export default function LinkButtonEditor({ initialLinks }: LinkButtonEditorProps) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function showMsg(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 2500);
  }

  async function handleAdd(data: Partial<LinkItem>) {
    setSaving(true);
    const supabase = createClient();
    const finalIcon = data.icon || detectIconName(data.url, data.label);

    const newLink = {
      label: data.label!,
      url: data.url!,
      icon: finalIcon,
      order_index: links.length,
      is_active: true,
    };
    const { data: inserted, error } = await supabase
      .from("links")
      .insert(newLink)
      .select()
      .single();

    if (error || !inserted) {
      showMsg("err", "Gagal menambah link.");
    } else {
      setLinks((prev) => [...prev, inserted as LinkItem]);
      setAddingNew(false);
      showMsg("ok", "Link ditambahkan!");
    }
    setSaving(false);
  }

  async function handleUpdate(id: string, data: Partial<LinkItem>) {
    setSaving(true);
    const supabase = createClient();
    const finalIcon = data.icon || detectIconName(data.url, data.label);

    const { error } = await supabase
      .from("links")
      .update({ label: data.label, url: data.url, icon: finalIcon })
      .eq("id", id);

    if (error) {
      showMsg("err", "Gagal memperbarui link.");
    } else {
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...data, icon: finalIcon } : l))
      );
      setEditingId(null);
      showMsg("ok", "Link diperbarui!");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) {
      showMsg("err", "Gagal menghapus link.");
      return;
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
    showMsg("ok", "Link dihapus.");
  }

  async function handleToggleActive(link: LinkItem) {
    const supabase = createClient();
    const { error } = await supabase
      .from("links")
      .update({ is_active: !link.is_active })
      .eq("id", link.id);
    if (!error) {
      setLinks((prev) =>
        prev.map((l) =>
          l.id === link.id ? { ...l, is_active: !l.is_active } : l
        )
      );
    }
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(links);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const withNewOrder = reordered.map((l, i) => ({ ...l, order_index: i }));
    setLinks(withNewOrder);

    const supabase = createClient();
    await Promise.all(
      withNewOrder.map((l) =>
        supabase.from("links").update({ order_index: l.order_index }).eq("id", l.id)
      )
    );
  }

  return (
    <div className="admin-card">
      <div className="link-editor-header">
        <p className="section-label" style={{ margin: 0 }}>
          Tombol Tautan
        </p>
        <button
          type="button"
          className="btn-primary add-btn"
          onClick={() => { setAddingNew(true); setEditingId(null); }}
          disabled={addingNew}
        >
          <PlusIcon className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {msg && (
        <p className={`status-msg ${msg.type}`} style={{ marginBottom: 8 }}>
          {msg.text}
        </p>
      )}

      {addingNew && (
        <div className="link-item new-item">
          <EditForm
            link={{}}
            onSave={handleAdd}
            onCancel={() => setAddingNew(false)}
            saving={saving}
          />
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="links-list"
            >
              {links.map((link, index) => {
                const detectedIconKey = link.icon && ICON_MAP[link.icon] ? link.icon : detectIconName(link.url, link.label);
                const ItemIconComp = ICON_MAP[detectedIconKey] ?? LinkIcon;

                return (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        className={`link-item ${snapshot.isDragging ? "dragging" : ""} ${!link.is_active ? "inactive" : ""}`}
                      >
                        {editingId === link.id ? (
                          <EditForm
                            link={link}
                            onSave={(data) => handleUpdate(link.id, data)}
                            onCancel={() => setEditingId(null)}
                            saving={saving}
                          />
                        ) : (
                          <div className="link-row">
                            <span
                              {...dragProvided.dragHandleProps}
                              className="drag-handle"
                              title="Seret untuk mengatur urutan"
                            >
                              <Bars3Icon className="w-4 h-4" />
                            </span>

                            <span className="link-icon-badge">
                              <ItemIconComp className="w-4 h-4" />
                            </span>

                            <div className="link-info">
                              <span className="link-label-text">{link.label}</span>
                              <span className="link-url-text">{link.url}</span>
                            </div>

                            <div className="link-actions">
                              <button
                                type="button"
                                className="icon-action-btn"
                                onClick={() => handleToggleActive(link)}
                                title={link.is_active ? "Nonaktifkan" : "Aktifkan"}
                              >
                                {link.is_active ? (
                                  <EyeIcon className="w-4 h-4" />
                                ) : (
                                  <EyeSlashIcon className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                className="icon-action-btn"
                                onClick={() => { setEditingId(link.id); setAddingNew(false); }}
                                title="Edit"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                className="icon-action-btn danger"
                                onClick={() => handleDelete(link.id)}
                                title="Hapus"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {links.length === 0 && !addingNew && (
        <p className="empty-hint">
          Belum ada link. Klik &quot;Tambah&quot; untuk menambahkan.
        </p>
      )}

      <style>{`
        .link-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .add-btn { padding: 7px 14px; font-size: 13px; }
        .links-list { display: flex; flex-direction: column; gap: 6px; }
        .link-item {
          background-color: #2A2A2A;
          border: 1px solid #3A3A3A;
          border-radius: 8px;
          padding: 10px 12px;
          transition: border-color 0.15s ease;
        }
        .link-item.dragging {
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .link-item.inactive { opacity: 0.45; }
        .new-item { border-color: rgba(255,255,255,0.15); }

        .link-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .drag-handle {
          cursor: grab;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
        .drag-handle:active { cursor: grabbing; }
        .link-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: #1E1E1E;
          border: 1px solid #3A3A3A;
          border-radius: 6px;
          color: #ffffff;
          flex-shrink: 0;
        }
        .link-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .link-label-text {
          font-size: 13px;
          font-weight: 500;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .link-url-text {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .link-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .icon-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .icon-action-btn:hover {
          background-color: #3A3A3A;
          color: #ffffff;
          border-color: #3A3A3A;
        }
        .icon-action-btn.danger:hover {
          background-color: rgba(239,68,68,0.12);
          color: #ef4444;
          border-color: rgba(239,68,68,0.3);
        }

        /* Edit form */
        .edit-form { display: flex; flex-direction: column; gap: 12px; }
        .edit-form-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .edit-form-field { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 150px; }
        .edit-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.45); }
        .edit-input { font-size: 13px; padding: 8px 10px; }
        .edit-form-actions { display: flex; gap: 8px; }

        /* Icon grid */
        .icon-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .icon-opt {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          font-size: 11px;
          border-radius: 6px;
          border: 1px solid #3A3A3A;
          background-color: #1E1E1E;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .icon-opt.selected {
          background-color: #ffffff;
          color: #0D0D0D;
          border-color: #ffffff;
        }
        .icon-opt:hover:not(.selected) {
          border-color: rgba(255,255,255,0.3);
          color: #ffffff;
        }
        .icon-opt-name { font-size: 11px; font-weight: 500; }

        .empty-hint {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          text-align: center;
          padding: 16px 0 8px;
        }
        .status-msg { font-size: 13px; }
        .status-msg.ok { color: #22c55e; }
        .status-msg.err { color: #ef4444; }
      `}</style>
    </div>
  );
}
