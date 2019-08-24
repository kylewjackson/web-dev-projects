//===============
//Setup
//===============
const names = {
    //test names
    // owners: [
    //     'Buffy',
    //     'Xander',
    //     'Cordelia',
    //     'Willow',
    //     'Giles',
    //     'Spike',
    //     'Angel',
    //     'Anya',
    //     'Tara',
    //     'Dawn',
    //     'Joyce',
    //     'Faith'
    // ],
    // pets: [
    //     'Vampire',
    //     'Dragon',
    //     'Werewolf',
    //     'Witch',
    //     'Mantis',
    //     'Ghost',
    //     'Demon',
    //     'Slayer',
    //     'God',
    //     'Gentleman',
    //     'The First',
    //     'Fish'
    // ],
    owners: [
        'Sigfried',
        'Steve',
        'Dave',
        'Jane',
        'Veronica',
        'Opal',
        'Cesar',
        'Tina',
        'Thora',
        'Josh',
        'Arthur',
        'Mowgli',
        'Christopher',
        'Buffy'
    ],
    pets: [
        'Pup',
        'Kitty',
        'Parrot',
        'Tiger',
        'Bear',
        'Chimp',
        'Croc',
        'Goat',
        'Echidna',
        'Hamster',
        'Pig',
        'Bunny',
        'Snake',
        'Toad'
    ],
    cased: {
        lower: {},
        upper: {}
    },
    num: [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven'
    ]
};

//create objects with key/value pairs based on uppercase and lowercase/condensed versions of names
names.owners.forEach(owner => {
    names.cased.lower[owner.match(/\S/g).join('').toLowerCase()] = owner;
});
names.pets.forEach(pet => {
    names.cased.lower[pet.match(/\S/g).join('').toLowerCase()] = pet;
});
Object.values(names.cased.lower).forEach((uppers, i) => {
    names.cased.upper[uppers] = Object.keys(names.cased.lower)[i];
});

//=================
//Constructors
//=================
function Game(rounds) {
    this.round = 1;
    this.rounds = rounds;

    //create shallow copies of owner/pet arrays in order to randomly assign pairs to the game
    const initOwners = [...names.owners];
    const initPets = [...names.pets];

    this.owners = [];
    this.pets = [];
    this.alphaPets;

    //splice out a random item from each initial array, and stop once new array is full for rounds
    while (this.owners.length < rounds) {
        let randomNum = randomBetween(0, initPets.length - 1);
        this.owners.push(names.cased.upper[initOwners.splice(randomNum, 1)[0]]);
        this.pets.push(names.cased.upper[initPets.splice(randomNum, 1)[0]]);
    };

    //alphabetize
    this.owners.sort();
    this.alphaPets = [...this.pets].sort();

    this.matches = {};

    //set up game matches
    this.owners.forEach((owner, i) => {
        this.matches[owner] = this.pets[i];
    });
};

function Stats(game) {
    this.chart = false;
    this.round = {
        [game.round]: {
            selections: {},
            woof: {}
        }
    };
    this.list = {
        white: {
            owner: [],
            pet: []
        },
        black: {
            owner: [],
            pet: []
        }
    };
    this.confirmed = {
        match: {},
        noMatch: {}
    };
    this.blackouts = 0;
    this.rows = 0;
};

