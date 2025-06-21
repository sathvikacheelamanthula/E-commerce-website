const User = require('../models/User');
const BaseModel = require('../models/BaseModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - Created user and token
     */
    async register(userData) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
            
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            
            // Create user with hashed password
            const user = await BaseModel.create(User, {
                ...userData,
                password: hashedPassword
            });
            
            // Generate JWT token
            const token = this.generateToken(user);
            
            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw new Error(`Error registering user: ${error.message}`);
        }
    }
    
    /**
     * Login a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} - User and token
     */
    async login(email, password) {
        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            
            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            
            // Generate JWT token
            const token = this.generateToken(user);
            
            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            };
        } catch (error) {
            throw new Error(`Error logging in: ${error.message}`);
        }
    }
    
    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Promise<Object>} - User object
     */
    async getUserById(id) {
        try {
            const user = await BaseModel.findById(User, id);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Return user without password
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error getting user: ${error.message}`);
        }
    }
    
    /**
     * Update user profile
     * @param {string} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} - Updated user
     */
    async updateProfile(id, updateData) {
        try {
            // If password is being updated, hash it
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            
            const user = await BaseModel.update(User, id, updateData);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Return user without password
            const { password, ...userWithoutPassword } = user.toObject();
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error updating profile: ${error.message}`);
        }
    }
    
    /**
     * Generate JWT token
     * @param {Object} user - User object
     * @returns {string} - JWT token
     */
    generateToken(user) {
        return jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
    }
}

module.exports = new UserService(); 