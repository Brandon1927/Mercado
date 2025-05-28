const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', function () {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    // Cambiar el ícono (ojo abierto / cerrado)
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});