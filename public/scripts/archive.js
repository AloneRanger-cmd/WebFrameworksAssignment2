//JS File for rendering archive page//

// Load archive posts and comments from API//
async function loadArchive() {
  try {
    const res = await fetch('/api/archive')
    if (!res.ok) throw new Error('Failed to fetch archive')

    const { posts, comments } = await res.json()

    const postsContainer = document.getElementById('archive')
    if (!postsContainer) return

    // Render posts - Creating separate divs for the content to appear//
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
        </div>
        `
      )
    })

    // Render comments//
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

// Toggle content//
window.togglePost = function (index) {
  const el = document.getElementById(`postContent-${index}`)
  if (!el) return
  el.style.display = el.style.display === 'none' ? 'block' : 'none'
}

document.addEventListener('DOMContentLoaded', loadArchive)
