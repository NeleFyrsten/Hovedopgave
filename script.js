// Add house data: get data from json file and add it into the right spots

// get images
function getData() {
    fetch("houseData.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Data received:", data);
            addData(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function addData(data) {
    /** 1. get the right elements from dom
     * 2. get the right data from json
     */
    //IMAGES
    //looking for the imageID of the hero images
    const HeroImage = document.querySelectorAll(".heroSection__image");

    HeroImage.forEach((image) => {
        const imageID = image.getAttribute("data-imageID");

        //looking for the image in the json with the same ID
        //setting the string of the JSON as src-content

        /** postponed the finalisation of this function, because there were more important functions
       in terms of functionality */
    })
}

getData();


/**______________________________________________
 *                  MODULES
 *  Modules can be used multiple times throughout 
 *  the whole platform and are therfore placed on 
 *  top of the script
 *_______________________________________________ */   


/**
 * MODULE: CHANGE QUANTITIY (BUTTON)
 * = decreasebutton, number, increasebutton
 */

// function includes actions on the button itself with change of number 
// parameters: event from eventListener, function that runs afterwords, dependend on where the module is used
function quantityButtonClick(e, onSuccess) {
    /** @type {HTMLButtonElement} */
    // which module was clicked on?
    const button = e.target;
    const quantityModul = button.parentElement;
    // if it was the decrease-button: -1, else +1
    const valueToAdd = button.classList.contains('--decrease') ? -1 : 1;
    // get the number, make number to an integer to be able to change it
    const numberElement = quantityModul.querySelector('.choice__number');
    const currentValue = parseInt(numberElement.textContent);
    // getting the element's min-value, if there is one, else just take 0
    const minValue = numberElement.hasAttribute('min') ? parseInt(numberElement.getAttribute('min')) : 0;
    // calculating the new number and replacing the textContent with this number
    const newValue = currentValue + valueToAdd > minValue ? currentValue + valueToAdd : minValue;
    numberElement.textContent = newValue;

    // calling the function, that should follow (this is defined in the eventlistener)
    onSuccess(quantityModul)
}

/**_____________________________________________
 *                  SELECT BOX
 _______________________________________________*/

// function gets called trhough quantityButtonClick
// parameter: quantityButton = module, the button is in 
function changeValueOfSelectBox(quantityButton) {
    // get the selectBox, the button is in (only necessary for later designs)
    const selectBoxContainer = quantityButton.closest('.selectBox__container');
    const selectBoxName = selectBoxContainer.getAttribute('selectBoxName');

    // with later designs and more selectboxes in mind -> get the numbers of the guests
    if (selectBoxName === 'searchParameters__chooseGuests') {
        const numberAdults = selectBoxContainer.querySelector('.chooseGuests__adults .choice__number').textContent;
        const numberChildren = selectBoxContainer.querySelector('.chooseGuests__children .choice__number').textContent;
        const numberBabies = selectBoxContainer.querySelector('.chooseGuests__babies .choice__number').textContent;
        const numberAnimals = selectBoxContainer.querySelector('.chooseGuests__animals .choice__number').textContent;

        // replace the placeholder text with the numbers of guests
        const placeholder = document.querySelector('.searchParameters__house--guests .placeholder')
        placeholder.textContent = 
            `Voksne: ${numberAdults}`
            + (numberChildren > 0 ? ` | Børn: ${numberChildren}` : '') 
            + (numberBabies > 0 ? ` | Små Børn: ${numberBabies}` : '')
            + (numberAnimals > 0 ? ` | Kæledyr: ${numberAnimals}` : '');
        
    }
}

//onclick function, called in HTML -> opens the selectbox pop-up
function toggleOpenSelectBox(selectBoxName) {
    const activeClassName = '--active';
    const selectBoxContainer = document.querySelector(`.${selectBoxName}`);

    selectBoxContainer.classList.toggle(activeClassName);
    changeValueOfSelectBox(selectBoxContainer);
}

//eventlistener on quantity buttons inside the select box and calling Module function
function addEventListenerToSelectBox() {
    const quantityButtons = document.querySelectorAll('.selectBox__container .button__quantity');
    for (const button of quantityButtons) {
        button.addEventListener('click', (e) => {
            quantityButtonClick(e, changeValueOfSelectBox)
        })
    }
}

//onLoad
addEventListenerToSelectBox();


/**_______________________________________
 *                  Guests
 _________________________________________*/

 // how many guests are the in each guestgroup (relevant for e.g. bedding service)
function guestCount(guestGroups) {
    const priceBar = document.querySelector('.priceBar');

    let personCount = 0;
    for(const guestGroup of guestGroups) {
        let number = priceBar.querySelector(`.chooseGuests__${guestGroup} .choice__number`);
        personCount += parseInt(number.textContent);
    };
    return personCount;
}

/**________________________________________
 *                  Service
 __________________________________________*/

 //checking if there are services in the priceBar, when adding a service
function changeServiceCount() {
    const priceBarServices = document.querySelector('.priceBar .priceBar__services');
    // getting the placeholder "ingen tilkøb" to remove it, when a service is added
    const emptyPlaceholder = priceBarServices.querySelector('.priceBar__services--empty')
    // if there is a service in the priceBar, the placeholder should vanish
    if (priceBarServices.children.length <= 2) {
        emptyPlaceholder.classList.add('--active');
    } else {
        emptyPlaceholder.classList.remove('--active');
    }
}

/** FUNCTION: Calculating the Service's price dependent on the quantity
 *  function gets called by eventlistener on the newly created service in the priceBar
 *  parameter: which button has been clicked on? */
function changeServiceQuantity(quantityButton) {
    // getting the price of the service, of which we changed the quantity
    const calculationElement = quantityButton.parentElement.querySelector('.priceItem--calculation');
    const quantityElement = quantityButton.querySelector('.choice__number')

    // unitPrice is set, when the Service is created inside the priceBar (createServiceContainer)
    const unitPrice = parseFloat(calculationElement.getAttribute('unitPrice'));
    const quantity = quantityElement.textContent;

    // multiplying the unitPrice with the quantity and writing this new price inside the element
    calculationElement.textContent = unitPrice * quantity;

    // new calculation of total price, because 
    calculationOfTotalPrice();
}

 //onclick function in html; eachGuestGroup not always defined in html, =false ignores this parameter, when it is empty
function addService(name, price, eachGuestGroup = false) {
    // calling a function, that creates the elements in the priceBar 
    const priceItem = createServiceContainer(name, price, eachGuestGroup);
    const priceBarServices = document.querySelector('.priceBar__services');
    priceBarServices.append(priceItem);
    //function: how many services are there in the priceBar?
    changeServiceCount();
    //function: new calculation of total price after adding a service
    calculationOfTotalPrice();
}

// creating all the elements of the service information in the priceBar
function createServiceContainer(itemName, unitPrice, eachGuestGroup = false) {
    // if there is a definition of guestGroups, then I want to count the guests to fill in the quantity
    //else: 1 guest, because it's always 1 adult chosen by default
    const packageCount = eachGuestGroup !== false ? guestCount(eachGuestGroup) : 1; 

    const priceItem = document.createElement('section');
    priceItem.classList.add('priceBar__priceItem');
    //creating the remove icon
    const priceItemRemove = document.createElement('img');
    priceItemRemove.classList.add('priceItem--remove');
    priceItemRemove.src = './images/Icons/icon__bin.svg';
    priceItemRemove.alt = 'remove';
    //when removing: shall the placeholder appear in priceBar? new price calculation
    priceItemRemove.addEventListener('click',  () => {
        priceItem.remove();
        changeServiceCount();
        calculationOfTotalPrice();
    })

    const priceItemName = document.createElement('p');
    priceItemName.classList.add('p--small', 'priceItem--name');
    priceItemName.textContent = itemName;

    // creating module: quantity button
    const quantityButton = document.createElement('section');
    quantityButton.classList.add('choice__quantity', 'button__changeQuantity');
    const buttonDecrease = document.createElement('button');
    buttonDecrease.classList.add('button__quantity', '--decrease');
    buttonDecrease.textContent = '-';
    buttonDecrease.addEventListener('click', (e) => {
        quantityButtonClick(e, changeServiceQuantity)
    });
    const quantityValue = document.createElement('p');
    quantityValue.classList.add('p--small', 'choice__number');
    quantityValue.setAttribute('min', 1);
    quantityValue.textContent = packageCount;
    const buttonIncrease = document.createElement('button');
    buttonIncrease.classList.add('button__quantity', '--increase');
    buttonIncrease.textContent = '+';
    buttonIncrease.addEventListener('click', (e)=> {
        quantityButtonClick(e, changeServiceQuantity)
    });
    quantityButton.append(buttonDecrease, quantityValue, buttonIncrease);
    
    // creating the price
    const priceItemCalculation = document.createElement('p');
    priceItemCalculation.classList.add('p--small', 'priceItem--calculation');
   
    priceItemCalculation.setAttribute('unitPrice', unitPrice);
    priceItemCalculation.textContent = unitPrice * packageCount;
    
    priceItem.append(priceItemRemove, priceItemName, quantityButton, priceItemCalculation);

    return priceItem;
}

/**___________________________________________
 *              Total price
 _____________________________________________*/

function calculationOfTotalPrice() {
    const priceBar = document.querySelector('.priceBar');
    const prices = priceBar.querySelectorAll('.priceItem--calculation');

    let totalSum = 0.0;
    for(const price of prices) {
        // link in empty placeholder is also .priceItem--calculation
        // if price isn't a number, this loop continues with the next price
        if (isNaN(parseFloat(price.textContent))) continue;
        let value = parseFloat(price.textContent);

        totalSum += value;
    }

    const totalPrice = priceBar.querySelector('.priceBar__totalPrice');
    totalPrice.textContent = `${totalSum} kr`;
}

//onLoad
calculationOfTotalPrice();