//==================
//Start
//==================
function startGame() {
  //change background pawprint to faded version
  classChange(document.body, ['in-progress'], []); //reset valid woofs object

  if (validWoofs.owners.length > 0) {
    validWoofs.owners = [];
    validWoofs.pets = [];
  }

  ; //create new game object with number of rounds selected by user

  const userRounds = parseInt(document.querySelector(`.config-inputs:checked`).value);
  currentGame = new Game(userRounds);
  currentStats = new Stats(currentGame); //create confirmed no match entry for each owner

  currentGame.owners.forEach(owner => {
    currentStats.confirmed.noMatch[owner] = []; //add owners into valid woof object

    validWoofs.owners.push(owner);
  }); //add pets into valid woof object

  currentGame.pets.forEach(pet => {
    validWoofs.pets.push(pet);
  }); //if restart game, remove all subsequent html

  const submitConfig = document.querySelector('#submit-config');

  if (submitConfig.innerHTML === 'Restart' || submitConfig.innerHTML === 'Play again?') {
    document.querySelectorAll('section').forEach(section => {
      //except rules
      if (section.id !== 'rules-container') {
        clearChildElements(section);
      }

      ;
    }); // setupConfig(userRounds);

    setupNavbar(userRounds);
  }

  ; //hide rules on start

  classChange(document.querySelector('#rules-container'), ['hidden'], []); //remove config and setup navbar

  setupNavbar(userRounds); //setup html

  setupAttemptSection();
  setupSelections(currentGame);
  setupWoofBooth(currentGame);
  setupStatsSection();
  setupOwnerLegend(currentGame); //hide stats on first round, and mark match as 'last'

  classChange(document.querySelector('#stats'), ['hidden'], []);
  classChange(document.querySelector('#nav-stats'), ['hidden'], []);
  classChange(document.querySelector('#nav-stats'), ['last'], []); //updateMessage(you have X rounds)

  if (document.querySelectorAll('#message-container.message-danger, #message-container.message-blackout, #message-container.message-match, #message-container.message-nomatch').length > 0) {
    classChange(currentMessage.parentElement, [], ['message-danger', 'message-blackout', 'message-match', 'message-nomatch']);
  }

  ;
  currentMessage.innerHTML = `You have ${currentGame.rounds} rounds to make ${currentGame.rounds} Pawfect Matches. Good luck!`; // //v1.1 shake message container
  // shake(currentMessage.parentElement);
  //change start game button to restart game

  document.querySelector('#submit-config').innerHTML = 'Restart'; //jump to top of page

  location.href = '#';
}

; //===================
//Woof Booth
//===================
//check if player's woof is a match

function checkWoofBooth(game, stats) {
  const woofedOwner = document.querySelectorAll('.woof-inputs:checked')[0].value;
  const woofedPet = document.querySelectorAll('.woof-inputs:checked')[1].value; //change heading display and hide inputs

  displayWoof(false, woofedOwner, woofedPet); //disable woof submit button

  document.querySelector('#submit-woof').disabled = true; //disable woof inputs

  document.querySelectorAll('.woof-inputs').forEach(input => {
    input.disabled = true;
  }); //check if the selection is a match or not

  if (game.matches[woofedOwner] === woofedPet) {
    woofMatch(game, stats, woofedOwner, woofedPet);
  } else {
    woofNoMatch(game, stats, woofedOwner, woofedPet);
  }

  ; //update round submit button text

  document.querySelector('#submit-selections').innerHTML = 'Make Unique Selections'; //reset selections if any

  resetRound(game, stats);
}

; //actions if woof is a match

function woofMatch(game, stats, woofedOwner, woofedPet) {
  //if match, update confirmed match stat, and add to round history
  stats.confirmed.match[woofedOwner] = woofedPet;
  stats.round[game.round].woof.match = [woofedOwner, woofedPet]; //variables for spans, inputs, and labels
  //instances of no Match selections

  const noMatchInputs = document.querySelectorAll(`
                .pet-inputs[name="${woofedOwner}"]:not([value="${woofedPet}"]),
                .pet-inputs[value="${woofedPet}"]:not([name="${woofedOwner}"])
            `);
  const noMatchSpans = document.querySelectorAll(`
                .pet-label-spans.${woofedPet}:not([id^="${woofedOwner}-"]),
                .pet-label-spans[id^="${woofedOwner}"]:not(.${woofedPet})
                `);
  const noMatchLabels = document.querySelectorAll(`
                .pet-labels.${woofedPet}:not([id^="${woofedOwner}-"]),
                .pet-labels[id^="${woofedOwner}"]:not(.${woofedPet})
            `); //for the match itself

  const matchedInput = document.querySelector(`#${woofedOwner}-${woofedPet}-input`);
  ;
  const matchedSpan = document.querySelector(`#${woofedOwner}-${woofedPet}-selection`); //mark submit button as match

  classChange(document.querySelector('#submit-woof'), ['match'], []); //for match
  //check and disable match input

  if (!matchedInput.checked) {
    matchedInput.checked = true;
  }

  ;
  matchedInput.disabled = true; //mark match span as pawfect-match

  classChange(matchedSpan, ['match'], []); //mark selection header

  markHeader(matchedSpan, ['match'], []); //expand selection if collapsed on incorrect match, then collapse selection with the correct one

  classChange(matchedSpan.parentElement, [], ['hidden']);
  const ownerName = matchedSpan.parentElement.previousElementSibling.name;
  const petName = matchedSpan.parentElement.previousElementSibling.value;
  collapseSelections(ownerName, petName, false); //for no-matches
  //uncheck and disable each noMatch input

  noMatchInputs.forEach(input => {
    input.disabled = true;

    if (input.checked) {
      input.checked = false;
    }

    ;
  }); //mark spans as no-match

  noMatchSpans.forEach(span => {
    classChange(span, ['no'], []);
  }); //dim labels

  dimLabels('match', noMatchLabels); //remove listings if applicable

  woofList(game, stats, woofedOwner, woofedPet, matchedSpan); //go through each instance of no match owner and pet selections

  noMatchSpans.forEach(span => {
    const noMatchOwner = span.parentElement.previousElementSibling.name;
    const noMatchPet = span.parentElement.previousElementSibling.value;
    woofList(game, stats, noMatchOwner, noMatchPet, span);
  }); //for stats chart, if applicable

  if (stats.chart) {
    markStats(woofedOwner, woofedPet, 'match'); //mark no matches for owner

    for (let i = 1; i < game.round; i++) {
      if (stats.round[i].selections[woofedOwner] !== woofedPet) {
        markStats(woofedOwner, stats.round[i].selections[woofedOwner], 'no');
      }

      ;
    }

    ; //v1.1 mark no matches for pet in other owners

    game.owners.forEach(owner => {
      //select each stat chart entry for woofed pet that is not for the original owner
      if (owner !== woofedOwner && document.querySelector(`.pet-stats[id$=-${owner}-${woofedPet}-selection]`)) {
        markStats(owner, woofedPet, 'no');
      }

      ;
    });
  }

  ; //remove pair from validWoofs object

  validWoofs.owners.splice(validWoofs.owners.indexOf(woofedOwner), 1);
  validWoofs.pets.splice(validWoofs.pets.indexOf(woofedPet), 1); //update message and button text

  classChange(currentMessage.parentElement, ['message-match'], ['message-danger', 'message-blackout', 'message-nomatch']);
  currentMessage.innerHTML = `Congrats! ${names.cased.lower[woofedOwner]} and ${names.cased.lower[woofedPet]} are a Pawfect Match!`; //v1.1 shake message container

  shake(currentMessage.parentElement);
  document.querySelector('#submit-woof').innerHTML = 'Pawfect Match';
}

