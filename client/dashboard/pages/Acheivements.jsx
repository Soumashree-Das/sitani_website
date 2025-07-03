// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const acheivementsDashboard = () => {
//   const [acheivements, setacheivements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newacheivement, setNewacheivement] = useState({
//     title: '',
//     description: '',
//     category: '',
//     featured: false,
//     tags: '',
//     dateAchieved: '',
//     image: null
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);

//   useEffect(() => {
//     fetchacheivements();
//   }, []);

//   const fetchacheivements = async () => {
//     try {
//       const response = await axios.get('http://localhost:8090/api/v1/acheivements');
//       setacheivements(response.data.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewacheivement({
//       ...newacheivement,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleFileChange = (e) => {
//     setNewacheivement({
//       ...newacheivement,
//       image: e.target.files[0]
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       Object.entries(newacheivement).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           formData.append(key, value);
//         }
//       });

//       if (editingId) {
//         // Update existing acheivement
//         await axios.put(`http://localhost:8090/api/v1/acheivements/${editingId}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         // Create new acheivement
//         await axios.post('http://localhost:8090/api/v1/acheivements', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }
      
//       fetchacheivements();
//       setShowAddForm(false);
//       setEditingId(null);
//       setNewacheivement({
//         title: '',
//         description: '',
//         category: '',
//         featured: false,
//         tags: '',
//         dateAchieved: '',
//         image: null
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleEdit = (acheivement) => {
//     setEditingId(acheivement._id);
//     setNewacheivement({
//       title: acheivement.title,
//       description: acheivement.description,
//       category: acheivement.category,
//       featured: acheivement.featured,
//       tags: acheivement.tags?.join(', '),
//       dateAchieved: new Date(acheivement.dateAchieved).toISOString().split('T')[0],
//       image: null
//     });
//     setShowAddForm(true);
//     useNavigate('/admin/acheivements');
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this acheivement?')) {
//       try {
//         await axios.delete(`http://localhost:8090/api/v1/acheivements/${id}`);
//         fetchacheivements();
//       } catch (err) {
//         setError(err.message);
//       }
//     }
//   };

//   const cancelEdit = () => {
//     setShowAddForm(false);
//     setEditingId(null);
//     setNewacheivement({
//       title: '',
//       description: '',
//       category: '',
//       featured: false,
//       tags: '',
//       dateAchieved: '',
//       image: null
//     });
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
      
//       <a href="/admin">
//       <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
//         Dashboard
//       </button>
//     </a>
//       <h1 className="text-3xl font-bold mb-8">acheivements Dashboard</h1>
      
//       <button 
//         onClick={() => {
//           setShowAddForm(!showAddForm);
//           if (showAddForm) cancelEdit();
//         }}
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
//       >
//         {showAddForm ? 'Cancel' : 'Add New acheivement'}
//       </button>

//       {showAddForm && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//           <h2 className="text-xl font-semibold mb-4">
//             {editingId ? 'Edit acheivement' : 'Add New acheivement'}
//           </h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">acheivement Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={newacheivement.title}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Description</label>
//               <textarea
//                 name="description"
//                 value={newacheivement.description}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Category</label>
//               <select
//                 name="category"
//                 value={newacheivement.category}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               >
//                 <option value="">Select a category</option>
//                 <option value="award">Award</option>
//                 <option value="milestone">Milestone</option>
//                 <option value="certification">Certification</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Date Achieved</label>
//               <input
//                 type="date"
//                 name="dateAchieved"
//                 value={newacheivement.dateAchieved}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border rounded"
//                 required
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Tags (comma separated)</label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={newacheivement.tags}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border rounded"
//                 placeholder="e.g., web,design,responsive"
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">Featured</label>
//               <input
//                 type="checkbox"
//                 name="featured"
//                 checked={newacheivement.featured}
//                 onChange={handleInputChange}
//                 className="mr-2"
//               />
//               <span>Mark as featured</span>
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 mb-2">acheivement Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 onChange={handleFileChange}
//                 className="w-full px-3 py-2 border rounded"
//               />
//               {editingId && (
//                 <p className="text-sm text-gray-500 mt-1">
//                   Leave empty to keep current image
//                 </p>
//               )}
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 {editingId ? 'Update acheivement' : 'Save acheivement'}
//               </button>
//               {editingId && (
//                 <button
//                   type="button"
//                   onClick={cancelEdit}
//                   className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {acheivements.map((acheivement) => (
//           <div key={acheivement._id} className="bg-white p-6 rounded-lg shadow-md relative">
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-xl font-semibold">{acheivement.title}</h3>
//               {acheivement.featured && (
//                 <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                   Featured
//                 </span>
//               )}
//             </div>
//             <p className="text-gray-600 mb-4">{acheivement.description}</p>
            
//             <div className="flex flex-wrap gap-2 mb-4">
//               {acheivement.tags?.map((tag) => (
//                 <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                   {tag}
//                 </span>
//               ))}
//             </div>
            
//             <div className="text-sm text-gray-500 mb-2">
//               <span className="font-medium">Category:</span> {acheivement.category}
//             </div>
//             <div className="text-sm text-gray-500 mb-4">
//               <span className="font-medium">Date:</span> {new Date(acheivement.dateAchieved).toLocaleDateString()}
//             </div>
            
//             {acheivement.imageUrl && (
//               <div className="mb-4">
//                 <img 
//                   src={acheivement.imageUrl} 
//                   alt={acheivement.title}
//                   className="w-full h-auto rounded"
//                 />
//               </div>
//             )}
            
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => handleEdit(acheivement)}
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(acheivement._id)}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default acheivementsDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeftSideNavbar from '../components/LeftSideNavbar';

