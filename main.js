
/*
	On game start
*/
$( document ).ready(function() 
{
	console.log("Starting the game");
	
	//alert("Welcome to DrugWars");
	$('#calendar').html("Day "+1+" of X (Left Y)");
	initGame();
});





/*
// init the game
*/
function initGame()
{
	console.log("Initializing the game");
	
	// init values
	curDay=0;
	maxDays=30;
	leftDays=maxDays-curDay;
	
	// start a new day
	newDay();
}


/*
	Check based on money if buttons needs to be enabled or disabled
*/
function checkMoney()
{
	if(bank>0) // player has money - enable buy button
	{
		// enable buy button
		document.getElementById("choose_buyd").disabled = false;
	}
	else
	{
		// disable buy buton
		document.getElementById("choose_buyd").disabled = true;
	}
}



function checkDrugs()
{
	if ((currentDrugs.acid == 0) & (currentDrugs.coke == 0) )
	{
		// enable sell button
		document.getElementById("choose_selld").disabled = true;
	}
	else
	{
		// enable sell button
		document.getElementById("choose_selld").disabled = false;
	}
}






/*
// init a new Day
*/
function newDay()
{
	console.log("Starting a new day");
	
	// check if its the last day
	if(curDay==maxDays) // last day
	{
		alert("Game ended");
	}
	else // normal day
	{
		curDay=curDay+1;
		leftDays=maxDays-curDay;
	
		// update cal view
		$('#calendar').html("Day "+curDay+" of "+maxDays+" (Left "+leftDays+")");
	}
	
	checkMoney();
	checkDrugs();
}







/*
- create all potential drugs
- create events (mugged, police, etc)

*/
//alert("old game init");
var bank = 0;
var debt = Math.floor(0); 
var currentLocation;
var cashSpent = 0; 
var cashEarned = 0; 
var lastTime = 0;

var currentDrugs = {acid:0,coke:0};
var drugs = 
{
	acid:0,
	coke:0,
	unit:function()
	{
		return Math.floor((Math.random()*50)+1)
	}
}; // create new object 




var coke_unit = drugs.unit();
var acid_unit = drugs.unit();

var shark = {capital:10000};
var locations = {ny: "nyc", lnd: "lnd"};  

var acid = drugs.acid;
var coke = drugs.coke;

$('#sell_Drugs').hide();
$('#loanshark_div').hide();
$('#buy_Drugs').hide();
currentLocation = locations.ny; 







// Setup for NYC
//
// change city title
$('#market').append(' New York City');
// cost in nyc
drugs.acid = 700;
drugs.coke = 1400;
		