; //action if woof is no match

function woofNoMatch(game, stats, woofedOwner, woofedPet) {
  //if no match, update confirmed no match stat and round woof
  stats.confirmed.noMatch[woofedOwner].unshift(woofedPet);
  stats.round[game.round].woof.noMatch = [woofedOwner, woofedPet]; //variables for no-match

  const matchedInput = document.querySelector(`#${woofedOwner}-${woofedPet}-input`);
  const matchedLabel = matchedInput.parentElement.querySelector(`.pet-labels.${woofedPet}`);
  const matchedSpan = matchedInput.parentElement.querySelector(`.pet-label-spans.${woofedPet}`); //disable/uncheck input for pairing

  matchedInput.disabled = true;

  if (matchedInput.checked) {
    matchedInput.checked = false;
  }

  ; //dim label

  dimLabels('noMatch', matchedLabel); //changeClass() mark span as no match

  classChange(matchedSpan, ['no'], []); //remove listings if applicable

  woofList(game, stats, woofedOwner, woofedPet, matchedSpan); //if stats chart, mark insances of pairing as no match

  if (stats.chart) {
    markStats(woofedOwner, woofedPet, 'no');
  }

  ; //update message and button text

  classChange(currentMessage.parentElement, ['message-nomatch'], ['message-danger', 'message-blackout', 'message-match']);
  currentMessage.innerHTML = `Sorry, ${names.cased.lower[woofedOwner]} and ${names.cased.lower[woofedPet]} are not a match.`; //v1.1 shake message container

  shake(currentMessage.parentElement);
  document.querySelector('#submit-woof').innerHTML = 'No Match';
}

; //display woof in headings, and hide inputs

function displayWoof(show, owner, pet) {
  const woofOwnerHeading = document.querySelector('#owner-woof-heading');
  const petWoofHeading = document.querySelector('#pet-woof-heading'); //if hiding

  if (!show) {
    //hide all labels and inputs
    document.querySelectorAll('#owner-woof > :not(.sub-headings), #pet-woof > :not(.sub-headings)').forEach(ele => {
      classChange(ele, ['hidden'], []);
    }); //add current-woof class to headings

    classChange(woofOwnerHeading, ['current-woof'], []);
    classChange(petWoofHeading, ['current-woof'], []); //change inner text of heading to reflect owner/pet pairing

    woofOwnerHeading.innerText = `${names.cased.lower[owner]}`;
    petWoofHeading.innerText = `${names.cased.lower[pet]}`;
  } else if (show) {
    //if displaying
    //remove current-woof class from headings
    classChange(woofOwnerHeading, [], ['current-woof']);
    classChange(petWoofHeading, [], ['current-woof']); //reset inner text of headings

    woofOwnerHeading.innerText = 'Owner';
    petWoofHeading.innerText = 'Woof';
  }

  ;
}

; //setup new woof

