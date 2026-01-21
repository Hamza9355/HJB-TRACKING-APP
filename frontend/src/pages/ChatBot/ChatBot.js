import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import axios from 'axios';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Bonjour! 👋 Je suis HJB Assistant. Comment puis-je vous aider?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [botInfo, setBotInfo] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchBotInfo();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchBotInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chatbot/info');
      setBotInfo(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des infos du bot:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Ajouter le message utilisateur
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message: inputValue,
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.message,
        sender: 'bot',
        timestamp: new Date(),
        metadata: response.data.metadata,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = async (suggestion) => {
    const userMessage = {
      id: messages.length + 1,
      text: suggestion,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/chat', {
        message: suggestion,
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.message,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Comment fonctionne le suivi?',
    'Voir mes sessions',
    'Ajouter un véhicule',
    'Générer un rapport',
  ];

  return (
    <Container fluid className="chatbot-container py-4">
      <Row className="h-100">
        <Col md={9}>
          <Card className="chatbot-card border-0 shadow">
            <Card.Body className="d-flex flex-column h-100 p-0">
              {/* Header */}
              <div className="chatbot-header p-4 border-bottom">
                <h5 className="mb-0 fw-bold text-primary">
                  🤖 HJB Assistant IA
                </h5>
                <small className="text-muted">En ligne et prêt à aider</small>
              </div>

              {/* Messages */}
              <div className="chatbot-messages flex-grow-1 p-4 overflow-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message mb-3 ${message.sender}`}
                  >
                    <div className={`message-bubble ${message.sender}`}>
                      {message.text}
                      {message.metadata && (
                        <small className="d-block mt-2 opacity-75">
                          Confiance: {(message.metadata.confidence * 100).toFixed(0)}%
                        </small>
                      )}
                    </div>
                    <small className="text-muted d-block mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  </div>
                ))}

                {loading && (
                  <div className="message bot mb-3">
                    <div className="message-bubble bot typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="chatbot-input p-4 border-top">
                <Form onSubmit={sendMessage}>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Tapez votre message..."
                      disabled={loading}
                      className="rounded-start"
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !inputValue.trim()}
                      className="rounded-end"
                    >
                      Envoyer
                    </Button>
                  </div>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col md={3}>
          <Card className="border-0 shadow mb-4">
            <Card.Body>
              <h6 className="fw-bold mb-3">✨ Suggestions</h6>
              <div className="d-grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleSuggestion(suggestion)}
                    className="text-start"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {botInfo && (
            <Card className="border-0 shadow">
              <Card.Body>
                <h6 className="fw-bold mb-3">📋 Capacités</h6>
                {botInfo.capabilities.map((capability, index) => (
                  <div key={index} className="mb-2">
                    <Badge bg="info" className="w-100 text-start">
                      ✓ {capability}
                    </Badge>
                  </div>
                ))}

                <hr />

                <h6 className="fw-bold mb-2">📦 Services</h6>
                {botInfo.services.map((service, index) => (
                  <Badge key={index} bg="secondary" className="me-2 mb-2">
                    {service}
                  </Badge>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatBot;
