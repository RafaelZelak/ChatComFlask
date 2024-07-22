document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll(".step");
    const progressIndicators = document.querySelectorAll(".progress-indicator");
    let currentStep = 0;

    function showStep(step) {
        steps.forEach((step, index) => {
            step.classList.toggle("hidden", index !== currentStep);
        });
        progressIndicators.forEach((indicator, index) => {
            if (index < currentStep) {
                indicator.classList.add("bg-purple-500", "text-white");
                indicator.classList.remove("bg-gray-200", "text-gray-400", "border-gray-200");
            } else if (index === currentStep) {
                indicator.classList.add("border-purple-500", "text-white-500");
                indicator.classList.remove("bg-gray-200", "text-gray-400", "bg-purple-500", "text-white");
            } else {
                indicator.classList.add("bg-gray-200", "text-gray-400", "border-gray-200");
                indicator.classList.remove("bg-purple-500", "text-white", "border-purple-500", "text-purple-500");
            }
        });
    }

    document.querySelectorAll(".next-step").forEach(button => {
        button.addEventListener("click", () => {
            currentStep = Math.min(currentStep + 1, steps.length - 1);
            showStep(currentStep);
        });
    });

    document.querySelectorAll(".prev-step").forEach(button => {
        button.addEventListener("click", () => {
            currentStep = Math.max(currentStep - 1, 0);
            showStep(currentStep);
        });
    });

    showStep(currentStep);
});
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const passwordStrength = document.getElementById('password-strength');
    const passwordMatch = document.getElementById('password-match');

    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const strength = getPasswordStrength(password);
      updatePasswordStrength(strength, password);
      checkPasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', () => {
      checkPasswordMatch();
    });

    function getPasswordStrength(password) {
      let strength = 0;

      // Comprimento da senha
      if (password.length >= 8) {
        strength += 4; // Adiciona 4 pontos para comprimento adequado
      }

      // Verificar a presença de critérios
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

      // Adicionar pontos para cada critério
      if (hasUppercase) strength += 2;
      if (hasLowercase) strength += 2;
      if (hasNumber) strength += 2;
      if (hasSpecialChar) strength += 2;

      // Verifica a pontuação total e define a força
      if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar && password.length >= 8) {
        return 10; // Considerado `strong`
      } else if (strength >= 6) {
        return 6; // Considerado `medium`
      } else {
        return strength; // Considerado `weak`
      }
    }

    function updatePasswordStrength(strength, password) {
      // Se o campo de senha estiver vazio, esconder a barra
      if (password === '') {
        passwordStrength.style.width = '0%';
        passwordStrength.style.backgroundColor = 'transparent';
        passwordStrength.classList.remove('weak', 'medium', 'strong');
        return;
      }

      // Transição suave para largura e cor
      passwordStrength.style.transition = 'width 0.3s ease, background-color 0.3s ease';
      passwordStrength.classList.remove('weak', 'medium', 'strong');
      
      if (strength <= 4) {
        passwordStrength.classList.add('weak');
        passwordStrength.style.width = '33%';
        passwordStrength.style.backgroundColor = 'red';
      } else if (strength <= 6) {
        passwordStrength.classList.add('medium');
        passwordStrength.style.width = '66%';
        passwordStrength.style.backgroundColor = 'orange';
      } else {
        passwordStrength.classList.add('strong');
        passwordStrength.style.width = '100%';
        passwordStrength.style.backgroundColor = 'green';
      }
    }

    function checkPasswordMatch() {
      if (passwordInput.value && confirmPasswordInput.value) {
        if (passwordInput.value === confirmPasswordInput.value) {
          passwordMatch.textContent = 'Senhas correspondem';
          passwordMatch.classList.remove('mismatch');
          passwordMatch.classList.add('match');
        } else {
          passwordMatch.textContent = 'Senhas não correspondem';
          passwordMatch.classList.remove('match');
          passwordMatch.classList.add('mismatch');
        }
      } else {
        passwordMatch.textContent = '';
      }
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const confirmPasswordField = document.getElementById('confirm_password');

    function togglePasswordVisibility(inputField, toggleIcon) {
        // Alternar o tipo de input entre password e text
        const type = inputField.type === 'password' ? 'text' : 'password';
        inputField.type = type;

        // Alternar o ícone do olho
        toggleIcon.classList.toggle('fa-eye');
        toggleIcon.classList.toggle('fa-eye-slash');
    }

    togglePassword.addEventListener('click', () => {
        togglePasswordVisibility(passwordField, togglePassword);
    });

    toggleConfirmPassword.addEventListener('click', () => {
        togglePasswordVisibility(confirmPasswordField, toggleConfirmPassword);
    });
});