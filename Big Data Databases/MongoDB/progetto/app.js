var _idCounter = "100";
const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require ('handlebars');
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express();

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:administratorDB@covidcertification.uv115.mongodb.net/test?retryWrites=true&writeConcern=majority";
const client = new MongoClient(uri);

// to have static path
app.use(express.static('../progetto'));


app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
}));

app.set('view engine', 'hbs');

// RENDER DEFAULT PAGE
app.get('/', function (req, res) {
    res.render('home', {
    });
});


// INPUT: Fiscal code of a person and a reference date.
// OUTPUT: Messages regarding validity of certificate.
// DEFINE VALIDITY OF A CERTIFICATE
// INPUT: Fiscal code of a person, reference date.
// OUTPUT: Whether the certificate is valid or not, along with the date of expiration.
async function query0(_fiscalCode) {
	try {
		var r = "";
		if (_fiscalCode === "") {
			r = "Some fields are missing.";
			return r;
		}
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const query = { fiscalCode: new RegExp(_fiscalCode)}; 
		const options = { projection: { _id: 0, issueDate: 1, current: 1} };
		const result = await certificates.findOne(query, options);

		if (result == null) {
			console.log("No certificate found for specified fiscal code.");
			r = "No certificate found for specified fiscal code.";
			return r;
		}

		// The certificate is not valid if the person is positive
		if (result.current.result == "Positive") {
			console.log("Your certificate is not valid.");
			r = "Your certificate is not valid.";
			return r;
		}

		// Compute difference in days between a reference date and the issue date.
		let referenceDate = new Date(); // Represents the current time and date
		console.log(referenceDate);
		let issue = new Date(result.issueDate);
		const diffDays = Math.abs((referenceDate - issue)/(1000*60*60*24));

		// Determine the validity period (2 days for tests, 186 days for vaccines)
		let validityPeriod;
		if (result.current.idVax === undefined) validityPeriod = 2;
		else validityPeriod = 186;

		// Compute if the certificate is expired or not and show expiration date.
		let expiration = issue;
		expiration.setDate(expiration.getDate() + validityPeriod);
		if (diffDays > validityPeriod) {
			console.log("EXPIRED. Your certificate has expired on " + expiration);
			r = "EXPIRED. Your certificate has expired on " + expiration.toDateString();
		}
		else {
			console.log("VALID. Your certificate will expire on " +  expiration);
			r = "VALID. Your certificate will expire on " + expiration.toDateString();
		}
		return r;
	} finally {
		await client.close();
	}
}


// INPUT: A range of dates.
// OUTPUT: Name of vaccine and number of persons vaccinated with it.
// NUMBER OF CURRENT VACCINATIONS GROUPED BY VACCINE BRAND IN A GIVEN RANGE

// db.covid_certificate.aggregate([{"$match": {"$and": [{"current.when": {"$gte": new Date("2020-02-01")}}, {"current.when": {"$lte": new Date("2021-12-06")}}, {"vaccines": {"$exists": true}}]}   }, {"$group": {       "_id": "$current.brand",       "count": {"$sum": 1}     }   }])
async function query1(_dateInf, _dateSup) {
	try {
		var r = "";
		if (_dateInf === "" || _dateSup === "") {
			r = "Some fields are missing.";
			return r;
		}
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const pipeline = [{"$match": {"$and": [{"current.when": {"$gte": new Date(_dateInf)}}, {"current.when": {"$lte": new Date(_dateSup)}}, {"vaccines": {"$exists": true}}]}}, {"$group": { "_id": "$current.brand", "count": {"$sum": 1}}}];
		const result = await certificates.aggregate(pipeline);
		// Use element._id to read the vaccine brand and element.count to view count of people vaccinated with that brand
		await result.forEach(function(e) {
			if (e._id != null) {
				console.log(e._id + " - " + e.count);
				r += e._id + " : " + e.count.toString() + " ; " + "\r\n";
			}
			else{
				console.log("There weren't issued vaccine during this period.");
				r = "There weren't issued vaccine during this period.";
			}
		});
		return r;
	} finally {
		await client.close();
	}
}


// INPUT: None.
// OUTPUT: Name of city and number of vaccinated citizens.
//NUMBER OF PEOPLE VACCINATED GROUPED BY CITY

