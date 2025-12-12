import { useState } from "react";
import { useNavigate } from "react-router";

export function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    // Convert file to base64 for passing through state
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Navigate to processing page with file data
      // The processing page will handle the actual API call
      navigate("/app/processing", {
        state: {
          fileData: base64String,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          imagePreview: preview,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAD7BA] p-6 font-primary">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex justify-center items-center mb-12 font-mono-retro text-sm md:text-base tracking-widest text-[#6C5F48]">
          <span className="font-bold border-b-2 border-[#813837] text-[#813837]">1. UPLOAD</span>
          <span className="mx-4 text-[#6C5F48]/50">→</span>
          <span className="opacity-50">2. ANALYZE</span>
          <span className="mx-4 text-[#6C5F48]/50">→</span>
          <span className="opacity-50">3. REPURPOSE</span>
        </div>

        <h1 className="font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-2 text-center text-shadow-retro uppercase">
          Inject Visual Data
        </h1>
        <p className="font-mono-retro text-lg text-[#342612] mb-12 text-center max-w-2xl mx-auto opacity-70">
          // Initialize sequence. Load artwork into the intake chute.
        </p>

        <div className="bg-[#FFFFFF] retro-card p-2 md:p-8">
          <div className="border-4 border-double border-[#6C5F48] p-1 rounded-sm">
            {!preview ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative overflow-hidden bg-[#EAD7BA]/10 border-2 border-dashed border-[#6C5F48] p-12 text-center cursor-pointer hover:bg-[#EAD7BA]/30 transition-colors group"
              >
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(108,95,72,0.25)_50%)] bg-[length:100%_4px]"></div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer relative z-10">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="mx-auto h-20 w-20 text-[#813837]"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="font-primary text-3xl text-[#342612] mb-2 uppercase tracking-wide">
                    Insert File to Begin
                  </p>
                  <p className="font-mono-retro text-base text-[#342612]/70 mb-6">
                    [ DRAG & DROP OR CLICK TO LOCATE ]
                  </p>
                  <div className="inline-block bg-[#6C5F48] text-[#EAD7BA] px-4 py-1 text-xs font-mono-retro uppercase tracking-widest">
                    Supported Formats: PNG, JPG (MAX 10MB)
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-8 p-4 bg-[#EAD7BA]/10">
                <div className="relative inline-block mx-auto border-2 border-[#342612] shadow-[4px_4px_0px_#342612]">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[500px] w-auto block grayscale-[20%] sepia-[20%] contrast-110"
                  />
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-4 -right-4 bg-[#813837] text-[#EAD7BA] border-2 border-[#342612] p-2 hover:bg-[#6C5F48] transition-colors shadow-[2px_2px_0px_#342612] active:translate-y-0.5 active:shadow-none"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="font-mono-retro text-[#342612] hover:text-[#813837] hover:underline underline-offset-4 decoration-2 uppercase text-sm tracking-wide"
                  >
                    [ Cancel Operation ]
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-[#813837] text-[#EAD7BA] px-10 py-4 font-primary text-xl font-bold uppercase tracking-wider hover:bg-[#EAD7BA] hover:text-[#813837] border-2 border-[#342612] transition-colors shadow-[4px_4px_0px_#342612] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "INITIATING PROCESS..." : "COMMENCE ANALYSIS"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
