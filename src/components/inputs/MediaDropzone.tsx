import { useState, useRef, useEffect } from 'react';
import { IconMovie, IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { MediaType } from '@/types/enums';

interface MediaDropzoneProps {
    mediaType: keyof typeof MediaType;
    onFileSelect: (file: File | null, previewUrl: string) => void;
    selectedFile: File | null;
}

export default function MediaDropzone({ mediaType, onFileSelect, selectedFile }: MediaDropzoneProps) {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [localPreview, setLocalPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync and clean up object URLs to protect client memory mapping
    useEffect(() => {
        if (!selectedFile) {
            if (localPreview) URL.revokeObjectURL(localPreview);
            setLocalPreview('');
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setLocalPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [selectedFile]);

    const processFile = (file: File) => {
        if (!file) return;

        if (mediaType === "IMAGE" && !file.type.startsWith('image/')) {
            return toast.error('Invalid type. Please upload an image file');
        }
        if (mediaType === "VIDEO" && !file.type.startsWith('video/')) {
            return toast.error('Invalid type. Please upload a video file');
        }
        if (mediaType === "DOCUMENT" && !['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
            return toast.error('Invalid type. Please upload a PDF or XLSX file');
        }
        // if (mediaType === "IMAGE" && file.size > 5 * 1024 * 1024) {
        //   return toast.error('Image size exceeds 5MB limit');
        // }
        // if (mediaType === 'audio' && file.size > 10 * 1024 * 1024) {
        //   return toast.error('Audio size exceeds 10MB limit');
        // }

        // Generate a temporary mock local URL for presentation layouts
        const previewUrl = URL.createObjectURL(file);
        onFileSelect(file, previewUrl);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="transition-all duration-200">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={mediaType === "IMAGE" ? 'image/*' : mediaType === "VIDEO" ? 'video/*' : '.pdf,.xlsx'}
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />

            {!selectedFile ? (
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${isDragging
                        ? 'border-orange-500 bg-orange-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                >
                    <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400 mb-2">
                        {
                            mediaType === "IMAGE" ? <IconPhoto size={20} className="animate-pulse" />
                                :
                                mediaType === "VIDEO" ? <IconMovie size={20} className="animate-pulse" />
                                    :
                                    <IconUpload size={20} className="animate-pulse" />
                        }
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload or drag & drop</p>
                    <p className="text-xs text-green-600 mt-0.5">
                        Supported format: {mediaType === "IMAGE" ? 'PNG, JPG, WEBP' : mediaType === "VIDEO" ? 'MP4, WEBM' : 'pdf, xlsx'}
                    </p>
                </div>
            ) : (
                <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-2 flex items-center gap-3">
                    {mediaType === "IMAGE" ? (
                        <img src={localPreview} alt="upload preview" className="h-14 w-14 object-cover rounded-lg border border-slate-200/60" />
                    ) : mediaType === "VIDEO" ? (
                        <video src={localPreview} className="h-14 w-14 object-cover rounded-lg border border-slate-200/60" muted />
                    ) : (
                        <div className="h-14 w-14 flex items-center justify-center rounded-lg border border-slate-200/60 bg-slate-100">
                            <audio src={localPreview} controls className="h-10 w-full" />
                        </div>
                    )

                    }
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onFileSelect(null, '')}
                        className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                    >
                        <IconX size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}