const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB', err));

// Definir el esquema y modelo de la cita
const citaSchema = new mongoose.Schema({
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
});

const Cita = mongoose.model('Cita', citaSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para agendar la cita
app.post('/agendar-cita', async (req, res) => {
    const { service, date, time, name, email, phone } = req.body;

    // Validar que todos los campos estén presentes
    if (!service || !date || !time || !name || !email || !phone) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos' });
    }

    // Validar formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ success: false, message: 'Correo electrónico inválido' });
    }

    // Validar formato de teléfono
    const phonePattern = /^\d{10}$/; // Asume un número de teléfono de 10 dígitos
    if (!phonePattern.test(phone)) {
        return res.status(400).json({ success: false, message: 'Número de teléfono inválido' });
    }

    // Validar que la fecha y la hora sean futuras
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime <= now) {
        return res.status(400).json({ success: false, message: 'La fecha y la hora seleccionadas deben ser futuras' });
    }

    try {
        const nuevaCita = new Cita({ service, date, time, name, email, phone });
        await nuevaCita.save();

        res.status(200).json({ success: true, message: 'Cita agendada con éxito' });

    } catch (error) {
        console.error('Error al guardar la cita:', error);
        res.status(500).json({ success: false, message: 'Error al agendar la cita', error: error.message });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
