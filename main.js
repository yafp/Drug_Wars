
/*
- create all potential drugs
- create events (mugged, police, etc)

*/

var bank = 0;
var debt = Math.floor(0); 
var currentLocation;
var cashSpent = 0; 
var cashEarned = 0; 
var lastTime = 0;


// store current drugs units you own

var currentDrugs = 	{

			acid:0,
			coke:0,
			steroids:0,
			meth:0,
			heroin:0


			};


// store cost and units of drugs on market

var drugs = {

		// store cost per unit
		acid:0,
		coke:0,
		steroids:0,
		meth:0,
		heroin:0

		
		}; 



// turn num into an amount and var it 
var coke_unit = generateUnits();
var acid_unit = generateUnits();
var steroids_unit = generateUnits();
var meth_unit = generateUnits();
var heroin_unit = generateUnits();

// set a total for the shark - NOT USED YET
// var shark = {capital:10000};

// set locations for visiting 
var locations = {ny: "nyc", lnd: "lnd"};  

// get a random unit amount under 50
function generateUnits(){ return Math.floor((Math.random()*50)+1) };


// hide divs
$('#sell_Drugs').hide();
$('#loanshark_div').hide();
$('#buy_Drugs').hide();





		

// LETS GET STARTED

var start = {

		play: function(){

			// set bank, debt
			$('#inBank').html("$"+bank); 
			$('#debt').html("$"+debt);
			
			// set list of drugs
			$('#realAcid').html("Acid: " + currentDrugs.acid);
			$('#realCoke').html("Coke: " + currentDrugs.coke);
			$('#realSteroids').html("Steroids: " + currentDrugs.steroids);
			$('#realMeth').html("Meth: " + currentDrugs.meth);
			$('#realHeroin').html("Heroin: " + currentDrugs.heroin);

			// how many units available
			$('#acidUnits').html(acid_unit);
			$('#cokeUnits').html(coke_unit);
			$('#steroidsUnits').html(steroids_unit);
			$('#methUnits').html(meth_unit);
			$('#heroinUnits').html(heroin_unit);
		
			// cost per unit
			$('#acidPerUnit').html("$"+drugs.acid);
			$('#cokePerUnit').html("$"+drugs.coke);
			$('#steroidsPerUnit').html("$"+drugs.steroids);
			$('#methPerUnit').html("$"+drugs.meth);
			$('#heroinPerUnit').html("$"+drugs.heroin);

			// Setup for NYC
			currentLocation = locations.ny; 

			// change city title
			$('#market').append(' New York City');

			// cost per unit in nyc
			drugs.acid = 700;
			drugs.coke = 1400;
			drugs.steroids = 300;
			drugs.meth = 50;
			drugs.heroin = 900;

		
		}, // play


		// Create Debt with Time

		setTimes: function(){

			setInterval(function(){

				console.log("1 min and 20 points later")

				var interest = debt * 0.20;
				debt = Math.floor(debt + interest); 
				$('#debt').html("$"+debt);

			}, 60000);

			
		} // end of setTimes

		}; // end start function

start.play();
start.setTimes();
sellPrice(); 



// hide section based on click:

$('#choose_selld').click(function(event) {
	
	$('#loanshark_div').hide();
	$('#buy_Drugs').hide();
	$('#sell_Drugs').toggle(400); 

});

$('#choose_buyd').click(function(event) {
	
	$('#sell_Drugs').hide();
	$('#loanshark_div').hide();
	$('#buy_Drugs').toggle(400); 

});

