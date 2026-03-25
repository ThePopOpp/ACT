import { Link } from 'react-router';

const ACT_LOGO_FULL = 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/ACT-Logo-Full-Red.White_.Blue_.Blue_.svg';

export function Footer() {
  return (
    <footer className="bg-[#1a2d5a] text-blue-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <img src={ACT_LOGO_FULL} alt="Arizona Christian Tuition" className="h-16 w-auto mb-4" />
            <p className="text-sm leading-relaxed max-w-xs mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Arizona Christian Tuition is a certified School Tuition Organization (STO) under Arizona's Private School Tax Credit law (A.R.S. § 43-1089).
            </p>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <p className="text-xs text-blue-100 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong className="text-white">Tax Credit Info:</strong> Singles up to $1,459 · Married up to $2,918 · Dollar-for-dollar AZ state credit
              </p>
            </div>
          </div>

          {[
            {
              title: 'Explore', links: [
                { label: 'Browse Campaigns', to: '/browse' },
                { label: 'Featured Schools', to: '/browse?sort=featured' },
                { label: 'Ending Soon', to: '/browse?sort=ending_soon' },
                { label: 'Most Funded', to: '/browse?sort=most_funded' },
              ],
            },
            {
              title: 'For Schools', links: [
                { label: 'Start a Campaign', to: '/create' },
                { label: 'Campaign Guide', to: '/create' },
                { label: 'ACT Certification', to: '/create' },
                { label: 'School Dashboard', to: '/dashboard' },
              ],
            },
            {
              title: 'Resources', links: [
                { label: 'How It Works', to: '/' },
                { label: 'Tax Credit FAQ', to: '/' },
                { label: 'Admin Portal', to: '/admin' },
                { label: 'Donor Dashboard', to: '/dashboard' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <h4
                className="text-white text-sm mb-4"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-white transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span>© 2026 Arizona Christian Tuition. All rights reserved. · EIN: 86-XXXXXXX</span>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Tax Credit Disclosure'].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}