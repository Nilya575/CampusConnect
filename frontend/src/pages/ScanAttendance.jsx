import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import API from '../api/axios';

function ScanAttendance() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [message, setMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([]); // ab tak jo scan hue
  const scannerRef = useRef(null);

  useEffect(() => {
    fetchEvents();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  const startScanning = () => {
    if (!selectedEvent) {
      setMessage('Please select an event first');
      return;
    }

    setScanning(true);
    setMessage('');

    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await handleScanSuccess(decodedText, html5QrCode);
      },
      (errorMessage) => {}
    ).catch((err) => {
      setMessage('Camera access failed: ' + err);
      setScanning(false);
    });
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      setScanning(false);
    }
  };

  const handleScanSuccess = async (decodedText, html5QrCode) => {
  try {
    await html5QrCode.stop();
    setScanning(false);

    const qrData = JSON.parse(decodedText);
    const token = localStorage.getItem('token');

    const response = await API.post(
      '/events/mark-attendance',
      { eventId: qrData.eventId, userId: qrData.userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const studentName = response.data.studentName || 'Unknown';
    setMessage(`${response.data.message} - ${studentName}`);

    setScanHistory((prev) => [
      { time: new Date().toLocaleTimeString(), status: 'success', name: studentName },
      ...prev
    ]);

  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to mark attendance';
    const studentName = error.response?.data?.studentName || '';
    
    setMessage(studentName ? `${errorMsg} - ${studentName}` : errorMsg);

    setScanHistory((prev) => [
      { time: new Date().toLocaleTimeString(), status: 'error', text: errorMsg, name: studentName },
      ...prev
    ]);
  }
};

  const selectedEventData = events.find((e) => e._id === selectedEvent);

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center' }}>
      <h2>📷 Scan Attendance</h2>

      {/* Event Selection Dropdown */}
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        disabled={scanning}
        style={{ width: '100%' }}
      >
        <option value="">-- Select Event --</option>
        {events.map((event) => (
          <option key={event._id} value={event._id}>
            {event.title} ({new Date(event.date).toLocaleDateString()})
          </option>
        ))}
      </select>

      {selectedEventData && (
        <p style={{ color: '#666', fontSize: '14px' }}>
          Registered: {selectedEventData.registeredUsers.length} students
        </p>
      )}

      {message && (
        <p style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
          color: message.includes('success') ? '#155724' : '#721c24',
          fontWeight: 500
        }}>
          {message}
        </p>
      )}

      {!scanning ? (
        <button onClick={startScanning}>Start Scanning</button>
      ) : (
        <button onClick={stopScanning}>Stop Scanning</button>
      )}

      <div id="qr-reader" style={{ width: '100%', marginTop: '20px' }}></div>

      {/* Scan History List */}
      {scanHistory.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3>Scan History</h3>
          {scanHistory.map((scan, index) => (
  <div key={index} style={{
    padding: '8px',
    margin: '5px 0',
    borderRadius: '6px',
    backgroundColor: scan.status === 'success' ? '#d4edda' : '#f8d7da',
    fontSize: '13px'
  }}>
    {scan.time} - {scan.status === 'success' 
      ? `✅ ${scan.name} marked present` 
      : `❌ ${scan.name ? scan.name + ': ' : ''}${scan.text}`}
  </div>
))}
        
        </div>
      )}
    </div>
  );
}

export default ScanAttendance;