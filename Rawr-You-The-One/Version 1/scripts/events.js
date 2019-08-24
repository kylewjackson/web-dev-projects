//Event Listeners

//Mouse Events

//Stat Chart Highlight
document.querySelector('#stats').addEventListener('mouseenter', e => {
    //classList index is dependent on pet class being second class, after 'wrapper'
    if (e.target.matches('.pet-stats')) {
        document.querySelectorAll(`.pet-stats.${e.target.classList[1]}`).forEach(ele => {
            classChange(ele, ['highlight'], []);
        });
    };
}, true);

document.querySelector('#stats').addEventListener('mouseleave', e => {
    if (e.target.matches('.pet-stats')) {
        document.querySelectorAll(`.pet-stats.${e.target.classList[1]}`).forEach(ele => {
            classChange(ele, [], ['highlight']);
        });
    };
}, true);


//Click Events
document.addEventListener('click', e => {
    //Check List Inputs
    if (e.target.matches('.list-inputs')) {
        const listOwnerName = e.target.parentElement.parentElement.previousElementSibling.name;
        const listPetName = e.target.parentElement.parentElement.previousElementSibling.value;
        //cycle through inputs
        if (e.target.value === 'default') {
            e.target.checked = false;
            document.querySelector(`#${listOwnerName}-${listPetName}-whitelist-input`).checked = true;
            updateLists(document.querySelector(`#${listOwnerName}-${listPetName}-whitelist-input`));
        } else if (e.target.value === 'whitelist') {
            e.target.checked = false;
            document.querySelector(`#${listOwnerName}-${listPetName}-blacklist-input`).checked = true;
            updateLists(document.querySelector(`#${listOwnerName}-${listPetName}-blacklist-input`));
        } else if (e.target.value === 'blacklist') {
            e.target.checked = false;
            document.querySelector(`#${listOwnerName}-${listPetName}-default-input`).checked = true;
            updateLists(document.querySelector(`#${listOwnerName}-${listPetName}-default-input`));
        };
    };

    //Reset Selections
    if (e.target.matches('#reset-selections')) {
        resetRound(currentGame, currentStats);
        //update message
        checkSubmit(currentGame, currentStats);
    };

    //Reset Lists
    if (e.target.matches('#reset-lists')) {
        resetLists(currentGame, currentStats);
        resetListsButton();
    };

    //Restart Nav
    if (e.target.matches('#restart-icon, #restart-icon *')) {
        navbarClicked('restart');
    };

    //Info Nav Modal
    if (e.target.matches('#info-icon, #info-icon *')) {
        classChange(document.body, ['modal'], []);
        classChange(document.querySelector('#modal-container'), ['modal'], []);
        classChange(document.querySelector('#modal-overlay'), ['modal'], []);
        classChange(document.querySelector('#rules-container'), ['modal'], ['hidden']);
        document.querySelector('main').insertAdjacentHTML('beforebegin', `
            <div id="modal-close" class="wrapper col-flow">
                <span id="modal-close-icon"><i class="fas fa-window-close" role="button"></i></span>
                <span id="modal-close-text">close</span>
            </div>
        `);
    };
    //remove modal
    if (e.target.matches('#modal-close, #modal-close-text, #modal-close *, #modal-overlay.modal')) {
        classChange(document.body, [], ['modal']);
        classChange(document.querySelector('#modal-container'), [], ['modal']);
        classChange(document.querySelector('#modal-overlay'), [], ['modal']);
        classChange(document.querySelector('#rules-container'), ['hidden'], ['modal']);
        document.querySelector('#modal-close').remove();
    };

    //Navigation Menu
    if (e.target.matches('#navigation-icon, #navigation-icon *')) {
        navbarClicked('navigation');
    };

    //Nav Menu Anchors
    if (e.target.matches('#nav-woof')) {
        if (document.querySelectorAll('.nav-link.clicked').length > 0) {
            document.querySelectorAll('.nav-link.clicked').forEach(link => {
                classChange(link, [], ['clicked']);
            });
        };
        classChange(e.target, ['clicked'], []);
        location.href = "#";
        location.href = "#woof-anchor";
    } else if (e.target.matches('#nav-match')) {
        if (document.querySelectorAll('.nav-link.clicked').length > 0) {
            document.querySelectorAll('.nav-link.clicked').forEach(link => {
                classChange(link, [], ['clicked']);
            });
        };
        classChange(e.target, ['clicked'], []);
        location.href = "#";
        location.href = "#match-anchor";
    } else if (e.target.matches('#nav-stats')) {
        if (document.querySelectorAll('.nav-link.clicked').length > 0) {
            document.querySelectorAll('.nav-link.clicked').forEach(link => {
                classChange(link, [], ['clicked']);
            });
        };
        classChange(e.target, ['clicked'], []);
        location.href = "#";
        location.href = "#stats";
    };

    //collapse
    if (e.target.matches('.selection-containers')) {
        const checkedInput = e.target.querySelector('.radio-containers > .pet-inputs:checked');
        let owner, pet;
        if (checkedInput) {
            owner = checkedInput.name;
            pet = checkedInput.value;
        };
        if (checkedInput && e.target.classList.contains('collapsed') && !e.target.querySelector('.pawfect-match')) {
            //input must be checked, field must be collapsed, and cannot be match
            collapseSelections(owner, pet, true); //reveal selections
        } else if (checkedInput) {
            collapseSelections(owner, pet, false); //collapse selections
        };
    };

    //Submit Round via Message
    if (e.target.matches('#message-container.message-ready')) {
        updateStats(currentGame, currentStats);
        //add stats chart, with woof result and number of correct matches
        setupStatChart(currentGame, currentStats);
        //if winner, execute winner function and end game
        if (checkWinner(currentGame, currentStats)) {
            endGame(currentGame, currentStats, true);
        } else if (currentGame.round === currentGame.rounds) {
            endGame(currentGame, currentStats, false);
        } else {
            resetRound(currentGame, currentStats);
            nextRound(currentGame, currentStats);
        };
    };

}, false);

