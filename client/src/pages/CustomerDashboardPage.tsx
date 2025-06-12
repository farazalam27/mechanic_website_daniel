import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { customerAPI, vehicleAPI, appointmentAPI } from '../services/api';
import { FaUser, FaCar, FaCalendarAlt, FaPhone, FaEdit, FaTrash, FaPlus, FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';
import './CustomerDashboardPage.css';

// Types
interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
}

interface Vehicle {
  _id: string;
  make: string;
  modelName: string;
  year: number;
  engineType: string;
  oilType: string;
  licensePlate?: string;
  color?: string;
}

interface Appointment {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  description?: string;
  status: string;
  vehicle: Vehicle;
}

const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [, setPhoneNumber] = useState<string>('');

  // Data states
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('vehicles');

  // Modal states
  const [showVehicleModal, setShowVehicleModal] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string>('');
  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment | null>(null);

  // Form states for vehicle
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [engineType, setEngineType] = useState<string>('');
  const [oilType, setOilType] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');

  // Email editing states
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [editedEmail, setEditedEmail] = useState<string>('');
  const [emailSaving, setEmailSaving] = useState<boolean>(false);

  // Check for authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    const storedPhone = localStorage.getItem('customerPhone');
    
    if (token && storedPhone) {
      setIsAuthenticated(true);
      setPhoneNumber(storedPhone);
      loadCustomerData(storedPhone);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Load customer data
  const loadCustomerData = async (phone: string) => {
    setLoading(true);
    setError('');

    try {
      const customerResponse = await customerAPI.getByPhone(phone);
      setCustomer(customerResponse);

      const vehiclesResponse = await vehicleAPI.getByCustomerPhone(phone);
      setVehicles(vehiclesResponse);

      const appointmentsResponse = await appointmentAPI.getByCustomerPhone(phone);
      setAppointments(appointmentsResponse);
    } catch (err) {
      setError('Error loading data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneDigits = value.replace(/\D/g, '');

    // Format the phone number as (XXX) XXX-XXXX
    if (phoneDigits.length <= 3) {
      return phoneDigits;
    } else if (phoneDigits.length <= 6) {
      return `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`;
    } else {
      return `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 10)}`;
    }
  };

  // Email editing functions
  const startEditingEmail = () => {
    setEditedEmail(customer?.email || '');
    setIsEditingEmail(true);
  };

  const cancelEditingEmail = () => {
    setIsEditingEmail(false);
    setEditedEmail('');
  };

  const saveEmail = async () => {
    if (!customer) return;

    setEmailSaving(true);
    setError('');

    try {
      const updatedCustomer = await customerAPI.update(customer._id, { email: editedEmail });
      setCustomer(updatedCustomer);
      setIsEditingEmail(false);
      setEditedEmail('');
    } catch (err) {
      setError('Failed to update email. Please try again.');
      console.error('Email update error:', err);
    } finally {
      setEmailSaving(false);
    }
  };

  // Open vehicle modal for adding or editing
  const openVehicleModal = (vehicle: Vehicle | null = null) => {
    if (vehicle) {
      // Editing existing vehicle
      setEditingVehicle(vehicle);
      setMake(vehicle.make);
      setModel(vehicle.modelName);
      setYear(vehicle.year.toString());
      setEngineType(vehicle.engineType);
      setOilType(vehicle.oilType);
      setColor(vehicle.color || '');
      setLicensePlate(vehicle.licensePlate || '');
    } else {
      // Adding new vehicle
      setEditingVehicle(null);
      setMake('');
      setModel('');
      setYear('');
      setEngineType('');
      setOilType('');
      setColor('');
      setLicensePlate('');
    }

    setShowVehicleModal(true);
  };

  // Save vehicle (add or update)
  const handleSaveVehicle = async () => {
    setLoading(true);
    setError('');

    try {
      const vehicleData = {
        customerPhone: customer?.phoneNumber,
        make,
        modelName: model,
        year: parseInt(year),
        engineType,
        oilType,
        color: color || undefined,
        licensePlate: licensePlate || undefined
      };

      if (editingVehicle) {
        // Update existing vehicle
        const response = await vehicleAPI.update(editingVehicle._id, vehicleData);

        // Update vehicles list
        setVehicles(vehicles.map(v => v._id === editingVehicle._id ? response as unknown as Vehicle : v));
      } else {
        // Add new vehicle
        const response = await vehicleAPI.create(vehicleData);

        // Add to vehicles list
        setVehicles([...vehicles, response as unknown as Vehicle]);
      }

      // Close modal
      setShowVehicleModal(false);
    } catch (err) {
      setError('An error occurred while saving the vehicle. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setShowDeleteModal(true);
  };

  // Delete vehicle
  const handleDeleteVehicle = async () => {
    setLoading(true);
    setError('');

    try {
      await vehicleAPI.delete(vehicleToDelete);

      // Remove from vehicles list
      setVehicles(vehicles.filter(v => v._id !== vehicleToDelete));

      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err && 
          err.response && typeof err.response === 'object' && 'status' in err.response && 
          err.response.status === 400) {
        setError('Cannot delete this vehicle because it has associated appointments.');
      } else {
        setError('An error occurred while deleting the vehicle. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open appointment details modal
  const openAppointmentModal = (appointment: Appointment) => {
    setAppointmentDetails(appointment);
    setShowAppointmentModal(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Confirmed':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="customer-dashboard-page">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-overlay">
          <Container>
            <div className="dashboard-hero-content">
              <h1>Customer Dashboard</h1>
              <p>Manage your vehicles and appointments</p>
            </div>
          </Container>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="dashboard-content py-5">
        <Container>
          {isAuthenticated && (
            <>
              {/* Customer Info */}
              <Row className="mb-4">
                <Col>
                  <Card className="customer-info-card">
                    <Card.Body>
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="customer-avatar">
                            <FaUser />
                          </div>
                          <div className="ms-3">
                            <h2 className="customer-name">{customer?.firstName} {customer?.lastName}</h2>
                            <div className="customer-details">
                              <div className="contact-row">
                                <FaPhone className="me-3" style={{ minWidth: '16px', fontSize: '14px' }} />
                                <span>{formatPhoneNumber(customer?.phoneNumber || '')}</span>
                              </div>
                              <div className="contact-row">
                                <FaEnvelope className="me-3" style={{ minWidth: '16px', fontSize: '14px' }} />
                                {isEditingEmail ? (
                                  <div className="d-flex align-items-center w-100">
                                    <Form.Control
                                      type="email"
                                      value={editedEmail}
                                      onChange={(e) => setEditedEmail(e.target.value)}
                                      placeholder="Enter email address"
                                      size="sm"
                                      style={{ maxWidth: '200px' }}
                                      autoFocus
                                    />
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="ms-2"
                                      onClick={saveEmail}
                                      disabled={emailSaving}
                                    >
                                      {emailSaving ? <Spinner animation="border" size="sm" /> : <FaCheck />}
                                    </Button>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      className="ms-1"
                                      onClick={cancelEditingEmail}
                                      disabled={emailSaving}
                                    >
                                      <FaTimes />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">
                                      {customer?.email || 'No email address'}
                                    </span>
                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={startEditingEmail}
                                    >
                                      <FaEdit />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Tabs */}
              <div className="dashboard-tabs mb-4">
                <Button 
                  variant={activeTab === 'vehicles' ? 'primary' : 'outline-primary'}
                  className="tab-button"
                  onClick={() => setActiveTab('vehicles')}
                >
                  <FaCar className="me-2" />
                  My Vehicles
                </Button>
                <Button 
                  variant={activeTab === 'appointments' ? 'primary' : 'outline-primary'}
                  className="tab-button"
                  onClick={() => setActiveTab('appointments')}
                >
                  <FaCalendarAlt className="me-2" />
                  My Appointments
                </Button>
              </div>

              {/* Vehicles Tab */}
              {activeTab === 'vehicles' && (
                <div className="tab-content">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="tab-title">My Vehicles</h3>
                    <Button 
                      variant="primary" 
                      onClick={() => openVehicleModal()}
                    >
                      <FaPlus className="me-2" />
                      Add Vehicle
                    </Button>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : vehicles.length > 0 ? (
                    <Row>
                      {vehicles.map((vehicle) => (
                        <Col md={6} lg={4} key={vehicle._id} className="mb-4">
                          <Card className="vehicle-card">
                            <Card.Body>
                              <div className="vehicle-icon">
                                <FaCar />
                              </div>
                              <h4 className="vehicle-title">
                                {vehicle.year} {vehicle.make} {vehicle.modelName}
                              </h4>
                              {vehicle.color && (
                                <p className="vehicle-color">Color: {vehicle.color}</p>
                              )}
                              <div className="vehicle-details">
                                <p><strong>Engine:</strong> {vehicle.engineType}</p>
                                <p><strong>Oil Type:</strong> {vehicle.oilType}</p>
                                {vehicle.licensePlate && (
                                  <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
                                )}
                              </div>
                              <div className="vehicle-actions">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => openVehicleModal(vehicle)}
                                >
                                  <FaEdit className="me-1" /> Edit
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => openDeleteModal(vehicle._id)}
                                >
                                  <FaTrash className="me-1" /> Delete
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert variant="info">
                      You don't have any vehicles yet. Add a vehicle to get started.
                    </Alert>
                  )}
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="tab-content">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="tab-title">My Appointments</h3>
                    <Button 
                      variant="primary" 
                      href="/schedule"
                    >
                      <FaPlus className="me-2" />
                      Schedule New Appointment
                    </Button>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : appointments.length > 0 ? (
                    <Table responsive className="appointments-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Service</th>
                          <th>Vehicle</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment._id}>
                            <td>{formatDate(appointment.date)}</td>
                            <td>{appointment.startTime} - {appointment.endTime}</td>
                            <td>{appointment.serviceType}</td>
                            <td>
                              {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.modelName}
                            </td>
                            <td>
                              <Badge bg={getStatusBadgeVariant(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => openAppointmentModal(appointment)}
                              >
                                Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Alert variant="info">
                      You don't have any appointments yet. Schedule an appointment to get started.
                    </Alert>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Vehicle Modal */}
      <Modal show={showVehicleModal} onHide={() => setShowVehicleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Make</Form.Label>
                  <Form.Control
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Toyota"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Model</Form.Label>
                  <Form.Control
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Camry"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="2020"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Engine Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="V6 3.5L"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Oil Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={oilType}
                    onChange={(e) => setOilType(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="5W-30 Synthetic"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Color (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={loading}
                    placeholder="Silver"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>License Plate (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    disabled={loading}
                    placeholder="ABC123"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVehicleModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveVehicle}
            disabled={loading || !make || !model || !year || !engineType || !oilType}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Vehicle'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteVehicle}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Delete Vehicle'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Appointment Details Modal */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {appointmentDetails && (
            <div className="appointment-details">
              <div className="detail-item">
                <strong>Date:</strong> {formatDate(appointmentDetails.date)}
              </div>
              <div className="detail-item">
                <strong>Time:</strong> {appointmentDetails.startTime} - {appointmentDetails.endTime}
              </div>
              <div className="detail-item">
                <strong>Service:</strong> {appointmentDetails.serviceType}
              </div>
              <div className="detail-item">
                <strong>Vehicle:</strong> {appointmentDetails.vehicle.year} {appointmentDetails.vehicle.make} {appointmentDetails.vehicle.modelName}
              </div>
              <div className="detail-item">
                <strong>Status:</strong> 
                <Badge bg={getStatusBadgeVariant(appointmentDetails.status)} className="ms-2">
                  {appointmentDetails.status}
                </Badge>
              </div>
              {appointmentDetails.description && (
                <div className="detail-item mt-3">
                  <strong>Description:</strong>
                  <p className="mt-1">{appointmentDetails.description}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerDashboardPage;
