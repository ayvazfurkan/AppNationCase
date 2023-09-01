const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred, error:' + error });
    }
};

const deleteUser = async (req, res) => {
    if(req.params.id === req.user.id) {
        res.status(403).json({ error: 'You can not delete yourself' });
    } else {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(204).json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred, error:' + error });
        }
    }
};

const updateUser = async (req, res) => {
    try {
        const newUsername = req.body.username.trim();
        if (newUsername && newUsername.length > 3) {
            const user = await User.findById(req.params.id);
            user.username = newUsername;
            await user.save();
            res.status(201).json({ message: 'Username updated', user: user });
        } else {
            res.status(400).json({ error: 'Username must be filled' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred, error: ' + error.message });
    }
};

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ username: user.username, role: user.role, id: user._id, password: user.password }, 'secret_key');
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred, error:' + error.message });
    }
}

module.exports = {
    getUsers,
    deleteUser,
    updateUser,
    register,
    login
};
