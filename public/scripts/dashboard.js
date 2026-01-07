// JS File for loading and displaying user's posts and comments on Dashboard Page//

// Load user's posts and comments from API//
async function loadMyPosts() {
  try {
    const res = await fetch('/api/dashboard')

    if (!res.ok) {
      console.warn('Not authenticated or failed to load posts')
      return
    }

    const { posts, comments } = await res.json()

    const container = document.getElementById('sposts')
    if (!container) return

    container.innerHTML = ''
    
    // Build lookup to see which posts have comments Needed for toggle comments button//
    const postsWithComments = {}

    comments.forEach((comment) => {
      postsWithComments[comment.post_id] = true
    })


    // Render posts by creaating a div for each post//
    posts.forEach((row) => {
      container.insertAdjacentHTML(
        'beforeend',`

        <div id="postsContainer">
          <h3 class="postTitle">${row.title}</h3>
          <p class="postContent">${row.content}</p>
          <p class="postDateTime">${row.date} at ${row.time}</p>

          <!-- TOGGLE COMMENTS BUTTON IF COMMENTS EXIST -->
          ${
            postsWithComments[row.id]
              ? `<button onclick="toggleComments(${row.id})">Toggle comments</button>`
              : ''
          }

          <ul>
            <div class="comments" id="commentsFor-${row.id}" style="display:none"></div>
          </ul>
          
          <!-- DELETE -->
          <div class="deleteForm">
            <form method="POST" action="/api/posts/delete">
              <input type="hidden" name="post_id" value="${row.id}" />
              <button type="submit">Delete post</button>
            </form>
          </div>

          <!-- EDIT (collapsible) -->
          <button onclick="toggleEdit(${row.id})">Edit post</button>

          <div id="editFor-${row.id}" style="display:none">
            <form method="POST" action="/api/posts/edit">
              <input type="hidden" name="post_id" value="${row.id}" />
              <input type="text" name="title" value="${row.title}" required />
              <textarea name="content" required>${row.content}</textarea>
              <button type="submit">Save changes</button>
            </form>
          </div>
        </div>`
      )
    })

    // Render comments//
    comments.forEach((comment) => {
      const commentsContainer = document.getElementById(
        `commentsFor-${comment.post_id}`
      )

      if (!commentsContainer) return

      commentsContainer.insertAdjacentHTML(
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
    console.error('Failed to load dashboard posts', err)
  }
}
// Toggle Functions//

// Toggle comments//
window.toggleComments = function (postId) {
  const commentsEl = document.getElementById(`commentsFor-${postId}`)
  if (!commentsEl) return

  commentsEl.style.display =
    commentsEl.style.display === 'none' || commentsEl.style.display === ''
      ? 'block'
      : 'none'
}

// Toggle edit form//
window.toggleEdit = function (postId) {
  const editEl = document.getElementById(`editFor-${postId}`)
  if (!editEl) return

  editEl.style.display =
    editEl.style.display === 'none' || editEl.style.display === ''
      ? 'block'
      : 'none'
}

// Toggle Function for post content//
window.togglePublishForm = function () {
  const form = document.getElementById('publishForm')
  if (!form) return

  form.style.display =
    form.style.display === 'none' || form.style.display === ''
      ? 'block'
      : 'none'
}

// Toggle Function for Account Actions//
window.toggleAccountActions = function () {
  const el = document.getElementById('accountActions')
  if (!el) return

  el.style.display =
    el.style.display === 'none' || el.style.display === ''
      ? 'block'
      : 'none'
}



// Run after DOM is ready//
document.addEventListener('DOMContentLoaded', loadMyPosts)
