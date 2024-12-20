
function calcRevenue(sales,spent){
    return sales-spent
}
const calcTax = money => money*0.18

function showFinanceTable(tableid){
    let moneyEarnedFromSales=0
    let moneySpentOnRawBerrys=0
    sales.forEach(sale =>{
        moneyEarnedFromSales+=(Number.parseFloat(sale.pPrice)*Number.parseFloat(sale.pQuantity))
    })
    purchases.forEach(p =>{
        moneySpentOnRawBerrys+= p.calcTotalCost()
    })
    const table=document.querySelector(tableid+" tbody")
    const revenue=calcRevenue(moneyEarnedFromSales,moneySpentOnRawBerrys)
    const tax=calcTax(revenue)

    const row=document.createElement("tr")


    row.innerHTML=`
        <th> ${moneyEarnedFromSales} </th>
        <th> ${moneySpentOnRawBerrys} </th>
        <th>${revenue} </th>
        <th>${tax.toFixed(2)}</th>
        <th>${(revenue-tax).toFixed(2)}</th>
    `
    table.appendChild(row)

}

showFinanceTable("#financeTable")


const exportFinanceToCSV = () => {
    let moneyEarnedFromSales=0
    let moneySpentOnRawBerrys=0
    sales.forEach(sale =>{
        moneyEarnedFromSales+=(Number.parseFloat(sale.pPrice)*Number.parseFloat(sale.pQuantity))
    })
    purchases.forEach(p =>{
        moneySpentOnRawBerrys+= p.calcTotalCost()
    })

    if (sales.length === 0 || inventory.length === 0) {
        alert("There are no sales to export!");
        return;
    }
    const revenue=calcRevenue(moneyEarnedFromSales,moneySpentOnRawBerrys)
    const tax=calcTax(revenue)

    // CSV headings
    const headers = [
        "Money Earned from sales",
        "Money Spent on Raw Blueberries",
        "Revenue",
        "Tax(%18) of revenue",
        "Net Profit",


    ];

    // CSV content
    const csvContent = [
        headers.join(","), // Başlık satırı
        [moneyEarnedFromSales,moneySpentOnRawBerrys,revenue,tax,(revenue-tax).toFixed(5)].join(",")
        ,
    ].join("\n");

    // CSV create file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "financial_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};