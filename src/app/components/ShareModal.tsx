import { useState, useRef } from 'react';
import { X, Mail, MessageSquare, Download, Link as LinkIcon, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

interface ShareModalProps {
  campaignUrl: string;
  campaignTitle: string;
  campaignDescription: string;
  onClose: () => void;
}

export function ShareModal({ campaignUrl, campaignTitle, campaignDescription, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(campaignUrl);
      setCopied(true);
      toast.success('Campaign link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that block clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = campaignUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('Campaign link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        toast.error('Failed to copy link. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out: ${campaignTitle}`);
    const body = encodeURIComponent(
      `I thought you might be interested in this campaign:\n\n${campaignTitle}\n${campaignDescription}\n\n${campaignUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    toast.success('Opening email client...');
  };

  const handleSMSShare = () => {
    const text = encodeURIComponent(
      `Check out this campaign: ${campaignTitle}\n${campaignUrl}`
    );
    // SMS URI scheme (works on mobile devices)
    window.open(`sms:?body=${text}`, '_blank');
    toast.success('Opening SMS...');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(campaignUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      '_blank',
      'width=600,height=400'
    );
    toast.success('Opening Facebook...');
  };

  const handleXShare = () => {
    const text = encodeURIComponent(`Check out: ${campaignTitle}`);
    const url = encodeURIComponent(campaignUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      '_blank',
      'width=600,height=400'
    );
    toast.success('Opening X (Twitter)...');
  };

  const handleInstagramShare = async () => {
    // Instagram doesn't support direct URL sharing via web
    // Copy link and inform user to paste in Instagram
    try {
      await navigator.clipboard.writeText(campaignUrl);
      toast.info('Link copied! Open Instagram app and paste the link in your story or post.');
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = campaignUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.info('Link copied! Open Instagram app and paste the link in your story or post.');
      } catch (e) {
        toast.error('Please copy the link manually to share on Instagram.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    // Create a canvas and draw the SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Download the canvas as PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `campaign-qr-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          toast.success('QR Code downloaded!');
        }
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopyQR = async () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            toast.success('QR Code copied to clipboard!');
          }
        });
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err) {
      toast.error('Failed to copy QR code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2
            className="text-[#1a2d5a]"
            style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.25rem' }}
          >
            Share Campaign
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#edf2f8] rounded-full transition-colors text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign Info */}
          <div className="p-4 bg-[#edf2f8] rounded-xl border border-[#1a2d5a]/10">
            <p
              className="text-[#1a2d5a] font-bold mb-1"
              style={{ fontFamily: 'Merriweather, Georgia, serif' }}
            >
              {campaignTitle}
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              {campaignDescription}
            </p>
          </div>

          {/* Share Options */}
          <div>
            <h3
              className="text-[#1a2d5a] mb-3 text-sm"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
            >
              Share via
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Email */}
              <button
                onClick={handleEmailShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-[#edf2f8] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Email
                </span>
              </button>

              {/* SMS */}
              <button
                onClick={handleSMSShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-[#edf2f8] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare size={20} className="text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  SMS
                </span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-[#edf2f8] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Facebook
                </span>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={handleXShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-[#edf2f8] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  X
                </span>
              </button>

              {/* Instagram */}
              <button
                onClick={handleInstagramShare}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-[#edf2f8] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Instagram
                </span>
              </button>
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <h3
              className="text-[#1a2d5a] mb-3 text-sm"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
            >
              Campaign Link
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={campaignUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                onClick={handleCopyLink}
                className={`px-6 py-3 rounded-xl transition-all font-semibold text-sm flex items-center gap-2 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#1a2d5a] hover:bg-[#142248] text-white'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <LinkIcon size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <h3
              className="text-[#1a2d5a] mb-3 text-sm"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
            >
              QR Code
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-[#edf2f8] rounded-xl border border-[#1a2d5a]/10">
              <div ref={qrRef} className="bg-white p-4 rounded-xl border border-gray-200">
                <QRCodeSVG
                  value={campaignUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="flex-1 space-y-2 w-full sm:w-auto">
                <p className="text-xs text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Scan this QR code to visit the campaign page directly
                </p>
                <button
                  onClick={handleDownloadQR}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white rounded-lg transition-colors text-sm font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Download size={16} />
                  Download QR Code
                </button>
              </div>
            </div>
          </div>

          {/* Note about SMS */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              <strong>Note:</strong> SMS sharing opens your device's default messaging app. In production, Twilio SMS integration would allow sending messages directly through the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}