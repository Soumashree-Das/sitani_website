import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"; // Added missing import

// Import your assets
import projectVideo1 from "../assets/project-1751351933840-532642380.mp4";
import projectVideo2 from "../assets/project-1751351933840-532642380.mp4";
import projectVideo3 from "../assets/project-1751351933840-532642380.mp4";
import constructionImage3 from "../assets/constrcution3.jpg";
import constructionImage2 from "../assets/constrcution2.jpg";
import constructionImage1 from "../assets/construction1.webp";
import Footer from "../Components/Footer";

const AboutUs = () => {
  // Main states
  const [companyInfo, setCompanyInfo] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image states
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Achievement states - Added missing states
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [achievementsError, setAchievementsError] = useState(null);
  const [achievementImagesLoading, setAchievementImagesLoading] = useState({});
  const [achievementImagesError, setAchievementImagesError] = useState({});

  // Carousel states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [videoDuration, setVideoDuration] = useState(5000); // default 5 seconds

  // Video refs for background videos
  const videoRefs = useRef([]);

  const slides = [
    {
      title: "We Have Been Building",
      subtitle: "EXCELLENCE",
      tagline: "* SINCE 1985 *",
      description:
        "Premium construction services with over 35 years of experience",
      videoSrc: projectVideo1,
      fallbackImage: constructionImage1,
    },
    {
      title: "Creating Your Dream",
      subtitle: "PROJECTS",
      tagline: "* TRUSTED BUILDERS *",
      description: "From residential homes to commercial complexes",
      videoSrc: projectVideo2,
      fallbackImage: constructionImage2,
    },
    {
      title: "Quality & Innovation",
      subtitle: "GUARANTEED",
      tagline: "* AWARD WINNING *",
      description:
        "Delivering exceptional results with cutting-edge techniques",
      videoSrc: projectVideo3,
      fallbackImage: constructionImage3,
    },
  ];

  // Fetch company info
  const fetchCompanyInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8090/api/v1/companyInfo/aboutus"
      );
      const data = await response.json();

      if (data.success) {
        setCompanyInfo(data.data);
      } else {
        setError("Failed to fetch company information");
      }
    } catch (err) {
      setError("Error loading company information");
      console.error("Error fetching company info:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch achievements
  const fetchFeaturedAchievements = async () => {
    try {
      setAchievementsLoading(true);
      setAchievementsError(null);

      const response = await fetch(
        "http://localhost:8090/api/v1/acheivements/featured?limit=6"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Achievements API response:", data);

      if (data.success && data.data) {
        setAchievements(data.data);
        // Initialize loading states for achievement images
        const loadingStates = {};
        const errorStates = {};
        data.data.forEach((achievement, index) => {
          const key = achievement.id || index;
          loadingStates[key] = true;
          errorStates[key] = false;
        });
        setAchievementImagesLoading(loadingStates);
        setAchievementImagesError(errorStates);
      } else {
        setAchievementsError("Failed to fetch achievements");
        setAchievements([]);
      }
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setAchievementsError("Error loading achievements");
      setAchievements([]);
    } finally {
      setAchievementsLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    setIsVisible(true);
    fetchCompanyInfo();
    fetchFeaturedAchievements();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, videoDuration); // Change this from 5000 to videoDuration

    return () => clearInterval(interval);
  }, [videoDuration]); // Add videoDuration to dependency array

  // Video management
  useEffect(() => {
    // Play current video and pause others
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
      }
    });
  }, [currentSlide]);

  const getImageUrl = (dbPath) => {
    if (!dbPath) return null;
    const filename = dbPath.split("/").pop();
    return `http://localhost:8090/api/v1/companyInfo/uploads/company-images/${filename}`;
  };

  const handleImageError = (e, originalPath) => {
    console.error("Image failed to load:", originalPath);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-700 text-lg">Loading our story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-stone-200">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => {
              fetchCompanyInfo();
              fetchFeaturedAchievements();
            }}
            className="bg-amber-500 text-stone-900 px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFFF1]">
      {/* Hero Section with Video Background */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Videos */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="absolute inset-0 w-full h-full object-cover"
              src={slide.videoSrc}
              muted
              loop
              playsInline
              onError={() => {
                // Fallback to image if video fails
                console.log(`Video failed to load for slide ${index}, using fallback image`);
              }}
            />
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.fallbackImage})`,
                zIndex: -1
              }}
            />
          </div>
        ))}
  
        {/* Dark Overlay */}
        {/* <div className="absolute inset-0 bg-black/40 z-10"></div> */}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-amber-500 w-8"
                  : "bg-stone-600 hover:bg-stone-500"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Section */}
      <div className="bg-[#FBFFF1] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="w-1 h-16 bg-amber-500 mx-auto mb-6"></div>
            <h2 className="text-amber-600 text-lg font-medium tracking-wider uppercase mb-4">
              ABOUT US
            </h2>
            <h3 className="text-5xl font-bold text-stone-800 mb-8">
              {companyInfo?.title || "Serving Since 1950"}
            </h3>
          </div>

          {/* Story and Vision Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Our Story */}
            <div className="space-y-6">
              <h4 className="text-3xl font-bold text-stone-800 mb-6">
                Our Story
              </h4>
              <div className="text-stone-600 text-lg leading-relaxed space-y-4">
                {companyInfo?.mission ? (
                  <p>{companyInfo.mission}</p>
                ) : (
                  <>
                    <p>
                      For over seven decades, we have been crafting excellence
                      in construction, bringing together traditional building
                      methods with modern innovation.
                    </p>
                    <p>
                      Our journey began in 1985 with a simple vision: to build
                      exceptional structures that bring communities together and
                      create lasting value.
                    </p>
                  </>
                )}
              </div>
              
            </div>

            {/* Company Image */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-stone-200">
                {companyInfo?.imageUrl && !imageError ? (
                  <div className="relative">
                    {imageLoading && (
                      <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center z-10">
                        <div className="text-stone-500">Loading image...</div>
                      </div>
                    )}

                    <div className="w-full h-96 overflow-hidden">
                      <img
                        src={getImageUrl(companyInfo.imageUrl)}
                        alt={`${companyInfo.title || "Company"} Image`}
                        className="w-full h-full object-contain bg-white"
                        onError={(e) =>
                          handleImageError(e, companyInfo.imageUrl)
                        }
                        onLoad={handleImageLoad}
                        style={{
                          display: imageLoading ? "none" : "block",
                          maxWidth: "90%",
                          maxHeight: "90%",
                          margin: "auto",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center relative overflow-hidden">
                    <div className="relative">
                      <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-amber-500">
                        <div className="w-24 h-24 bg-gradient-to-b from-amber-600 to-amber-500 rounded-full relative">
                          <div className="absolute top-2 left-2 w-4 h-4 bg-amber-200 rounded-full opacity-60"></div>
                        </div>
                      </div>
                    </div>

                    {imageError && (
                      <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-300 rounded p-2">
                        <p className="text-red-700 text-sm text-center">
                          Image could not be loaded
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Our Vision Section */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Vision Content */}
            <div className="lg:order-2 space-y-6">
              <h4 className="text-3xl font-bold text-stone-800 mb-6">
                Our Vision
              </h4>
              <div className="text-stone-600 text-lg leading-relaxed space-y-4">
                {companyInfo?.vision ? (
                  <p>{companyInfo.vision}</p>
                ) : (
                  <p>
                    To become the world's most trusted construction company by
                    consistently delivering exceptional quality, fostering
                    community connections, and inspiring architectural
                    excellence across the globe.
                  </p>
                )}
              </div>
            </div>

            {/* Location Info */}
            <div className="lg:order-1">
              <div className="bg-white rounded-lg shadow-2xl p-8 border border-stone-200">
                <h5 className="text-2xl font-bold text-stone-800 mb-6">
                  Our Location
                </h5>
                {companyInfo?.location ? (
                  <div className="space-y-4 text-stone-600">
                    {companyInfo.location.address && (
                      <p className="flex items-start space-x-3">
                        <svg
                          className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{companyInfo.location.address}</span>
                      </p>
                    )}
                    {companyInfo.location.city && (
                      <p className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-amber-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {companyInfo.location.city},{" "}
                          {companyInfo.location.country}
                        </span>
                      </p>
                    )}
                    {companyInfo.location.timezone && (
                      <p className="flex items-center space-x-3">
                        <svg
                          className="w-5 h-5 text-amber-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Timezone: {companyInfo.location.timezone}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4 text-stone-600">
                    <p className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>123 Construction Street, Builder City</span>
                    </p>
                    <p className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-amber-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Construction Land, USA</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Achievements Section - Fixed condition and debug info */}
          {achievements && achievements.length > 0 ? (
            <div className="mb-20">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="w-1 h-16 bg-amber-500 mx-auto mb-6"></div>
                <h2 className="text-amber-600 text-lg font-medium tracking-wider uppercase mb-4">
                  OUR ACHIEVEMENTS
                </h2>
                <h3 className="text-5xl font-bold text-stone-800 mb-8">
                  Awards & Recognition
                </h3>
                <p className="text-stone-600 text-lg max-w-3xl mx-auto">
                  We're proud of the recognition we've received for our
                  commitment to excellence and innovation.
                </p>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id || index}
                    className="bg-white rounded-lg shadow-lg border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    {/* Achievement Image */}
                    <div className="h-48 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden relative">
                      {/* Fallback Icon */}
                      <div
                        className="fallback-icon absolute inset-0 flex items-center justify-center"
                        // style={{ display: achievement.imageUrl ? 'none' : 'flex' }}
                      >
                        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-10 h-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 4.2L15 8v10H5V8l5-3.8z"
                              clipRule="evenodd"
                            />
                            <path d="M10 8l-2 6h1l.5-1.5h3L13 14h1l-2-6h-2zm0 2.5l.75 2.25h-1.5L10 10.5z" />
                          </svg>
                        </div>
                      </div>

                      {/* Category Badge */}
                      {achievement.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-sm font-medium capitalize">
                            {achievement.category.replace(/"/g, "")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Achievement Content */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-stone-800 mb-3 line-clamp-2">
                        {achievement.title
                          ? achievement.title.replace(/"/g, "")
                          : "Achievement Title"}
                      </h4>

                      <p className="text-stone-600 mb-4 line-clamp-3">
                        {achievement.description
                          ? achievement.description.replace(/"/g, "")
                          : "Achievement description not available."}
                      </p>

                      {/* Tags */}
                      {achievement.tags && achievement.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {achievement.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs"
                            >
                              {tag.replace ? tag.replace(/"/g, "") : tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Date */}
                      <div className="flex items-center text-sm text-stone-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          {achievement.dateAchieved
                            ? formatDate(achievement.dateAchieved)
                            : "Date not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              {/* <div className="text-center mt-12">
                <button className="bg-amber-500 text-stone-900 px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300 font-medium"
                // onClick=get the acheivements page
                >
                  View All Achievements
                </button>
              </div>*/}
            </div>
          ) : (
            /* Show this when no achievements are found */
            process.env.NODE_ENV === "development" && (
              <div className="mb-20 p-8 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">
                  No Achievements Found
                </h3>
                <p className="text-yellow-700 mb-4">
                  The achievements section is not displaying because:
                </p>
                <ul className="text-left text-yellow-700 space-y-2 max-w-md mx-auto">
                  <li>• No achievements data returned from API</li>
                  <li>• API endpoint might be incorrect</li>
                  <li>• Check console for API errors</li>
                  <li>• Verify API is running on port 8090</li>
                </ul>
                <button
                  onClick={fetchFeaturedAchievements}
                  className="mt-4 bg-yellow-500 text-yellow-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                >
                  Retry Loading Achievements
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Bottom decorative section */}
      <Footer/>
    </div>
  );
};

export default AboutUs;

// // import React, { useState, useEffect } from "react";
// import backgroundImage from "../assets/construction1.webp";
// import React, { useState, useEffect, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// // import projectVideo from "../assets/project-1751351933840-532642380.mp4"

// import projectVideo1 from "../assets/project-1751351933840-532642380.mp4";
// import projectVideo2 from "../assets/project-1751351933840-532642380.mp4";
// import projectVideo3 from "../assets/project-1751351933840-532642380.mp4";
// import constructionImage3 from "../assets/constrcution3.jpg";
// import constructionImage2 from "../assets/constrcution2.jpg";
// import constructionImage1 from "../assets/construction1.webp";

// const AboutUs = () => {
//   const [companyInfo, setCompanyInfo] = useState(null);
//   const [achievements, setAchievements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageLoading, setImageLoading] = useState(true);
//   const [imageError, setImageError] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);
//     const [isVisible, setIsVisible] = useState(false);

//     const slides = [
//       {
//         title: "We Have Been Building",
//         subtitle: "EXCELLENCE",
//         tagline: "* SINCE 1985 *",
//         description:
//           "Premium construction services with over 35 years of experience",
//         backgroundImage: `url(${projectVideo1})`
//       },
//       {
//         title: "Creating Your Dream",
//         subtitle: "PROJECTS",
//         tagline: "* TRUSTED BUILDERS *",
//         description: "From residential homes to commercial complexes",
//         backgroundImage: `url(${projectVideo2})`
//       },
//       {
//         title: "Quality & Innovation",
//         subtitle: "GUARANTEED",
//         tagline: "* AWARD WINNING *",
//         description:
//           "Delivering exceptional results with cutting-edge techniques",
//         backgroundImage: `url(${projectVideo3})`
//       },
//     ];

//     useEffect(() => {
//       setIsVisible(true);
//       const interval = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % slides.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }, []);

//     const nextSlide = () => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     };

//     const prevSlide = () => {
//       setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//     };

//   const fetchCompanyInfo = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         "http://localhost:8090/api/v1/companyInfo/aboutus"
//       );
//       const data = await response.json();

//       if (data.success) {
//         setCompanyInfo(data.data);
//       } else {
//         setError("Failed to fetch company information");
//       }
//     } catch (err) {
//       setError("Error loading company information");
//       console.error("Error fetching company info:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getImageUrl = (dbPath) => {
//     if (!dbPath) return null;
//     const filename = dbPath.split("/").pop();
//     return `http://localhost:8090/api/v1/companyInfo/uploads/company-images/${filename}`;
//   };

