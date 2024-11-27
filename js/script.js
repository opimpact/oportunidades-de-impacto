const SHEET_ID = '1gmacUawKXMZ6YmhNf_aWh2AsmZ469xTJZzrkAsYJoTQ';
const SHEET_NAME = 'Abertas';

function carregarDadosDaPlanilha() {
    const url = 'https://proxy-backend-production.up.railway.app/proxy-key';
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos:", data);
            if (data.values) {
                const rows = data.values;
                const tableBody = document.querySelector('#data-table tbody');
                tableBody.innerHTML = '';
                rows.slice(1).forEach(row => {
                    const newRow = tableBody.insertRow();
                    row.forEach((cell, index) => {
                        const newCell = newRow.insertCell(index);
                        if (index === 5) {
                            const link = document.createElement('a');
                            link.href = cell.startsWith('http') ? cell : `https://${cell}`;
                            link.textContent = 'Visitar';
                            link.target = '_blank';
                            newCell.appendChild(link);
                        } else {
                            newCell.textContent = cell;
                        }
                    });
                });
            }
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

function sortTable(columnIndex, type) {
    const table = document.getElementById("data-table");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    let direction = 1;

    if (table.dataset.sortedColumn == columnIndex) {
        direction = -1 * table.dataset.sortedDirection;
    }
    
    table.dataset.sortedColumn = columnIndex;
    table.dataset.sortedDirection = direction;

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex].textContent.trim();
        const cellB = rowB.cells[columnIndex].textContent.trim();

        if (type === "date") {
            const dateA = new Date(cellA.split("/").reverse().join("-"));
            const dateB = new Date(cellB.split("/").reverse().join("-"));
            return direction * (dateA - dateB);
        } else {
            return direction * cellA.localeCompare(cellB);
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

document.addEventListener('DOMContentLoaded', carregarDadosDaPlanilha);
