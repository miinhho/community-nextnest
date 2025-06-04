export async function fetchPostData(postId: string) {
  const postData = await fetch(`${process.env.URL}/api/post/${postId}:${process.env.PORT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const postJson = await postData.json();

  const author = {
    name: postJson.author.name as string,
    image: postJson.author.image as string,
  };

  const post = {
    content: postJson.content as string,
    createdAt: postJson.createdAt as Date,
    updatedAt: postJson.updatedAt as Date,
    authorId: postJson.authorId as string,
    likeCount: postJson.likeCount as number,
  };

  return {
    author,
    post,
  };
}
