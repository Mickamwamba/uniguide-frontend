import { Link } from 'react-router-dom';
import { BookOpen, Search, Sparkles } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-surface/80 border-b border-white/20 shadow-sm">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
                        <BookOpen size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-display text-2xl font-bold text-primary">UniGuide</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium text-sm">
                    <Link to="/universities" className="hover:text-accent transition-colors">Universities</Link>
                    <Link to="/courses" className="hover:text-accent transition-colors">Courses</Link>
                    <a href="#" className="hover:text-accent transition-colors">Career Guide</a>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors text-sm font-medium">
                        <Search size={16} />
                        <span>Search</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent hover:bg-accent-hover text-white transition-all shadow-lg shadow-indigo-500/20 text-sm font-medium">
                        <Sparkles size={16} />
                        <span>AI Guide</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
