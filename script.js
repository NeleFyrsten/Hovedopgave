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
    console.log(data.heroSection)
    //IMAGES
    //looking for the imageID of the hero images
    const HeroImage = document.querySelectorAll(".heroSection__image");

    HeroImage.forEach((image) => {
        const imageID = image.getAttribute("data-imageID");

        //looking for the image in the json with the same ID

        // postponed the finalisation of this function, because there were more important functions
        // in terms of functionality
    })
}

getData();

/**
 * selectBox
 */
function quantityButtonClick(e) {
    /** @type {HTMLButtonElement} */
    const button = e.target;
    const valueToAdd = button.classList.contains('--decrease') ? -1 : 1;
    const numberField = button.parentElement.querySelector('.choice__number');
    const currentValue = parseInt(numberField.textContent);

    const newValue = currentValue + valueToAdd > 0 ? currentValue + valueToAdd : 0;

    numberField.textContent = newValue;

    const container = button.closest('.selectBox__container');
    changeValueOfSelectBox(container.getAttribute('selectBoxName'));
}

function changeValueOfSelectBox(selectBoxName) {
    if (selectBoxName === 'searchParameters__chooseGuests') {
        const selectBox = document.querySelector(`.${selectBoxName}`);
        
        const numberAdults = selectBox.querySelector('.chooseGuests__adults .choice__number').textContent;
        const numberChilds = selectBox.querySelector('.chooseGuests__childs .choice__number').textContent;
        const numberBabies = selectBox.querySelector('.chooseGuests__babies .choice__number').textContent;
        const numberAnimals = selectBox.querySelector('.chooseGuests__animals .choice__number').textContent;

        const placeholder = document.querySelector('.searchParameters__house--guests .placeholder')
        placeholder.textContent = 
            `Voksne: ${numberAdults}`
            + (numberChilds > 0 ? ` | Børn: ${numberChilds}` : '') 
            + (numberBabies > 0 ? ` | Små Børn: ${numberBabies}` : '')
            + (numberAnimals > 0 ? ` | Kæledyr: ${numberAnimals}` : '');            
    }
}

const quantityButtons = document.querySelectorAll('.button__quantity');
for (const button of quantityButtons) {
    button.addEventListener('click', quantityButtonClick)
}

function toggleOpenChooseGuests(selectBoxName) {
    const activeClassName = 'selectBox--active';
    const chooseGuestsSection = document.querySelector(`.${selectBoxName}`);

    chooseGuestsSection.classList.toggle(activeClassName);
}

/**
 * Service
 */

function changeServiceQuantity() {
    const priceBarServices = document.querySelector('.priceBar__services');
    const emptyPlaceholder = priceBarServices.querySelector('.priceBar__services--empty')

    if (priceBarServices.children.length <= 2) {
        emptyPlaceholder.classList.add('--active');
    } else {
        emptyPlaceholder.classList.remove('--active');
    }
}

function addService(name, price) {
    const priceItem = createServiceContainer(name, price);
    const priceBarServices = document.querySelector('.priceBar__services');
    priceBarServices.append(priceItem);

    changeServiceQuantity();
}

function createServiceContainer(itemName, itemPrice) {
    const priceItem = document.createElement('section');
    priceItem.classList.add('priceBar__priceItem');

    const priceItemRemove = document.createElement('img');
    priceItemRemove.classList.add('priceItem--remove');
    priceItemRemove.src = './images/Icons/icon__bin.svg';
    priceItemRemove.alt = 'remove';
    priceItemRemove.addEventListener('click', function () {
        priceItem.remove();
        changeServiceQuantity();
    })

    const priceItemName = document.createElement('p');
    priceItemName.classList.add('p--small', 'priceItem--name');
    priceItemName.textContent = itemName;
    
    const priceItemCalculation = document.createElement('p');
    priceItemCalculation.classList.add('p--small', 'priceItem--calculation');
    priceItemCalculation.textContent = itemPrice;
    
    priceItem.append(priceItemRemove, priceItemName, priceItemCalculation);

    return priceItem;
}