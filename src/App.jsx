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
    setExpanded(!expanded); // Expand or collapse AI Assistant
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
      const matches = ['recycling', 'water', 'heating'].filter((file) => file.includes(query)); // Add more topics as needed
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
    const chatResponse = await getChatbotResponse(userQuestion);
    setChatHistory([
      ...chatHistory,
      { type: 'user', message: userQuestion },
      { type: 'bot', message: chatResponse }
    ]);
  };

  // Simple function to provide a response based on available data
  const getChatbotResponse = (question) => {
    if (question.toLowerCase().includes('recycling')) {
      return 'Recycling helps reduce waste and conserve resources. Check our recycling tips.';
    } else if (question.toLowerCase().includes('water')) {
      return 'Water conservation can be achieved through rainwater harvesting and proper irrigation systems.';
    } else if (question.toLowerCase().includes('heating')) {
      return 'To save on heating costs, consider using programmable thermostats and proper insulation.';
    } else if (question.toLowerCase().includes('hi' || 'hey' || 'hello' || 'yo')) {
      return 'Hello, if you have any doubts you can ask me anything.';
    } else {
      return 'Sorry, I don’t have an answer for that. Can you ask something else?';
    }
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
