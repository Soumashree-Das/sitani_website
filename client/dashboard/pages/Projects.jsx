import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Star, X } from "lucide-react";

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planned",
    featured: false,
    teamMembers: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const BASE_URL = "http://localhost:8090/api/v1/projects";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   const formDataToSend = new FormData();

  //   // Append all regular fields
  //   formDataToSend.append('name', formData.name);
  //   formDataToSend.append('description', formData.description);
  //   formDataToSend.append('startDate', formData.startDate);
  //   formDataToSend.append('endDate', formData.endDate);
  //   formDataToSend.append('status', formData.status);
  //   formDataToSend.append('featured', formData.featured);
    
  //   // Stringify the teamMembers array
  //   formDataToSend.append('teamMembers', JSON.stringify(formData.teamMembers));

  //   // Append files
  //   imageFiles.forEach((file) => {
  //     formDataToSend.append("images", file);
  //   });

  //   videoFiles.forEach((file) => {
  //     formDataToSend.append("videos", file);
  //   });

  //   try {
  //     const url = editingProject
  //       ? `${BASE_URL}/update/${editingProject._id}`
  //       : BASE_URL;
  //     const method = editingProject ? "PUT" : "POST";

  //     const response = await fetch(url, {
  //       method,
  //       body: formDataToSend,
  //     });

  //     const responseData = await response.json(); // Always parse the response
      
  //     if (!response.ok) {
  //       throw new Error(responseData.error || 'Failed to save project');
  //     }

  //     fetchProjects();
  //     resetForm();
  //   } catch (error) {
  //     console.error("Error saving project:", error.message);
  //     alert(`Error: ${error.message}`); // Show error to user
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formDataToSend = new FormData();

  // Append all regular fields
  formDataToSend.append('name', formData.name);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('startDate', formData.startDate);
  formDataToSend.append('endDate', formData.endDate);
  formDataToSend.append('status', formData.status);
  formDataToSend.append('featured', formData.featured);
  
  // Append team members directly (no stringification)
  formData.teamMembers.forEach((member, index) => {
    formDataToSend.append(`teamMembers[${index}][name]`, member.name);
    formDataToSend.append(`teamMembers[${index}][role]`, member.role);
  });

  // Append files
  imageFiles.forEach((file) => {
    formDataToSend.append("images", file);
  });

  videoFiles.forEach((file) => {
    formDataToSend.append("videos", file);
  });

  try {
    const url = editingProject
      ? `${BASE_URL}/update/${editingProject._id}`
      : BASE_URL;
    const method = editingProject ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      body: formDataToSend,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to save project');
    }

    fetchProjects();
    resetForm();
  } catch (error) {
    console.error("Error saving project:", error.message);
    alert(`Error: ${error.message}`);
  }
};

  const handleDelete = async (id) => {
    if (confirm("Delete this project?")) {
      try {
        await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "planned",
      featured: false,
      teamMembers: [],
    });
    setImageFiles([]);
    setVideoFiles([]);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      status: project.status,
      featured: project.featured,
      teamMembers: project.teamMembers || [],
    });
    setShowForm(true);
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", role: "" }],
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData({ ...formData, teamMembers: updated });
  };

  const removeTeamMember = (index) => {
    const updated = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: updated });
  };

  return (
    <div className="w-full h-full bg-stone-900/95 flex backdrop-blur-sm">
      <div className="p-6 max-w-7xl mx-5 my-20 bg-[#FBFFF1] rounded-lg shadow-lg ">
        <a href="/admin">
          <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-md transition-colors duration-200">
            Dashboard
          </button>
        </a>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-stone-900">
            Projects Dashboard
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Plus size={20} />
            Add Project
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-8 pb-8 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-4 border border-stone-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-stone-900">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-stone-500 hover:text-stone-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />

                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-3 border border-stone-300 rounded-lg h-24 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="planned">Planned</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>

                <label className="flex items-center gap-2 text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500"
                  />
                  Featured Project
                </label>

                <div>
                  <h3 className="font-semibold mb-2 text-stone-700">
                    Team Members
                  </h3>
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMember(index, "name", e.target.value)
                        }
                        className="flex-1 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        value={member.role}
                        onChange={(e) =>
                          updateTeamMember(index, "role", e.target.value)
                        }
                        className="flex-1 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-stone-700 hover:bg-stone-100 p-2 rounded transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="text-amber-600 hover:text-amber-700 p-2 rounded transition-colors duration-200"
                  >
                    + Add Team Member
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold text-stone-700">
                      Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setImageFiles(Array.from(e.target.files))
                      }
                      className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-stone-700">
                      Videos
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) =>
                        setVideoFiles(Array.from(e.target.files))
                      }
                      className="w-full p-2 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSubmit}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded transition-colors duration-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    {editingProject ? "Update" : "Create"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-stone-500 hover:bg-stone-600 text-white px-4 py-2 rounded transition-colors duration-200 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="border border-stone-200 rounded-lg p-4 bg-white shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-stone-900">
                      {project.name}
                    </h3>
                    {project.featured && (
                      <Star className="text-amber-500" size={20} />
                    )}
                  </div>
                  <p className="text-stone-600 mb-2">{project.description}</p>
                  <div className="text-sm text-stone-500 space-y-1">
                    <p>
                      Status:{" "}
                      <span className="font-semibold">{project.status}</span>
                    </p>
                    {project.startDate && (
                      <p>
                        Start:{" "}
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    )}
                    {project.endDate && (
                      <p>
                        End: {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-stone-700">
                        Team:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.teamMembers.map((member, index) => (
                          <span
                            key={index}
                            className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-800"
                          >
                            {member.name} ({member.role})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-amber-600 hover:bg-amber-50 p-2 rounded transition-colors duration-200"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-stone-700 hover:bg-stone-100 p-2 rounded transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
