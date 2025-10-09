import React from 'react';
import { Keyboard, Command, Eye } from 'lucide-react';

const Shortcuts: React.FC = () => {
  const shortcuts = [
    {
      category: 'Core Actions',
      icon: Command,
      color: 'from-blue-500 to-cyan-500',
      shortcuts: [
        { key: 'Ctrl + H', action: 'Capture Screenshot', description: 'Take a screenshot for analysis' },
        { key: 'Ctrl + Enter', action: 'Analyze Screenshots', description: 'Send screenshots to backend for processing' },
        { key: 'Ctrl + G', action: 'Reset Sequence', description: 'Clear current session and start fresh' }
      ]
    },
    {
      category: 'Navigation',
      icon: Keyboard,
      color: 'from-purple-500 to-pink-500',
      shortcuts: [
        { key: 'Ctrl + Shift + ←', action: 'Previous Page', description: 'Navigate to previous result' },
        { key: 'Ctrl + Shift + →', action: 'Next Page', description: 'Navigate to next result' }
      ]
    },
    {
      category: 'Window Management',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      shortcuts: [
        { key: 'Ctrl + B', action: 'Show/Hide Window', description: 'Toggle window visibility' },
        { key: 'Ctrl + ←/→/↑/↓', action: 'Move Window', description: 'Reposition the application window' }
      ]
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Keyboard <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Shortcuts</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master these shortcuts to use Chameleon efficiently. Quick access to all core features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {shortcuts.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${category.color} bg-opacity-20`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{category.category}</h3>
              </div>
              
              <div className="space-y-4">
                {category.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-gray-700/30 rounded-2xl hover:bg-gray-700/50 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-1">
                          {shortcut.key.split(' + ').map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              {keyIndex > 0 && <span className="text-gray-500 text-sm">+</span>}
                              <kbd className={`px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r ${category.color} rounded-lg shadow-sm`}>
                                {key}
                              </kbd>
                            </React.Fragment>
                          ))}
                        </div>
                        <span className="text-white font-medium">{shortcut.action}</span>
                      </div>
                      <p className="text-sm text-gray-400">{shortcut.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl p-8 rounded-3xl border border-blue-500/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Use Ctrl+H to quickly capture screenshots</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Ctrl+Enter sends your screenshots for analysis</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Ctrl+G resets your current session</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300">Use Ctrl+B to quickly hide/show the window</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shortcuts;