var start = {

		play: function(){

			$('#inBank').html("$"+bank); 
			$('#debt').html("$"+debt);
			$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke);


			// how many units available
			$('#acidUnits').html(acid_unit);
			$('#cokeUnits').html(coke_unit);
		
			// cost per unit
			$('#acidPerUnit').html("$"+drugs.acid);
			$('#cokePerUnit').html("$"+drugs.coke);
		
		}, // play


		// Create Debt with Time
		setTimes: function(){

			//
			setInterval(function()
			{
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


// Sell-Button
//
$('#choose_selld').click(function(event) 
{	
	$('#loanshark_div').hide();
	$('#buy_Drugs').hide();
	$('#sell_Drugs').toggle(400); 
});


// Buy-Button
//
$('#choose_buyd').click(function(event) 
{	
	$('#sell_Drugs').hide();
	$('#loanshark_div').hide();
	$('#buy_Drugs').toggle(400); 
});

// Visit Loan shark
//
$('#choose_loan').click(function(event) 
{	
	$('#sell_Drugs').hide();
	$('#buy_Drugs').hide();
	$('#loanshark_div').toggle(400); 
	
});






	// Borrow Money Click Func
	//
	$('#btn').click(function(event) 
	{
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
	
		checkMoney(); // update UI buttons based on money
		checkDrugs(); // update UI buttons based on drugs
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
	





	// check if drug box got ticked -

	$('#acid_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want acid");
			$('#coke_tick').prop('checked', false);
			pickedAcid = true;
			pickedCoke = false; 
		}	

	});

	$('#coke_tick').click(function(event) {
		
		if (this.checked){

			console.log("you want coke");
			$('#acid_tick').prop('checked', false);
			pickedCoke = true;
			pickedAcid = false;
		}	

	});
	

	
	// check if SELL drug box got ticked

	$('#s_acid_tick').click(function(event) 
	{	
		if (this.checked)
		{
			console.log("you want to sell acid");
			$('#s_coke_tick').prop('checked', false);
			pickedAcid = true;
			pickedCoke = false; 
		}	

	});

	$('#s_coke_tick').click(function(event) 
	{	
		if (this.checked)
		{
			console.log("you want to sell coke");
			$('#s_acid_tick').prop('checked', false);
			pickedCoke = true;
			pickedAcid = false;
		}	

	});









	// Buy Drugs Click Func
	//
	$('#drugBtn').click(function(event) {
	
	// check that a tick box is selected
	if (pickedAcid === false && pickedCoke === false)
	{
		alert("you need to pick a drug");
		return;
	}

	
	// turn number of units into a number 
	var xUnits = $('input[id="buyDrugs"]').val(); 
	console.log("you want to buy " + xUnits + " units");
	var numUnits = parseInt(xUnits); 

	


	// depending on your selection
	if (pickedAcid === true)
	{
	cashSpent = drugs.acid * numUnits;
	console.log("you spent " + cashSpent);

	// check to see if you can afford it
	if (bank - cashSpent < 0)
	{
		alert("you can't afford that!");
		return;
	}

	// check to see if have enough units

	if (acid_unit < numUnits)
	{
		alert("not enough units, select less!");
		return;
	}

	// update units of drugs you own
	currentDrugs.acid = currentDrugs.acid + numUnits;
	$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke); 

	// remove units once bought 
	console.log("acid_unit is at " + acid_unit); 
	acid_unit = acid_unit - numUnits;
	console.log("num acid left is " + acid_unit); 
	$('#acidUnits').html(acid_unit); 

	// work out new bank balance
	bank = bank - cashSpent;
	console.log(bank);

	// update my bank
	$('#inBank').html("$"+bank); 

	} // end of IF Picked Acid




	else if (pickedCoke === true)
	{
	cashSpent = drugs.coke * numUnits;
	console.log(cashSpent);

	// check to see if you can afford it
	if (bank - cashSpent < 0)
	{
		alert("you can't afford that!");
		return;
	}

	// check to see if have enough units
	if (coke_unit < numUnits)
	{
		alert("not enough units, select less!");
		return;
	}

	// update units of drugs you own
	currentDrugs.coke = currentDrugs.coke + numUnits;
	$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke);

	// remove units once bought 
	console.log("coke_unit is at " + coke_unit); 
	coke_unit = coke_unit - numUnits;
	console.log("num coke left is " + coke_unit); 
	$('#cokeUnits').html(coke_unit);  

	// work out new bank balance
	bank = bank - cashSpent;
	console.log(bank);

	// update my bank
	$('#inBank').html("$"+bank); 

	} // End of else if	
	}); // buy drugs button
		

		
		
		


	// How to SELL drugs
	//
	$('#sellBtn').click(function(event) {
	
	// check that a tick box is selected
	if (pickedAcid === false && pickedCoke === false)
	{
		alert("you need to pick a drug");
		return;

	}

	
	// turn number of units into a number 
	var xUnits = $('input[id="sellDrugs"]').val(); 
	console.log("you want to sell " + xUnits + " units");
	var numUnits = parseInt(xUnits); 

	// depending on your selection
	if (pickedAcid === true)
	{
	cashEarned = drugs.acid * numUnits;
	console.log("you made " + cashEarned);

	// check to see if you have enough units
	if (numUnits > currentDrugs.acid)
	{
		alert("sell what you have, not what you don't!");
		return;
	}


	// update units of drugs you own
	currentDrugs.acid = currentDrugs.acid - numUnits;
	$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke); 


	// add back units once sold 
	console.log("acid_unit is at " + acid_unit); 
	acid_unit = acid_unit + numUnits;
	console.log("num acid is now " + acid_unit); 
	$('#acidUnits').html(acid_unit); 


	// work out new bank balance
	bank = bank + cashEarned;
	console.log(bank);

	// update my bank
	$('#inBank').html("$"+bank); 

	} // end of IF Picked Acid

	

	// NOW LET'S DO FOR COKE
	else if (pickedCoke === true)
	{
	cashEarned = drugs.coke * numUnits;
	console.log("you made " + cashEarned);

	// check to see if have enough units
	if (numUnits > currentDrugs.coke)
	{
		alert("sell what you have, not what you don't!");
		return;
	}

	// update units of drugs you own

	currentDrugs.coke = currentDrugs.coke - numUnits;
	$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke);



	// add back units once sold  
	console.log("coke_unit is at " + coke_unit); 
	coke_unit = coke_unit + numUnits;
	console.log("num coke left is " + coke_unit); 
	$('#cokeUnits').html(coke_unit);  

	// work out new bank balance
	bank = bank + cashEarned;
	console.log(bank);

	// update my bank
	$('#inBank').html("$"+bank); 

	
	} // End of else if

	
	}); // buy drugs button



	
	
	
	
