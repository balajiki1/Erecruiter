import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../../api/api';

const AddCandidateModal = ({ show, onHide, onAddCandidate, onEditCandidate, editMode, candidateToEdit, jobs }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [jobId, setJobId] = useState('');
  const [resume, setResume] = useState(null);
  const [stage, setStage] = useState('In Process'); // Explicitly define and default the stage

  useEffect(() => {
    if (editMode && candidateToEdit) {
      setFirstName(candidateToEdit.firstName);
      setLastName(candidateToEdit.lastName);
      setMobileNo(candidateToEdit.mobileNo);
      setEmail(candidateToEdit.email);
      setJobId(candidateToEdit.jobId || '');
      setStage(candidateToEdit.stage || 'In Process'); // Set stage for editing
    } else {
      setFirstName('');
      setLastName('');
      setMobileNo('');
      setEmail('');
      setJobId('');
      setResume(null);
      setStage('In Process'); // Reset stage for new candidate
    }
  }, [editMode, candidateToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !mobileNo || !email || !jobId || (!resume && !editMode)) {
      alert('All fields are required, including resume for new candidates.');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('mobileNo', mobileNo);
    formData.append('email', email);
    formData.append('jobId', jobId);
    formData.append('stage', stage); // Ensure stage is included
    if (resume) formData.append('resume', resume);

    try {
      let response;
      if (editMode) {
        response = await api.put(`/candidates/${candidateToEdit._id}`, formData);
        onEditCandidate(response.data.candidate);
      } else {
        response = await api.post('/candidates', formData);
        onAddCandidate(response.data.candidate);
      }
      onHide(); // Close modal after success
    } catch (error) {
      console.error('Error submitting candidate:', error);
      alert(error.response?.data?.message || 'An error occurred while submitting the candidate.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Candidate' : 'Add New Candidate'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="mobileNo">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter mobile number"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="jobId">
            <Form.Label>Job Position</Form.Label>
            <Form.Control
              as="select"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
            >
              <option value="">Select a Job</option>
              {jobs.map((job) => (
                <option key={job.jobId} value={job.jobId}>
                  {job.jobPostingName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="resume">
            <Form.Label>Resume</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </Form.Group>
          <div className="text-end">
            <Button variant="primary" type="submit">
              {editMode ? 'Save Changes' : 'Add Candidate'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCandidateModal;
