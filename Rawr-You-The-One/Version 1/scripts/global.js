//Variables
let currentMessage, currentGame, currentStats, gameStarted;
const validWoofs = {
    owners: [],
    pets: []
};

//Helper Functions
const err = 'err';
const works = 'works';

function checkErr(msg) {
    console.log(msg);
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//randomize valid woofs (Fisher-Yates shuffle)
function randomWoofs() {
    //items left to shuffle
    let left = validWoofs.owners.length - 1;
    while (left > 0) {
        //take a random item from remaining to shuffle, place it on the end
        validWoofs.owners.push(validWoofs.owners.splice(randomBetween(0, left), 1)[0]);
        validWoofs.pets.push(validWoofs.pets.splice(randomBetween(0, left), 1)[0]);
        //decrease number left to shuffle
        left--;
    };
};

//add/remove classes
function classChange(element, add, rmv) {
    //shortened type expansion
    const expand = {
        'dupe': 'duplicate-selection',
        'uni': 'unique-selection',
        'active': 'active-selection',
        'passive': 'passive-selection',
        'match': 'pawfect-match',
        'no': 'no-match',
        'woof': 'potential-woof',
        'white': 'whitelist',
        'black': 'blacklist',
        'def': 'default'
    };
    //add/remove are arrays to iterate through
    if (add.length > 0) {
        //if more than one class
        if (add.length > 1) {
            add.forEach(type => {
                //check if class needs to be expanding to full name
                if (expand[type]) {
                    type = expand[type];
                };
                //if class doesn't exist
                if (!element.classList.contains(type)) {
                    //add class
                    element.classList.add(type);
                };
            });
        } else { //if just one class
            //check if class name needs to be expanded
            let classToAdd = add[0];
            if (expand[add[0]]) {
                classToAdd = expand[add[0]];
            };
            //if class doesn't exist
            if (!element.classList.contains(classToAdd)) {
                //add class
                element.classList.add(classToAdd);
            };
        };
    };
    if (rmv.length > 0) {
        //same for remove
        if (rmv.length > 1) {
            rmv.forEach(type => {
                if (expand[type]) {
                    type = expand[type];
                };
                if (element.classList.contains(type)) {
                    element.classList.remove(type);
                };
            });
        } else {
            let classToRemove = rmv[0];
            if (expand[rmv[0]]) {
                classToRemove = expand[rmv[0]];
            };
            element.classList.remove(classToRemove);
        };
    };
};

//remove child element from sections of html
function clearChildElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    };
};