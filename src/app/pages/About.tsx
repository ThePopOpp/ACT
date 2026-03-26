import { ArrowRight } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#e8eef5] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-[#1a2d5a] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
            About Arizona Christian Tuition
          </h1>
          <p className="text-lg text-[#1a2d5a] max-w-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
            Arizona Christian Tuition (ACT) was founded by three Arizona dads who shared a common challenge—and a shared conviction.
            As fathers, we deeply desired to place our children in a private Christian school, but like many families, we faced the
            financial reality that tuition was simply out of reach.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-[#1a2d5a] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              ACT exists to empower Arizona families with access to Christian school tuition through tax-credit scholarship funding.
              We work with donors, schools, and community partners to turn generosity into opportunity, ensuring access is not
              limited by financial barriers.
            </p>
            <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              From a personal struggle to an organization helping thousands, our story is rooted in faith, community, and practical
              solutions. We celebrate every student and family who comes through our program and every donor who makes it possible.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#1a2d5a] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              How We Work
            </h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li>Collect tax-credit donations from individual and corporate donors.</li>
              <li>Allocate scholarship funds to eligible Christian schools in Arizona.</li>
              <li>Support families through the application process and connection with schools.</li>
              <li>Provide transparent reporting and accountability for donors and schools.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[#1a2d5a] mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
            Meet the Team
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
              <img
                src="https://arizonachristiantuition.com/wp-content/uploads/2026/03/chris-leavitt-white-bg.png"
                alt="Chris Leavitt"
                className="mx-auto h-28 w-28 rounded-full object-cover mb-4"
              />
              <h4 className="text-xl font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Chris Leavitt
              </h4>
              <p className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                CEO
              </p>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Bringing vision and leadership from the start, Chris steers ACT with mission-driven purpose and faith-first
                strategy.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
              <img
                src="https://arizonachristiantuition.com/wp-content/uploads/2025/12/SS1-150x150.png"
                alt="Scott Spaulding"
                className="mx-auto h-28 w-28 rounded-full object-cover mb-4"
              />
              <h4 className="text-xl font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Scott Spaulding
              </h4>
              <p className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                COO
              </p>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Scott builds operational excellence and ensures every donation dollar runs efficiently for families and schools.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
              <img
                src="https://arizonachristiantuition.com/wp-content/uploads/2025/12/JW1-150x150.png"
                alt="Jeremy Waters"
                className="mx-auto h-28 w-28 rounded-full object-cover mb-4"
              />
              <h4 className="text-xl font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Jeremy Waters
              </h4>
              <p className="text-sm text-gray-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                CTO
              </p>
              <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Jeremy leads the technology roadmap, building a platform that makes scholarship management easy and transparent.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-[#1a2d5a] mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Join our growing network of families and donors. Your support can make Christian school education affordable for
            students across Arizona.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-[#c8202d] hover:bg-[#a01825] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Get Started
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
