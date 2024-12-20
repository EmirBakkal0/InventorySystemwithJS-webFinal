
let moneyEarnedFromSales=0
let moneySpentOnRawBerrys=0
sales.forEach(sale =>{
    moneyEarnedFromSales+=(Number.parseFloat(sale.pPrice)*Number.parseFloat(sale.pQuantity))
})

purchases.forEach(p =>{
    moneySpentOnRawBerrys+= p.calcTotalCost()
})

function calcRevenue(sales,spent){
    return sales-spent
}
const calcTax = money => money*0.18

console.log(moneyEarnedFromSales)
function showFinanceTable(){
    const table=document.querySelector("#financeTable tbody")
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

showFinanceTable()