//   const fetchFeaturedAchievements = async () => {
//     try {
//       setAchievementsLoading(true);
//       setAchievementsError(null);

//       const response = await fetch(
//         "http://localhost:8090/api/v1/acheivements/featured?limit=6"
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Achievements API response:", data);

//       if (data.success && data.data) {
//         setAchievements(data.data);
//         // Initialize loading states for achievement images
//         const loadingStates = {};
//         const errorStates = {};
//         data.data.forEach((achievement, index) => {
//           const key = achievement.id || index;
//           loadingStates[key] = true;
//           errorStates[key] = false;
//         });
//         setAchievementImagesLoading(loadingStates);
//         setAchievementImagesError(errorStates);
//       } else {
//         setAchievementsError("Failed to fetch achievements");
//         setAchievements([]);
//       }
//     } catch (err) {
//       console.error("Error fetching achievements:", err);
//       setAchievementsError("Error loading achievements");
//       setAchievements([]);
//     } finally {
//       setAchievementsLoading(false);
//     }
//   };

//   const handleImageError = (e, originalPath) => {
//     console.error("Image failed to load:", originalPath);
//     setImageError(true);
//     setImageLoading(false);
//   };

//   const handleImageLoad = () => {
//     setImageLoading(false);
//     setImageError(false);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
//           <p className="text-stone-700 text-lg">Loading our story...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-[#FBFFF1] flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg border border-stone-200">
//           <p className="text-red-600 text-lg mb-4">{error}</p>
//           <button
//             onClick={() => {
//               fetchCompanyInfo();
//               fetchFeaturedAchievements();
//             }}
//             className="bg-amber-500 text-stone-900 px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FBFFF1]">
//       {/* Hero Section */}
//       {/* <div
//         className="relative h-96 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//         }}
//       >
//         <div className="absolute inset-0 bg-black/60"></div>
//         <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
//           <h1 className="text-6xl font-bold mb-4 tracking-wide">ABOUT US</h1>
//           <div className="flex items-center text-lg space-x-2">
//             <span className="text-amber-400">About Us</span>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0">
//           <svg
//             viewBox="0 0 1200 120"
//             preserveAspectRatio="none"
//             className="w-full h-16 fill-[#FBFFF1]"
//           >
//             <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
//           </svg>
//         </div>
//       </div>

