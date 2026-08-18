/* North Star Bakery — Products page
   Lets a visitor build a running pre-order list without leaving the
   page, then carries that list over to the Contact & Pre-Order form
   using localStorage. */

const PREORDER_KEY = 'nsbPreOrderItems';

// Array of objects: one entry per distinct product, tracking how many
// times it has been added to the pre-order list.
let preOrderItems = getStoredJSON(PREORDER_KEY, []);

function addItemToOrder(name) {
  const existing = preOrderItems.find(function (item) {
    return item.name === name;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    preOrderItems.push({ name: name, qty: 1 });
  }

  saveOrder();
  renderOrderList();
}

function removeAllOfItem(name) {
  preOrderItems = preOrderItems.filter(function (item) {
    return item.name !== name;
  });
  saveOrder();
  renderOrderList();
}

function clearOrder() {
  preOrderItems = [];
  saveOrder();
  renderOrderList();
}

function saveOrder() {
  setStoredJSON(PREORDER_KEY, preOrderItems);
}

function renderOrderList() {
  const list = document.getElementById('order-list');
  const emptyMessage = document.getElementById('order-empty-message');
  const countBadge = document.getElementById('order-count');

  if (!list) return;

  list.innerHTML = '';

  if (preOrderItems.length === 0) {
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;

    preOrderItems.forEach(function (item) {
      const li = document.createElement('li');
      li.className = 'preorder-item';

      const label = document.createElement('span');
      label.textContent = item.name + ' (x' + item.qty + ')';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'preorder-remove';
      removeBtn.textContent = 'Remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + item.name + ' from pre-order list');
      removeBtn.addEventListener('click', function () {
        removeAllOfItem(item.name);
      });

      li.appendChild(label);
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }

  const totalCount = preOrderItems.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);

  if (countBadge) countBadge.textContent = totalCount;
}

function setUpAddButtons() {
  const buttons = document.querySelectorAll('.add-to-order');
  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      addItemToOrder(button.dataset.item);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  setUpAddButtons();
  renderOrderList();

  const clearButton = document.getElementById('clear-order');
  if (clearButton) {
    clearButton.addEventListener('click', clearOrder);
  }
});
