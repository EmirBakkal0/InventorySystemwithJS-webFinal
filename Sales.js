
const money=JSON.parse( localStorage.getItem("money")) ?? {amount:10000}

document.getElementById("money").innerHTML=money.amount


class Sale{
    constructor({ sID, cName, cContact, cShipping, pCategory, pQuantity, pPrice, sStatus, sDate }) {
        Object.assign(this, { sID, cName, cContact, cShipping, pCategory, pQuantity, pPrice, sStatus, sDate });
    }
}


const salesJson= JSON.parse(localStorage.getItem("sales")) ?? []

const sales= salesJson.map(sale => new Sale(sale))



document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const orderId = document.getElementById('order-id').value;
    if (sales.find((sale) => sale.sID === orderId) ){ // if the crs already exists
        alert("There's already a sale with the same ID..")
        return
    }
    const customerName = document.getElementById('customer-name').value;
    const customerContact = document.getElementById('customer-contact').value;
    const customerShipping = document.getElementById('customer-shipping').value;
    const productCategory = document.getElementById('product-category').value;
    const quantityOrdered = parseFloat(document.getElementById('quantity-ordered').value);
    const unitPrice = parseFloat(document.getElementById('unit-price').value);
    const orderStatus = document.getElementById('order-status').value;
    const totalPrice = quantityOrdered * unitPrice;

    const saleDate=document.getElementById("order-date").value;

    const category=inventory.find(cat => cat.cName===productCategory)
    console.log(category)
    if(quantityOrdered > category.amount){
        alert("There is not enough product in the inventory..")
        return
    }

    const sale= {
        sID:orderId,
        cName: customerName,
        cContact: customerContact,
        cShipping: customerShipping,
        pCategory: productCategory,
        pQuantity: quantityOrdered,
        pPrice: unitPrice,
        sStatus: orderStatus,
        sDate: saleDate
    }
    sales.push(new Sale(sale))
    localStorage.setItem("sales",JSON.stringify(sales))
    money.amount+= totalPrice
    category.amount= Number.parseFloat(category.amount) - quantityOrdered ;
    localStorage.setItem("inventory",JSON.stringify(inventory))
    listInventoryTracking()

    document.getElementById("money").innerHTML=money.amount
    localStorage.setItem("money",JSON.stringify(money))

    displaySalesTable()

});

function renderSalesTable(table,sale) {

    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);
    const cell7 = newRow.insertCell(6);
    const cell8 = newRow.insertCell(7);
    const cell9 = newRow.insertCell(8);
    const cell10 = newRow.insertCell(9);

    cell1.textContent = sale.sID;
    cell2.textContent = sale.sDate;
    cell3.textContent = sale.cName;
    cell4.textContent = sale.cContact;
    cell5.textContent = sale.cShipping;
    cell6.textContent = sale.pCategory;
    cell7.textContent = sale.pQuantity;
    cell8.textContent = sale.pPrice;
    cell9.textContent = sale.pPrice * sale.pQuantity;
    cell10.textContent = sale.sStatus;

}

function displaySalesTable(){
    const table = document.querySelector("#orders-table tbody")
    table.innerHTML=""
    sales.forEach(sale => renderSalesTable(table,sale))

    //generateReport();
}

function displaySalesTableByStatus(){
    const status=document.getElementById("l-order-status").value

    if (status!=="all"){

        const table = document.querySelector("#orders-table tbody")
        table.innerHTML=""

        sales.filter(sale => sale.sStatus === status).forEach(sale => renderSalesTable(table,sale))
    }
    else {
        displaySalesTable()
    }
}



function displaySalesTableByCategory(){
    const category = document.getElementById("l-product-category").value
    if (category !== "all"){
        const table = document.querySelector("#orders-table tbody")
        table.innerHTML=""

        sales.filter(sale => sale.pCategory === category).forEach(sale => renderSalesTable(table,sale) )

    }
    else{
        displaySalesTable()
    }
}

document.getElementById("listByCustomer").addEventListener("submit", e =>{
    e.preventDefault() // this whole ordeal is here because otherwise when you press enter while searching a customer name
    // the page will reload
})
function displaySalesTableByCustomer(){
    const name= document.getElementById("l-customer-name").value
    const table = document.querySelector("#orders-table tbody")
    table.innerHTML=""
    sales.filter(sale => sale.cName.toLowerCase().includes(name.toLowerCase()) ).forEach( sale => renderSalesTable(table,sale))


}

function generateReport() {
    const table = document.getElementById('orders-table').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    let totalRevenue = 0;
    let salesByCategory = {};

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const category = cells[4].textContent;
        const totalPrice = parseFloat(cells[7].textContent);

        totalRevenue += totalPrice;

        if (!salesByCategory[category]) {
            salesByCategory[category] = 0;
        }
        salesByCategory[category] += totalPrice;
    }

    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = `
        <h3>Total Revenue: $${totalRevenue.toFixed(2)}</h3>
        <h4>Revenue by Category:</h4>
        <ul>
            ${Object.keys(salesByCategory).map(category => `<li>${category}: $${salesByCategory[category].toFixed(2)}</li>`).join('')}
        </ul>
    `;
}

function handleEditField(){
    const sID=document.querySelector("#e-order-id").value
    const sale=sales.find(sale => sale.sID=== sID)
    if (!sale){
        document.getElementById("e-customer-name").value=""
        document.getElementById("e-customer-contact").value=""
        document.getElementById("e-customer-shipping").value=""
        document.getElementById("e-order-status").value=""
    }
    document.getElementById("e-customer-name").value=sale.cName
    document.getElementById("e-customer-contact").value=sale.cContact
    document.getElementById("e-customer-shipping").value=sale.cShipping
    document.getElementById("e-order-status").value=sale.sStatus
}


document.querySelector("#editSaleForm").addEventListener("submit", e =>{
    e.preventDefault()
    const saleID= document.getElementById("e-order-id").value
    console.log(saleID)
    const customerName = document.getElementById('e-customer-name').value;
    const customerContact = document.getElementById('e-customer-contact').value;
    const customerShipping = document.getElementById('e-customer-shipping').value;
    const orderStatus = document.getElementById('e-order-status').value;

    const sale = sales.find(sale => sale.sID===saleID)

    sale.cName=customerName
    sale.cContact=customerContact
    sale.cShipping=customerShipping
    sale.sStatus=orderStatus


    localStorage.setItem("sales",JSON.stringify(sales))
    displaySalesTable()
})

displaySalesTable()