import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Image, 
  Settings, 
  Mail, 
  Calendar, 
  ShoppingCart, 
  BarChart3, 
  MessageSquare, 
  Globe, 
  User
} from 'lucide-react';

const SidePanel = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const navigationSections = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', icon: Home, color: 'text-blue-600' },
        { name: 'Company Info', icon: Globe, color: 'text-gray-600' },
        { name: 'Services', icon: Settings, color: 'text-gray-600' },
        { name: 'Projects', icon: ShoppingCart, color: 'text-gray-600' },
      ]
    },
    {
      title: 'CONTENT',
      items: [
        { name: 'News', icon: FileText, color: 'text-gray-600' },
        { name: 'Achievements', icon: BarChart3, color: 'text-gray-600' },
      ]
    },
    {
      title: 'COMMUNICATION',
      items: [
        { name: 'Send Mail', icon: Mail, color: 'text-gray-600' },
      ]
    }
  ];

  const NavItem = ({ item, isActive, onClick }) => {
    const IconComponent = item.icon;
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-blue-100 text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
        }`}
      >
        <IconComponent className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : item.color}`} />
        <span className="font-medium">{item.name}</span>
      </button>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full pt-4 my-9">
          <div className="flex-1 px-4 space-y-6 overflow-y-auto">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.name}
                      item={item}
                      isActive={activeSection === item.name}
                      onClick={() => {
                        setActiveSection(item.name);
                        setSidebarOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SidePanel;