function setupNewWoof(game, stats) {
  //remove current woof options
  document.querySelectorAll('#woof-form input, #woof-form label').forEach(option => {
    option.remove();
  }); //remove any potential woof classes

  const potentialWoofs = document.querySelectorAll('.potential-woof');

  if (potentialWoofs.length > 0) {
    potentialWoofs.forEach(woof => {
      classChange(woof, [], ['woof']);
    });
  }

  ; //display/reset woof headings

  displayWoof(true); //reset submit button if set as match, and disable

  if (document.querySelector('#submit-woof.pawfect-match')) {
    classChange(document.querySelector('#submit-woof.pawfect-match'), [], ['match']);
  }

  ;
  document.querySelector('#submit-woof').disabled = true; //randomize valid woofs

  randomWoofs();
  const alphaWoofs = {
    owners: [],
    pets: []
  }; //if valid array length is 3 or less, add all those to alphaWoofs

  if (validWoofs.owners.length <= 3) {
    validWoofs.owners.forEach((owner, i) => {
      alphaWoofs.owners.push(owner);
      alphaWoofs.pets.push(validWoofs.pets[i]);
    });
  } else {
    //loop through each valid owner, until at most 3 are found
    for (let i = 0; i < validWoofs.owners.length && alphaWoofs.owners.length < 3; i++) {
      //array from loop function
      let arr = woofLoop(validWoofs.owners[i], validWoofs.pets, alphaWoofs.owners, alphaWoofs.pets, stats);

      if (arr) {
        //push array items into alpha object
        alphaWoofs.owners.push(arr[0]);
        alphaWoofs.pets.push(arr[1]);
      }

      ;
    }

    ;
  }

  ; //alphabetize the selections

  alphaWoofs.owners.sort();
  alphaWoofs.pets.sort(); //insert each alphabetized valid selection into woof booth

  alphaWoofs.owners.forEach((owner, i) => {
    document.querySelector('#owner-woof').insertAdjacentHTML('beforeend', `
            <input type="radio" name="owner-woof" id="${owner}-woof-input" class="${owner} woof-inputs" value="${owner}" required>
            <label for="${owner}-woof-input" id="${owner}-woof-label" class="${owner} woof-labels">${names.cased.lower[owner]}</label>
        `);
    document.querySelector('#pet-woof').insertAdjacentHTML('beforeend', `
            <input type="radio" name="pet-woof" id="${alphaWoofs.pets[i]}-woof-input" class="${alphaWoofs.pets[i]} woof-inputs" value="${alphaWoofs.pets[i]}" required>
            <label for="${alphaWoofs.pets[i]}-woof-input" id="${alphaWoofs.pets[i]}-woof-label" class="${alphaWoofs.pets[i]} woof-labels">${names.cased.lower[alphaWoofs.pets[i]]}</label>
        `);
  });
}

;

function woofLoop(owner, pets, alphaOwners, alphaPets, stats) {
  //look through set of pets for given owner
  //return first valid pairing
  for (let i = 0; i < pets.length; i++) {
    if (!stats.confirmed.noMatch[owner].includes(pets[i])) {
      //if alphapets already contains the pairing
      if (alphaPets.includes(pets[i])) {
        const ownerIndex = alphaPets.indexOf(pets[i]);
        const previousOwner = alphaOwners[ownerIndex]; //find another valid pair for the previously assigned owner

        for (let j = 0; j < pets.length; j++) {
          //make sure pair is not a confirmed no match, and the pet is not already included in alpha
          if (!stats.confirmed.noMatch[previousOwner].includes(pets[j]) && !alphaPets.includes(pets[j])) {
            //assign that pet to the owner
            alphaPets[ownerIndex] = pets[j]; //assign the current pet to the new owner

            return [owner, pets[i]];
          }

          ;
        }

        ;
      } else {
        return [owner, pets[i]];
      }

      ;
    }

    ;
  }

  ; //otherwise return false

  return false;
}

; //===================
//Input Changes
//===================
//Change Woof Selections

function potentialWoofInput(game, stats) {
  //woof input variables
  const ownerWoofInput = document.querySelectorAll('.woof-inputs:checked')[0];
  const petWoofInput = document.querySelectorAll('.woof-inputs:checked')[1];
  const woofSelectionLabel = document.querySelector(`#${ownerWoofInput.value}-${petWoofInput.value}-selection`);
  let woofChartPairing; //If there's already a potential woof marked, remove those classes

  if (document.querySelectorAll('.potential-woof').length > 0) {
    document.querySelectorAll('.potential-woof').forEach(label => {
      classChange(label, [], ['woof']);
    });
  }

  ; //If selection has already been confirmed, updateMessage() and alert user, and deselect

  if (stats.confirmed.match[ownerWoofInput.value] || stats.confirmed.noMatch[ownerWoofInput.value].length > 0) {
    if (stats.confirmed.match[ownerWoofInput.value] === petWoofInput.value || stats.confirmed.noMatch[ownerWoofInput.value].includes(petWoofInput.value)) {
      ownerWoofInput.checked = false;
      petWoofInput.checked = false; //disable button

      if (!document.querySelector('#submit-woof').disabled) {
        document.querySelector('#submit-woof').disabled = true;
      }

      ;
      classChange(currentMessage.parentElement, ['message-danger'], ['message-match', 'message-nomatch']);
      currentMessage.innerHTML = 'Sorry, this pairing has already been woofed. Try again.'; //v1.1 shake message container

      shake(currentMessage.parentElement);
      return;
    }

    ;
  }

  ; //enable button

  document.querySelector('#submit-woof').disabled = false; // if stats charts, mark entries

  if (stats.chart) {
    //code for changing the stats chart entry
    woofChartPairing = document.querySelectorAll(`.pet-stats[id$="-${ownerWoofInput.value}-${petWoofInput.value}-selection"]`);

    if (woofChartPairing.length > 0) {
      woofChartPairing.forEach(pair => {
        classChange(pair, ['woof'], []);
      });
    }

    ;
  }

  ; //Mark pairings as potential woofs in match field

  classChange(ownerWoofInput, ['woof'], []);
  classChange(petWoofInput, ['woof'], []);
  classChange(woofSelectionLabel, ['woof'], []);
}

; //Change Match Selections

function changeSelection(game, stats, input) {
  const selectionSpan = input.nextElementSibling.firstElementChild;
  const ownerName = input.name;
  const petName = input.value; //remove empty class from container if present

  if (input.parentElement.parentElement.classList.contains('empty')) {
    classChange(input.parentElement.parentElement, [], ['empty']);
  }

  ; //dim all innactive selection labels

  dimLabels('pet', document.querySelectorAll(`input:not(:checked) + .pet-labels[id^="${ownerName}-"]`)); //changeClasses(add) Marking pairing as active and un-dim if needed

  classChange(selectionSpan, ['active'], []);
  classChange(input.nextElementSibling, [], ['dimmer']); //mark uni/dupe selections and add passive for previous pet selection, and current pet selection

  if (stats.round[game.round].selections[ownerName]) {
    markSelections(stats, stats.round[game.round].selections[ownerName]);
    passiveSelections(stats.round[game.round].selections[ownerName]);
  }

  ;
  markSelections(stats, petName);
  passiveSelections(petName); //set selection in stats object

  stats.round[game.round].selections[ownerName] = petName; //check if submit should be enabled, if 4 inputs are checked and woof has been submitted

  if (document.querySelectorAll('.pet-inputs:checked').length === game.rounds && document.querySelector('#submit-woof').disabled) {
    classChange(currentMessage.parentElement, ['message-danger'], []);
    checkSubmit(game, stats, 'All selections must be unique');
  }

  ;

  if (document.querySelector('#reset-selections').disabled) {
    document.querySelector('#reset-selections').disabled = false;
  }

  ;
}

