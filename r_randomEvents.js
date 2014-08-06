/*	###########################################
	RANDOM EVENTS
	########################################### */

/*
	RANDOM EVENT: Police
*/
function r_randomEventPolice()
{
	badLuckEvents = badLuckEvents + 1;

	if( freePockets == maxPockets) // we dont have any drug
	{
		var n = noty({text: 'Lucky you - cops controlled you - but you had empty pockets.'});
	}
	else // we do have drugs - cops will rip us
	{
		var n = noty({text: 'The cops .... dumping my stash'});

		// calculate new values
		//
		// drugs		
		currentDrugs.coke = 0;
		currentDrugs.acid = 0; 
		// pockets					
		usedPockets = 0;
		freePockets = maxPockets;
		pockets=usedPockets+ " of "+maxPockets+" used";
		// health
		healthDamage = 10;
		reduceHealth(healthDamage);

		updateAllUIElements();
	}  
}


/*
	RANDOM EVENT: Robbery
*/
function r_randomEventRobbery()
{
	badLuckEvents = badLuckEvents + 1;

	if(bank == 0) // if there is no money at all
	{
		var n = noty({text: 'Someone tried to rob you but you had no money anyways.'}); 
		return;
	}
				
	if(bank > 500) // we dont rob poor ppl
	{
		if(weapons > 0)
		{
			var answer = confirm("Someone tries to rob you. Do you want to defend yourself using your weapon?")
			if (answer)
			{
				// fight
				calculateWinOrLose = getRandomInt(1,2); // get random number
				if (calculateWinOrLose == 1)
				{
					// win
				}
				else
				{
					// lose
					getRobbed();
				}
			}
			else
			{
				getRobbed();
			}
		
		}
		else // got no weapon to defend yourself
		{
			getRobbed();
		}
	
		updateAllUIElements();
	}
}


/*
	RANDOM EVENT: Find Drugs
*/
function r_randomEventFindDrugs()
{
	luckEvents = luckEvents + 1;

	foundDrugs = getRandomInt(1,50); // get random number
	if(foundDrugs <= freePockets)
	{
		var n = noty({text: 'You found '+foundDrugs+' acid on the streets'}); 
	}
	else // not enough pockets
	{			
		var n = noty({text: 'You found '+foundDrugs+' acid on the streets but could take only '+freePockets+' cause of pocket size.'}); 
		foundDrugs = freePockets;
	}
						
	// calculate new values
	//
	// drugs
	currentDrugs.acid = currentDrugs.acid + foundDrugs;
	// pockets
	usedPockets= usedPockets+foundDrugs;
	freePockets = maxPockets - usedPockets;
	pockets=usedPockets+ " of "+maxPockets+" used";

	updateAllUIElements();				
	return;
}


/*
	RANDOM EVENT: Jesse
*/
function r_randomEventJesseQuote()
{
	// random jesse pinkman quote:
	var jesseQuotes = [
					"Look, I like making cherry product, but let’s keep it real, alright? We make poison for people who don’t care. We probably have the most unpicky customers in the world.", 
					"Yeah. Totally Kafkaesque.",
					"You don’t need a criminal lawyer. You need a criminal lawyer", 
					"Oh well, heil Hitler, bitch. And let me tell you something else. We flipped a coin, okay? You and me. You and me! Coin flip is sacred! Your job is waiting for you in that basement, as per the coin!",
					"You either run from things, or you face them, Mr. White.", 
					"Like I came to you, begging to cook meth. ‘Oh, hey, nerdiest old dude I know, you wanna come cook crystal?’ Please. I’d ask my diaper-wearing granny, but her wheelchair wouldn’t fit in the RV.",
					"Yeah Mr. White! You really do have a plan! Yeah science!", 
					"You know what? Why I’m here in the first place? Is to sell you meth. You’re nothing to me but customers! I made you my bitch. You okay with that?",
					"Possum. Big, freaky, lookin’ bitch. Since when did they change it to opossum? When I was comin’ up it was just possum. Opossum makes it sound like he’s irish or something. Why do they gotta go changing everything?", 
					"So no matter what I do, hooray for me because I’m a great guy? It’s all good? No matter how many dogs I kill, I just do an inventory and accept?",
					"I’m supposed to promise, cross my heart, to like straighten up and fly right, or toe the line, or some other crap I’m not going to say?", 
					"I uh… I eat a lot of frozen stuff… It’s usually pretty bad, I mean the pictures are always so awesome, you know? It’s like “hell yeah, I’m starved for this lasagna!” and then you nuke it and the cheese gets all scabby on top and it’s like… it’s like you’re eating a scab… I mean, seriously, what’s that about? It’s like “Yo! What ever happened to truth in advertising?” You know?",
					"Look… look, you two guys are just… guys, okay? Mr. White… he’s the devil. You know, he is… he is smarter than you, he is luckier than you. Whatever… whatever you think is supposed to happen… I’m telling you, the exact reverse opposite of that is gonna happen, okay?", 
					"Are we in the meth business, or the money business?",
					"Nah come on… man, some straight like you giant stick up his ass all of a sudden at age what 60 he’s just going to break bad?", 
					"What if this is like math, or algebra? And you add a plus douchebag to a minus douchebag, and you get, like, zero douchebags?",
					"Hey, you girls want to meet my fat stack?", 
					"I am not turning down the money! I am turning down you! You get it? I want NOTHING to do with you! Ever since I met you, everything I ever cared about is gone! Ruined, turned to shit, dead, ever since I hooked up with the great Heisenberg! I have never been more alone! I HAVE NOTHING! NO ONE! ALRIGHT, IT’S ALL GONE, GET IT? No, no, no, why… why would you get it? What do you even care, as long as you get what you want, right? You don’t give a shit about me! You said I was no good. I’m nothing! Why would you want me, huh? You said my meth is inferior, right? Right? Hey! You said my cook was GARBAGE! Hey, screw you, man! Screw you!",
					"You can’t admit, just for once, that I’m right. Come on. That O’Keeffe lady kept trying over and over until that stupid door was perfect.", 
					"I got two dudes that turned into raspberry slushie then flushed down my toilet. I can’t even take a proper dump in there. I mean, the whole damn house has got to be haunted by now.",
					"Right on. New Zealand. That’s where they made Lord of the Rings. I say we just move there, yo. I mean, you can do your art, right? Like, you can paint the local castles and shit. And I can be a bush pilot.", 
					"What good is being an outlaw when you have responsibilities?",
					"I’M A BLOWFISH! BLOWFISH! YEEEAAAH! BLOWFISHIN’ THIS UP!", 
					"You got me riding shotgun to every dark anal recess of this state. It’d be nice if you clued me in a little.",
					"What happens now? I’ll tell you what happens now. Your scumbag brother-in-law is finished. Done. You understand? I will own him when this is over. Every cent he earns, every cent his wife earns is mine. Any place he goes, anywhere he turns, I’m gonna be there grabbing my share. He’ll be scrubbing toilets in Tijuana for pennies and I’ll be standing over him to get my cut. He’ll see me when he wakes up in the morning and when he crawls to sleep in whatever rat hole is left for him after I shred his house down. I will haunt his crusty ass forever until the day he sticks a gun up his mouth and pulls the trigger just to get me out of his head. That’s what happens next.",
					"Yeah, bitch! Magnets!", 
					"Yo 148, 3-to-the-3-to-the-6-to-the-9. Representin’ the ABQ. What up, biatch? Leave it at the tone!"
				];
				
	// pick random quote from array
	var randomQuote = jesseQuotes[Math.floor(Math.random()*jesseQuotes.length)];
				
	// output random quote
	var n = noty({text: "Jesse Pinkman: "+randomQuote});
}


