document.addEventListener("DOMContentLoaded", function() {
  const passwordInput = document.getElementById("password");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  passwordInput.addEventListener("input", function() {
    const password = passwordInput.value;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;     
    if (/[a-z]/.test(password)) strength += 1;     
    if (/\d/.test(password)) strength += 1;         
    if (/[\W_]/.test(password)) strength += 1;       
    const strengthPercentage = (strength / 6) * 100;
    strengthBar.style.width = strengthPercentage + "%";
    if (password.length === 0) {
      strengthBar.style.width = "0";
      strengthText.innerText = "Password strength: ";
    } else if (strength < 3) {
      strengthBar.style.background = "red";
      strengthText.innerText = "Password strength: Weak";
    } else if (strength < 5) {
      strengthBar.style.background = "orange";
      strengthText.innerText = "Password strength: Medium";
    } else {
      strengthBar.style.background = "green";
      strengthText.innerText = "Password strength: Strong";
    }
  });
});
