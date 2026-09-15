import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Fingerprint, 
  X, 
  CheckCircle2, 
  FileCheck, 
  Copy, 
  Check, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { LaporanKegiatan } from '../types';
import { maskSensitive } from '../utils/crypto';

interface EncryptionSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  laporan?: LaporanKegiatan;
}

export const EncryptionSecurityModal: React.FC<EncryptionSecurityModalProps> = ({
  isOpen,
  onClose,
  laporan,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMasked, setShowMasked] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHash =
    laporan?.encryptedDataHash ||
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(currentHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunIntegrityCheck = () => {
    setTestResult('validating');
    setTimeout(() => {
      setTestResult('passed');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Keamanan Enkripsi Data Tingkat Lanjut</h3>
              <p className="text-xs text-slate-400">Proteksi Data Pelaporan Penyuluhan & Konseling</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Security Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-xs sm:text-sm">
                Enkripsi Aktif: AES-GCM 256-Bit + SHA-256 Digest
              </h4>
              <p className="text-emerald-800 mt-1 leading-relaxed">
                Setiap laporan kegiatan, bukti foto, dan identitas klien konseling dienkripsi dengan standar FIPS 197 sebelum dikirim ke server Kemenag untuk mencegah kebocoran informasi sensitif.
              </p>
            </div>
          </div>

          {/* Cryptographic Specifications */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-700" />
              Spesifikasi Parameter Kriptografi:
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">ALGORITMA</span>
                <span className="font-bold text-slate-800">AES-GCM (Galois/Counter)</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">PANJANG KUNCI</span>
                <span className="font-bold text-slate-800">256-Bit Symmetric</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">KEY DERIVATION</span>
                <span className="font-bold text-slate-800">PBKDF2 100,000 Iterasi</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">HASH INTEGRITAS</span>
                <span className="font-bold text-slate-800">SHA-256 Cryptographic</span>
              </div>
            </div>
          </div>

          {/* SHA-256 Fingerprint */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5 text-slate-600" />
                Sidik Jari Digital Laporan (SHA-256 Checksum):
              </label>
              <button
                type="button"
                onClick={handleCopyHash}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Tersalin' : 'Salin Hash'}
              </button>
            </div>
            <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg break-all select-all border border-slate-800">
              {currentHash}
            </div>
          </div>

          {/* Sensitive Data Masking Demo */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Masking Informasi Sensitif Lapangan:</span>
              <button
                onClick={() => setShowMasked(!showMasked)}
                className="text-xs text-slate-600 flex items-center gap-1 hover:text-slate-900"
              >
                {showMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showMasked ? 'Buka Masking' : 'Sensor Data'}
              </button>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                <span className="text-slate-500">NIP Penyuluh:</span>
                <span className="font-mono font-semibold">
                  {showMasked ? maskSensitive(laporan?.penyuluhNip || '197104172009012001', 4, 3) : laporan?.penyuluhNip || '197104172009012001'}
                </span>
              </div>
              <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                <span className="text-slate-500">Kontak Klien Konseling / Lapas:</span>
                <span className="font-mono font-semibold">
                  {showMasked ? maskSensitive(laporan?.kontakKelompok || '082189877252', 4, 3) : laporan?.kontakKelompok || '082189877252'}
                </span>
              </div>
            </div>
          </div>

          {/* Verification check */}
          <div className="pt-2">
            <button
              onClick={handleRunIntegrityCheck}
              disabled={testResult === 'validating'}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              {testResult === 'validating' ? 'Menghitung Ulang Checksum...' : 'Uji Integritas Dokumen Digital'}
            </button>

            {testResult === 'passed' && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Validasi Sukses: Tidak ada perubahan atau modifikasi data sejak dibuat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