//       */}
//       <section
//         id="home"
//         className="relative min-h-screen flex items-center justify-center overflow-hidden"
//       >
//         {/* Background Images */}
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               index === currentSlide ? "opacity-100" : "opacity-0"
//             }`}
//             style={{
//               backgroundImage: slide.backgroundImage,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//             }}
//           />
//         ))}

//         {/* Text Content Overlay */}
//         <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
//           <div className="relative z-20 text-center px-4 max-w-6xl">
//             <div
//               className={`transition-all duration-1000 ${
//                 isVisible
//                   ? "opacity-100 translate-y-0"
//                   : "opacity-0 translate-y-10"
//               }`}
//             >
//               <p className="text-amber-400 text-xl md:text-2xl font-medium mb-4 tracking-wide">
//                 {slides[currentSlide].title}
//               </p>

//               <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight leading-none">
//                 {slides[currentSlide].subtitle}
//               </h1>

//               <p className="text-white text-lg md:text-xl font-medium mb-8 tracking-widest">
//                 {slides[currentSlide].tagline}
//               </p>

//               <p className="text-stone-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
//                 {slides[currentSlide].description}
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link
//                   to="/contact-us"
//                   className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-center"
//                 >
//                   Contact Us
//                 </Link>
//                 <Link
//                   to="/projects"
//                   className="border-2 border-white hover:bg-white hover:text-stone-900 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 inline-block text-center"
//                 >
//                   View Our Work
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Arrows */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
//         >
//           <ChevronLeft className="w-6 h-6 text-white" />
//         </button>

