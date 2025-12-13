// Script for Dynamic Playlist with Shuffle Functionality//

// Import Supabase client//
import { supabase } from "../src/lib/supabase.js"

// Import existing list items from Supabase//
const { data, error } = await supabase
    .from("test")
    .select("name")
	if (error) {
		console.error("Error fetching data:", error)
	} else {
		console.log("Data fetched:", data)
	}

// First Render From Supabase Data//
data.forEach(user => {
    const markup = `<li class="list">${user.name}</li>`;
    document.getElementById("newList").insertAdjacentHTML("beforeend", markup);
});

// Add new songs to the list//
document.getElementById("addMusic").addEventListener("click", function() {
    let musicInput = document.getElementById("musicInput").value;
    if (musicInput) {
        // Insert new song into Supabase//
        const { data,  } = supabase
        .from('test')
        .insert({name: musicInput })
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
        document.getElementById("musicInput").value = "";
    }
});

