function displayInventoryTable(){
    const table=document.querySelector("#inventoryTrackingTable2 tbody")
    table.innerHTML=""
    console.log(nonCategorizedBerryAmount)
    const firstRow=document.createElement("tr")
    firstRow.innerHTML=`
            <th>0</th>
            <th>Non Categorized</th>
            <th>${nonCategorizedBerryAmount.total.toFixed(2)}</th>
            <th>${nonCategorizedBerryAmount.total.toFixed(2)} </th>
            <th>${nonCategorizedBerryAmount.lowStockAlert}</th>
            <th>${purchases[purchases.length-1].pDate}</th>
            <th>Warehouse</th>
            <th>${alertStock(nonCategorizedBerryAmount.total,0)}</th>
    `
    table.appendChild(firstRow)


    inventory.forEach((category , index) => {
        const row = document.createElement("tr")
        row.innerHTML=`
            <th>${index+1}</th>
            <th>${category.cName}</th>
            <th>${category.amount}</th>
            <th>${category.amount*category.kg} </th>
            <th>${category.lowStockAlert}</th>
            <th>${category.lastRestockingDate}</th>
            <th>Warehouse</th>
            <th>${alertStock(category.amount,category.lowStockAlert)}</th>
           `
        table.appendChild(row)
    })
}

displayInventoryTable()