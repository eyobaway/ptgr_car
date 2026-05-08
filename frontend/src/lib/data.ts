export type ListingType = "SALE" | "RENT";
export type RentCycle = "DAILY" | "WEEKLY" | "MONTHLY";

export interface Vehicle {
    id: string;
    image: string;
    images?: string[];
    price: string;
    title?: string;
    address: string;
    city: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    transmission: "AUTOMATIC" | "MANUAL" | "CVT" | "SEMI_AUTO";
    fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID" | "PLUG_IN_HYBRID";
    condition: "NEW" | "USED" | "CERTIFIED_PRE_OWNED";
    bodyType: string;
    color: string;
    type: ListingType;
    rentCycle?: RentCycle | null;
    description?: string;
    features?: string[];
    location: {
        lat: number;
        lng: number;
    };
    agentId: string;
}

export const vehicles: Vehicle[] = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
        price: "$145,000",
        title: "2024 Porsche 911 Carrera S",
        address: "911 Performance Way",
        city: "Los Angeles, CA",
        make: "Porsche",
        model: "911 Carrera S",
        year: 2024,
        mileage: 1200,
        transmission: "AUTOMATIC",
        fuelType: "PETROL",
        condition: "NEW",
        bodyType: "Coupe",
        color: "Agate Grey",
        type: "SALE",
        description: "The benchmark for sports cars. This 911 Carrera S features the Sport Chrono package, PASM sport suspension, and a stunning leather interior. Unmatched performance and daily usability.",
        features: ["Sport Chrono", "Bose Surround Sound", "Active Suspension", "Heated Seats"],
        location: { lat: 34.052235, lng: -118.243683 },
        agentId: "1"
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800",
        price: "$850/day",
        title: "2023 BMW M5 Competition",
        address: "123 Speed Line",
        city: "Beverly Hills, CA",
        make: "BMW",
        model: "M5 Competition",
        year: 2023,
        mileage: 5000,
        transmission: "AUTOMATIC",
        fuelType: "PETROL",
        condition: "USED",
        bodyType: "Sedan",
        color: "Marina Bay Blue",
        type: "RENT",
        rentCycle: "DAILY",
        description: "Experience the ultimate executive athlete. The BMW M5 Competition delivers supercar performance in a luxury sedan body. Perfect for high-profile arrivals and spirited drives.",
        features: ["M xDrive", "Carbon Ceramic Brakes", "Driving Assistant Professional", "Soft Close Doors"],
        location: { lat: 34.073620, lng: -118.400352 },
        agentId: "1"
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800",
        price: "$2,890,000",
        title: "2022 Ferrari SF90 Stradale",
        address: "45 Rosso Corsa Blvd",
        city: "Malibu, CA",
        make: "Ferrari",
        model: "SF90 Stradale",
        year: 2022,
        mileage: 800,
        transmission: "AUTOMATIC",
        fuelType: "PLUG_IN_HYBRID",
        condition: "CERTIFIED_PRE_OWNED",
        bodyType: "Supercar",
        color: "Rosso Corsa",
        type: "SALE",
        description: "The first ever plug-in hybrid Ferrari. 1000CV of pure adrenaline. This SF90 Stradale comes with the Assetto Fiorano package and extensive carbon fiber options.",
        features: ["Assetto Fiorano Pack", "Carbon Seats", "Front Lift", "JBL Premium Audio"],
        location: { lat: 34.025922, lng: -118.779757 },
        agentId: "2"
    },
    {
        id: "4",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
        price: "$65,000",
        title: "2024 Tesla Model X Plaid",
        address: "88 Electric Ave",
        city: "Los Angeles, CA",
        make: "Tesla",
        model: "Model X Plaid",
        year: 2024,
        mileage: 0,
        transmission: "AUTOMATIC",
        fuelType: "ELECTRIC",
        condition: "NEW",
        bodyType: "SUV",
        color: "Ultra Red",
        type: "SALE",
        description: "The quickest accelerating SUV in production. 1020 horsepower, six-seat configuration, and the iconic Falcon Wing doors. The future of family transport.",
        features: ["Full Self-Driving", "Yoke Steering", "Plaid Powertrain", "22'' Turbine Wheels"],
        location: { lat: 34.086941, lng: -118.270204 },
        agentId: "3"
    },
    {
        id: "5",
        image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
        price: "$4,500/mo",
        title: "2024 Mercedes-Benz G 63 AMG",
        address: "101 Luxury Drive",
        city: "Hollywood, CA",
        make: "Mercedes-Benz",
        model: "G 63 AMG",
        year: 2024,
        mileage: 1500,
        transmission: "AUTOMATIC",
        fuelType: "PETROL",
        condition: "NEW",
        bodyType: "SUV",
        color: "Obsidian Black",
        type: "RENT",
        rentCycle: "MONTHLY",
        description: "The legendary G-Wagon. Hand-built V8 biturbo engine, unmistakable design, and unparalleled status. This G 63 features the Night Package and G Manufaktur interior.",
        features: ["Night Package", "Burmester Sound", "Massage Seats", "Ambient Lighting"],
        location: { lat: 34.101558, lng: -118.328730 },
        agentId: "4"
    },
    {
        id: "6",
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
        price: "$320,000",
        title: "2023 Lamborghini Huracán Tecnica",
        address: "22 V10 Circuit",
        city: "Santa Monica, CA",
        make: "Lamborghini",
        model: "Huracán Tecnica",
        year: 2023,
        mileage: 2100,
        transmission: "AUTOMATIC",
        fuelType: "PETROL",
        condition: "USED",
        bodyType: "Coupe",
        color: "Verde Mantis",
        type: "SALE",
        description: "The most versatile Huracán ever made. Rear-wheel drive, rear-wheel steering, and the raw soul of a naturally aspirated V10. Pure driving emotion.",
        features: ["Lifting System", "Rear View Camera", "Smartphone Interface", "Sport Exhaust"],
        location: { lat: 34.0195, lng: -118.4912 },
        agentId: "2"
    },
];

