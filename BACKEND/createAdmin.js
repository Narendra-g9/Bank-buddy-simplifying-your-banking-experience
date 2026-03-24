const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is Required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is Required"],
    unique: true,
  },
  password: { type: String, required: [true, "password is Required"] },
  role: {
    type: Number,
    enum: [1],
    default: 1,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Bank_Buddy?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync('Admin@123', 10);

    // Create admin
    const admin = new Admin({
      username: 'admin',
      email: 'narendrayadala5@gmail.com',
      password: hashedPassword,
      role: 1,
    });

    await admin.save();
    console.log('✅ Admin account created successfully!');
    console.log('Username: admin');
    console.log('Email: narendrayadala5@gmail.com');
    console.log('Password: Admin@123');

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();
