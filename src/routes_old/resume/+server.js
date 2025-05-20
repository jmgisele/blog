import fs from 'fs';

let file = 'james_gisele_resume';

export function GET() {
	const body = fs.readFileSync('./files/' + file + '.pdf');
	const headers = {
		'Content-Disposition': 'attachment; filename=' + file + '.pdf',
		'Cache-Control': 'Cache-Control: private',
		'Content-Type': 'application/pdf'
	};

	return new Response(body, {
		headers: headers
	});
}
