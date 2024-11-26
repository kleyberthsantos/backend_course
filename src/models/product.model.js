const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  code: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: async function(code) {
        const count = await this.constructor.countDocuments({ code });
        return !count;
      },
      message: props => `El código de producto ${props.value} ya existe!`
    }
  },
  price: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: Boolean, 
    default: true 
  },
  stock: { 
    type: Number, 
    default: 0 
  },
  category: { 
    type: String, 
    required: true 
  },
  thumbnails: { 
    type: [String], 
    default: [] 
  }
});

productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);