; //mark dupes and uni selections

function markSelections(stats, pet) {
  //array of all selected pet's spans
  const petArr = document.querySelectorAll(`.pet-label-spans.${pet}`); //array of all active instances of selected pet's active spans

  const activePetArr = document.querySelectorAll(`.pet-label-spans.${pet}.active-selection`); //loop through each selected pet span

  petArr.forEach(span => {
    //if span is active and there is more than one active span for pet,
    if (span.classList.contains('active-selection') && activePetArr.length > 1) {
      //mark as dupe, and remove uni
      classChange(span, ['dupe'], ['uni']); //mark header, and update header message

      markHeader(span, ['dupe'], ['uni']);
      classChange(currentMessage.parentElement, ['message-danger'], []);
      currentMessage.innerHTML = 'All selections must be unique'; //v1.1 shake message container

      shake(currentMessage.parentElement); //reveal selections

      const ownerName = span.parentElement.previousElementSibling.name;
      const petName = span.parentElement.previousElementSibling.value;
      collapseSelections(ownerName, petName, true);

      if (stats.chart) {
        markStats(span.parentElement.previousElementSibling.name, pet, 'dupe');
      }

      ;
    } else if (span.classList.contains('active-selection') && activePetArr.length === 1) {
      //if span is active and there is only one active span for pet
      //mark as uni, and remove dupe
      classChange(span, ['uni'], ['dupe']); //mark header

      markHeader(span, ['uni'], ['dupe']); //collapse selections

      const ownerName = span.parentElement.previousElementSibling.name;
      const petName = span.parentElement.previousElementSibling.value;
      collapseSelections(ownerName, petName, false);

      if (stats.chart) {
        markStats(span.parentElement.previousElementSibling.name, pet, 'uni');
      }

      ;
    } else {
      //if no pet spans are active
      //remove dupe and uni classes
      classChange(span, [], ['dupe', 'uni']); //mark header

      if (stats.chart) {
        markStats(span.parentElement.previousElementSibling.name, pet);
      }

      ;
    }

    ;
  });
}

; //mark header

function markHeader(span, add, rmv) {
  const ownerHeading = document.querySelector(`#${span.parentElement.previousElementSibling.name}-heading`);
  classChange(ownerHeading, add, rmv);
}

; //collapse selection containers if unique/match

function collapseSelections(ownerName, petName, expand) {
  if (!expand) {
    //mark container and header as collapsed
    classChange(document.querySelector(`#${ownerName}-selections-container`), ['collapsed'], []);
    classChange(document.querySelector(`#${ownerName}-heading`), ['collapsed'], []); //hide all elements except label for unique pet

    document.querySelectorAll(`#${ownerName}-radio-container > *:not(#${ownerName}-${petName}-label),
                #${ownerName}-${petName}-label > .selections-list-containers`).forEach(ele => {
      classChange(ele, ['hidden'], []);
    });
  } else if (expand) {
    //mark container and header
    classChange(document.querySelector(`#${ownerName}-selections-container`), [], ['collapsed']);
    classChange(document.querySelector(`#${ownerName}-heading`), [], ['collapsed']); //unhide all elements except label for unique pet

    document.querySelectorAll(`#${ownerName}-radio-container > *:not(#${ownerName}-${petName}-label),
                #${ownerName}-${petName}-label > .selections-list-containers`).forEach(ele => {
      classChange(ele, [], ['hidden']);
    });
  }

  ;
} //mark pet in other owners


function passiveSelections(pet) {
  //if there are active selections that are not pawfect matches
  if (document.querySelector(`.pet-label-spans.${pet}.active-selection:not(.pawfect-match)`)) {
    //add passive selection classes to pets that are not active or no match
    document.querySelectorAll(`.pet-label-spans.${pet}:not(.active-selection):not(.no-match)`).forEach(span => {
      classChange(span, ['passive'], []);
    });
  } else if (!document.querySelector(`.pet-label-spans.${pet}.active-selection`) && document.querySelector(`.pet-label-spans.${pet}.passive-selection`)) {
    //if no other instance of pet is active, and there are passives
    //remove passive selection classes
    document.querySelectorAll(`.pet-label-spans.${pet}.passive-selection`).forEach(span => {
      classChange(span, [], ['passive']);
    });
  }

  ;
}

; //Dim Labels

function dimLabels(kind, labels) {
  if (kind === 'pet') {
    //dim all innactive selection labels
    labels.forEach(label => {
      if (label.querySelector('.pet-label-spans.active-selection')) {
        classChange(label.querySelector('.pet-label-spans.active-selection'), [], ['active']);
      }

      ;
      classChange(label, ['dimmer'], []);
    });
  } else if (kind === 'match') {
    //dim match/no-match labels
    labels.forEach(label => {
      classChange(label, ['dimmer'], []);
    });
  } else if (kind === 'noMatch') {
    //dim no-match label
    classChange(labels, ['dimmer'], []);
  }

  ;
}

; //===================
//Rounds
//===================
//Check Round
//check if current round is correct

