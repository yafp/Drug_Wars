/*
	while loading the page
*/
$( document ).ready(function() 
{	
	enableRandomQuotes=1;					// set default value for RandomQuotes on page-load 

	h_checkLocalStorageSupport();			// Check if LocalStorage is supported - if so - try to get name and setting for random quotes
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
		playersName = "Bored Deadhead";
	}
	//$('#player').empty();
	//$('#player').append(' '+playersName);
	

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
	// fuck counter (handling user-mistakes
	fuckCounter=0;
	
	
	
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
	
	$.pageguide('unload'); // unload pageguide: Explain Start Page
	$.pageguide(gameGuide); // load the game for the game itself
	
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
	h_randomEventsOnDayChange();		// check for random events
	
	if(enableRandomQuotes == 1)			// random Quotes if enabled
	{
		h_randomPeopleQuotesOnDayChange();
	}
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
	$('#form_Drugs_sell').hide();
	$('#form_Drugs_buy').hide();
	$('#loanshark_div').hide(); 
	
	// get target destination
	targetDestination = $( "#travelTarget" ).val(); // get target destination
	//alert("Travelling to "+targetDestination);
	
	// Update travelTarget select-box
	//
	// enable all options first ...then
	$("#travelTarget option[value='loc_white']").removeAttr('disabled');
	$("#travelTarget option[value='loc_jesse']").removeAttr('disabled');
	$("#travelTarget option[value='loc_school']").removeAttr('disabled');
	$("#travelTarget option[value='loc_car']").removeAttr('disabled');
	$("#travelTarget option[value='loc_tuco']").removeAttr('disabled');
	$("#travelTarget option[value='loc_pest']").removeAttr('disabled');
	$("#travelTarget option[value='loc_schwartz']").removeAttr('disabled');
	$("#travelTarget option[value='loc_dea']").removeAttr('disabled');
	$("#travelTarget option[value='loc_pollos']").removeAttr('disabled');
	$("#travelTarget option[value='loc_gale']").removeAttr('disabled');
	//
	// disable new location - as it is the new current location
	$("#travelTarget option[value="+targetDestination+"]").attr('disabled','disabled'); 
	
	
	// general changes
	$('#market').empty();
	
	// location specific changes
	switch(targetDestination) 
	{
		case "loc_white":
			//location itself
			currentLocation = locations.loc_white;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: The White Residence"); 
			
			// drug-prices
			drugs.acid = h_getRandomInt(700,1500);
			drugs.coke = h_getRandomInt(900,1700);
			
			// drug availability chance
			// MISSING
		break;
		
		case "loc_jesse":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: Jesse's House");
			
			// drug-prices
			drugs.acid = h_getRandomInt(500,1200);
			drugs.coke = h_getRandomInt(800,1600);
		break;
		
		case "loc_school":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: J. P. Wynne High School");
			
			// drug-prices
			drugs.acid = h_getRandomInt(600,1300);
			drugs.coke = h_getRandomInt(850,1800);
		break;
		
		case "loc_car":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: A1A Car Wash");
			
			// drug-prices
			drugs.acid = h_getRandomInt(800,1400);
			drugs.coke = h_getRandomInt(900,1900);
		break;
		
		case "loc_tuco":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: Tuco's Headquarters");
			
			// drug-prices
			drugs.acid = h_getRandomInt(500,1000);
			drugs.coke = h_getRandomInt(700,1500);
		break;
		
		case "loc_pest":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: Vamonos Pest Control");
			
			// drug-prices
			drugs.acid = h_getRandomInt(600,1200);
			drugs.coke = h_getRandomInt(800,1600);
		break;
		
		case "loc_schwartz":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: Schwartz Residence");
			
			// drug-prices
			drugs.acid = h_getRandomInt(900,1200);
			drugs.coke = h_getRandomInt(1000,2100);
		break;
		
		case "loc_dea":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: DEA Field Office");
			
			// drug-prices
			drugs.acid = h_getRandomInt(500,1200);
			drugs.coke = h_getRandomInt(800,1600);
		break;
		
		case "loc_pollos":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: Los Pollos Hermanos");
			
			// drug-prices
			drugs.acid = h_getRandomInt(500,1200);
			drugs.coke = h_getRandomInt(800,1600);
		break;
		
		case "loc_gale":
			//location itself
			currentLocation = locations.loc_jesse;
			$('#market').append("<i class='fa fa-map-marker'></i> Location: Gale's Apartment");
			
			// drug-prices
			drugs.acid = h_getRandomInt(500,1200);
			drugs.coke = h_getRandomInt(800,1600);
		break;
	}
	
	
	
	// general changes
	//
	// DRUGS
	// change units to represent time passed
	coke_unit = drugs.unit();
	acid_unit = drugs.unit();
	//
	// display available units
	$('#acidUnits').html(acid_unit);
	$('#cokeUnits').html(coke_unit);
	//			
	// display drug costs per unit
	$('#acidPerUnit').html("$"+drugs.acid);
	$('#cokePerUnit').html("$"+drugs.coke);

	sellPrice();
		
	log.info("Arrived in: "+currentLocation)
	
	newDay();			// prepare the new day
} // END: changeCity



