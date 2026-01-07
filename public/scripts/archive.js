//JS File for rendering archive page//

// Load archived posts and comments from API//
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
        'beforeend',`

        <div id="postsContainer" data-post-id="${post.id}">

          <h3 class="postTitle" onclick="togglePost(${index})" style="cursor:pointer">
            ${post.title}
          </h3>

          <div id="postContent-${index}" style="display:none">
            <p class="postContent">
              ${post.content}
            </p>
            <ul>
              <div class="comments" id="commentFor-${post.id}"></div>
            </ul>
          </div>

          <p class="postAuthor">By ${post.author} on ${post.date} at ${post.time}</p>
        </div>`
      )
    })

    // Render comments//
    comments.forEach((comment) => {
      const container = document.getElementById(
        `commentFor-${comment.post_id}`
      )
      if (!container) return

      container.insertAdjacentHTML(
        'beforeend',`
        <li>
          <div class="comment">
            <p>${comment.content}</p>
            <p class="commentAuthor">By ${comment.author}</p>
          </div>
        </li>`
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

// Run after DOM is ready//
document.addEventListener('DOMContentLoaded', loadArchive)
