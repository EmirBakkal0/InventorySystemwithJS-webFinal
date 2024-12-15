document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const orderId = document.getElementById('order-id').value;
    const customerName = document.getElementById('customer-name').value;
    const customerContact = document.getElementById('customer-contact').value;
    const customerShipping = document.getElementById('customer-shipping').value;
    const productCategory = document.getElementById('product-category').value;
    const quantityOrdered = parseFloat(document.getElementById('quantity-ordered').value);
    const unitPrice = parseFloat(document.getElementById('unit-price').value);
    const orderStatus = document.getElementById('order-status').value;
    const totalPrice = quantityOrdered * unitPrice;

    const table = document.getElementById('orders-table').getElementsByTagName('tbody')[0];
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

    cell1.textContent = orderId;
    cell2.textContent = customerName;
    cell3.textContent = customerContact;
    cell4.textContent = customerShipping;
    cell5.textContent = productCategory;
    cell6.textContent = quantityOrdered;
    cell7.textContent = unitPrice;
    cell8.textContent = totalPrice;
    cell9.textContent = orderStatus;

    document.getElementById('order-form').reset();
    generateReport();
});

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
