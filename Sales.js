
const money=JSON.parse( localStorage.getItem("money")) ?? {amount:10000}

document.getElementById("money").innerHTML=money.amount

class Sale{
    constructor({ sID, cName, cContact, cShipping, pCategory, pQuantity, pPrice, sStatus, sDate ,cKG }) {
        Object.assign(this, { sID, cName, cContact, cShipping, pCategory, pQuantity, pPrice, sStatus, sDate, cKG });
    }
    pricePerKg(){
        return this.pPrice *1/this.cKG
    }
    calcRevenue(){
        return (this.pricePerKg()-avgPriceOfBerry) * (this.pQuantity*this.cKG)
    }
///// revenue means profit ok there's been a misunderstanding
    calcRevenueWithTax(){
        return this.calcRevenue()*0.82
    }

    calcEarnedFromSales(){
        return this.pricePerKg() * (this.pQuantity*this.cKG)
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

    const category=inventory.find(cat => cat.cName===productCategory)
    const unitPrice = category.price
    const categoryKG= category.kg



    const orderStatus = document.getElementById('order-status').value;
    const totalPrice = quantityOrdered * unitPrice;

    const saleDate=document.getElementById("order-date").value;

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
        sDate: saleDate,
        cKG: categoryKG
    }
    sales.push(new Sale(sale))
    localStorage.setItem("sales",JSON.stringify(sales))
    money.amount+= totalPrice * 0.82 /// %18 tax
    category.amount= Number.parseFloat(category.amount) - quantityOrdered ;
    localStorage.setItem("inventory",JSON.stringify(inventory))
    listInventoryTracking()

    document.getElementById("money").innerHTML=money.amount
    localStorage.setItem("money",JSON.stringify(money))

    displaySalesTable()
});

let salesChart;

function renderSalesTable(table,sale) {
    const newRow = table.insertRow();
    const cellValues = [
        sale.sID, sale.sDate, sale.cName, sale.cContact,
        sale.cShipping, sale.pCategory, sale.pQuantity,
        sale.pPrice, sale.pPrice * sale.pQuantity, sale.sStatus, sale.pricePerKg(),sale.calcEarnedFromSales().toFixed(2),sale.calcRevenue().toFixed(2)
    ];

    cellValues.forEach((value, index) => {
        const cell = newRow.insertCell(index);
        cell.textContent = value;
    });

}

function displaySalesTable(){
    const table = document.querySelector("#orders-table tbody")
    table.innerHTML=""
    sales.forEach(sale => renderSalesTable(table,sale))
    generateReport()
    renderChart()

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
let noOfSaleByCategory={}

function generateReport() {

    let totalRevenue = 0;
    let salesByCategory = {};
    noOfSaleByCategory={}
    sales.forEach(sale =>{
        const rev=Number.parseFloat(sale.calcEarnedFromSales())
        totalRevenue+=rev
        if (!salesByCategory[sale.pCategory]) {
            salesByCategory[sale.pCategory] = 0;
        }
        if (!noOfSaleByCategory[sale.pCategory]) {
            noOfSaleByCategory[sale.pCategory] = 0;
        }

        salesByCategory[sale.pCategory] +=rev
        noOfSaleByCategory[sale.pCategory] +=1
    })
    // localStorage.setItem("salesByCategory",JSON.stringify(salesByCategory))
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = `
        <h3>Total Sales: ${sales.length}</h3>
        <h3>Total Revenue: $${totalRevenue.toFixed(2)}</h3>
        <h3>Total Revenue with tax: $${totalRevenue.toFixed(2)*0.82}</h3>
        <h2>Revenue by Category:</h2>
        <ul>
            ${Object.keys(salesByCategory).map(category => `<li><b>${category}: </b>  Number Of Sales:${noOfSaleByCategory[category]}
            Revenue: $${salesByCategory[category].toFixed(2)}
            Revenue With Tax: $${(salesByCategory[category]*0.82).toFixed(2)}</li>`).join('')}
        </ul>
    `;
    renderChart()

}

function exportSalesToCSV() {
    const salesByCategory = {};
    const noOfSaleByCategory = {};
    let totalRevenue = 0;

    sales.forEach(sale => {
        const rev = Number.parseFloat(sale.calcEarnedFromSales());
        totalRevenue += rev;

        if (!salesByCategory[sale.pCategory]) {
            salesByCategory[sale.pCategory] = 0;
        }
        if (!noOfSaleByCategory[sale.pCategory]) {
            noOfSaleByCategory[sale.pCategory] = 0;
        }

        salesByCategory[sale.pCategory] += rev;
        noOfSaleByCategory[sale.pCategory] += 1;
    });

    const total=[

        "Total  Sales:"+ sales.length,
    "Total Revenue: $"+ totalRevenue.toFixed(2),
    "Total Revenue with tax:"+ (totalRevenue.toFixed(2)*0.82),
    ]

    // CSV headers
    const headers = [
        "Category", "Number Of Sales", "Revenue", "Revenue With Tax"
    ];

    // CSV content
    const csvContent = [
        total.join(","),
        headers.join(","), // Header row
        ...Object.keys(salesByCategory).map(category =>
            [
                category, noOfSaleByCategory[category],
                salesByCategory[category].toFixed(2),
                (salesByCategory[category] * 0.82).toFixed(2)
            ].join(",")
        )
    ].join("\n");

    // Create CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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


function renderChart(){
    if (salesChart) {
        salesChart.destroy();
    }
    const categories = [];
    const revenues = [];
    sales.forEach(sale => {
        if (categories.includes(sale.pCategory)) {
            revenues[categories.indexOf(sale.pCategory)] += sale.calcEarnedFromSales();
        } else {
            categories.push(sale.pCategory);
            revenues.push(sale.calcEarnedFromSales());
        }
    });
    const ctx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(ctx, {
        type: 'bar', // Change this to 'pie' for a pie chart
        data: {
            labels: categories,
            datasets: [{
                label: 'Revenue by Category',
                data: revenues,
                backgroundColor: 'rgba(129,8,23,0.84)',
                borderColor: 'rgba(255,15,53,0.84)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true
                }
            }
        }
    });
}

