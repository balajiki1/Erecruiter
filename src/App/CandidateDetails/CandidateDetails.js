import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { FaEdit, FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AddCandidateModal from '../AddCandidateDetails/AddCandidateDetails';
import api from '../../api/api';
import './CandidateDetails.css';

const CandidateDetailsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsAndCandidates = async () => {
      try {
        const jobResponse = await api.get('/jobs');
        setJobs(jobResponse.data);

        const candidateResponse = await api.get('/candidates');
        setCandidates(candidateResponse.data);
        setFilteredCandidates(candidateResponse.data);
      } catch (error) {
        console.error('Error fetching jobs or candidates:', error);
      }
    };
    fetchJobsAndCandidates();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = candidates.filter((candidate) =>
      `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(value)
    );
    setFilteredCandidates(filtered);
  };

  const handleAddCandidate = (newCandidate) => {
    setCandidates((prev) => [...prev, newCandidate]);
    setFilteredCandidates((prev) => [...prev, newCandidate]);
  };

  const handleEditCandidate = (updatedCandidate) => {
    const updated = candidates.map((candidate) =>
      candidate.id === updatedCandidate.id ? updatedCandidate : candidate
    );
    setCandidates(updated);
    setFilteredCandidates(updated);
  };

  const handleEditClick = (candidate) => {
    setEditMode(true);
    setCandidateToEdit(candidate);
    setShowAddModal(true);
  };

  const getChipClass = (stage) => {
    switch (stage?.toLowerCase()) {
      case 'shortlisted':
        return 'bg-success text-white';
      case 'in process':
        return 'bg-warning text-dark';
      case 'scheduled':
        return 'bg-primary text-white';
      case 'selected':
        return 'bg-info text-white';
      case 'rejected':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <Container className="pt-5">
      <Row className="align-items-center mb-4">
        <Col xs={12} className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Button
              variant="link"
              onClick={() => navigate(-1)}
              className="p-0 me-2"
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              <FaArrowLeft />
            </Button>
            <h2 className="candidate-list-heading m-0">Candidate Details</h2>
          </div>
          <div>
            <Button
              variant="primary"
              onClick={() => {
                setEditMode(false);
                setCandidateToEdit(null);
                setShowAddModal(true);
              }}
            >
              <FaPlus /> Add Candidate
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search candidates by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Col>
      </Row>

      <Row>
        {filteredCandidates.map((candidate) => (
          <Col key={candidate.id} md={6} lg={4} className="mb-4">
            <Card className="candidate-card shadow-sm">
              <Card.Body>
                <Button
                  variant="link"
                  onClick={() => handleEditClick(candidate)}
                  className="edit-button"
                >
                  <FaEdit />
                </Button>
                <div className="d-flex justify-content-between align-items-start mt-2">
                  <Card.Title>
                    {candidate.firstName} {candidate.lastName}
                  </Card.Title>
                  <span className={`candidate-chip badge ${getChipClass(candidate.stage)}`}>
                    {candidate.stage || 'In Process'}
                  </span>
                </div>
                <Card.Text>
                  <strong>Mobile:</strong> {candidate.mobileNo} <br />
                  <strong>Email:</strong> {candidate.email} <br />
                  <strong>Job:</strong>{' '}
                  {jobs.find((job) => job.jobId === candidate.jobId)?.jobPostingName || 'N/A'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <AddCandidateModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddCandidate={handleAddCandidate}
        onEditCandidate={handleEditCandidate}
        editMode={editMode}
        candidateToEdit={candidateToEdit}
        jobs={jobs}
      />
    </Container>
  );
};

export default CandidateDetailsPage;
