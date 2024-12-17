
const money=JSON.parse( localStorage.getItem("money")) ?? {amount:10000}

document.getElementById("money").innerHTML=money.amount


class Sale{
    constructor({ sID, cName, cContact, cShipping, pCategory, pQuantity, pPrice, sStatus }) {
        Object.assign(this, { sID, cName, cContact, cShipping, pCategory, pQuantity, pPrice, sStatus });
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

    const sale= {
        sID:orderId,
        cName: customerName,
        cContact: customerContact,
        cShipping: customerShipping,
        pCategory: productCategory,
        pQuantity: quantityOrdered,
        pPrice: unitPrice,
        sStatus: orderStatus,
    }
    sales.push(new Sale(sale))
    localStorage.setItem("sales",JSON.stringify(sales))
    money.amount+= totalPrice
    document.getElementById("money").innerHTML=money.amount
    localStorage.setItem("money",JSON.stringify(money))

    displaySalesTable()

});


function displaySalesTable(){
    const table = document.querySelector("#orders-table tbody")

    sales.forEach(sale => {
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

        cell1.textContent = sale.sID;
        cell2.textContent = sale.cName;
        cell3.textContent = sale.cContact;
        cell4.textContent = sale.cShipping;
        cell5.textContent = sale.pCategory;
        cell6.textContent = sale.pQuantity;
        cell7.textContent = sale.pPrice;
        cell8.textContent = sale.pPrice*sale.pQuantity;
        cell9.textContent = sale.sStatus;

    })

    //generateReport();
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

displaySalesTable()