$('#choose_loan').click(function(event) {
	
	$('#sell_Drugs').hide();
	$('#buy_Drugs').hide();
	$('#loanshark_div').toggle(400); 

});






	// Borrow Money Click Func


	$('#btn').click(function(event) {
	
	var amount = $('input').val(); 
	console.log(amount);
	var b = parseInt(amount); 
	 

	// work out new bank balance
	bank = bank + b;
	console.log("your new balance is " + bank);

	// update my bank
	$('#inBank').html("$"+bank);


	// update the debt
	debt = debt + b;
	$('#debt').html("$"+debt);

	});


	// Pay Back Money 

	$('#btn_payDebt').click(function(event) {
	
	var amount = $('#payDebt').val();
	console.log(amount);
	var b = parseInt(amount); 
	 

	// work out new bank balance
	bank = bank - b;
	console.log("your new balance is " + bank);

	// update my bank
	$('#inBank').html("$"+bank);


	// update the debt
	debt = debt - b;
	$('#debt').html("$"+debt);

	});





	var pickedAcid = false;
	var pickedCoke = false;
	var pickedSteroids = false;
	var pickedMeth = false;
	var pickedHeroin = false; 
	





	// check if drug box got ticked -

	$('#acid_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want acid");
			$('#coke_tick').prop('checked', false);
			$('#steroids_tick').prop('checked', false);
			$('#meth_tick').prop('checked', false);
			$('#heroin_tick').prop('checked', false);

			pickedAcid = true;
			pickedCoke = false;
			pickedSteroids = false;
	 		pickedMeth = false;
	 		pickedHeroin = false;  
		}	

	});

	$('#coke_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want coke");
			$('#acid_tick').prop('checked', false);
			$('#steroids_tick').prop('checked', false);
			$('#meth_tick').prop('checked', false);
			$('#heroin_tick').prop('checked', false);
			
			pickedCoke = true;
			pickedAcid = false;
			pickedSteroids = false;
	 		pickedMeth = false;
	 		pickedHeroin = false; 
		}	

	});

	$('#steroids_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want steroids");
			$('#acid_tick').prop('checked', false);
			$('#coke_tick').prop('checked', false);
			$('#meth_tick').prop('checked', false);
			$('#heroin_tick').prop('checked', false);
			
			pickedCoke = false;
			pickedAcid = false;
			pickedSteroids = true;
	 		pickedMeth = false;
	 		pickedHeroin = false; 
		}	

	});

	$('#meth_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want meth");
			$('#acid_tick').prop('checked', false);
			$('#steroids_tick').prop('checked', false);
			$('#coke_tick').prop('checked', false);
			$('#heroin_tick').prop('checked', false);
			
			pickedCoke = false;
			pickedAcid = false;
			pickedSteroids = false;
	 		pickedMeth = true;
	 		pickedHeroin = false; 
		}	

	});

	$('#heroin_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want heroin");
			$('#acid_tick').prop('checked', false);
			$('#steroids_tick').prop('checked', false);
			$('#meth_tick').prop('checked', false);
			$('#coke_tick').prop('checked', false);

			pickedCoke = false;
			pickedAcid = false;
			pickedSteroids = false;
	 		pickedMeth = false;
	 		pickedHeroin = true; 
		}	

	});
	








	
	// check if SELL drug box got ticked

	$('#s_acid_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want to sell acid");
			$('#s_coke_tick').prop('checked', false);
			$('#steroids_tick').prop('checked', false);
			$('#meth_tick').prop('checked', false);
			$('#heroin_tick').prop('checked', false);
			
			pickedAcid = true;
			pickedCoke = false;
			pickedSteroids = false;
	 		pickedMeth = false;
	 		pickedHeroin = false;  
		}	

	});

	$('#s_coke_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want to sell coke");
			$('#s_acid_tick').prop('checked', false);
			$('#steroids_tick').prop('checked', false);
			$('#meth_tick').prop('checked', false);
			$('#heroin_tick').prop('checked', false);
			
			pickedCoke = true;
			pickedAcid = false;
			pickedSteroids = false;
	 		pickedMeth = false;
	 		pickedHeroin = false; 
		}	

	});



	$('#s_steroids_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want steroids");
			$('#s_acid_tick').prop('checked', false);
			$('#s_coke_tick').prop('checked', false);
			$('#s_meth_tick').prop('checked', false);
			$('#s_heroin_tick').prop('checked', false);
			
			pickedCoke = false;
			pickedAcid = false;
			pickedSteroids = true;
	 		pickedMeth = false;
	 		pickedHeroin = false; 
		}	

	});

	$('#s_meth_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want meth");
			$('#s_acid_tick').prop('checked', false);
			$('#s_steroids_tick').prop('checked', false);
			$('#s_coke_tick').prop('checked', false);
			$('#s_heroin_tick').prop('checked', false);
			
			pickedCoke = false;
			pickedAcid = false;
			pickedSteroids = false;
	 		pickedMeth = true;
	 		pickedHeroin = false; 
		}	

	});

	$('#s_heroin_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want heroin");
			$('#s_acid_tick').prop('checked', false);
			$('#s_steroids_tick').prop('checked', false);
			$('#s_meth_tick').prop('checked', false);
			$('#s_coke_tick').prop('checked', false);

			pickedCoke = false;
			pickedAcid = false;
			pickedSteroids = false;
	 		pickedMeth = false;
	 		pickedHeroin = true; 
		}	

	});



































	var b_drugcost; 
	var b_drugunit; 
	var b_drugiown;
	var b_insert_drugunit; 
	var b_insert_drugiown; 



	// Buy Drugs Click Func

	$('#drugBtn').click(function(event) {
	
	// check that a tick box is selected
	if (

		pickedAcid === false 
		&& pickedCoke === false
		&& pickedSteroids === false
		&& pickedMeth === false
		&& pickedHeroin === false

		){

		alert("you need to pick a drug");
		return;

	}

	
	// turn number of units into a number 
	var xUnits = $('input[id="buyDrugs"]').val(); 
	console.log("you want to buy " + xUnits + " units");
	var numUnits = parseInt(xUnits); 

	
	


// Buy Drugs Optimised. 
	

	if (pickedAcid === true){

	
	b_drugcost = drugs.acid; 
	b_drugunit = acid_unit; 
	b_drugiown = currentDrugs.acid;
	 
	
	IbuyDrugs();
	b_insert_drugunit = $('#acidUnits').html(b_drugunit);
	b_insert_drugiown = $('#realAcid').html("Acid: " + b_drugiown);
	
	currentDrugs.acid = b_drugiown;
	acid_unit = b_drugunit;  


	} // end of IF Picked Acid



	else if (pickedCoke === true){

	b_drugcost = drugs.coke; 
	b_drugunit = coke_unit; 
	b_drugiown = currentDrugs.coke;
	
	
	IbuyDrugs();
	b_insert_drugunit = $('#cokeUnits').html(b_drugunit);
	b_insert_drugiown = $('#realCoke').html("Coke: " + b_drugiown);
	
	currentDrugs.coke = b_drugiown;
	coke_unit = b_drugunit;  


	} // end of IF Picked Coke	




	else if (pickedSteroids === true){

	b_drugcost = drugs.steroids; 
	b_drugunit = steroids_unit; 
	b_drugiown = currentDrugs.steroids;
	
	
	IbuyDrugs();
	b_insert_drugunit = $('#steroidsUnits').html(b_drugunit);
	b_insert_drugiown = $('#realSteroids').html("Steroids: " + b_drugiown);
	
	currentDrugs.steroids = b_drugiown;
	steroids_unit = b_drugunit;  


	} // end of IF Picked steroids	


	else if (pickedMeth === true){

	b_drugcost = drugs.meth; 
	b_drugunit = meth_unit; 
	b_drugiown = currentDrugs.meth;
	
	
	IbuyDrugs();
	b_insert_drugunit = $('#methUnits').html(b_drugunit);
	b_insert_drugiown = $('#realMeth').html("Meth: " + b_drugiown);
	
	currentDrugs.meth = b_drugiown;
	meth_unit = b_drugunit;  


	} // end of IF Picked meth	



	else if (pickedHeroin === true){

	b_drugcost = drugs.heroin; 
	b_drugunit = heroin_unit; 
	b_drugiown = currentDrugs.heroin;
	
	
	IbuyDrugs();
	b_insert_drugunit = $('#heroinUnits').html(b_drugunit);
	b_insert_drugiown = $('#realHeroin').html("Heroin: " + b_drugiown);
	
	currentDrugs.heroin = b_drugiown;
	heroin_unit = b_drugunit;  


	} // end of IF Picked heroin	


























	function IbuyDrugs(){ 

	cashSpent = b_drugcost * numUnits;
	console.log("you spent " + cashSpent);

	// check to see if you can afford it

	if (bank - cashSpent < 0){

		alert("you can't afford that!");
		return;
	}

	// check to see if have enough units

	if (b_drugunit < numUnits){

		alert("not enough units, select less!");
		return;
	}

	// update units of drugs you own
	b_drugiown = b_drugiown + numUnits;

	// remove units once bought 
	b_drugunit = b_drugunit - numUnits;
	
	// work out new bank balance
	bank = bank - cashSpent;
	console.log(bank);

	// update my bank
	$('#inBank').html("$"+bank); 


	}// end of ibuyacid


	}); // end of BUY button 



	




	// Calculate Sales Price

	var sell_Acid;
	var sell_Coke;
	var sell_Steroids;
	var sell_Meth;
	var sell_Heroin;


	function sellPrice(){

	sell_Acid = 0;
	
	if (acid_unit < 10){ sell_Acid = Math.round(drugs.acid / 100 * 30 + drugs.acid); }
	else if (acid_unit < 20){ sell_Acid = Math.round(drugs.acid / 100 * 20 + drugs.acid); }
	else if (acid_unit < 30){ sell_Acid = Math.round(drugs.acid / 100 * 10 + drugs.acid); }
	else if (acid_unit < 40){ sell_Acid = Math.round(drugs.acid / 100 * 5 + drugs.acid); }
	else { sell_Acid = Math.round(drugs.acid / 100 * 3 + drugs.acid); }

	sell_Coke = 0;
	
	if (coke_unit < 10){ sell_Coke = Math.round(drugs.coke / 100 * 30 + drugs.coke); }
	else if (coke_unit < 20){ sell_Coke = Math.round(drugs.coke / 100 * 20 + drugs.coke); }
	else if (coke_unit < 30){ sell_Coke = Math.round(drugs.coke / 100 * 10 + drugs.coke); }
	else if (coke_unit < 40){ sell_Coke = Math.round(drugs.coke / 100 * 5 + drugs.coke); }
	else { sell_Coke = Math.round(drugs.coke / 100 * 3 + drugs.coke); }

	sell_Steroids = 0;
	
	if (steroids_unit < 10){ sell_Steroids = Math.round(drugs.steroids / 100 * 30 + drugs.steroids); }
	else if (steroids_unit < 20){ sell_Steroids = Math.round(drugs.steroids / 100 * 20 + drugs.steroids); }
	else if (steroids_unit < 30){ sell_Steroids = Math.round(drugs.steroids / 100 * 10 + drugs.steroids); }
	else if (steroids_unit < 40){ sell_Steroids = Math.round(drugs.steroids / 100 * 5 + drugs.steroids); }
	else { sell_Steroids = Math.round(drugs.steroids / 100 * 3 + drugs.steroids); }

	sell_Meth = 0;
	
	if (meth_unit < 10){ sell_Meth = Math.round(drugs.meth / 100 * 30 + drugs.meth); }
	else if (meth_unit < 20){ sell_Meth = Math.round(drugs.meth / 100 * 20 + drugs.meth); }
	else if (meth_unit < 30){ sell_Meth = Math.round(drugs.meth / 100 * 10 + drugs.meth); }
	else if (meth_unit < 40){ sell_Meth = Math.round(drugs.meth / 100 * 5 + drugs.meth); }
	else { sell_Meth = Math.round(drugs.meth / 100 * 3 + drugs.meth); }

	sell_Heroin = 0;
	
	if (heroin_unit < 10){ sell_Heroin = Math.round(drugs.heroin / 100 * 30 + drugs.heroin); }
	else if (heroin_unit < 20){ sell_Heroin = Math.round(drugs.heroin / 100 * 20 + drugs.heroin); }
	else if (heroin_unit < 30){ sell_Heroin = Math.round(drugs.heroin / 100 * 10 + drugs.heroin); }
	else if (heroin_unit < 40){ sell_Heroin = Math.round(drugs.heroin / 100 * 5 + drugs.heroin); }
	else { sell_Heroin = Math.round(drugs.heroin / 100 * 3 + drugs.heroin); }

	// sell per unit

	$('#acidSell').html("$"+sell_Acid);
	$('#cokeSell').html("$"+sell_Coke);
	$('#steroidsSell').html("$"+sell_Steroids); 
	$('#methSell').html("$"+sell_Meth); 
	$('#heroinSell').html("$"+sell_Heroin);   


	} // end of sales price function













	// How to SELL drugs

	$('#sellBtn').click(function(event) {
	
	// check that a tick box is selected
	if (

		pickedAcid === false 
		&& pickedCoke === false
		&& pickedSteroids === false
		&& pickedMeth === false
		&& pickedHeroin === false

		){

		alert("you need to pick a drug");
		return;

	}

	
	// turn number of units into a number 
	var xUnits = $('input[id="sellDrugs"]').val(); 
	console.log("you want to sell " + xUnits + " units");
	var numUnits = parseInt(xUnits); 



	// Sell Drugs Optimised

	var s_drugcost; 
	var s_drugunit; 
	var s_drugiown;
	var s_insert_drugunit; 
	var s_insert_drugiown;
	var s_sellDrug; 
	

	if (pickedAcid === true){

	s_drugcost = drugs.acid; 
	s_drugunit = acid_unit; 
	s_drugiown = currentDrugs.acid;
	s_sellDrug = sell_Acid; 
	
	IsellDrugs();
	s_insert_drugunit = $('#acidUnits').html(s_drugunit);
	s_insert_drugiown = $('#realAcid').html("Acid: " + s_drugiown);

	currentDrugs.acid = s_drugiown;
	coke_acid = s_drugunit;    


	} // end of IF Picked Acid

	else if (pickedCoke === true){

	s_drugcost = drugs.coke; 
	s_drugunit = coke_unit; 
	s_drugiown = currentDrugs.coke;
	s_sellDrug = sell_Coke;
	
	IsellDrugs();
	s_insert_drugunit = $('#cokeUnits').html(s_drugunit);
	s_insert_drugiown = $('#realCoke').html("Coke: " + s_drugiown);

	currentDrugs.coke = s_drugiown;
	coke_unit = s_drugunit;    


	} // end of IF Picked Coke	


	else if (pickedSteroids === true){

	s_drugcost = drugs.steroids; 
	s_drugunit = steroids_unit; 
	s_drugiown = currentDrugs.steroids;
	s_sellDrug = sell_Steroids;
	
	IsellDrugs();
	s_insert_drugunit = $('#steroidsUnits').html(s_drugunit);
	s_insert_drugiown = $('#realSteroids').html("Steroids: " + s_drugiown);

	currentDrugs.steroids = s_drugiown;
	steroids_unit = s_drugunit;    


	} // end of IF Picked steroids	


	else if (pickedMeth === true){

	s_drugcost = drugs.meth; 
	s_drugunit = meth_unit; 
	s_drugiown = currentDrugs.meth;
	s_sellDrug = sell_Meth;
	
	IsellDrugs();
	s_insert_drugunit = $('#methUnits').html(s_drugunit);
	s_insert_drugiown = $('#realMeth').html("Meth: " + s_drugiown);

	currentDrugs.meth = s_drugiown;
	meth_unit = s_drugunit;    


	} // end of IF Picked meth	


	else if (pickedHeroin === true){

	s_drugcost = drugs.heroin; 
	s_drugunit = heroin_unit; 
	s_drugiown = currentDrugs.heroin;
	s_sellDrug = sell_Heroin;
	
	IsellDrugs();
	s_insert_drugunit = $('#heroinUnits').html(s_drugunit);
	s_insert_drugiown = $('#realHeroin').html("Heroin: " + s_drugiown);

	currentDrugs.heroin = s_drugiown;
	heroin_unit = s_drugunit;    


	} // end of IF Picked Heroin	



	function IsellDrugs(){


	cashEarned = s_sellDrug * numUnits;
	console.log("you made " + cashEarned);


	// check to see if you have enough units

	if (numUnits > s_drugiown){

		alert("sell what you have, not what you don't!");
		return;
	}


	// update units of drugs you own
	s_drugiown = s_drugiown - numUnits;

	// add back units once sold 
	s_drugunit = s_drugunit + numUnits;

	// work out new bank balance
	bank = bank + cashEarned;
	console.log(bank);

	// update my bank
	$('#inBank').html("$"+bank); 


	} // end of ISELLdrugs

	}); // end of sell drugs button



	

	// get randon int for drugs costs. 

	function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}



	// change city

	$('#choose_city').click(function(event) {

		console.log("city btn pressed"); 
		ChangeCity(); 
	// 

	});


	function ChangeCity(){

		if (currentLocation === 'lnd'){

				// change city
				currentLocation = locations.ny;
				console.log(currentLocation); 

				// change city title
				$('#market').empty();
				$('#market').append('The Market: New York City');

				// cost in nyc
				drugs.acid = getRandomInt(600,1300);
				drugs.coke = getRandomInt(900,1900);
				drugs.steroids = getRandomInt(200,500);
				drugs.meth = getRandomInt(45,150);
				drugs.heroin = getRandomInt(700,1600);

				// change units to represent time passed
				coke_unit = generateUnits();
				acid_unit = generateUnits();
				steroids_unit = generateUnits();
				meth_unit = generateUnits();
				heroin_unit = generateUnits();
				
				// how many units available
				$('#acidUnits').html(acid_unit);
				$('#cokeUnits').html(coke_unit);
				$('#steroidsUnits').html(steroids_unit);
				$('#methUnits').html(meth_unit);
				$('#heroinUnits').html(heroin_unit);
				
				// cost per unit
				$('#acidPerUnit').html("$"+drugs.acid);
				$('#cokePerUnit').html("$"+drugs.coke);
				$('#steroidsPerUnit').html("$"+drugs.steroids);
				$('#methPerUnit').html("$"+drugs.meth);
				$('#heroinPerUnit').html("$"+drugs.heroin);

				sellPrice(); 


			} // end of IF

		else if (currentLocation === 'nyc'){

				// change city
				currentLocation = locations.lnd;
				console.log(currentLocation);

				// change city title
				$('#market').empty();
				$('#market').append("The Market: London"); 

				
				// cost in lnd
				drugs.acid = getRandomInt(700,1500);
				drugs.coke = getRandomInt(900,1700);
				drugs.steroids = getRandomInt(200,500);
				drugs.meth = getRandomInt(45,150);
				drugs.heroin = getRandomInt(700,1600);

				
				// change units to represent time passed
				coke_unit = generateUnits();
				acid_unit = generateUnits();
				steroids_unit = generateUnits();
				meth_unit = generateUnits();
				heroin_unit = generateUnits();

				// how many units available
				$('#acidUnits').html(acid_unit);
				$('#cokeUnits').html(coke_unit);
				$('#steroidsUnits').html(steroids_unit);
				$('#methUnits').html(meth_unit);
				$('#heroinUnits').html(heroin_unit);
				
				// cost per unit
				$('#acidPerUnit').html("$"+drugs.acid);
				$('#cokePerUnit').html("$"+drugs.coke);
				$('#steroidsPerUnit').html("$"+drugs.steroids);
				$('#methPerUnit').html("$"+drugs.meth);
				$('#heroinPerUnit').html("$"+drugs.heroin);

				sellPrice(); 

				
			} // else if  


		} // change city



		// time interval events that go wrong or right!
		

		setInterval(function(){


				var x = getRandomInt(1,3);
				console.log(x); 

				if (x === 1){

					// run police function: lose drugs
					alert("Yikes Pigs, dumping my stash");
					console.log("you lost " +  currentDrugs.acid + " Acid and " + currentDrugs.coke + " Coke"); 
					
					currentDrugs.coke = 0;
					currentDrugs.acid = 0;
					currentDrugs.steroids = 0;
					currentDrugs.meth = 0;
					currentDrugs.heroin = 0;

					// update drugs 
					$('#realAcid').html("Acid: " + currentDrugs.acid);
					$('#realCoke').html("Coke: " + currentDrugs.coke); 
					$('#realSteroids').html("Steroids: " + currentDrugs.steroids); 
					$('#realMeth').html("Meth: " + currentDrugs.meth); 
					$('#realHeroin').html("Heroin: " + currentDrugs.heroin);  

				}

				else if (x === 2){

					// run got mugged function: lose money
					alert("Dude with a gun, it's gunna cost me");

					// calculate money stolen
					var stolen = Math.round(bank / 100 * 30);
					console.log("you lost $" + stolen); 
					bank = bank - stolen; 
					
					// update my bank
					$('#inBank').html("$"+bank); 

				}

				else { 

					// run drugs super cheap: temp change in prices
					alert("drug sale, buy now!");
					console.log("acid was $" + drugs.acid + " and coke was $" + drugs.coke);  

					// new cost of drugs
					drugs.acid = getRandomInt(300,700);
					drugs.coke = getRandomInt(400,1000);
					drugs.steroids = getRandomInt(200,500);
					drugs.meth = getRandomInt(10,60);
					drugs.heroin = getRandomInt(600,1000);;

					
					// cost per unit
					$('#acidPerUnit').html("$"+drugs.acid);
					$('#cokePerUnit').html("$"+drugs.coke);
					$('#steroidsPerUnit').html("$"+drugs.steroids);
					$('#methPerUnit').html("$"+drugs.meth);
					$('#heroinPerUnit').html("$"+drugs.heroin);

					}

			

			}, getRandomInt(60000,180000) 

			);
		

		

		// the end 






	





