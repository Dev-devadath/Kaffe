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
    <div className="min-h-screen bg-[#EAD7BA] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4 text-center">
          Upload Your Creative Work
        </h1>
        <p className="font-primary text-xl text-[#342612] mb-12 text-center max-w-2xl mx-auto">
          Upload your creative work or product image to transform it into a
          complete marketing toolkit
        </p>

        <div className="bg-white rounded-lg border-2 border-[#6C5F48] p-8">
          {!preview ? (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="animate-dashed-border rounded-lg p-12 text-center cursor-pointer hover:bg-[#EAD7BA]/20 transition-colors relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-[#813837]"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="font-primary text-xl text-[#342612] mb-2">
                  Drag and drop your image here
                </p>
                <p className="font-primary text-lg text-[#342612]/70 mb-4">
                  or click to browse
                </p>
                <p className="font-primary text-sm text-[#342612]/50">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg border-2 border-[#6C5F48]"
                />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-[#813837] text-[#EAD7BA] rounded-full p-2 hover:bg-[#813837]/90 transition-colors"
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
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="bg-transparent border-2 border-[#6C5F48] text-[#342612] px-6 py-3 rounded-lg font-primary text-lg font-semibold hover:bg-[#6C5F48]/20 transition-colors"
                >
                  Choose Different Image
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-[#813837] text-[#EAD7BA] px-8 py-3 rounded-lg font-primary text-lg font-semibold hover:bg-[#813837]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload & Process"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
