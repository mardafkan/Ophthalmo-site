
let orderModal;
document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('orderModal');
  orderModal = new bootstrap.Modal(modalEl);
  const form = document.getElementById('orderForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    document.getElementById('formStatus').textContent = 'Отправка...';
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Ошибка отправки');
      document.getElementById('formStatus').textContent = 'Заявка отправлена! Мы свяжемся с вами.';
      form.reset();
      setTimeout(() => orderModal.hide(), 1500);
    } catch (err) {
      document.getElementById('formStatus').textContent = 'Не удалось отправить заявку. Попробуйте позже.';
    }
  });
});

function openOrderModal(productName) {
  document.getElementById('productField').value = productName;
  orderModal.show();
}
