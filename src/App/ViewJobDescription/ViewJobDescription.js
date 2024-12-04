import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Tabs, Tab, Table, Modal, Form } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../api/api';
import './ViewJobDescription.css';

const JobView = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState('inProcess');
  const [showModal, setShowModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modalType, setModalType] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Fetch job details
  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  // Fetch candidates associated with the job
  const fetchCandidates = useCallback(async () => {
    try {
      const response = await api.get('/candidates');
      const filteredCandidates = response.data.filter(
        (candidate) => candidate.jobId === jobId
      );
      setCandidates(filteredCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
    fetchCandidates();
  }, [fetchJobDetails, fetchCandidates]);

  // Update candidate stage
  const updateCandidateStage = async (candidateId, newStage) => {
    try {
      await api.put(`/candidates/${candidateId}`, { stage: newStage });
      fetchCandidates();
      setConfirmationModal(false);
    } catch (error) {
      console.error('Error updating candidate stage:', error);
    }
  };

  // Handle scheduling interviews
  const handleModalSubmit = async () => {
    if (modalType === 'schedule') {
      try {
        await api.put(`/candidates/${selectedCandidate.candidateId}`, {
          stage: 'Scheduled',
          interviewDate,
          interviewLocation,
        });
        fetchCandidates();
        setShowModal(false);
      } catch (error) {
        console.error('Error scheduling interview:', error);
      }
    }
  };

  // Handle actions for candidates
  const handleAction = (candidate, action) => {
    setSelectedCandidate(candidate);
    if (action === 'schedule') {
      setModalType('schedule');
      setInterviewDate('');
      setInterviewLocation('');
      setShowModal(true);
    } else if (action === 'shortlist' || action === 'reject') {
      setModalType(action);
      setConfirmationModal(true);
    } else if (action === 'select' || action === 'rejectScheduled') {
      setModalType(action);
      setConfirmationModal(true);
    }
  };

  // Filter candidates by stage
  const getCandidatesByStage = (stage) =>
    candidates.filter((candidate) => candidate.stage === stage);

  // Truncate long text
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found!</div>;

  return (
    <Container className="job-view pt-4">
      <div className="d-flex align-items-center mb-3">
        <Button
          variant="link"
          onClick={() => navigate('/layout/jobdescription')}
          className="p-0 text-primary back-button"
        >
          <FaArrowLeft size={20} />
        </Button>
        <h2 className="ms-3 mb-0 text-dark">View Job Posting</h2>
      </div>

      <div className="job-details bg-light p-4 rounded shadow-sm mb-4">
        <Row>
          <Col md={6}>
            <p>
              <strong>Job Posting:</strong> {job.jobPostingName}
            </p>
            <p>
              <strong>Experience Required:</strong> {job.experienceRequired}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong>Salary Range:</strong> {job.salaryRange}
            </p>
            <p>
              <strong>Description:</strong>{' '}
              {isDescriptionExpanded
                ? job.description
                : truncateText(job.description, 100)}{' '}
              {job.description.length > 100 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-primary"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                  {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                </Button>
              )}
            </p>
          </Col>
        </Row>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3 custom-tabs">
        <Tab eventKey="inProcess" title="In Process">
          <CandidateTable
            candidates={getCandidatesByStage('In Process')}
            onAction={handleAction}
            actions={['shortlist', 'reject']}
          />
        </Tab>
        <Tab eventKey="shortlisted" title="Shortlisted">
          <CandidateTable
            candidates={getCandidatesByStage('Shortlisted')}
            onAction={handleAction}
            actions={['schedule']}
          />
        </Tab>
        <Tab eventKey="scheduled" title="Scheduled Interviews">
          <CandidateTable
            candidates={getCandidatesByStage('Scheduled')}
            onAction={handleAction}
            actions={['select', 'rejectScheduled']}
            showInterviewDetails
          />
        </Tab>
        <Tab eventKey="selected" title="Selected">
          <CandidateTable candidates={getCandidatesByStage('Selected')} actions={[]} />
        </Tab>
        <Tab eventKey="rejected" title="Rejected">
          <CandidateTable candidates={getCandidatesByStage('Rejected')} actions={[]} />
        </Tab>
      </Tabs>

      {/* Confirmation Modal */}
      <Modal show={confirmationModal} onHide={() => setConfirmationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to{' '}
          {modalType === 'shortlist'
            ? 'shortlist'
            : modalType === 'reject'
            ? 'reject'
            : modalType === 'select'
            ? 'select'
            : 'reject'}{' '}
          this candidate?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmationModal(false)}>
            Cancel
          </Button>
          <Button
            variant={
              modalType === 'shortlist'
                ? 'success'
                : modalType === 'reject'
                ? 'danger'
                : modalType === 'select'
                ? 'success'
                : 'danger'
            }
            onClick={() =>
              updateCandidateStage(
                selectedCandidate.candidateId,
                modalType === 'shortlist'
                  ? 'Shortlisted'
                  : modalType === 'select'
                  ? 'Selected'
                  : 'Rejected'
              )
            }
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="interviewDate">
              <Form.Label>Interview Date</Form.Label>
              <Form.Control
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="interviewLocation" className="mt-3">
              <Form.Label>Interview Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={interviewLocation}
                onChange={(e) => setInterviewLocation(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const CandidateTable = ({ candidates, onAction, actions, showInterviewDetails = false }) => (
  <Table responsive striped bordered hover className="custom-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Mobile</th>
        {showInterviewDetails && (
          <>
            <th>Interview Date</th>
            <th>Interview Location</th>
          </>
        )}
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {candidates.map((candidate, index) => (
        <tr key={candidate.candidateId || index}>
          <td>
            {candidate.firstName} {candidate.lastName}
          </td>
          <td>{candidate.email}</td>
          <td>{candidate.mobileNo}</td>
          {showInterviewDetails && (
            <>
              <td>{candidate.interviewDate || 'N/A'}</td>
              <td>{candidate.interviewLocation || 'N/A'}</td>
            </>
          )}
          <td>
            {actions.includes('shortlist') && (
              <Button
                variant="success"
                size="sm"
                className="me-2"
                onClick={() => onAction(candidate, 'shortlist')}
              >
                Shortlist
              </Button>
            )}
            {actions.includes('reject') && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onAction(candidate, 'reject')}
              >
                Reject
              </Button>
            )}
            {actions.includes('schedule') && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAction(candidate, 'schedule')}
              >
                Schedule Interview
              </Button>
            )}
            {actions.includes('select') && (
              <Button
                variant="success"
                size="sm"
                className="me-2"
                onClick={() => onAction(candidate, 'select')}
              >
                Select
              </Button>
            )}
            {actions.includes('rejectScheduled') && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onAction(candidate, 'rejectScheduled')}
              >
                Reject
              </Button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default JobView;
