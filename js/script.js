const SHEET_ID = '1gmacUawKXMZ6YmhNf_aWh2AsmZ469xTJZzrkAsYJoTQ'; // ID da sua planilha
const SHEET_NAME = 'Abertas'; // Nome exato da aba

// Função para carregar dados da planilha
function carregarDadosDaPlanilha(apiKey) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados da planilha recebidos:", data);

            if (data.values) {
                const rows = data.values;
                const tableBody = document.querySelector('#data-table tbody');

                if (!tableBody) {
                    console.error("Elemento da tabela não encontrado. Verifique o HTML.");
                    return;
                }

                // Limpa a tabela antes de inserir novos dados
                tableBody.innerHTML = '';

                // Adiciona cada linha da planilha na tabela
                rows.slice(1).forEach(row => {
                    const newRow = tableBody.insertRow();

                    // Adiciona cada célula da linha
                    row.forEach((cell, index) => {
                        const newCell = newRow.insertCell(index);

                        // Coluna de links (Site)
                        if (index === 5) { // Ajusta para o índice correto do link
                            const link = document.createElement('a');
                            link.href = cell.startsWith('http') ? cell : `https://${cell}`;
                            link.textContent = 'Visitar';
                            link.target = '_blank'; // Abre o link em uma nova aba
                            newCell.appendChild(link);
                        } else {
                            newCell.textContent = cell;
                        }
                    });
                });
                console.log("Tabela atualizada com sucesso!");
            } else {
                console.error('Nenhum dado encontrado na planilha.');
            }
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

// Função para ordenar a tabela
function sortTable(columnIndex, type) {
    const table = document.getElementById("data-table");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    let direction = 1;

    // Verificar se a tabela já está em ordem crescente ou decrescente
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

    // Atualiza a tabela com as linhas ordenadas
    rows.forEach(row => tbody.appendChild(row));
}

// Chamar a função quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', carregarDadosDaPlanilha);
