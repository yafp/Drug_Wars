/*	###########################################
	HELPERS
	########################################### */

/*
	HELPER: update all ui-elements
*/
function updateAllUIElements()
{
	// action buttons
	updateTradingButtons();

	// unselect buy & sell checkboxes for drug-selection
	$('#acid_tick').prop('checked', false);
	$('#coke_tick').prop('checked', false);
	$('#s_acid_tick').prop('checked', false);
	$('#s_coke_tick').prop('checked', false);
	
	maxPossibleBuy=0;
	$('#maxBuy').html("(max: "+maxPossibleBuy+")");			// update UI
	
	
	// status menues
	$('#calendar').html("Day "+curDay+" of "+maxDays);	//
	$('#inBank').html("$"+bank); 
	$('#listDrugs').html("Acid: " +  currentDrugs.acid + "<br>" + " Coke: " + currentDrugs.coke);
	$('#pockets').html(pockets); 
	$('#weapons').html(weapons);
	$('#debt').html("$"+debt); 
	$('#health').html(health); 
} // END: updateAllUIElements()



/*
	HELPER: check browser support for localStorage
*/
function checkLocalStorageSupport()
{
	if(typeof(Storage) !== "undefined") 
	{
		document.getElementById("fname").innerHTML = localStorage.getItem("playersName"); 
		lastName = localStorage.getItem("playersName"); 	// get the last name used in this game from local storage
		
		// set the name into the settings dialog
		var elem = document.getElementById("fname");
		elem.value = lastName;
	} 
	else 
	{
		alert("No support for Local storage found. This means: No highscore management possible.");
	}
} // END: checkLocalStorageSupport()


/*
	HELPER: show only the settings div - and hide all the others
*/
function showSettingsOnly()
{
	// show settings div
	$('#div_Settings').hide(); 
	$('#div_Settings').fadeIn(2000); // 2 sec
	
	// and hide most other divs
	$('#div_Gameresult').hide();
	$('#div_Info').hide();
	$('#div_Highscore').hide();
	$('#div_ActionButtons').hide();
	$('#div_StatusTable').hide();
	$('#div_Market').hide();
	$('#div_GameProgress').hide();
	
} // END: showSettingsOnly()




/*
	HELPER: disable the main 4 action buttons
*/
function disableActionButtons()
{
	document.getElementById("choose_buyd").disabled = true;		// disable buy button
	document.getElementById("choose_selld").disabled = true;	// disable sell shark
	document.getElementById("choose_city").disabled = true;		// disable travel button
	document.getElementById("choose_loan").disabled = true;		// disable loan shark
} // END: disableActionButtons()


/*
	HELPER: calculate max possible buy
*/
function calculateMaxBuy()
{
	if(choosenDrug == "Acid")
	{
		maxPossibleBuy = Math.floor(bank / drugs.acid);
		if(maxPossibleBuy > acid_unit) // check if enough is available
		{
			maxPossibleBuy = acid_unit;
		}
		if(maxPossibleBuy > freePockets)
		{
			maxPossibleBuy = freePockets;
		}
		$('#maxBuy').html("(max: "+maxPossibleBuy+")");			// update UI
		
		if(maxPossibleBuy == 0)
		{
			document.getElementById("acid_tick").disabled = true;
		}
	}
	
	if(choosenDrug == "Coke")
	{
		maxPossibleBuy = Math.floor(bank / drugs.coke);
		if(maxPossibleBuy > coke_unit) // check if enough is available
		{
			maxPossibleBuy = coke_unit;
		}
		if(maxPossibleBuy > freePockets)
		{
			maxPossibleBuy = freePockets;
		}
		$('#maxBuy').html("(max: "+maxPossibleBuy+")");			// update UI
		
		if(maxPossibleBuy == 0)
		{
			document.getElementById("coke_tick").disabled = true;
		}
	}
}






/*
	HELPER: calculate max possible sell
*/
function calculateMaxSell()
{	
	if(choosenDrug == "Acid")
	{
		// check what we have
		maxPossibleSell = currentDrugs.acid
		
		$('#maxSell').html("(max: "+maxPossibleSell+")");			// update UI
		
		if(maxPossibleSell == 0)
		{
			document.getElementById("s_acid_tick").disabled = true;
		}
	}
	
	if(choosenDrug == "Coke")
	{
		// check what we have
		maxPossibleSell = currentDrugs.coke
		
		$('#maxSell').html("(max: "+maxPossibleSell+")");			// update UI
		
		if(maxPossibleSell == 0)
		{
			document.getElementById("s_coke_tick").disabled = true;
		}
		
	}
}







/*
	HELPER: update Loan Payback section
*/
function updateLoansharkUI()
{			
	if(debt > 0)
	{
		$("#form_Payback").show();
		$("#btn_payDebt").show();

		if(bank > debt)
		{
			$("#btn_payDebtAll").show();
		}
		else
		{
			$("#btn_payDebtAll").hide();
		}
	}
	else // player has no debt
	{
		$("#form_Payback").hide();		// hide all payback options
	}
}



