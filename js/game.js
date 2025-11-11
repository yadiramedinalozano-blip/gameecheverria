document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('start-btn');
  if (btn) btn.addEventListener('click', () => {
    window.location.href = 'personaje.html';
  });
});
