const footnoteInit = (notesSelector, footSelector) => {
	numbering_footnotes(notesSelector);
	numbering_footnotes(footSelector);
	add_color_cue(notesSelector, footSelector);
};

const numbering_footnotes = (list) => {
	let notes = document.querySelectorAll(list);
	let i = 1;
	notes.forEach((footnote) => {
		footnote.innerHTML = `^${i}`;
		i += 1;
	});
};

const add_color_cue = (body, footer) => {
	let body_list = document.querySelectorAll(body);
	let footnotes_list = document.querySelectorAll(footer);

	body_list.forEach((footnote) => {
		const id = footnote.getAttribute('href');

		footnote.addEventListener('click', () => {
			const paired_body_anchor = document.querySelector(id);
			paired_body_anchor.classList.add('pulse');
			setTimeout(() => paired_body_anchor.classList.remove('pulse'), 1600);
		});
	});

	footnotes_list.forEach((footnote) => {
		const id = footnote.getAttribute('href');

		footnote.addEventListener('click', () => {
			let paired_footnote = document.querySelector(id).previousSibling;
			while (paired_footnote && paired_footnote.nodeType != 1) {
				paired_footnote = paired_footnote.previousSibling;
			}

			paired_footnote.classList.add('pulse');
			setTimeout(() => paired_footnote.classList.remove('pulse'), 1600);
		});
	});
};

export default footnoteInit;