function checkWinner(game, stats) {
  //variable array for pet selections
  const selectedPets = Object.keys(stats.round[game.round].selections); //check each round selection against current game matches, and break loop if no match

  for (let i = 0; i < selectedPets.length; i++) {
    if (game.matches[selectedPets[i]] !== stats.round[game.round].selections[selectedPets[i]]) {
      return false;
    }

    ;
  }

  ;
  return true;
}

; //actions if game is over

function endGame(game, stats, win) {
  //v1.1 set game to over
  game.over = true; //remove html for selections and woof booth fields

  clearChildElements(document.querySelector('#attempt'));

  if (win) {
    //unhide stats
    classChange(document.querySelector('#stats'), [], ['hidden']); //update message with winner

    classChange(currentMessage.parentElement, ['message-match'], []);
    currentMessage.innerHTML = 'You win! You found all the Pawfect Matches!'; //v1.1 shake message container

    shake(currentMessage.parentElement); //add number of blackouts, if any

    if (stats.blackouts > 0) {
      currentMessage.parentElement.insertAdjacentHTML('beforeend', `
                    <span id="blackout-message" class="message-blackout">Number of Blackouts: ${stats.blackouts}</span>
                `);
    } else {
      currentMessage.parentElement.insertAdjacentHTML('beforeend', `
                    <span id="blackout-message" class="message-match">No Blackouts!</span>
                `);
    }
  } else {
    //for loss, add correct matches to end of stats chart
    lossChart(game, stats); //update message with loss

    classChange(currentMessage.parentElement, ['message-blackout'], []);
    currentMessage.innerHTML = 'Sorry, you lost.'; //v1.1 shake message container

    shake(currentMessage.parentElement);
  }

  ; //highlight all instances of confirmed matches in stat chart that are not already marked

  game.owners.forEach((owner, i) => {
    const matchStatPairs = document.querySelectorAll(`.pet-stats[id$="-${owner}-${game.pets[i]}-selection"]:not(.pawfect-match)`);

    if (matchStatPairs.length > 0) {
      matchStatPairs.forEach(pair => {
        //run to remove dupe/uni, and again for match
        markStats(owner, game.pets[i]);
        markStats(owner, game.pets[i], 'match');
      });
    }

    ;
  }); //change restart button innerhtml to play again

  document.querySelector('#submit-config').innerHTML = 'Play again?'; //collpase navigation if expanded

  if (document.querySelector('#navbar').classList.contains('navigation-clicked')) {
    navbarClicked('navigation');
  }

  ; //hide navigation

  classChange(document.querySelector('#nav-navigation-container'), ['hidden'], []); //expand restart if collapsed

  if (!document.querySelector('#navbar').classList.contains('restart-clicked')) {
    navbarClicked('restart');
  }

  ; //move to top of page

  location.href = "#";
}

; //Update stats

function updateStats(game, stats) {
  const roundSelections = document.querySelectorAll('.pet-inputs:checked');
  const currentRound = stats.round[game.round];
  currentRound.correct = 0; //update round selections and check for matches

  roundSelections.forEach(selection => {
    currentRound.selections[selection.name] = selection.value; //check for matches

    if (game.matches[selection.name] === selection.value) {
      //update round correct count
      currentRound.correct++;
    }

    ;
  }); //check for blackout

  if (currentRound.correct < 1) {
    blackout(game, stats, roundSelections);
  }

  ;
}

; //actions for blackout

function blackout(game, stats, selections) {
  selections.forEach(selection => {
    const blackoutOwner = selection.name;
    const blackoutPet = selection.value; //update confirmed stats

    stats.confirmed.noMatch[blackoutOwner].unshift(blackoutPet); //mark pairs in match selections field and stat chart as no-match, disable/uncheck input
    //variables

    const blackoutSelection = document.querySelector(`#${blackoutOwner}-${blackoutPet}-selection`);
    const blackoutInput = document.querySelector(`#${blackoutOwner}-${blackoutPet}-input`);
    const blackoutLabel = document.querySelector(`#${blackoutOwner}-${blackoutPet}-label`);
    const blackoutStats = document.querySelectorAll(`.pet-stats[id$="-${blackoutOwner}-${blackoutPet}-selection"]`); //match selections

    classChange(blackoutSelection, ['no'], []);
    classChange(blackoutInput, ['no'], []);
    blackoutInput.disabled = true;
    blackoutInput.checked = false;
    classChange(blackoutLabel, ['dimmer'], []); //stat chart

    if (blackoutStats.length > 0) {
      blackoutStats.forEach(stat => {
        classChange(stat, ['no'], []);
      });
    }

    ; //mark/remove listings

    woofList(game, stats, blackoutOwner, blackoutPet, blackoutSelection);
  }); //update round blackout

  stats.round[game.round].blackout = true; //update blackout count

  stats.blackouts++;
}

; //Reset Round

function resetRound(game, stats) {
  //select all label spans
  const petLabelSpans = document.querySelectorAll('.pet-label-spans'); //changeClasses() remove all relevant classes (dupe, active, unique, passive, dimmer)

  if (petLabelSpans.length > 0) {
    petLabelSpans.forEach(span => {
      classChange(span, [], ['dupe', 'active', 'uni', 'passive']); //if no-match, don't remove dimmer

      if (!span.classList.contains('no-match')) {
        classChange(span.parentElement, [], ['dimmer']);
      }

      ;
    });
  }

  ; //reset headers that are not matches

  document.querySelectorAll('h3.headings:not(.pawfect-match)').forEach(heading => {
    classChange(heading, [], ['dupe', 'uni']); //add empty class to container

    classChange(heading.parentElement, ['empty'], []);
  }); //expand if collapsed and not a match

  document.querySelectorAll('.collapsed:not(.pawfect-match) + .radio-containers .pet-labels:not(.hidden) > .pet-label-spans').forEach(span => {
    const ownerName = span.parentElement.previousElementSibling.name;
    const petName = span.parentElement.previousElementSibling.value;
    collapseSelections(ownerName, petName, true);
  }); //select all stat list items that are not marked match/nomatch

  if (stats.chart) {
    const statListItems = document.querySelectorAll('.pet-stats:not(.pawfect-match), .pet-stats:not(.no-match)'); //changeClasses() remove all relevant classes (dupe, unique, dimmer)

    if (statListItems.length > 0) {
      statListItems.forEach(item => {
        classChange(item, [], ['dupe', 'uni', 'dimmer']);
      });
    }

    ;
  }

  ; //uncheck all inputs, unless belonging to matches

  const checkedInputs = document.querySelectorAll('.pet-inputs:checked:not(:disabled)');

  if (checkedInputs.length > 0) {
    checkedInputs.forEach(input => {
      input.checked = false;
    });
  }

  ; //disable reset button

  if (!document.querySelector('#reset-selections').disabled) {
    document.querySelector('#reset-selections').disabled = true;
  }

  ; //disable submit button

  if (!document.querySelector('#submit-selections').disabled) {
    document.querySelector('#submit-selections').disabled = true;
    document.querySelector('#submit-selections').innerHTML = 'Make Unique Selections';
  }

  ;
}