/*
	Calculate Sales Price
*/
function sellPrice()
{
	var sell_Acid;
	
	if (acid_unit < 10){ sell_Acid = Math.round(drugs.acid / 100 * 30 + drugs.acid); }
	else if (acid_unit < 20){ sell_Acid = Math.round(drugs.acid / 100 * 20 + drugs.acid); }
	else if (acid_unit < 30){ sell_Acid = Math.round(drugs.acid / 100 * 10 + drugs.acid); }
	else if (acid_unit < 40){ sell_Acid = Math.round(drugs.acid / 100 * 5 + drugs.acid); }
	else { sell_Acid = Math.round(drugs.acid / 100 * 3 + drugs.acid); }

	var sell_Coke;
	
	if (coke_unit < 10){ sell_Coke = Math.round(drugs.coke / 100 * 30 + drugs.coke); }
	else if (coke_unit < 20){ sell_Coke = Math.round(drugs.coke / 100 * 20 + drugs.coke); }
	else if (coke_unit < 30){ sell_Coke = Math.round(drugs.coke / 100 * 10 + drugs.coke); }
	else if (coke_unit < 40){ sell_Coke = Math.round(drugs.coke / 100 * 5 + drugs.coke); }
	else { sell_Coke = Math.round(drugs.coke / 100 * 3 + drugs.coke); }

	// sell per unit

	$('#acidSell').html("$"+sell_Acid);
	$('#cokeSell').html("$"+sell_Coke);  
} // end of sales price function







/*
 get randon int for drugs costs. 
*/
function getRandomInt(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



	
	
	
	
/*	
// change city button pressed
*/
$('#choose_city').click(function(event) 
{
	console.log("city btn pressed");
	newDay();	
	ChangeCity(); 
});








/*
CHANGE CITY
*/
function ChangeCity()
{
	if (currentLocation === 'lnd')
	{
		// change city
		currentLocation = locations.ny;
		console.log(currentLocation); 

		// change city title
		$('#market').empty();
		$('#market').append('The Market: New York City');

		// cost in nyc
		drugs.acid = getRandomInt(600,1300);
		drugs.coke = getRandomInt(900,1900);

		// change units to represent time passed
		coke_unit = drugs.unit();
		acid_unit = drugs.unit();
				
		// how many units available
		$('#acidUnits').html(acid_unit);
		$('#cokeUnits').html(coke_unit);
				
		// cost per unit
		$('#acidPerUnit').html("$"+drugs.acid);
		$('#cokePerUnit').html("$"+drugs.coke);

		sellPrice(); 
		} // end of IF

		else if (currentLocation === 'nyc')
		{
			// change city
			currentLocation = locations.lnd;
			console.log(currentLocation);

			// change city title
			$('#market').empty();
			$('#market').append("The Market: London"); 
	
			// cost in lnd
			drugs.acid = getRandomInt(700,1500);
			drugs.coke = getRandomInt(900,1700);

			// change units to represent time passed
			coke_unit = drugs.unit();
			acid_unit = drugs.unit();

			// how many units available
			$('#acidUnits').html(acid_unit);
			$('#cokeUnits').html(coke_unit);
				
			// cost per unit
			$('#acidPerUnit').html("$"+drugs.acid);
			$('#cokePerUnit').html("$"+drugs.coke);

			sellPrice(); 	
		} // else if  
	} // change city



	
	
	
		// time interval events that go wrong or right!
		//
		setInterval(function()
		{
				var x = getRandomInt(1,3);
				console.log(x); 

				if (x === 1)
				{
					// run police function: lose drugs
					alert("Yikes Pigs, dumping my stash");
					console.log("you lost " +  currentDrugs.acid + " Acid and " + currentDrugs.coke + " Coke"); 
					
					currentDrugs.coke = 0;
					currentDrugs.acid = 0; 
					$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke);  
				}
				else if (x === 2)
				{
					// run got mugged function: lose money
					alert("Dude with a gun, it's gunna cost me");

					// calculate money stolen
					var stolen = Math.round(bank / 100 * 30);
					console.log("you lost $" + stolen); 
					bank = bank - stolen; 
					
					// update my bank
					$('#inBank').html("$"+bank); 
				}
				else 
				{ 
					// run drugs super cheap: temp change in prices
					alert("drug sale, buy now!");
					console.log("acid was $" + drugs.acid + " and coke was $" + drugs.coke);  

					// new cost of drugs
					drugs.acid = getRandomInt(300,700);
					drugs.coke = getRandomInt(400,1000);

					
					// cost per unit
					$('#acidPerUnit').html("$"+drugs.acid);
					$('#cokePerUnit').html("$"+drugs.coke);
				}
			}, getRandomInt(60000,180000) 
			);
		

		

		// add ability to bank money, but at a cost. 