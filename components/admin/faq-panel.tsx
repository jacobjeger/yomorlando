"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { createFaqItem, updateFaqItem, deleteFaqItem, reorderFaqItems } from "@/app/actions/admin/faq";
import type { FaqItem } from "@/lib/database.types";

interface FaqPanelProps {
  initialItems: FaqItem[];
}

export function FaqPanel({ initialItems }: FaqPanelProps) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setIsPublished(true);
  };

  const handleCreate = async () => {
    if (!question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      await createFaqItem({
        question: question.trim(),
        answer: answer.trim(),
        display_order: items.length,
        is_published: isPublished,
      });
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          question: question.trim(),
          answer: answer.trim(),
          display_order: items.length,
          is_published: isPublished,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      resetForm();
      setIsCreateOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingItem || !question.trim() || !answer.trim()) return;
    setSaving(true);
    try {
      await updateFaqItem(editingItem.id, {
        question: question.trim(),
        answer: answer.trim(),
        is_published: isPublished,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, question: question.trim(), answer: answer.trim(), is_published: isPublished }
            : item
        )
      );
      setIsEditOpen(false);
      setEditingItem(null);
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    try {
      await deleteFaqItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (item: FaqItem) => {
    try {
      await updateFaqItem(item.id, { is_published: !item.is_published });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_published: !i.is_published } : i))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;

    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    const reordered = updated.map((item, i) => ({ ...item, display_order: i }));
    setItems(reordered);

    try {
      await reorderFaqItems(reordered.map((item) => ({ id: item.id, display_order: item.display_order })));
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: FaqItem) => {
    setEditingItem(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    setIsPublished(item.is_published);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {items.length} FAQ item{items.length !== 1 ? "s" : ""} &middot;{" "}
          {items.filter((i) => i.is_published).length} published
        </p>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add FAQ Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-question">Question</Label>
                <Input
                  id="new-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the question..."
                />
              </div>
              <div>
                <Label htmlFor="new-answer">Answer</Label>
                <Textarea
                  id="new-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isPublished} onCheckedChange={setIsPublished} id="new-published" />
                <Label htmlFor="new-published">Published</Label>
              </div>
              <Button onClick={handleCreate} disabled={saving || !question.trim() || !answer.trim()} className="w-full">
                {saving ? "Adding..." : "Add FAQ Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No FAQ items yet. Click &ldquo;Add FAQ&rdquo; to create your first one.
          </CardContent>
        </Card>
      ) : (
        items.map((item, index) => (
          <Card key={item.id} className={!item.is_published ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base leading-snug">{item.question}</CardTitle>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant={item.is_published ? "default" : "secondary"} className="text-xs">
                    {item.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{item.answer}</p>
              <div className="flex items-center gap-1 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === items.length - 1}
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleTogglePublish(item)}
                  title={item.is_published ? "Unpublish" : "Publish"}
                >
                  {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(item)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) { setEditingItem(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit FAQ Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-question">Question</Label>
              <Input
                id="edit-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the question..."
              />
            </div>
            <div>
              <Label htmlFor="edit-answer">Answer</Label>
              <Textarea
                id="edit-answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} id="edit-published" />
              <Label htmlFor="edit-published">Published</Label>
            </div>
            <Button onClick={handleEdit} disabled={saving || !question.trim() || !answer.trim()} className="w-full">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
