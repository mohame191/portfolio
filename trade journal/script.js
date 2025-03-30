
let trades = JSON.parse(localStorage.getItem('trades')) || [];
const tradeForm = document.getElementById('tradeForm');
const tradeTableBody = document.querySelector('#tradeTable tbody');
const totalTradesEl = document.getElementById('totalTrades');
const winRateEl = document.getElementById('winRate');
const totalPLEl = document.getElementById('totalPL');
const darkModeToggle = document.getElementById('darkModeToggle');
const performanceChartCtx = document.getElementById('performanceChart').getContext('2d');
let performanceChart; 
function saveTrades() {
  localStorage.setItem('trades', JSON.stringify(trades));
}

function calculatePL(trade) {
  const entry = parseFloat(trade.entryPrice);
  const exit = parseFloat(trade.exitPrice);
  const qty = parseFloat(trade.quantity);
  if (trade.tradeType === 'Buy') {
    return (exit - entry) * qty;
  } else {
    return (entry - exit) * qty;
  }
}

function renderTrades() {
  tradeTableBody.innerHTML = '';
  trades.forEach((trade, index) => {
    const tr = document.createElement('tr');
    const profitLoss = calculatePL(trade).toFixed(2);
    tr.innerHTML = `
      <td>${trade.tradeDate}</td>
      <td>${trade.asset}</td>
      <td>${trade.tradeType}</td>
      <td>${parseFloat(trade.entryPrice).toFixed(2)}</td>
      <td>${parseFloat(trade.exitPrice).toFixed(2)}</td>
      <td>${parseFloat(trade.quantity).toFixed(2)}</td>
      <td>${profitLoss}</td>
      <td>${trade.notes}</td>
      <td>
        <button class="action-btn delete-btn" data-index="${index}">Delete</button>
      </td>
    `;
    tradeTableBody.appendChild(tr);
  });
}

function updateAnalytics() {
  const total = trades.length;
  let wins = 0;
  let totalPL = 0;
  let cumulativePL = [];
  trades.forEach((trade, index) => {
    const pl = calculatePL(trade);
    totalPL += pl;
    if (pl > 0) wins++;
    cumulativePL.push(totalPL);
  });
  totalTradesEl.textContent = total;
  winRateEl.textContent = total ? ((wins / total) * 100).toFixed(2) + '%' : '0%';
  totalPLEl.textContent = totalPL.toFixed(2);
  updateChart(cumulativePL);
}

function updateChart(dataPoints) {
  const labels = dataPoints.map((_, i) => i + 1);
  if (performanceChart) {
    performanceChart.data.labels = labels;
    performanceChart.data.datasets[0].data = dataPoints;
    performanceChart.update();
  } else {
    performanceChart = new Chart(performanceChartCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cumulative P/L',
          data: dataPoints,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        scales: {
          x: {
            title: { display: true, text: 'Trade Number' }
          },
          y: {
            title: { display: true, text: 'Cumulative P/L' }
          }
        }
      }
    });
  }
}

function renderAll() {
  renderTrades();
  updateAnalytics();
}

function deleteTrade(index) {
  trades.splice(index, 1);
  saveTrades();
  renderAll();
}

tradeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const trade = {
    tradeDate: document.getElementById('tradeDate').value,
    asset: document.getElementById('asset').value.trim(),
    tradeType: document.getElementById('tradeType').value,
    entryPrice: document.getElementById('entryPrice').value,
    exitPrice: document.getElementById('exitPrice').value,
    quantity: document.getElementById('quantity').value,
    notes: document.getElementById('notes').value.trim()
  };
  trades.push(trade);
  saveTrades();
  renderAll();
  tradeForm.reset();
});

tradeTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    deleteTrade(index);
  }
});

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  darkModeToggle.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
});

renderAll();
