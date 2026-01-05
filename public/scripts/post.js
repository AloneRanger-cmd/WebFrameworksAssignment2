// Import Supabase client//
import { supabase } from "../src/lib/supabase.js"

// Import existing list items from Supabase//
const { data, error } = await supabase
    .from("posts")
    .select("title","body")
	if (error) {
		console.error("Error fetching data:", error)
	} else {
		console.log("Data fetched:", data)
	}



// Add new posts to the list//
document.getElementById("post").addEventListener("click", function() {
    let headInput = document.getElementById("headInput").value;
    let bodyInput = document.getElementById("bodyInput").value;
    if (headInput && bodyInput) {
        // Insert new post into Supabase//
        const { data,  } = supabase
        .from('posts')
        .insert({title: headInput, body: bodyInput })
        .select()
        .then(({ data, error }) => {
            if (error) {
                console.error("Error inserting data:", error)
            } else {
                console.log("Data inserted:", data)
            }
            // Update the list with the newly added song//
            data.forEach(user => {
            const markup = `<li class="list">${user.name}</li>`;
            document.getElementById("newList").insertAdjacentHTML("beforeend", markup);
            });
        });
        // Clear input field//
        document.getElementById("headInput").value = "";
        document.getElementById("bodyInput").value = "";
    }
});