//         <button
//           onClick={nextSlide}
//           className="absolute right-4 z-30 bg-stone-800/50 hover:bg-stone-700/70 p-3 rounded-full transition-all duration-300 hover:scale-110"
//         >
//           <ChevronRight className="w-6 h-6 text-white" />
//         </button>

//         {/* Slide Indicators */}
//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
//           {slides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 index === currentSlide
//                   ? "bg-amber-500 w-8"
//                   : "bg-stone-600 hover:bg-stone-500"
//               }`}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Main Content Section */}
//       <div className="bg-[#FBFFF1] py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Section Header */}
//           <div className="text-center mb-16">
//             <div className="w-1 h-16 bg-amber-500 mx-auto mb-6"></div>
//             <h2 className="text-amber-600 text-lg font-medium tracking-wider uppercase mb-4">
//               ABOUT US
//             </h2>
//             <h3 className="text-5xl font-bold text-stone-800 mb-8">
//               {companyInfo?.title || "Serving Since 1950"}
//             </h3>
//           </div>

//           {/* Story and Vision Section */}
//           <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
//             {/* Our Story */}
//             <div className="space-y-6">
//               <h4 className="text-3xl font-bold text-stone-800 mb-6">
//                 Our Story
//               </h4>
//               <div className="text-stone-600 text-lg leading-relaxed space-y-4">
//                 {companyInfo?.mission ? (
//                   <p>{companyInfo.mission}</p>
//                 ) : (
//                   <>
//                     <p>
//                       For over seven decades, we have been crafting the perfect
//                       cup of coffee, bringing together traditional brewing
//                       methods with modern innovation.
//                     </p>
//                     <p>
//                       Our journey began in 1950 with a simple vision: to serve
//                       exceptional coffee that brings people together and creates
//                       memorable moments.
//                     </p>
//                   </>
//                 )}
//               </div>
//               <button className="bg-amber-500 text-stone-900 px-8 py-3 rounded-none hover:bg-amber-600 transition-colors duration-300 font-medium">
//                 Learn More
//               </button>
//             </div>