// db.covid_certificate.aggregate([ {"$match": { "vaccines": {"$exists": true} } }, {"$group":{ "_id": "$city", "vaccinatedCitizens": {"$sum": 1} } }])
async function query2() {
	try {
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const pipeline = [ { $match: { vaccines: { $exists: true } } }, { $group: { _id: "$city", vaccinatedCitizens: {$sum: 1 } } } ];
		const result = await certificates.aggregate(pipeline);
        var r = ""
		// Use element._id to read the city and element.vaccinatedCitizens to see how many vaccinated people there are
		await result.forEach(function(e) {
			console.log(e._id + " - " + e.vaccinatedCitizens);
			r += e._id + " : " + e.vaccinatedCitizens.toString() + " ;" + "\r\n" ;
		});
        return r;
	} finally {
		await client.close();
	}
}


// INPUT: Vaccine lot.
// OUTPUT: Fiscal code, name, surname, email, phone number and emergency contact of persons.
// FIND ALL PERSONS VACCINATED WITH A GIVEN LOT

// db.covid_certificate.find({ "vaccines.lot" : "..." }, {"fiscalCode": 1, "name": 1, "surname": 1, "email": 1, "phoneNumber": 1, "emergencyContact": 1}
async function query3(_vaccineLot) {
	try {
		var r = "";
		if (_vaccineLot === "") {
			r = "Some fields are missing.";
			return r;
		}
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const query = { "vaccines.lot" : new RegExp(_vaccineLot) }; 
		const options = { projection: { _id: 0, fiscalCode: 1, name: 1, surname: 1, email: 1, phoneNumber: 1, emergencyContact: 1 } };
		const result = await certificates.find(query, options);
        if ((await result.count()) === 0) {
			console.log("No results.");
			r = "No results.";
			return r;
		}
		// For each element of result, use element.name / element.surname / element.fiscalCode etc. to retrieve single information
		var i = 1;
		await result.forEach(function(e) {
			console.log("RESULT " + i + " - " + e.name + " " + e.surname + " " + e.fiscalCode + ", " + e.email + " " + e.phoneNumber + " // Emergency Contact: " + e.emergencyContact);
			r += "RESULT " + i.toString() + " - " + e.name + " " + e.surname + " " + e.fiscalCode + ", " + e.email + " " + e.phoneNumber + " // Emergency Contact: " + e.emergencyContact + " ; " + "\r\n";
			i++;
		});
		return r;
	} finally {
		await client.close();
	}
}


// INPUT: None.
// OUTPUT: Fiscal code, name and surname of persons.
//FIND PEOPLE WITH AT LEAST ONE VACCINATION AND ONE COVID TEST

// db.covid_certificate.find({ "$and" : [{"tests" : { "$exists" : true}}, {"vaccines" : { "$exists" : true} }] }, { "fiscalCode":1, "name":1, "surname":1 })
async function query4() {
	try {
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const query = { "$and" : [{"tests" : { "$exists" : true}}, {"vaccines" : { "$exists" : true} }] };
		const options = { projection: { _id: 0, fiscalCode: 1, name: 1, surname: 1 } };
		const result = await certificates.find(query, options);
        var r = ""
        if ((await result.count()) === 0) {
			console.log("No results.");
			r = "No results.";
			return r;
		}
		// For each element of result, use element.name / element.surname / element.fiscalCode to retrieve single information
		var i = 1;
		await result.forEach(function(e) {
			console.log("CERTIFICATE " + i + " - " + e.name + " " + e.surname + ", " + e.fiscalCode);
			r += "CERTIFICATE " + i.toString() + " - " + e.name + " " + e.surname + ", " + e.fiscalCode + " ; \r\n";
			i++;
		});
		return r;
	} finally {
		await client.close();
	}
}


// INPUT: ID of an authorized body.
// OUTPUT: Certificates issued by the authorized body.
//RETURN THE LAST 20 EXISTENT CERTIFICATES ISSUED BY A GIVEN AUTHORITY BODY

