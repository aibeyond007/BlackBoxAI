import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown, faMusic } from '@fortawesome/free-solid-svg-icons';
import annyang from 'annyang';
import './App.css';
import MagicComponent from './MagicComponent';


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


const API_URL = 'http://localhost:8000';

function App() {
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Function to close the image modal
  const closeImage = () => {
    setIsImageOpen(false);
  };
  const [inputMessage, setInputMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [isWeatherWidgetVisible, setIsWeatherWidgetVisible] = useState(false);
  const [isMusicWidgetVisible, setIsMusicWidgetVisible] = useState(false);

  useEffect(() => {
    if (annyang) {
      const commands = {
        'say *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true); // Pass `true` to distinguish voice messages
          }
        },
        'close': () => {
          // Close the generated image and weather widget
          closeImage();
          closeWeatherWidget();
        },
        'stop music': () => {
          closeMusicWidget();
        },
        'play music': () => {
          openMusicWidget();
        },
        'download': () => {
          // Trigger the function to download the generated image
          downloadGeneratedImage();
        },
        'ok *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'listen *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'well *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'I *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'can *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'maybe *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'sure *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'yeah *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'no *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'alright *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'hello *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'hi *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'okay *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'so *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'right *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'hey *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'and *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'but *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        },
        'however *message': (message) => {
          if (message.trim() !== '') {
            sendMessage(message, true);
          }
        }
      };
      annyang.addCommands(commands);
      annyang.start();
      return () => {
        annyang.removeCommands();
        annyang.abort();
      };
    }
  }, [history]);

  const sendMessage = async (messageToSend, isVoice = false) => {
    if (messageToSend.trim() === '') return;

    const trimmedMessageToSend = messageToSend.trim().toLowerCase();

    if (trimmedMessageToSend.startsWith("generate")) {
      const prompt = trimmedMessageToSend.replace("generate", "").trim();

      try {
        const response = await axios.post(`${API_URL}/generate-image`, { prompt });
        if (response.data && response.data.data) {
          const generatedImageUrl = response.data.data[0].url;
          console.log(`Generated image URL: ${generatedImageUrl}`);
          setImageUrl(generatedImageUrl);
          setIsImageOpen(true);
        } else {
          console.log("Image generation succeeded but no URL returned:", response.data);
        }
      } catch (error) {
        console.error('Error generating image:', error);
      }
      return;
    }

    if (trimmedMessageToSend.includes('weather')) {
      setIsWeatherWidgetVisible(true);
      return;
    }

    const newMessage = { role: 'user', content: messageToSend };
    setHistory(prevHistory => [...prevHistory, newMessage]);

    const requestData = {
      message: messageToSend,
      history: [...history, newMessage],
    };

    try {
      const response = await axios.post(`${API_URL}/completions`, requestData);
      const responseData = response.data;
      if (responseData.choices && responseData.choices[0] && responseData.choices[0].message && responseData.choices[0].message.content) {
        const content = responseData.choices[0].message.content;
        setHistory(current => [...current, { role: 'assistant', content }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const closeWeatherWidget = () => {
    setIsWeatherWidgetVisible(false);
  };

  const downloadGeneratedImage = () => {
    if (imageUrl) {
      const urlText = imageUrl;
      const blob = new Blob([urlText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'image_url.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const openMusicWidget = () => {
    setIsMusicWidgetVisible(true);
  };

  const toggleMusicWidget = () => {
    setIsMusicWidgetVisible(prevState => !prevState);
  };

  const closeMusicWidget = () => {
    setIsMusicWidgetVisible(false);
  };

  const renderMusicWidget = () => {
    if (isMusicWidgetVisible) {
  return (
        <div className="musicWidgetContainer">
          {/* Music Widget */}
          <iframe
            title="music-widget"
  src="https://widgets.sociablekit.com/youtube-playlist-videos/iframe/25391760"
            frameBorder="0"
            allow="autoplay; encrypted-media"
  scrolling="yes"
          ></iframe>
          <button className="CloseWidgetButton" onClick={closeMusicWidget}>Close Music
  Widget</button>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderMessage = (message, index) => {
    const maxChar = 130;
    const messageLines = splitTextByMaxChar(message.content, maxChar);
    const formattedMessage = messageLines.join('\n');
  
    return (
      <pre key={index}>
        <code>{tokenizeMessage(formattedMessage)}</code>
      </pre>
    );
  };

  const tokenizeMessage = (text) => {
    let tokens = text.split(/\b/);
    return tokens.map((token, index) => (
      <span key={index} style={{ color: getTokenColor(token) }}>
        {token}
      </span>
    ));
  };

  const splitTextByMaxChar = (text, maxChar) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
  
    words.forEach(word => {
      if ((currentLine + word).length > maxChar) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += ` ${word}`;
      }
    });
  
    lines.push(currentLine.trim());
    return lines;
  };

  const downloadChatHistory = () => {
    const chatString = history.map(item => `${item.role}: ${item.content}`).join('\n');
    const blob = new Blob([chatString], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getTokenColor = (token) => {
    const lightGreenWords = ["user", "assistant", "server", "API", "URL", "completions", "text", "sendMessage", "inputMessage", "UserInput", "index", "localhost"];
    const orangeWords = ["role", "content", "response", "responseData", "message", "content", "API_URL", "axios", "key", "style", "message", "Message", "chat", "model", "API", "token", "console", "3000", "8000"];
    const redWords = ["renderMessage", "map", "push", "join", "forEach", "includes", "slice", "setInputMessage", "setHistory", "history", "error", "useState", "className"];
    const blueWords = ["import", "export", "const", "function", "try", "if", "else", "return", "let", "async", "await", "catch"];
    const brightPurpleSymbols = /[".{}[\]()<>']/;
    if (lightGreenWords.includes(token)) {
      return "rgb(144, 238, 144)";
    } else if (orangeWords.includes(token)) {
      return "rgb(255, 165, 0)";
    } else if (redWords.includes(token)) {
      return "rgb(255, 0, 0)";
    } else if (blueWords.includes(token)) {
      return "rgb(65, 105, 225)";
    } else if (brightPurpleSymbols.test(token)) {
      return "rgb(255, 255, 255)";
    } else {
      return "inherit";
    }
  };

  return (
    <div className="App">
      <div className="ChatHistory">
        {history.map(renderMessage)}
      </div>
      <div className="UserInput">
        <textarea
          placeholder="Type your message or use voice commands..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={() => sendMessage(inputMessage)}>Send</button>
      </div>
      {isImageOpen && <div className="Overlay" onClick={() => setIsImageOpen(false)}></div>}
      {imageUrl && isImageOpen && (
        <div className="GeneratedImageContainer" onClick={() => setIsImageOpen(false)}>
          <img src={imageUrl} alt="Generated" className="GeneratedImage" />
        </div>
      )}
      {isWeatherWidgetVisible && (
        <div className="WeatherWidgetContainer">
          <iframe
            width="650"
            height="450"
            src="https://embed.windy.com/embed2.html?lat=60.877&lon=-75.762&detailLat=60.877&detailLon=-75.762&width=650&height=450&zoom=5&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
            frameborder="0"
          ></iframe>
          <button className="CloseWidgetButton" onClick={closeWeatherWidget}>Close Widget</button>
        </div>
      )}
      <div className="downloadIconContainer" onClick={downloadChatHistory}>
        <FontAwesomeIcon icon={faFileArrowDown} />
      </div>
      <div className="musicIconContainer" onClick={toggleMusicWidget}>
        <FontAwesomeIcon icon={faMusic} />
      </div>
      {renderMusicWidget()}
      <MagicComponent />
    </div>
  );
}

export default App;



























































































