; //Start Next Round

function nextRound(game, stats) {
  //remove message ready class
  if (document.querySelector('#message.message-ready')) {
    classChange(document.querySelector('#message-container.message-ready'), [], ['message-ready']);
  }

  ; //setup woof booth, excluding impossible combinations

  setupNewWoof(game, stats); //change woof button text

  document.querySelector('#submit-woof').innerHTML = 'Throw me a bone, will ya?'; //disable submit button and change text

  document.querySelector('#submit-selections').disabled = true;
  document.querySelector('#submit-selections').innerHTML = 'Make WoofBooth Selections'; //increment round

  game.round++; //set attempt element on page to new round, and specify last round

  if (game.round === game.rounds) {
    document.querySelector('#attempt-heading').innerHTML = 'Final Attempt';
  } else {
    document.querySelector('#attempt-heading').innerHTML = `Attempt ${game.round}`;
  }

  ; //create new round in stats

  stats.round[game.round] = {
    selections: {},
    woof: {}
  };
}

; //check if round submit should be enabled, or list how many selections are left to make

function checkSubmit(game, stats, message) {
  //length of unqiues plus matches should equal the number of rounds AND woof should be made
  if (document.querySelectorAll('.pet-label-spans.unique-selection').length + document.querySelectorAll('.pet-label-spans.pawfect-match').length === game.rounds) {
    //make sure woof is complete
    if (document.querySelectorAll('.current-woof').length > 0) {
      //enable round Submit
      if (document.querySelector('#submit-selections').disabled) {
        document.querySelector('#submit-selections').disabled = false;
      }

      ; //change text

      document.querySelector('#submit-selections').innerHTML = 'Submit'; //change message

      classChange(currentMessage.parentElement, ['message-ready'], ['message-danger']);
      currentMessage.innerHTML = 'Ready to Submit'; //v1.1 shake message container

      shake(currentMessage.parentElement);
    } else {
      classChange(currentMessage.parentElement, ['message-danger'], ['message-blackout', 'message-match', 'message-ready']);
      currentMessage.innerHTML = "Don't forget to woof!"; //v1.1 shake message container

      shake(currentMessage.parentElement);
    }
  } else if (document.querySelectorAll('.pet-inputs:checked').length < game.rounds && document.querySelectorAll('.pet-label-spans.duplicate-selection').length === 0) {
    //if not all selections are made, and none are duplicates
    //make sure woof is complete
    if (document.querySelectorAll('.current-woof').length > 0) {
      classChange(currentMessage.parentElement, [], ['message-danger', 'message-match', 'message-nomatch', 'message-ready']);
      currentMessage.innerHTML = `You have ${game.rounds - document.querySelectorAll('.pet-inputs:checked').length} selection(s) left to make.`;
    } else {
      classChange(currentMessage.parentElement, ['message-danger'], ['message-match', 'messge-nomatch', 'message-ready']);
      currentMessage.innerHTML = "Don't forget to woof!"; //v1.1 shake message container

      shake(currentMessage.parentElement);
    }
  } else {
    if (!document.querySelector('#submit-selections').disabled) {
      document.querySelector('#submit-selections').disabled = true;
    }

    ; // classChange(currentMessage.parentElement, ['message-danger'], ['message-danger']);
    //change button text only if woof is completed

    if (document.querySelector('.current-woof')) {
      document.querySelector('#submit-selections').innerHTML = message;
    }

    ;
    currentMessage.innerHTML = message; //v1.1 shake message container

    shake(currentMessage.parentElement);
  }

  ;
}

; //===================
//Stats
//===================