//================
//Setup Rules
//================
function setupRules(remove) {
    document.querySelector('#rules-container').insertAdjacentHTML('beforeend', `
        <div id="game-rules" class="rules left boxes shadows wrapper dark-pink yellow-bg">
                <div id="game-rules-paw-overlay" class="paw-overlays">
                    <svg viewBox="0 0 331 346" fill="none" xmlns="http://www.w3.org/2000/svg" id="game-rules-paw" class="paw-bases">
                        <path d="M158.702 338.048C198.297 361.081 235.679 320.377 249.421 297.145C276.411 296.86 330.353 284.839 330.203 239.032C330.016 181.773 239.443 106.584 164.411 149.904C89.3794 193.223 109.209 309.256 158.702 338.048Z" />
                        <path d="M69.3453 177.208C95.0417 194.712 107.653 226.261 97.5135 247.675C87.374 269.089 58.3233 272.258 32.627 254.754C6.93063 237.249 -5.68071 205.7 4.45877 184.287C14.5983 162.873 43.649 159.704 69.3453 177.208Z" />
                        <path d="M103.094 77.4118C124.765 100.97 129.901 133.775 114.565 150.684C99.2285 167.593 69.2277 162.202 47.5561 138.643C25.8845 115.085 20.7486 82.2798 36.0849 65.3712C51.4211 48.4626 81.4219 53.8533 103.094 77.4118Z" />
                        <path d="M227.573 85.3411C229.884 116.347 250.901 143.043 274.515 144.969C298.13 146.895 315.4 123.321 313.089 92.3149C310.778 61.3091 289.761 34.6128 266.147 32.6871C242.532 30.7613 225.262 54.3353 227.573 85.3411Z" />
                        <path d="M124.972 64.7804C134.538 95.3278 160.38 116.178 182.692 111.351C205.003 106.524 215.335 77.8467 205.769 47.2993C196.202 16.7519 170.36 -4.09845 148.049 0.728821C125.737 5.55609 115.405 34.2329 124.972 64.7804Z" />
                    </svg>
                    <img src="images/paw-shade.svg" alt="paw shading" id="game-rules-paw-shade" class="paw-shadings">
                </div>
                <span id="game-rules-description" class="rule-descriptions">Each owner has a <em>purr-fect</em> companion awaiting, and you’re the <strong>matchmaker</strong>! Find each unique pairing to win.</span>
        </div>
        <div id="woof-rules" class="rules right boxes shadows wrapper yellow dark-pink-bg">
                <div id="woof-rules-paw-overlay" class="paw-overlays right">
                    <svg viewBox="0 0 331 346" fill="none" xmlns="http://www.w3.org/2000/svg" id="woof-rules-paw" class="paw-bases">
                        <path d="M158.702 338.048C198.297 361.081 235.679 320.377 249.421 297.145C276.411 296.86 330.353 284.839 330.203 239.032C330.016 181.773 239.443 106.584 164.411 149.904C89.3794 193.223 109.209 309.256 158.702 338.048Z" />
                        <path d="M69.3453 177.208C95.0417 194.712 107.653 226.261 97.5135 247.675C87.374 269.089 58.3233 272.258 32.627 254.754C6.93063 237.249 -5.68071 205.7 4.45877 184.287C14.5983 162.873 43.649 159.704 69.3453 177.208Z" />
                        <path d="M103.094 77.4118C124.765 100.97 129.901 133.775 114.565 150.684C99.2285 167.593 69.2277 162.202 47.5561 138.643C25.8845 115.085 20.7486 82.2798 36.0849 65.3712C51.4211 48.4626 81.4219 53.8533 103.094 77.4118Z" />
                        <path d="M227.573 85.3411C229.884 116.347 250.901 143.043 274.515 144.969C298.13 146.895 315.4 123.321 313.089 92.3149C310.778 61.3091 289.761 34.6128 266.147 32.6871C242.532 30.7613 225.262 54.3353 227.573 85.3411Z" />
                        <path d="M124.972 64.7804C134.538 95.3278 160.38 116.178 182.692 111.351C205.003 106.524 215.335 77.8467 205.769 47.2993C196.202 16.7519 170.36 -4.09845 148.049 0.728821C125.737 5.55609 115.405 34.2329 124.972 64.7804Z" />
                    </svg>
                    <img src="images/paw-shade.svg" alt="paw shading" id="woof-rules-paw-shade" class="paw-shadings">
                </div>
                <span id="woof-rules-description" class="rule-descriptions">Once per round, the <strong>Woof Booth</strong> lets you check if a pairing is <em>Pawfect</em> or <em>No Match</em>.</span>
        </div>
        <div id="list-rules" class="rules left boxes shadows wrapper yellow dark-pink-bg">
                <div id="list-rules-bone-icons" class="bones">
                    <img src="images/bone-white.svg" alt="whitelist bone icon" id="list-rules-white-bone-icon">
                    <img src="images/bone-black.svg" alt="blacklist bone icon" id="list-rules-black-bone-icon">
                </div>
                <span id="list-rules-description" class="rule-descriptions"><strong class="bone-light">Whitelist</strong> pairs you think might be a match. <strong class="bone-dark">Blacklist</strong> ones you don’t.</span>
        </div>
        <div id="blackout-rules" class="rules right boxes shadows wrapper dark-blue yellow-bg">
                <div id="blackout-rules-paw-overlay" class="paw-overlays right">
                    <svg viewBox="0 0 331 346" fill="none" xmlns="http://www.w3.org/2000/svg" id="blackout-rules-paw" class="paw-bases">
                        <path d="M158.702 338.048C198.297 361.081 235.679 320.377 249.421 297.145C276.411 296.86 330.353 284.839 330.203 239.032C330.016 181.773 239.443 106.584 164.411 149.904C89.3794 193.223 109.209 309.256 158.702 338.048Z" />
                        <path d="M69.3453 177.208C95.0417 194.712 107.653 226.261 97.5135 247.675C87.374 269.089 58.3233 272.258 32.627 254.754C6.93063 237.249 -5.68071 205.7 4.45877 184.287C14.5983 162.873 43.649 159.704 69.3453 177.208Z" />
                        <path d="M103.094 77.4118C124.765 100.97 129.901 133.775 114.565 150.684C99.2285 167.593 69.2277 162.202 47.5561 138.643C25.8845 115.085 20.7486 82.2798 36.0849 65.3712C51.4211 48.4626 81.4219 53.8533 103.094 77.4118Z" />
                        <path d="M227.573 85.3411C229.884 116.347 250.901 143.043 274.515 144.969C298.13 146.895 315.4 123.321 313.089 92.3149C310.778 61.3091 289.761 34.6128 266.147 32.6871C242.532 30.7613 225.262 54.3353 227.573 85.3411Z" />
                        <path d="M124.972 64.7804C134.538 95.3278 160.38 116.178 182.692 111.351C205.003 106.524 215.335 77.8467 205.769 47.2993C196.202 16.7519 170.36 -4.09845 148.049 0.728821C125.737 5.55609 115.405 34.2329 124.972 64.7804Z" />
                    </svg>
                    <img src="images/paw-shade.svg" alt="paw shading" id="blackout-rules-paw-shade" class="paw-shadings">
                </div>
                <span id="blackout-rules-description" class="rule-descriptions">At the end of each round, you’ll learn how many matches you found, <em>but not which ones</em>! If you find no matches, that’s a <strong class="bone-dark">Blackout</strong>.</span>
        </div>
    `);
};

