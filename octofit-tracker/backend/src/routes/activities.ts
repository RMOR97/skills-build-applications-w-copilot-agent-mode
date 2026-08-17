import { Router, Request, Response } from 'express';
import Activity from '../models/Activity';

const router = Router();

// Get all activities
router.get('/', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('userId', 'username');
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get activities for a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({
      userId: req.params.userId,
    }).sort({ date: -1 });
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, type, duration, distance, calories, points, description, date } = req.body;

    if (!userId || !type || !duration || points === undefined) {
      return res
        .status(400)
        .json({ error: 'Missing required fields' });
    }

    const activity = new Activity({
      userId,
      type,
      duration,
      distance,
      calories,
      points,
      description,
      date: date || new Date(),
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update activity
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json(activity);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete activity
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
