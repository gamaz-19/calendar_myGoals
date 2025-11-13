const motivationalQuotes = [
    "Pequeños pasos llevan a grandes logros.",
    "Cree en ti, incluso cuando nadie más lo haga.",
    "Cada día es una nueva oportunidad para avanzar.",
    "El esfuerzo de hoy es el éxito de mañana.",
    "No tienes que ser perfecto, solo constante.",
    "Tus sueños no tienen fecha de caducidad.",
    "El único límite es el que tú te pongas.",
    "Cada meta alcanzada es un nuevo comienzo."
];

let goals = [];
let editingId = null;

function loadGoals() {
    const stored = localStorage.getItem('goals');
    if (stored) {
        goals = JSON.parse(stored);
    }
}

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

function displayRandomQuote() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivationQuote').textContent = `"${quote}"`;
}

function formatMoney(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function renderGoals() {
    const container = document.getElementById('goalsContainer');

    if (goals.length === 0) {
        container.innerHTML = '<div class="empty-state">No hay metas aún. ¡Agrega tu primera meta!</div>';
        return;
    }

    const sortedGoals = [...goals].sort((a, b) => new Date(a.date) - new Date(b.date));

    container.innerHTML = sortedGoals.map((goal, index) => {
        const missingMoney = goal.targetMoney - goal.savedMoney;
        const pastelClass = `pastel-${(index % 5) + 1}`;

        return `
                    <div class="goal-card ${pastelClass}">
                        <div class="goal-header">
                            <div class="goal-title">${goal.title}</div>
                            <div class="goal-date">${formatDate(goal.date)}</div>
                        </div>
                        
                        ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
                        
                        <div class="goal-money">
                            <div class="money-row">
                                <span class="money-label">💰 Ahorrado:</span>
                                <span class="money-value">${formatMoney(goal.savedMoney)}</span>
                            </div>
                            <div class="money-row">
                                <span class="money-label">🎯 Objetivo:</span>
                                <span class="money-value">${formatMoney(goal.targetMoney)}</span>
                            </div>
                            <div class="money-row">
                                <span class="money-label">📊 Falta:</span>
                                <span class="money-value money-missing">${formatMoney(missingMoney)}</span>
                            </div>
                        </div>
                        
                        <div class="goal-actions">
                            <button class="btn-edit" onclick="editGoal('${goal.id}')">Editar</button>
                            <button class="btn-delete" onclick="deleteGoal('${goal.id}')">Eliminar</button>
                        </div>
                    </div>
                `;
    }).join('');
}

function deleteGoal(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta meta?')) {
        goals = goals.filter(goal => goal.id !== id);
        saveGoals();
        renderGoals();
        displayRandomQuote();
    }
}

function editGoal(id) {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    document.getElementById('title').value = goal.title;
    document.getElementById('date').value = goal.date;
    document.getElementById('description').value = goal.description || '';
    document.getElementById('savedMoney').value = goal.savedMoney;
    document.getElementById('targetMoney').value = goal.targetMoney;

    editingId = id;

    const button = document.querySelector('.btn-add');
    button.textContent = 'Actualizar Meta';
    button.style.background = 'linear-gradient(135deg, #FADADD 0%, #FFB6C1 100%)';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('goalForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const goalData = {
        id: editingId || Date.now().toString(),
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        savedMoney: parseFloat(document.getElementById('savedMoney').value),
        targetMoney: parseFloat(document.getElementById('targetMoney').value)
    };

    if (editingId) {
        const index = goals.findIndex(g => g.id === editingId);
        goals[index] = goalData;
        editingId = null;

        const button = document.querySelector('.btn-add');
        button.textContent = 'Agregar Meta';
        button.style.background = 'linear-gradient(135deg, #B0E0A8 0%, #AEEEEE 100%)';
    } else {
        goals.push(goalData);
    }

    saveGoals();
    renderGoals();
    displayRandomQuote();
    this.reset();
});

loadGoals();
renderGoals();
displayRandomQuote();