import { connect, model, Schema } from 'mongoose';
import validator from 'validator';

connect('mongodb://127.0.0.1:27017/funko_pops').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface FunkoDocumentInterface extends Document {
  ID: number,
  name: string,
  description: string,
  type: 'Pop!' | 'Pop! Rides' | 'Vynil Soda' | 'Vynil Gold',
  gender: 'Animación' | 'Películas y TV' | 'Videojuegos' | 'Deportes' | 'Música' | 'Anime',
  theme: string,
  num: number,
  exclusive: boolean,
  special_characteristics: string,
  value: number
}

const FunkoSchema = new Schema<FunkoDocumentInterface>({
  ID: {
    type: Number,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
			if (!value.match(/^[A-Z]/)) {
				throw new Error('El nombre debe comenzar con mayúscula.');
			} else if (!validator.default.isAlphanumeric(value)) {
				throw new Error('El nombre solo puede contener caracteres alfanuméricos.');
			}
		}
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
    required: true,
    enum: ['Pop!', 'Pop! Rides', 'Vynil Soda', 'Vynil Gold'],
  },
  gender: {
    type: String,
    trim: true,
    required: true,
    enum: ['Animación', 'Películas y TV', 'Videojuegos', 'Deportes', 'Música', 'Anime'],
  },
  theme: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
			if (!value.match(/^[A-Z]/)) {
				throw new Error('El nombre debe comenzar con mayúscula.');
			} else if (!validator.default.isAlphanumeric(value)) {
				throw new Error('El nombre solo puede contener caracteres alfanuméricos.');
			}
		}
  },
  num: {
    type: Number,
    required: true,
  },
  exclusive: {
    type: Boolean,
    required: true,
  },
  special_characteristics: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

export const Funko = model<FunkoDocumentInterface>('Funko', FunkoSchema);