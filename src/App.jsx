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
        'Rainwater harvesting systems for homes',
        'Using low-flow faucets and showerheads',
        'DIY irrigation systems for gardens',
        'Benefits of programmable thermostats',
        'Switching to energy-efficient light bulbs',
        'Introduction to solar panel systems',
        'Composting organic kitchen waste',
        'Community programs for electronic recycling',
        'Native plant landscaping to reduce water use',
        'Sorting and recycling household materials',
        'Upcycling ideas for everyday items'
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
        <h1 className="site-title">The Immigration Hub</h1>
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
          <p>This app is designed to help immigrants coming to Canada by providing useful tips on how to live more sustainably. It offers easy advice on things like waste management, saving energy, and conserving water. The goal is to make it easier for newcomers to adopt eco-friendly habits and reduce their impact on the environment while settling into life in Canada.</p>
          
          {/* Add big image here */}
          <img 
            src="data:image/jpeg;base64,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" // Replace with your desired image URL
            alt="Immigration Hub Overview"
            className="about-image"
          />
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
