import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

// Mock API response for testing
const getMockApiResponse = () => ({
  blog_intro: "This stunning piece of artwork showcases a perfect blend...",
  faqs: [{ question: "Q?", answer: "A" }],
  social_thread: ["Tweet 1", "Tweet 2"],
  keywords: ["art", "vintage", "design"],
});

export function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileData = location.state?.fileData as string | undefined;
  const fileName = location.state?.fileName || "your image";
  const fileType = location.state?.fileType || "image/jpeg";
  const imagePreview = location.state?.imagePreview as string | undefined;
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [useMockData] = useState(true);

  useEffect(() => {
    if (!fileData) {
      navigate("/app");
      return;
    }

    const processImage = async () => {
      try {
        setCurrentStep(1);
        setTimeout(() => setCurrentStep(2), 1000);
        setTimeout(() => setCurrentStep(3), 2000);
        setTimeout(() => setCurrentStep(4), 3000);

        let data;
        if (useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          data = getMockApiResponse();
        }

        navigate("/app/dashboard", {
          state: { results: data, imagePreview: imagePreview },
        });
      } catch (error) {
        setError("Failed to process image.");
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

  const progressPercent = Math.min(((currentStep + 1) / 5) * 100, 100);

  return (
    <div className="min-h-screen bg-[#EAD7BA] p-6 flex items-center justify-center font-primary">
      <div className="w-full max-w-3xl mx-auto">
        {/* Main Card - White Background as requested due to contrast issues */}
        <div className="bg-[#FFFFFF] retro-card p-8 md:p-12 relative overflow-hidden shadow-[8px_8px_0px_#6C5F48]">

          <div className="flex flex-col items-center mb-10 relative z-20">
            {/* Retro Loader - Updated for Light Background */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#EAD7BA] border-opacity-50"></div>
              <div
                className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-[#813837] border-t-transparent animate-spin"
              ></div>
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
                    <div key={step.index} className={`mb-2 ${status === 'active' ? 'text-[#342612]' : 'text-[#342612]/50'}`}>
                      <span className="mr-2">
                        {status === "complete" ? "[OK]" : "[..]"}
                      </span>
                      <span className={status === "active" ? "animate-pulse" : ""}>
                        &gt; {step.name}...
                      </span>
                      {status === "active" && (
                        <span className="inline-block w-2 H-4 bg-[#342612] ml-1 animate-pulse">_</span>
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