//================
//Load Start
//==================
function setupLoad(add) {
    if (add) {
        classChange(document.body, ['load'], []);
        classChange(document.querySelector('#modal-container'), ['load'], []);
        classChange(document.querySelector('#modal-overlay'), ['load'], []);
        document.querySelector('#modal-overlay.load').insertAdjacentHTML('beforeend', `
            <div id="message-load" class="wrapper cursive-font">Loading...</div>
        `);
    } else if (!add) {
        classChange(document.body, [], ['load']);
        classChange(document.querySelector('#modal-container'), [], ['load']);
        classChange(document.querySelector('#modal-overlay'), [], ['load']);
        document.querySelector('#message-load').remove();
    };
};

//================
//Navbar Start
//================
function setupNavbar(rounds) {
    //remove header contents
    clearChildElements(document.querySelector('header'));
    //remove start class from header
    classChange(document.querySelector('header'), [], ['start']);
    //remove config
    clearChildElements(document.querySelector('#config'));
    //add navbar
    document.querySelector('header').insertAdjacentHTML('beforeend', `
    <div id="navbar" class="wrapper">
        <nav id="nav-restart-container" class="wrapper">
            <ul id="nav-restart" class="wrapper">
                <li id="restart-icon" class="wrapper">
                    <i class="fas fa-recycle" role="button"></i>
                </li>
                <li id="restart-nav" class="hidden"></li>
                <li id="info-icon" class="wrapper">
                    <i class="fas fa-info-circle" role="button"></i>
                </li>
            </ul>
        </nav>
        <nav id="nav-navigation-container" class="wrapper">
            <ul id="nav-navigation" class="wrapper">
                <li id="navigation-icon" class="wrapper">
                    <i class="fas fa-bars" role="button"></i>
                </li>
                <li id="navigation-nav" class="wrapper hidden">
                    <ul id="navigation-anchors" class="wrapper header-font bright-pink green-bg">
                        <li id="nav-woof" class="wrapper nav-link">Woof</li>
                        <li id="nav-match" class="wrapper nav-link last">Match</li>
                        <li id="nav-stats" class="wrapper nav-link">Stats</li>
                    </ul>
                </li>
            </ul>
        </nav>
        <div id="message-container" class="wrapper boxes shadows">
            <span id="message">Default Message</span>
        </div>
    </div>
    `);
    //add config
    setupConfig(rounds, 'navbar');
};

