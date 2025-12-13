import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link, useNavigate, useLocation } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Upload as Upload$1, Cpu, Newspaper } from "lucide-react";
import { useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "icon",
  href: "/coffee.png",
  type: "image/png"
}, {
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&family=Satisfy&display=swap"
}];
function meta$4({}) {
  return [{
    charSet: "utf-8"
  }, {
    name: "viewport",
    content: "width=device-width, initial-scale=1"
  }, {
    title: "Kaffe"
  }, {
    property: "og:site_name",
    content: "Kaffe"
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:image",
    content: "/coffee.png"
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:image",
    content: "/coffee.png"
  }];
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function Hero() {
  return /* @__PURE__ */ jsxs("section", { className: "px-6 py-20 md:py-32 text-center relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-[#6C5F48] opacity-50" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-[#6C5F48] opacity-50" }),
    /* @__PURE__ */ jsx("div", { className: "font-secondary text-4xl md:text-6xl text-[#813837] mb-6 transform -rotate-2", children: "Est. 2025" }),
    /* @__PURE__ */ jsx("h1", { className: "font-primary text-6xl md:text-8xl font-medium text-[#342612] mb-8 leading-tight uppercase tracking-tight text-shadow-retro", children: "Kaffe Studio" }),
    /* @__PURE__ */ jsx("div", { className: "inline-block border-2 border-dashed border-[#6C5F48] py-2 mb-8 px-12", children: /* @__PURE__ */ jsx("p", { className: "font-primary text-lg md:text-xl text-[#6C5F48] tracking-widest uppercase", children: "Automated Content GENERATION WITH EASE" }) }),
    /* @__PURE__ */ jsxs("p", { className: "font-primary text-xl md:text-2xl text-[#342612] max-w-2xl mx-auto leading-relaxed mb-12", children: [
      "Transform any creative work into a complete marketing toolkit in seconds.",
      /* @__PURE__ */ jsx("span", { className: "block mt-2 italic text-[#813837] font-secondary", children: "Focus on the craft. Let us handle the press." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col md:flex-row items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/app",
          className: "bg-[#813837] text-[#EAD7BA] px-8 py-4 text-xl font-bold uppercase tracking-wider hover:bg-[#6C5F48] transition-colors shadow-[4px_4px_0px_#342612] active:translate-y-1 active:shadow-none border-2 border-[#342612] order-1 md:order-2",
          children: "Start Making"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: " font-secondary text-[#342612] text-xl order-2 md:order-1", children: "or scroll to learn more" })
    ] })
  ] });
}
function HowItWorks() {
  const steps = [
    {
      icon: /* @__PURE__ */ jsx(Upload$1, { size: 32, className: "text-[#EAD7BA]" }),
      title: "1. Deposit Art",
      description: "Upload your raw creative files into the secure intake chute."
    },
    {
      icon: /* @__PURE__ */ jsx(Cpu, { size: 32, className: "text-[#EAD7BA]" }),
      title: "2. Processing",
      description: "Our engines analyze structure, tone, and visual essence."
    },
    {
      icon: /* @__PURE__ */ jsx(Newspaper, { size: 32, className: "text-[#EAD7BA]" }),
      title: "3. Press Run",
      description: "Receive a full stack of repurposed assets, hot off the press."
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "bg-[#342612] text-[#EAD7BA] py-20 px-6 border-y-4 border-[#6C5F48]", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row justify-between items-center gap-12", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center group", children: [
    /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-[#813837] rounded-none rotate-3 flex items-center justify-center border-2 border-[#EAD7BA] shadow-[4px_4px_0px_#6C5F48] mb-6 group-hover:rotate-6 transition-transform", children: step.icon }),
    /* @__PURE__ */ jsx("h3", { className: "font-primary text-2xl font-bold uppercase tracking-widest mb-3", children: step.title }),
    /* @__PURE__ */ jsx("p", { className: "font-mono-retro text-sm leading-relaxed max-w-xs opacity-80", children: step.description })
  ] }, index)) }) }) });
}
function CreatorsDilemma() {
  const painPoints = [
    "Creators spend countless hours writing blogs, captions, and marketing copy instead of creating",
    "Branding, SEO, and positioning demand expertise across multiple disciplines",
    "Maintaining consistent presence across platforms becomes overwhelming",
    "Existing AI tools miss the mark—they don't actually understand your work",
    `Creative burnout hits hard when you're forced to "do everything"`
  ];
  return /* @__PURE__ */ jsx("section", { className: "px-6 py-16 md:py-24 bg-[#813837] text-[#EAD7BA]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-primary text-4xl md:text-5xl font-bold mb-12 text-start pl-8", children: "The Creator's Dilemma" }),
    /* @__PURE__ */ jsx("p", { className: "font-primary text-xl md:text-2xl mb-12 text-start font-light pl-8", children: "Creators can make visuals, but can't turn them into content—fast." }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-6 text-lg md:text-xl", children: painPoints.map((point, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-baseline gap-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[#EAD7BA] font-light text-2xl leading-normal shrink-0", children: "→" }),
      /* @__PURE__ */ jsx("span", { className: "flex-1 leading-relaxed", children: point })
    ] }, index)) })
  ] }) });
}
function OneUpload() {
  const steps = [
    {
      title: "Upload Creative Work",
      description: "Share your product photo or creative piece with Kaffe's main orchestrator"
    },
    {
      title: "Visual Analysis",
      description: "Image Analysis Agent examines composition, style, colors, and emotional impact"
    },
    {
      title: "Parallel Processing",
      description: "Branding and SEO agents work simultaneously to optimize your content strategy"
    },
    {
      title: "Channel Planning",
      description: "Platform-specific customization for Instagram, LinkedIn, blogs, and more"
    },
    {
      title: "Content Generation",
      description: "Specialized agents create blogs, captions, keywords, and product descriptions"
    },
    {
      title: "Quality Polish",
      description: "Final review ensures brand consistency and marketing effectiveness"
    }
  ];
  const rotations = steps.map(() => {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const angle = (Math.random() * 2 + 0.5) * direction;
    return angle;
  });
  return /* @__PURE__ */ jsx("section", { className: "px-6 py-16 md:py-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "font-secondary text-3xl md:text-4xl text-[#813837] mb-2 text-center", children: "One Upload" }),
    /* @__PURE__ */ jsx("h2", { className: "font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4 text-center", children: "Complete Marketing Kit." }),
    /* @__PURE__ */ jsx("p", { className: "font-primary text-xl md:text-2xl text-[#342612] mb-16 text-center max-w-3xl mx-auto", children: "Kaffe transforms your creative work into comprehensive marketing materials through an intelligent multi-agent system. Upload once, get everything you need to promote across all channels." }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: steps.map((step, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white p-6 rounded-lg border-2 border-[#6C5F48] transition-transform duration-300 ease-in-out",
        style: {
          "--rotation": `${rotations[index]}deg`,
          transform: `rotate(var(--rotation))`
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.setProperty("--rotation", "0deg");
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.setProperty(
            "--rotation",
            `${rotations[index]}deg`
          );
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "font-secondary text-[#813837] text-3xl mb-4", children: step.title }),
          /* @__PURE__ */ jsx("p", { className: "text-[#342612]", children: step.description })
        ]
      },
      index
    )) })
  ] }) });
}
function UploadToLaunch() {
  const steps = [
    {
      number: 1,
      title: "Upload",
      description: "Drop your artwork or product image into Kaffe"
    },
    {
      number: 2,
      title: "Analyze",
      description: "AI examines visual elements, specs, and creative intent"
    },
    {
      number: 3,
      title: "Strategize",
      description: "SEO and branding agents develop your positioning"
    },
    {
      number: 4,
      title: "Customize",
      description: "Channel planner adapts content for each platform"
    },
    {
      number: 5,
      title: "Generate",
      description: "Content agents create blogs, captions, and copy"
    },
    {
      number: 6,
      title: "Polish",
      description: "Quality agent ensures everything is publication-ready"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "px-6 py-16 md:py-24 bg-[#342612] text-[#EAD7BA]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-primary text-4xl md:text-5xl font-medium mb-4 text-center", children: "From Upload to Launch in 60 Seconds" }),
    /* @__PURE__ */ jsx("p", { className: "font-primary text-xl text-center mb-16 text-[#EAD7BA]/80", children: "Zero complexity workflow" }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: steps.map((step) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-[#813837] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold", children: step.number }),
      /* @__PURE__ */ jsx("h3", { className: "font-primary text-2xl font-bold mb-3", children: step.title }),
      /* @__PURE__ */ jsx("p", { className: "text-[#EAD7BA]/90", children: step.description })
    ] }, step.number)) })
  ] }) });
}
function RealImpact() {
  const stats = [
    {
      value: "10x",
      label: "Faster Content Creation"
    },
    {
      value: "80%",
      label: "Time Saved"
    },
    {
      value: "40%",
      label: "Quicker Output"
    }
  ];
  return /* @__PURE__ */ jsxs("section", { className: "px-6 py-16 md:py-24 bg-[#EAD7BA] relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDAgMjAgMTAgMTAgMjAgMCAxMHoiIGZpbGw9IiM2QzVGNDgiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-50" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-4 uppercase tracking-tight text-shadow-retro", children: "Real Impact for Real Creators" }),
      /* @__PURE__ */ jsx("p", { className: "font-primary text-xl md:text-2xl text-[#342612] mb-8 max-w-3xl mx-auto leading-relaxed", children: "More visibility. Less burnout. Authentic growth powered by intelligent automation." }),
      /* @__PURE__ */ jsx("p", { className: "font-secondary text-3xl md:text-4xl text-[#813837] mb-16 text-center transform -rotate-1", children: "Your creative partner, always ready." }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-12", children: stats.map((stat, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white p-8 border-2 border-[#6C5F48] shadow-[8px_8px_0px_#6C5F48] hover:translate-y-1 hover:shadow-[4px_4px_0px_#6C5F48] transition-all duration-300",
          children: [
            /* @__PURE__ */ jsx("div", { className: "font-primary text-7xl font-bold text-[#813837] mb-4 tracking-tighter", children: stat.value }),
            /* @__PURE__ */ jsx("div", { className: "w-12 h-1 bg-[#6C5F48] mx-auto mb-4" }),
            /* @__PURE__ */ jsx("div", { className: "font-mono-retro text-lg text-[#342612] uppercase tracking-wide", children: stat.label })
          ]
        },
        index
      )) })
    ] })
  ] });
}
function CTA() {
  return /* @__PURE__ */ jsxs("section", { className: "px-6 py-20 md:py-32 bg-[#342612] text-[#EAD7BA] text-center relative border-t-2 border-[#6C5F48]", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-0 w-full h-[1px] bg-[#6C5F48] opacity-30" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 left-0 w-full h-[1px] bg-[#6C5F48] opacity-30" }),
    /* @__PURE__ */ jsx("h2", { className: "font-primary text-4xl md:text-6xl font-bold mb-6 tracking-wide uppercase text-shadow-retro text-[#EAD7BA]", children: "Ready to Transform Your Workflow?" }),
    /* @__PURE__ */ jsx("p", { className: "font-mono-retro text-lg md:text-xl mb-12 max-w-2xl mx-auto text-[#EAD7BA]/80", children: "// Join creators saving hours every week." }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-6 justify-center flex-wrap", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/app/upload",
        className: "bg-[#813837] text-[#EAD7BA] px-10 py-4 font-primary text-xl font-bold uppercase tracking-wider hover:bg-[#EAD7BA] hover:text-[#813837] border-2 border-[#EAD7BA] transition-all shadow-[4px_4px_0px_#EAD7BA] active:translate-y-1 active:shadow-none",
        children: "Try Kaffe Now"
      }
    ) })
  ] });
}
function Home() {
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-[#EAD7BA] overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(HowItWorks, {}),
    /* @__PURE__ */ jsx(CreatorsDilemma, {}),
    /* @__PURE__ */ jsx(OneUpload, {}),
    /* @__PURE__ */ jsx(UploadToLaunch, {}),
    /* @__PURE__ */ jsx(RealImpact, {}),
    /* @__PURE__ */ jsx(CTA, {})
  ] });
}
function meta$3({}) {
  const title = "Kaffe: Your AI Branding & Content Studio";
  const description = "Transform any artwork or product image into a complete marketing toolkit in seconds. Stop spending hours on content creation—let AI handle your marketing while you focus on what you do best.";
  const image = "/coffee.png";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:image",
    content: image
  }, {
    name: "twitter:title",
    content: title
  }, {
    name: "twitter:description",
    content: description
  }, {
    name: "twitter:image",
    content: image
  }];
}
const home = UNSAFE_withComponentProps(function HomeRoute() {
  return /* @__PURE__ */ jsx(Home, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      navigate("/app/processing", {
        state: {
          fileData: base64String,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          imagePreview: preview
        }
      });
    };
    reader.readAsDataURL(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#EAD7BA] p-6 flex flex-col items-center justify-center font-primary", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center mb-12 font-mono-retro text-sm md:text-base tracking-widest text-[#6C5F48]", children: [
      /* @__PURE__ */ jsx("span", { className: "font-bold border-b-2 border-[#813837] text-[#813837]", children: "1. UPLOAD" }),
      /* @__PURE__ */ jsx("span", { className: "mx-4 text-[#6C5F48]/50", children: "→" }),
      /* @__PURE__ */ jsx("span", { className: "opacity-50", children: "2. ANALYZE" }),
      /* @__PURE__ */ jsx("span", { className: "mx-4 text-[#6C5F48]/50", children: "→" }),
      /* @__PURE__ */ jsx("span", { className: "opacity-50", children: "3. REPURPOSE" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "font-primary text-4xl md:text-5xl font-bold text-[#342612] mb-2 text-center text-shadow-retro uppercase", children: "Inject Visual Data" }),
    /* @__PURE__ */ jsx("p", { className: "font-mono-retro text-lg text-[#342612] mb-12 text-center max-w-2xl mx-auto opacity-70", children: "// Initialize sequence. Load artwork into the intake chute." }),
    /* @__PURE__ */ jsx("div", { className: "bg-[#FFFFFF] retro-card p-2 md:p-8", children: /* @__PURE__ */ jsx("div", { className: "border-4 border-double border-[#6C5F48] p-1 rounded-sm", children: !preview ? /* @__PURE__ */ jsxs(
      "div",
      {
        onDragOver: handleDragOver,
        onDrop: handleDrop,
        className: "relative overflow-hidden bg-[#EAD7BA]/10 border-2 border-dashed border-[#6C5F48] p-12 text-center cursor-pointer hover:bg-[#EAD7BA]/30 transition-colors group",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(108,95,72,0.25)_50%)] bg-[length:100%_4px]" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "file",
              accept: "image/*",
              onChange: handleFileChange,
              className: "hidden",
              id: "file-upload"
            }
          ),
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: "file-upload",
              className: "cursor-pointer relative z-10",
              children: [
                /* @__PURE__ */ jsx("div", { className: "mb-6 transform group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "mx-auto h-20 w-20 text-[#813837]",
                    stroke: "currentColor",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    strokeWidth: 1.5,
                    children: /* @__PURE__ */ jsx(
                      "path",
                      {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      }
                    )
                  }
                ) }),
                /* @__PURE__ */ jsx("p", { className: "font-primary text-3xl text-[#342612] mb-2 uppercase tracking-wide", children: "Insert File to Begin" }),
                /* @__PURE__ */ jsx("p", { className: "font-mono-retro text-base text-[#342612]/70 mb-6", children: "[ DRAG & DROP OR CLICK TO LOCATE ]" }),
                /* @__PURE__ */ jsx("div", { className: "inline-block bg-[#6C5F48] text-[#EAD7BA] px-4 py-1 text-xs font-mono-retro uppercase tracking-widest", children: "Supported Formats: PNG, JPG (MAX 10MB)" })
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#342612]/10 pointer-events-none z-10" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: preview,
            alt: "Preview",
            className: "w-full h-auto border-2 border-[#342612] filter contrast-110 sepia-[0.3]"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 z-20", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setFile(null);
              setPreview(null);
            },
            className: "bg-[#813837] text-[#EAD7BA] p-2 hover:bg-[#6C5F48] transition-colors border-2 border-[#EAD7BA] shadow-lg",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-6 h-6",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M6 18L18 6M6 6l12 12"
                  }
                )
              }
            )
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-4 justify-center pt-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleUpload,
          disabled: isUploading,
          className: "w-full bg-[#342612] text-[#EAD7BA] px-8 py-4 text-xl font-bold uppercase tracking-wider hover:bg-[#6C5F48] transition-colors shadow-[4px_4px_0px_#6C5F48] active:translate-y-1 active:shadow-none border-2 border-[#6C5F48] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3",
          children: isUploading ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: "INITIALIZING..." }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "START PROCESSING ",
            /* @__PURE__ */ jsx("span", { className: "text-xl", children: "→" })
          ] })
        }
      ) })
    ] }) }) })
  ] }) });
}
function meta$2({}) {
  return [{
    title: "Kaffe App - Your AI Branding & Content Studio"
  }, {
    name: "description",
    content: "Upload your artwork and transform it into a complete marketing toolkit."
  }];
}
const app = UNSAFE_withComponentProps(function AppRoute() {
  return /* @__PURE__ */ jsx(Upload, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: app,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const getMockApiResponse = () => ({
  blog_intro: "This stunning piece of artwork showcases a perfect blend...",
  faqs: [{ question: "Q?", answer: "A" }],
  social_thread: ["Tweet 1", "Tweet 2"],
  keywords: ["art", "vintage", "design"]
});
function Processing() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileData = location.state?.fileData;
  const fileName = location.state?.fileName || "your image";
  const fileType = location.state?.fileType || "image/jpeg";
  const imagePreview = location.state?.imagePreview;
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [useMockData] = useState(true);
  useEffect(() => {
    if (!fileData) {
      navigate("/app");
      return;
    }
    const processImage = async () => {
      try {
        setCurrentStep(1);
        setTimeout(() => setCurrentStep(2), 1e3);
        setTimeout(() => setCurrentStep(3), 2e3);
        setTimeout(() => setCurrentStep(4), 3e3);
        let data;
        if (useMockData) {
          await new Promise((resolve) => setTimeout(resolve, 4e3));
          data = getMockApiResponse();
        }
        navigate("/app/dashboard", {
          state: { results: data, imagePreview }
        });
      } catch (error2) {
        setError("Failed to process image.");
        setTimeout(() => navigate("/app"), 3e3);
      }
    };
    processImage();
  }, [fileData, fileName, fileType, navigate, imagePreview]);
  const steps = [
    { name: "Uploading", index: 0 },
    { name: "Analyzing Image", index: 1 },
    { name: "Generating Content", index: 2 },
    { name: "Optimizing for Platforms", index: 3 },
    { name: "Finalizing", index: 4 }
  ];
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return "complete";
    if (stepIndex === currentStep) return "active";
    return "pending";
  };
  const progressPercent = Math.min((currentStep + 1) / 5 * 100, 100);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#EAD7BA] p-6 flex items-center justify-center font-primary", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#FFFFFF] retro-card p-8 md:p-12 relative overflow-hidden shadow-[8px_8px_0px_#6C5F48]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-10 relative z-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full border-4 border-[#EAD7BA] border-opacity-50" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-[#813837] border-t-transparent animate-spin"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex items-center justify-center font-mono-retro text-lg text-[#813837] font-bold", children: [
          Math.round(progressPercent),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "font-primary text-3xl md:text-5xl font-bold text-[#342612] mb-2 uppercase tracking-widest text-shadow-retro", children: "System Processing" }),
      /* @__PURE__ */ jsxs("p", { className: "font-mono-retro text-sm text-[#6C5F48] mb-4", children: [
        "TARGET: ",
        fileName
      ] })
    ] }),
    error ? /* @__PURE__ */ jsxs("div", { className: "bg-[#813837]/10 border-l-4 border-[#813837] p-4 mb-4 font-mono-retro", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[#813837] font-bold", children: [
        "ERROR: ",
        error
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[#813837]/70 text-sm mt-2", children: "> Rerouting to upload sequence..." })
    ] }) : (
      /* Terminal Box - Dark high-contrast area for logs */
      /* @__PURE__ */ jsxs("div", { className: "retro-card bg-[#342612] p-6 rounded-none border-2 border-[#6C5F48] min-h-[200px] flex flex-col justify-end relative z-20 overflow-hidden shadow-none", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(transparent_50%,rgba(234,215,186,0.1)_50%)] bg-[length:100%_4px] z-10" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none radial-gradient z-10 opacity-20" }),
        /* @__PURE__ */ jsxs("div", { className: "font-mono-retro text-left relative z-20", children: [
          steps.map((step) => {
            const status = getStepStatus(step.index);
            if (status === "pending") return null;
            return /* @__PURE__ */ jsxs("div", { className: `mb-2 ${status === "active" ? "text-[#342612]" : "text-[#342612]/50"}`, children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: status === "complete" ? "[OK]" : "[..]" }),
              /* @__PURE__ */ jsxs("span", { className: status === "active" ? "animate-pulse" : "", children: [
                "> ",
                step.name,
                "..."
              ] }),
              status === "active" && /* @__PURE__ */ jsx("span", { className: "inline-block w-2 H-4 bg-[#342612] ml-1 animate-pulse", children: "_" })
            ] }, step.index);
          }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 border-t border-[#6C5F48]/50 pt-2 text-xs text-[#EAD7BA]/40", children: "SYSTEM_ID: KFE-2024-X // MEM: OK // CPU: OPTIMAL" })
        ] })
      ] })
    )
  ] }) }) });
}
function meta$1({}) {
  return [{
    title: "Processing - Kaffe"
  }, {
    name: "description",
    content: "Processing your image and generating marketing content..."
  }];
}
const app_processing = UNSAFE_withComponentProps(function ProcessingRoute() {
  return /* @__PURE__ */ jsx(Processing, {});
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: app_processing,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function Dashboard() {
  const location = useLocation();
  const results = location.state?.results || null;
  const imagePreview = location.state?.imagePreview || null;
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [editedContent, setEditedContent] = useState(
    {}
  );
  const platforms = [
    {
      platform: "Instagram",
      content: results?.social_thread?.[0] || "Your Instagram post content here...",
      performance: { engagement: 85, reach: 1200, score: 92 },
      needsImage: true
    },
    {
      platform: "Twitter/X",
      content: results?.social_thread?.join("\n\n") || "Your Twitter thread here...",
      performance: { engagement: 72, reach: 850, score: 78 },
      needsImage: false
    },
    {
      platform: "LinkedIn",
      content: results?.blog_intro || "Your LinkedIn post content here...",
      performance: { engagement: 68, reach: 650, score: 75 },
      needsImage: false
    },
    {
      platform: "Medium Blog",
      content: results?.blog_intro || "Your blog post content here...",
      performance: { engagement: 91, reach: 2100, score: 95 },
      needsImage: false
    }
  ];
  const handleEdit = (platform, content) => {
    setEditingPlatform(platform);
    setEditedContent({ ...editedContent, [platform]: content });
  };
  const handleSave = (platform) => {
    setEditingPlatform(null);
  };
  const handleGenerateImage = (platform) => {
    console.log(`Generating image for ${platform}`);
  };
  const trendsData = [20, 35, 45, 30, 55, 65, 80];
  const maxTrend = Math.max(...trendsData);
  const chartPoints = trendsData.map((val, i) => `${i * (100 / (trendsData.length - 1))},${100 - val / maxTrend * 100}`).join(" ");
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#EAD7BA] p-6 font-primary", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-8 mb-12 items-end", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "border-b-2 border-[#6C5F48] mb-4 pb-2", children: /* @__PURE__ */ jsx("span", { className: "bg-[#6C5F48] text-[#EAD7BA] px-3 py-1 font-mono-retro text-xs uppercase tracking-widest", children: "Analytics Report" }) }),
        /* @__PURE__ */ jsx("h1", { className: "font-primary text-5xl font-bold text-[#342612] uppercase tracking-tight text-shadow-retro leading-none", children: "Marketing Toolkit" }),
        /* @__PURE__ */ jsxs("p", { className: "font-mono-retro text-[#342612]/70 mt-2", children: [
          "REF: ",
          results?.fileName || "PROJECT_ALPHA",
          " // STATUS: COMPLETE"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/app", className: "bg-[#EAD7BA] text-[#342612] border-2 border-[#342612] px-6 py-3 font-bold uppercase hover:bg-[#342612] hover:text-[#EAD7BA] transition-colors shadow-[4px_4px_0px_#342612] active:translate-y-1 active:shadow-none", children: "New Project" }),
        /* @__PURE__ */ jsx("button", { className: "bg-[#813837] text-[#EAD7BA] border-2 border-[#342612] px-6 py-3 font-bold uppercase hover:bg-[#6C5F48] transition-colors shadow-[4px_4px_0px_#342612] active:translate-y-1 active:shadow-none", children: "Export All" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12", children: [
      imagePreview && /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 retro-card p-2 bg-white transform rotate-1 hover:rotate-0 transition-transform duration-500", children: /* @__PURE__ */ jsxs("div", { className: "border-2 border-[#6C5F48] h-full relative", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imagePreview,
            alt: "Uploaded artwork",
            className: "w-full h-full object-cover filter contrast-110 sepia-[0.2]"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 bg-[#813837] text-[#EAD7BA] px-3 py-1 font-mono-retro text-xs", children: "IMG_SRC_01" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-[#FFFFFF] retro-card p-6 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#342612] uppercase border-b-2 border-[#6C5F48] pb-2 mb-4", children: "SEO Strength" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-6xl font-bold text-[#813837]", children: [
              "92",
              /* @__PURE__ */ jsx("span", { className: "text-2xl text-[#6C5F48]", children: "%" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-2 font-mono-retro text-xs text-[#342612]/70", children: [
              "Keyword density optimal.",
              /* @__PURE__ */ jsx("br", {}),
              "Readability high."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full h-4 bg-[#EAD7BA] mt-4 border border-[#6C5F48] relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 h-full bg-[#813837]", style: { width: "92%" } }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 h-full w-[1px] bg-[#6C5F48]/50" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 h-full w-[1px] bg-[#6C5F48]/50" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-3/4 h-full w-[1px] bg-[#6C5F48]/50" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#FFFFFF] retro-card p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[#342612] uppercase border-b-2 border-[#6C5F48] pb-2 mb-4", children: "Keywords" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: results?.keywords?.slice(0, 5).map((kw, i) => /* @__PURE__ */ jsxs("span", { className: "bg-[#EAD7BA] border border-[#6C5F48] px-2 py-1 text-sm font-mono-retro text-[#342612]", children: [
            "#",
            kw.replace(/\s+/g, "")
          ] }, i)) || /* @__PURE__ */ jsx("span", { className: "text-sm italic opacity-50", children: "No keywords detected" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#342612] retro-card p-6 md:col-span-2 text-[#EAD7BA]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4 border-b border-[#EAD7BA]/20 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold uppercase tracking-widest", children: "Engagement Projection" }),
            /* @__PURE__ */ jsx("span", { className: "font-mono-retro text-xs text-[#EAD7BA]/50", children: "LAST 7 DAYS" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "h-32 w-full relative", children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 grid grid-cols-6 grid-rows-4", children: [
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-b border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-b border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-b border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-b border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-r border-t border-b border-[#EAD7BA]/10" }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-b border-[#EAD7BA]/10" })
            ] }),
            /* @__PURE__ */ jsxs("svg", { className: "w-full h-full absolute inset-0 overflow-visible", preserveAspectRatio: "none", children: [
              /* @__PURE__ */ jsx(
                "polyline",
                {
                  points: chartPoints,
                  fill: "none",
                  stroke: "#EAD7BA",
                  strokeWidth: "2",
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              trendsData.map((val, i) => /* @__PURE__ */ jsx(
                "circle",
                {
                  cx: `${i * (100 / (trendsData.length - 1))}%`,
                  cy: `${100 - val / maxTrend * 100}%`,
                  r: "3",
                  fill: "#813837",
                  stroke: "#EAD7BA",
                  strokeWidth: "1"
                },
                i
              ))
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "font-primary text-3xl font-bold text-[#342612] mb-8 border-b-2 border-[#342612] inline-block pr-12 pb-2", children: "Generated Content Modules" }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8", children: platforms.map((platform) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white retro-card p-6 flex flex-col",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6 border-b-2 border-[#EAD7BA] pb-4", children: [
            /* @__PURE__ */ jsx("h2", { className: "font-primary text-2xl font-bold text-[#342612] uppercase", children: platform.platform }),
            platform.performance && /* @__PURE__ */ jsxs("div", { className: "bg-[#EAD7BA] px-3 py-1 rounded-full border border-[#6C5F48] text-xs font-mono-retro font-bold text-[#342612]", children: [
              "SCORE: ",
              platform.performance.score
            ] })
          ] }),
          platform.performance && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "border border-[#6C5F48] p-3 bg-[#EAD7BA]/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-[#6C5F48] mb-1", children: "Engagement" }),
              /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-[#342612]", children: [
                platform.performance.engagement,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border border-[#6C5F48] p-3 bg-[#EAD7BA]/10", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-[#6C5F48] mb-1", children: "Potential Reach" }),
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-[#342612]", children: platform.performance.reach })
            ] })
          ] }),
          platform.needsImage && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleGenerateImage(platform.platform),
                className: "w-full bg-[#342612] text-[#EAD7BA] px-4 py-3 font-mono-retro text-sm uppercase hover:bg-[#6C5F48] transition-colors mb-2 border-2 border-dashed border-[#EAD7BA]",
                children: "[+] Generate Adaptation"
              }
            ),
            platform.generatedImage && /* @__PURE__ */ jsx(
              "img",
              {
                src: platform.generatedImage,
                alt: `${platform.platform} image`,
                className: "w-full border-2 border-[#342612] mt-2 filter sepia-[0.3]"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-grow", children: editingPlatform === platform.platform ? /* @__PURE__ */ jsxs("div", { className: "space-y-4 h-full flex flex-col", children: [
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: editedContent[platform.platform] || platform.content,
                onChange: (e) => setEditedContent({
                  ...editedContent,
                  [platform.platform]: e.target.value
                }),
                className: "w-full p-4 border-2 border-[#813837] bg-[#EAD7BA]/10 font-mono-retro text-sm text-[#342612] resize-none focus:outline-none flex-grow min-h-[150px]"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleSave(platform.platform),
                  className: "flex-1 bg-[#813837] text-[#EAD7BA] px-4 py-2 font-bold uppercase border-2 border-[#342612] shadow-[2px_2px_0px_#342612] active:translate-y-0.5 active:shadow-none transition-all",
                  children: "Save Changes"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setEditingPlatform(null),
                  className: "flex-1 bg-transparent border-2 border-[#6C5F48] text-[#342612] px-4 py-2 font-bold uppercase hover:bg-[#6C5F48]/10 transition-colors",
                  children: "Cancel"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col", children: [
            /* @__PURE__ */ jsx("div", { className: "border-l-4 border-[#EAD7BA] pl-4 py-2 mb-4 font-primary text-[#342612] text-lg leading-relaxed flex-grow", children: editedContent[platform.platform] || platform.content }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleEdit(
                  platform.platform,
                  editedContent[platform.platform] || platform.content
                ),
                className: "w-full bg-transparent border border-[#6C5F48] text-[#6C5F48] px-4 py-2 font-mono-retro text-xs uppercase hover:bg-[#6C5F48] hover:text-[#EAD7BA] transition-colors mt-auto",
                children: "Edit Text"
              }
            )
          ] }) })
        ]
      },
      platform.platform
    )) })
  ] }) });
}
function meta({}) {
  return [{
    title: "Dashboard - Kaffe"
  }, {
    name: "description",
    content: "Review and customize your marketing content for each platform."
  }];
}
const app_dashboard = UNSAFE_withComponentProps(function DashboardRoute() {
  return /* @__PURE__ */ jsx(Dashboard, {});
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: app_dashboard,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-WO8yW85U.js", "imports": ["/assets/chunk-WWGJGFF6-VDMQyd7s.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-CfUbvNAU.js", "imports": ["/assets/chunk-WWGJGFF6-VDMQyd7s.js"], "css": ["/assets/root-CbEg8Hud.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CSgg8zJm.js", "imports": ["/assets/chunk-WWGJGFF6-VDMQyd7s.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app": { "id": "routes/app", "parentId": "root", "path": "app", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/app-B23oH-5g.js", "imports": ["/assets/chunk-WWGJGFF6-VDMQyd7s.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.processing": { "id": "routes/app.processing", "parentId": "root", "path": "app/processing", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/app.processing-D0sJrzEr.js", "imports": ["/assets/chunk-WWGJGFF6-VDMQyd7s.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/app.dashboard": { "id": "routes/app.dashboard", "parentId": "root", "path": "app/dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/app.dashboard-Cdq4iuYj.js", "imports": ["/assets/chunk-WWGJGFF6-VDMQyd7s.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-be455bd6.js", "version": "be455bd6", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/app.processing": {
    id: "routes/app.processing",
    parentId: "root",
    path: "app/processing",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/app.dashboard": {
    id: "routes/app.dashboard",
    parentId: "root",
    path: "app/dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
