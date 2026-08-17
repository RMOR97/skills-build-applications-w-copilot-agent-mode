import { Router, Request, Response } from 'express';
import Leaderboard from '../models/Leaderboard';
import Activity from '../models/Activity';

const router = Router();

// Get leaderboard by period
router.get('/:period', async (req: Request, res: Response) => {
  try {
    const { period } = req.params;

    if (!['daily', 'weekly', 'monthly', 'allTime'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period' });
    }

    const leaderboard = await Leaderboard.find({ period })
      .sort({ rank: 1 })
      .populate('userId', 'username profile');

    res.json(leaderboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get team leaderboard by period
router.get('/team/:period', async (req: Request, res: Response) => {
  try {
    const { period } = req.params;

    if (!['daily', 'weekly', 'monthly', 'allTime'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period' });
    }

    const leaderboard = await Leaderboard.find({
      period,
      teamId: { $exists: true },
    })
      .sort({ rank: 1 })
      .populate('teamId', 'name');

    res.json(leaderboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Recalculate leaderboard (admin endpoint)
router.post('/recalculate/:period', async (req: Request, res: Response) => {
  try {
    const { period } = req.params;

    if (!['daily', 'weekly', 'monthly', 'allTime'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period' });
    }

    // Get all activities based on period
    const now = new Date();
    let startDate = new Date(now);

    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'allTime':
        startDate = new Date('2000-01-01');
    }

    const activities = await Activity.aggregate([
      { $match: { date: { $gte: startDate } } },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
        },
      },
      { $sort: { totalPoints: -1 } },
    ]);

    // Clear old entries for this period
    await Leaderboard.deleteMany({ period });

    // Create new leaderboard entries
    for (let i = 0; i < activities.length; i++) {
      const entry = new Leaderboard({
        userId: activities[i]._id,
        username: '', // TODO: Fetch username from User model
        points: activities[i].totalPoints,
        rank: i + 1,
        period,
      });
      await entry.save();
    }

    res.json({ message: `Leaderboard recalculated for ${period}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
