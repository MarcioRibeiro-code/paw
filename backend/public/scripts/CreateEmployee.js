function hideAlert() {
    var alertDiv = document.getElementById("alert");
    if (alertDiv) {
      alertDiv.style.display = "none";
    }
  }


  var form = document.getElementById('employeeForm');
  var passwordInput = document.getElementById('password');

  form.addEventListener('submit', function(event) {
    if (!isValidPassword(passwordInput.value)) {
      event.preventDefault();
      alert('Please enter a valid password.');
    }
  });

  function isValidPassword(password) {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
  }