//             {/* Company Image */}
//             <div className="relative">
//               <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-stone-200">
//                 {companyInfo?.imageUrl && !imageError ? (
//                   <div className="relative">
//                     {imageLoading && (
//                       <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center z-10">
//                         <div className="text-stone-500">Loading image...</div>
//                       </div>
//                     )}

//                     <div className="w-full h-96 overflow-hidden">
//                       <img
//                         src={getImageUrl(companyInfo.imageUrl)}
//                         alt={`${companyInfo.title || "Company"} Image`}
//                         className="w-full h-full object-contain bg-white"
//                         onError={(e) =>
//                           handleImageError(e, companyInfo.imageUrl)
//                         }
//                         onLoad={handleImageLoad}
//                         style={{
//                           display: imageLoading ? "none" : "block",
//                           maxWidth: "90%",
//                           maxHeight: "90%",
//                           margin: "auto",
//                         }}
//                       />
//                     </div>

//                     {process.env.NODE_ENV === "development" && (
//                       <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded">
//                         <div>DB Path: {companyInfo.imageUrl}</div>
//                         <div>Full URL: {getImageUrl(companyInfo.imageUrl)}</div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="w-full h-96 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center relative overflow-hidden">
//                     <div className="relative">
//                       <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-amber-500">
//                         <div className="w-24 h-24 bg-gradient-to-b from-amber-600 to-amber-500 rounded-full relative">
//                           <div className="absolute top-2 left-2 w-4 h-4 bg-amber-200 rounded-full opacity-60"></div>
//                         </div>
//                       </div>
//                       <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
//                         <div className="w-2 h-16 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full animate-pulse"></div>
//                         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-amber-500 rounded-full animate-bounce"></div>
//                       </div>
//                     </div>

