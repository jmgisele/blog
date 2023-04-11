const footnoteInit = (notesSelector, footSelector) => {
	let notes = document.querySelectorAll(notesSelector);
	let i = 1;
	notes.forEach((footnote) => {
		footnote.innerHTML = `^${i}`;
		i += 1;
	});

	i = 1;
	let feet = document.querySelectorAll(footSelector);
	feet.forEach((footnote) => {
		footnote.innerHTML = `^${i}`;
		i += 1;
	});
};

export default footnoteInit;