function setupStatChart(game, stats) {
  //make note of new stats chart after round 1
  if (!stats.chart) {
    stats.chart = true; //remove last from nav-match

    classChange(document.querySelector('#nav-match'), [], ['last']); //unhide stats, and set nav-stats to last

    classChange(document.querySelector('#stats'), [], ['hidden']);
    classChange(document.querySelector('#nav-stats'), ['last'], ['hidden']); //add additional legend headers if necessary

    setupLegendHeaders(game, false);
  }

  ; //for loop for number of selections per round

  for (let i = 0; i < game.rounds; i++) {
    const chartOwner = game.owners[i];
    const chartPet = stats.round[game.round].selections[chartOwner];
    document.querySelector(`#${chartOwner}-stats`).insertAdjacentHTML('beforeend', `
            <li id="round-${game.round}-${chartOwner}-${chartPet}-selection" class="wrapper ${chartPet} pet-stats">${names.cased.lower[chartPet]}
            </li>
        `); //mark confirmed matches and no-matches

    if (stats.confirmed.match[chartOwner]) {
      markStats(chartOwner, chartPet, 'match');
    } else if (stats.confirmed.noMatch[chartOwner].length > 0) {
      stats.confirmed.noMatch[chartOwner].forEach(pet => {
        if (pet === chartPet) {
          markStats(chartOwner, chartPet, 'no');
        }

        ;
      });
    }

    ;
  }

  ; //fill empty cells with list items based on round

  if (document.querySelectorAll('.stat-selections.empty').length > 0) {
    document.querySelectorAll('.stat-selections.empty').forEach((ele, i) => {
      ele.insertAdjacentHTML('beforeend', `<li id="round-${game.round}-empty-cell-${i + 1}" class="wrapper empty-cells"></li>`);
    });
  }

  ; //add round numbers to stats chart

  document.querySelectorAll('.stat-rounds').forEach(element => {
    element.insertAdjacentHTML('beforeend', `<li class="wrapper stat-round-${game.round} round-stats">${game.round}</li>`);
  }); //update with listings

  updateStatLists(game, stats); //add woofs and correct count

  const roundWoofObject = stats.round[game.round].woof; //object containing round's woof, key being either "match" or "noMatch"

  const roundWoofResult = Object.keys(roundWoofObject)[0]; //key of woof entry for round

  let roundWoofType, roundWoofClass;

  if (roundWoofResult === 'match') {
    roundWoofType = 'Pawfect Match';
    roundWoofClass = 'pawfect-match';
  } else if (roundWoofResult === 'noMatch') {
    roundWoofType = 'No Match';
    roundWoofClass = 'no-match';
  }

  ;
  const roundWoofOwner = roundWoofObject[roundWoofResult][0];
  const roundWoofPet = roundWoofObject[roundWoofResult][1];
  document.querySelectorAll('.stat-woofs').forEach(element => element.insertAdjacentHTML('beforeend', `
        <li class="wrapper stat-woof-round-${game.round} woof-stats">
            <span class="woof-stats ${roundWoofClass}">
                ${names.cased.lower[roundWoofOwner]} & ${names.cased.lower[roundWoofPet]}
            </span>
        </li>
        `));
  document.querySelectorAll('.stat-matches').forEach(element => {
    element.insertAdjacentHTML('beforeend', `
        <li class="wrapper stat-match-round-${game.round} match-stats">
            <span class="correct-stats">${stats.round[game.round].correct}</span>
        </li>
        `);
  }); //update message to show correct matches made in round

  if (stats.round[game.round].correct === 0) {
    classChange(currentMessage.parentElement, ['message-blackout'], []);
    currentMessage.innerHTML = "Oh no, you blacked out! That's no matches."; //v1.1 shake message container

    shake(currentMessage.parentElement);
  } else {
    classChange(currentMessage.parentElement, ['message-match'], []);
    currentMessage.innerHTML = `Congrats, you found ${stats.round[game.round].correct} Pawfect Matches!`; //v1.1 shake message container

    shake(currentMessage.parentElement);
  }

  ;
}

; //add correct matches after a loss

function lossChart(game, stats) {
  //add loss to round
  document.querySelectorAll('.stat-rounds').forEach(element => {
    element.insertAdjacentHTML('beforeend', `<li class="wrapper stat-round-loss round-stats loss">C</li>`);
  }); //add correct matches

  for (let i = 0; i < game.rounds; i++) {
    const chartOwner = game.owners[i];
    const chartPet = game.pets[i];
    document.querySelector(`#${chartOwner}-stats`).insertAdjacentHTML('beforeend', `
                <li id="round-loss-${chartOwner}-${chartPet}-selection" class="wrapper ${chartPet} pet-stats loss">${names.cased.lower[chartPet]}
                </li>
            `);
  }

  ; //add woof/matches

  document.querySelectorAll('.stat-woofs').forEach(element => element.insertAdjacentHTML('beforeend', `
            <li class="wrapper stat-woof-round-loss woof-stats loss">
                <span class="woof-stats header-font">
                    Correct
                </span>
            </li>
            `));
  document.querySelectorAll('.stat-matches').forEach(element => {
    element.insertAdjacentHTML('beforeend', `
            <li class="wrapper stat-match-round-loss match-stats loss">
                <span class="correct-stats">${game.rounds}</span>
            </li>
            `);
  });
}

; //mark stat entries

function markStats(owner, pet, type) {
  //select all instances of pairing in stat charts
  const statPairings = document.querySelectorAll(`.pet-stats[id$="-${owner}-${pet}-selection"]`); //if multiple instances of pairing

  if (statPairings.length > 0) {
    statPairings.forEach(pair => {
      if (type === 'dupe') {
        classChange(pair, ['dupe'], ['uni']);
      } else if (type === 'uni') {
        classChange(pair, ['uni'], ['dupe']);
      } else if (type === 'match' || type === 'no') {
        classChange(pair, [type], ['woof']);
      } else {
        classChange(pair, [], ['uni', 'dupe']);
      }

      ;
    });
  }
}

; //===================
//Lists
//===================
//remove lists after woof

function woofList(game, stats, owner, pet, span) {
  //if it has a list selection, unlist, remove from listcount
  if (span.classList.contains('whitelist')) {
    listCount(game, stats, owner, pet, 'white');
    list(game, stats, owner, pet, 'unlist');
  } else if (span.classList.contains('blacklist')) {
    listCount(game, stats, owner, pet, 'black');
    list(game, stats, owner, pet, 'unlist');
  }

  ; //remove lisiting options from pair

  if (document.querySelector(`#${owner}-${pet}-list-container`)) {
    document.querySelector(`#${owner}-${pet}-list-container`).remove();
  }

  ;
}

; //Update Lists