/*
	toggleQuotes - changes the randomQuote setting and makes the menu-icon according to it
*/
function toggleQuotes()
{
	if(enableRandomQuotes == 1)
	{
		enableRandomQuotes = 0;
		iconText = '<span class="fa-stack fa-lg"><i class="fa fa-comment fa-stack-1x"></i><i class="fa fa-ban fa-stack-1x text-danger"></i></span> Quotes </a>';
		var n = noty({text: 'Random Breaking Bad Quotes are now disabled'}); 
	}
	else
	{
		enableRandomQuotes = 1;
		iconText = '<i class="fa fa-comment"></i> Quotes </a>';
		var n = noty({text: 'Random Breaking Bad Quotes are now enabled'}); 
	}
	
	// update icon
	$('#menuItemQuotes').html(iconText); // update Icon
	
	// store in localStorage
	localStorage.setItem("enableRandomQuotes", enableRandomQuotes);
}



/*
	Calculate final score values and display them at the end of the game. If result is higher then highscore result - it updates the highscore as well.
*/
function gameEnded()
{	
	log.info("GAME OVER")
	
	h_disableActionButtons();	// disable main buttons	
	
	// hide input menues
	$('#form_Drugs_sell').hide();
	$('#loanshark_div').hide();
	$('#form_Drugs_buy').hide();
	
	// hide main game-divs
	$('#div_ActionButtons').hide();
	$('#div_StatusTable').hide();
	$('#div_Market').hide();
	$('#div_GameProgress').hide();
	
	// calculate some values:
	var finalCash = cash;
	var finalBank = bank;
	var finalDebt = debt;
	var finalMoneyPerDay = (cash + bank - debt) / maxDays;
	finalMoneyPerDay = Math.round(finalMoneyPerDay)

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
		case "30":
			log.debug("highscore_30");
			if (finalScore > localStorage.getItem("highscore_30")) 
			{
				localStorage.setItem("highscore_30", finalScore);
				localStorage.setItem("player_30", playersName);
				localStorage.setItem("moneyPerDay_30", finalMoneyPerDay);
				localStorage.setItem("date_30", Date());
				log.info("New highscore_30 written");
			}
		break;
		
		case "45":
			log.debug("highscore_45");
			if (finalScore > localStorage.getItem("highscore_45")) 
			{
				localStorage.setItem("highscore_45", finalScore);
				localStorage.setItem("player_45", playersName);
				localStorage.setItem("moneyPerDay_45", finalMoneyPerDay);
				localStorage.setItem("date_45", Date());
				log.info("New highscore_45 written");
			}
		break;
		
		case "90":
			log.debug("highscore_90");
			if (finalScore > localStorage.getItem("highscore_90")) 
			{
				localStorage.setItem("highscore_90", finalScore);
				localStorage.setItem("player_90", playersName);
				localStorage.setItem("moneyPerDay_90", finalMoneyPerDay);
				localStorage.setItem("date_90", Date());
				log.info("New highscore_90 written");
			}
		break;
		
		case "120":
			log.debug("highscore_120");
			if (finalScore > localStorage.getItem("highscore_120")) 
			{
				localStorage.setItem("highscore_120", finalScore);
				localStorage.setItem("player_120", playersName);
				localStorage.setItem("moneyPerDay_120", finalMoneyPerDay);
				localStorage.setItem("date_120", Date());
				log.info("New highscore_120 written");
			}
		break;
	} 
	
	h_loadHighscoreFromLocalStorage(); // updates the highscore
	
	// write values to endgame div
	//
	// money things
	$('#finalCashCount').html("Cash: "+finalCash);
	$('#finalBankCount').html("Bank: +"+finalBank);
	$('#finalDebtCount').html("Debt: -"+finalDebt);
	$('#finalMoneyPerDay').html("Money per day: "+finalMoneyPerDay);
	// luck-things
	$('#finalLuckCount').html("Luck: -"+luckModifier);
	$('#finalBadLuckCount').html("BadLuck: +"+badLuckModifier);
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
	$('#form_Drugs_sell').hide();
	$('#loanshark_div').hide();
	$('#form_Drugs_buy').toggle(400); 
});


