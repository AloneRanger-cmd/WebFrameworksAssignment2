// JS File to fetch and render user's posts with comments, edit and delete options//

import { supabase } from "../supabaseClient.js"



// Get current user
const {data: { user },} = await supabase.auth.getUser()

// Function to load user's posts//
async function loadMyPosts() {
  	
	// Fetch user's posts//
	const { data: posts, error } = await supabase
		.from("posts")
		.select("id,title,content,author,date,time")
		.eq("user_id", user.id)

	if (error) {
		console.error("Post fetch error:", error)
		return
	}

	// Fetch comments for those posts//
	const { data: comments, error: commentsError } = await supabase
		.from("comments")
		.select("content, post_id, author")
		.order("created_at", { ascending: true })

		if (commentsError) {
			console.error("Comments fetch error:", commentsError)
		}

		const container = document.getElementById("sposts")
		if (!container) return

		container.innerHTML = ""

	// Render posts
	posts.forEach((row) => {
		const markup = `
			<div class="post">
				<h3 class="postTitle">${row.title}</h3>
				<p class="postContent">${row.content}</p>
				<p class="postDate-Time">${row.date} at ${row.time}</p>

				<!-- COMMENTS -->
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
		</div>`

		container.insertAdjacentHTML("beforeend", markup)
		})

	// Render comments under correct posts//
	if (comments) {
		comments.forEach((comment) => {
		const commentsContainer = document.getElementById(
			`comments-for-${comment.post_id}`
		)

		if (!commentsContainer) return

		commentsContainer.insertAdjacentHTML(
			"beforeend",
			`
			<div class="comment">
				<p>${comment.content}</p>
				<p class="commentAuthor">By ${comment.author}</p>
			</div>`
		)
		})
	}
}

loadMyPosts()
