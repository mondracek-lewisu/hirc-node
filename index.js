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
	console.log('API called: GET /api/blood-pressure');
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

	const category = systolicCategories[finalIndex] || 'Unknown';

    console.log(`Sending blood pressure response: ${category}`);

    response.json({
        category: category
	});
});

//BMI API
	app.get('/api/bmi', (request, response) => {
		console.log('API called: GET /api/bmi');
		
		const feetText = request.query.feet;
    	const inchesText = request.query.inches;
    	const weightText = request.query.weight;

		if (
			feetText === undefined ||
        	inchesText === undefined ||
        	weightText === undefined ||
        	feetText.trim() === '' ||
        	inchesText.trim() === '' ||
        	weightText.trim() === ''
		) {
			return response.status(400).json({ error: 'Enter a valid height in feet and inches and a weight greater than zero' });
		}

		const feet = Number(feetText);
    	const inches = Number(inchesText);
    	const weight = Number(weightText);


		if (
			!Number.isFinite(feet) ||
        	!Number.isFinite(inches) ||
        	!Number.isFinite(weight) ||
        	!Number.isInteger(feet) ||
        	!Number.isInteger(inches) ||
        	feet < 0 ||
        	inches < 0 ||
        	inches > 11 ||
        	feet + inches === 0 ||
        	weight <= 0

		) {
			return response.status(400).json({ error: 'Invalid. Enter a valid height in feet and inches and a weight greater than zero' });
		}

		const totalInches = feet * 12 + inches;
		const bmi = (703 * weight) / (totalInches * totalInches);

		let category;

		if (bmi < 18.5) {
			category = 'Underweight';
		} else if (bmi < 25) {
			category = 'Normal weight';
		} else if (bmi < 30) {
			category = 'Overweight';
		} else {
			category = 'Obese';
		}

		const roundedBmi = Number(bmi.toFixed(1));

		console.log('Sending BMI response:', { bmi, category });
		response.json({
			bmi: roundedBmi,
			category: category
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
