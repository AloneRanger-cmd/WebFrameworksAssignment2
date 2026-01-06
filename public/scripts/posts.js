// JS File for loading and displaying posts and comments on Home Page//

// Load posts and comments from API//
async function loadPosts() {
  try {
    const res = await fetch('/api/posts')
    if (!res.ok) throw new Error('Failed to fetch posts')

    const { posts, comments } = await res.json()

    const postsContainer = document.getElementById('posts')
    if (!postsContainer) return

    // Render posts - by creating a div for each post into html//
    posts.forEach((post, index) => {
      postsContainer.insertAdjacentHTML(
        'beforeend',`

        <div id="postsContainer"" data-post-id="${post.id}">

          <h3 class="postTitle" onclick="togglePost(${index})" style="cursor: pointer;">
            ${post.title}
          </h3>

          <div id="postContent-${index}" style="display:none">
            <p class="postContent">
              ${post.content}
            </p>
            <p class="postAuthor">By ${post.author} on ${post.date} at ${post.time}</p>
            <ul>
              <div class="comments" id="comments-for-${post.id}"></div>

                <!-- TOGGLE ADD COMMENT FORM BUTTON -->
                <button onclick="toggleCommentForm(${post.id})">
                  Add comment
                </button>

                <!-- ADD COMMENT FORM (collapsible) -->
                <div id="comment-form-for-${post.id}" style="display:none">
                  <form method="POST" action="/api/comments/comments">
                    <input type="hidden" name="post_id" value="${post.id}" />
                    <textarea name="content" required></textarea>
                    <button type="submit">Post comment</button>
                  </form>
                </div>
            </ul>
          </div>
        </div>`
      )
    })

    // Render comments//
    comments.forEach((comment) => {
      const container = document.getElementById(
        `comments-for-${comment.post_id}`
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

// Toggle post content//
window.togglePost = function (index) {
  const el = document.getElementById(`postContent-${index}`)
  if (!el) return
  el.style.display = el.style.display === 'none' ? 'block' : 'none'
}
window.toggleCommentForm = function (postId) {
  const formEl = document.getElementById(`comment-form-for-${postId}`)
  if (!formEl) return

  formEl.style.display =
    formEl.style.display === 'none' || formEl.style.display === ''
      ? 'block'
      : 'none'
}


// Run after DOM is ready//
document.addEventListener('DOMContentLoaded', loadPosts)
