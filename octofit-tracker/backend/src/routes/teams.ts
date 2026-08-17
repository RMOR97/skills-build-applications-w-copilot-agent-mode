import { Router, Request, Response } from 'express';
import Team from '../models/Team';
import User from '../models/User';

const router = Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await Team.find()
      .populate('leader', 'username email')
      .populate('members', 'username email');
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get team by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'username email')
      .populate('members', 'username email totalPoints');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create team
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, leaderId } = req.body;

    if (!name || !leaderId) {
      return res.status(400).json({ error: 'Name and leaderId are required' });
    }

    const team = new Team({
      name,
      description,
      leader: leaderId,
      members: [leaderId],
    });

    await team.save();
    res.status(201).json(team);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Add member to team
router.post('/:id/members', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('members', 'username email');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Update user's team reference
    await User.findByIdAndUpdate(userId, { team: req.params.id });

    res.json(team);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update team
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete team
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ message: 'Team deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
