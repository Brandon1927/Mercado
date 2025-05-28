// Cargar todos los productos del usuario
async function loadProducts() {
  const res = await fetch('/products');
  const products = await res.json();
  const table = document.getElementById('productTable');
  table.innerHTML = '';

  products.forEach(prod => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', prod._id);
    row.innerHTML = `
      <td><input type="checkbox" class="selectProduct" value="${prod._id}"></td>
      <td class="name">${prod.name}</td>
      <td class="quantity">${prod.quantity}</td>
      <td class="price">${prod.price}</td>
    `;
    table.appendChild(row);
  });
}

// Agregar producto
document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const quantity = document.getElementById('quantity').value;
  const price = document.getElementById('price').value;

  await fetch('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity, price })
  });

  e.target.reset();
  loadProducts();
});

// Obtener IDs seleccionados
function getSelectedIds() {
  return Array.from(document.querySelectorAll('.selectProduct:checked')).map(c => c.value);
}

// Obtener fila por ID
function getRowById(id) {
  return document.querySelector(`tr[data-id="${id}"]`);
}

// Editar producto
async function editSelected() {
  const selected = getSelectedIds();
  if (selected.length !== 1) {
    return alert('Selecciona solo un producto para editar.');
  }

  const id = selected[0];
  const row = getRowById(id);

  const currentName = row.querySelector('.name').textContent;
  const currentQuantity = row.querySelector('.quantity').textContent;
  const currentPrice = row.querySelector('.price').textContent;

  const name = prompt('Nuevo nombre:', currentName);
  const quantity = prompt('Nueva cantidad:', currentQuantity);
  const price = prompt('Nuevo precio:', currentPrice);

  if (name && quantity && price) {
    await fetch(`/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity, price })
    });
    loadProducts();
  }
}

// Ver producto seleccionado
function viewSelected() {
  const selected = getSelectedIds();
  if (selected.length !== 1) {
    return alert('Selecciona solo un producto para ver.');
  }

  const row = getRowById(selected[0]);
  const name = row.querySelector('.name').textContent;
  const quantity = row.querySelector('.quantity').textContent;
  const price = row.querySelector('.price').textContent;

  alert(`📦 Producto: ${name}\nCantidad: ${quantity}\nPrecio: ${price}`);
}

// Eliminar productos seleccionados
async function deleteSelected() {
  const selected = getSelectedIds();
  if (selected.length === 0) {
    return alert('Selecciona al menos un producto.');
  }

  if (!confirm(`¿Eliminar ${selected.length} producto(s)?`)) return;

  for (const id of selected) {
    await fetch(`/products/${id}`, { method: 'DELETE' });
  }
  loadProducts();
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('/logout', { method: 'POST' });
    if (res.ok) {
      alert('Sesión cerrada correctamente');
      window.location.href = '/index.html'; // o la página de login que uses
    } else {
      alert('Error al cerrar sesión');
    }
  } catch (err) {
    alert('Error al conectar con el servidor');
  }
});

// Botón "Ver todos mis productos"
document.getElementById('viewAll').addEventListener('click', loadProducts);

// Inicial
loadProducts();