/*
	RANDOM EVENT: Pockets
*/
function r_randomEventExtraPockets()
{
	extraPockets = getRandomInt(10,50); // get random number of offerend pockets
	pocketPrice = getRandomInt(5,20); // get random number for pocket price
	calcExtraPocketPrice = extraPockets * pocketPrice;
	
	if(bank >= calcExtraPocketPrice) // if we have enough money for the extra-pockets
	{
		// todo:
		// ask user if he wants to buy those new pockets
		var answer = confirm("Do you want to buy "+extraPockets+" extra pockets for "+calcExtraPocketPrice+" $ ?")
		if (answer)
		{
			var n = noty({text: 'You just got '+extraPockets+' extra pockets for '+calcExtraPocketPrice+' $.'});
					
			// calculate new values
			maxPockets = maxPockets + extraPockets;
			pockets=usedPockets+ " of "+maxPockets+" used";
			bank = bank - calcExtraPocketPrice;
					
			// update UI-items
			updateAllUIElements();	
		}
		else
		{
			var n = noty({text: 'The dude offered you '+extraPockets+' extra pockets for '+calcExtraPocketPrice+' $ but you  denied.'});
			return;
		}
	}
	else
	{
		var n = noty({text: 'The dude offered you '+extraPockets+' extra pockets for '+calcExtraPocketPrice+' $ but you had no money.'});
	}
}


/*
	RANDOM EVENT: Sale / cheap Drugs
*/
function r_randomEventCheapDrugs()
{
	luckEvents = luckEvents + 1;

	var n = noty({text: 'Drug sale - buy now as much as possible'});
	log.info("Cheap drugs on the market")

	// new cost of drugs
	drugs.acid = getRandomInt(300,700);
	drugs.coke = getRandomInt(400,1000);

	// cost per unit
	$('#acidPerUnit').html("$"+drugs.acid);
	$('#cokePerUnit').html("$"+drugs.coke);
}


/*
	RANDOM EVENT: Hank
*/
function r_randomEventHankQuote()
{
	// random hank schrader quotes:
	var hankQuotes = [
					"You're the smartest guy I ever met... but you're too stupid to see... He made up his mind ten minutes ago.", 
					"My name is ASAC Schrader and you can go fuck yourself.",
					"Hey, white boy. My name's Tortuga. You know what that means? Well, if I had to guess, I'd say that's Spanish for asshole.",
					"Do what you're gonna do."
				];
				
	// pick random quote from array
	var randomQuote = hankQuotes[Math.floor(Math.random()*hankQuotes.length)];
				
	// output random quote
	var n = noty({text: "Hank Schrader: "+randomQuote});
}



/*
	RANDOM EVENT: Buy Weapon
*/
function r_randomEventBuyWeapon()
{
	luckEvents = luckEvents + 1;

	log.info("buying weapon");
	
	weaponName = "Magnum";
	weaponPrice = '400';
	
	if(bank > weaponPrice)
	{
		var answer = confirm("Do you want to buy a "+weaponName+" for "+weaponPrice+" $ ?")
		if (answer)
		{
			var n = noty({text: 'You just got '+weaponName+' for '+weaponPrice+' $.'});
			weapons = weapons +1;
			bank = bank - weaponPrice;
		}
		else
		{
			var n = noty({text: 'The dude offered you a '+weaponName+' for '+weaponPrice+' $ but you  denied. Stay unarmed Ghandi'});
			return;
		}
		
		updateAllUIElements();
	}
	else
	{
		var n = noty({text: 'The dude offered you a '+weaponName+' for '+weaponPrice+' $ but you had no money. Poor bastard.'});
	}
}