//================
//Config Start
//================
function setupConfig(rounds, parent) {
    if (parent === 'navbar') {
        document.querySelector('#restart-nav').insertAdjacentHTML('beforeend', `
            <form action="" id="config-form" class="wrapper form-grids">
                <div id="config-options" class="wrapper">
                    <input type="radio" name="rounds" id="04-rounds" class="config-inputs" value="4" required>
                    <label for="04-rounds" class="config-labels cursive-font green-stroke-shadow">4</label>
                    <input type="radio" name="rounds" id="08-rounds" class="config-inputs" value="8" required>
                    <label for="08-rounds" class="config-labels cursive-font green-stroke-shadow">8</label>
                    <input type="radio" name="rounds" id="10-rounds" class="config-inputs" value="10" required>
                    <label for="10-rounds" class="config-labels cursive-font green-stroke-shadow">10</label>
                    <input type="radio" name="rounds" id="12-rounds" class="config-inputs" value="12" required>
                    <label for="12-rounds" class="config-labels cursive-font green-stroke-shadow">12</label>
                </div>
                <button id="submit-config" class="boxes shadows">Begin</button>
            </form>
        `);
        //check rounds input
        document.querySelector(`.config-inputs[value="${rounds}"]`).checked = true;
        //set message variable
        currentMessage = document.querySelector('#message');
    } else {
        document.querySelector('#config').insertAdjacentHTML('beforeend', `
            <h1 id="config-header" class="headings">Config</h2>
                <div id="config-rules" class="rules left boxes shadows wrapper bone-light pink-bg">
                    <div id="config-rules-paw-overlay" class="paw-overlays">
                    <svg viewBox="0 0 331 346" fill="none" xmlns="http://www.w3.org/2000/svg" id="config-rules-paw" class="paw-bases">
                        <path d="M158.702 338.048C198.297 361.081 235.679 320.377 249.421 297.145C276.411 296.86 330.353 284.839 330.203 239.032C330.016 181.773 239.443 106.584 164.411 149.904C89.3794 193.223 109.209 309.256 158.702 338.048Z" />
                        <path d="M69.3453 177.208C95.0417 194.712 107.653 226.261 97.5135 247.675C87.374 269.089 58.3233 272.258 32.627 254.754C6.93063 237.249 -5.68071 205.7 4.45877 184.287C14.5983 162.873 43.649 159.704 69.3453 177.208Z" />
                        <path d="M103.094 77.4118C124.765 100.97 129.901 133.775 114.565 150.684C99.2285 167.593 69.2277 162.202 47.5561 138.643C25.8845 115.085 20.7486 82.2798 36.0849 65.3712C51.4211 48.4626 81.4219 53.8533 103.094 77.4118Z" />
                        <path d="M227.573 85.3411C229.884 116.347 250.901 143.043 274.515 144.969C298.13 146.895 315.4 123.321 313.089 92.3149C310.778 61.3091 289.761 34.6128 266.147 32.6871C242.532 30.7613 225.262 54.3353 227.573 85.3411Z" />
                        <path d="M124.972 64.7804C134.538 95.3278 160.38 116.178 182.692 111.351C205.003 106.524 215.335 77.8467 205.769 47.2993C196.202 16.7519 170.36 -4.09845 148.049 0.728821C125.737 5.55609 115.405 34.2329 124.972 64.7804Z" />
                    </svg>
                        <img src="images/paw-shade.svg" alt="paw shading" id="config-rules-paw-shade" class="paw-shadings">
                    </div>
                    <span id="config-rules-description" class="rule-descriptions">Number of <strong>Rounds</strong> = Number of <strong>Pawfect Matches</strong> to make!</span>
                </div>
                <form action="" id="config-form" class="wrapper form-grids">
                    <h3 id="config-rounds-header" class="sub-headings">Rounds</h3>
                    <div id="config-options" class="wrapper">
                        <input type="radio" name="rounds" id="04-rounds" class="config-inputs" value="4" required>
                        <label for="04-rounds" class="config-labels cursive-font green-stroke-shadow">4</label>
                        <input type="radio" name="rounds" id="08-rounds" class="config-inputs" value="8" required>
                        <label for="08-rounds" class="config-labels cursive-font green-stroke-shadow">8</label>
                        <input type="radio" name="rounds" id="10-rounds" class="config-inputs" value="10" required>
                        <label for="10-rounds" class="config-labels cursive-font green-stroke-shadow">10</label>
                        <input type="radio" name="rounds" id="12-rounds" class="config-inputs" value="12" required>
                        <label for="12-rounds" class="config-labels cursive-font green-stroke-shadow">12</label>
                    </div>
                    <button id="submit-config" class="boxes shadows">Begin</button>
                </form>
        `);
        //check rounds input
        document.querySelector(`.config-inputs[value="${rounds}"]`).checked = true;
        //set message variable
        currentMessage = document.querySelector('#message');
    };
};

setupRules();
setupConfig(4);

//================
//selections
//================
function setupAttemptSection() {
    document.querySelector('#attempt').insertAdjacentHTML('beforeend', `
        <h1 id="attempt-heading" class="headings">Attempt 1</h2>
        <form action="" id="woof-form" class="wrapper form-grids">
            <h2 id="woof-heading" class="headings"><span id="woof-anchor"></span>Woof Booth</h3>
                <div id="owner-woof" class="wrapper">
                    <h3 id="owner-woof-heading" class="sub-headings">Owner</h4>
                </div>
                <div id="pet-woof" class="wrapper">
                    <h3 id="pet-woof-heading" class="sub-headings">Pet</h4>
                </div>
            <button id="submit-woof" class="boxes shadows" disabled>Throw me a bone, will ya?</button>
        </form>
        <form action="" id="selection-form" class="wrapper form-grids">
            <span id="match-anchor"></span>
            <div id="selections-container" class="wrapper"></div>
            <button id="submit-selections" class="boxes shadows" disabled>Make WoofBooth Selections</button>
            <div id="reset-buttons-container" class="wrapper">
                <button id="reset-selections" class="boxes shadows" disabled>Reset Selections</button>
                <button id="reset-lists" class="boxes shadows" disabled>Reset Lists</button>
                <span id="stats-anchor"></span>
            </div>
        </form>
    `);
};

