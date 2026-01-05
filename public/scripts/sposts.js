async function loadMyPosts() {
  try {
    const res = await fetch('/api/sposts')

    if (!res.ok) {
      console.warn('Not authenticated or failed to load posts')
      return
    }

    const { posts, comments } = await res.json()

    const container = document.getElementById('sposts')
    if (!container) return

    container.innerHTML = ''

    // Render posts
    posts.forEach((row) => {
      container.insertAdjacentHTML(
        'beforeend',
        `
        <div class="post">
          <h3 class="postTitle">${row.title}</h3>
          <p class="postContent">${row.content}</p>
          <p class="postDate-Time">${row.date} at ${row.time}</p>

          <div class="comments" id="comments-for-${row.id}"></div>

          <!-- DELETE -->
          <form method="POST" action="/api/posts/delete">
            <input type="hidden" name="post_id" value="${row.id}" />
            <button type="submit">Delete post</button>
          </form>

          <!-- EDIT -->
          <form method="POST" action="/api/posts/edit">
            <input type="hidden" name="post_id" value="${row.id}" />
            <input type="text" name="title" value="${row.title}" required />
            <textarea name="content" required>${row.content}</textarea>
            <button type="submit">Save changes</button>
          </form>
        </div>
        `
      )
    })

    // Render comments
    comments.forEach((comment) => {
      const commentsContainer = document.getElementById(
        `comments-for-${comment.post_id}`
      )

      if (!commentsContainer) return

      commentsContainer.insertAdjacentHTML(
        'beforeend',
        `
        <div class="comment">
          <p>${comment.content}</p>
          <p class="commentAuthor">By ${comment.author}</p>
        </div>
        `
      )
    })
  } catch (err) {
    console.error('Failed to load dashboard posts', err)
  }
}

document.addEventListener('DOMContentLoaded', loadMyPosts)
