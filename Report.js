//showFinanceTable("#reportTable")


function createCSV() {
    // Check if there's data to export
    if (inventory.length === 0 || sales.length === 0) {
        console.log("There are no data to export!");
        return;

    }
    let moneyEarnedFromSales=0
    let moneySpentOnRawBerrys=0
    const startDate=document.getElementById("start-date-r").value
    const endDate=document.getElementById("end-date-r").value
    document.querySelector("#csvTable caption").textContent=` Report ${startDate ? startDate : "..."} between ${endDate ? endDate : "..."}`


    const filteredSales=sales.filter(sale => isDateBetween(startDate,endDate,sale.sDate))
    const filteredPurchases=purchases.filter(p => isDateBetween(startDate,endDate,p.pDate))

    filteredSales.forEach(sale =>{
        moneyEarnedFromSales+=(Number.parseFloat(sale.pPrice)*Number.parseFloat(sale.pQuantity))
    })
    filteredPurchases.forEach(p =>{
        moneySpentOnRawBerrys+= p.calcTotalCost()
    })

    // Inventory CSV headings
    const inventoryHeaders = [
        "ID:",
        "Category",
        "Stock Level",
        "Total Kilos",
        "Reorder Level",
        "Restock Date",
        "Storage Location",
        "Number of Sales",
        "Info"
    ];
    const firstRow= [
        0,
        "Non Categorized",
        nonCategorizedBerryAmount.total.toFixed(2),
        nonCategorizedBerryAmount.total.toFixed(2) ,
        nonCategorizedBerryAmount.lowStockAlert,
        purchases[purchases.length-1].pDate,
        "Warehouse",
        "-",
        alertStock(nonCategorizedBerryAmount.total,0),
    ]

    // Inventory CSV content
    const inventoryContent = [
        inventoryHeaders.join(","), // Header row
        firstRow.join(","),
        ...inventory.map((category, index) =>
            [
                index + 1,
                category.cName,
                category.amount,
                category.amount * category.kg,
                category.lowStockAlert,
                category.lastRestockingDate,
                "Warehouse",
                noOfSaleByCategory[category.cName],
                alertStock(category.amount, category.lowStockAlert)
            ].join(",")
        )
    ].join("\n");

    // Financial CSV headings
    const financeHeaders = [
        "Money Earned from Sales (income&revenue)",
        "Money Spent on Raw Blueberries (expense)",
        "Profit without tax",
        "Tax(%18) of Revenue",
        "Net Profit"
    ];

    // Calculations for financial data
    const revenue = calcProfit(moneyEarnedFromSales, moneySpentOnRawBerrys);
    const tax = calcTax(moneyEarnedFromSales);

    // Financial CSV content
    const financeContent = [
        financeHeaders.join(","), // Header row
        [moneyEarnedFromSales, moneySpentOnRawBerrys, revenue, tax, (revenue - tax).toFixed(5)].join(",")
    ].join("\n");

    const date=`Report ${startDate} between  ${endDate}`
    // Combined CSV content
    const combinedCSVContent = [

        "Financial Data", // Title for financial data section
        financeContent,
        "Inventory Data", // Title for inventory data section
        inventoryContent,
        date
    ].join("\n");

    return combinedCSVContent;

}
function downloadCSV(csv){
    // Create CSV file
    if (!csv){
        alert("There's no purchases/sales have been made yet..")
        return
    }
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);


    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    const startDate=document.getElementById("start-date-r").value
    const endDate=document.getElementById("end-date-r").value
    link.setAttribute("download", "Report "+startDate+" "+endDate+".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



function displayCSVTable(csv) {
    try{
        const lines = csv.split('\n');
        const table = document.getElementById('csvTable');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Create table headers
        const headers = lines[0].split(',');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.trim();
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create table rows
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell.trim();
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }

    }catch (e){
        console.log(e)
    }

}

document.getElementById("reportForm").addEventListener("submit",e =>{
    e.preventDefault()
    downloadCSV(createCSV())
})
