import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Heading, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, Input, Text } from '@chakra-ui/react';
import { getApiBase } from '../utils/api.js';
import { getToken } from '../utils/auth.js';

const API_BASE = getApiBase();

function Booking() {
  const [events, setEvents] = useState([]);
  const [dentistId, setDentistId] = useState('');
  const [specialistId, setSpecialistId] = useState('');
  const [selected, setSelected] = useState(null);
  const [bookings, setBookings] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const token = getToken();

  const fetchAvailability = async (start, end, spec) => {
    if (!spec) return;
    const url = `${API_BASE}/api/bookings/availability?specialistId=${spec}&start=${start.toISOString()}&end=${end.toISOString()}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const slots = (data.slots || []).map((s) => ({ start: s, end: s, title: 'Available' }));
      setEvents(slots);
    }
  };

  const handleDatesSet = (arg) => {
    fetchAvailability(arg.start, arg.end, specialistId);
  };

  const handleDateClick = (arg) => {
    setSelected(arg.dateStr);
    onOpen();
  };

  const bookSlot = async () => {
    if (!selected || !dentistId || !specialistId) return;
    await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
      body: JSON.stringify({ dentistId, specialistId, datetime: selected }),
    });
    setBookings([...bookings, { datetime: selected }]);
    onClose();
  };

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>Book Fine-Tuning Call</Heading>
      <Box mb={2} display="flex" gap={2}>
        <Input placeholder="Your Dentist ID" value={dentistId} onChange={(e) => setDentistId(e.target.value)} />
        <Input placeholder="Specialist ID" value={specialistId} onChange={(e) => setSpecialistId(e.target.value)} />
      </Box>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        datesSet={handleDatesSet}
        dateClick={handleDateClick}
        height="auto"
      />
      {bookings.length > 0 && (
        <Box mt={4}>
          <Heading as="h3" size="md" mb={2}>Upcoming Bookings</Heading>
          {bookings.map((b, i) => (
            <Box key={i} display="flex" justifyContent="space-between" mb={1}
              p={2} borderWidth="1px" rounded="md">
              <Text>{b.datetime}</Text>
              <Button size="sm" onClick={() => setBookings(bookings.filter((_, idx) => idx !== i))}>Cancel</Button>
            </Box>
          ))}
        </Box>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Booking</ModalHeader>
          <ModalBody>
            <Text>Book call at {selected}</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="teal" onClick={bookSlot}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Booking;
