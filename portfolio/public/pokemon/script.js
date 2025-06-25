const formTemplate = `<form class="type-form flex">
<h1>Pokemon Type</h1>
<button type="button" class="normal" value="normal">Normal</button>
<button type="button" class="fighting" value="fighting">Fighting</button>
<button type="button" class="flying" value="flying">Flying</button>
<button type="button" class="poison" value="poison">Poison</button>
<button type="button" class="ground" value="ground">Ground</button>
<button type="button" class="rock" value="rock">Rock</button>
<button type="button" class="bug" value="bug">Bug</button>
<button type="button" class="ghost" value="ghost">Ghost</button>
<button type="button" class="steel" value="steel">Steel</button>
<button type="button" class="fire" value="fire">Fire</button>
<button type="button" class="water" value="water">Water</button>
<button type="button" class="grass" value="grass">Grass</button>
<button type="button" class="electric" value="electric">Electric</button>
<button type="button" class="psychic" value="psychic">Psychic</button>
<button type="button" class="ice" value="ice">Ice</button>
<button type="button" class="dragon" value="dragon">Dragon</button>
<button type="button" class="dark" value="dark">Dark</button>
<button type="button" class="fairy" value="fairy">Fairy</button>
</form>`;

document.querySelector('body').insertAdjacentHTML('afterbegin', formTemplate);

const moveData = {
    // "type": {
    //     "super": [],
    //     "not": [],
    //     "none": [],
    //     "weak": [],
    //     "resist": [],
    //     "immune": [],
    // },
    "normal": {
        "not": ["rock", "steel"],
        "none": ["ghost"],
        "weak": ["fighting"],
        "immune": ["ghost"]
    },
    "fighting": {
        "super": ["normal", "rock", "steel", "ice", "dark"],
        "not": ["flying", "poison", "bug", "psychic", "fairy"],
        "none": ["ghost"],
        "weak": ["flying", "psychic", "fairy"],
        "resist": ["rock", "bug", "dark"]
    },
    "flying": {
        "super": ["fighting", "bug", "grass"],
        "not": ["rock", "steel", "electric"],
        "weak": ["rock", "electric", "ice"],
        "resist": ["fighting", "bug", "grass"],
        "immune": ["ground"]
    },
    "poison": {
        "super": ["grass", "fairy"],
        "not": ["poison", "ground", "rock", "ghost"],
        "none": ["steel"],
        "weak": ["ground", "psychic"],
        "resist": ["fighting", "poison", "bug", "grass", "fairy"]
    },
    "ground": {
        "super": ["poison", "rock", "steel", "fire", "electric"],
        "not": ["bug", "grass"],
        "none": ["flying"],
        "weak": ["water", "grass", "ice"],
        "resist": ["poison", "rock"],
        "immune": ["electric"]
    },
    "rock": {
        "super": ["flying", "bug", "fire", "ice"],
        "not": ["fighting", "ground", "steel"],
        "weak": ["fighting", "ground", "steel", "water", "grass"],
        "resist": ["normal", "flying", "poison", "fire"]
    },
    "bug": {
        "super": ["grass", "psychic", "dark"],
        "not": ["fighting", "flying", "poison", "ghost", "steel", "fire", "fairy"],
        "weak": ["flying", "rock", "fire"],
        "resist": ["fighting", "ground", "grass"]
    },
    "ghost": {
        "super": ["ghost", "psychic"],
        "not": ["dark"],
        "none": ["normal"],
        "weak": ["ghost", "dark"],
        "resist": ["poison", "bug"],
        "immune": ["normal", "fighting"]
    },
    "steel": {
        "super": ["rock", "ice", "fairy"],
        "not": ["steel", "fire", "water", "electric"],
        "weak": ["fighting", "ground", "fire"],
        "resist": ["normal", "flying", "rock", "bug", "steel", "grass", "psychic", "ice", "dragon", "fairy"],
        "immune": ["poison"]
    },
    "fire": {
        "super": ["bug", "steel", "grass", "ice"],
        "not": ["rock", "fire", "water", "dragon"],
        "weak": ["ground", "rock", "water"],
        "resist": ["bug", "steel", "fire", "grass", "ice", "fairy"]
    },
    "water": {
        "super": ["ground", "rock", "fire"],
        "not": ["water", "grass", "dragon"],
        "weak": ["grass", "electric"],
        "resist": ["steel", "fire", "water", "ice"]
    },
    "grass": {
        "super": ["ground", "rock", "water"],
        "not": ["flying", "poison", "bug", "steel", "fire", "grass", "dragon"],
        "weak": ["flying", "poison", "bug", "fire", "ice"],
        "resist": ["ground", "water", "grass", "electric"]
    },
    "electric": {
        "super": ["flying", "water"],
        "not": ["grass", "electric", "dragon"],
        "none": ["ground"],
        "weak": ["ground"],
        "resist": ["flying", "steel", "electric"]
    },
    "psychic": {
        "super": ["fighting", "poison"],
        "not": ["steel", "psychic"],
        "none": ["dark"],
        "weak": ["bug", "ghost", "dark"],
        "resist": ["fighting", "psychic"]
    },
    "ice": {
        "super": ["flying", "ground", "grass", "dragon"],
        "not": ["steel", "fire", "water", "ice"],
        "weak": ["fighting", "rock", "steel", "fire"],
        "resist": ["ice"]
    },
    "dragon": {
        "super": ["dragon"],
        "not": ["steel"],
        "none": ["fairy"],
        "weak": ["ice", "dragon", "fairy"],
        "resist": ["fire", "water", "grass", "electric"]
    },
    "dark": {
        "super": ["ghost", "psychic"],
        "not": ["fighting", "dark", "fairy"],
        "weak": ["fighting", "bug", "fairy"],
        "resist": ["ghost", "dark"],
        "immune": ["psychic"]
    },
    "fairy": {
        "super": ["fighting", "dragon", "dark"],
        "not": ["poison", "steel", "fire"],
        "weak": ["poison", "steel"],
        "resist": ["fighting", "bug", "dark"],
        "immune": ["dragon"],
    }
};

