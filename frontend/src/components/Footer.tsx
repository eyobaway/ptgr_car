import Link from "next/link";
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">
                            PTGR<span className="text-primary">CARS.</span>
                        </span>
                    </Link>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        The world's most trusted marketplace to buy, sell, and rent vehicles. Find your perfect car today.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        <li><Link href="/buy" className="hover:text-primary transition-colors">Buy a Car</Link></li>
                        <li><Link href="/rent" className="hover:text-primary transition-colors">Rent a Car</Link></li>
                        <li><Link href="/sell" className="hover:text-primary transition-colors">Sell Your Car</Link></li>
                        <li><Link href="/dealers" className="hover:text-primary transition-colors">Find a Dealer</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold text-lg mb-6">Resources</h4>
                    <ul className="space-y-4">
                        <li><Link href="/calculator" className="hover:text-primary transition-colors">Auto Loan Calculator</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Car Valuation</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Car Buying Guide</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
                    <ul className="space-y-4">
                        <li className="flex gap-3">
                            <MapPin className="w-5 h-5 text-primary shrink-0" />
                            <span>Ethiopia, Addis Ababa, Kazanchis</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone className="w-5 h-5 text-primary shrink-0" />
                            <span>+251 000-0000</span>
                        </li>
                        <li className="flex gap-3">
                            <Mail className="w-5 h-5 text-primary shrink-0" />
                            <span>hello@ptgr-cars.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                <p>© {new Date().getFullYear()} PTGR Cars. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