function setupWoofBooth(game) {
    //randomize valid woofs
    randomWoofs();
    //alphabatize woofs
    const alphaWoofs = {
        owners: [validWoofs.owners[0], validWoofs.owners[1], validWoofs.owners[2]].sort(),
        pets: [validWoofs.pets[0], validWoofs.pets[1], validWoofs.pets[2]].sort()
    };
    for (let i = 0; i < 3; i++) {
        document.querySelector('#owner-woof').insertAdjacentHTML('beforeend', `
            <input type="radio" name="owner-woof" id="${alphaWoofs.owners[i]}-woof-input" class="${alphaWoofs.owners[i]} woof-inputs" value="${alphaWoofs.owners[i]}" required>
            <label for="${alphaWoofs.owners[i]}-woof-input" id="${alphaWoofs.owners[i]}-woof-label" class="${alphaWoofs.owners[i]} woof-labels">${names.cased.lower[alphaWoofs.owners[i]]}</label>
        `);
        document.querySelector('#pet-woof').insertAdjacentHTML('beforeend', `
            <input type="radio" name="pet-woof" id="${alphaWoofs.pets[i]}-woof-input" class="${alphaWoofs.pets[i]} woof-inputs" value="${alphaWoofs.pets[i]}" required>
            <label for="${alphaWoofs.pets[i]}-woof-input" id="${alphaWoofs.pets[i]}-woof-label" class="${alphaWoofs.pets[i]} woof-labels">${names.cased.lower[alphaWoofs.pets[i]]}</label>
        `);
    };
};

function setupSelections(game) {
    //setup selections area
    for (let i = 0; i < game.owners.length; i++) {
        document.querySelector('#selections-container').insertAdjacentHTML('beforeend', `
            <div id="${game.owners[i]}-selections-container" class="${game.owners[i]} wrapper boxes shadows selection-containers empty">
                    <h3 id="${game.owners[i]}-heading" class="wrapper col-flow headings ${game.owners[i]} shadows grey-stroke bright-pink-bg">${names.cased.lower[game.owners[i]]}
                    </h3>
                    <div id="${game.owners[i]}-radio-container" class="${game.owners[i]} radio-containers wrapper">
                    </div>
            </div>
        `);
    };
    //add each selection
    document.querySelectorAll('.radio-containers').forEach(container => {
        currentGame.alphaPets.forEach(pet => {
            container.insertAdjacentHTML('beforeend', `
            <input type="radio" name="${container.classList[0]}" id="${container.classList[0]}-${pet}-input" class="${pet} pet-inputs" value="${pet}" required>
            <label for="${container.classList[0]}-${pet}-input" id="${container.classList[0]}-${pet}-label" class="${pet} pet-labels wrapper col-flow">
                <span id="${container.classList[0]}-${pet}-selection" class="${pet} pet-label-spans wrapper">
                    <span class="pet-label-name">${names.cased.lower[pet]}</span>
                </span>
                <div id="${container.classList[0]}-${pet}-list-container" class="selections-list-containers wrapper col-flow">
                    <input type="radio" name="${container.classList[0]}-${pet}-list" id="${container.classList[0]}-${pet}-default-input"
                        class="${pet} list-inputs" value="default" checked>
                    <label for="${container.classList[0]}-${pet}-default-input" id="${container.classList[0]}-${pet}-default-label"
                        class="${pet} list-labels"><img src="images/bone-default.svg" alt="default"></label>
                    <input type="radio" name="${container.classList[0]}-${pet}-list" id="${container.classList[0]}-${pet}-whitelist-input"
                        class="${pet} list-inputs" value="whitelist">
                    <label for="${container.classList[0]}-${pet}-whitelist-input" id="${container.classList[0]}-${pet}-whitelist-label"
                        class="${pet} list-labels"><img src="images/bone-white.svg" alt="whitelist"></label>
                    <input type="radio" name="${container.classList[0]}-${pet}-list" id="${container.classList[0]}-${pet}-blacklist-input"
                        class="${pet} list-inputs" value="blacklist">
                    <label for="${container.classList[0]}-${pet}-blacklist-input" id="${container.classList[0]}-${pet}-blacklist-label"
                        class="${pet} list-labels"><img src="images/bone-black.svg" alt="blacklist"></label>
                </div>
            </label>
            `);
        });
    });
};

