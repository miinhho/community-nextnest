import { createPost } from '@/lib/actions/post';
import Form from 'next/form';

export default function NewPost() {
  async function onFormAction(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    // TODO : 유저 기능 추가를 통해서 userId 가 1 이 아닌 현재 유저의 아이디로 표시되도록
    await createPost(title, content, {} as unknown as any);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      <Form action={onFormAction} className="space-y-6">
        <div>
          <label htmlFor='title' className="block text-lg mb-2">
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='Enter yout post title'
            className='w-full px-4 py-2 border rounded-lg'
          />
        </div>
        <div>
          <label htmlFor='content' className='block text-lg mb-2'>
            Content
          </label>
          <textarea
            id='content'
            name='content'
            placeholder='Write your post content here...'
            rows={6}
            className='w-full px-4 py-2 border rounded-lg'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600'
        >
          Create Post
        </button>
      </Form>
    </div>
  )
}