//capitalize first letter of string
function capitalize(s) {
    return s.split('').map((l, i) => {
        if (i === 0) {
            return l.toUpperCase();
        } else {
            return l;
        };
    }).join('');
};

document.addEventListener('click', (e) => {
    //set clickedType to button value or container list item button value
    const clickedType = e.target.value ? e.target.value : e.target.classList.contains('effect-type') ? e.target.firstElementChild.value : null;
    console.log(clickedType);
    const typeData = moveData[clickedType];

    //Upon clicking a type button, open a modal with the relevant type HTML
    if (clickedType) {
        //remove type form if modal closed, or modal itself if open
        document.querySelector('.type-form') ? document.querySelector('.type-form').remove() : document.querySelector('section.info').remove();
        //Insert modal template
        document.querySelector('body').insertAdjacentHTML('afterbegin', `
            <section id="${clickedType}-info" class="info">
            <h1 class="${clickedType}">${capitalize(clickedType)}</h1>
            <ul class="attack-types flex">
                <li class="flex offense">
                    <h2>Offense</h2>
                    <ul class="flex effect-container">
                    ${typeData.super ? `<li class="effect green super">Super Effective</li>` : ''}
                    ${typeData.not ? `<li class="effect yellow not">Not Very Effective</li>` : ''}
                    ${typeData.none ? `<li class="effect red none">No Effect</li>` : ''}
                    </ul>
                </li>
                <li class="flex defense">
                    <h2>Defense</h2>
                    <ul class="flex effect-container">
                    ${typeData.weak ? `<li class="effect red weak">Weak Against</li>` : ''}
                    ${typeData.resist ? `<li class="effect green resist">Resistant To</li>` : ''}
                    ${typeData.immune ? `<li class="effect grey immune">Immune To</li>` : ''}
                    </ul>
                </li>
            </ul>
            <button type="button" id="close">Close</button>
            </section>
        `);
        Object.keys(typeData).forEach((e, i) => {
            document.querySelector(`.${e}`).insertAdjacentHTML('beforeend', `<ul class="flex effect-types ${e}-types"></ul>`);
            typeData[e].forEach((t) => {
                document.querySelector(`.${e}-types`).insertAdjacentHTML('beforeend', `
                    <li class="effect-type ${e} ${t}"><button type="button" class="switch ${t}" value="${t}">${capitalize(t)}</button></li>
                `);
            });
        });
    };

    //Close the modal with either close button or clicking outside of it
    if (document.querySelector('section.info') && (e.target.id === 'close' || !clickedType)) {
        document.querySelector('section.info').remove();
        document.querySelector('body').insertAdjacentHTML('afterbegin', formTemplate);
    };

}, false);