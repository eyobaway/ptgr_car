import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/database';
import User, { UserRole } from '../src/models/User';
import Agent from '../src/models/Agent';
import Property, { PropertyType, RentCycle, Transmission, FuelType, Condition } from '../src/models/Property';
import bcryptjs from 'bcryptjs';

const seedProperties = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Get or create a basic user
        const email = 'agent_seed@ptgr.com';
        let user = await User.findOne({ where: { email } });
        if (!user) {
            const hashedPassword = await bcryptjs.hash('password123', 10);
            user = await User.create({
                name: 'Seed Agent User',
                email: email,
                password: hashedPassword,
                role: UserRole.AGENT,
            });
        }

        // 2. Get or create an agent profile for that user
        let agent = await Agent.findOne({ where: { userId: user.id } });
        if (!agent) {
            agent = await Agent.create({
                userId: user.id,
                role: 'Senior Broker',
                phone: '+1 555-0198',
                isActive: true,
                location: 'Los Angeles, CA',
            });
        }

        // 3. Properties Data
        const propertyData = [
            {
                agentId: agent.id,
                title: '2024 Tesla Model S Plaid',
                image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
                price: 89900,
                address: 'Bole High Street',
                city: 'Addis Ababa',
                make: 'Tesla',
                model: 'Model S',
                year: 2024,
                mileage: 50,
                transmission: Transmission.AUTOMATIC,
                fuelType: FuelType.ELECTRIC,
                condition: Condition.NEW,
                bodyType: 'Sedan',
                type: PropertyType.SALE,
                description: 'The quickest acceleration of any vehicle in production. 0-60 mph in 1.99s. Full Self-Driving capability included.',
                features: ['Autopilot', 'Premium Audio', 'Panoramic Roof', 'Heated Seats'],
                lat: 9.002,
                lng: 38.788,
                images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80']
            },
            {
                agentId: agent.id,
                title: '2023 Toyota Land Cruiser 300 VXR',
                image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
                price: 125000,
                address: 'Old Airport Road',
                city: 'Addis Ababa',
                make: 'Toyota',
                model: 'Land Cruiser',
                year: 2023,
                mileage: 12000,
                transmission: Transmission.AUTOMATIC,
                fuelType: FuelType.DIESEL,
                condition: Condition.USED,
                bodyType: 'SUV',
                type: PropertyType.SALE,
                description: 'The ultimate 4x4. Excellent condition, fully serviced at Toyota. Features the new V6 twin-turbo engine.',
                features: ['4WD', 'Leather Interior', 'Sunroof', 'Cool Box'],
                lat: 9.006,
                lng: 38.732,
                images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80']
            },
            {
                agentId: agent.id,
                title: '2024 BMW M4 Competition',
                image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
                price: 150,
                address: 'Kazanchis Business Center',
                city: 'Addis Ababa',
                make: 'BMW',
                model: 'M4',
                year: 2024,
                mileage: 100,
                transmission: Transmission.AUTOMATIC,
                fuelType: FuelType.PETROL,
                condition: Condition.NEW,
                bodyType: 'Coupe',
                type: PropertyType.RENT,
                rentCycle: RentCycle.DAILY,
                description: 'Experience pure driving pleasure. Available for daily rentals for special occasions or business trips.',
                features: ['Carbon Fiber Package', 'M-Sport Seats', 'Head-up Display'],
                lat: 9.021,
                lng: 38.766,
                images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80']
            },
            {
                agentId: agent.id,
                title: '2022 Honda Civic Type R',
                image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
                price: 45000,
                address: 'Sarbet Residential Zone',
                city: 'Addis Ababa',
                make: 'Honda',
                model: 'Civic',
                year: 2022,
                mileage: 25000,
                transmission: Transmission.MANUAL,
                fuelType: FuelType.PETROL,
                condition: Condition.USED,
                bodyType: 'Sedan',
                type: PropertyType.SALE,
                description: 'A true enthusiast car. Meticulously maintained, one owner, no modifications.',
                features: ['Brembo Brakes', 'Sport Mode', 'Rear Wing', 'Buckets Seats'],
                lat: 9.015,
                lng: 38.825,
                images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80']
            },
            {
                agentId: agent.id,
                title: '2023 Mercedes-Benz G63 AMG',
                image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
                price: 245000,
                address: 'Diplomatic Street',
                city: 'Addis Ababa',
                make: 'Mercedes-Benz',
                model: 'G-Class',
                year: 2023,
                mileage: 500,
                transmission: Transmission.AUTOMATIC,
                fuelType: FuelType.PETROL,
                condition: Condition.NEW,
                bodyType: 'SUV',
                type: PropertyType.SALE,
                description: 'The iconic G-Wagon in its most powerful AMG trim. Unmatched road presence and luxury.',
                features: ['Burmester Sound', 'Night Package', 'Carbon Interior'],
                lat: 9.030,
                lng: 38.860,
                images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80']
            },
            {
                agentId: agent.id,
                title: '2024 Ford F-150 Lightning',
                image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
                price: 120,
                address: 'South Africa Street',
                city: 'Addis Ababa',
                make: 'Ford',
                model: 'F-150',
                year: 2024,
                mileage: 1500,
                transmission: Transmission.AUTOMATIC,
                fuelType: FuelType.ELECTRIC,
                condition: Condition.NEW,
                bodyType: 'Truck',
                type: PropertyType.RENT,
                rentCycle: RentCycle.DAILY,
                description: 'The all-electric Ford truck. Perfect for moving gear or testing the future of pickups.',
                features: ['Large Screen', 'Pro Power Onboard', '4x4'],
                lat: 9.002,
                lng: 38.745,
                images: ['https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80']
            }
            // End of custom entries

        ];

        console.log('Seeding properties...');
        let createdCount = 0;

        for (const data of propertyData) {
            await Property.create({
                agentId: agent.id,
                title: data.title,
                price: data.price,
                address: `123 Demo St, ${data.city || 'Addis Ababa'}`,
                city: data.city || 'Addis Ababa',
                make: data.make,
                model: data.model,
                year: data.year,
                mileage: data.mileage,
                transmission: data.transmission,
                fuelType: data.fuelType,
                condition: data.condition,
                bodyType: data.bodyType,
                type: data.type,
                rentCycle: data.rentCycle || null,
                description: `High-quality ${data.title} available for ${data.type === PropertyType.SALE ? 'sale' : 'rent'}. Features premium performance and comfort.`,
                features: ["Air Conditioning", "Power Windows", "Bluetooth", "Backup Camera"],
                lat: 9.0192 + (Math.random() * 0.1 - 0.05),
                lng: 38.7525 + (Math.random() * 0.1 - 0.05),
                image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                images: [
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            });
            createdCount++;
        }

        console.log(`Successfully seeded ${createdCount} vehicles!`);
        process.exit(0);

    } catch (error) {
        console.error('Failed to seed properties:', error);
        process.exit(1);
    }
};

seedProperties();