/*
	Button: Open Sell-Area
*/
$('#choose_selld').click(function(event) 
{	
	$('#loanshark_div').hide();
	$('#form_Drugs_buy').hide();
	$('#form_Drugs_sell').toggle(400); 
});


/*
	Button: Open Loan-Shark-Area
*/
$('#choose_loan').click(function(event) 
{	
	h_updateMoneyUI();
	
	$('#form_Drugs_sell').hide();
	$('#form_Drugs_buy').hide();
	$('#loanshark_div').toggle(400);
});


/*
	BUTTON PRESS: Loan Shark - Borrow Money 
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
	
	h_updateAllUIElements();
});


/*	
	BUTTON PRESS: Travel - change city
*/
$('#choose_city').click(function(event) 
{	
	// get target destination
	targetDestination = $( "#travelTarget" ).val(); // get target destination
	
	if(targetDestination === null)
	{
		alert("Please choose a new location and then start travelling");
		return;
	}
	else
	{
		//alert("current location "+currentLocation);
		//alert("TargetDestination "+targetDestination);
		changeCity();
	}
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
	
	if(numUnits < 1 )
	{
		var n = noty({text: 'Dont try to fuck with me dude.'});
		h_updateFuckCounter();
		return;
	}

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
		$('#acidInPockets').html(currentDrugs.acid);
		
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
		if(numUnits < 1 )
		{
			var n = noty({text: 'Dont try to fuck with me dude.'});
			h_updateFuckCounter();
			return;
		}
	
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
		$('#cokeInPockets').html(currentDrugs.coke);
		
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
	
	if(numUnits < 1 )
	{
		var n = noty({text: 'Dont try to fuck with me dude.'});
		h_updateFuckCounter();
		return;
	}

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
		$('#acidInPockets').html(currentDrugs.acid);

		// update pockets
		usedPockets = usedPockets - numUnits; // update pocket calculation
		freePockets = freePockets + numUnits; // update free pockets
		
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
		$('#cokeInPockets').html(currentDrugs.coke);
		
		// update pockets
		usedPockets = usedPockets - numUnits; // update pocket calculation
		freePockets = freePockets + numUnits; // update free pockets

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
	BUTTON PRESS: Loan Shark - Pay Back Money
*/	
$('#btn_payDebt').click(function(event) 
{
	var amount = $('#payDebt').val();
	if(amount <= 0) // check if entered payback-amount is valid 
	{
		var n = noty({text: 'Loan shark: Dont try to fuck with me dude.'});
		h_updateFuckCounter();
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
		
		h_updateAllUIElements();
	}
});	


/*	
	BUTTON PRESS: Loan Shark - Pay Back all Debt
*/	
$('#btn_payDebtAll').click(function(event) 
{
	cash = cash - debt;
	debt = 0;
	
	h_updateAllUIElements();
});	


/*	
	BUTTON PRESS: Loan shark - Pay Back max debt
*/	
$('#btn_payDebtMax').click(function(event) 
{
	maxPayDebt = cash; // calc max possible payback debt amount
	
	debt = debt - maxPayDebt;
	cash = cash - maxPayDebt;
	
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
		
		transactionFee = moneyToDeposit * 0,01;
		if(transactionFee < 10) // at least 10 USD
		{
			transactionFee = 10;
		}			
		// pay transaction fee
		moneyToDeposit = moneyToDeposit - transactionFee;
		
		bank = bank + moneyToDeposit
		//bank = Math.round(bank);
		
		cash = cash - moneyToDeposit;
		var n = noty({text: 'Deposit '+moneyToDeposit+' at your bank account (Fee: '+transactionFee+' $). You now have '+bank+'$ in your bank account.'});
	}
	else // invalid input from player
	{
		var n = noty({text: 'Dont fuck with me dude'});
		h_updateFuckCounter()
		return;
	}

	h_updateAllUIElements();
});	



/*	
	BUTTON PRESS: Deposit ALL money at bank
*/	
$('#btn_bank_depositMoneyAll').click(function(event) 
{	
	if(cash > 0)
	{
		transactionFee = cash * 0,01;
		if(transactionFee < 10) // at least 10 USD
		{
			transactionFee = 10;
		}			
		// pay transaction fee
		moneyToDeposit = cash - transactionFee;
	
		bank = bank + moneyToDeposit;
		var n = noty({text: 'Added '+moneyToDeposit+'$ to your bank account (Fee: '+transactionFee+' $). You now have '+bank+'$ in your bank account and 0 cash.'});
		cash = 0;
	}
	else
	{
		var n = noty({text: 'Dont fuck with me dude'});
		h_updateFuckCounter()
		return;
	}
	
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
				
		transactionFee = moneyToPayOut * 0,01;
		if(transactionFee < 10) // at least 10 USD
		{
			transactionFee = 10;
		}			
		moneyToPayOut = moneyToPayOut - transactionFee;
		moneyToPayOut = Math.round(moneyToPayOut);
				
		cash = cash + Math.round(moneyToPayout);
		var n = noty({text: 'Bank payed out  '+moneyToPayOut+' from your bank account (Fee: '+transactionFee+' $). You now have '+bank+'$ in your bank account.'});
	}
	else // invalid value
	{
		var n = noty({text: 'Dont fuck with me dude'});
		h_updateFuckCounter()
		return;
	}
	
	h_updateAllUIElements();
});	




