// JS File for dashboard page containing user's posts//

import { supabase } from "../src/lib/supabase.ts"

// Get current user//
const { data: { user } } = await supabase.auth.getUser()
async function loadMyPosts() {
	if (!user) {
		console.warn("No user logged in")
		return
  	}

// Fetch only this user's posts//
const { data, error } = await supabase
    .from("posts")
    .select("title,content,author,id,date,time")
    .eq("user_id", user.id)

	if (error) {
    	console.error("Error fetching data:", error)
    	return
	}

// Render posts with edit and delete options//
	const container = document.getElementById("sposts")

	if (!container) return

	data.forEach(row => {
    const markup = `
      	<div class="post">
        	<h3 class="postTitle">${row.title}</h3>
        	<p class="postContent">${row.content}</p>
			<p class="postDate-Time">${row.date} at ${row.time}</p>

			<form method="POST" action="/api/posts/delete">
  				<input type="hidden" name="post_id" value="${row.id}" />
  				<button type="submit">Delete post</button>
			</form>
			
			<form method="POST" action="/api/posts/edit">
  				<input type="hidden" name="post_id" value="${row.id}" />

  				<input type="text" name="title" value="${row.title}" required />

  				<textarea name="content" required>${row.content}</textarea>

  				<button type="submit">Save changes</button>
			</form>
      	</div>`
		
    container.insertAdjacentHTML("beforeend", markup)
	})
}
loadMyPosts()