//============
//stats
//============

function setupStatsSection() {
    document.querySelector('#stats').insertAdjacentHTML('beforeend', `
        <h2 id="stat-heading" class="headings">Stats</h2>
        <div id="stat-charts-container" class="wrapper">
            <div id="stat-rounds-container" class="wrapper stat-containers">
                <ul class="wrapper stat-rounds">
                    <li class="wrapper stat-round-legend safari10-border-radius">Round</li>
                </ul>
            </div>
            <div id="stat-selections-container" class="wrapper stat-containers">
            </div>
            <div id="stat-woofs-container" class="wrapper stat-containers">
                <ul class="wrapper stat-woofs">
                    <li class="wrapper stat-woof-legend">Woof</li>
                </ul>
            </div>
            <div id="stat-matches-container" class="wrapper stat-containers">
                <ul class="wrapper stat-matches">
                    <li class="wrapper stat-match-legend safari10-border-radius">Matches</li>
                </ul>
            </div>
        </div>
    `);
};

function setupOwnerLegend(game) {
    game.owners.forEach(owner => {
        document.querySelector('#stat-selections-container').insertAdjacentHTML('beforeend', `
            <ul id="${owner}-stats" class="wrapper stat-selections">
                <li id="${owner}-legend" class="wrapper ${owner} owner-legend">${names.cased.lower[owner]}
                </li>
            </ul>
        `);
    });
};

const roundCell = `
    <ul class="wrapper stat-rounds">
        <li class="wrapper stat-round-legend safari10-border-radius">Rounds</li>
    </ul>`;
const woofCell = `
    <ul class="wrapper stat-woofs">
        <li class="wrapper stat-woof-legend">Woof</li>
    </ul>
    `;
const matchCell = `
    <ul class="wrapper stat-matches">
        <li class="wrapper stat-match-legend safari10-border-radius">Matches</li>
    </ul>
    `;
const blankCell = `
    <ul class="wrapper stat-selections empty">
        <li class="wrapper blank-legend"></li>
    </ul>
    `;

