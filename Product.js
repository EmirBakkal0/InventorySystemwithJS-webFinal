
class Category{
    constructor(kilograms,amount,price,name,alert ) {
        this.kg=kilograms
        this.amount=amount
        this.price=price
        this.cName=name
        this.lowStockAlert=alert
    }




}
const nonCategorizedBerryAmount=JSON.parse(localStorage.getItem("nonCategorizedBerryAmount")) ?? {total:100}


const inventoryJSON=JSON.parse( localStorage.getItem("inventory")) ?? [
    {
        "kg": 0.1,
        "amount": 0,
        "price": 2,
        "cName": "Small",
        "lowStockAlert":0
    },
    {
        "kg": 0.25,
        "amount": 0,
        "price": 4,
        "cName": "Medium",
        "lowStockAlert":0
    },
    {
        "kg": 0.5,
        "amount": 0,
        "price": 8,
        "cName": "Large",
        "lowStockAlert":0
    },
    {
        "kg": 1,
        "amount": 0,
        "price": 15,
        "cName": "Extra Large",
        "lowStockAlert":0
    },
    {
        "kg": 2,
        "amount": 0,
        "price": 28,
        "cName": "Family Pack",
        "lowStockAlert":0
    },
    {
        "kg": 5,
        "amount": 0,
        "price": 55,
        "cName": "Bulk Pack",
        "lowStockAlert":0
    },
    {
        "kg": 10,
        "amount": 0,
        "price": 105,
        "cName": "Premium",
        "lowStockAlert":0
    }
]


const inventory=inventoryJSON.map((c) => new Category(c.kg,c.amount, c.price, c.cName,c.lowStockAlert))







function listCategoryPrices(){
    const table=document.querySelector("#categoryPriceTable tbody")
    table.innerHTML=""
    inventory.forEach(category => {
        const row = document.createElement("tr")
        row.innerHTML=`
            <th>${category.cName}</th>
            <th>${category.price}</th>
           `
        table.appendChild(row)
    })
    document.querySelector("#nonCatAmount").innerHTML=nonCategorizedBerryAmount.total

}



function handleCategory(){
    if (document.getElementById("packageCategories").value === "Premium"){
        const input=document.getElementById("premiumWeightInput")
        input.classList.remove("hidden")
        input.classList.add("visible")

    }
    else{
        const input=document.getElementById("premiumWeightInput")
        input.classList.remove("visible")
        input.classList.add("hidden")

    }

}


function handlePriceField(){
    const categoryName=document.getElementById("categoriesForPrice").value
    const category=inventory.find(cat => cat.cName===categoryName)

    document.getElementById("categoryPrice").value=category.price
}

function listInventoryTracking(){
    const table=document.querySelector("#inventoryTrackingTable tbody")
    table.innerHTML=""
    inventory.forEach(category => {
        const row = document.createElement("tr")
        row.innerHTML=`
            <th>${category.cName}</th>
            <th>${category.amount}</th>
            <th>${alertStock(category.amount,category.lowStockAlert)}</th>
           `
        table.appendChild(row)
    })
}



// handling packaging form
document.querySelector("#packageForm").addEventListener("submit",e =>{
    e.preventDefault()
    const categoryName= document.getElementById("packageCategories").value
    const amount=document.getElementById("packageBerryAmount").value

    const category=inventory.find(cat => cat.cName===categoryName)

    nonCategorizedBerryAmount.total= Number.parseFloat(nonCategorizedBerryAmount.total) - Number.parseFloat(category.kg) * Number.parseFloat(amount)
    category.amount= Number.parseFloat(category.amount)  +( Number.parseFloat(amount)*Number.parseFloat(category.kg))

    localStorage.setItem("inventory",JSON.stringify(inventory))
    localStorage.setItem("nonCategorizedBerryAmount",JSON.stringify(nonCategorizedBerryAmount))
    listInventoryTracking()
    document.querySelector("#nonCatAmount").innerHTML=nonCategorizedBerryAmount.total

})

// set/update price of categories
document.querySelector("#categoryPriceForm").addEventListener("submit", e =>{
    e.preventDefault()
    const categoryName= document.getElementById("categoriesForPrice").value
    const price= document.querySelector("#categoryPrice").value
    const category=inventory.find(cat => cat.cName===categoryName)
    category.price= Number.parseFloat(price)
    localStorage.setItem("inventory",JSON.stringify(inventory))

    listCategoryPrices()
})

document.querySelector("#lowStockAlert").addEventListener("submit",e =>{
    e.preventDefault()
    const categoryName=document.querySelector("#categoriesForAlert").value
    const category=inventory.find(cat => cat.cName===categoryName)
    const lowStockAmount=document.querySelector("#alertAmount").value
    category.lowStockAlert=Number.parseFloat(lowStockAmount)

})

function alertStock(amount,threshold){
    amount=Number.parseFloat(amount)
    threshold=Number.parseFloat(threshold)
    if (amount<=threshold){
        return "STOCKS ARE LOW!"
    }
    else {
        return "Stocks are OK"
    }
}


handlePriceField()
listCategoryPrices()
listInventoryTracking()