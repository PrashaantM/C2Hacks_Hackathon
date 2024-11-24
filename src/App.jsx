import React, { useState, useEffect } from 'react';
import './App.css'; // Main stylesheet
import './Search.css'; // Search page styles

const App = () => {
  const [showSearch, setShowSearch] = useState(false); // Toggle between About and Search views
  const [expanded, setExpanded] = useState(false); // Toggle expanded state of AI Assistant
  const [searchQuery, setSearchQuery] = useState(''); // User input for search
  const [dropdownResults, setDropdownResults] = useState([]); // Dropdown options
  const [searchContent, setSearchContent] = useState(''); // Content to display in grey window
  const [chatHistory, setChatHistory] = useState([]); // Store chat history

  useEffect(() => {
    if (expanded && chatHistory.length === 0) {
      // Add the initial greeting message when the chatbot is expanded
      setChatHistory([{ type: 'bot', message: 'Hi, how can I help you?' }]);
    }
  }, [expanded, chatHistory]);

  const toggleSearch = () => {
    setShowSearch(!showSearch); // Switch between About and Search
    resetSearch(); // Clear search state when switching back
  };

  const toggleAssistant = () => {
    if (!expanded) {
      setExpanded(true); // Only expand the AI Assistant, never collapse
    }
  };
  

  const resetSearch = () => {
    setSearchQuery('');
    setDropdownResults([]);
    setSearchContent('');
  };

  const handleSearchInput = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    // Filter matching file names for dropdown
    if (query.trim() === '') {
      setDropdownResults([]);
    } else {
      const matches = [
        'Benefits of programmable thermostats',
        'Upcycling ideas for everyday items',
        'Community programs for electronic recycling',
        'Using low-flow faucets and showerheads',
        'DIY irrigation systems for gardens',
        'Switching to energy-efficient light bulbs',
        'Introduction to solar panel systems',
        'Composting organic kitchen waste',
      ].filter((file) => file.toLowerCase().includes(query));
      setDropdownResults(matches);
    }
  };
  

  const handleSelectResult = async (result) => {
    setSearchQuery(result); // Set search query to selected result
    setDropdownResults([]); // Clear dropdown

    // Fetch content from the corresponding file
    try {
      const content = await fetch(`/Data/${result}.txt`).then((res) => res.text());
      setSearchContent(content);
    } catch (error) {
      setSearchContent('Unable to fetch the file content. Please check the file path.');
    }
  };

  // Handle user input in the chatbot
  const handleChatSubmit = async (userQuestion) => {
    const chatResponse = getChatbotResponse(userQuestion);
    setChatHistory([
      ...chatHistory,
      { type: 'user', message: userQuestion },
      { type: 'bot', message: chatResponse },
    ]);
  };

  // Simple function to provide a response based on available data
  const getChatbotResponse = (question) => {
    const lowerCaseQuestion = question.toLowerCase();
  
    // Create a mapping of keywords/phrases to responses
    const responses = [
      {
        keywords: ['recycle', 'recycling', 'e-waste', 'electronic recycling', 'upcycle', 'upcycling'],
        response: 'Recycling helps reduce waste and conserve resources. Consider upcycling or using community programs for electronic recycling.'
      },
      {
        keywords: ['water', 'water saving', 'conserve water', 'low-flow', 'irrigation'],
        response: 'Water conservation can be achieved through rainwater harvesting, low-flow faucets, and DIY irrigation systems for gardens.'
      },
      {
        keywords: ['heat', 'heating', 'thermostat', 'programmable thermostat', 'insulation'],
        response: 'To save on heating costs, consider using programmable thermostats and proper insulation.'
      },
      {
        keywords: ['electricity', 'electric', 'energy saving', 'light bulb', 'solar panel'],
        response: 'To save electricity, switch to energy-efficient appliances, use LED light bulbs, and consider installing solar panel systems.'
      },
      {
        keywords: ['waste', 'waste management', 'compost', 'kitchen waste'],
        response: 'Effective waste management includes recycling, composting organic kitchen waste, and reducing single-use plastics.'
      },
      {
        keywords: ['transport', 'transportation', 'public transport', 'carpool', 'cycle', 'bike'],
        response: 'Consider public transportation, carpooling, or cycling to reduce emissions and save money.'
      },
      {
        keywords: ['housing', 'house', 'accommodation', 'affordable housing', 'shared housing'],
        response: 'Looking for affordable housing? Check community resources and consider shared accommodations.'
      },
      {
        keywords: ['language', 'learn language', 'language learning', 'language classes', 'language tools'],
        response: 'Language learning resources include online tools, mobile apps, and local community classes.'
      },
      {
        keywords: ['meal', 'meal plan', 'meal planning', 'food plan', 'save food', 'food waste'],
        response: 'Plan meals for the week to save time and reduce food waste. Check out our meal planning tips.'
      },
      {
        keywords: ['budget', 'budgeting', 'saving money', 'track expenses', 'expense tracker'],
        response: 'Track your expenses and set saving goals. Use our budget tracking tips for help.'
      },
      {
        keywords: ['insurance', 'health insurance', 'car insurance', 'home insurance'],
        response: 'Insurance is essential for health, home, and car safety. Learn more in our resources.'
      },
      {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'yo'],
        response: 'Hello! How can I assist you today?'
      }
    ];
  
    // Check the question against all keywords and return the matching response
    for (const { keywords, response } of responses) {
      if (keywords.some((keyword) => lowerCaseQuestion.includes(keyword))) {
        return response;
      }
    }
  
    // Default response if no keywords match
    return 'Sorry, I don’t have an answer for that. Can you ask something else?';
  };
  

  return (
    <div className="mainPage-container">
      <div className="header">
        {showSearch && (
          <button className="back-arrow" onClick={toggleSearch}>
            ←
          </button>
        )}
        <h1 className="site-title">Immigration Hub</h1>
        {!showSearch && (
          <button className="search-icon" onClick={toggleSearch}>
            🔍
          </button>
        )}
      </div>

      <div className="info-container">
        {showSearch ? (
          <div className="search-container">
            <h3>Search Recommendations</h3>
            <input
              type="text"
              className="search-bar"
              placeholder="Enter a topic..."
              value={searchQuery}
              onChange={handleSearchInput}
            />
            {dropdownResults.length > 0 && (
              <ul className="dropdown-menu">
                {dropdownResults.map((result, index) => (
                  <li
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleSelectResult(result)}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            )}
            <div className="search-results">
              <h4>{searchQuery} - Content</h4>
              <p>{searchContent}</p>
            </div>
          </div>
        ) : (
          <div className="about-container">
            <h3>About Page</h3>
            <p>Welcome to Immigration Hub! Next steps: finalize the search feature and integrate the chatbot with relevant features.</p>
          </div>
        )}

        <div className="assistant-container">
          <div className={`ai-assistant ${expanded ? 'expanded' : 'collapsed'}`} onClick={toggleAssistant}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnbcniPD9JFz_pqu-Dt3bDMPQ8GReGAdPZDQ&s"
              alt="Assistant"
              className="assistant-image"
            />
            {expanded ? (
              <div className="chatbot">
                <h3>AI Assistant</h3>
                <div className="chat-history">
                  {chatHistory.map((entry, index) => (
                    <div key={index} className={entry.type}>
                      <p>{entry.message}</p>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask me something..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleChatSubmit(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            ) : (
              <p>Chat with me!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
