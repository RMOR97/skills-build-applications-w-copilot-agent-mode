import mongoose from 'mongoose';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Team from '../models/Team.js';
import Leaderboard from '../models/Leaderboard.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Activity.deleteMany({});
    await Team.deleteMany({});
    await Leaderboard.deleteMany({});

    // Create sample users
    console.log('Creating users...');
    const users = await User.insertMany([
      {
        username: 'alex_runner',
        email: 'alex@octofit.com',
        password: 'hashed_password_1',
        profile: {
          firstName: 'Alex',
          lastName: 'Runner',
          bio: 'Marathon enthusiast and fitness coach',
        },
        totalPoints: 0,
      },
      {
        username: 'jordan_cyclist',
        email: 'jordan@octofit.com',
        password: 'hashed_password_2',
        profile: {
          firstName: 'Jordan',
          lastName: 'Cyclist',
          bio: 'Mountain biking lover',
        },
        totalPoints: 0,
      },
      {
        username: 'casey_swimmer',
        email: 'casey@octofit.com',
        password: 'hashed_password_3',
        profile: {
          firstName: 'Casey',
          lastName: 'Swimmer',
          bio: 'Triathlon competitor',
        },
        totalPoints: 0,
      },
      {
        username: 'morgan_trainer',
        email: 'morgan@octofit.com',
        password: 'hashed_password_4',
        profile: {
          firstName: 'Morgan',
          lastName: 'Trainer',
          bio: 'Personal trainer and fitness influencer',
        },
        totalPoints: 0,
      },
      {
        username: 'taylor_yogi',
        email: 'taylor@octofit.com',
        password: 'hashed_password_5',
        profile: {
          firstName: 'Taylor',
          lastName: 'Yogi',
          bio: 'Yoga instructor and wellness coach',
        },
        totalPoints: 0,
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create teams
    console.log('Creating teams...');
    const team1 = await Team.create({
      name: 'Octopus Runners',
      description: 'A team of dedicated runners chasing marathon goals',
      members: [users[0]._id, users[2]._id],
      leader: users[0]._id,
      totalPoints: 0,
    });

    const team2 = await Team.create({
      name: 'Speed Demons',
      description: 'Cyclists pushing their limits on every ride',
      members: [users[1]._id, users[3]._id],
      leader: users[1]._id,
      totalPoints: 0,
    });

    console.log('Created 2 teams');

    // Update users with team assignments
    await User.findByIdAndUpdate(users[0]._id, { team: team1._id });
    await User.findByIdAndUpdate(users[2]._id, { team: team1._id });
    await User.findByIdAndUpdate(users[1]._id, { team: team2._id });
    await User.findByIdAndUpdate(users[3]._id, { team: team2._id });

    // Create sample activities
    console.log('Creating activities...');
    const today = new Date();
    const activities = await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'running',
        duration: 45,
        distance: 8.5,
        calories: 650,
        points: 850,
        description: 'Morning run at the park',
        date: new Date(today.getTime() - 1000 * 60 * 60 * 24),
      },
      {
        userId: users[0]._id,
        type: 'running',
        duration: 60,
        distance: 10,
        calories: 800,
        points: 1000,
        description: 'Evening tempo run',
        date: today,
      },
      {
        userId: users[1]._id,
        type: 'cycling',
        duration: 90,
        distance: 35,
        calories: 1200,
        points: 1350,
        description: 'Mountain trail ride',
        date: today,
      },
      {
        userId: users[1]._id,
        type: 'cycling',
        duration: 120,
        distance: 50,
        calories: 1600,
        points: 1800,
        description: 'Long distance cycling',
        date: new Date(today.getTime() - 1000 * 60 * 60 * 48),
      },
      {
        userId: users[2]._id,
        type: 'swimming',
        duration: 60,
        distance: 2.5,
        calories: 700,
        points: 900,
        description: 'Pool training session',
        date: today,
      },
      {
        userId: users[3]._id,
        type: 'strength',
        duration: 75,
        calories: 550,
        points: 800,
        description: 'Full body strength training',
        date: today,
      },
      {
        userId: users[4]._id,
        type: 'yoga',
        duration: 60,
        calories: 250,
        points: 400,
        description: 'Vinyasa flow session',
        date: today,
      },
    ]);

    console.log(`Created ${activities.length} activities`);

    // Update user total points based on activities
    for (const user of users) {
      const userActivities = activities.filter(
        (activity) => activity.userId.toString() === user._id.toString()
      );
      const totalPoints = userActivities.reduce(
        (sum, activity) => sum + activity.points,
        0
      );
      await User.findByIdAndUpdate(user._id, { totalPoints });
    }

    // Create leaderboard entries for 'allTime'
    console.log('Creating leaderboard entries...');
    const sortedUsers = users.sort((a, b) => {
      const aPoints = activities
        .filter(
          (activity) => activity.userId.toString() === a._id.toString()
        )
        .reduce((sum, activity) => sum + activity.points, 0);
      const bPoints = activities
        .filter(
          (activity) => activity.userId.toString() === b._id.toString()
        )
        .reduce((sum, activity) => sum + activity.points, 0);
      return bPoints - aPoints;
    });

    const leaderboardEntries = sortedUsers.map((user, index) => {
      const userActivities = activities.filter(
        (activity) => activity.userId.toString() === user._id.toString()
      );
      const totalPoints = userActivities.reduce(
        (sum, activity) => sum + activity.points,
        0
      );

      return {
        userId: user._id,
        username: user.username,
        points: totalPoints,
        rank: index + 1,
        teamId: user.team || undefined,
        period: 'allTime',
      };
    });

    await Leaderboard.insertMany(leaderboardEntries);
    console.log(`Created ${leaderboardEntries.length} leaderboard entries`);

    console.log('✅ Database seeding complete!');
    console.log(`   - ${users.length} users created`);
    console.log(`   - 2 teams created`);
    console.log(`   - ${activities.length} activities logged`);
    console.log(`   - ${leaderboardEntries.length} leaderboard rankings generated`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
