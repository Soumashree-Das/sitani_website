import React, { useState, useEffect } from 'react';
import Footer from '../Components/Footer';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from localhost API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8090/api/v1/projects/getfeatured');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response structures
        let projectsArray;
        if (Array.isArray(data)) {
          projectsArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          projectsArray = data.data;
        } else if (data.projects && Array.isArray(data.projects)) {
          projectsArray = data.projects;
        } else if (data.results && Array.isArray(data.results)) {
          projectsArray = data.results;
        } else {
          // If it's an object, try to convert it to an array
          projectsArray = Object.values(data);
        }
        
        // Get only top 6 projects
        setProjects(projectsArray.slice(0, 6));
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        // Fallback to placeholder data if API fails
        setProjects([
          {
            _id: 1,
            name: "Skyline Residential Complex",
            description: "A modern 25-story residential tower with premium amenities, sustainable design, and panoramic city views. Features include smart home technology and energy-efficient systems.",
            status: "ongoing",
            startDate: "2024-01-15",
            endDate: "2025-12-30",
            featured: true,
            teamMembers: [
              { name: "John Smith", role: "Project Manager" },
              { name: "Sarah Wilson", role: "Site Engineer" }
            ]
          },
          {
            _id: 2,
            name: "Metro Bridge Construction",
            description: "Construction of a major bridge spanning 500 meters across the river, designed to handle heavy traffic loads and withstand extreme weather conditions.",
            status: "completed",
            startDate: "2023-03-01",
            endDate: "2024-02-28",
            featured: true,
            teamMembers: [
              { name: "Mike Johnson", role: "Structural Engineer" },
              { name: "Lisa Brown", role: "Construction Supervisor" }
            ]
          },
          {
            _id: 3,
            name: "Industrial Warehouse Facility",
            description: "State-of-the-art warehouse facility with automated systems, climate control, and advanced security features. Designed for maximum operational efficiency.",
            status: "planned",
            startDate: "2024-06-01",
            endDate: "2025-03-15",
            featured: false,
            teamMembers: [
              { name: "David Lee", role: "Project Coordinator" },
              { name: "Emily Chen", role: "Architect" }
            ]
          },
          {
            _id: 4,
            name: "Highway Infrastructure Project",
            description: "Major highway expansion project including road widening, new interchanges, and smart traffic management systems across 15 kilometers.",
            status: "ongoing",
            startDate: "2023-09-01",
            endDate: "2025-08-30",
            featured: true,
            teamMembers: [
              { name: "Robert Taylor", role: "Civil Engineer" },
              { name: "Amanda Davis", role: "Quality Assurance" }
            ]
          },
          {
            _id: 5,
            name: "Commercial Shopping Center",
            description: "Multi-level shopping complex with retail spaces, food courts, entertainment zones, and underground parking. Sustainable construction with LEED certification.",
            status: "completed",
            startDate: "2022-05-01",
            endDate: "2023-11-15",
            featured: false,
            teamMembers: [
              { name: "Chris Anderson", role: "Site Manager" },
              { name: "Jennifer White", role: "Safety Coordinator" }
            ]
          },
          {
            _id: 6,
            name: "Water Treatment Plant",
            description: "Advanced water treatment facility capable of processing 50 million gallons per day, incorporating cutting-edge filtration and purification technologies.",
            status: "on-hold",
            startDate: "2024-04-01",
            endDate: "2026-01-30",
            featured: false,
            teamMembers: [
              { name: "Mark Thompson", role: "Environmental Engineer" },
              { name: "Rachel Green", role: "Project Analyst" }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Static images for different project types
  const getProjectImage = (projectName, index) => {
    const images = [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", // Modern building
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", // Bridge construction
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", // Industrial facility
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", // Highway/road
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", // Shopping center
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"  // Infrastructure/utilities
    ];
    return images[index % images.length];
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'ongoing': return 'bg-blue-500';
      case 'planned': return 'bg-yellow-500';
      case 'on-hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-300 text-lg">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-stone-900">
      {/* Header with construction background */}
      <div 
        className="relative h-96 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-stone-900/85"></div>
        
        {/* Navigation */}
        <nav className="relative z-10 bg-stone-900/95 border-b border-stone-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="text-2xl font-bold text-white">KOPPEE</div>
              <div className="hidden md:flex space-x-8">
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors">Home</a>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors">About</a>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors">Services</a>
                <a href="#" className="text-amber-400 font-semibold">Projects</a>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors">Pages</a>
                <a href="#" className="text-stone-300 hover:text-amber-400 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4">PROJECTS</h1>
            <div className="flex items-center justify-center space-x-2 text-stone-300">
              <span>Home</span>
              <span>/</span>
              <span className="text-amber-400">Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="py-20 bg-stone-100" style={{ backgroundColor: '#FBFFF1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-px bg-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-500 uppercase tracking-wide text-sm font-semibold mb-2">OUR PROJECTS</p>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Building Excellence & Innovation</h2>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {projects.map((project, index) => (
              <div 
                key={project._id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={getProjectImage(project.name, index)} 
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`${getStatusColor(project.status)} text-white px-3 py-1 rounded-full text-sm font-semibold capitalize`}>
                      {project.status}
                    </span>
                  </div>
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-stone-900 mb-3">{project.name}</h3>
                  <p className="text-stone-600 leading-relaxed mb-4">{project.description}</p>
                  
                  {/* Project Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Start Date:</span>
                      <span className="text-stone-700 font-medium">{formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">End Date:</span>
                      <span className="text-stone-700 font-medium">{formatDate(project.endDate)}</span>
                    </div>
                  </div>

                  {/* Team Members */}
                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-stone-700 mb-2">Team Members:</h4>
                      <div className="space-y-1">
                        {project.teamMembers.slice(0, 2).map((member, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-stone-600">{member.name}</span>
                            <span className="text-stone-500">{member.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Error Display (if API fails) */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm">API Error: Using fallback data</p>
        </div>
      )}
    </div>
    <Footer/>
    </>
    
  );
};

export default Projects;