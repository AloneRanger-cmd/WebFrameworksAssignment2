async function loadPosts() {
  try {
    const res = await fetch('/api/posts')
    if (!res.ok) throw new Error('Failed to fetch posts')

    const { posts, comments } = await res.json()

    const postsContainer = document.getElementById('posts')
    if (!postsContainer) return

    // Render posts
    posts.forEach((post, index) => {
      postsContainer.insertAdjacentHTML(
        'beforeend',
        `
        <div class="post" data-post-id="${post.id}">
          <h3>${post.title}</h3>

          <button onclick="togglePost(${index})">Expand</button>
          <p id="postContent-${index}" style="display:none">
            ${post.content}
          </p>

          <p>By ${post.author} on ${post.date} at ${post.time}</p>

          <div class="comments" id="comments-for-${post.id}"></div>

          <form method="POST" action="/api/comments/comments">
            <input type="hidden" name="post_id" value="${post.id}" />
            <textarea name="content" required></textarea>
            <button type="submit">Post comment</button>
          </form>
        </div>
        `
      )
    })

    // Render comments
    comments.forEach((comment) => {
      const container = document.getElementById(
        `comments-for-${comment.post_id}`
      )
      if (!container) return

      container.insertAdjacentHTML(
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
    console.error(err)
  }
}

// Toggle post content
window.togglePost = function (index) {
  const el = document.getElementById(`postContent-${index}`)
  if (!el) return
  el.style.display = el.style.display === 'none' ? 'block' : 'none'
}

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', loadPosts)
