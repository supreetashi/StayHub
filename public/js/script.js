(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})
(
  setTimeout(() => {
    const alerts = document.querySelectorAll(".alert");
    alerts.forEach(alert => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    });
  }, 2000)
)
(
  document.addEventListener("DOMContentLoaded", () => {
    const toastElList = document.querySelectorAll(".toast");
    toastElList.forEach(toastEl => {
      const toast = new bootstrap.Toast(toastEl, {
        delay: 4000
      });
      toast.show();
    });
  })
)