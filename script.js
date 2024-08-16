document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const service = document.getElementById('service').value.trim();
    const date = document.getElementById('date').value.trim();
    const time = document.getElementById('time').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Validar que todos los campos están llenos
    if (!service || !date || !time || !name || !email || !phone) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Validar formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    // Validar formato de teléfono (puedes ajustar la expresión regular según tus necesidades)
    const phonePattern = /^\d{10}$/; // Asume un número de teléfono de 10 dígitos
    if (!phonePattern.test(phone)) {
        alert('Por favor, ingrese un número de teléfono válido de 10 dígitos.');
        return;
    }

    // Validar que la fecha y la hora sean futuras
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime <= now) {
        alert('La fecha y la hora seleccionadas deben ser futuras.');
        return;
    }

    // Enviar datos al backend para procesar la cita
    fetch('/agendar-cita', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            service,
            date,
            time,
            name,
            email,
            phone,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Mostrar mensaje de confirmación
            document.getElementById('confirmationMessage').classList.remove('hidden');
            // Resetear el formulario
            event.target.reset();
        } else {
            alert('Hubo un problema al agendar la cita. Por favor, inténtelo de nuevo.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al enviar la solicitud. Verifique su conexión y vuelva a intentarlo.');
    });
});
