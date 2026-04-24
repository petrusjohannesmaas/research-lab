import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../utils/posts';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="bg-white border border-slate-200 rounded-xl p-6 hover:border-primary transition-all hover:shadow-lg group flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-primary px-3 py-1 rounded font-label-md text-[10px] uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link to={`/post/${post.slug}`}>
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>
        </Link>
        <p className="text-slate-600 font-body-sm text-body-sm line-clamp-3">
          {post.description}
        </p>
      </div>
      <div className="flex items-center text-slate-500 font-label-md text-[12px] gap-4 mt-6 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {Math.ceil(post.content.split(' ').length / 200)} min read
        </div>
      </div>
    </article>
  );
};

export default PostCard;
