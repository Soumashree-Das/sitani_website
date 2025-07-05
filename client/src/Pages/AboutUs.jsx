import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import projectVideo1 from "../assets/project-1751351933840-532642380.mp4";
import constructionImage3 from "../assets/constrcution3.jpg";
import Footer from "../Components/Footer";

const AboutUs = () => {
  const [isMuted, setIsMuted] = useState(true);

  const slides = [
    {
      type: "video",
      src: projectVideo1,
    },
    {
      type: "image",
      src: constructionImage3,
    },
  ];

  const [companyInfo, setCompanyInfo] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [achievementsError, setAchievementsError] = useState(null);
  const [achievementImagesLoading, setAchievementImagesLoading] = useState({});
  const [achievementImagesError, setAchievementImagesError] = useState({});

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const videoRefs = useRef([]);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedAchievements = async () => {
    try {
      setAchievementsLoading(true);
      setAchievementsError(null);

      const response = await fetch(
        "http://localhost:8090/api/v1/acheivements/featured",
        {
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (Array.isArray(result)) {
        setAchievements(result);
      } else if (result.data) {
        setAchievements(result.data);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (err) {
      setAchievementsError(err.message);
      setAchievements([]);
    } finally {
      setAchievementsLoading(false);
    }
  };

  const getImageUrl = (dbPath) => {
    if (!dbPath) return null;
    const filename = dbPath.split("/").pop();
    return `http://localhost:8090/api/v1/companyInfo/uploads/company-images/${filename}`;
  };

  const handleImageError = (e, originalPath) => {
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanyInfo();
    fetchFeaturedAchievements();
  }, []);

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
      {/* <div className="relative w-full h-screen overflow-hidden">
        <video
          ref={(el) => (videoRefs.current[0] = el)}
          src={projectVideo1}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-amber-500" />
          ) : (
            <Volume2 className="w-6 h-6 text-amber-500" />
          )}
        </button>
      </div> */}

      <div className="relative w-full h-screen overflow-hidden">
        <video
          ref={(el) => (videoRefs.current[0] = el)}
          src={projectVideo1}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-contain" // <== Changed from object-cover to object-contain
        />

        {/* Bottom-Right Mute / Unmute Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-amber-500" />
          ) : (
            <Volume2 className="w-6 h-6 text-amber-500" />
          )}
        </button>
      </div>

      {/* Include the rest of your sections like Company Info, Vision, Achievements here */}
      {/* Main Content Section */}
      <div className="bg-[#FBFFF1] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          {/* <div className="text-center mb-16">
            <div className="w-1 h-16 bg-amber-500 mx-auto mb-6"></div>
            <h2 className="text-amber-600 text-lg font-medium tracking-wider uppercase mb-4">
              ABOUT US
            </h2>
            
          </div> */}
          <div className="text-center mb-16">
            <div className="w-16 h-px bg-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-500 uppercase tracking-wide text-sm font-semibold mb-2">
              ABOUT US
            </p>
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
              <div className="text-center mt-12">
                <button
                  className="bg-amber-500 text-stone-900 px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors duration-300 font-medium"
                  onClick={() => navigate("/achievements/all")} // Using react-router navigation
                >
                  View All Achievements
                </button>
              </div>
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

      <Footer />
    </div>
  );
};

export default AboutUs;
