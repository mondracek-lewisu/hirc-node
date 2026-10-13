const express = require('express')
const app = express()

const cors = require("cors")

const port = process.env.PORT || 3000

// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))
app.use(cors({ origin: '*' }))


app.get('/api/ping', (request, response) => {
	console.log('Calling "/api/ping"')
	response.type('text/plain')
	response.send('ping response')
})

app.get('/api/blood-pressure', (request, response) => {
	const systolic = request.query.systolic
	const diastolic = request.query.diastolic

	const systolicCategories = [
		'normal',
		'elevated',
		'hypertensionS1',
		'hypertensionS2',
		'hypertensiveCrisis'
	];

	const diastolicCategories = [
		'normal',
		'hypertensionS1',
		'hypertensionS2',
		'hypertensiveCrisis'
	];

	const systolicIndex = systolicCategories.indexOf(systolic);
	const diastolicIndex = diastolicCategories.indexOf(diastolic);
	let finalIndex;
	if (systolicIndex == 0 && diastolicIndex == 0) {
		finalIndex = 0;
	}
	else if (systolicIndex == 1 && diastolicIndex == 0) {
		finalIndex = 1;
	}
	else if (systolicIndex == 2 || diastolicIndex == 1) {
		finalIndex = 2;
	}
	else if (systolicIndex == 3 || diastolicIndex == 2) {
		finalIndex = 3;
	}
	else if (systolicIndex == 4 || diastolicIndex == 3) {
		finalIndex = 4;
	}
	response.json({
		category: systolicCategories[finalIndex] || 'Unknown'
	});
});

// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` +
  `press Ctrl-C to terminate.`)
)