/*
	HELPER: updateHighscore
*/
function loadHighscoreFromLocalStorage() 
{
	// 5 Days
	highscore_5_score = localStorage.getItem("highscore_5");
	$('#score_5').html("<b>"+highscore_5_score+"</b>");							
	highscore_5_name = localStorage.getItem("player_5");
	$('#player_5').html("by "+highscore_5_name);
	highscore_5_date = localStorage.getItem("date_5");
	$('#date_5').html("at "+highscore_5_date);
	
	// 15 Days
	highscore_15_score = localStorage.getItem("highscore_15");
	$('#score_15').html("<b>"+highscore_15_score+"</b>");
	highscore_15_name = localStorage.getItem("player_15");
	$('#player_15').html("by "+highscore_15_name);
	highscore_15_date = localStorage.getItem("date_15");
	$('#date_15').html("at "+highscore_15_date);
	
	// 30 Days
	highscore_30_score = localStorage.getItem("highscore_30");
	$('#score_30').html("<b>"+highscore_30_score+"</b>");
	highscore_30_name = localStorage.getItem("player_30");
	$('#player_30').html("by "+highscore_30_name);
	highscore_30_date = localStorage.getItem("date_30");
	$('#date_30').html("at "+highscore_30_date);
	
	// 45 Days
	highscore_45_score = localStorage.getItem("highscore_45");
	$('#score_45').html("<b>"+highscore_45_score+"</b>");						
	highscore_45_name = localStorage.getItem("player_45");
	$('#player_45').html("by "+highscore_45_name);
	highscore_45_date = localStorage.getItem("date_45");
	$('#date_45').html("at "+highscore_45_date);
	
	// 90 Days
	highscore_90_score = localStorage.getItem("highscore_90");
	$('#score_90').html("<b>"+highscore_90_score+"</b>");						
	highscore_90_name = localStorage.getItem("player_90");
	$('#player_90').html("by "+highscore_90_name);
	highscore_90_date = localStorage.getItem("date_90");
	$('#date_90').html("at "+highscore_90_date);
}



/*
	HELPER: get randon int 
*/
function getRandomInt(min, max) 
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
	HELPER: updateTradingButtons (enable or disable them based on the amount of money and/or drugs in pocket
*/
function updateTradingButtons()
{
	log.info("Updating trade buttons")
	
	// Buy-Area button
	//
	if(bank>0) // player has money - enable buy button
	{
		document.getElementById("choose_buyd").disabled = false;	// enable buy button
	}
	else
	{
		document.getElementById("choose_buyd").disabled = true;	// disable buy buton
	}
	
	// BUY - disable all drug-checkboxes which arent available
	if(acid_unit == 0)
	{
		document.getElementById("acid_tick").disabled = true; 
		$('#acid_tick').attr('checked', false);
	}
	else
	{
		document.getElementById("acid_tick").disabled = false
	}
	// coke
	if(coke_unit == 0)
	{
		document.getElementById("coke_tick").disabled = true; 
		$('#coke_tick').attr('checked', false);
	}
	else
	{
		document.getElementById("coke_tick").disabled = false
	}
	
	
	// Sell-Area buttons
	if ((currentDrugs.acid == 0) & (currentDrugs.coke == 0) )
	{
		document.getElementById("choose_selld").disabled = true;	// disable sell button
	}
	else
	{
		document.getElementById("choose_selld").disabled = false; // enable sell button
	}
	
	// SELL - disable all drug-checkboxes we dont have
	if(currentDrugs.acid == 0)
	{
		document.getElementById("s_acid_tick").disabled = true;  
		$('#s_acid_tick').attr('checked', false);
	}
	else
	{
		document.getElementById("s_acid_tick").disabled = false
	}
	// coke
	if(currentDrugs.coke == 0)
	{
		document.getElementById("s_coke_tick").disabled = true; 
		$('#s_coke_tick').attr('checked', false); 
	}
	else
	{
		document.getElementById("s_coke_tick").disabled = false
	}
	
	// payback
	if(debt == 0)
	{
		document.getElementById("btn_payDebt").disabled = true;
		document.getElementById("payDebt").disabled = true;  
	}
	else
	{
		document.getElementById("btn_payDebt").disabled = false;
		document.getElementById("payDebt").disabled = false;  
	}
}


/*
	HELPER: Calculate debt (happens on each new day)
*/
function updateDebt()
{
	if(debt > 0) // only if player has debt
	{
		log.info("Update debt (adding 10%")
		debt = Math.round(debt * 1.1);	// calculate new debt
		updateAllUIElements();
	}
}







/*
	HELPER: Random Events
*/
function randomEventsOnDayChange()
{
	log.info("Check for random events")
	
	if(curDay >= 2) // not on the first day
	{
		var shouldRandomHappen = getRandomInt(1,10); // calculate chance for a random event
		if(shouldRandomHappen >= 8) // random event happens
		{
			var x = getRandomInt(1,8); // what random event should happen?
			log.debug("Random Event: "+x)

				
			// Execute Random Event: Police
			switch(x)
			{
				case 1:
					r_randomEventPolice();
				break;

				case 2:
					r_randomEventRobbery();
				break;
				
				case 3:
					r_randomEventFindDrugs();
				break;

				case 4:
					r_randomEventJesseQuote();
				break;
				
				case 5:
					r_randomEventExtraPockets();
				break;

				case 6:
					r_randomEventCheapDrugs();
				break;
				
				case 7:
					r_randomEventHankQuote();
				break;
				
				case 8:
					r_randomEventBuyWeapon();
				break;
			} // end case
		}
	}
}



/*
	HELPER: reduce player health and colorize it based on the value
*/
function reduceHealth()
{
	health = health - healthDamage;

	// fit color
	switch(health)
	{
		case 70:
			$('#health').css('color', 'orange');
		break;

		case 30:
			$('#health').css('color', 'red');
		break;

		case 0:
			var n = noty({text: 'You just died. RIP.'});
			gameEnded();
		break;
	} 
}





/*
	HELPER: getRobbed
*/
function getRobbed()
{
	// calculate money stolen
	var stolen = Math.round(bank / 100 * 30);
	bank = bank - stolen; 
				
	var n = noty({text: 'You got robbed. Loss '+stolen+' $.'});
	log.info("You lost "+stolen+" $ (robbery)");
	
	health = health -10;
	
	updateAllUIElements();
}

