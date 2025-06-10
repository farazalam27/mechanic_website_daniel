import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Table, Badge, Alert, Spinner, Modal } from 'react-bootstrap';
import { timeSlotAPI, appointmentAPI } from '../services/api';
import { FaCalendarAlt, FaClock, FaPlus, FaEdit, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';
import './AdminDashboardPage.css';

// Types
interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdBy: string;
}

interface Appointment {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: string;
  description?: string;
  status: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  vehicle: {
    _id: string;
    make: string;
    modelName: string;
    year: number;
  };
}

const AdminDashboardPage: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');

  // Data states
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('timeSlots');

  // Modal states
  const [showTimeSlotModal, setShowTimeSlotModal] = useState<boolean>(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [timeSlotToDelete, setTimeSlotToDelete] = useState<string>('');
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment | null>(null);

  // Form states for time slot
  const [slotDate, setSlotDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // Form states for batch creation
  const [batchStartDate, setBatchStartDate] = useState<string>('');
  const [batchEndDate, setBatchEndDate] = useState<string>('');
  const [batchDays, setBatchDays] = useState<string[]>([]);
  const [batchTimeSlots, setBatchTimeSlots] = useState<{ start: string; end: string }[]>([
    { start: '09:00', end: '10:00' }
  ]);

  // Handle admin login
  const handleLogin = () => {
    // In a real application, this would be a secure authentication process
    // For this demo, we're using a simple password check
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      loadTimeSlots();
      loadAppointments();
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  // Load time slots for the selected date range
  const loadTimeSlots = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await timeSlotAPI.getByDateRange(
        dateRange.startDate,
        dateRange.endDate
      );
      setTimeSlots(response.data as unknown as TimeSlot[]);
    } catch (err) {
      setError('Failed to load time slots. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load appointments for the selected date range
  const loadAppointments = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await appointmentAPI.getByDateRange(
        dateRange.startDate,
        dateRange.endDate
      );
      setAppointments(response.data as unknown as Appointment[]);
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to reload data when date range changes
  useEffect(() => {
    if (isAuthenticated) {
      loadTimeSlots();
      loadAppointments();
    }
  }, [dateRange, isAuthenticated]);

  // Open time slot modal for adding or editing
  const openTimeSlotModal = (timeSlot: TimeSlot | null = null) => {
    if (timeSlot) {
      // Editing existing time slot
      setEditingTimeSlot(timeSlot);
      setSlotDate(timeSlot.date.split('T')[0]);
      setStartTime(timeSlot.startTime);
      setEndTime(timeSlot.endTime);
    } else {
      // Adding new time slot
      setEditingTimeSlot(null);
      setSlotDate(selectedDate);
      setStartTime('');
      setEndTime('');
    }

    setShowTimeSlotModal(true);
  };

  // Save time slot (add or update)
  const handleSaveTimeSlot = async () => {
    setLoading(true);
    setError('');

    try {
      const timeSlotData = {
        date: slotDate,
        startTime,
        endTime,
        createdBy: 'admin' // In a real app, this would be the admin's ID
      };

      if (editingTimeSlot) {
        // Update existing time slot
        const response = await timeSlotAPI.update(editingTimeSlot._id, timeSlotData);

        // Update time slots list
        setTimeSlots(timeSlots.map(ts => ts._id === editingTimeSlot._id ? response.data as unknown as TimeSlot : ts));
      } else {
        // Add new time slot
        const response = await timeSlotAPI.create(timeSlotData);

        // Add to time slots list
        setTimeSlots([...timeSlots, response.data as unknown as TimeSlot]);
      }

      // Close modal
      setShowTimeSlotModal(false);
    } catch (err) {
      setError('An error occurred while saving the time slot. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (timeSlotId: string) => {
    setTimeSlotToDelete(timeSlotId);
    setShowDeleteModal(true);
  };

  // Delete time slot
  const handleDeleteTimeSlot = async () => {
    setLoading(true);
    setError('');

    try {
      await timeSlotAPI.delete(timeSlotToDelete);

      // Remove from time slots list
      setTimeSlots(timeSlots.filter(ts => ts._id !== timeSlotToDelete));

      // Close modal
      setShowDeleteModal(false);
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err && 
          err.response && typeof err.response === 'object' && 'status' in err.response && 
          err.response.status === 400) {
        setError('Cannot delete this time slot because it has an associated appointment.');
      } else {
        setError('An error occurred while deleting the time slot. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open batch creation modal
  const openBatchModal = () => {
    setBatchStartDate(selectedDate);
    setBatchEndDate(new Date(new Date(selectedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setBatchDays(['1', '2', '3', '4', '5']); // Monday to Friday by default
    setBatchTimeSlots([
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '13:00', end: '14:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' }
    ]);
    setShowBatchModal(true);
  };

  // Add a time slot to batch
  const addBatchTimeSlot = () => {
    setBatchTimeSlots([...batchTimeSlots, { start: '', end: '' }]);
  };

  // Remove a time slot from batch
  const removeBatchTimeSlot = (index: number) => {
    setBatchTimeSlots(batchTimeSlots.filter((_, i) => i !== index));
  };

  // Update batch time slot
  const updateBatchTimeSlot = (index: number, field: 'start' | 'end', value: string) => {
    const updatedSlots = [...batchTimeSlots];
    updatedSlots[index][field] = value;
    setBatchTimeSlots(updatedSlots);
  };

  // Handle batch day selection
  const handleDaySelection = (day: string) => {
    if (batchDays.includes(day)) {
      setBatchDays(batchDays.filter(d => d !== day));
    } else {
      setBatchDays([...batchDays, day]);
    }
  };

  // Create batch time slots
  const handleCreateBatch = async () => {
    setLoading(true);
    setError('');

    try {
      // Generate dates between start and end date
      const dates: Date[] = [];
      const start = new Date(batchStartDate);
      const end = new Date(batchEndDate);

      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        // Check if the day of the week is selected (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = dt.getDay().toString();
        if (batchDays.includes(dayOfWeek)) {
          dates.push(new Date(dt));
        }
      }

      // Create time slots for each date and time
      const slots = [];
      for (const date of dates) {
        for (const timeSlot of batchTimeSlots) {
          slots.push({
            date: date.toISOString().split('T')[0],
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            createdBy: 'admin' // In a real app, this would be the admin's ID
          });
        }
      }

      // Send batch creation request
      const response = await timeSlotAPI.createBatch(slots);

      // Add new time slots to the list
      setTimeSlots([...timeSlots, ...response.data]);

      // Close modal
      setShowBatchModal(false);

      // Reload time slots to ensure we have the latest data
      loadTimeSlots();
    } catch (err) {
      setError('An error occurred while creating time slots. Please try again.');
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

  // Update appointment status
  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await appointmentAPI.updateStatus(appointmentId, status);

      // Update appointments list
      setAppointments(appointments.map(a => a._id === appointmentId ? response.data as unknown as Appointment : a));

      // Close modal
      setShowAppointmentModal(false);
    } catch (err) {
      setError('An error occurred while updating the appointment status. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  // Get day of week
  const getDayOfWeek = (dateString: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
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

  // Group time slots by date
  const groupedTimeSlots = timeSlots.reduce((groups, slot) => {
    const date = slot.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="admin-dashboard-page">
      {/* Hero Section */}
      <section className="admin-hero">
        <div className="admin-hero-overlay">
          <Container>
            <div className="admin-hero-content">
              <h1>Admin Dashboard</h1>
              <p>Manage time slots and appointments</p>
            </div>
          </Container>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="admin-content py-5">
        <Container>
          {!isAuthenticated ? (
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <Card className="login-card">
                  <Card.Body>
                    <div className="text-center mb-4">
                      <div className="login-icon">
                        <FaLock />
                      </div>
                      <h2 className="login-title">Admin Login</h2>
                      <p className="login-subtitle">
                        Enter your admin password to access the dashboard
                      </p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Enter admin password"
                          disabled={loading}
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button 
                          variant="primary" 
                          onClick={handleLogin}
                          disabled={loading || !adminPassword}
                        >
                          {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <>
              {/* Date Range Selector */}
              <Row className="mb-4">
                <Col>
                  <Card className="date-range-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                          <h2 className="date-range-title">
                            <FaCalendarAlt className="me-2" />
                            Schedule Management
                          </h2>
                        </div>
                        <div className="d-flex align-items-center">
                          <Form.Group className="me-2">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={dateRange.startDate}
                              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            />
                          </Form.Group>
                          <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={dateRange.endDate}
                              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Tabs */}
              <div className="admin-tabs mb-4">
                <Button 
                  variant={activeTab === 'timeSlots' ? 'primary' : 'outline-primary'}
                  className="tab-button"
                  onClick={() => setActiveTab('timeSlots')}
                >
                  <FaClock className="me-2" />
                  Time Slots
                </Button>
                <Button 
                  variant={activeTab === 'appointments' ? 'primary' : 'outline-primary'}
                  className="tab-button"
                  onClick={() => setActiveTab('appointments')}
                >
                  <FaCalendarAlt className="me-2" />
                  Appointments
                </Button>
              </div>

              {/* Time Slots Tab */}
              {activeTab === 'timeSlots' && (
                <div className="tab-content">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="tab-title">Available Time Slots</h3>
                    <div>
                      <Button 
                        variant="outline-primary" 
                        className="me-2"
                        onClick={openBatchModal}
                      >
                        <FaPlus className="me-2" />
                        Batch Create
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => openTimeSlotModal()}
                      >
                        <FaPlus className="me-2" />
                        Add Time Slot
                      </Button>
                    </div>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}

                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : Object.keys(groupedTimeSlots).length > 0 ? (
                    <div className="time-slots-container">
                      {Object.entries(groupedTimeSlots)
                        .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                        .map(([date, slots]) => (
                          <Card key={date} className="date-card mb-4">
                            <Card.Header className="date-header">
                              <h4 className="date-title">
                                {formatDate(date)} ({getDayOfWeek(date)})
                              </h4>
                            </Card.Header>
                            <Card.Body>
                              <div className="time-slots-grid">
                                {slots
                                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                  .map((slot) => (
                                    <div 
                                      key={slot._id} 
                                      className={`time-slot-item ${slot.isBooked ? 'booked' : 'available'}`}
                                    >
                                      <div className="time-slot-time">
                                        {slot.startTime} - {slot.endTime}
                                      </div>
                                      <div className="time-slot-status">
                                        <Badge bg={slot.isBooked ? 'danger' : 'success'}>
                                          {slot.isBooked ? 'Booked' : 'Available'}
                                        </Badge>
                                      </div>
                                      <div className="time-slot-actions">
                                        {!slot.isBooked && (
                                          <>
                                            <Button 
                                              variant="outline-primary" 
                                              size="sm"
                                              onClick={() => openTimeSlotModal(slot)}
                                            >
                                              <FaEdit />
                                            </Button>
                                            <Button 
                                              variant="outline-danger" 
                                              size="sm"
                                              onClick={() => openDeleteModal(slot._id)}
                                            >
                                              <FaTrash />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <Alert variant="info">
                      No time slots found for the selected date range. Add time slots to get started.
                    </Alert>
                  )}
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div className="tab-content">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="tab-title">Scheduled Appointments</h3>
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
                          <th>Customer</th>
                          <th>Phone</th>
                          <th>Vehicle</th>
                          <th>Service</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((appointment) => (
                            <tr key={appointment._id}>
                              <td>{formatDate(appointment.date)}</td>
                              <td>{appointment.startTime} - {appointment.endTime}</td>
                              <td>{appointment.customer.firstName} {appointment.customer.lastName}</td>
                              <td>{appointment.customer.phoneNumber}</td>
                              <td>
                                {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.modelName}
                              </td>
                              <td>{appointment.serviceType}</td>
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
                      No appointments found for the selected date range.
                    </Alert>
                  )}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Time Slot Modal */}
      <Modal show={showTimeSlotModal} onHide={() => setShowTimeSlotModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTimeSlot ? 'Edit Time Slot' : 'Add New Time Slot'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTimeSlotModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveTimeSlot}
            disabled={loading || !slotDate || !startTime || !endTime}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Time Slot'}
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
          <p>Are you sure you want to delete this time slot? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteTimeSlot}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Delete Time Slot'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Batch Creation Modal */}
      <Modal show={showBatchModal} onHide={() => setShowBatchModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Batch Create Time Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={batchStartDate}
                    onChange={(e) => setBatchStartDate(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={batchEndDate}
                    onChange={(e) => setBatchEndDate(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Select Days</Form.Label>
              <div className="days-selector">
                <Button 
                  variant={batchDays.includes('0') ? 'primary' : 'outline-primary'} 
                  onClick={() => handleDaySelection('0')}
                  className="day-button"
                >
                  Sun
                </Button>
                <Button 
                  variant={batchDays.includes('1') ? 'primary' : 'outline-primary'} 
                  onClick={() => handleDaySelection('1')}
                  className="day-button"
                >
                  Mon
                </Button>
                <Button 
                  variant={batchDays.includes('2') ? 'primary' : 'outline-primary'} 
                  onClick={() => handleDaySelection('2')}
                  className="day-button"
                >
                  Tue
                </Button>
                <Button 
                  variant={batchDays.includes('3') ? 'primary' : 'outline-primary'} 
                  onClick={() => handleDaySelection('3')}
                  className="day-button"
                >
                  Wed
                </Button>
                <Button 
                  variant={batchDays.includes('4') ? 'primary' : 'outline-primary'} 
                  onClick={() => handleDaySelection('4')}
                  className="day-button"
                >
                  Thu
                </Button>
                <Button 
                  variant={batchDays.includes('5') ? 'primary' : 'outline-primary'} 
                  onClick={() => handleDaySelection('5')}
                  className="day-button"
                >
                  Fri
                </Button>
                <Button 
                  variant={batchDays.includes('6') ? 'primary' : 'outline-primary'} 
                  onClick={() => handleDaySelection('6')}
                  className="day-button"
                >
                  Sat
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time Slots</Form.Label>
              {batchTimeSlots.map((slot, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Control
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateBatchTimeSlot(index, 'start', e.target.value)}
                    className="me-2"
                    required
                    disabled={loading}
                  />
                  <span className="mx-2">to</span>
                  <Form.Control
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateBatchTimeSlot(index, 'end', e.target.value)}
                    className="me-2"
                    required
                    disabled={loading}
                  />
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => removeBatchTimeSlot(index)}
                    disabled={batchTimeSlots.length <= 1 || loading}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={addBatchTimeSlot}
                disabled={loading}
                className="mt-2"
              >
                <FaPlus className="me-1" /> Add Time Slot
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBatchModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateBatch}
            disabled={
              loading || 
              !batchStartDate || 
              !batchEndDate || 
              batchDays.length === 0 || 
              batchTimeSlots.some(slot => !slot.start || !slot.end)
            }
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Create Time Slots'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Appointment Details Modal */}
      <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {appointmentDetails && (
            <div className="appointment-details">
              <div className="detail-item">
                <strong>Date:</strong> {formatDate(appointmentDetails.date)}
              </div>
              <div className="detail-item">
                <strong>Time:</strong> {appointmentDetails.startTime} - {appointmentDetails.endTime}
              </div>
              <div className="detail-item">
                <strong>Customer:</strong> {appointmentDetails.customer.firstName} {appointmentDetails.customer.lastName}
              </div>
              <div className="detail-item">
                <strong>Phone:</strong> {appointmentDetails.customer.phoneNumber}
              </div>
              <div className="detail-item">
                <strong>Vehicle:</strong> {appointmentDetails.vehicle.year} {appointmentDetails.vehicle.make} {appointmentDetails.vehicle.modelName}
              </div>
              <div className="detail-item">
                <strong>Service:</strong> {appointmentDetails.serviceType}
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

              <hr />

              <div className="status-update mt-3">
                <h5>Update Status</h5>
                <div className="status-buttons">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleUpdateStatus(appointmentDetails._id, 'Confirmed')}
                    disabled={loading || appointmentDetails.status === 'Confirmed'}
                    className="me-2 mb-2"
                  >
                    Confirm
                  </Button>
                  <Button 
                    variant="outline-warning" 
                    size="sm"
                    onClick={() => handleUpdateStatus(appointmentDetails._id, 'In Progress')}
                    disabled={loading || appointmentDetails.status === 'In Progress'}
                    className="me-2 mb-2"
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={() => handleUpdateStatus(appointmentDetails._id, 'Completed')}
                    disabled={loading || appointmentDetails.status === 'Completed'}
                    className="me-2 mb-2"
                  >
                    Complete
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleUpdateStatus(appointmentDetails._id, 'Cancelled')}
                    disabled={loading || appointmentDetails.status === 'Cancelled'}
                    className="mb-2"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
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

export default AdminDashboardPage;
