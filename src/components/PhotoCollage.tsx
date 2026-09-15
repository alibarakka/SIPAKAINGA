import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Maximize2, X, Plus, Image as ImageIcon, Check } from 'lucide-react';
import { BuktiFoto, LocationCoordinate } from '../types';

interface PhotoCollageProps {
  photos: BuktiFoto[];
  onChange: (photos: BuktiFoto[]) => void;
  coordinate?: LocationCoordinate;
  readOnly?: boolean;
}

const SAMPLE_ACTIVITY_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    caption: 'Bimbingan tatap muka di aula KUA Somba Opu',
  },
  {
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    caption: 'Sesi penyampaian materi dan interaksi jamaah',
  },
  {
    url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&auto=format&fit=crop&q=80',
    caption: 'Kajian tadabbur ayat Al-Qur\'an dan tahsin',
  },
  {
    url: 'https://images.unsplash.com/photo-1584281722573-9a3b68452c92?w=800&auto=format&fit=crop&q=80',
    caption: 'Kelompok santri TPQ mengaji iqra dan hafalan',
  },
  {
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
    caption: 'Penyuluhan keagamaan warga binaan',
  },
];

export const PhotoCollage: React.FC<PhotoCollageProps> = ({
  photos,
  onChange,
  coordinate,
  readOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: BuktiFoto[] = [];
    (Array.from(files) as File[]).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push({
            id: `foto-${Date.now()}-${index}`,
            url: event.target.result as string,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            timestamp: new Date().toISOString(),
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          });
          if (newPhotos.length === files.length) {
            onChange([...photos, ...newPhotos]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSamplePhoto = (sample: typeof SAMPLE_ACTIVITY_PHOTOS[0]) => {
    const newPhoto: BuktiFoto = {
      id: `foto-${Date.now()}`,
      url: sample.url,
      caption: sample.caption,
      timestamp: new Date().toISOString(),
      fileSize: '1.2 MB',
    };
    onChange([...photos, newPhoto]);
  };

  const handleRemovePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  // Render dynamic collage layout based on photo count
  const renderCollageLayout = () => {
    if (photos.length === 0) {
      return (
        <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50/50">
          <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">Belum ada bukti foto kegiatan</p>
          <p className="text-xs text-slate-500 mt-1">
            Unggah satu atau beberapa foto untuk otomatis disusun dalam kolase album rapi
          </p>
        </div>
      );
    }

    if (photos.length === 1) {
      const p = photos[0];
      return (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm aspect-video sm:aspect-21/9 max-h-96">
          <img
            src={p.url}
            alt={p.caption || 'Bukti Kegiatan'}
            className="w-full h-full object-cover"
          />
          {/* Geotag Stamp Watermark */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white p-2.5 rounded-lg text-xs flex flex-col sm:flex-row justify-between items-start sm:items-end gap-1">
            <div>
              <p className="font-semibold text-emerald-400 flex items-center gap-1">
                📍 {coordinate?.lokasiNama || 'Lokasi Kegiatan'} - {coordinate?.kelurahan || 'Somba Opu'}, Gowa
              </p>
              <p className="text-[11px] text-slate-300">
                GPS: {coordinate?.latitude?.toFixed(6) || '-5.201389'}, {coordinate?.longitude?.toFixed(6) || '119.452811'} (±{coordinate?.accuracy || 6}m)
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded">
              {new Date(p.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPhotoIndex(0)}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      );
    }

    if (photos.length === 2) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {photos.map((p, idx) => (
            <div
              key={p.id}
              className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs aspect-4/3"
            >
              <img src={p.url} alt={p.caption || 'Dokumentasi'} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 text-white">
                <p className="text-xs font-medium truncate">{p.caption || `Foto #${idx + 1}`}</p>
                <p className="text-[10px] text-emerald-400 font-mono">
                  Lat: {coordinate?.latitude?.toFixed(5) || '-5.2013'}, Lng: {coordinate?.longitude?.toFixed(5) || '119.4528'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(idx)}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (photos.length === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="md:col-span-2 relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs aspect-4/3 md:aspect-auto md:h-full">
            <img src={photos[0].url} alt={photos[0].caption} className="w-full h-full object-cover min-h-[220px]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 p-2.5 text-white">
              <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded text-emerald-100 font-bold uppercase tracking-wider mb-1 inline-block">Foto Utama</span>
              <p className="text-xs font-medium truncate">{photos[0].caption || 'Dokumentasi Utama'}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPhotoIndex(0)}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
            {photos.slice(1, 3).map((p, idx) => (
              <div key={p.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs aspect-4/3 md:h-32">
                <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1.5 text-white">
                  <p className="text-[11px] truncate">{p.caption || `Foto #${idx + 2}`}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(idx + 1)}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4+ photos: Creative Mosaic Collage
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {photos.slice(0, 4).map((p, idx) => {
          const isFeatured = idx === 0 && photos.length > 4;
          return (
            <div
              key={p.id}
              className={`relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs aspect-square cursor-pointer ${
                isFeatured ? 'col-span-2 row-span-2' : ''
              }`}
              onClick={() => setSelectedPhotoIndex(idx)}
            >
              <img src={p.url} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                <p className="text-[11px] font-medium truncate">{p.caption || `Foto ${idx + 1}`}</p>
              </div>
              {idx === 3 && photos.length > 4 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-bold text-base">
                  +{photos.length - 4} Foto Lainnya
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-600" />
            Kolase Album Bukti Foto Kegiatan ({photos.length} Foto)
          </h4>
          <p className="text-xs text-slate-500">
            Unggah foto lapangan asli dengan stempel koordinat real-time
          </p>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95 transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              Unggah Foto
            </button>
          </div>
        )}
      </div>

      {/* Render Album Collage */}
      {renderCollageLayout()}

      {/* Quick sample photo selector for testing & field demonstrations */}
      {!readOnly && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
            Pilih Foto Dokumentasi Contoh Kemenag Somba Opu (Klik untuk menambah ke kolase):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_ACTIVITY_PHOTOS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSamplePhoto(s)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 hover:border-emerald-500 text-[11px] text-slate-700 transition-all"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[160px]">{s.caption}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thumbnail List with delete & caption editor */}
      {!readOnly && photos.length > 0 && (
        <div className="space-y-2 border-t border-slate-200 pt-3">
          <span className="text-xs font-semibold text-slate-600">Daftar Keterangan Foto:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {photos.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-xs">
                <img src={p.url} alt="Thumbnail" className="w-10 h-10 rounded object-cover shrink-0" />
                <input
                  type="text"
                  value={p.caption || ''}
                  onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                  placeholder={`Keterangan foto #${idx + 1}`}
                  className="grow px-2 py-1 rounded border border-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(p.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                  title="Hapus foto ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[80vh] w-full flex flex-col items-center">
            <img
              src={photos[selectedPhotoIndex].url}
              alt={photos[selectedPhotoIndex].caption}
              className="max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-3 text-center text-white">
              <p className="text-sm font-semibold">{photos[selectedPhotoIndex].caption || 'Dokumentasi Lapangan'}</p>
              <p className="text-xs text-emerald-400 font-mono mt-1">
                Koordinat: {coordinate?.latitude}, {coordinate?.longitude} | {coordinate?.lokasiNama || 'Somba Opu'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