// db.covid_certificate.find ({ "authorizedBody.idBody" : "..." }).sort({ issueDate: -1 }).limit(20)
async function query5(_authorityID) {
	try {
		var r = "";
		if (_authorityID === "") {
			r = "Some fields are missing.";
			return r;
		}
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const query = { "authorizedBody.idBody": new RegExp(_authorityID) }; //'6164'
		const options = { projection: { _id: 0 }, sort: { issueDate: -1 } };
		const result = await certificates.find(query, options).limit(20);
		var r = ""
        if ((await result.count()) === 0) {
			console.log("No results.");
			r = "No results.";
			return r;
		}
		// "result" is an array of up to 20 documents. For each document in result, one can use document.issueDate, document.name, document.surname etc. to access fields.
        var i = 1;
		await result.forEach(function(e) {
		    if (i == 1)
			console.log("Certificates issued by authorized body: " + e.authorizedBody.name + " (" + e.authorizedBody.address + " - " + e.authorizedBody.city + ")\n");
			console.log("CERTIFICATE " + i + ", issued on " + e.issueDate + " - " + e.name + " " + e.surname + " " + e.fiscalCode + ", " + e.email + " " + e.phoneNumber + " " + e.address + " " + e.city);
			r += "CERTIFICATES ISSUED BY: " + e.authorizedBody.name + " (" + e.authorizedBody.address + " - " + e.authorizedBody.city + ") " + " -> CERTIFICATE " + i.toString() + ", issued on " + e.issueDate + " - " + e.name + " " + e.surname + " " + e.fiscalCode + ", " + e.email + " " + e.phoneNumber + " " + e.address + " " + e.city + " ; "+ "\r\n\n";
			i++;
		});
		return r;
	} finally {
		await client.close();
	}
}



//UPDATE AN EXISTING CERTIFICATE WITH A NEW VACCINATION
async function command1(_c1Fiscal, _c1idVax, _c1Lot, _c1Type, _c1Brand, _c1Prod, _c1When, _c1Where, _c1authBody, _c1authBodyName, _c1authBodyDesc, _c1authBodyLoc, _c1authBodyType, _c1authBodyDep, _c1authBodyAddr, _c1authBodyCity, _c1persFC, _c1nurseFC) {
	try {
		var r = "";
		if (_c1Fiscal === "" || _c1idVax === "" || _c1Lot === "" || _c1Type === "" || _c1Brand === "" || _c1Prod === "" || _c1When === "" || _c1Where === "" || _c1authBody === "" || _c1authBodyName === "" || _c1authBodyDesc === null || _c1authBodyLoc === "" || _c1authBodyType === "" || _c1authBodyDep === "" || _c1authBodyAddr === "" || _c1authBodyCity === "" || _c1persFC === "" || _c1nurseFC === "") {
			r = "Some fields are missing.";
			return r;
		}
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');

		const filter = {fiscalCode: _c1Fiscal};
		const update1 = {$unset: {"current": ""}};
		const update = { $push: {vaccines: {idVax: _c1idVax, lot: _c1Lot, type: _c1Type, brand: _c1Brand, productionDate: new Date(_c1Prod), when: new Date(_c1When), where: _c1Where }}, $set: { "current.idVax": _c1idVax, "current.lot": _c1Lot, "current.type": _c1Type, "current.brand": _c1Brand, "current.productionDate": new Date(_c1Prod), "current.when": new Date(_c1When), "current.where": _c1Where, issueDate: new Date(_c1When), "authorizedBody.idBody": _c1authBody, "authorizedBody.name": _c1authBodyName, "authorizedBody.description": _c1authBodyDesc, "authorizedBody.location": _c1authBodyLoc, "authorizedBody.entityType": _c1authBodyType, "authorizedBody.department": _c1authBodyDep, "authorizedBody.address": _c1authBodyAddr, "authorizedBody.city": _c1authBodyCity, personnel: [{fiscalCode: _c1persFC, job: "Doctor"},{fiscalCode: _c1nurseFC, job: "Nurse"}]}};

		certificates.updateOne(filter, update1);
		const result = await certificates.updateOne(filter, update);
		if (result.matchedCount == 0) {
			console.log("No certificate found for specified fiscal code.");
			r = "No certificate found for specified fiscal code.";
			return r;
		}
		else if (result.modifiedCount == 0) {
			console.log("Something went wrong. The certificate was not modified.");
			r = "Something went wrong. The certificate was not modified.";
			return r;
		}
		else {
			console.log("The certificate was updated succesfully.");
			r = "The certificate was updated succesfully.";
			return r;
		}
	} finally {
		await client.close();
	}
}


