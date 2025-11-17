import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Community = () => {
  const { user, addToast } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', category: 'General', content: '' });
  const [newComment, setNewComment] = useState('');

  // Mock forum data (in real app, this would come from context/state)
  const [threads, setThreads] = useState([
    {
      id: 1,
      title: 'Best practices for wheat cultivation in Punjab',
      author: 'Rajesh Kumar',
      category: 'Crop Advice',
      upvotes: 15,
      comments: 8,
      timestamp: '2025-11-15',
      content:
        'I have been growing wheat for 10 years and want to share some best practices that have worked well for me...',
      helpful: true,
    },
    {
      id: 2,
      title: 'Organic fertilizer recommendations',
      author: 'Priya Sharma',
      category: 'Organic Farming',
      upvotes: 23,
      comments: 12,
      timestamp: '2025-11-14',
      content:
        'Looking for recommendations on organic fertilizers for cotton farming. What has worked best for you?',
      helpful: false,
    },
    {
      id: 3,
      title: 'Dealing with pest infestations naturally',
      author: 'Ahmed Ali',
      category: 'Pest Control',
      upvotes: 18,
      comments: 15,
      timestamp: '2025-11-13',
      content:
        'Natural pest control methods that work without harmful chemicals. Share your experiences...',
      helpful: true,
    },
    {
      id: 4,
      title: 'Market prices for sugarcane this season',
      author: 'Lakshmi Reddy',
      category: 'Market Discussion',
      upvotes: 10,
      comments: 6,
      timestamp: '2025-11-16',
      content: 'What are the current market rates for sugarcane in your region? Let\'s discuss...',
      helpful: false,
    },
  ]);

  const [comments, setComments] = useState({
    1: [
      {
        id: 1,
        author: 'Priya Sharma',
        content: 'Great tips! I will try the crop rotation method you mentioned.',
        upvotes: 5,
        timestamp: '2025-11-16',
        helpful: true,
      },
      {
        id: 2,
        author: 'Ahmed Ali',
        content: 'What about water management during dry season?',
        upvotes: 3,
        timestamp: '2025-11-16',
        helpful: false,
      },
    ],
    2: [
      {
        id: 3,
        author: 'Rajesh Kumar',
        content: 'I use vermicompost and it works wonderfully for my crops.',
        upvotes: 8,
        timestamp: '2025-11-15',
        helpful: true,
      },
    ],
  });

  const categories = ['all', 'General', 'Crop Advice', 'Organic Farming', 'Pest Control', 'Market Discussion'];

  const filteredThreads =
    activeCategory === 'all' ? threads : threads.filter((t) => t.category === activeCategory);

  const handleCreatePost = (e) => {
    e.preventDefault();
    const thread = {
      id: threads.length + 1,
      ...newPost,
      author: user?.name || user?.businessName,
      upvotes: 0,
      comments: 0,
      timestamp: new Date().toISOString().split('T')[0],
      helpful: false,
    };
    setThreads([thread, ...threads]);
    setNewPost({ title: '', category: 'General', content: '' });
    setShowCreatePost(false);
    addToast('Post created successfully!', 'success');
  };

  const handleUpvote = (threadId) => {
    setThreads(threads.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t)));
  };

  const handleCommentUpvote = (threadId, commentId) => {
    setComments({
      ...comments,
      [threadId]: comments[threadId].map((c) =>
        c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
      ),
    });
  };

  const handleMarkHelpful = (threadId, commentId) => {
    setComments({
      ...comments,
      [threadId]: comments[threadId].map((c) =>
        c.id === commentId ? { ...c, helpful: !c.helpful } : c
      ),
    });
    addToast('Marked as helpful', 'success');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!selectedThread || !newComment.trim()) return;

    const comment = {
      id: (comments[selectedThread.id]?.length || 0) + 1,
      author: user?.name || user?.businessName,
      content: newComment,
      upvotes: 0,
      timestamp: new Date().toISOString().split('T')[0],
      helpful: false,
    };

    setComments({
      ...comments,
      [selectedThread.id]: [...(comments[selectedThread.id] || []), comment],
    });

    setThreads(
      threads.map((t) => (t.id === selectedThread.id ? { ...t, comments: t.comments + 1 } : t))
    );

    setNewComment('');
    addToast('Comment added!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 md:px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Community Hub</h2>
        <p className="text-sm text-gray-600 mt-1">Connect, share knowledge, and learn from each other</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {!selectedThread ? (
          <div className="space-y-6">
            {/* Categories and Create Button */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showCreatePost ? 'Cancel' : '+ Create Post'}
              </button>
            </div>

            {/* Create Post Form */}
            {showCreatePost && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Create New Post</h3>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="What's your question or topic?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                    <textarea
                      required
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your thoughts, questions, or experiences..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                  >
                    Post
                  </button>
                </form>
              </div>
            )}

            {/* Thread List */}
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    {/* Upvote Section */}
                    <div className="flex flex-col items-center space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(thread.id);
                        }}
                        className="text-gray-500 hover:text-green-600 transition"
                      >
                        ▲
                      </button>
                      <span className="text-sm font-semibold text-gray-700">{thread.upvotes}</span>
                    </div>

                    {/* Thread Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {thread.category}
                        </span>
                        {thread.helpful && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            ✓ Helpful
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{thread.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{thread.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By {thread.author}</span>
                        <span>•</span>
                        <span>{new Date(thread.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>💬 {thread.comments} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredThreads.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">No posts in this category yet</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Thread Detail View */
          <div className="space-y-6">
            <button
              onClick={() => setSelectedThread(null)}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>←</span>
              <span>Back to threads</span>
            </button>

            {/* Thread */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-1">
                  <button
                    onClick={() => handleUpvote(selectedThread.id)}
                    className="text-gray-500 hover:text-green-600 transition text-xl"
                  >
                    ▲
                  </button>
                  <span className="text-lg font-semibold text-gray-700">
                    {threads.find((t) => t.id === selectedThread.id)?.upvotes}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {selectedThread.category}
                    </span>
                    {selectedThread.helpful && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        ✓ Helpful
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">{selectedThread.title}</h2>
                  <p className="text-gray-700 mb-4">{selectedThread.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Posted by {selectedThread.author}</span>
                    <span>•</span>
                    <span>{new Date(selectedThread.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Comments ({comments[selectedThread.id]?.length || 0})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                  placeholder="Add your comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
                ></textarea>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {(comments[selectedThread.id] || []).map((comment) => (
                  <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex flex-col items-center space-y-1">
                        <button
                          onClick={() => handleCommentUpvote(selectedThread.id, comment.id)}
                          className="text-gray-500 hover:text-green-600 transition"
                        >
                          ▲
                        </button>
                        <span className="text-xs font-semibold text-gray-700">{comment.upvotes}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-800">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                          {comment.helpful && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              ✓ Helpful
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>
                        <button
                          onClick={() => handleMarkHelpful(selectedThread.id, comment.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          {comment.helpful ? 'Unmark as helpful' : 'Mark as helpful'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!comments[selectedThread.id] || comments[selectedThread.id].length === 0) && (
                  <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