//                     {imageError && (
//                       <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-300 rounded p-2">
//                         <p className="text-red-700 text-sm text-center">
//                           Image could not be loaded
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Our Vision Section */}
//           <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
//             {/* Vision Content */}
//             <div className="lg:order-2 space-y-6">
//               <h4 className="text-3xl font-bold text-stone-800 mb-6">
//                 Our Vision
//               </h4>
//               <div className="text-stone-600 text-lg leading-relaxed space-y-4">
//                 {companyInfo?.vision ? (
//                   <p>{companyInfo.vision}</p>
//                 ) : (
//                   <p>
//                     To become the world's most beloved coffee brand by
//                     consistently delivering exceptional quality, fostering
//                     community connections, and inspiring coffee culture across
//                     the globe.
//                   </p>
//                 )}
//               </div>

//               {/* Vision Points */}
//               <div className="space-y-4 mt-8">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                     <svg
//                       className="w-3 h-3 text-stone-900"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                   <span className="text-stone-600 font-medium">
//                     Premium Quality Coffee Beans
//                   </span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                     <svg
//                       className="w-3 h-3 text-stone-900"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                   <span className="text-stone-600 font-medium">
//                     Sustainable Sourcing Practices
//                   </span>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                     <svg
//                       className="w-3 h-3 text-stone-900"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                   <span className="text-stone-600 font-medium">
//                     Community-Focused Approach
//                   </span>
//                 </div>
//               </div>

//               <button className="bg-amber-500 text-stone-900 px-8 py-3 rounded-none hover:bg-amber-600 transition-colors duration-300 font-medium">
//                 Learn More
//               </button>
//             </div>

//             {/* Location Info */}
//             <div className="lg:order-1">
//               <div className="bg-white rounded-lg shadow-2xl p-8 border border-stone-200">
//                 <h5 className="text-2xl font-bold text-stone-800 mb-6">
//                   Our Location
//                 </h5>
//                 {companyInfo?.location ? (
//                   <div className="space-y-4 text-stone-600">
//                     {companyInfo.location.address && (
//                       <p className="flex items-start space-x-3">
//                         <svg
//                           className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>{companyInfo.location.address}</span>
//                       </p>
//                     )}
//                     {companyInfo.location.city && (
//                       <p className="flex items-center space-x-3">
//                         <svg
//                           className="w-5 h-5 text-amber-500 flex-shrink-0"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>
//                           {companyInfo.location.city},{" "}
//                           {companyInfo.location.country}
//                         </span>
//                       </p>
//                     )}
//                     {companyInfo.location.timezone && (
//                       <p className="flex items-center space-x-3">
//                         <svg
//                           className="w-5 h-5 text-amber-500 flex-shrink-0"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>Timezone: {companyInfo.location.timezone}</span>
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="space-y-4 text-stone-600">
//                     <p className="flex items-start space-x-3">
//                       <svg
//                         className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <span>123 Coffee Street, Bean City</span>
//                     </p>
//                     <p className="flex items-center space-x-3">
//                       <svg
//                         className="w-5 h-5 text-amber-500 flex-shrink-0"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       <span>Coffee Land, USA</span>
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Featured Achievements Section - Fixed condition and debug info */}
//           {achievements && achievements.length > 0 ? (
//             <div className="mb-20">
//               {/* Section Header */}
//               <div className="text-center mb-16">
//                 <div className="w-1 h-16 bg-amber-500 mx-auto mb-6"></div>
//                 <h2 className="text-amber-600 text-lg font-medium tracking-wider uppercase mb-4">
//                   OUR ACHIEVEMENTS
//                 </h2>
//                 <h3 className="text-5xl font-bold text-stone-800 mb-8">
//                   Awards & Recognition
//                 </h3>
//                 <p className="text-stone-600 text-lg max-w-3xl mx-auto">
//                   We're proud of the recognition we've received for our
//                   commitment to excellence and innovation.
//                 </p>
//               </div>

