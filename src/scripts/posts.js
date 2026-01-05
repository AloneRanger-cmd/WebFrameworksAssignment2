// JS File to fetch and render posts and comments//
import { supabase } from "../lib/supabaseClient.ts"



// Fetch posts//
const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, title, content, author, date, time")
    .order("created_at", { ascending: false })
    .limit(5)

// Fetch comments//
const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("content, post_id,author")
    .order("created_at", { ascending: true })

if (postsError) console.error(postsError)
if (commentsError) console.error(commentsError)

// Render posts with comments and ability to add comments//
const postsContainer = document.getElementById("posts")

if (postsContainer && posts) {
    posts.forEach((post, index) => {
        postsContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="post" data-post-id="${post.id}">
            <h3>${post.title}</h3>

            <button onclick="togglePost(${index})">Expand</button>
            <p id="postContent-${index}" style="display:none">${post.content}</p>

            <p>By ${post.author} on ${post.date} at ${post.time}</p>

            <!-- COMMENTS -->
            <div class="comments" id="comments-for-${post.id}"></div>

            <!-- ADD COMMENT -->
            <form method="POST" action="/api/comments/comments">
            <input type="hidden" name="post_id" value="${post.id}" />
            <textarea name="content" required></textarea>
            <button type="submit">Post comment</button>
            </form>
        </div>
        `
    )
  })
}

// Render comments under their referenced posts//
if (comments) {
    comments.forEach((comment) => {
        const container = document.getElementById(
        `comments-for-${comment.post_id}`
        )

        if (!container) return

        container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="comment">
            <p>${comment.content}</p>
            <p class="commentAuthor">By ${comment.author}</p>
        </div>
        `
        )
    })
}

// Text expand Toggle function//
window.togglePost = function (index) {
    const el = document.getElementById(`postContent-${index}`)
    if (!el) return
    el.style.display = el.style.display === "none" ? "block" : "none"
}
