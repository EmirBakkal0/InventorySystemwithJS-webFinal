const farmersList = document.getElementById("farmers-list");
const farmerForm = document.getElementById("farmer-form");





class Farmer{
    constructor(fID,fName,phone,email,address,region,purchases) {
        this.fID=fID
        this.fName=fName
        this.fPhone=phone
        this.fEmail=email
        this.fAddress=address
        this.fRegion=region
        this.purchases=purchases

    }

    editFarmer(name,phone,email,address,region){
        this.fName=name
        this.fPhone=phone
        this.fEmail=email
        this.fAddress=address
        this.fRegion=region
    }

    addPurchase(purchase){
        this.purchases.push(purchase)
    }

}

class Purchase{
    constructor(pID,pFarmerID,pDate,pAmount,pPricePerAmount ){
        this.pID=pID
        this.pFarmerID=pFarmerID
        this.pDate=pDate
        this.pAmount=pAmount
        this.pPricePerAmount=pPricePerAmount
    }
    calcTotalCost(){
        return this.pAmount  * this.pPricePerAmount
    }
}

    const purchasesJson=JSON.parse( localStorage.getItem("purchases")) ?? []
const farmersJson= JSON.parse( localStorage.getItem("farmers")) ?? []
// get farmers from local storage if exists or create empty array

// map the farmers from local storage to farmer Class objs
const farmers= farmersJson.map((farmer) => new Farmer(farmer.fID,farmer.fName,farmer.fPhone,farmer.fEmail,farmer.fAddress,farmer.fRegion,farmer.purchases))
const purchases= purchasesJson.map((p) => new Purchase(p.pID,p.pFarmerID,p.pDate,p.pAmount,p.pPricePerAmount ) )

function findPurchaseByPID(id){
    purchases.find((p) => p.pID=== id)
}
function findPurchaseByFarmerID(id){
    purchases.find((p) => p.pFarmerID=== id)
}

function findFarmerByID(id){
    return farmers.find((farmer) => farmer.fID===id)
}



