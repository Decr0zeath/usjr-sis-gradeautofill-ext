document.getElementById("infoBtn").addEventListener("click", () => {
	document.getElementById("mainPage").classList.add("hidden");
	document.getElementById("infoPage").classList.remove("hidden");
});

document.getElementById("backBtn").addEventListener("click", () => {
	document.getElementById("infoPage").classList.add("hidden");
	document.getElementById("mainPage").classList.remove("hidden");
});

document.getElementById("apply").addEventListener("click", async () => {
	const file = document.getElementById("csvFile").files[0];
	if (!file) return alert("Please upload a CSV file.");
	
	Papa.parse(file, {
		header: true,
		skipEmptyLines: true,
		complete: async (results) => {
			if (!results.data.length) return alert("CSV is empty.");
			if (!("student_id" in results.data[0]) || !("grade" in results.data[0])) {
				return alert("CSV must contain student_id and grade columns.");
			}
			
			// Trimming
const parsedData = results.data.map(r => ({
    id: r.student_id.trim(),
    grade: r.grade.trim()   // ALWAYS string
}));

			
			/*const parsedData = results.data.map(r => ({
				id: r.student_id.trim(),
				grade: Number(r.grade)
			})); */
			
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			
			// Inject content.js and send message
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ["content.js"]
			}, () => {
				// Send message to content script with data
				chrome.tabs.sendMessage(tab.id, {
					type: "APPLY_GRADES",
					payload: parsedData
				});
			});
		}
	});
});