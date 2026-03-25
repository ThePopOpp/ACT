import { useState } from 'react';
import { X, Check, AlertCircle, BookOpen, ChevronRight, Info } from 'lucide-react';

// ── Arizona Tax Credit limits (A.R.S. § 43-1089) ──────────────────────────────
const TAX_LIMITS = {
  2025: { single: 1459, married: 2918 },
  2026: { single: 1505, married: 3010 },
};

const FONT_SERIF = { fontFamily: 'Merriweather, Georgia, serif' };
const FONT_SANS  = { fontFamily: 'Inter, sans-serif' };

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}

// ── Stepper ───────────────────────────────────────────────────────────────────
const STEPS = ['Donors', 'Taxes', 'Payments', 'Review'] as const;

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
      {STEPS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex-1 flex flex-col items-center relative">
            {i < STEPS.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 ${done ? 'bg-[#1a2d5a]' : 'bg-gray-200'}`}
                style={{ transform: 'translateY(-50%)' }}
              />
            )}
            <div
              className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-colors
                ${done   ? 'bg-[#1a2d5a] border-[#1a2d5a] text-white'
                : active ? 'bg-white border-[#1a2d5a] text-[#1a2d5a]'
                         : 'bg-white border-gray-300 text-gray-400'}`}
              style={{ ...FONT_SANS, fontWeight: 600 }}
            >
              {done ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`mt-1.5 text-xs ${active ? 'text-[#1a2d5a] font-semibold' : done ? 'text-[#1a2d5a]' : 'text-gray-400'}`}
              style={FONT_SANS}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-600 mb-1" style={FONT_SANS}>
          {label}{required && <span className="text-[#c8202d] ml-0.5">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/25 focus:border-[#1a2d5a]/60 transition-colors placeholder-gray-400';

function TogglePair<T extends string | number>({
  options, value, onChange,
}: { options: [string, T][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded-lg overflow-hidden">
      {options.map(([label, val]) => (
        <button
          key={String(val)}
          type="button"
          onClick={() => onChange(val)}
          className={`py-2.5 text-sm transition-colors ${
            value === val ? 'bg-[#1a2d5a] text-white font-semibold' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
          style={FONT_SANS}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-[#1a2d5a] text-base mb-0.5" style={{ ...FONT_SERIF, fontWeight: 700 }}>{title}</h3>
      <div className="h-px bg-gray-200 mt-1" />
      {subtitle && <p className="text-xs text-gray-500 mt-2" style={FONT_SANS}>{subtitle}</p>}
    </div>
  );
}

function StepBanner({ step, title }: { step: number; title: string }) {
  return (
    <div className="px-6 py-3 bg-[#deedf6] border-b border-[#b3d4e8]">
      <p className="text-[#1a2d5a] text-sm font-semibold" style={FONT_SANS}>
        Step {step} of 4 &nbsp;<span className="font-normal">{title}</span>
      </p>
    </div>
  );
}

// ── Tax Credit breakdown pill ─────────────────────────────────────────────────
function CreditBreakdown({
  donationTotal, taxCreditThisYear, futureCredit, taxYear,
}: {
  donationTotal: number;
  taxCreditThisYear: number;
  futureCredit: number;
  taxYear: 2025 | 2026;
}) {
  if (donationTotal <= 0) return null;

  return (
    <div className="rounded-xl border border-[#1a2d5a]/20 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#1a2d5a] flex items-center justify-between">
        <span className="text-white text-xs font-semibold" style={FONT_SANS}>Tax Credit Breakdown</span>
        <span className="text-white/70 text-xs" style={FONT_SANS}>A.R.S. § 43-1089</span>
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-100 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-gray-800" style={FONT_SANS}>Total Donation</p>
            <p className="text-xs text-gray-400" style={FONT_SANS}>Amount being processed</p>
          </div>
          <span className="text-[#1a2d5a] font-bold text-sm" style={FONT_SANS}>{fmt(donationTotal)}</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/60">
          <div>
            <p className="text-sm font-semibold text-emerald-800" style={FONT_SANS}>
              {taxYear} Tax Credit
            </p>
            <p className="text-xs text-emerald-600" style={FONT_SANS}>Claimed on your {taxYear} AZ return</p>
          </div>
          <span className="text-emerald-700 font-bold text-sm" style={FONT_SANS}>{fmt(taxCreditThisYear)}</span>
        </div>

        {futureCredit > 0 && (
          <div className="flex items-start justify-between px-4 py-3 bg-amber-50/60">
            <div className="flex-1 pr-3">
              <p className="text-sm font-semibold text-amber-800" style={FONT_SANS}>Future Tax Credit</p>
              <p className="text-xs text-amber-600 leading-relaxed" style={FONT_SANS}>
                Exceeds this year's credit limit — carried forward up to 5 years (A.R.S. § 43-1089)
              </p>
            </div>
            <span className="text-amber-700 font-bold text-sm shrink-0" style={FONT_SANS}>{fmt(futureCredit)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const LEGAL_NOTICE =
  "NOTICE: A school tuition organization cannot award, restrict, or reserve scholarships solely on the basis of a donor's recommendation. A taxpayer may not claim a tax credit if the taxpayer agrees to swap donations with another taxpayer to benefit either taxpayer's own dependent. A.R.S. 43-1603 (C). Any designation of your own dependent as a potential recipient is prohibited.";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  campaignTitle: string;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export function TaxDeductibleModal({ campaignTitle, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(0); // 0–3 wizard, 4 = success

  // ── Step 1: Donor Info ────────────────────────────────────────────────────
  const [firstName,  setFirstName]  = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName,   setLastName]   = useState('');
  const [address,    setAddress]    = useState('');
  const [suite,      setSuite]      = useState('');
  const [state,      setState]      = useState('AZ');
  const [city,       setCity]       = useState('');
  const [zip,        setZip]        = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');

  // ── Step 2: Taxes ─────────────────────────────────────────────────────────
  const [designateStudent, setDesignateStudent] = useState<'yes' | 'no'>('no');
  const [studentName,      setStudentName]      = useState('');
  const [taxYear,          setTaxYear]          = useState<2025 | 2026>(2026);
  const [filingStatus,     setFilingStatus]     = useState<'single' | 'married'>('single');
  const [prevDonated,      setPrevDonated]      = useState<'yes' | 'no'>('no');
  const [prevAmount,       setPrevAmount]       = useState('');
  const [donationInput,    setDonationInput]    = useState('');
  const [taxAcknowledged,  setTaxAcknowledged]  = useState(false);

  // ── Step 3: Payments ──────────────────────────────────────────────────────
  const [sameAddress, setSameAddress] = useState(true);
  const [billAddress, setBillAddress] = useState('');
  const [billCity,    setBillCity]    = useState('');
  const [billState,   setBillState]   = useState('AZ');
  const [billZip,     setBillZip]     = useState('');
  const [cardNum,     setCardNum]     = useState('');
  const [expiry,      setExpiry]      = useState('');
  const [cvv,         setCvv]         = useState('');

  // ── Step 4: Review ────────────────────────────────────────────────────────
  const [confirmed,   setConfirmed]   = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  // ── Computed tax credit values ────────────────────────────────────────────
  const maxCredit        = TAX_LIMITS[taxYear][filingStatus];
  const prevAmtNum       = parseFloat(prevAmount) || 0;
  const availableCredit  = Math.max(0, maxCredit - prevAmtNum);
  const donationTotal    = parseFloat(donationInput) || 0;

  // No cap — donor gives any amount
  // Tax credit this year = up to available credit limit
  // Future credit = anything above that, carried forward up to 5 years
  const taxCreditThisYear = Math.min(donationTotal, availableCredit);
  const futureCredit      = Math.max(0, donationTotal - availableCredit);

  // ── Validation ────────────────────────────────────────────────────────────
  const step1Valid = firstName.trim() && lastName.trim() && address.trim() && city.trim() && zip.trim() && email.trim();
  const step2Valid = donationTotal > 0 && taxAcknowledged;

  function handleComplete() {
    onSuccess(donationTotal);
    setStep(4);
  }

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center">
          <div className="w-20 h-20 bg-[#edf2f8] rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-[#1a2d5a]/20">
            <BookOpen size={36} className="text-[#1a2d5a]" />
          </div>
          <h3 className="text-[#1a2d5a] mb-3" style={{ ...FONT_SERIF, fontWeight: 700, fontSize: '1.4rem' }}>
            Donation Complete! 🙏
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4" style={FONT_SANS}>
            Thank you, <strong className="text-[#1a2d5a]">{firstName} {lastName}</strong>! Your donation of{' '}
            <strong className="text-[#c8202d]">{fmt(donationTotal)}</strong> has been submitted.
          </p>

          {/* Credit summary on success */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mb-5 text-left">
            <div className="px-4 py-2 bg-[#1a2d5a]">
              <p className="text-white text-xs font-semibold" style={FONT_SANS}>Your Tax Credit Summary</p>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between items-center px-4 py-2.5 bg-emerald-50">
                <p className="text-xs font-semibold text-emerald-800" style={FONT_SANS}>{taxYear} Tax Credit</p>
                <p className="text-xs font-bold text-emerald-700" style={FONT_SANS}>{fmt(taxCreditThisYear)}</p>
              </div>
              {futureCredit > 0 && (
                <div className="flex justify-between items-center px-4 py-2.5 bg-amber-50">
                  <p className="text-xs font-semibold text-amber-800" style={FONT_SANS}>Future Tax Credit (carried forward)</p>
                  <p className="text-xs font-bold text-amber-700" style={FONT_SANS}>{fmt(futureCredit)}</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-400 text-xs" style={FONT_SANS}>
            Your AZ tax credit receipt will arrive within 30 days.
          </p>
          <button
            onClick={onClose}
            className="mt-5 px-8 py-3 bg-[#1a2d5a] hover:bg-[#142248] text-white rounded-xl text-sm transition-colors"
            style={{ ...FONT_SANS, fontWeight: 700 }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[96vh] flex flex-col overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-[#1a2d5a] text-base" style={{ ...FONT_SERIF, fontWeight: 700 }}>
              Tax Deductible Donation
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[340px]" style={FONT_SANS}>{campaignTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={18} />
          </button>
        </div>

        <Stepper current={step} />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* ══ STEP 1 — DONOR INFORMATION ═══════════════════════════════════ */}
          {step === 0 && (
            <>
              <StepBanner step={1} title="Donor Information" />
              <div className="p-6 space-y-5">
                <SectionHeading title="Donor Information" subtitle="Enter your personal information below." />

                <div className="grid grid-cols-3 gap-3">
                  <Field label="First Name" required>
                    <input className={inputCls} placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </Field>
                  <Field label="Middle Name">
                    <input className={inputCls} placeholder="Middle Name" value={middleName} onChange={e => setMiddleName(e.target.value)} />
                  </Field>
                  <Field label="Last Name" required>
                    <input className={inputCls} placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                  </Field>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-600" style={FONT_SANS}>
                    Billing Address <span className="text-[#c8202d]">*</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Street Address" value={address} onChange={e => setAddress(e.target.value)} />
                    <input className={inputCls} placeholder="Unit / Suite Number" value={suite} onChange={e => setSuite(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input className={inputCls} placeholder="State" value={state} onChange={e => setState(e.target.value)} maxLength={2} />
                    <input className={inputCls} placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
                    <input className={inputCls} placeholder="ZIP Code" value={zip} onChange={e => setZip(e.target.value)} maxLength={10} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Email Address" required>
                    <input className={inputCls} type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </Field>
                  <Field label="Phone Number">
                    <input className={inputCls} type="tel" placeholder="+1 (480) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
                  </Field>
                </div>
              </div>
            </>
          )}

          {/* ══ STEP 2 — TAX CREDIT ══════════════════════════════════════════ */}
          {step === 1 && (
            <>
              <StepBanner step={2} title="Tax Credit" />
              <div className="p-6 space-y-6">

                {/* Scholarship Designation */}
                <div>
                  <SectionHeading title="Scholarship Designation" />
                  <p className="text-xs text-gray-500 mb-3" style={FONT_SANS}>
                    Would you like to designate this donation for a specific student?
                  </p>
                  <TogglePair
                    options={[['Yes', 'yes'], ['No', 'no']]}
                    value={designateStudent}
                    onChange={setDesignateStudent}
                  />
                  {designateStudent === 'yes' && (
                    <div className="mt-3">
                      <input className={inputCls} placeholder="Student's Full Name" value={studentName} onChange={e => setStudentName(e.target.value)} />
                      <p className="text-xs text-amber-600 mt-1.5 flex items-start gap-1.5" style={FONT_SANS}>
                        <Info size={12} className="mt-0.5 shrink-0" />
                        You may not designate your own dependent. A.R.S. 43-1603 (C).
                      </p>
                    </div>
                  )}
                </div>

                {/* Tax Year */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2" style={FONT_SANS}>Tax Year</p>
                  <TogglePair
                    options={[['2025 Tax Year', 2025], ['2026 Tax Year', 2026]]}
                    value={taxYear}
                    onChange={setTaxYear}
                  />
                </div>

                {/* Filing Status */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1" style={FONT_SANS}>Your Eligible Arizona Tax Credit</p>
                  <p className="text-xs text-gray-400 mb-2" style={FONT_SANS}>
                    Annual credit limit — Single <strong className="text-[#1a2d5a]">{fmt(TAX_LIMITS[taxYear].single)}</strong>
                    {' '}|{' '}
                    Married <strong className="text-[#1a2d5a]">{fmt(TAX_LIMITS[taxYear].married)}</strong>
                  </p>
                  <TogglePair
                    options={[['Single Max Credit', 'single'], ['Married Max Credit', 'married']]}
                    value={filingStatus}
                    onChange={setFilingStatus}
                  />
                  <div className="mt-2 px-3 py-2 bg-[#edf2f8] rounded-lg">
                    <p className="text-xs text-[#1a2d5a]" style={FONT_SANS}>
                      Your {taxYear} credit limit: <strong>{fmt(maxCredit)}</strong>
                    </p>
                  </div>
                </div>

                {/* Previous Donations */}
                <div>
                  <SectionHeading title="Previous Donations" />
                  <p className="text-xs text-gray-500 mb-3" style={FONT_SANS}>
                    Have you donated to another School Tuition Organization (STO) for the selected tax year?
                  </p>
                  <TogglePair
                    options={[['Yes — I previously donated', 'yes'], ["No — I haven't donated", 'no']]}
                    value={prevDonated}
                    onChange={setPrevDonated}
                  />
                  {prevDonated === 'yes' && (
                    <div className="mt-3 space-y-1">
                      <label className="text-xs font-semibold text-gray-600 block" style={FONT_SANS}>Amount donated to other STOs this year</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input className={`${inputCls} pl-7`} placeholder="0.00" type="number" min="0" value={prevAmount} onChange={e => setPrevAmount(e.target.value)} />
                      </div>
                      {prevAmtNum > 0 && (
                        <p className="text-xs text-[#1a2d5a]" style={FONT_SANS}>
                          Remaining credit available: <strong>{fmt(availableCredit)}</strong>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Donation Amount — NO CAP */}
                <div>
                  <SectionHeading title="Donation Amount" />
                  <p className="text-xs text-gray-500 mb-3" style={FONT_SANS}>
                    Enter any amount. Donations up to your credit limit qualify as an <strong>immediate tax credit</strong>. Amounts above the limit are carried forward as a <strong>future tax credit</strong> for up to 5 years.
                  </p>

                  <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-600 block mb-1" style={FONT_SANS}>Donation Amount</label>
                    <div className="relative border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1a2d5a]/25">
                      <span className="absolute left-0 top-0 bottom-0 flex items-center px-3 bg-gray-50 border-r border-gray-300 text-gray-500 text-sm">$</span>
                      <input
                        className="w-full pl-10 pr-3 py-2.5 text-sm focus:outline-none"
                        placeholder="0.00"
                        type="number"
                        min="0"
                        value={donationInput}
                        onChange={e => setDonationInput(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1" style={FONT_SANS}>Arizona Christian Tuition Donation Total — no maximum</p>
                  </div>

                  {/* Quick-fill */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[availableCredit, maxCredit * 1.5, maxCredit * 2]
                      .filter((v, i, a) => a.indexOf(v) === i && v > 0)
                      .slice(0, 4)
                      .map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDonationInput(amt.toFixed(2))}
                          className="px-3 py-1.5 text-xs border border-[#1a2d5a]/30 text-[#1a2d5a] rounded-lg hover:bg-[#edf2f8] transition-colors"
                          style={FONT_SANS}
                        >
                          {amt === availableCredit ? `Max Credit ${fmt(amt)}` : fmt(amt)}
                        </button>
                      ))}
                  </div>

                  {/* Live tax credit breakdown */}
                  <CreditBreakdown
                    donationTotal={donationTotal}
                    taxCreditThisYear={taxCreditThisYear}
                    futureCredit={futureCredit}
                    taxYear={taxYear}
                  />

                  {/* Acknowledgment */}
                  <div className="mt-4">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={taxAcknowledged}
                        onChange={e => setTaxAcknowledged(e.target.checked)}
                        className="mt-0.5 accent-[#1a2d5a] w-4 h-4 shrink-0"
                      />
                      <span className="text-xs text-gray-600" style={FONT_SANS}>
                        I acknowledge that I understand the tax credit information provided, including any amounts carried forward as future credits.
                      </span>
                    </label>
                  </div>

                  {/* Legal */}
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-500 leading-relaxed" style={FONT_SANS}>{LEGAL_NOTICE}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ STEP 3 — PAYMENT ═════════════════════════════════════════════ */}
          {step === 2 && (
            <>
              <StepBanner step={3} title="Payment Information" />
              <div className="p-6 space-y-6">

                <div>
                  <SectionHeading title="Billing Address" />
                  <label className="flex items-center gap-2.5 cursor-pointer mb-4">
                    <input type="checkbox" checked={sameAddress} onChange={e => setSameAddress(e.target.checked)} className="accent-[#1a2d5a] w-4 h-4" />
                    <span className="text-sm text-gray-600" style={FONT_SANS}>Billing address same as donor address</span>
                  </label>

                  {sameAddress ? (
                    <div className="px-4 py-3 bg-[#edf2f8] rounded-xl text-sm text-gray-600 space-y-0.5" style={FONT_SANS}>
                      <p className="font-semibold text-[#1a2d5a]">{firstName} {lastName}</p>
                      <p>{address}{suite ? `, ${suite}` : ''}</p>
                      <p>{city}, {state} {zip}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input className={inputCls} placeholder="Street Address" value={billAddress} onChange={e => setBillAddress(e.target.value)} />
                      <div className="grid grid-cols-3 gap-3">
                        <input className={inputCls} placeholder="State" value={billState} onChange={e => setBillState(e.target.value)} maxLength={2} />
                        <input className={inputCls} placeholder="City" value={billCity} onChange={e => setBillCity(e.target.value)} />
                        <input className={inputCls} placeholder="ZIP Code" value={billZip} onChange={e => setBillZip(e.target.value)} maxLength={10} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <SectionHeading title="Card Information" subtitle="Enter your payment information below." />
                  <div className="space-y-3">
                    <Field label="Card Number" required>
                      <input
                        className={inputCls}
                        placeholder="4242 4242 4242 4242"
                        value={cardNum}
                        maxLength={19}
                        onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Expiration Date" required>
                        <input className={inputCls} placeholder="MM / YY" value={expiry} maxLength={7} onChange={e => setExpiry(e.target.value)} />
                      </Field>
                      <Field label="CVV" required>
                        <input className={inputCls} placeholder="123" value={cvv} maxLength={4} onChange={e => setCvv(e.target.value)} />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700" style={FONT_SANS}>
                      Demo only — no real payment is processed. In production, payments are handled securely through ACT's certified payment processor.
                    </p>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-[#edf2f8] rounded-xl border border-[#1a2d5a]/10 space-y-2">
                  <p className="text-xs font-semibold text-[#1a2d5a] mb-1" style={FONT_SANS}>Donation Summary</p>
                  <div className="flex justify-between text-sm" style={FONT_SANS}>
                    <span className="text-gray-500">Total Donation</span>
                    <span className="font-bold text-[#1a2d5a]">{fmt(donationTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={FONT_SANS}>
                    <span className="text-gray-500">{taxYear} Tax Credit</span>
                    <span className="font-semibold text-emerald-600">{fmt(taxCreditThisYear)}</span>
                  </div>
                  {futureCredit > 0 && (
                    <div className="flex justify-between text-sm" style={FONT_SANS}>
                      <span className="text-gray-500">Future Tax Credit</span>
                      <span className="font-semibold text-amber-600">{fmt(futureCredit)}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ══ STEP 4 — REVIEW ══════════════════════════════════════════════ */}
          {step === 3 && (
            <>
              <StepBanner step={4} title="Review" />
              <div className="p-6 space-y-6">
                <SectionHeading title="Review Your Donation" />

                <div className="px-4 py-2 bg-[#1a2d5a]/5 rounded-lg">
                  <p className="text-xs font-semibold text-[#1a2d5a] uppercase tracking-wide" style={FONT_SANS}>ACT Donation Summary</p>
                </div>

                {/* Donor Info */}
                <div>
                  <h4 className="text-[#1a2d5a] text-sm font-bold mb-3" style={FONT_SERIF}>Donor Information</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      ['First Name', firstName],
                      ['Last Name', lastName],
                      ['Billing Address', address + (suite ? `, ${suite}` : '')],
                      ['State', state],
                      ['City', city],
                      ['ZIP Code', zip],
                      ['Email', email],
                      ['Phone', phone || '—'],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400" style={FONT_SANS}>{label}</p>
                        <p className="text-sm font-medium text-gray-800" style={FONT_SANS}>{val || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Scholarship */}
                <div>
                  <h4 className="text-[#1a2d5a] text-sm font-bold mb-2" style={FONT_SERIF}>Scholarship Designation</h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500" style={FONT_SANS}>Designating for specific student</span>
                      <span className="font-medium text-gray-800" style={FONT_SANS}>{designateStudent === 'yes' ? 'Yes' : 'No'}</span>
                    </div>
                    {designateStudent === 'yes' && (
                      <div className="flex justify-between">
                        <span className="text-gray-500" style={FONT_SANS}>Student Name</span>
                        <span className="font-medium text-gray-800" style={FONT_SANS}>{studentName || '—'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Financial breakdown */}
                <div>
                  <h4 className="text-[#1a2d5a] text-sm font-bold mb-3" style={FONT_SERIF}>Tax Credit Information</h4>
                  <div className="space-y-2 text-sm mb-4">
                    {[
                      ['Tax Year', String(taxYear)],
                      ['Filing Status', filingStatus === 'single' ? 'Single' : 'Married Filing Jointly'],
                      ['Credit Limit', fmt(maxCredit)],
                      ['Previous STO Donations', prevDonated === 'yes' ? fmt(prevAmtNum) : '$0.00'],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-500" style={FONT_SANS}>{label}</span>
                        <span className="font-medium text-gray-800" style={FONT_SANS}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Full credit breakdown widget */}
                  <CreditBreakdown
                    donationTotal={donationTotal}
                    taxCreditThisYear={taxCreditThisYear}
                    futureCredit={futureCredit}
                    taxYear={taxYear}
                  />
                </div>

                <div className="h-px bg-gray-100" />

                <p className="text-sm text-gray-500" style={FONT_SANS}>Please review your donation information above before completing.</p>

                {/* Confirmation checkboxes */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2" style={FONT_SANS}>Confirmation</p>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-0.5 accent-[#1a2d5a] w-4 h-4 shrink-0" />
                      <span className="text-xs text-gray-600" style={FONT_SANS}>
                        I agree to the <span className="text-[#1a2d5a] underline cursor-pointer">terms and conditions</span> and confirm that all information provided is accurate.
                      </span>
                    </label>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-500 leading-relaxed" style={FONT_SANS}>{LEGAL_NOTICE}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2" style={FONT_SANS}>GDPR</p>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={gdprConsent} onChange={e => setGdprConsent(e.target.checked)} className="mt-0.5 accent-[#1a2d5a] w-4 h-4 shrink-0" />
                      <span className="text-xs text-gray-600" style={FONT_SANS}>
                        I consent to Arizona Christian Tuition storing my submitted information so they can respond to my inquiry.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer navigation ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-6 py-4">
          {step === 0 && (
            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                disabled={!step1Valid}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm transition-colors"
                style={{ ...FONT_SANS, fontWeight: 700 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl text-sm" style={FONT_SANS}>Previous</button>
              <button
                onClick={() => setStep(2)}
                disabled={!step2Valid}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm transition-colors"
                style={{ ...FONT_SANS, fontWeight: 700 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl text-sm" style={FONT_SANS}>Previous</button>
              <button
                onClick={() => setStep(3)}
                disabled={!cardNum || !expiry || !cvv}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm transition-colors"
                style={{ ...FONT_SANS, fontWeight: 700 }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl text-sm" style={FONT_SANS}>Previous</button>
              <button
                onClick={handleComplete}
                disabled={!confirmed || !gdprConsent}
                className="flex items-center gap-2 px-8 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm transition-colors"
                style={{ ...FONT_SANS, fontWeight: 700 }}
              >
                Complete Donation — {fmt(donationTotal)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
