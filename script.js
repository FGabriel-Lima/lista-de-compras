// --- SELEÇÃO DOS ELEMENTOS DO DOM ---
const shoppingList = document.getElementById('shopping-list');
const newItemInput = document.getElementById('new-item-input');
const addItemBtn = document.getElementById('add-item-btn');
const itemCounter = document.getElementById('item-counter');

// --- FUNÇÕES ---

/**
 * Atualiza a contagem de itens comprados e totais na tela.
 */
function updateCounter() {
    const totalItems = shoppingList.querySelectorAll('.list-item').length;
    const purchasedItems = shoppingList.querySelectorAll('.list-item.purchased').length;
    itemCounter.textContent = `Itens comprados: ${purchasedItems}/${totalItems}`;
}

/**
 * Cria e adiciona um novo item à lista.
 * @param {string} itemName - O nome do item a ser adicionado.
 */
function addNewItem(itemName) {
    if (!itemName) return; // Não adiciona se o nome estiver vazio

    // Cria os elementos do novo item
    const li = document.createElement('li');
    li.className = 'list-item';
    li.draggable = true; // Torna o item arrastável

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const span = document.createElement('span');
    span.className = 'item-name';
    span.textContent = itemName;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '&times;'; // Símbolo 'x' para remover

    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.textContent = '::';

    // Monta o item da lista
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(removeBtn);
    li.appendChild(dragHandle);

    // Adiciona o item à lista no DOM
    shoppingList.appendChild(li);

    // Limpa o campo de input e foca nele novamente
    newItemInput.value = '';
    newItemInput.focus();

    // Atualiza a contagem
    updateCounter();
}

/**
 * Manipula eventos de clique na lista (para marcar, desmarcar e remover).
 * Usa a delegação de eventos para eficiência.
 * @param {Event} e - O objeto do evento de clique.
 */
function handleListClick(e) {
    const target = e.target;

    // Se o clique foi na checkbox
    if (target.type === 'checkbox') {
        const item = target.closest('.list-item');
        item.classList.toggle('purchased');
        updateCounter();
    }
    
    // Se o clique foi no botão de remover
    if (target.classList.contains('remove-btn')) {
        const item = target.closest('.list-item');
        item.remove();
        updateCounter();
    }
}

/**
 * Encontra o elemento da lista sobre o qual o item está sendo arrastado.
 * @param {HTMLElement} container - O elemento da lista (UL).
 * @param {number} y - A posição vertical do mouse.
 * @returns {HTMLElement|null} - O elemento logo após a posição do mouse.
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.list-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// --- EVENT LISTENERS ---

// Adicionar item ao clicar no botão ou pressionar Enter
addItemBtn.addEventListener('click', () => addNewItem(newItemInput.value.trim()));
newItemInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addNewItem(newItemInput.value.trim());
    }
});

// Listener para cliques na lista (marcar/remover)
shoppingList.addEventListener('click', handleListClick);

// Listeners para a funcionalidade de Drag and Drop
shoppingList.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('list-item')) {
        e.target.classList.add('dragging');
    }
});

shoppingList.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('list-item')) {
        e.target.classList.remove('dragging');
    }
});

shoppingList.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessário para permitir o 'drop'
    const afterElement = getDragAfterElement(shoppingList, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (afterElement == null) {
        shoppingList.appendChild(dragging);
    } else {
        shoppingList.insertBefore(dragging, afterElement);
    }
});

