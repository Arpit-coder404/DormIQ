import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Heart,
  Plus,
  Send,
  Sparkles,
  Search,
  X,
  Share2,
} from 'lucide-react';
import { useHostelStore } from '../../store/hostelStore';
import { useAuthStore } from '../../store/authStore';

export const CommunityPage: React.FC = () => {
  const { posts, comments, addCommunityPost, toggleLikePost, addCommunityComment } = useHostelStore();
  const { currentUser } = useAuthStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<any>('general');

  const categories = [
    { label: 'All Discussions', value: 'all' },
    { label: 'Suggestions', value: 'suggestions' },
    { label: 'Facilities & Laundry', value: 'facilities' },
    { label: 'General / Lost & Found', value: 'general' },
    { label: 'Events & Study Circles', value: 'events' },
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    addCommunityPost({
      resident_id: currentUser.id,
      author_name: currentUser.full_name,
      author_room: currentUser.room_number || 'A-204',
      title: newTitle,
      content: newContent,
      category: newCategory,
    });

    setNewTitle('');
    setNewContent('');
    setCreateModalOpen(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim() || !currentUser) return;

    addCommunityComment({
      post_id: postId,
      resident_id: currentUser.id,
      author_name: currentUser.full_name,
      author_role: currentUser.role,
      content: commentInput.trim(),
    });

    setCommentInput('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-graphite-border">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-lime bg-forest/40 border border-forest px-2.5 py-1 rounded-full">
            Resident Quad Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ivory mt-2">
            Community Discussions & Tips
          </h1>
          <p className="text-xs sm:text-sm text-mutedGrey mt-0.5">
            Peer support, study circles, equipment suggestions, and lost-and-found items.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 bg-lime hover:bg-lime-glow text-obsidian px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-lime/20"
        >
          <Plus className="w-4 h-4" />
          <span>Post Discussion</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              activeCategory === c.value
                ? 'bg-lime text-obsidian font-bold shadow-sm'
                : 'bg-graphite text-mutedGrey hover:text-ivory border border-graphite-border'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
          const postComments = comments.filter((c) => c.post_id === post.id);
          const isExpanded = expandedPostId === post.id;

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-graphite border border-graphite-border rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-forest/40 border border-forest flex items-center justify-center font-bold text-lime text-xs">
                    {post.author_name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ivory">{post.author_name}</p>
                    <p className="text-[10px] text-mutedGrey font-mono">Room {post.author_room}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-obsidian-light border border-graphite-border text-lime">
                  {post.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-ivory mb-1.5">{post.title}</h3>
                <p className="text-xs text-ivory/80 leading-relaxed bg-obsidian-light/60 p-4 rounded-xl border border-graphite-border/70">
                  {post.content}
                </p>
              </div>

              {/* Interactions */}
              <div className="flex items-center justify-between text-xs text-mutedGrey pt-2 border-t border-graphite-border">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => currentUser && toggleLikePost(post.id, currentUser.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      isLiked ? 'text-alertCoral font-bold' : 'hover:text-alertCoral'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-alertCoral' : ''}`} />
                    <span>{post.likes.length}</span>
                  </button>

                  <button
                    onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 hover:text-ivory transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{postComments.length} Comments</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-mutedGrey">
                  {new Date(post.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Expandable Comments Drawer */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3 border-t border-graphite-border space-y-3"
                  >
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {postComments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-3 rounded-xl bg-obsidian border border-graphite-border text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ivory text-[11px] flex items-center gap-1.5">
                              {comm.author_name}
                              {comm.author_role !== 'resident' && (
                                <span className="text-[9px] font-mono uppercase bg-forest/40 text-lime px-1 rounded">
                                  {comm.author_role}
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] font-mono text-mutedGrey">
                              {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-ivory/80 leading-relaxed text-[11px]">{comm.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment input */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        placeholder="Join the discussion..."
                        className="flex-1 bg-obsidian border border-graphite-border rounded-xl px-3.5 py-2 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3.5 py-2 rounded-xl bg-lime hover:bg-lime-glow text-obsidian font-bold text-xs flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm px-4">
          <div className="bg-graphite border border-graphite-border rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-graphite-border pb-3">
              <h3 className="font-display font-bold text-lg text-ivory">Start a Resident Discussion</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-mutedGrey hover:text-ivory text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Study circle for Algorithms, Lost keys near gym..."
                  className="w-full bg-obsidian border border-graphite-border rounded-xl px-3.5 py-2.5 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-obsidian border border-graphite-border rounded-xl px-3.5 py-2.5 text-xs text-ivory focus:outline-none focus:border-lime"
                >
                  <option value="general">General / Lost & Found</option>
                  <option value="suggestions">Hostel Suggestion</option>
                  <option value="facilities">Facilities & Laundry</option>
                  <option value="events">Events & Study Group</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-mutedGrey mb-1">Details</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details, timing, or helpful context for fellow residents..."
                  className="w-full bg-obsidian border border-graphite-border rounded-xl p-3 text-xs text-ivory placeholder-mutedGrey focus:outline-none focus:border-lime resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-lime hover:bg-lime-glow text-obsidian font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Publish to Community Quad
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;