//INSERT A NEW CERTIFICATE FOR A TEST
async function command2(_c2Fiscal, _c2Name, _c2Surname, _c2Gender, _c2Address, _c2City, _c2Phone, _c2Email, _c2Emergency, _c2Date, _c2Res, _c2IdTest,_c2Where, _c2PersFC, _c2AuthBodyId, _c2AuthBodyName, _c2AuthBodyDesc, _c2AuthBodyLoc, _c2AuthBodyType, _c2AuthBodyDep, _c2AuthBodyAddr, _c2AuthBodyCity) {
	try {
		var r = "";
		if (_c2Fiscal === "" || _c2Name === "" || _c2Surname === "" || _c2Gender === "" || _c2Address === "" || _c2City === "" || _c2Phone === "" || _c2Email === "" || _c2Emergency === "" || _c2Date === "" || _c2Res === "" || _c2IdTest === "" || _c2Where === "" || _c2PersFC === "" || _c2AuthBodyId === "" || _c2AuthBodyName === "" || _c2AuthBodyDesc === "" || _c2AuthBodyLoc === "" || _c2AuthBodyType === "" || _c2AuthBodyDep === "" || _c2AuthBodyAddr === "" || _c2AuthBodyCity === "") {
		r = "Some fields are missing.";
		return r;
		}
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const insert = {idCertificate: _idCounter++, issueDate: new Date(_c2Date), fiscalCode: _c2Fiscal, name: _c2Name, surname: _c2Surname, gender: _c2Gender, address: _c2Address, city: _c2City, phoneNumber: _c2Phone, email: _c2Email, emergencyContact: _c2Emergency, current: {idTest: _c2IdTest, result: _c2Res, when: new Date(_c2Date), where: _c2Where}, tests: [{idTest: _c2IdTest, result: _c2Res, when: new Date(_c2Date), where: _c2Where}], personnel:[{fiscalCode: _c2PersFC, job: "doctor"}], authorizedBody: {idBody: _c2AuthBodyId, name: _c2AuthBodyName, description: _c2AuthBodyDesc, location: _c2AuthBodyLoc, entityType: _c2AuthBodyType, department: _c2AuthBodyDep, address: _c2AuthBodyAddr, city: _c2AuthBodyCity}};
		const result = await certificates.insertOne(insert);
		console.log("A document was inserted with the _id: " + result.insertedId);
		if (result.insertedId != null) r = "Success!";
		else r = "Something went wrong.";
		return r;
	} finally {
		await client.close();
	}
}


//DELETE A CERTIFICATE OF A GIVEN PERSON
async function command3(_c3fiscal) {
	try {
		var r = "";
		if (_c3fiscal === "") {
			r = "Some fields are missing.";
			return r;
		}
		// Connect to DB and prepare query
		await client.connect();
		const database = client.db('covid_data');
		const certificates = database.collection('covid_certificate');
		const deleteDoc = {fiscalCode: _c3fiscal}
		const result = await certificates.deleteOne(deleteDoc);
		if (result.deletedCount == 0) {
			console.log("Something went wrong. There may be no certificate associated with specified fiscal code.");
			r = "Something went wrong. Check the inserted fiscal code.";
			return r;
		}
		else {
			console.log("The certificate was deleted succesfully.");
			r = "The certificate was deleted succesfully:";
			return r;
		}
	} finally {
		await client.close();
	}
}

Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});


app.post('/q0', urlencodedParser, (req, res) => {
    console.log('Got query 0 body:', req.body);
    var _fiscalCode = req.body.fiscal_code;
    var _referenceDate = req.body.reference_date;
    query0(_fiscalCode, _referenceDate).then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_query0: box
            }
        });
    });
});


app.post('/q1', urlencodedParser, (req, res) => {
    console.log('Got query 1 body:', req.body);
   var _dateInf = req.body.date_inf;
   var _dateSup = req.body.date_sup;

    query1(_dateInf, _dateSup).then(function(result) {
        //console.log(result);
        //var box = JSON.stringify(result, undefined, 4);
        var box = result;
        //console.log(box);
        res.render('home', {
            post:{
                outDiv_query1: box
            }
        });
    });
});


app.post('/q2', urlencodedParser, (req, res) => {
    console.log('Got query 2 body:', req.body);
    query2().then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_query2: box
            }
        });
    });
});


app.post('/q3', urlencodedParser, (req, res) => {
    console.log('Got query 3 body:', req.body);
    var _vaccineLot = req.body.vaccine_lot;
    query3(_vaccineLot).then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_query3: box
            }
        });
    });
});