// Function to display farmers
function displayFarmers() {
    // const tablehead=document.querySelector()
    const tableBody=document.querySelector("#farmerTable tbody")

    tableBody.innerHTML = ""

    farmers.forEach((farmer,index) =>{
        const row=document.createElement("tr");
        row.innerHTML= `
      
      <td>${farmer.fID}</td>
      <td>${farmer.fName}</td>
      <td>${farmer.fPhone}</td>
      <td>${farmer.fEmail}</td>
      <td>${farmer.fAddress}</td>
      <td>${farmer.fRegion}</td>
      <td> <button onClick="deleteFarmer(${index})">Delete</button> </td>
            
      
      `;
        tableBody.appendChild(row);

    })

    populateSelection()
    populateFarmerSelectionForProduct()
    populateFarmerSelectionForPurchase()
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

    farmers.push(new Farmer(id,name,phone,email,address,region,[]))
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
function populateFarmerSelectionForProduct(){
    const selectFarmer=document.querySelector("#selectFarmerForProduct")
    selectFarmer.innerHTML=""//<option id=\"nullOptionForProduct\" value=\"null\">Choose one</option>"
    farmers.forEach(farmer => {
        const option = `<option value="${farmer.fID}">${farmer.fName}</option>`;
        selectFarmer.innerHTML += option;

    });
}function populateFarmerSelectionForPurchase(){
    const selectFarmer=document.querySelector("#selectFarmerForPurchase")
    selectFarmer.innerHTML=""//<option id=\"nullOptionForProduct\" value=\"null\">Choose one</option>"
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
    const tableBody=document.querySelector("#farmerTable tbody")

    tableBody.innerHTML = ""

    farmerResult.forEach((farmer,index) =>{
        const row=document.createElement("tr");
        row.innerHTML= `
      
      <td>${farmer.fID}</td>
      <td>${farmer.fName}</td>
      <td>${farmer.fPhone}</td>
      <td>${farmer.fEmail}</td>
      <td>${farmer.fAddress}</td>
      <td>${farmer.fRegion}</td>
      <td> <button onClick="deleteFarmer(${index})">Delete</button> </td>
            
      
      `;
        tableBody.appendChild(row);

    })




}

document.querySelector("#searchFarmerForm").addEventListener("submit",e =>  searchFarmer(e,"name") )
document.querySelector("#searchFarmerByCityForm").addEventListener("submit",e =>  searchFarmer(e,"city") )
document.querySelector("#searchFarmerByRegionForm").addEventListener("submit",e =>  searchFarmer(e,"region") )





document.querySelector("#product-form").addEventListener("submit",(e) =>{
    e.preventDefault();
    const pFarmerID = document.querySelector("#product-form select").value
    const [pID, pDate, pAmount, pPricePerAmount] = Array.from(document.querySelectorAll("#product-form input")).map(input => input.value);
    const farmer=findFarmerByID(pFarmerID)
    farmer.addPurchase(pID)
    purchases.push(new Purchase(pID,pFarmerID,pDate,pAmount,pPricePerAmount))

    localStorage.setItem("purchases", JSON.stringify(purchases));
    // farmerForm.reset();
    displayPurchaseLogs();


})

function displayPurchaseLogs(){
    const table=document.querySelector("#purchasesFromFarmerTable tbody")
    table.innerHTML=""
    purchases.forEach((purchase,index) =>{
        const row=document.createElement("tr");
        row.innerHTML= `
      
      <td>${purchase.pID}</td>
      <td>${findFarmerByID(purchase.pFarmerID).fName}</td>
      <td>${purchase.pDate}</td>
      <td>${purchase.pAmount}</td>
      <td>${purchase.pPricePerAmount}</td>
      <td>${purchase.calcTotalCost()}</td>
        
            
      
      `;
        table.appendChild(row);

    })

}

function isDateBetween(startDate, endDate, checkDate) {
    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    const check = new Date(checkDate);

    // Compare dates
    return check >= start && check <= end;
}




document.querySelector("#expenseCalc").addEventListener("submit", (e)  => {
    e.preventDefault()


    const [startDate,endDate] = Array.from(document.querySelectorAll("#expenseCalc input")).map(input => input.value);

    const productsBetweenDates=purchases.filter(purchase => isDateBetween(startDate,endDate,purchase.pDate)  )
    let totalCost=0
    productsBetweenDates.forEach(product => {
        totalCost+=product.calcTotalCost()
    })

    document.querySelector("#expenseText").innerHTML=`${startDate} and ${endDate} is ${totalCost}`


});

document.querySelector("#listPurchasesByDateForm").addEventListener("submit", e => {
    e.preventDefault();
    const [startDate,endDate] = Array.from(document.querySelectorAll("#listPurchasesByDateForm input")).map(input => input.value);
    const purchasesBetweenDates=purchases.filter(purchase => isDateBetween(startDate,endDate,purchase.pDate)  )
    const table=document.querySelector("#purchasesFromFarmerTable tbody")
    table.innerHTML=""
    purchasesBetweenDates.forEach(purchase => {
        const row=document.createElement("tr");
        row.innerHTML= `
      <td>${purchase.pID}</td>
      <td>${findFarmerByID(purchase.pFarmerID).fName}</td>
      <td>${purchase.pDate}</td>
      <td>${purchase.pAmount}</td>
      <td>${purchase.pPricePerAmount}</td>
      <td>${purchase.calcTotalCost()}</td>
      `;
        table.appendChild(row);

    })

})

document.querySelector("#listPurchasesByFarmer").addEventListener("submit", e =>{
    e.preventDefault()
    const option= document.querySelector("#selectFarmerForPurchase").value

    const table=document.querySelector("#purchasesFromFarmerTable tbody")
    table.innerHTML=""
    const filtered=purchases.filter(purchase => purchase.pFarmerID === option)

    filtered.forEach(purchase => {
        const row=document.createElement("tr");
        row.innerHTML= `
      <td>${purchase.pID}</td>
      <td>${findFarmerByID(purchase.pFarmerID).fName}</td>
      <td>${purchase.pDate}</td>
      <td>${purchase.pAmount}</td>
      <td>${purchase.pPricePerAmount}</td>
      <td>${purchase.calcTotalCost()}</td>
      `;
        table.appendChild(row);

    })

})

const exportFarmersToCSV = () => {

    if (farmers.length === 0) {
        alert("There are no farmers to export!");
        return;
    }

    // CSV headings
    const headers = [
        "Farmer ID",
        "Name",
        "Phone",
        "Email",
        "City",
        "Region",

    ];

    // CSV content
    const csvContent = [
        headers.join(","), // Başlık satırı
        ...farmers.map((farmer) =>
            [
                farmer.fID,
                farmer.fName,
                farmer.fPhone,
                farmer.fEmail,
                farmer.fAddress,
                farmer.fRegion,
            ].join(",")
        ),
            ].join("\n");

        // CSV create file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        // Download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "farmers_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // export btn
document.querySelector("#exportFarmerBtn").addEventListener("click", exportFarmersToCSV);




// Initial display
displayFarmers();
displayPurchaseLogs();

