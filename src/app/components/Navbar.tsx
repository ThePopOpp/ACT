import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Search, Bell, ChevronDown, Menu, X, LogOut, User, LayoutDashboard, Settings, Shield, Phone, Mail as MailIcon, HelpCircle, Newspaper, Users as UsersIcon, BookOpen, FileText, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ACT_LOGO_COLOR = 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/ACT-Logo-Color.svg';

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  individual_donor: 'Individual Donor',
  business_donor: 'Business Donor',
  parent: 'Parent / Guardian',
  student: 'Student',
};

export function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Explore', to: '/browse' },
    { label: 'Resources', to: '/how-it-works' },
    { label: 'Campaigns', to: '/browse' },
    { label: 'Contact', to: '/how-it-works' },
  ];

  const displayName = currentUser
    ? currentUser.nickname || currentUser.firstName
    : '';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={ACT_LOGO_COLOR} alt="Arizona Christian Tuition" className="h-12 w-auto" />
          </Link>

          {/* Nav links - desktop */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                location.pathname === '/'
                  ? 'text-[#c8202d]'
                  : 'text-[#1a2d5a] hover:text-[#c8202d]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="px-3 py-2 rounded-lg text-sm transition-colors font-medium text-[#c8202d] hover:text-[#a01825]"
            >
              Explore
            </Link>
            
            {/* Resources Mega Menu */}
            <div className="relative">
              <button
                onClick={() => setResourcesMenuOpen(!resourcesMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors font-medium text-[#c8202d] hover:text-[#a01825]"
              >
                Resources
                <ChevronDown size={14} className={`transition-transform ${resourcesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setResourcesMenuOpen(false)} />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Column 1: Learn & Info */}
                        <div>
                          <h3
                            className="text-[#1a2d5a] text-xs font-bold uppercase tracking-wider mb-3 px-2"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            Learn & Info
                          </h3>
                          <div className="space-y-1">
                            <Link
                              to="/how-it-works"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1a2d5a]/10 flex items-center justify-center group-hover:bg-[#1a2d5a]/20 transition-colors">
                                <BookOpen size={16} className="text-[#1a2d5a]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  How It Works
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Learn about our platform
                                </div>
                              </div>
                            </Link>
                            <Link
                              to="/about"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1a2d5a]/10 flex items-center justify-center group-hover:bg-[#1a2d5a]/20 transition-colors">
                                <HeartHandshake size={16} className="text-[#1a2d5a]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  About Us
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Our mission & story
                                </div>
                              </div>
                            </Link>
                            <Link
                              to="/team"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1a2d5a]/10 flex items-center justify-center group-hover:bg-[#1a2d5a]/20 transition-colors">
                                <UsersIcon size={16} className="text-[#1a2d5a]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Our Team
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Meet the ACT team
                                </div>
                              </div>
                            </Link>
                            <Link
                              to="/faq"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1a2d5a]/10 flex items-center justify-center group-hover:bg-[#1a2d5a]/20 transition-colors">
                                <HelpCircle size={16} className="text-[#1a2d5a]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  FAQ
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Common questions
                                </div>
                              </div>
                            </Link>
                            <Link
                              to="/news"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1a2d5a]/10 flex items-center justify-center group-hover:bg-[#1a2d5a]/20 transition-colors">
                                <Newspaper size={16} className="text-[#1a2d5a]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  In The News
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Latest updates & blog
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* Column 2: Support & Actions */}
                        <div>
                          <h3
                            className="text-[#1a2d5a] text-xs font-bold uppercase tracking-wider mb-3 px-2"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            Support & Actions
                          </h3>
                          <div className="space-y-1">
                            <Link
                              to="/contact"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#1a2d5a]/10 flex items-center justify-center group-hover:bg-[#1a2d5a]/20 transition-colors">
                                <FileText size={16} className="text-[#1a2d5a]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Contact Us
                                </div>
                                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Get in touch
                                </div>
                              </div>
                            </Link>
                            <a
                              href="tel:+14809999906"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                <Phone size={16} className="text-emerald-700" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  ACT Support
                                </div>
                                <div className="text-xs text-emerald-700 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  (480) 999-9906
                                </div>
                              </div>
                            </a>
                            <a
                              href="mailto:support@actsto.org"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#e8eef5] transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <MailIcon size={16} className="text-blue-700" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Email Us
                                </div>
                                <div className="text-xs text-blue-700 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  support@actsto.org
                                </div>
                              </div>
                            </a>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                            {!isAuthenticated && (
                              <Link
                                to="/register"
                                onClick={() => setResourcesMenuOpen(false)}
                                className="block w-full px-4 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-center text-sm font-semibold rounded-lg transition-colors"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                Sign Up
                              </Link>
                            )}
                            {!isAuthenticated && (
                              <Link
                                to="/login"
                                onClick={() => setResourcesMenuOpen(false)}
                                className="block w-full px-4 py-2.5 border-2 border-[#1a2d5a] text-[#1a2d5a] hover:bg-[#e8eef5] text-center text-sm font-semibold rounded-lg transition-colors"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                Login
                              </Link>
                            )}
                            <Link
                              to="/create"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="block w-full px-4 py-2.5 bg-[#c8202d] hover:bg-[#a01825] text-white text-center text-sm font-semibold rounded-lg transition-colors"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              Create Campaign
                            </Link>
                            <Link
                              to="/browse"
                              onClick={() => setResourcesMenuOpen(false)}
                              className="block w-full px-4 py-2.5 border-2 border-gray-200 text-gray-700 hover:bg-[#e8eef5] hover:border-[#1a2d5a]/40 text-center text-sm font-semibold rounded-lg transition-colors"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              Support Campaign
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              to="/browse"
              className="px-3 py-2 rounded-lg text-sm transition-colors font-medium text-[#1a2d5a] hover:text-[#c8202d]"
            >
              Campaigns
            </Link>
            <Link
              to="/how-it-works"
              className="px-3 py-2 rounded-lg text-sm transition-colors font-medium text-[#1a2d5a] hover:text-[#c8202d]"
            >
              Contact
            </Link>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex max-w-xs">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" placeholder="Search campaigns…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 transition-all"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create"
                  className="hidden sm:flex items-center gap-1.5 px-5 py-2 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm rounded font-semibold transition-colors"
                >
                  Start Campaign
                </Link>

                <button className="relative p-2 text-gray-500 hover:text-[#1a2d5a] hover:bg-[#edf2f8] rounded-full transition-colors">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#c8202d] rounded-full" />
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-[#edf2f8] rounded-full transition-colors"
                  >
                    <img
                      src={currentUser?.avatar || `https://i.pravatar.cc/40?u=${currentUser?.email}`}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="hidden sm:block text-sm font-medium text-[#1a2d5a]">{displayName}</span>
                    <ChevronDown size={14} className="hidden sm:block text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {currentUser?.firstName} {currentUser?.lastName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {currentUser?.accountType ? ACCOUNT_TYPE_LABELS[currentUser.accountType] : ''}
                          </p>
                          <p className="text-xs text-gray-400 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {currentUser?.email}
                          </p>
                        </div>
                        <div className="py-1.5">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e8eef5] hover:text-[#1a2d5a] transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            <LayoutDashboard size={15} className="text-gray-400" /> My Dashboard
                          </Link>
                          <Link
                            to="/create"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e8eef5] hover:text-[#1a2d5a] transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            <User size={15} className="text-gray-400" /> Start a Campaign
                          </Link>
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e8eef5] hover:text-[#1a2d5a] transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            <Settings size={15} className="text-gray-400" /> Settings
                          </Link>
                          {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                            <Link
                              to="/super-admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#c8202d] hover:bg-red-50 transition-colors"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              <Shield size={15} className="text-[#c8202d]" />
                              <span className="font-semibold">Super Admin Panel</span>
                              {currentUser?.role === 'super_admin' && <span className="ml-auto text-sm">👑</span>}
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-gray-100 py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-[#1a2d5a] hover:text-[#c8202d] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:flex items-center gap-1.5 px-5 py-2 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm rounded font-semibold transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#1a2d5a] hover:bg-[#edf2f8] rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <form onSubmit={handleSearch} className="px-1 mb-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Search campaigns…"
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20"
                />
              </div>
            </form>
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-[#1a2d5a] hover:bg-[#edf2f8] rounded-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-xs text-gray-400 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-[#1a2d5a] hover:bg-[#edf2f8] rounded-lg">My Dashboard</Link>
                <Link to="/create" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-semibold text-[#c8202d] hover:bg-[#edf2f8] rounded-lg">Start a Campaign</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-[#1a2d5a] hover:bg-[#edf2f8] rounded-lg font-medium">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-semibold text-[#c8202d] hover:bg-[#edf2f8] rounded-lg">Create Account</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}