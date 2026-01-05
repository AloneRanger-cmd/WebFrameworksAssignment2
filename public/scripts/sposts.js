import { supabase } from "../src/lib/supabase.js"

// Import existing list items from Supabase//
const { data, error } = await supabase
    .from("posts")
    .select("title")
	if (error) {
		console.error("Error fetching data:", error)
	} else {
		console.log("Data fetched:", data)
	}

// First Render From Supabase Data//
data.forEach(user => {
    const markup = `<li class="list">${user.title}</li>`;
    document.getElementById("newList").insertAdjacentHTML("beforeend", markup);
});