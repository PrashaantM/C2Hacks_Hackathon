import React, { useState } from 'react';

const SustainabilityTipsPage = () => {
  const [content, setContent] = useState('');

  const fileLinks = [
    { name: 'Water Conservation', fileName: 'water_conservation.txt' },
    { name: 'Electricity Conservation', fileName: 'electricity_conservation.txt' },
    { name: 'Waste Management', fileName: 'waste_management.txt' },
  ];

  // Fetch and display content from the selected file
  const handleFileClick = async (fileName) => {
    try {
      const result = await import(`../Data/${fileName}`);
      const fileContent = await fetch(result.default).then((res) => res.text());
      setContent(fileContent);
    } catch (error) {
      setContent('Error loading content');
    }
  };

  return (
    <div className="page-container">
      <h3>Sustainability Tips</h3>
      <div className="links-list">
        {fileLinks.map((link, index) => (
          <button key={index} onClick={() => handleFileClick(link.fileName)}>
            {link.name}
          </button>
        ))}
      </div>
      <div className="content">
        <h4>Content:</h4>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default SustainabilityTipsPage;
