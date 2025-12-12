import { useState } from "react";
import { useLocation, Link } from "react-router";

interface PlatformContent {
  platform: string;
  content: string;
  performance?: {
    engagement: number;
    reach: number;
    score: number;
  };
  needsImage: boolean;
  generatedImage?: string;
}

export function Dashboard() {
  const location = useLocation();
  const results = location.state?.results || null;
  const imagePreview = location.state?.imagePreview || null;

  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>(
    {}
  );

  // Mock platform data - in real app, this would come from the API
  const platforms: PlatformContent[] = [
    {
      platform: "Instagram",
      content:
        results?.social_thread?.[0] || "Your Instagram post content here...",
      performance: { engagement: 85, reach: 1200, score: 92 },
      needsImage: true,
    },
    {
      platform: "Twitter/X",
      content:
        results?.social_thread?.join("\n\n") || "Your Twitter thread here...",
      performance: { engagement: 72, reach: 850, score: 78 },
      needsImage: false,
    },
    {
      platform: "LinkedIn",
      content: results?.blog_intro || "Your LinkedIn post content here...",
      performance: { engagement: 68, reach: 650, score: 75 },
      needsImage: false,
    },
    {
      platform: "Medium Blog",
      content: results?.blog_intro || "Your blog post content here...",
      performance: { engagement: 91, reach: 2100, score: 95 },
      needsImage: false,
    },
  ];

  const handleEdit = (platform: string, content: string) => {
    setEditingPlatform(platform);
    setEditedContent({ ...editedContent, [platform]: content });
  };

  const handleSave = (platform: string) => {
    // In real app, save to backend
    setEditingPlatform(null);
  };

  const handleGenerateImage = (platform: string) => {
    // In real app, call image generation API
    console.log(`Generating image for ${platform}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-orange-600";
  };

  return (
    <div className="min-h-screen bg-[#EAD7BA] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4">
            Your Marketing Toolkit
          </h1>
          <p className="font-primary text-xl text-[#342612]">
            Review and customize your content for each platform
          </p>
        </div>

        {imagePreview && (
          <div className="mb-8 bg-white rounded-lg border-2 border-[#6C5F48] p-4">
            <img
              src={imagePreview}
              alt="Uploaded artwork"
              className="max-w-md mx-auto rounded-lg"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.platform}
              className="bg-white rounded-lg border-2 border-[#6C5F48] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-primary text-2xl font-bold text-[#342612]">
                  {platform.platform}
                </h2>
                {platform.performance && (
                  <div className="text-right">
                    <div
                      className={`font-primary text-2xl font-bold ${getScoreColor(
                        platform.performance.score
                      )}`}
                    >
                      {platform.performance.score}%
                    </div>
                    <div className="font-primary text-xs text-[#342612]/70">
                      Performance Score
                    </div>
                  </div>
                )}
              </div>

              {platform.performance && (
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-[#EAD7BA]/30 rounded-lg">
                  <div>
                    <div className="font-primary text-sm text-[#342612]/70">
                      Engagement
                    </div>
                    <div className="font-primary text-lg font-semibold text-[#342612]">
                      {platform.performance.engagement}%
                    </div>
                  </div>
                  <div>
                    <div className="font-primary text-sm text-[#342612]/70">
                      Reach
                    </div>
                    <div className="font-primary text-lg font-semibold text-[#342612]">
                      {platform.performance.reach}
                    </div>
                  </div>
                </div>
              )}

              {platform.needsImage && (
                <div className="mb-4">
                  <button
                    onClick={() => handleGenerateImage(platform.platform)}
                    className="w-full bg-[#813837] text-[#EAD7BA] px-4 py-2 rounded-lg font-primary text-sm font-semibold hover:bg-[#813837]/90 transition-colors mb-2"
                  >
                    Generate Platform Image
                  </button>
                  {platform.generatedImage && (
                    <img
                      src={platform.generatedImage}
                      alt={`${platform.platform} image`}
                      className="w-full rounded-lg border border-[#6C5F48]"
                    />
                  )}
                </div>
              )}

              <div className="mb-4">
                {editingPlatform === platform.platform ? (
                  <div className="space-y-2">
                    <textarea
                      value={
                        editedContent[platform.platform] || platform.content
                      }
                      onChange={(e) =>
                        setEditedContent({
                          ...editedContent,
                          [platform.platform]: e.target.value,
                        })
                      }
                      className="w-full p-3 border-2 border-[#6C5F48] rounded-lg font-primary text-[#342612] resize-none"
                      rows={6}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(platform.platform)}
                        className="flex-1 bg-[#813837] text-[#EAD7BA] px-4 py-2 rounded-lg font-primary text-sm font-semibold hover:bg-[#813837]/90 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPlatform(null)}
                        className="flex-1 bg-transparent border-2 border-[#6C5F48] text-[#342612] px-4 py-2 rounded-lg font-primary text-sm font-semibold hover:bg-[#6C5F48]/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-primary text-[#342612] whitespace-pre-wrap mb-2">
                      {editedContent[platform.platform] || platform.content}
                    </p>
                    <button
                      onClick={() =>
                        handleEdit(
                          platform.platform,
                          editedContent[platform.platform] || platform.content
                        )
                      }
                      className="w-full bg-transparent border-2 border-[#6C5F48] text-[#342612] px-4 py-2 rounded-lg font-primary text-sm font-semibold hover:bg-[#6C5F48]/20 transition-colors"
                    >
                      Edit Content
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/app"
            className="inline-block bg-[#813837] text-[#EAD7BA] px-8 py-3 rounded-lg font-primary text-lg font-semibold hover:bg-[#813837]/90 transition-colors"
          >
            Upload Another Image
          </Link>
        </div>
      </div>
    </div>
  );
}
