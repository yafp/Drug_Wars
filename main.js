/*
	while loading the page
*/
$( document ).ready(function() 
{	
	h_checkLocalStorageSupport();			// LocalStorage
	h_loadHighscoreFromLocalStorage(); 		// load highscore values to highscore div
	h_disableActionButtons();				// disable main buttons	
	h_showSettingsOnly();					// show only the settings div	
});


/*	###########################################
	GAME LOGIC
	########################################### */
	
/*
// init the game
*/
function initGame()
{
	log.info("Initializing the game");
	playersName = $('#fname').val();		// get player name from settings-dialog
	
	// Save playername to local storage if defined
	if(playersName != "")
	{
		localStorage.setItem("playersName", playersName);
		log.debug("Player name: "+playersName+" stored to local Storage");
	}
	else // player set no name - so give him one
	{
		playersName = "Deadhead";
	}
	$('#player').empty();
	$('#player').append('<i class="fa fa-user"></i> '+playersName);
	

	var n = noty({text: 'Welcome '+playersName+' to DrugWars - The Heisenberg Edition'}); // welcome message to player & game-start
	
	// init values
	//
	// define game length
	maxDays = $( "#gameLength" ).val(); // get game length from setup dialog
	curDay=0;
	// score modifier
	luckEvents = 0;
	badLuckEvents = 0;
	// pockets
	maxPockets=100;
	usedPockets=0;
	freePockets=maxPockets - usedPockets;
	// health
	health=100;
	// weapon
	weapons=0;
	// bank
	bank=0;
	
	// hide several content divs
	$('#div_Gameresult').hide();
	$('#div_Info').hide();
	$('#div_Highscore').hide();
	$('#div_Settings').hide();
	
	// enable main buttons	
	document.getElementById("choose_buyd").disabled = false;		// disable buy button
	document.getElementById("choose_selld").disabled = false;	// disable sell shark
	document.getElementById("choose_city").disabled = false;		// disable travel button
	document.getElementById("choose_loan").disabled = false;		// disable loan shark
	
	// show some divs
	$('#div_ActionButtons').show();
	$('#div_StatusTable').show();
	$('#div_Market').show();
	$('#div_GameProgress').show();
	
	// get start-timestamp
	var startTime = new Date().getTime();
	log.debug("Start-Time: "+startTime);
	
	newDay(); // start a new day
} // END: initGame()


/*
// init a new Day
*/
function newDay()
{
	if(curDay==maxDays) // last day
	{
		gameEnded();
		return;
	}
	else // normal day
	{
		curDay=curDay+1;
	}
	
	h_updateBank();						// recalculate money in bank (ading interest)
	h_updateDebt();						// re-calculate debt
	h_randomEventsOnDayChange();			// check for random events
	h_updateAllUIElements();				// update all relevant UI elements
	
	// update day-progress-o-meter
	progressRatio = (curDay / maxDays) * 100;
	document.getElementById('progressBar').style.width= (progressRatio) +'%';
} // END: newDay()