//Input Events
document.addEventListener('input', e => {

    //woof input
    if (e.target.matches('.woof-inputs')) {
        //make sure both pet and owner inputs are checked
        if (document.querySelectorAll('.woof-inputs:checked').length === 2) {
            potentialWoofInput(currentGame, currentStats);
        };
    };

    //update current selection, and input changes
    if (e.target.matches('.pet-inputs')) {
        changeSelection(currentGame, currentStats, e.target);
        checkSubmit(currentGame, currentStats, 'All selections must be unique');
    };

    //update lists
    if (e.target.matches('.list-inputs')) {
        updateLists(e.target);
    };
}, false);

//Submit Events
document.addEventListener('submit', e => {
    //prevent page from default refresh on submit
    e.preventDefault();

    //Start Game
    if (e.target.matches('#config-form')) {
        startGame();
        //set timeout for first round
        if (!gameStarted) {
            setupLoad(true);
            setTimeout(() => {
                setupLoad(false);
                gameStarted = true;
            }, currentGame.rounds * 1000 / 2);
        };
    };

    //Submit Woof Booth
    if (e.target.matches('#woof-form')) {
        checkWoofBooth(currentGame, currentStats);
    };

    //Submit Round
    if (e.target.matches('#selection-form')) {
        updateStats(currentGame, currentStats);
        //add stats chart, with woof result and number of correct matches
        setupStatChart(currentGame, currentStats);
        //if winner, execute winner function and end game
        if (checkWinner(currentGame, currentStats)) {
            endGame(currentGame, currentStats, true);
        } else if (currentGame.round === currentGame.rounds) {
            endGame(currentGame, currentStats, false);
        } else {
            resetRound(currentGame, currentStats);
            nextRound(currentGame, currentStats);
        };
    };
}, false);


//Window Resize
window.addEventListener('resize', e => {
    //only if stat chart already exists
    if (currentStats && currentStats.chart) {
        setupLegendHeaders(currentGame, true);
    };
});