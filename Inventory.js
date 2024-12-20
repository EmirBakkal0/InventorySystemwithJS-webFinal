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
const exportInventoryToCSV = () => {

    if (inventory.length === 0) {
        alert("There are no inventory to export!");
        return;
    }
    // CSV headings
    const headers = [
        "ID:",
        "Category",
        "Stock Level",
        "Total Kilos",
        "Reorder Level",
        "Restock Date",
        "Storage Location ",
        "Info"


    ];

    // CSV content
    const csvContent = [
        headers.join(","), // Başlık satırı
        ...inventory.map((category,index) =>
            [
                index+1,
                category.cName,
                category.amount,
                category.amount*category.kg,
                category.lowStockAlert,
                category.lastRestockingDate,
                "Warehouse",
                alertStock(category.amount,category.lowStockAlert)
            ].join(",")
        ),
    ].join("\n");

    // CSV create file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventory_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


displayInventoryTable()