//               {/* Achievements Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {achievements.map((achievement, index) => (
//                   <div
//                     key={achievement.id || index}
//                     className="bg-white rounded-lg shadow-lg border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
//                   >
//                     {/* Achievement Image */}
//                     <div className="h-48 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden relative">
//                       {/* Fallback Icon */}
//                       <div
//                         className="fallback-icon absolute inset-0 flex items-center justify-center"
//                         // style={{ display: achievement.imageUrl ? 'none' : 'flex' }}
//                       >
//                         <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
//                           <svg
//                             className="w-10 h-10 text-white"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               fillRule="evenodd"
//                               d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 4.2L15 8v10H5V8l5-3.8z"
//                               clipRule="evenodd"
//                             />
//                             <path d="M10 8l-2 6h1l.5-1.5h3L13 14h1l-2-6h-2zm0 2.5l.75 2.25h-1.5L10 10.5z" />
//                           </svg>
//                         </div>
//                       </div>

//                       {/* Category Badge */}
//                       {achievement.category && (
//                         <div className="absolute top-4 left-4">
//                           <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-sm font-medium capitalize">
//                             {achievement.category.replace(/"/g, "")}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Achievement Content */}
//                     <div className="p-6">
//                       <h4 className="text-xl font-bold text-stone-800 mb-3 line-clamp-2">
//                         {achievement.title
//                           ? achievement.title.replace(/"/g, "")
//                           : "Achievement Title"}
//                       </h4>

//                       <p className="text-stone-600 mb-4 line-clamp-3">
//                         {achievement.description
//                           ? achievement.description.replace(/"/g, "")
//                           : "Achievement description not available."}
//                       </p>

//                       {/* Tags */}
//                       {achievement.tags && achievement.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {achievement.tags.slice(0, 3).map((tag, tagIndex) => (
//                             <span
//                               key={tagIndex}
//                               className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs"
//                             >
//                               {tag.replace ? tag.replace(/"/g, "") : tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}

//                       {/* Date */}
//                       <div className="flex items-center text-sm text-stone-500">
//                         <svg
//                           className="w-4 h-4 mr-2"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         <span>
//                           {achievement.dateAchieved
//                             ? formatDate(achievement.dateAchieved)
//                             : "Date not available"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* View All Button */}
//               {/* <div className="text-center mt-12">
//                 <button className="bg-amber-500 text-stone-900 px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300 font-medium"
//                 // onClick=get the acheivements page
//                 >
//                   View All Achievements
//                 </button>
//               </div>*/}
//             </div>
//           ) : (
//             /* Show this when no achievements are found */
//             process.env.NODE_ENV === "development" && (
//               <div className="mb-20 p-8 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
//                 <h3 className="text-xl font-bold text-yellow-800 mb-4">
//                   No Achievements Found
//                 </h3>
//                 <p className="text-yellow-700 mb-4">
//                   The achievements section is not displaying because:
//                 </p>
//                 <ul className="text-left text-yellow-700 space-y-2 max-w-md mx-auto">
//                   <li>• No achievements data returned from API</li>
//                   <li>• API endpoint might be incorrect</li>
//                   <li>• Check console for API errors</li>
//                   <li>• Verify API is running on port 8090</li>
//                 </ul>
//                 <button
//                   onClick={fetchFeaturedAchievements}
//                   className="mt-4 bg-yellow-500 text-yellow-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
//                 >
//                   Retry Loading Achievements
//                 </button>
//               </div>
//             )
//           )}
//         </div>
//       </div>

//       {/* Bottom decorative section */}
//       <div className="bg-stone-800 py-16 border-t border-stone-700">
//         <div className="max-w-4xl mx-auto text-center px-4">
//           <h3 className="text-4xl font-bold text-white mb-6">
//             Experience the Perfect Cup
//           </h3>
//           <p className="text-stone-300 text-lg mb-8 max-w-2xl mx-auto">
//             Join us in our coffee journey and discover why we've been the
//             preferred choice for coffee lovers for over 70 years.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button className="bg-amber-500 text-stone-900 px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300 font-medium">
//               Visit Our Store
//             </button>
//             <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-stone-900 transition-colors duration-300 font-medium">
//               View Our Menu
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;
