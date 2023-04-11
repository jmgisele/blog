import fs from 'fs';

let file = 'kate';

export function GET() {
	const body = fs.readFileSync('./files/res/' + file + '.png');
	const headers = {
		'Content-Disposition': 'attachment; filename=' + file + '.png',
		'Cache-Control': 'Cache-Control: private',
		'Content-Type': 'image/png'
	};

	return new Response(body, {
		headers: headers
	});
}