app.post('/q4', urlencodedParser, (req, res) => {
    console.log('Got query 4 body:', req.body);
    query4().then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_query4: box
            }
        });
    });
});


app.post('/q5', urlencodedParser, (req, res) => {
    console.log('Got query 5 body:', req.body);
    var _authorityID = req.body.authority_id;
    query5(_authorityID).then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_query5: box
            }
        });
    });
});


app.post('/c1', urlencodedParser, (req, res) => {
    console.log('Got command 1 body:', req.body);

    var _c1Fiscal = req.body.c1_fiscal;
    var _c1idVax = req.body.c1_idVax;
    var _c1Lot = req.body.c1_lot;
    var _c1Type = req.body.c1_type;
    var _c1Brand = req.body.c1_brand;
    var _c1Prod = req.body.c1_production_date;
    var _c1When = req.body.c1_when;
    var _c1Where = req.body.c1_where;
	var _c1authBody = req.body.c1_authBody;
	var _c1authBodyName = req.body.c1_authBodyName;
	var _c1authBodyDesc = req.body.c1_authBodyDesc;
	var _c1authBodyLoc = req.body.c1_authBodyLoc;
	var _c1authBodyType = req.body.c1_authBodyType;
	var _c1authBodyDep = req.body.c1_authBodyDep;
	var _c1authBodyAddr = req.body.c1_authBodyAddr;
	var _c1authBodyCity = req.body.c1_authBodyCity;
	var _c1persFC = req.body.c1_persFC;
	var _c1nurseFC = req.body.c1_nurseFC;
    command1(_c1Fiscal, _c1idVax, _c1Lot, _c1Type, _c1Brand, _c1Prod, _c1When, _c1Where, _c1authBody, _c1authBodyName, _c1authBodyDesc, _c1authBodyLoc, _c1authBodyType, _c1authBodyDep, _c1authBodyAddr, _c1authBodyCity, _c1persFC, _c1nurseFC).then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_command1: box
            }
        });
    });
});

app.post('/c2', urlencodedParser, (req, res) => {
    console.log('Got command 2 body:', req.body);

    var _c2Fiscal = req.body.c2_fiscal;
    var _c2Name = req.body.c2_name;
var _c2Surname = req.body.c2_surname;
var _c2Gender = req.body.c2_gender;
var _c2Address = req.body.c2_address;
var _c2City = req.body.c2_city;
var _c2Phone = req.body.c2_phone;
var _c2Email = req.body.c2_email;
var _c2Emergency = req.body.c2_emergency;
var _c2Date = req.body.c2_date;
var _c2Res = req.body.c2_result;
var _c2IdTest = req.body.c2_id_test;
var _c2Where = req.body.c2_test_where;
var _c2PersFC = req.body.c2_pers_fc;
var _c2AuthBodyId = req.body.c2_auth_body_id;
var _c2AuthBodyName = req.body.c2_auth_body_name;
var _c2AuthBodyDesc = req.body.c2_auth_body_desc;
var _c2AuthBodyLoc = req.body.c2_auth_body_loc;
var _c2AuthBodyType = req.body.c2_auth_body_type;
var _c2AuthBodyDep = req.body.c2_auth_body_dep;
var _c2AuthBodyAddr = req.body.c2_auth_body_addr;
var _c2AuthBodyCity = req.body.c2_auth_body_city;
    command2(_c2Fiscal, _c2Name, _c2Surname, _c2Gender, _c2Address, _c2City, _c2Phone, _c2Email, _c2Emergency, _c2Date, _c2Res, _c2IdTest,_c2Where, _c2PersFC, _c2AuthBodyId, _c2AuthBodyName, _c2AuthBodyDesc, _c2AuthBodyLoc, _c2AuthBodyType, _c2AuthBodyDep, _c2AuthBodyAddr, _c2AuthBodyCity).then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_command2: box
            }
        });
    });
});

app.post('/c3', urlencodedParser, (req, res) => {
    console.log('Got command 3 body:', req.body);

    var _c3fiscal = req.body.c3_fiscal;
    command3(_c3fiscal).then(function(result) {
        var box = result;
        res.render('home', {
            post:{
                outDiv_command3: box
            }
        });
    });
});



app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});

