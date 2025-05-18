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

    })
}

getData();