
const bcrypt = require('bcryptjs');

class AuthController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // SIGNUP
  signup = async (req, res) => {
    try {
      const { first_name, last_name, email, username, password } = req.body;

      if (!first_name || !last_name || !email || !username || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters.'
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (await this.userRepository.findByEmail(normalizedEmail)) {
        return res.status(409).json({ message: 'Email already registered.' });
      }

      if (await this.userRepository.findByUsername(username.trim())) {
        return res.status(409).json({ message: 'Username already taken.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await this.userRepository.createUser({
        first_name,
        last_name,
        email: normalizedEmail,
        username: username.trim(),
        password: hashedPassword
      });

      res.status(201).json({
        message: 'Account created successfully!',
        userId
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Signup failed.' });
    }
  };

  // LOGIN
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required.'
        });
      }

      const user = await this.userRepository.findByEmail(
        email.trim().toLowerCase()
      );

      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid email or password.'
        });
      }

      res.status(200).json({
        message: 'Login successful!',
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          username: user.username
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Login failed.'
      });
    }
  };
}

module.exports = AuthController;