function updateLists(input) {
  //enable/disable button if applicable
  resetListsButton();
  const listOwner = input.parentElement.parentElement.previousElementSibling.name;
  const listPet = input.parentElement.parentElement.previousElementSibling.value;
  const listSelection = document.querySelector(`#${listOwner}-${listPet}-selection`); //check based on input type

  if (input.value === 'whitelist') {
    list(currentGame, currentStats, listOwner, listPet, 'white');
  } else if (input.value === 'blacklist') {
    // //from white to black, remove white
    list(currentGame, currentStats, listOwner, listPet, 'black');
  } else if (input.value === 'default') {
    //from white, remove white
    list(currentGame, currentStats, listOwner, listPet, 'unlist');
  }

  ;
}

; //whitelist and blacklist

function list(game, stats, owner, pet, kind) {
  //variables
  const listSelections = document.querySelectorAll(`#${owner}-${pet}-selection`);
  const listStats = document.querySelectorAll(`.pet-stats[id$="-${owner}-${pet}-selection"]`); //If whitelist is checked on pairing in match field or stats field

  if (kind === 'white') {
    if (listSelections.length > 0) {
      listSelections.forEach(selection => {
        //whitelist, remove blacklist
        classChange(selection, ['white'], ['black']);
      });
    }

    ;

    if (listStats.length > 0) {
      listStats.forEach(stat => {
        //whitelist, remove blacklist
        classChange(stat, ['white'], ['black']);
      });
    }

    ;
  } else if (kind === 'black') {
    if (listSelections.length > 0) {
      listSelections.forEach(selection => {
        //whitelist, remove blacklist
        classChange(selection, ['black'], ['white']);
      });
    }

    ;

    if (listStats.length > 0) {
      listStats.forEach(stat => {
        //whitelist, remove blacklist
        classChange(stat, ['black'], ['white']);
      });
    }

    ;
  } else if (kind === 'unlist') {
    if (listSelections.length > 0) {
      listSelections.forEach(selection => {
        //remove both
        classChange(selection, [], ['white', 'black']);
      });
    }

    ;

    if (listStats.length > 0) {
      listStats.forEach(stat => {
        //remove both
        classChange(stat, [], ['white', 'black']);
      });
    }

    ;
  }

  ;
}

; //alter listCount

function listCount(game, stats, owner, pet, kind, add) {
  if (add) {
    //add pair into counts
    stats.list[kind].owner.push(owner);
    stats.list[kind].pet.push(pet); //add bullet into elements

    document.querySelectorAll(`.${owner}.${kind}-count, .${pet}.${kind}-count`).forEach(count => {
      count.insertAdjacentHTML('beforeend', '&#8226;');
    });
  } else {
    //remove at most one instance of pair from counts
    const ownerIndex = stats.list[kind].owner.indexOf(owner);
    const petIndex = stats.list[kind].owner.indexOf(pet);
    stats.list[kind].owner.splice(ownerIndex, 1);
    stats.list[kind].pet.splice(petIndex, 1); //remove one bullet from each instance (one bullet must already exist for it to be removed)

    const counts = document.querySelectorAll(`.${owner}.${kind}-count, .${pet}.${kind}-count`);
    counts.forEach(count => {
      count.innerHTML = count.innerHTML.slice(1);
    });
  }

  ;
}

; //reset lists button

function resetListsButton() {
  //enable/disable reset button if not already
  if (document.querySelector('#reset-lists:disabled') && document.querySelectorAll('.list-inputs:checked:not([value="default"])').length > 0) {
    document.querySelector('#reset-lists:disabled').disabled = false;
  } else if (!document.querySelector('#reset-lists:disabled') && document.querySelectorAll('.list-inputs:checked:not([value="default"])').length === 0) {
    document.querySelector('#reset-lists').disabled = true;
  }

  ;
}

; //update stat listings

function updateStatLists(game, stats) {
  //add whitelist/blacklist class to list items of currently listed pairings
  if ('.list-inputs:checked[value="whitelist"], .list-inputs:checked[value="blacklist"]'.length > 0) {
    document.querySelectorAll('.list-inputs:checked[value="whitelist"], .list-inputs:checked[value="blacklist"]').forEach(listing => {
      const listOwner = listing.parentElement.parentElement.previousElementSibling.name;
      const listPet = listing.parentElement.parentElement.previousElementSibling.value;
      const listStat = document.querySelector(`#round-${game.round}-${listOwner}-${listPet}-selection`);

      if (listing.value === 'whitelist' && listStat) {
        classChange(listStat, ['white'], []);
      } else if (listing.value === 'blacklist' && listStat) {
        classChange(listStat, ['black'], []);
      }

      ;
    });
  }

  ;
}

; //reset all lists

function resetLists(game, stats) {
  //uncheck list inputs, and check defaults
  document.querySelectorAll('.list-inputs[value="whitelist"]:checked, .list-inputs[value="blacklist"]:checked').forEach(input => {
    input.checked = false;
  });
  document.querySelectorAll('.list-inputs[value="default"]:not(:checked)').forEach(input => {
    input.checked = true;
  }); //remove any list classes

  document.querySelectorAll('.whitelist, .blacklist').forEach(ele => {
    classChange(ele, [], ['white', 'black']);
  }); //remove listings from stats object

  stats.list = {
    white: {
      owner: [],
      pet: []
    },
    black: {
      owner: [],
      pet: []
    }
  };
}

; //================
//Navbar
//================

function navbarClicked(type) {
  //toggle clicked class on navbar, and all direct children of the element
  document.querySelector('#navbar').classList.toggle(`${type}-clicked`);
  document.querySelector(`#${type}-icon > *`).classList.toggle('clicked');
  document.querySelector(`#${type}-nav`).classList.toggle('hidden'); //if either restart or nav is clicked, add clicked to message and header, otherwise remove it

  if (document.querySelectorAll('#restart-icon > .clicked, #navigation-icon > .clicked').length > 0) {
    classChange(document.querySelector('#message-container'), ['clicked'], []);
    classChange(document.querySelector('header'), ['clicked'], []);
  } else {
    classChange(document.querySelector('#message-container'), [], ['clicked']);
    classChange(document.querySelector('header'), [], ['clicked']);
  }

  ;
}

;