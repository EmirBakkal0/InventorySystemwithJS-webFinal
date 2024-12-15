const farmersList = document.getElementById("farmers-list");
const farmerForm = document.getElementById("farmer-form");





class Farmer{
    constructor(fID,fName,phone,email,address,region) {
        this.fID=fID
        this.fName=fName
        this.fPhone=phone
        this.fEmail=email
        this.fAddress=address
        this.fRegion=region

    }

    editFarmer(name,phone,email,address,region){
        this.fName=name
        this.fPhone=phone
        this.fEmail=email
        this.fAddress=address
        this.fRegion=region
    }

}
const farmersJson= JSON.parse( localStorage.getItem("farmers")) ?? []
// get farmers from local storage if exists or create empty array

// map the farmers from local storage to farmer Class objs
const farmers= farmersJson.map((farmer) => new Farmer(farmer.fID,farmer.fName,farmer.fPhone,farmer.fEmail,farmer.fAddress,farmer.fRegion))


function findFarmerByID(id){
    return farmers.find((farmer) => farmer.fID===id)
}



// Function to display farmers
function displayFarmers() {
    farmersList.innerHTML = "";
    farmers.forEach((farmer, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span> ${farmer.fID}  ${farmer.fName} - ${farmer.fPhone} ${farmer.fEmail} (${farmer.fAddress})(${farmer.fRegion})</span>
            <button onclick="deleteFarmer(${index})">Delete</button>
        `;
        farmersList.appendChild(li);
    });
    populateSelection()
}

// Add farmer
farmerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("farmer-id").value;

    const name = document.getElementById("farmer-name").value;
    const phone = document.getElementById("farmer-phone").value;
    const email = document.getElementById("farmer-email").value;
    const address= document.getElementById("farmer-address").value;
    const region = document.getElementById("farmer-region").value;

    farmers.push(new Farmer(id,name,phone,email,address,region))
    localStorage.setItem("farmers", JSON.stringify(farmers));
    farmerForm.reset();
    displayFarmers();
});

// Delete farmer
window.deleteFarmer = (index) => {
    farmers.splice(index, 1);
    localStorage.setItem("farmers", JSON.stringify(farmers));
    displayFarmers();
};


function populateSelection(){
    const selectFarmer=document.querySelector("#selectFarmer")
    selectFarmer.innerHTML="<option id=\"nullOption\" value=\"null\">Choose one</option>"
    farmers.forEach(farmer => {
        const option = `<option value="${farmer.fID}">${farmer.fName}</option>`;
        selectFarmer.innerHTML += option;

    });
}

function populateUpdateFields(){
    const chosenOption=document.querySelector("#selectFarmer")
    try{
        chosenOption.removeChild(document.getElementById("nullOption"))

    }catch (e){

    }
    const farmer= findFarmerByID(chosenOption.value)
    document.getElementById("u-farmer-name").value=farmer.fName

    document.getElementById("u-farmer-phone").value=farmer.fPhone
    document.getElementById("u-farmer-email").value=farmer.fEmail
    document.getElementById("u-farmer-address").value=farmer.fAddress
    document.getElementById("u-farmer-region").value=farmer.fRegion
}

document.querySelector("#updateFarmerForm").addEventListener("submit", (e) =>{
    e.preventDefault();
    const chosenOption=document.querySelector("#selectFarmer")
    const id=chosenOption.value

    const name = document.getElementById("u-farmer-name").value

    const phone = document.getElementById("u-farmer-phone").value;
    const email = document.getElementById("u-farmer-email").value;
    const address= document.getElementById("u-farmer-address").value;
    const region = document.getElementById("u-farmer-region").value;
    e.target.reset()

    const farmer=findFarmerByID(id)
    farmer.editFarmer(name,phone,email,address,region)
    localStorage.setItem("farmers", JSON.stringify(farmers));

    displayFarmers()
})


function searchFarmer(event,searchType){
    event.preventDefault()
    let farmerResult=[]
    if (searchType==="name"){
        const searchedName=document.getElementById("farmerSearchByName").value
        farmerResult=farmers.filter((farmer) => farmer.fName.toLowerCase().includes( searchedName.toLowerCase()))

    }
    else if (searchType==="city"){
        const searchedName=document.getElementById("farmerSearchByCity").value
        farmerResult=farmers.filter((farmer) => farmer.fAddress.toLowerCase().includes( searchedName.toLowerCase()))

    }
    else if (searchType==="region"){
        const searchedName=document.getElementById("farmerSearchByRegion").value
        farmerResult=farmers.filter((farmer) => farmer.fRegion.toLowerCase().includes( searchedName.toLowerCase()))

    }
    farmersList.innerHTML = "";
    farmerResult.forEach((farmer, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span> ${farmer.fID}  ${farmer.fName} - ${farmer.fPhone} ${farmer.fEmail} (${farmer.fAddress})(${farmer.fRegion})</span>
            <button onclick="deleteFarmer(${index})">Delete</button>
        `;
        farmersList.appendChild(li);
    });



}

document.querySelector("#searchFarmerForm").addEventListener("submit",e =>  searchFarmer(e,"name") )
document.querySelector("#searchFarmerByCityForm").addEventListener("submit",e =>  searchFarmer(e,"city") )
document.querySelector("#searchFarmerByRegionForm").addEventListener("submit",e =>  searchFarmer(e,"region") )



// Initial display
displayFarmers();