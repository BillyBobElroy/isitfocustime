'use client';

import { useState, useEffect, useRef } from 'react';

type Comment = {
  id: string;
  name: string;
  text: string;
  parentId: string | null;
  edited?: boolean;
};

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const COMMENTS_PER_PAGE = 5;

  useEffect(() => {
    const stored = localStorage.getItem(`comments-${slug}`);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [slug]);

  useEffect(() => {
    if ((editingCommentId || replyParentId) && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editingCommentId, replyParentId]);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

  const saveComments = (updated: Comment[]) => {
    setComments(updated);
    localStorage.setItem(`comments-${slug}`, JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (textInput.trim() === '' || nameInput.trim() === '') return;

    if (editingCommentId) {
      const updated = comments.map((c) =>
        c.id === editingCommentId ? { ...c, text: textInput, edited: true } : c
      );
      saveComments(updated);
      setToast('Comment updated!');
      setEditingCommentId(null);
    } else {
      const newComment: Comment = {
        id: Date.now().toString(),
        name: nameInput,
        text: textInput,
        parentId: replyParentId,
      };
      saveComments([...comments, newComment]);
      setToast('Comment posted!');
    }

    setTextInput('');
    setNameInput('');
    setReplyParentId(null);
  };

  const handleDeleteComment = (id: string) => {
    const updated = comments.filter((c) => c.id !== id && c.parentId !== id);
    saveComments(updated);
    setToast('Comment deleted.');
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setReplyParentId(null);
    setTextInput(comment.text);
    setNameInput(comment.name);
  };

  const handleReply = (parentId: string) => {
    setReplyParentId(parentId);
    setEditingCommentId(null);
    setTextInput('');
  };

  const renderComments = (parentId: string | null = null, depth = 0) => {
    const paginatedComments = comments
      .filter((c) => c.parentId === parentId)
      .slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE);

    return paginatedComments.map((c) => (
      <div
        key={c.id}
        className="mt-4 border-l-2 border-zinc-700 pl-4"
        style={{ marginLeft: `${depth * 20}px` }}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm text-green-400">{c.name}</p>
          {c.edited && <span className="text-xs text-blue-300 italic">(edited)</span>}
        </div>
        <p className="text-zinc-300">{c.text}</p>
        <div className="flex gap-4 text-sm mt-2">
          <button onClick={() => handleEditComment(c)} className="text-blue-400 hover:underline">Edit</button>
          <button onClick={() => handleReply(c.id)} className="text-green-400 hover:underline">Reply</button>
          <button onClick={() => handleDeleteComment(c.id)} className="text-red-400 hover:underline">Delete</button>
        </div>
        {renderComments(c.id, depth + 1)}
      </div>
    ));
  };

  const totalPages = Math.ceil(
    comments.filter((c) => c.parentId === null).length / COMMENTS_PER_PAGE
  );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      {(editingCommentId || replyParentId) && (
        <p className="text-blue-400 text-sm mb-2 italic">
          {editingCommentId ? 'Editing comment...' : 'Replying to comment...'}
        </p>
      )}

      <input
        type="text"
        className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white"
        placeholder="Your Name"
        value={nameInput}
        onChange={(e) => setNameInput(e.target.value)}
      />

      <textarea
        ref={textareaRef}
        className="w-full p-4 rounded-lg bg-zinc-800 text-white mb-4"
        rows={3}
        placeholder="Write your comment..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
      >
        {editingCommentId ? 'Update Comment' : 'Post Comment'}
      </button>

      <div className="mt-10">{renderComments()}</div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i + 1 ? 'bg-green-500 text-white' : 'bg-zinc-700 text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 bg-green-600 px-6 py-3 rounded-lg shadow-lg text-white">
          {toast}
        </div>
      )}
    </div>
  );
}