const AchievementsDashboard = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    category: '',
    featured: false,
    tags: '',
    dateAchieved: '',
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/achievements');
      setAchievements(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAchievement({
      ...newAchievement,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setNewAchievement({
      ...newAchievement,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newAchievement).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (editingId) {
        await axios.put(`http://localhost:8090/api/v1/achievements/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:8090/api/v1/achievements', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      fetchAchievements();
      setShowAddForm(false);
      setEditingId(null);
      setNewAchievement({
        title: '',
        description: '',
        category: '',
        featured: false,
        tags: '',
        dateAchieved: '',
        image: null
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (achievement) => {
    setEditingId(achievement._id);
    setNewAchievement({
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      featured: achievement.featured,
      tags: achievement.tags?.join(', '),
      dateAchieved: new Date(achievement.dateAchieved).toISOString().split('T')[0],
      image: null
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await axios.delete(`http://localhost:8090/api/v1/achievements/${id}`);
        fetchAchievements();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const cancelEdit = () => {
    setShowAddForm(false);
    setEditingId(null);
    setNewAchievement({
      title: '',
      description: '',
      category: '',
      featured: false,
      tags: '',
      dateAchieved: '',
      image: null
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-stone-900 text-amber-400">
      Loading...
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-stone-900 text-red-400">
      Error: {error}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-stone-900 text-stone-300">
      <LeftSideNavbar />
      
      <div className="flex-1 p-8 ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-6">Achievements Dashboard</h1>
          
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (showAddForm) cancelEdit();
            }}
            className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2 px-4 rounded mb-6 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add New Achievement'}
          </button>

          {showAddForm && (
            <div className="bg-stone-800 p-6 rounded-lg shadow-md mb-8 border border-stone-700">
              <h2 className="text-xl font-semibold mb-4 text-amber-400">
                {editingId ? 'Edit Achievement' : 'Add New Achievement'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Achievement Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newAchievement.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-700 rounded bg-stone-900 text-stone-300"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={newAchievement.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-700 rounded bg-stone-900 text-stone-300"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={newAchievement.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-700 rounded bg-stone-900 text-stone-300"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="award">Award</option>
                    <option value="milestone">Milestone</option>
                    <option value="certification">Certification</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Date Achieved</label>
                  <input
                    type="date"
                    name="dateAchieved"
                    value={newAchievement.dateAchieved}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-700 rounded bg-stone-900 text-stone-300"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={newAchievement.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-700 rounded bg-stone-900 text-stone-300"
                    placeholder="e.g., web,design,responsive"
                  />
                </div>
                
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={newAchievement.featured}
                    onChange={handleInputChange}
                    className="mr-2 h-5 w-5 text-amber-500 border-stone-700 rounded focus:ring-amber-500 bg-stone-900"
                  />
                  <span className="text-stone-300">Mark as featured</span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-stone-300 mb-2">Achievement Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-stone-700 rounded bg-stone-900 text-stone-300"
                  />
                  {editingId && (
                    <p className="text-sm text-stone-500 mt-1">
                      Leave empty to keep current image
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2 px-4 rounded transition-colors"
                  >
                    {editingId ? 'Update Achievement' : 'Save Achievement'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-stone-700 hover:bg-stone-600 text-stone-300 font-bold py-2 px-4 rounded transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement._id} className="bg-stone-800 p-6 rounded-lg shadow-md border border-stone-700 relative hover:border-amber-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-amber-400">{achievement.title}</h3>
                  {achievement.featured && (
                    <span className="bg-amber-500/20 text-amber-400 text-xs font-medium px-2.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-stone-400 mb-4">{achievement.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {achievement.tags?.map((tag) => (
                    <span key={tag} className="bg-amber-500/20 text-amber-400 text-xs font-medium px-2.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-sm text-stone-500 mb-2">
                  <span className="font-medium text-stone-400">Category:</span> {achievement.category}
                </div>
                <div className="text-sm text-stone-500 mb-4">
                  <span className="font-medium text-stone-400">Date:</span> {new Date(achievement.dateAchieved).toLocaleDateString()}
                </div>
                
                {achievement.imageUrl && (
                  <div className="mb-4">
                    <img 
                      src={achievement.imageUrl} 
                      alt={achievement.title}
                      className="w-full h-auto rounded border border-stone-700"
                    />
                  </div>
                )}
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-1 px-3 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(achievement._id)}
                    className="bg-red-500/80 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsDashboard;