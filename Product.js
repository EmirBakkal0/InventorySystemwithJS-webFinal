
class Category{
    constructor(kilograms,amount,price ) {
        this.kg=kilograms
        this.amount=amount
        this.price=price
    }




}

const Inventory=JSON.parse( localStorage.getItem("inventory")) ??
    [
        new Category(0.1,0,0),
        new Category(0.25,0,0),
        new Category(0.5,0,0),
        new Category(1,0,0),
        new Category(2,0,0),
        new Category(5,0,0)]



document.querySelector("#nonCatAmount").innerHTML=Inventory[0].totalkg

function listCategoryPrices(){

    Inventory.forEach()
}