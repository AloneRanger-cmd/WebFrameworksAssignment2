//JS File for archive page containing every post//

import { supabase } from "../src/lib/supabase.ts"

// Fetch latest 5 posts
const { data, error } = await supabase
  .from("posts")
  .select("title,content,author,date,time")
  .order("created_at", { ascending: false })

if (error) {
  console.error("Error fetching data:", error)
}

// Render posts
const container = document.getElementById("archive")

if (container && data) {
  data.forEach((row, index) => {
    const markup = `
        <div class="post">
            <h3 class="postTitle">${row.title}</h3>
            <button onclick="hideText(${index})">Expand For content</button>
            <p id="postContent-${index}" style="display:none">${row.content}</p>
            <p class="postAuthor-date">By ${row.author} on ${row.date} at ${row.time}</p>
        </div>`
    container.insertAdjacentHTML("beforeend", markup)
    })
}

// MUST be global for inline onclick
window.hideText = function (index) {
    const el = document.getElementById(`postContent-${index}`)
    if (!el) return
    el.style.display = el.style.display === "none" ? "block" : "none"
}
