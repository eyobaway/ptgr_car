import sequelize from '../src/config/database';
import { User } from '../src/models';
import { UserRole } from '../src/models/User';
import bcrypt from 'bcryptjs';

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to remote database.');

        const adminEmail = 'admin@ptgr.com';
        const adminPassword = 'admin';

        let user = await User.findOne({ where: { email: adminEmail } });
        
        if (user) {
            console.log('Admin user already exists. Updating password to "admin"...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await user.update({ password: hashedPassword, role: UserRole.ADMIN });
            console.log('Admin password reset successfully.');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            user = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
                profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop'
            });
            console.log('Admin user created successfully.');
        }

        console.log(`\n--- ADMIN CREDENTIALS ---`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log(`-------------------------\n`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
