import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="min-vh-100 align-items-center justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card border-0 shadow-lg">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4 text-primary fw-bold">
                  HJB Tracking
                </h2>
                <p className="text-center text-muted mb-4">Connectez-vous à votre compte</p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Votre mot de passe"
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Se souvenir de moi"
                    />
                    <a href="#" className="text-primary text-decoration-none">
                      Mot de passe oublié?
                    </a>
                  </div>

                  <Button
                    variant="primary"
                    className="w-100 py-2 fw-bold"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </Button>

                  <p className="text-center mt-4">
                    Pas de compte?{' '}
                    <a href="/register" className="text-primary fw-bold">
                      S'inscrire
                    </a>
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
