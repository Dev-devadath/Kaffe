import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

// API base URL - adjust based on your backend setup
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiResponse {
  status: "success" | "error";
  data?: {
    strategies: {
      instagram: {
        content: string;
        hashtags: string[];
        visual_direction: string;
      };
      linkedin: {
        content: string;
        hashtags: string[];
      };
      blog: {
        title: string;
        content: string;
      };
    };
    analytics: {
      overall_seo_strength: number;
      platform_metrics: {
        instagram: {
          score: number;
          est_reach: string;
          est_engagement: string;
        };
        linkedin: {
          score: number;
          est_reach: string;
          est_engagement: string;
        };
        blog: {
          score: number;
          est_reach: string;
          est_engagement: string;
        };
      };
    };
  };
  error?: string;
}

export function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileData = location.state?.fileData as string | undefined;
  const fileName = location.state?.fileName || "your image";
  const fileType = location.state?.fileType || "image/jpeg";
  const imagePreview = location.state?.imagePreview as string | undefined;
  const [currentStep, setCurrentStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const progressRef = useRef(1);

  // Keep ref in sync with state
  useEffect(() => {
    progressRef.current = progressPercent;
  }, [progressPercent]);

  useEffect(() => {
    if (!fileData) {
      navigate("/app");
      return;
    }

    const processImage = async () => {
      try {
        // Step 1: Analyzing Image (1% -> 20%)
        setCurrentStep(1);
        await animateProgress(20, 300);

        // Convert base64 string to blob
        const base64Data = fileData.split(",")[1] || fileData; // Remove data:image/...;base64, prefix if present
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: fileType });

        // Create FormData
        const formData = new FormData();
        formData.append("file", blob, fileName);

        // Step 2: Generating Content (20% -> 40%)
        setCurrentStep(2);
        await animateProgress(40, 300);

        // Step 3: Uploading and Processing (40% -> 80%)
        setCurrentStep(3);
        await animateProgress(60, 200);

        // Simulate progress during API call
        const progressInterval = setInterval(() => {
          setProgressPercent((prev) => {
            if (prev < 75) {
              const newValue = Math.min(prev + 2, 75);
              progressRef.current = newValue;
              return newValue;
            }
            return prev;
          });
        }, 200);

        // Call the API
        const response = await fetch(`${API_BASE_URL}/api/upload-temp-image`, {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        await animateProgress(80, 200);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const result: ApiResponse = await response.json();

        // Check if the response has the expected structure
        if (result.status === "success" && result.data) {
          // Step 4: Finalizing (80% -> 100%)
          setCurrentStep(4);
          animateProgress(100, 500);

          // Small delay to show final step
          await new Promise((resolve) => setTimeout(resolve, 500));

          navigate("/app/dashboard", {
            state: {
              apiResponse: result.data,
              imagePreview: imagePreview,
              fileName: fileName,
            },
          });
        } else {
          throw new Error(result.error || "Invalid response format from API");
        }
      } catch (error) {
        console.error("Processing error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to process image."
        );
        setTimeout(() => navigate("/app"), 3000);
      }
    };

    processImage();
  }, [fileData, fileName, fileType, navigate, imagePreview]);

  const steps = [
    { name: "Uploading", index: 0 },
    { name: "Analyzing Image", index: 1 },
    { name: "Generating Content", index: 2 },
    { name: "Optimizing for Platforms", index: 3 },
    { name: "Finalizing", index: 4 },
  ];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "complete";
    if (stepIndex === currentStep) return "active";
    return "pending";
  };

  // Smooth progress animation helper
  const animateProgress = (targetPercent: number, duration: number = 500) => {
    return new Promise<void>((resolve) => {
      const startPercent = progressRef.current;
      const startTime = Date.now();
      const difference = targetPercent - startPercent;

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = startPercent + difference * progress;
        const rounded = Math.min(Math.round(current), 100);
        progressRef.current = rounded;
        setProgressPercent(rounded);

        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(updateProgress);
    });
  };

  return (
    <div className="min-h-screen bg-[#EAD7BA] p-6 flex items-center justify-center font-primary">
      <div className="w-full max-w-3xl mx-auto">
                {/* Step Indicator */}
        <div className="flex justify-center items-center mb-12 font-mono-retro text-sm md:text-base tracking-widest text-[#6C5F48]">
          <span className="font-bold border-b-2 border-[#813837] text-[#813837]">
            1. UPLOAD
          </span>
          <span className="mx-4 font-bold  text-[#813837]">→</span>
          <span className="font-bold border-b-2 border-[#813837] text-[#813837]">2. ANALYZE</span>
          <span className="mx-4 text-[#6C5F48]/50">→</span>
          <span className="opacity-50">3. REPURPOSE</span>
        </div>
        {/* Main Card - White Background as requested due to contrast issues */}
        <div className="bg-[#FFFFFF] retro-card p-8 md:p-12 relative overflow-hidden shadow-[8px_8px_0px_#6C5F48]">
          <div className="flex flex-col items-center mb-10 relative z-20">
            {/* Retro Loader - Updated for Light Background */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#EAD7BA] border-opacity-50"></div>
              <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-[#813837] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center font-mono-retro text-lg text-[#813837] font-bold">
                {Math.round(progressPercent)}%
              </div>
            </div>

            <h1 className="font-primary text-3xl md:text-5xl font-bold text-[#342612] mb-2 uppercase tracking-widest text-shadow-retro">
              System Processing
            </h1>
            <p className="font-mono-retro text-sm text-[#6C5F48] mb-4">
              TARGET: {fileName}
            </p>
          </div>

          {error ? (
            <div className="bg-[#813837]/10 border-l-4 border-[#813837] p-4 mb-4 font-mono-retro">
              <p className="text-[#813837] font-bold">ERROR: {error}</p>
              <p className="text-[#813837]/70 text-sm mt-2">
                &gt; Rerouting to upload sequence...
              </p>
            </div>
          ) : (
            /* Terminal Box - Dark high-contrast area for logs */
            <div className="retro-card bg-[#342612] p-6 rounded-none border-2 border-[#6C5F48] min-h-[200px] flex flex-col justify-end relative z-20 overflow-hidden shadow-none">
              {/* CRT Effects restricted to Terminal */}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(234,215,186,0.1)_50%)] bg-[length:100%_4px] z-10"></div>
              <div className="absolute inset-0 pointer-events-none radial-gradient z-10 opacity-20"></div>

              <div className="font-mono-retro text-left relative z-20">
                {steps.map((step) => {
                  const status = getStepStatus(step.index);
                  if (status === "pending") return null;

                  return (
                    <div
                      key={step.index}
                      className={`mb-2 ${status === "active" ? "text-[#EAD7BA]" : "text-[#EAD7BA]/50"}`}
                    >
                      <span className="mr-2">
                        {status === "complete" ? "[OK]" : "[..]"}
                      </span>
                      <span
                        className={status === "active" ? "animate-pulse" : ""}
                      >
                        &gt; {step.name}...
                      </span>
                      {status === "active" && (

                        <span className="inline-block w-2 H-4 bg-[#EAD7BA] ml-1 animate-pulse">
                          _
                        </span>
                      )}
                    </div>
                  );
                })}

                <div className="mt-4 border-t border-[#6C5F48]/50 pt-2 text-xs text-[#EAD7BA]/40">
                  SYSTEM_ID: KFE-2024-X // MEM: OK // CPU: OPTIMAL
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
