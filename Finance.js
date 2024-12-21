
function calcProfit(sales, spent){
    return sales-spent
}
const calcTax = money => money*0.18 //TODO: negatifken ayarla devlet bize geri vergi vermicek sonucta sjfhaes

/*function calcTax(money){
    if (money<0){
        return 0
    }
    else {
        return money*0.18
    }
}*/

document.getElementById("financeForm").addEventListener("submit", e =>{
    e.preventDefault()
    exportFinanceToCSV()
})

function getFinancialAnalysys(){
    let moneyEarnedFromSales=0
    let moneySpentOnRawBerrys=0

    const startDate=document.getElementById("start-date-fi").value
    const endDate=document.getElementById("end-date-fi").value
    const caption=document.querySelector("#financeTable caption").textContent=`Financal Report ${startDate ? startDate : "..."} between ${endDate ? endDate : "..."}`


    const filteredSales=sales.filter(sale => isDateBetween(startDate,endDate,sale.sDate))
    const filteredPurchases=purchases.filter(p => isDateBetween(startDate,endDate,p.pDate))

    filteredSales.forEach(sale =>{
        moneyEarnedFromSales+=(Number.parseFloat(sale.pPrice)*Number.parseFloat(sale.pQuantity))
    })
    filteredPurchases.forEach(p =>{
        moneySpentOnRawBerrys+= p.calcTotalCost()
    })
    return [moneyEarnedFromSales,moneySpentOnRawBerrys]
}

function showFinanceTable(){
    const [ moneyEarnedFromSales,moneySpentOnRawBerrys]= getFinancialAnalysys()
    const table=document.querySelector("#financeTable tbody")
    table.innerHTML=""
    const profit=calcProfit(moneyEarnedFromSales,moneySpentOnRawBerrys)
    const tax=calcTax(moneyEarnedFromSales)

    const row=document.createElement("tr")


    row.innerHTML=`
        <th> ${moneyEarnedFromSales} </th>
        <th> ${moneySpentOnRawBerrys} </th>
        <th>${profit} </th>
        <th>${tax.toFixed(2)}</th>
        <th>${(profit-tax).toFixed(2)}</th>
    `
    table.appendChild(row)

}


const exportFinanceToCSV = () => {
    const [ moneyEarnedFromSales,moneySpentOnRawBerrys]= getFinancialAnalysys()


    // if (filteredSales.length === 0 || filteredPurchases.length === 0) {
    //     alert("Please enter valid dates. There are no sales to export!");
    //     return;
    // }
    const profit=calcProfit(moneyEarnedFromSales,moneySpentOnRawBerrys)
    const tax=calcTax(moneyEarnedFromSales)

    // CSV headings
    const headers = [
        "Money Earned from sales",
        "Money Spent on Raw Blueberries",
        "Profit",
        "Tax(%18) of income",
        "Net Profit",


    ];

    // CSV content
    const csvContent = [
        headers.join(","), // Başlık satırı
        [moneyEarnedFromSales,moneySpentOnRawBerrys,profit,tax,(profit-tax).toFixed(5)].join(",")
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