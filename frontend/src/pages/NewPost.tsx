import { PostEditor } from '../components/post/PostEditor';

export function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create a New Post</h1>
      <PostEditor />
    </div>
  );
} 