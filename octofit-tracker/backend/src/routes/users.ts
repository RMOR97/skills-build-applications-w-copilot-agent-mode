import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, email, password, profile } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Username, email, and password are required' });
    }

    const user = new User({
      username,
      email,
      password, // TODO: Hash password before saving
      profile,
    });

    await user.save();
    res.status(201).json({ id: user._id, username: user.username });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { profile } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profile },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