function setupLegendHeaders(game, adjust) {
    let cellPosition = 0;
    let rowCount = 1;
    const cellPositions = [];
    if (adjust && currentStats && currentStats.rows > 0) {
        //check bounding position of each stat selection
        document.querySelectorAll('.stat-selections').forEach((ele, i) => {
            //caluclate new number of rows
            if (ele.getBoundingClientRect().left < cellPosition) {
                rowCount++;
                cellPosition = ele.getBoundingClientRect().left;
            } else {
                cellPosition = ele.getBoundingClientRect().left;
            };
            //push all positions into an array for empty cell logic
            cellPositions.push(ele.getBoundingClientRect().left);
        });
        //compare to current number of rows
        while (currentStats.rows !== rowCount) {
            //add/remove headings accordingly
            if (currentStats.rows < rowCount) {
                //fill row with approriate round/match/woof information
                const addRound = document.querySelectorAll('.stat-rounds')[document.querySelectorAll('.stat-rounds').length - 1];
                const addWoof = document.querySelectorAll('.stat-woofs')[document.querySelectorAll('.stat-woofs').length - 1];
                const addMatch = document.querySelectorAll('.stat-matches')[document.querySelectorAll('.stat-matches').length - 1];
                const cloneRound = addRound.cloneNode(true);
                const cloneWoof = addWoof.cloneNode(true);
                const cloneMatch = addMatch.cloneNode(true);

                addRound.insertAdjacentElement('afterend', cloneRound);
                addWoof.insertAdjacentElement('afterend', cloneWoof);
                addMatch.insertAdjacentElement('afterend', cloneMatch);

                currentStats.rows++;
            } else if (currentStats.rows > rowCount) {
                adjustLegendHeaders(false);
                currentStats.rows--;
            };
        };
        //add/remove empty cells if necessary
        const uniquePositions = [...new Set(cellPositions)];
        let necessaryCells = 0;
        //set necessary cells if applicable
        if (game.rounds % uniquePositions.length > 0) {
            necessaryCells = uniquePositions.length - game.rounds % uniquePositions.length;
        };
        while (document.querySelectorAll('.stat-selections.empty').length !== necessaryCells) {
            if (document.querySelectorAll('.stat-selections.empty').length < necessaryCells) {
                adjustEmptyCells(true, document.querySelectorAll('.stat-selections.empty').length + 1);
                //add list items based on current round
                for (let i = 1; i < game.round; i++) {
                    document.querySelectorAll('.stat-selections.empty')[document.querySelectorAll('.stat-selections.empty').length - 1].insertAdjacentHTML('beforeend', `<li id="round-${game.round - 1}-empty-cell-${i}" class="wrapper empty-cells"></li>`);
                };
            } else if (document.querySelectorAll('.stat-selections.empty').length > necessaryCells) {
                adjustEmptyCells(false);
            };
        };
    } else if (currentStats) {
        for (let i = 0; i < game.rounds; i++) {
            //find position of cell from left
            if (document.querySelectorAll('.stat-selections')[i].getBoundingClientRect().left < cellPosition) {
                //push in a new set
                rowCount++;
                adjustLegendHeaders(true);
                //reset cell position
                cellPosition = document.querySelectorAll('.stat-selections')[i].getBoundingClientRect().left;
            } else {
                cellPosition = document.querySelectorAll('.stat-selections')[i].getBoundingClientRect().left;
            };
            //push all positions into an array for empty cell logic
            cellPositions.push(document.querySelectorAll('.stat-selections')[i].getBoundingClientRect().left);
        };
        //fill in empty cells
        const uniquePositions = [...new Set(cellPositions)];
        const necessaryCells = uniquePositions.length - game.rounds % uniquePositions.length;
        if (rowCount > 1 && game.rounds % uniquePositions.length > 0) {
            for (let i = 1; i <= necessaryCells; i++) {
                adjustEmptyCells(i, true);
            };
        };
        //update row count
        currentStats.rows = rowCount;
    };
};

function adjustLegendHeaders(add) {
    if (add) {
        document.querySelector('#stat-rounds-container').insertAdjacentHTML('beforeend', `${roundCell}`);
        document.querySelector('#stat-woofs-container').insertAdjacentHTML('beforeend', `${woofCell}`);
        document.querySelector('#stat-matches-container').insertAdjacentHTML('beforeend', `${matchCell}`);
    } else if (!add) {
        document.querySelectorAll('.stat-rounds')[document.querySelectorAll('.stat-rounds').length - 1].remove();
        document.querySelectorAll('.stat-woofs')[document.querySelectorAll('.stat-woofs').length - 1].remove();
        document.querySelectorAll('.stat-matches')[document.querySelectorAll('.stat-matches').length - 1].remove();
    };
};

function adjustEmptyCells(add, i) {
    if (add) {
        document.querySelector('#stat-selections-container').insertAdjacentHTML('beforeend', blankCell);
        //set id of last element
        document.querySelectorAll('.stat-selections.empty')[document.querySelectorAll('.stat-selections.empty').length - 1].id = `empty-cell-${i}`;
    } else if (!add) {
        //remove last element
        document.querySelectorAll('.stat-selections.empty')[document.querySelectorAll('.stat-selections.empty').length - 1].remove();
    };
};