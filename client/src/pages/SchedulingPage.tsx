import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { customerAPI, vehicleAPI, timeSlotAPI, appointmentAPI } from '../services/api';
import { FaCalendarAlt, FaCar, FaTools, FaUser, FaPhone } from 'react-icons/fa';
import './SchedulingPage.css';

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

interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface ServiceType {
  value: string;
  label: string;
}

const SchedulingPage: React.FC = () => {
  // Form states
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [isNewVehicle, setIsNewVehicle] = useState<boolean>(false);
  const [make, setMake] = useState<string>('');
  const [modelName, setModelName] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [engineType, setEngineType] = useState<string>('');
  const [oilType, setOilType] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // UI states
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Service types
  const serviceTypes: ServiceType[] = [
    { value: 'Oil Change', label: 'Oil Change' },
    { value: 'Repair', label: 'Repair & Diagnostics' },
    { value: 'Maintenance', label: 'Preventative Maintenance' },
    { value: 'Inspection', label: 'Inspection' },
    { value: 'Other', label: 'Other Service' }
  ];

  // Format phone number as user types
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

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  // Look up customer by phone number
  const lookupCustomer = async () => {
    setLoading(true);
    setError('');

    try {
      // Remove formatting from phone number for API call
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

      const response = await customerAPI.getByPhone(cleanPhoneNumber);
      setCustomer(response.data as Customer);

      // Get customer's vehicles
      const vehiclesResponse = await vehicleAPI.getByCustomerPhone(cleanPhoneNumber);
      setVehicles(vehiclesResponse.data as Vehicle[]);

      // Move to next step
      setStep(2);
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err && 
          err.response && typeof err.response === 'object' && 'status' in err.response && 
          err.response.status === 404) {
        // Customer not found, show new customer form
        setIsNewCustomer(true);
      } else {
        setError('An error occurred while looking up the customer. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new customer
  const createCustomer = async () => {
    setLoading(true);
    setError('');

    try {
      // Remove formatting from phone number for API call
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

      const newCustomer = {
        firstName,
        lastName,
        phoneNumber: cleanPhoneNumber,
        email: email || undefined
      };

      const response = await customerAPI.create(newCustomer);
      setCustomer(response.data);
      setIsNewCustomer(false);

      // Move to next step
      setStep(2);
    } catch (err) {
      setError('An error occurred while creating the customer. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle vehicle selection or creation
  const handleVehicleStep = async () => {
    setLoading(true);
    setError('');

    try {
      if (isNewVehicle) {
        // Create new vehicle
        const newVehicle = {
          customer: customer?._id,
          make,
          modelName,
          year: parseInt(year),
          engineType,
          oilType,
          color: color || undefined,
          licensePlate: licensePlate || undefined
        };

        const response = await vehicleAPI.create(newVehicle);
        setVehicles([...vehicles, response.data]);
        setSelectedVehicle(response.data._id);
        setIsNewVehicle(false);
      }

      // Move to next step
      setStep(3);
    } catch (err) {
      setError('An error occurred while processing vehicle information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const fetchTimeSlots = async () => {
        setLoading(true);
        try {
          const response = await timeSlotAPI.getAvailableByDate(selectedDate);
          setAvailableTimeSlots(response.data as unknown as TimeSlot[]);
        } catch (err) {
          setError('Failed to load available time slots. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchTimeSlots();
    }
  }, [selectedDate]);

  // Submit appointment
  const submitAppointment = async () => {
    setLoading(true);
    setError('');

    try {
      const selectedSlot = availableTimeSlots.find(slot => slot._id === selectedTimeSlot);

      if (!selectedSlot) {
        throw new Error('No time slot selected');
      }

      const appointmentData = {
        customer: customer?._id,
        vehicle: selectedVehicle,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        serviceType: selectedService,
        description: description || undefined,
        status: 'Scheduled'
      };

      await appointmentAPI.create(appointmentData);
      setSuccess(true);

      // Reset form
      setSelectedVehicle('');
      setSelectedDate('');
      setSelectedTimeSlot('');
      setSelectedService('');
      setDescription('');

      // Move to confirmation step
      setStep(4);
    } catch (err) {
      setError('An error occurred while scheduling the appointment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and start over
  const resetForm = () => {
    setPhoneNumber('');
    setCustomer(null);
    setIsNewCustomer(false);
    setFirstName('');
    setLastName('');
    setEmail('');
    setVehicles([]);
    setSelectedVehicle('');
    setIsNewVehicle(false);
    setMake('');
    setModelName('');
    setYear('');
    setEngineType('');
    setOilType('');
    setColor('');
    setLicensePlate('');
    setSelectedDate('');
    setAvailableTimeSlots([]);
    setSelectedTimeSlot('');
    setSelectedService('');
    setDescription('');
    setStep(1);
    setError('');
    setSuccess(false);
  };

  return (
    <div className="scheduling-page">
      {/* Hero Section */}
      <section className="scheduling-hero">
        <div className="scheduling-hero-overlay">
          <Container>
            <div className="scheduling-hero-content">
              <h1>Schedule Your Service</h1>
              <p>Book an appointment with our expert mechanics</p>
            </div>
          </Container>
        </div>
      </section>

      {/* Scheduling Form */}
      <section className="scheduling-form-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="scheduling-card">
                <Card.Body>
                  <div className="text-center mb-4">
                    <h2 className="scheduling-title">
                      <FaCalendarAlt className="me-2" />
                      Schedule Your Service
                    </h2>
                    <p className="scheduling-subtitle">
                      Please provide your information to book an appointment
                    </p>
                  </div>

                  {/* Progress Steps */}
                  <div className="progress-steps mb-4">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                      <div className="step-number">1</div>
                      <div className="step-label">Customer Info</div>
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                      <div className="step-number">2</div>
                      <div className="step-label">Vehicle</div>
                    </div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                      <div className="step-number">3</div>
                      <div className="step-label">Service & Time</div>
                    </div>
                    <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
                      <div className="step-number">4</div>
                      <div className="step-label">Confirmation</div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && <Alert variant="danger">{error}</Alert>}

                  {/* Step 1: Customer Information */}
                  {step === 1 && (
                    <div className="step-content">
                      <h3 className="step-title">
                        <FaUser className="me-2" />
                        Customer Information
                      </h3>

                      {!isNewCustomer ? (
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <div className="d-flex">
                              <Form.Control
                                type="text"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="(555) 123-4567"
                                disabled={loading}
                              />
                              <Button 
                                variant="primary" 
                                className="ms-2" 
                                onClick={lookupCustomer}
                                disabled={loading || phoneNumber.replace(/\D/g, '').length < 10}
                              >
                                {loading ? <Spinner animation="border" size="sm" /> : 'Look Up'}
                              </Button>
                            </div>
                            <Form.Text className="text-muted">
                              Enter your phone number to find your information
                            </Form.Text>
                          </Form.Group>

                          <div className="text-center mt-4">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setIsNewCustomer(true)}
                              disabled={loading}
                            >
                              New Customer? Register Here
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <Form>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  required
                                  disabled={loading}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  required
                                  disabled={loading}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              value={phoneNumber}
                              onChange={handlePhoneChange}
                              required
                              disabled={loading}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Email (Optional)</Form.Label>
                            <Form.Control
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={loading}
                            />
                          </Form.Group>

                          <div className="d-flex justify-content-between mt-4">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setIsNewCustomer(false)}
                              disabled={loading}
                            >
                              Back
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={createCustomer}
                              disabled={loading || !firstName || !lastName || phoneNumber.replace(/\D/g, '').length < 10}
                            >
                              {loading ? <Spinner animation="border" size="sm" /> : 'Continue'}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </div>
                  )}

                  {/* Step 2: Vehicle Information */}
                  {step === 2 && (
                    <div className="step-content">
                      <h3 className="step-title">
                        <FaCar className="me-2" />
                        Vehicle Information
                      </h3>

                      {!isNewVehicle ? (
                        <Form>
                          {vehicles.length > 0 ? (
                            <Form.Group className="mb-3">
                              <Form.Label>Select Your Vehicle</Form.Label>
                              <Form.Select
                                value={selectedVehicle}
                                onChange={(e) => setSelectedVehicle(e.target.value)}
                                disabled={loading}
                              >
                                <option value="">Select a vehicle</option>
                                {vehicles.map((vehicle) => (
                                  <option key={vehicle._id} value={vehicle._id}>
                                    {vehicle.year} {vehicle.make} {vehicle.modelName} {vehicle.color ? `(${vehicle.color})` : ''}
                                  </option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          ) : (
                            <Alert variant="info">
                              No vehicles found. Please add a vehicle to continue.
                            </Alert>
                          )}

                          <div className="text-center mt-4 mb-3">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setIsNewVehicle(true)}
                              disabled={loading}
                            >
                              Add New Vehicle
                            </Button>
                          </div>

                          <div className="d-flex justify-content-between mt-4">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => {
                                setIsNewCustomer(false);
                                setStep(1);
                              }}
                              disabled={loading}
                            >
                              Back
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={handleVehicleStep}
                              disabled={loading || (!selectedVehicle && !isNewVehicle)}
                            >
                              {loading ? <Spinner animation="border" size="sm" /> : 'Continue'}
                            </Button>
                          </div>
                        </Form>
                      ) : (
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
                                  value={modelName}
                                  onChange={(e) => setModelName(e.target.value)}
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

                          <div className="d-flex justify-content-between mt-4">
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => setIsNewVehicle(false)}
                              disabled={loading}
                            >
                              Back
                            </Button>
                            <Button 
                              variant="primary" 
                              onClick={handleVehicleStep}
                              disabled={loading || !make || !modelName || !year || !engineType || !oilType}
                            >
                              {loading ? <Spinner animation="border" size="sm" /> : 'Continue'}
                            </Button>
                          </div>
                        </Form>
                      )}
                    </div>
                  )}

                  {/* Step 3: Service and Time Selection */}
                  {step === 3 && (
                    <div className="step-content">
                      <h3 className="step-title">
                        <FaTools className="me-2" />
                        Service & Appointment Time
                      </h3>

                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Service Type</Form.Label>
                          <Form.Select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            disabled={loading}
                            required
                          >
                            <option value="">Select a service</option>
                            {serviceTypes.map((service) => (
                              <option key={service.value} value={service.value}>
                                {service.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Description (Optional)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            placeholder="Please describe any specific issues or requests"
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Appointment Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            disabled={loading}
                            required
                          />
                        </Form.Group>

                        {selectedDate && (
                          <Form.Group className="mb-3">
                            <Form.Label>Available Time Slots</Form.Label>
                            {loading ? (
                              <div className="text-center py-3">
                                <Spinner animation="border" />
                              </div>
                            ) : availableTimeSlots.length > 0 ? (
                              <div className="time-slots-grid">
                                {availableTimeSlots.map((slot) => (
                                  <Button
                                    key={slot._id}
                                    variant={selectedTimeSlot === slot._id ? "primary" : "outline-primary"}
                                    className="time-slot-button"
                                    onClick={() => setSelectedTimeSlot(slot._id)}
                                  >
                                    {slot.startTime} - {slot.endTime}
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <Alert variant="info">
                                No available time slots for the selected date. Please choose another date.
                              </Alert>
                            )}
                          </Form.Group>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                          <Button 
                            variant="outline-secondary" 
                            onClick={() => setStep(2)}
                            disabled={loading}
                          >
                            Back
                          </Button>
                          <Button 
                            variant="primary" 
                            onClick={submitAppointment}
                            disabled={loading || !selectedService || !selectedDate || !selectedTimeSlot}
                          >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Schedule Appointment'}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  )}

                  {/* Step 4: Confirmation */}
                  {step === 4 && (
                    <div className="step-content text-center">
                      <div className="confirmation-icon">
                        <FaCalendarAlt />
                      </div>
                      <h3 className="confirmation-title">Appointment Scheduled!</h3>
                      <p className="confirmation-message">
                        Your appointment has been successfully scheduled. We look forward to seeing you!
                      </p>
                      <p className="confirmation-details">
                        A confirmation with all the details has been sent to your phone number.
                      </p>
                      <div className="mt-4">
                        <Button 
                          variant="primary" 
                          onClick={resetForm}
                          className="px-4 py-2"
                        >
                          Schedule Another Appointment
                        </Button>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default SchedulingPage;