/*
	CHANGE CITY
*/
function changeCity()
{	
	// hide buy/sell/loan div
	$('#sell_Drugs').hide();
	$('#buy_Drugs').hide();
	$('#loanshark_div').hide(); 
	
	if (currentLocation === 'lnd') // London
	{
		currentLocation = locations.ny;		// change city

		// change city title
		$('#market').empty();
		$('#market').append('<i class="fa fa-map-marker"></i> The Market: New York City');

		// cost in nyc
		drugs.acid = h_getRandomInt(600,1300);
		drugs.coke = h_getRandomInt(900,1900);

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
	else if (currentLocation === 'nyc') // new york
	{
		currentLocation = locations.lnd;		// change city

		// change city title
		$('#market').empty();
		$('#market').append("<i class='fa fa-map-marker'></i> The Market: London"); 
	
		// cost in lnd
		drugs.acid = h_getRandomInt(700,1500);
		drugs.coke = h_getRandomInt(900,1700);

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
	
	log.info("Arrived in: "+currentLocation)
	
	newDay();			// prepare the new day
} // END: changeCity


/*
	Show final score
*/
function gameEnded()
{	
	log.info("GAME OVER")
	
	h_disableActionButtons();	// disable main buttons	
	
	// hide input menues
	$('#sell_Drugs').hide();
	$('#loanshark_div').hide();
	$('#buy_Drugs').hide();
	
	// hide main game-divs
	$('#div_ActionButtons').hide();
	$('#div_StatusTable').hide();
	$('#div_Market').hide();
	$('#div_GameProgress').hide();
	
	// calculate some values:
	var finalCash = cash;
	var finalBank = bank;
	var finalDebt = debt;

	
	// add luck and badLuck modifiers to score
	badLuckModifier =  (badLuckEvents * 5000);
	log.debug("BadLuckModifier: "+badLuckModifier)
	
	luckModifier =  (luckEvents * 5000);
	log.debug("LuckModifier: "+luckModifier)
	
	var finalScore = ( cash + bank ) - (3* debt); 				// calc final score
	finalScore = finalScore + badLuckModifier -luckModifier; 	// add luck & badluck modifiers
	
	if (finalScore < 1) // negative final score is not possible
	{
		finalScore = 0;
	}

	// get end-timestamp
	var endTime = new Date().getTime();
	log.debug("End Time: "+endTime);
	
	log.debug("Max Days: "+maxDays);			// check highscore - depends on maxDays
	switch(maxDays) 
	{
		case "15":
			log.debug("highscore_15");
			if (finalScore > localStorage.getItem("highscore_15")) 
			{
				localStorage.setItem("highscore_15", finalScore);
				localStorage.setItem("player_15", playersName);
				localStorage.setItem("date_15", Date.now());
				log.info("New highscore_15 written");
			}
		break;
		
		case "30":
			log.debug("highscore_30");
			if (finalScore > localStorage.getItem("highscore_30")) 
			{
				localStorage.setItem("highscore_30", finalScore);
				localStorage.setItem("player_30", playersName);
				localStorage.setItem("date_30", Date.now());
				log.info("New highscore_30 written");
			}
		break;
		
		case "45":
			log.debug("highscore_45");
			if (finalScore > localStorage.getItem("highscore_45")) 
			{
				localStorage.setItem("highscore_45", finalScore);
				localStorage.setItem("player_45", playersName);
				localStorage.setItem("date_45", Date.now());
				log.info("New highscore_45 written");
			}
		break;
		
		case "90":
			log.debug("highscore_90");
			if (finalScore > localStorage.getItem("highscore_90")) 
			{
				localStorage.setItem("highscore_90", finalScore);
				localStorage.setItem("player_90", playersName);
				localStorage.setItem("date_90", Date.now());
				log.info("New highscore_90 written");
			}
		break;
	} 
	
	h_loadHighscoreFromLocalStorage(); // updates the highscore
	
	// write values to endgame div
	//
	// money things
	$('#finalCashCount').html(+finalCash);
	$('#finalBankCount').html("+"+finalBank);
	$('#finalDebtCount').html("-"+finalDebt);
	// luck-things
	$('#finalLuckCount').html("-"+luckModifier);
	$('#finalBadLuckCount').html("-"+badLuckModifier);

	// final result:
	$('#finalScoreCount').html(+finalScore);	
	
	$('#div_Gameresult').show();	// show result div
} // END: gameEnded()





/*	###########################################
	BUTTON-CLICKS
	########################################### */

/*
// Button: Open Buy-Area
*/
$('#choose_buyd').click(function(event) 
{	
	$('#sell_Drugs').hide();
	$('#loanshark_div').hide();
	$('#buy_Drugs').toggle(400); 
});


/*
	Button: Open Sell-Area
*/
$('#choose_selld').click(function(event) 
{	
	$('#loanshark_div').hide();
	$('#buy_Drugs').hide();
	$('#sell_Drugs').toggle(400); 
});


/*
	Button: Open Loan-Shark-Area
*/
$('#choose_loan').click(function(event) 
{	
	h_updateMoneyUI();
	
	$('#sell_Drugs').hide();
	$('#buy_Drugs').hide();
	$('#loanshark_div').toggle(400);
});


/*
	BUTTON PRESS: Do Borrow Money 
*/
$('#btn').click(function(event) 
{
	var amount = $('input').val(); 
	log.info("Borrowing "+amount+" $ from loan shark")
	var b = parseInt(amount); 
	 
	// work out new cash balance
	cash = cash + b;
	log.info("New cash balance is: "+cash)

	// update my cash
	$('#inCash').html("$"+cash);

	// update the debt
	debt = debt + b;
	$('#debt').html("$"+debt);
	
	$('#getCash').val("");		// reset input field where player defined amount money to borrow
	
	h_updateMoneyUI();
	h_updateAllUIElements();
});


/*	
	BUTTON PRESS: change city
*/
$('#choose_city').click(function(event) 
{	
	changeCity(); 
});


/*
// BUTTON PRESS: Buy Drugs Click
*/
$('#drugBtn').click(function(event) 
{
	// check that a tick box is selected
	if (pickedAcid === false && pickedCoke === false)
	{
		var n = noty({text: 'You need to pick a drug'});
		return;
	}
	
	// turn number of units into a number 
	var xUnits = $('input[id="buyDrugs"]').val(); 
	var numUnits = parseInt(xUnits); 

	// depending on your selection
	if (pickedAcid === true)
	{
		cashSpent = drugs.acid * numUnits;
		
		// check to see if you can afford it
		if (cash - cashSpent < 0)
		{
			var n = noty({text: 'You cant afford that!'});
			return;
		}

		// check to see if have enough units
		if (acid_unit < numUnits)
		{
			var n = noty({text: 'Not enough units available, select less.'});
			return;
		}
		
		// check to see if have enough units
		if (freePockets < numUnits)
		{
			var n = noty({text: 'You dont have enough free pockets. You cant buy more then '+freePockets+' units.'});
			return;
		}
		
		log.info("You spent "+cashSpent+" $ for new drugs")

		// update units of drugs you own
		currentDrugs.acid = currentDrugs.acid + numUnits;
		
		// update pockets
		usedPockets = usedPockets+ numUnits;
		freePockets = maxPockets - usedPockets;
		pockets = usedPockets + "/"+maxPockets;
				
		// remove units from market once bought 
		acid_unit = acid_unit - numUnits;
		$('#acidUnits').html(acid_unit); 

		// work out new cash balance
		cash = cash - cashSpent;
	} // end of IF Picked Acid
	else if (pickedCoke === true)
	{
		cashSpent = drugs.coke * numUnits;

		// check to see if you can afford it
		if (cash - cashSpent < 0)
		{
			var n = noty({text: 'You cant afford that!'});
			return;
		}

		// check to see if have enough units
		if (coke_unit < numUnits)
		{
			var n = noty({text: 'Not enough units available, select less.'});
			return;
		}
		
		// check to see if have enough units
		if (freePockets < numUnits)
		{
			var n = noty({text: 'You dont have enough free pockets. You cant buy more then '+freePockets+' units.'});
			return;
		}
		
		log.info("You spent "+cashSpent+" $ for new drugs")

		// update units of drugs you own
		currentDrugs.coke = currentDrugs.coke + numUnits;
		
		// update pockets
		usedPockets = usedPockets+ numUnits;
		freePockets = maxPockets - usedPockets;
		pockets = usedPockets + "/"+maxPockets;

		// remove units from market once bought 
		coke_unit = coke_unit - numUnits;
		$('#cokeUnits').html(coke_unit);  

		// work out new cash balance
		cash = cash - cashSpent;
		log.info("Cash "+cash)
	} // End of else if	
	
	$('#maxBuy').html("");			// reset max-buy in UI
	$('#buyDrugs').val("");			// reset input field where player defined amount of drugs to buy
	h_updateAllUIElements();
}); // buy drugs button
	

/*
	BUTTON PRESSED: SELL drugs
*/
$('#sellBtn').click(function(event) 
{
	// check that a tick box is selected
	if (pickedAcid === false && pickedCoke === false)
	{
		var n = noty({text: 'You need to pick a drug'});
		return;
	}

	// turn number of units into a number 
	var xUnits = $('input[id="sellDrugs"]').val(); 
	var numUnits = parseInt(xUnits); 

	// sell acid
	if (pickedAcid === true)
	{
		cashEarned = drugs.acid * numUnits;
		log.info("You earned "+cashEarned+" $")

		// check to see if you have enough units
		if (numUnits > currentDrugs.acid)
		{
			var n = noty({text: 'Sell what you have, not what you dont'});
			return;
		}

		// update units of drugs you own
		currentDrugs.acid = currentDrugs.acid - numUnits;

		// update pockets
		usedPockets = usedPockets - numUnits; // update pocket calculation
		
		// add back units once sold 
		acid_unit = acid_unit + numUnits;
		$('#acidUnits').html(acid_unit); 

		// work out new cash balance
		cash = cash + cashEarned;
	} // end of IF Picked Acid
	//
	// sell coke
	else if (pickedCoke === true)
	{
		cashEarned = drugs.coke * numUnits;
		log.info("You earned "+cashEarned+" $")
		
		// check to see if have enough units
		if (numUnits > currentDrugs.coke)
		{
			var n = noty({text: 'Sell what you have, not what you dont'});
			return;
		}

		// update units of drugs you own
		currentDrugs.coke = currentDrugs.coke - numUnits;
		
		// update pockets
		usedPockets = usedPockets - numUnits; // update pocket calculation

		// add back units once sold  
		coke_unit = coke_unit + numUnits;
		$('#cokeUnits').html(coke_unit);  

		// work out new cash balance
		cash = cash + cashEarned;
		
		
	} // End of else if
	$('#maxSell').html("");			// reset max-sell UI
	$('#sellDrugs').val("");		// reset input field where player defined amount of drugs to sell
	
	h_updateAllUIElements();
}); // buy drugs button
	
	
	

$('#sellBtnAll').click(function(event) 
{
	alert("dummy");
});
	
	
		
/*	
	BUTTON PRESS: Pay Back Money
*/	
$('#btn_payDebt').click(function(event) 
{
	var amount = $('#payDebt').val();
	if(amount <= 0) // check if entered payback-amount is valid 
	{
		var n = noty({text: 'Loan shark: Dont try to fuck with me dude.'});
		return;
	}
	else // amount is valid
	{
		log.info("Payback "+amount+" $ to loan shark")
		var b = parseInt(amount); 
	 
		// work out new cash balance
		cash = cash - b;
		log.debug("New cash balance is:"+cash+" $")

		// recalculate the debt
		debt = debt - b;

		h_updateMoneyUI();
		h_updateAllUIElements();
	}
});	


/*	
	BUTTON PRESS: Pay Back Money all
*/	
$('#btn_payDebtAll').click(function(event) 
{
	cash = cash - debt;
	debt = 0;
	
	h_updateMoneyUI();
	h_updateAllUIElements();
});	


/*	
	BUTTON PRESS: Deposit money at bank
*/	
$('#btn_bank_depositMoney').click(function(event) 
{	
	moneyToDeposit = $('#input_bank_depositValue').val();		// get amount of money player wants to deposit
	
	if(moneyToDeposit <= cash) // valid input
	{
		moneyToDeposit = Math.round(moneyToDeposit);
		bank = bank + moneyToDeposit;
		//bank = Math.round(bank);
		
		cash = cash - moneyToDeposit;
		var n = noty({text: 'Deposit '+moneyToDeposit+' at your bank account. You now have '+bank+'$ in your bank account.'});
	}
	else // invalid input from player
	{
		var n = noty({text: 'Dont fuck with me dude'});
		return;
	}
	h_updateMoneyUI();
	h_updateAllUIElements();
});	


/*	
	BUTTON PRESS: get money back from bank
*/	
$('#btn_bank_payOutMoney').click(function(event) 
{	
	moneyToPayOut = $('#input_bank_payOutValue').val();		// get amount of money player wants to put back from bank-account
	
	if(moneyToPayOut <= bank) // valid value
	{
		bank = bank - moneyToPayOut;
		bank = Math.round(bank);
		cash = cash + Math.round(moneyToPayOut);
		var n = noty({text: 'Bank payed out  '+moneyToPayOut+' from your bank account. You now have '+bank+'$ in your bank account.'});
	}
	else // invalid value
	{
		var n = noty({text: 'Dont fuck with me dude'});
		return;
	}
	
	h_updateAllUIElements();
});	



/*
	SELECT BUY ACID: check if acid-drug box got ticked
*/
$('#acid_tick').click(function(event) 
{
	if (this.checked)
	{
		$('#coke_tick').prop('checked', false);
		pickedAcid = true;
		pickedCoke = false; 
		
		choosenDrug ="Acid";
		h_calculateMaxBuy(choosenDrug);
	}	
});


/*
	SELECT BUY COKE: check if coke-drug box got ticket
*/
$('#coke_tick').click(function(event) 
{
	if (this.checked)
	{
		$('#acid_tick').prop('checked', false);
		pickedCoke = true;
		pickedAcid = false;
		
		choosenDrug ="Coke";
		h_calculateMaxBuy(choosenDrug);
	}	
});
	

/*
	SELL ACID: check if sell acid-drug box got ticked
*/
$('#s_acid_tick').click(function(event) 
{	
	if (this.checked)
	{
		$('#s_coke_tick').prop('checked', false);
		pickedAcid = true;
		pickedCoke = false; 
		
		choosenDrug ="Acid";
		h_calculateMaxSell(choosenDrug);
	}	
});


/*
	SELL COKE: check if sell coke-drug box got ticked
*/
$('#s_coke_tick').click(function(event) 
{	
	if (this.checked)
	{
		$('#s_acid_tick').prop('checked', false);
		pickedCoke = true;
		pickedAcid = false;
		
		choosenDrug ="Coke";
		h_calculateMaxSell(choosenDrug);
	}	
});



/*	###########################################
HELPERS
########################################### */
//
// moved to external file: h_helperFunctions.js

/*
	HELPER: Calculate Sales Price
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



/*	###########################################
	RANDOM EVENTS
	########################################### */
//
// moved to external file: r_randomEvents.js



/*	###########################################
	UNSORTED
	########################################### */

/*
- create all potential drugs
- create events (mugged, police, etc)
*/

var cash = 2000;
var debt = Math.floor(2000);

var currentLocation;
var cashSpent = 0; 
var cashEarned = 0; 
var lastTime = 0;
var maxPockets = 100;
var usedPockets = 0;
var pockets = usedPockets + " of "+maxPockets+" used";

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
$('#market').append(' New York City');	// change city title
// cost in nyc
drugs.acid = 700;
drugs.coke = 1400;

var start = 
{
	play: function()
	{
		$('#inCash').html("$"+cash); 
		$('#debt').html("$"+debt);
		$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke);
		$('#pockets').html(pockets);

		// how many units available
		$('#acidUnits').html(acid_unit);
		$('#cokeUnits').html(coke_unit);
		
		// cost per unit
		$('#acidPerUnit').html("$"+drugs.acid);
		$('#cokePerUnit').html("$"+drugs.coke);	
	} // play
}; // end start function

start.play();
sellPrice(); 

var pickedAcid = false;
var pickedCoke = false; 
