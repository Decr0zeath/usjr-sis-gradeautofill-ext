chrome.runtime.onMessage.addListener((message) => {
	if (message.type !== "APPLY_GRADES") return;
	
	autofillGrades(message.payload);
});

function autofillGrades(data) {
	let filled = 0;
	let missing = [];
	
	const rows = document.querySelectorAll("tr");
	
	data.forEach(({ id, grade }) => {
		let matched = false;
		
		rows.forEach(row => {
			// Find the student ID cell
			const studCell = row.querySelector(".stud_no");
			if (!studCell) return;
			if (studCell.textContent.trim() !== id) return;
			
			// Find the input element for grades
			const input = row.querySelector("input.inputGrd");
			if (!input || input.disabled || input.readOnly) return;
			
			let numericGrade = null;

			if (grade !== "INC" && grade !== "NC" && grade !== "F") {
				numericGrade = Number(grade);
			}

			// EARLY RETURN: invalid grades
			if (
				!(grade === "INC" || grade === "NC" || grade === "F") && 
				(Number.isNaN(numericGrade) ||
				!(
					(numericGrade >= 1.0 && numericGrade <= 3.9) ||
					numericGrade === 5.0 ||
					numericGrade === 6.0 ||
					numericGrade === 7.0
				))
			) {
				input.style.backgroundColor = "#E25B55";
				return;
			}

			// Processing Valid Grades
			if (grade === "NC") input.value = 60;
			else if (grade === "INC") input.value = 70;
			else if (numericGrade >= 1.0 && numericGrade <= 3.0 || 
					numericGrade == 6.0 || numericGrade == 7.0) input.value = Math.round(numericGrade * 10);
			else if ( (numericGrade >= 3.1 && numericGrade <= 3.9) || grade === "F") input.value = 50;

			// Fire events so SIS recognizes the change
			input.dispatchEvent(new Event("input", { bubbles: true }));
			input.dispatchEvent(new Event("change", { bubbles: true }));

			input.style.backgroundColor = "#FFF3CD"; // Optional: highlight input for visibility
		
			filled++;
			matched = true;
		});
		
		if (!matched) missing.push(id);
	});
	
	alert(`Autofill complete\nFilled: ${filled}\nMissing IDs: ${missing.length}`);
}