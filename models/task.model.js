import { mongoose } from '../config/db/connection.js';
import { encryptPassword } from '../library/appBcrypt.js';

const taskChema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Desarrollo', 'Diseño', 'Reunión', 'Otro'], required: true },
    priority: { type: String, enum: ['Alta', 'Media', 'Baja'], default: 'Media' },
    color: { type: String, match: /^#([0-9A-F]{3}){1,2}$/i },
    state: { type: String, enum: ['Pendiente', 'En progreso', 'Completada', 'Cancelada'], default: 'Pendiente' },
    dates: [{
        startDate: { type: Date },
        endDate: { type: Date },
        creationDate: { type: Date, default: Date.now },
        lastModification: { type: Date }
    }],
    peopleInvolved: [{
        role: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    files: [{
        name: { type: String, required: true },
        type: { type: String },
        uploadDate: { type: Date, default: Date.now }
    }]
});

export default mongoose.model('task', taskChema);
