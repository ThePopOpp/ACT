import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Arizona Christian Tuition?",
    answer: "Arizona Christian Tuition (ACT) is a School Tuition Organization (STO) that helps Arizona families access quality Christian education through tax-advantaged scholarship programs. We connect generous donors with deserving students and families who want to provide their children with faith-based educational opportunities."
  },
  {
    question: "What is an STO (School Tuition Organization)?",
    answer: "A School Tuition Organization (STO) is a nonprofit organization authorized by the Arizona Department of Education to administer tax-credit scholarships. STOs like Arizona Christian Tuition help facilitate the distribution of Individual and Corporate Income Tax Credits to eligible students attending qualified private schools."
  },
  {
    question: "How do Arizona tax credits work?",
    answer: "Arizona offers two types of tax credits for education: Original Tax Credits and Overflow Tax Credits. Individual donors can receive up to $1,459 in tax credits (singles) or $2,918 (married filing jointly). Corporate donors can receive up to 30% of their Arizona tax liability. These credits are claimed on your Arizona state tax return and reduce your tax bill dollar-for-dollar."
  },
  {
    question: "What's the difference between Original and Overflow tax credits?",
    answer: "Original Tax Credits are available throughout the year and are limited to the total amount allocated by the state. Overflow Tax Credits become available after the Original Tax Credit pool is exhausted, typically in late spring. Both provide the same dollar-for-dollar tax benefit, but Overflow credits may be processed differently on your tax return."
  },
  {
    question: "Who can donate to Arizona Christian Tuition?",
    answer: "Any Arizona taxpayer can donate to support our scholarship programs. This includes individuals, businesses, corporations, and trusts. Donors must file Arizona state taxes to claim the tax credit benefit."
  },
  {
    question: "Can I recommend a student when I donate?",
    answer: "Yes! When you donate, you can recommend a specific student or school. However, final scholarship awards are determined by the school based on their admission criteria, financial need, and available funds. Your donation helps create more scholarship opportunities regardless of specific recommendations."
  },
  {
    question: "What schools are eligible to receive scholarships?",
    answer: "Scholarships can be used at any Arizona private school that is accredited and meets state requirements. This includes Christian schools, charter schools, and other qualified private institutions. Schools must be registered with the Arizona Department of Education to participate in the tax-credit scholarship program."
  },
  {
    question: "How are scholarships awarded to students?",
    answer: "Schools receive scholarship funds based on their enrollment and demonstrated need. Individual scholarships are awarded by the schools themselves through their own application and selection processes. Arizona Christian Tuition facilitates the funding, but schools determine which students receive scholarships and how much each student receives."
  },
  {
    question: "Who is eligible to receive scholarships?",
    answer: "Any Arizona resident student attending a qualified private school may be eligible for scholarships. There are no income restrictions for receiving scholarships, though schools may have their own admission requirements. Students with disabilities (ESA recipients) may also be eligible for scholarships."
  },
  {
    question: "Can a child receive scholarships if they're on ESA?",
    answer: "Yes, students receiving Empowerment Scholarship Account (ESA) funds may also receive tax-credit scholarships. The ESA program provides funds for various educational expenses, and tax-credit scholarships can supplement these funds for tuition at private schools."
  },
  {
    question: "How do I apply for a scholarship for my child?",
    answer: "Scholarship applications are handled directly through the schools. Contact the school you're interested in to inquire about their scholarship application process and deadlines. Arizona Christian Tuition provides the funding, but schools manage the application and selection process."
  },
  {
    question: "How often do I need to submit an application?",
    answer: "Scholarship applications are typically submitted annually, though some schools may have different cycles. Once awarded, scholarships may be renewable based on the school's policies, academic performance, and continued financial need."
  },
  {
    question: "What documentation is required?",
    answer: "Required documentation varies by school but typically includes proof of Arizona residency, school transcripts, financial information, and sometimes recommendation letters. Schools will provide specific requirements during the application process."
  },
  {
    question: "What is the deadline to donate as an individual?",
    answer: "Individual donations can be made throughout the year. However, to claim the tax credit on your current year's tax return, donations should be made by April 15th (or the Arizona tax filing deadline). Donations made after this date will be credited to the following tax year."
  },
  {
    question: "What are the maximum donation limits for individuals?",
    answer: "Individual donors can contribute up to $1,459 (single filers) or $2,918 (married filing jointly) per year to receive the maximum tax credit. There is no limit on additional donations beyond the tax credit amount, though only the maximum credit amount will be refunded."
  },
  {
    question: "Can I donate beyond my tax liability?",
    answer: "Yes, you can donate more than your tax liability. You'll receive a tax credit for the maximum amount eligible ($1,459 for singles, $2,918 for married couples), and any additional donation amount will be treated as a charitable contribution (subject to IRS rules for deductibility)."
  },
  {
    question: "How does corporate giving work?",
    answer: "Corporations can donate to Arizona Christian Tuition and receive a tax credit equal to 30% of their donation amount, up to 30% of their Arizona tax liability. Corporate donations help fund larger scholarship amounts and support multiple students."
  },
  {
    question: "Is there a minimum donation for corporations?",
    answer: "There is no minimum donation amount for corporations. However, the tax credit is calculated as 30% of the donation, so larger donations provide greater tax benefits."
  },
  {
    question: "Can corporations recommend a school?",
    answer: "Yes, corporations can recommend specific schools or types of schools for their donations. Like individual donors, final scholarship distribution is determined by school needs and enrollment."
  },
  {
    question: "How do donors receive receipts or tax documentation?",
    answer: "You'll receive a tax credit receipt via email and mail shortly after your donation is processed. This receipt includes all the information needed to claim your tax credit on your Arizona state tax return. Keep this receipt with your tax records."
  },
  {
    question: "Are donations refundable?",
    answer: "Donations are not refundable once processed. However, if you have questions about your donation or need to make changes, please contact us immediately at support@actsto.org or (480) 999-9906."
  },
  {
    question: "How long does it take for scholarships to be distributed?",
    answer: "Scholarship funds are distributed to schools throughout the school year as students enroll and scholarships are awarded. Most schools receive funds within 2-4 weeks of a student's enrollment and scholarship approval."
  },
  {
    question: "What if I entered incorrect information in my portal?",
    answer: "If you notice incorrect information in your donor portal, please contact us immediately at support@actsto.org or (480) 999-9906. We'll help you correct the information and ensure your tax credit is processed correctly."
  },
  {
    question: "Can students receive scholarships from multiple STOs?",
    answer: "Yes, students can receive scholarships from multiple School Tuition Organizations. This allows families to maximize their educational funding opportunities through various tax-credit programs."
  },
  {
    question: "Who should I contact for help?",
    answer: "For questions about donations, tax credits, or the program in general, contact our support team at support@actsto.org or (480) 999-9906. For questions about specific schools or scholarship applications, please contact the school directly."
  }
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#e8eef5] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#1a2d5a] rounded-full flex items-center justify-center">
              <HelpCircle size={32} className="text-white" />
            </div>
          </div>
          <h1
            className="text-4xl font-bold text-[#1a2d5a] mb-4"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Frequently Asked Questions
          </h1>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Get answers to the most common questions about scholarships, tax credits, eligibility, and how Arizona Christian Tuition can support your family. Our goal is to make the process simple, transparent, and easy to navigate so you can focus on providing the best Christian education for your child.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3
                  className="text-lg font-semibold text-[#1a2d5a] pr-4"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {faq.question}
                </h3>
                {openItems.has(index) ? (
                  <ChevronUp size={20} className="text-[#1a2d5a] flex-shrink-0" />
                ) : (
                  <ChevronDown size={20} className="text-[#1a2d5a] flex-shrink-0" />
                )}
              </button>
              {openItems.has(index) && (
                <div className="px-6 pb-4">
                  <p
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-[#1a2d5a] rounded-lg p-8 text-center text-white">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Still Have Questions?
          </h2>
          <p
            className="text-lg mb-6 opacity-90"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Our team is here to help you navigate the Arizona tax credit scholarship program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+14809999906"
              className="inline-flex items-center justify-center gap-2 bg-[#c8202d] hover:bg-[#a01825] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Call (480) 999-9906
            </a>
            <a
              href="mailto:support@actsto.org"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1a2d5a] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Email support@actsto.org
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}