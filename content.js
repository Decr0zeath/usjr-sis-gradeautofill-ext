chrome.runtime.onMessage.addListener((message) => {
	if (message.type !== "APPLY_GRADES") return;
	
	autofillGrades(message.payload);
});

function autofillGrades(data) {
	let filled = 0;
	let missing = [];
	
	const rows = document.querySelectorAll("tr");
	
	data.forEach(({ id, grade }) => {
		if (isNaN(grade) || grade < 0 || grade > 100) return;
		
		let matched = false;
		
		rows.forEach(row => {
			// Find the student ID cell
			const studCell = row.querySelector(".stud_no");
			if (!studCell) return;
			if (studCell.textContent.trim() !== id) return;
			
			// Find the input element for grades
			const input = row.querySelector("input.inputGrd");
			if (!input || input.disabled || input.readOnly) return;
			
			// Fill the input and trigger events
			input.value = Math.round(grade * 10);
			
			// Fire events so SIS recognizes the change
			input.dispatchEvent(new Event("input", { bubbles: true }));
			input.dispatchEvent(new Event("change", { bubbles: true }));
			
			// Optional: highlight input for visibility
			input.style.backgroundColor = "#fff3cd";
			
			filled++;
			matched = true;
		});
		
		if (!matched) missing.push(id);
	});
	
	alert(`Autofill complete\nFilled: ${filled}\nMissing IDs: ${missing.length}`);
}