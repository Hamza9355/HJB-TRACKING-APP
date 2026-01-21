import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: Email Verification, 3: Phone Verification
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  // Step 1: Registration Form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Step 2 & 3: Verification Codes
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Le prénom est requis');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Email invalide');
      return false;
    }
    if (!formData.phone.match(/^\d{10,}$/)) {
      setError('Numéro de téléphone invalide (10 chiffres minimum)');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.success) {
        setEmail(formData.email);
        localStorage.setItem('registrationEmail', formData.email);
        setStep(2);
        toast.success('Inscription créée! Vérifiez votre email');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    
    if (!emailCode.trim()) {
      setError('Entrez le code de vérification');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        email: formData.email || email,
        code: emailCode,
      });

      if (response.data.success) {
        setStep(3);
        toast.success('Email vérifié! Vérifiez maintenant votre téléphone');
      } else {
        setError('Code incorrect');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Erreur vérification email';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerification = async (e) => {
    e.preventDefault();
    
    if (!phoneCode.trim()) {
      setError('Entrez le code WhatsApp');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-phone', {
        email: formData.email || email,
        code: phoneCode,
      });

      if (response.data.success) {
        toast.success('Inscription complètée! Connectez-vous');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('Code incorrect');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Erreur vérification téléphone';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <Container>
        <Row className="min-vh-100 d-flex align-items-center justify-content-center">
          <Col md={6} lg={5}>
            <Card className="auth-card border-0">
              <Card.Body className="p-5">
                <h3 className="text-center mb-4 fw-bold">
                  {step === 1 ? '📝 S\'inscrire' : step === 2 ? '📧 Vérifier Email' : '📱 Vérifier Téléphone'}
                </h3>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                {/* Step 1: Registration Form */}
                {step === 1 && (
                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-600">Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={handleFormChange}
                        className="form-control-lg"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-600">Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={handleFormChange}
                        className="form-control-lg"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-600">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="form-control-lg"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-600">Téléphone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="0123456789"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="form-control-lg"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-600">Mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleFormChange}
                        className="form-control-lg"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-600">Confirmer mot de passe</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleFormChange}
                        className="form-control-lg"
                        disabled={loading}
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 fw-600"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Inscription en cours...
                        </>
                      ) : (
                        'S\'inscrire'
                      )}
                    </Button>
                  </Form>
                )}

                {/* Step 2: Email Verification */}
                {step === 2 && (
                  <Form onSubmit={handleEmailVerification}>
                    <Alert variant="info" className="mb-4">
                      <p className="mb-0">
                        Un code de vérification a été envoyé à <strong>{formData.email || email}</strong>
                      </p>
                    </Alert>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-600">Code de vérification (6 chiffres)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="000000"
                        value={emailCode}
                        onChange={(e) => {
                          setEmailCode(e.target.value.slice(0, 6));
                          setError('');
                        }}
                        className="form-control-lg text-center"
                        disabled={loading}
                        maxLength="6"
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 fw-600"
                      type="submit"
                      disabled={loading || !emailCode}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Vérification...
                        </>
                      ) : (
                        'Vérifier Email'
                      )}
                    </Button>
                  </Form>
                )}

                {/* Step 3: Phone Verification */}
                {step === 3 && (
                  <Form onSubmit={handlePhoneVerification}>
                    <Alert variant="info" className="mb-4">
                      <p className="mb-0">
                        Un code a été envoyé via WhatsApp à <strong>{formData.phone}</strong>
                      </p>
                    </Alert>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-600">Code WhatsApp (6 chiffres)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="000000"
                        value={phoneCode}
                        onChange={(e) => {
                          setPhoneCode(e.target.value.slice(0, 6));
                          setError('');
                        }}
                        className="form-control-lg text-center"
                        disabled={loading}
                        maxLength="6"
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 fw-600"
                      type="submit"
                      disabled={loading || !phoneCode}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Vérification...
                        </>
                      ) : (
                        'Vérifier Téléphone'
                      )}
                    </Button>
                  </Form>
                )}

                <hr className="my-4" />

                <p className="text-center text-muted">
                  Vous avez un compte?{' '}
                  <Link to="/login" className="fw-600" style={{ color: '#667eea' }}>
                    Connectez-vous
                  </Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
