import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

// Mock API response for testing
const getMockApiResponse = () => ({
  blog_intro: "This stunning piece of artwork showcases a perfect blend of creativity and technical mastery. The composition draws viewers in with its vibrant colors and thoughtful arrangement, making it an ideal subject for digital marketing. The visual elements suggest a story waiting to be told, perfect for engaging audiences across multiple platforms. Whether you're looking to promote this on social media or create compelling blog content, this artwork has the potential to captivate and inspire.",
  faqs: [
    {
      question: "What is the inspiration behind this artwork?",
      answer: "This piece draws inspiration from contemporary art movements, blending modern aesthetics with timeless artistic principles. The composition reflects a deep understanding of visual storytelling and emotional resonance."
    },
    {
      question: "What techniques were used in creating this piece?",
      answer: "The artwork employs a combination of digital and traditional techniques, resulting in a unique visual language that speaks to both classic and modern sensibilities. The color palette and composition work together to create a cohesive narrative."
    },
    {
      question: "How can I use this artwork for marketing purposes?",
      answer: "This artwork is perfect for social media campaigns, blog headers, product promotions, and brand storytelling. Its versatile composition makes it suitable for various marketing contexts and platforms."
    }
  ],
  social_thread: [
    "🎨 Just created something special! This new piece combines vibrant colors with thoughtful composition to tell a visual story. Sometimes art speaks louder than words. #Art #Creativity #DigitalArt",
    "The process of creating this was both challenging and rewarding. Every brushstroke (or pixel) was intentional, every color choice deliberate. What do you see when you look at it? #ArtProcess #CreativeJourney",
    "Art isn't just about what you see—it's about what you feel. This piece is ready to inspire, engage, and connect. Swipe to see more details! ✨ #ArtLovers #VisualStorytelling #CreativeContent"
  ],
  keywords: ["digital art", "contemporary art", "visual storytelling", "creative marketing", "art promotion"]
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
          await new Promise(resolve => setTimeout(resolve, 4000));
          data = getMockApiResponse();
        } else {
          // Convert base64 back to File
          const fileResponse = await fetch(fileData);
          const blob = await fileResponse.blob();
          const file = new File([blob], fileName, { type: fileType });
          
          const formData = new FormData();
          formData.append("file", file);

          const apiResponse = await fetch("http://localhost:8000/api/analyze-image", {
            method: "POST",
            body: formData,
          });

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
          await new Promise(resolve => setTimeout(resolve, 2000));
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

  return (
    <div className="min-h-screen bg-[#EAD7BA] p-6 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#813837] border-t-transparent"></div>
        </div>
        
        <h1 className="font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4">
          Processing Your Image
        </h1>
        <p className="font-primary text-xl text-[#342612] mb-12">
          Analyzing <span className="font-semibold">{fileName}</span> and generating your marketing toolkit...
        </p>

        {error ? (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
            <p className="font-primary text-lg text-red-800">{error}</p>
            <p className="font-primary text-sm text-red-600 mt-2">
              Redirecting back to upload page...
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border-2 border-[#6C5F48] p-8 space-y-4">
              {steps.map((step) => {
                const status = getStepStatus(step.index);
                return (
                  <div key={step.index} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        status === "complete"
                          ? "bg-[#813837] text-[#EAD7BA]"
                          : status === "active"
                          ? "bg-[#813837] text-[#EAD7BA] animate-pulse"
                          : "bg-[#6C5F48]/20 text-[#342612]/50"
                      }`}
                    >
                      {status === "complete" ? "✓" : step.index + 1}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-primary text-lg ${
                          status === "active"
                            ? "text-[#342612] font-semibold"
                            : status === "complete"
                            ? "text-[#342612]"
                            : "text-[#342612]/50"
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                    {status === "active" && (
                      <div className="w-32 h-2 bg-[#6C5F48]/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#813837] animate-pulse"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="font-primary text-sm text-[#342612]/70 mt-8">
              This usually takes 30-60 seconds...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

