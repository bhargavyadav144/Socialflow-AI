import React from 'react';
import { X, ShieldCheck, Lock, FileText } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f17] border border-blue-500/30 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col font-sans">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white font-outfit">Terms of Service & Privacy Policy</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-2">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white font-outfit text-sm mb-1 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-400" />
              1. Master Service Agreement
            </h4>
            <p>
              By accessing SocialFlow AI, you agree to connect read-only OAuth credentials for social account performance tracking. All accumulated memories stored in Hindsight memory banks belong strictly to your account workspace.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white font-outfit text-sm mb-1 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-cyan-400" />
              2. Data Protection & Privacy Policy
            </h4>
            <p>
              We enforce strict memory isolation using bank namespaces (`socialflow_user_X`). Your social media telemetry, post metrics, and brand memories are never shared with external third parties or used for global model retraining.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-bold text-white font-outfit text-sm mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              3. Email Verification & OTP Security
            </h4>
            <p>
              Email verification via 6-digit OTP codes ensures authorized registration and secures your persistent agent memory bank against unauthorized access.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl brand-gradient-btn font-semibold text-xs transition cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}