export function getVehicleById(id: string): Vehicle | undefined {
    return vehicles.find((v) => v.id === id);
}

export function getVehiclesByAgentId(agentId: string): Vehicle[] {
    return vehicles.filter((v) => v.agentId === agentId);
}

export interface Dealer {
    id: string;
    userId?: number;
    name: string;
    role: string;
    image: string;
    email: string;
    phone: string;
    listings: number;
    bio?: string;
    location?: string;
    brands?: string[];
}

export const dealers: Dealer[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        role: "Premium Specialist",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
        email: "sarah@ptgr.com",
        phone: "(555) 123-4567",
        listings: 12,
        bio: "Sarah brings over 15 years of experience in the luxury vehicle market. Her detailed knowledge of performance brands and commitment to client satisfaction make her the top choice for discerning buyers.",
        location: "Beverly Hills, CA",
        brands: ["Porsche", "BMW", "Mercedes-Benz"]
    },
    {
        id: "2",
        name: "Michael Chen",
        role: "Supercar Expert",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
        email: "michael@ptgr.com",
        phone: "(555) 987-6543",
        listings: 8,
        bio: "Specializing in high-end exotic cars, Michael has a reputation for securing rare allocations. His background in automotive engineering allows him to explain the technical brilliance of every machine.",
        location: "Santa Monica, CA",
        brands: ["Ferrari", "Lamborghini", "McLaren"]
    },
];

export interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    image: string;
    author: string;
    content?: string;
}

export const articles: Article[] = [
    {
        id: "1",
        title: "The Shift to Electric Performance",
        excerpt: "Traditional supercar manufacturers are embracing electrification. Here is what the future of performance looks like in 2024.",
        category: "Industry Trends",
        date: "Oct 12, 2023",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop",
        author: "Sarah Jenkins",
        content: `
            <p>The automotive landscape is undergoing its most significant transformation in a century. Performance is no longer solely defined by displacement.</p>
            <h3>Hybrid Integration</h3>
            <p>From the Ferrari SF90 to the upcoming hybrid 911, electrification is being used to enhance, not just replace, internal combustion.</p>
            <h3>Future Outlook</h3>
            <p>While the soul of the engine remains, the instant torque of electric motors is creating performance figures previously thought impossible for production cars.</p>
        `
    },
    {
        id: "2",
        title: "Top 5 Vehicles for Investment Value",
        excerpt: "Looking for a car that holds its value? These modern classics are showing the strongest returns in today's market.",
        category: "Investment",
        date: "Oct 10, 2023",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        author: "Michael Ross",
        content: `<p>Cars are often seen as depreciating assets, but certain models buck the trend. Limited production runs and iconic designs are key.</p>`
    },
];

export function getArticleById(id: string): Article | undefined {
    return articles.find((article) => article.id === id);
}
