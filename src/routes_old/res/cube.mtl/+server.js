import fs from 'fs';

let file = 'cube';

export function GET() {
	const body = fs.readFileSync('./files/res/' + file + '.mtl');
	const headers = {
		'Content-Disposition': 'attachment; filename=' + file + '.mtl',
		'Cache-Control': 'Cache-Control: private',
		'Content-Type': 'text/plain'
	};

	return new Response(body, {
		headers: headers
	});
}
