// JS File for dashboard page containing user's posts//

import { supabase } from "../src/lib/supabase.ts"

// Get current user//
const { data: { user } } = await supabase.auth.getUser()
async function loadMyPosts() {
	if (!user) {
		console.warn("No user logged in")
		return
  	}

// Fetch only this user's posts
const { data, error } = await supabase
    .from("posts")
    .select("title,content,author")
    .eq("user_id", user.id)

	if (error) {
    	console.error("Error fetching data:", error)
    	return
	}

// Render posts
	const container = document.getElementById("sposts")

	if (!container) return

	data.forEach(row => {
    const markup = `
      	<div class="post">
        	<h3 class="post-title">${row.title}</h3>
        	<p class="post-content">${row.content}</p>
        	<p class="post-author">By ${row.author ?? "You"}</p>
      	</div>`
    container.insertAdjacentHTML("beforeend", markup)
	})
}
loadMyPosts()
