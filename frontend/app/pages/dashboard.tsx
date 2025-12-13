import { useState } from "react";
import { useLocation, Link } from "react-router";

interface PlatformContent {
  platform: string;
  content: string;
  title?: string;
  hashtags?: string[];
  visualDirection?: string;
  performance?: {
    engagement: string;
    reach: string;
    score: number;
  };
  needsImage: boolean;
  generatedImage?: string;
}

interface ApiData {
  output?: {
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
  };
  // Support legacy format as well
  strategies?: {
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
  analytics?: {
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
}

export function Dashboard() {
  const location = useLocation();
  const apiResponse = location.state?.apiResponse as ApiData | null;
  const imagePreview = location.state?.imagePreview || null;
  const fileName = location.state?.fileName || "PROJECT_ALPHA";

  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>(
    {}
  );

  // Extract data from nested or legacy structure
  const strategies =
    apiResponse?.output?.data?.strategies || apiResponse?.strategies;
  const analytics =
    apiResponse?.output?.data?.analytics || apiResponse?.analytics;

  // Build platform data from API response
  const platforms: PlatformContent[] =
    strategies && analytics
      ? [
          {
            platform: "Instagram",
            content:
              strategies?.instagram?.content ||
              "Instagram content not available",
            hashtags: strategies?.instagram?.hashtags || [],
            visualDirection: strategies?.instagram?.visual_direction || "",
            performance: {
              engagement:
                analytics?.platform_metrics?.instagram?.est_engagement || "N/A",
              reach: analytics?.platform_metrics?.instagram?.est_reach || "N/A",
              score: analytics?.platform_metrics?.instagram?.score || 0,
            },
            needsImage: false,
          },
          {
            platform: "LinkedIn",
            content:
              strategies?.linkedin?.content || "LinkedIn content not available",
            hashtags: strategies?.linkedin?.hashtags || [],
            performance: {
              engagement:
                analytics?.platform_metrics?.linkedin?.est_engagement || "N/A",
              reach: analytics?.platform_metrics?.linkedin?.est_reach || "N/A",
              score: analytics?.platform_metrics?.linkedin?.score || 0,
            },
            needsImage: false,
          },
          {
            platform: "Blog",
            title: strategies?.blog?.title || "Blog Post",
            content: strategies?.blog?.content || "Blog content not available",
            performance: {
              engagement:
                analytics?.platform_metrics?.blog?.est_engagement || "N/A",
              reach: analytics?.platform_metrics?.blog?.est_reach || "N/A",
              score: analytics?.platform_metrics?.blog?.score || 0,
            },
            needsImage: false,
          },
        ]
      : [];

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

  // Mock data for new analytics
  const trendsData = [20, 35, 45, 30, 55, 65, 80];
  const maxTrend = Math.max(...trendsData);
  const chartPoints = trendsData
    .map(
      (val, i) =>
        `${i * (100 / (trendsData.length - 1))},${100 - (val / maxTrend) * 100}`
    )
    .join(" ");

  return (
    <div className="min-h-screen bg-[#EAD7BA] p-6 font-primary">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-end">
          <div className="flex-1">
            <div className="border-b-2 border-[#6C5F48] mb-4 pb-2">
              <span className="bg-[#6C5F48] text-[#EAD7BA] px-3 py-1 font-mono-retro text-xs uppercase tracking-widest">
                Analytics Report
              </span>
            </div>
            <h1 className="font-primary text-5xl font-bold text-[#342612] uppercase tracking-tight text-shadow-retro leading-none">
              Marketing Toolkit
            </h1>
            <p className="font-mono-retro text-[#342612]/70 mt-2">
              REF: {fileName} // STATUS: COMPLETE
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              to="/app"
              className="bg-[#EAD7BA] text-[#342612] border-2 border-[#342612] px-6 py-3 font-bold uppercase hover:bg-[#342612] hover:text-[#EAD7BA] transition-colors shadow-[4px_4px_0px_#342612] active:translate-y-1 active:shadow-none"
            >
              New Project
            </Link>
            <button className="bg-[#813837] text-[#EAD7BA] border-2 border-[#342612] px-6 py-3 font-bold uppercase hover:bg-[#6C5F48] transition-colors shadow-[4px_4px_0px_#342612] active:translate-y-1 active:shadow-none">
              Export All
            </button>
          </div>
        </div>

        {/* Top Section: Image & Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {imagePreview && (
            <div className="lg:col-span-1 retro-card p-2 bg-white transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="border-2 border-[#6C5F48] h-full relative">
                <img
                  src={imagePreview}
                  alt="Uploaded artwork"
                  className="w-full h-full object-cover filter contrast-110 sepia-[0.2]"
                />
                <div className="absolute bottom-0 right-0 bg-[#813837] text-[#EAD7BA] px-3 py-1 font-mono-retro text-xs">
                  IMG_SRC_01
                </div>
              </div>
            </div>
          )}

          <div className="lg:col-span-2">
            {/* SEO Strength Meter */}
            <div className="bg-[#FFFFFF] retro-card p-6 flex flex-col justify-between">
              <h3 className="font-bold text-[#342612] uppercase border-b-2 border-[#6C5F48] pb-2 mb-4">
                SEO Strength
              </h3>
              <div className="flex items-end gap-4">
                <div className="text-6xl font-bold text-[#813837]">
                  {analytics?.overall_seo_strength || 0}
                  <span className="text-2xl text-[#6C5F48]">%</span>
                </div>
                <div className="mb-2 font-mono-retro text-xs text-[#342612]/70">
                  Keyword density optimal.
                  <br />
                  Readability high.
                </div>
              </div>
              <div className="w-full h-4 bg-[#EAD7BA] mt-4 border border-[#6C5F48] relative">
                <div
                  className="absolute top-0 left-0 h-full bg-[#813837]"
                  style={{
                    width: `${analytics?.overall_seo_strength || 0}%`,
                  }}
                ></div>
                {/* Ticks */}
                <div className="absolute top-0 left-1/4 h-full w-[1px] bg-[#6C5F48]/50"></div>
                <div className="absolute top-0 left-1/2 h-full w-[1px] bg-[#6C5F48]/50"></div>
                <div className="absolute top-0 left-3/4 h-full w-[1px] bg-[#6C5F48]/50"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Blocks */}
        {platforms.length > 0 ? (
          <>
            <h2 className="font-primary text-3xl font-bold text-[#342612] mb-8 border-b-2 border-[#342612] inline-block pr-12 pb-2">
              Generated Content Modules
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {platforms.map((platform) => (
                <div
                  key={platform.platform}
                  className="bg-white retro-card p-6 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6 border-b-2 border-[#EAD7BA] pb-4">
                    <h2 className="font-primary text-2xl font-bold text-[#342612] uppercase">
                      {platform.platform}
                    </h2>
                    {platform.performance && (
                      <div className="bg-[#EAD7BA] px-3 py-1 rounded-full border border-[#6C5F48] text-xs font-mono-retro font-bold text-[#342612]">
                        SCORE: {platform.performance.score}
                      </div>
                    )}
                  </div>

                  {platform.performance && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="border border-[#6C5F48] p-3 bg-[#EAD7BA]/10">
                        <div className="text-xs uppercase tracking-wider text-[#6C5F48] mb-1">
                          Engagement
                        </div>
                        <div className="text-2xl font-bold text-[#342612]">
                          {platform.performance.engagement}
                        </div>
                      </div>
                      <div className="border border-[#6C5F48] p-3 bg-[#EAD7BA]/10">
                        <div className="text-xs uppercase tracking-wider text-[#6C5F48] mb-1">
                          Potential Reach
                        </div>
                        <div className="text-lg font-bold text-[#342612]">
                          {platform.performance.reach}
                        </div>
                      </div>
                    </div>
                  )}

                  {platform.hashtags && platform.hashtags.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs uppercase tracking-wider text-[#6C5F48] mb-2">
                        Hashtags
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {platform.hashtags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="bg-[#EAD7BA] border border-[#6C5F48] px-2 py-1 text-xs font-mono-retro text-[#342612]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {platform.visualDirection && (
                    <div className="mb-4 p-3 bg-[#EAD7BA]/10 border border-[#6C5F48]">
                      <div className="text-xs uppercase tracking-wider text-[#6C5F48] mb-1">
                        Visual Direction
                      </div>
                      <div className="text-sm text-[#342612] font-mono-retro">
                        {platform.visualDirection}
                      </div>
                    </div>
                  )}

                  {platform.title && (
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-[#342612] uppercase border-b-2 border-[#6C5F48] pb-2 mb-2">
                        {platform.title}
                      </h3>
                    </div>
                  )}

                  {platform.needsImage && (
                    <div className="mb-6">
                      <button
                        onClick={() => handleGenerateImage(platform.platform)}
                        className="w-full bg-[#342612] text-[#EAD7BA] px-4 py-3 font-mono-retro text-sm uppercase hover:bg-[#6C5F48] transition-colors mb-2 border-2 border-dashed border-[#EAD7BA]"
                      >
                        [+] Generate Adaptation
                      </button>
                      {platform.generatedImage && (
                        <img
                          src={platform.generatedImage}
                          alt={`${platform.platform} image`}
                          className="w-full border-2 border-[#342612] mt-2 filter sepia-[0.3]"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex-grow">
                    {editingPlatform === platform.platform ? (
                      <div className="space-y-4 h-full flex flex-col">
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
                          className="w-full p-4 border-2 border-[#813837] bg-[#EAD7BA]/10 font-mono-retro text-sm text-[#342612] resize-none focus:outline-none flex-grow min-h-[150px]"
                        />
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleSave(platform.platform)}
                            className="flex-1 bg-[#813837] text-[#EAD7BA] px-4 py-2 font-bold uppercase border-2 border-[#342612] shadow-[2px_2px_0px_#342612] active:translate-y-0.5 active:shadow-none transition-all"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingPlatform(null)}
                            className="flex-1 bg-transparent border-2 border-[#6C5F48] text-[#342612] px-4 py-2 font-bold uppercase hover:bg-[#6C5F48]/10 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col">
                        <div className="border-l-4 border-[#EAD7BA] pl-4 py-2 mb-4 font-primary text-[#342612] text-lg leading-relaxed flex-grow whitespace-pre-wrap">
                          {editedContent[platform.platform] || platform.content}
                        </div>
                        <button
                          onClick={() =>
                            handleEdit(
                              platform.platform,
                              editedContent[platform.platform] ||
                                platform.content
                            )
                          }
                          className="w-full bg-transparent border border-[#6C5F48] text-[#6C5F48] px-4 py-2 font-mono-retro text-xs uppercase hover:bg-[#6C5F48] hover:text-[#EAD7BA] transition-colors mt-auto"
                        >
                          Edit Text
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white retro-card p-12 text-center">
            <p className="font-mono-retro text-[#342612] text-lg mb-4">
              No content generated yet. Please upload an image to begin.
            </p>
            <Link
              to="/app"
              className="inline-block bg-[#342612] text-[#EAD7BA] px-6 py-3 font-bold uppercase hover:bg-[#6C5F48] transition-colors shadow-[4px_4px_0px_#6C5F48] active:translate-y-1 active:shadow-none"
            >
              Upload Image
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
