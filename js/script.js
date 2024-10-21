const API_KEY = 'AIzaSyC2BsbtDR6FNB8kHSr0oZ88TLaeDBppOGM'; // Substitua pela sua API Key
const SHEET_ID = '1gmacUawKXMZ6YmhNf_aWh2AsmZ469xTJZzrkAsYJoTQ'; // ID da sua planilha
const SHEET_NAME = 'abertas'; // Nome exato da aba

document.addEventListener('DOMContentLoaded', function () {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.values) {
                const rows = data.values;
                const tableBody = document.querySelector('#data-table tbody');

                // Limpa a tabela antes de inserir novos dados
                tableBody.innerHTML = '';

                // Adiciona cada linha da planilha na tabela
                rows.slice(1).forEach(row => {
                    const newRow = tableBody.insertRow();
                    row.forEach((cell, index) => {
                        const newCell = newRow.insertCell(index);
                        if (index === 4) {
                            // Se for a coluna de link, faça ela clicável com o texto "Visitar"
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
            } else {
                console.error('Nenhum dado encontrado na planilha.');
            }
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
});