/*	
	BUTTON PRESS: get all money back from bank
*/	
$('#btn_bank_payOutMoneyAll').click(function(event) 
{
	if(bank > 0)
	{
		transactionFee = bank * 0,01;
		if(transactionFee < 10) // at least 10 USD
		{
			transactionFee = 10;
		}
		moneyToPayOut = bank - transactionFee;
		moneyToPayOut = Math.round(moneyToPayOut);
	
		cash = cash + moneyToPayOut;
		var n = noty({text: 'Bank payed out  '+moneyToPayOut+' from your bank account (Fee: '+transactionFee+' $). You now have '+bank+'$ in your bank account.'});
		bank = 0;
	}
	else
	{
		var n = noty({text: 'Dont fuck with me dude'});
		h_updateFuckCounter()
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
var locations = {
		loc_white: "loc_white", 
		loc_jesse: "loc_jesse", 
		loc_school: "loc_school",
		loc_car: "loc_car", 
		loc_tuco: "loc_tuco", 
		loc_pest: "loc_pest",
		loc_schwartz: "loc_schwartz", 
		loc_dea: "loc_dea", 
		loc_pollos: "loc_pollos",
		loc_gale: "loc_gale"
	};  

var acid = drugs.acid;
var coke = drugs.coke;

$('#form_Drugs_sell').hide();
$('#loanshark_div').hide();
$('#form_Drugs_buy').hide();


currentLocation = locations.loc_white; 


// show starting location
$("#travelTarget option[value='loc_white']").attr('selected');


// Setup for Startpoint - White residence
//
//$('#market').append(' New York City');	// change city title
$('#market').append(' The White Residence');

// cost
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

		// display how many units available
		$('#acidUnits').html(acid_unit);
		$('#cokeUnits').html(coke_unit);
		
		// display market buy-prices cost per unit
		$('#acidPerUnit').html("$"+drugs.acid);
		$('#cokePerUnit').html("$"+drugs.coke);	
	} // play
}; // end start function

start.play();
sellPrice(); 

var pickedAcid = false;
var pickedCoke = false; 
