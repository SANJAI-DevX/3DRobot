import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Twitter, 
  Github, 
  Dribbble, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  Star,
  Briefcase,
  Users,
  Coffee,
  Heart
} from 'lucide-react';

const AnimatedProfileCard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const skills = [
    { name: 'UI/UX Design', level: 95, color: 'bg-red-400' },
    { name: 'React', level: 88, color: 'bg-teal-400' },
    { name: 'JavaScript', level: 92, color: 'bg-blue-400' },
    { name: 'Figma', level: 85, color: 'bg-green-400' }
  ];

  const achievements = [
    { icon: Award, count: '12+', label: 'Awards' },
    { icon: Briefcase, count: '50+', label: 'Projects' },
    { icon: Users, count: '2.5K', label: 'Followers' },
    { icon: Coffee, count: '1000+', label: 'Coffee Cups' }
  ];

  const socialLinks = [
    { icon: Dribbble, color: 'hover:bg-pink-500', href: '#' },
    { icon: Github, color: 'hover:bg-gray-800', href: '#' },
    { icon: Twitter, color: 'hover:bg-blue-400', href: '#' },
    { icon: Facebook, color: 'hover:bg-blue-600', href: '#' }
  ];

  const tabs = [
    { id: 'about', label: 'About', icon: Users },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans flex items-center justify-center">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Puff animation background circle */}
      <div 
        className={`absolute transform bg-slate-800 rounded-full z-10 transition-all duration-500 ease-out ${
          isLoaded 
            ? 'inset-0 w-screen h-screen' 
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0'
        }`}
        style={{ 
          transitionDelay: isLoaded ? '1.8s' : '0s',
          borderRadius: isLoaded ? '0%' : '50%'
        }}
      />

      {/* Profile Card */}
      <div 
        className={`relative z-20 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-1000 ease-out ${
          isLoaded 
            ? 'w-96 h-80 opacity-100 scale-100' 
            : 'w-14 h-14 opacity-0 scale-50 bg-amber-400 rounded-full'
        }`}
        style={{
          transitionDelay: isLoaded ? '2.7s' : '0.2s'
        }}
      >
        
        {/* Header Section */}
        <div 
          className={`flex items-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all duration-800 ease-out ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
          style={{ transitionDelay: '3.1s' }}
        >
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" 
              alt="Profile"
              className={`w-12 h-12 rounded-full border-2 border-white/30 shadow-lg transition-all duration-500 ${
                isLoaded ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
              }`}
              style={{ transitionDelay: '3.3s' }}
            />
            <div 
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse transition-all duration-300 ${
                isLoaded ? 'scale-100' : 'scale-0'
              }`}
              style={{ transitionDelay: '3.7s' }}
            />
          </div>
          
          <div 
            className={`ml-3 flex-1 transition-all duration-600 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '3.4s' }}
          >
            <h1 className="text-lg font-bold">Alex Rodriguez</h1>
            <p className="text-indigo-100 text-sm">Senior UI/UX Designer</p>
            <div className="flex items-center mt-1 text-xs text-indigo-200">
              <MapPin size={10} className="mr-1" />
              San Francisco, CA
            </div>
          </div>
          
          <div 
            className={`text-right transition-all duration-600 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '3.6s' }}
          >
            <div className="flex text-xs text-indigo-200 mb-1">
              <Star size={10} className="mr-1 text-yellow-300" />
              4.9/5.0
            </div>
            <div className="text-xs text-indigo-200">156 reviews</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div 
          className={`flex border-b border-gray-200 transition-all duration-600 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: '3.5s' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={12} className="mr-1" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div 
          className={`p-4 h-44 overflow-y-auto transition-all duration-800 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '3.3s' }}
        >
          
          {activeTab === 'about' && (
            <div className="space-y-3">
              <p className="text-gray-600 text-sm leading-relaxed">
                Passionate designer with 5+ years creating digital experiences that users love. 
                Specialized in mobile-first design and design systems.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={index} 
                      className={`text-center p-2 bg-gray-50 rounded-lg cursor-pointer transition-all duration-500 hover:bg-gray-100 hover:-translate-y-1 hover:scale-105 ${
                        isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'
                      }`}
                      style={{ 
                        transitionDelay: `${3.8 + index * 0.1}s` 
                      }}
                    >
                      <IconComponent size={14} className="mx-auto text-indigo-500 mb-1" />
                      <div className="text-base font-bold text-gray-800">{achievement.count}</div>
                      <div className="text-xs text-gray-500">{achievement.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div 
                  key={index} 
                  className={`transition-all duration-600 ease-out ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${4.0 + index * 0.2}s` }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ease-out ${skill.color} ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ 
                        width: isLoaded ? `${skill.level}%` : '0%',
                        transitionDelay: `${4.2 + index * 0.2}s`
                      }}
                    />
                  </div>
                </div>
              ))}
              
              <div 
                className={`mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg transition-all duration-600 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '4.8s' }}
              >
                <div className="flex items-center text-sm text-indigo-700">
                  <Heart size={12} className="mr-2 text-red-500" />
                  <span className="font-medium">Currently learning:</span>
                </div>
                <p className="text-xs text-indigo-600 mt-1">Three.js, WebGL, and Advanced Animations</p>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`space-y-2 transition-all duration-600 ease-out ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: '4.0s' }}
                >
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={12} className="mr-2 text-gray-400" />
                    <span className="text-xs">alex@design.com</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={12} className="mr-2 text-gray-400" />
                    <span className="text-xs">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={12} className="mr-2 text-gray-400" />
                    <span className="text-xs">Available for hire</span>
                  </div>
                </div>
                
                <div 
                  className={`flex flex-col items-end space-y-2 transition-all duration-600 ease-out ${
                    isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: '4.2s' }}
                >
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className={`p-2 bg-gray-100 rounded-full text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.color} ${
                          isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
                        }`}
                        style={{ transitionDelay: `${4.2 + index * 0.1}s` }}
                      >
                        <IconComponent size={12} />
                      </a>
                    );
                  })}
                </div>
              </div>
              
              <button 
                className={`w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '4.6s' }}
              >
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimatedProfileCard;