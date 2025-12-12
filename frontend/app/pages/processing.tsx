import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

// Mock API response for testing
const getMockApiResponse = () => ({
  blog_intro:
    "This stunning piece of artwork showcases a perfect blend of creativity and technical mastery. The composition draws viewers in with its vibrant colors and thoughtful arrangement, making it an ideal subject for digital marketing. The visual elements suggest a story waiting to be told, perfect for engaging audiences across multiple platforms. Whether you're looking to promote this on social media or create compelling blog content, this artwork has the potential to captivate and inspire.",
  faqs: [
    {
      question: "What is the inspiration behind this artwork?",
      answer:
        "This piece draws inspiration from contemporary art movements, blending modern aesthetics with timeless artistic principles. The composition reflects a deep understanding of visual storytelling and emotional resonance.",
    },
    {
      question: "What techniques were used in creating this piece?",
      answer:
        "The artwork employs a combination of digital and traditional techniques, resulting in a unique visual language that speaks to both classic and modern sensibilities. The color palette and composition work together to create a cohesive narrative.",
    },
    {
      question: "How can I use this artwork for marketing purposes?",
      answer:
        "This artwork is perfect for social media campaigns, blog headers, product promotions, and brand storytelling. Its versatile composition makes it suitable for various marketing contexts and platforms.",
    },
  ],
  social_thread: [
    "🎨 Just created something special! This new piece combines vibrant colors with thoughtful composition to tell a visual story. Sometimes art speaks louder than words. #Art #Creativity #DigitalArt",
    "The process of creating this was both challenging and rewarding. Every brushstroke (or pixel) was intentional, every color choice deliberate. What do you see when you look at it? #ArtProcess #CreativeJourney",
    "Art isn't just about what you see—it's about what you feel. This piece is ready to inspire, engage, and connect. Swipe to see more details! ✨ #ArtLovers #VisualStorytelling #CreativeContent",
  ],
  keywords: [
    "digital art",
    "contemporary art",
    "visual storytelling",
    "creative marketing",
    "art promotion",
  ],
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
  const [useMockData] = useState(true); // Set to false when backend is ready

  useEffect(() => {
    if (!fileData) {
      // If no file, redirect back to upload
      navigate("/app");
      return;
    }

    // Process the image
    const processImage = async () => {
      try {
        setCurrentStep(1); // Analyzing Image

        // Simulate step progression
        setTimeout(() => setCurrentStep(2), 1000); // Generating Content
        setTimeout(() => setCurrentStep(3), 2000); // Optimizing for Platforms
        setTimeout(() => setCurrentStep(4), 3000); // Finalizing

        let data;

        if (useMockData) {
          // Use mock data for testing
          console.log("Using mock API data for testing");
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 4000));
          data = getMockApiResponse();
        } else {
          // Convert base64 back to File
          const fileResponse = await fetch(fileData);
          const blob = await fileResponse.blob();
          const file = new File([blob], fileName, { type: fileType });

          const formData = new FormData();
          formData.append("file", file);

          const apiResponse = await fetch(
            "http://localhost:8000/api/analyze-image",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!apiResponse.ok) {
            throw new Error("Processing failed");
          }

          data = await apiResponse.json();
        }

        // Navigate to dashboard with results
        navigate("/app/dashboard", {
          state: {
            results: data,
            imagePreview: imagePreview,
          },
        });
      } catch (error) {
        console.error("Processing error:", error);
        // If API fails and we're not using mock data, try mock data as fallback
        if (!useMockData) {
          console.log("API failed, falling back to mock data");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const mockData = getMockApiResponse();
          navigate("/app/dashboard", {
            state: {
              results: mockData,
              imagePreview: imagePreview,
            },
          });
        } else {
          setError("Failed to process image. Please try again.");
          setTimeout(() => {
            navigate("/app");
          }, 3000);
        }
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

  // Calculate progress percentage based on step
  const progressPercent = Math.min(((currentStep + 1) / 5) * 100, 100);

  return (
    <div className="min-h-screen bg-[#EAD7BA] p-6 flex items-center justify-center font-primary">
      <div className="w-full max-w-3xl mx-auto">
        {/* Main Card - White Background as requested */}
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
            /* Terminal Box - Dark contrast area */
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

                <div className="mt-4 border-t border-[#6C5F48]/50 pt-2 text-xs text-[#342612]/40">
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
