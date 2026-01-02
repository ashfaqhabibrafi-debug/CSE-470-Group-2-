import React, { useState, useEffect, useContext } from 'react';
import { getVolunteers } from '../../services/userApi';
import { sendMessage } from '../../services/messageApi';
import { AuthContext } from '../../context/AuthContext';
import './SafetyTips.css';

const SafetyTips = () => {
  const { user } = useContext(AuthContext);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingMessage, setSendingMessage] = useState({});
  const [messageSuccess, setMessageSuccess] = useState({});

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getVolunteers();
      // Filter volunteers who have phone numbers
      const volunteersWithPhone = (response.data || []).filter(v => v.phone && v.phone.trim() !== '');
      setVolunteers(volunteersWithPhone);
    } catch (err) {
      console.error('Error fetching volunteers:', err);
      setError('Failed to load volunteer contacts');
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHelp = async (volunteerId, volunteerName) => {
    if (!user || user.role !== 'citizen') {
      alert('Only citizens can request help from volunteers.');
      return;
    }

    try {
      setSendingMessage(prev => ({ ...prev, [volunteerId]: true }));
      setMessageSuccess(prev => ({ ...prev, [volunteerId]: false }));

      const messageContent = `Hello, I found your contact information on the Safety Tips page and would like to request your assistance. Please contact me when you're available. Thank you!`;

      await sendMessage({
        receiver: volunteerId,
        content: messageContent,
      });

      setMessageSuccess(prev => ({ ...prev, [volunteerId]: true }));
      setTimeout(() => {
        setMessageSuccess(prev => {
          const newState = { ...prev };
          delete newState[volunteerId];
          return newState;
        });
      }, 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSendingMessage(prev => {
        const newState = { ...prev };
        delete newState[volunteerId];
        return newState;
      });
    }
  };

  return (
    <div className="safety-tips-container">
      <div className="safety-header">
        <h1>Safety Tips & Education</h1>
        <p>Essential first-aid, safety guidelines, and emergency contact information</p>
      </div>

      <div className="safety-content">
        {/* Emergency Contacts Section */}
        <section className="safety-section">
          <h2>🚨 Emergency Contacts</h2>
          <div className="contacts-grid">
            <div className="contact-card emergency">
              <h3>Emergency Services</h3>
              <p className="contact-number">999 / 112</p>
              <p className="contact-description">Police, Fire, Ambulance</p>
            </div>
            <div className="contact-card">
              <h3>Disaster Management</h3>
              <p className="contact-number">1090</p>
              <p className="contact-description">National Emergency Helpline</p>
            </div>
            <div className="contact-card">
              <h3>Medical Emergency</h3>
              <p className="contact-number">16263</p>
              <p className="contact-description">Health Emergency Line</p>
            </div>
            <div className="contact-card">
              <h3>Red Cross</h3>
              <p className="contact-number">+880-2-9350391</p>
              <p className="contact-description">Bangladesh Red Crescent Society</p>
            </div>
          </div>
        </section>

        {/* Volunteer Contacts Section */}
        <section className="safety-section">
          <h2>🤝 Volunteer Contacts</h2>
          {loading ? (
            <div className="volunteer-loading">Loading volunteer contacts...</div>
          ) : error ? (
            <div className="volunteer-error">{error}</div>
          ) : volunteers.length === 0 ? (
            <div className="volunteer-empty">
              <p>No volunteer contacts available at the moment.</p>
              <p>Volunteers can add their contact information in their profile.</p>
            </div>
          ) : (
            <>
              <div className="contacts-grid">
                {volunteers.map((volunteer) => (
                  <div key={volunteer._id} className="contact-card volunteer">
                    <h3>{volunteer.name || 'Volunteer'}</h3>
                    <p className="contact-number">{volunteer.phone}</p>
                    <p className="contact-description">Available Volunteer</p>
                    {volunteer.email && (
                      <p className="contact-email">{volunteer.email}</p>
                    )}
                    {user && user.role === 'citizen' && (
                      <button
                        className="volunteer-help-button"
                        onClick={() => handleRequestHelp(volunteer._id, volunteer.name)}
                        disabled={sendingMessage[volunteer._id]}
                      >
                        {sendingMessage[volunteer._id] ? (
                          'Sending...'
                        ) : messageSuccess[volunteer._id] ? (
                          '✓ Message Sent!'
                        ) : (
                          'Request Help'
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="volunteer-info">
                <p><strong>How to Get Help:</strong> If you need volunteer assistance, please submit a help request through the dashboard or contact a volunteer directly using the numbers above.</p>
                <p><strong>Become a Volunteer:</strong> Register as a volunteer through the system dashboard to help your community during disasters. Make sure to add your phone number in your profile to be listed here.</p>
              </div>
            </>
          )}
        </section>

        {/* First Aid Section */}
        <section className="safety-section">
          <h2>🩹 First Aid Basics</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>CPR (Cardiopulmonary Resuscitation)</h3>
              <ol>
                <li>Check responsiveness - tap and shout</li>
                <li>Call for emergency help (999)</li>
                <li>Open airway - tilt head, lift chin</li>
                <li>Give 30 chest compressions (2-2.4 inches deep)</li>
                <li>Give 2 rescue breaths</li>
                <li>Repeat until help arrives</li>
              </ol>
            </div>

            <div className="tip-card">
              <h3>Bleeding Control</h3>
              <ol>
                <li>Apply direct pressure with clean cloth/bandage</li>
                <li>Elevate the injured area above heart level</li>
                <li>Keep pressure for at least 15 minutes</li>
                <li>Don't remove objects stuck in wound</li>
                <li>Seek medical help if bleeding doesn't stop</li>
              </ol>
            </div>

            <div className="tip-card">
              <h3>Burns</h3>
              <ol>
                <li>Cool the burn with running water (not ice)</li>
                <li>Remove jewelry/clothing near burn</li>
                <li>Cover with clean, non-stick dressing</li>
                <li>Don't break blisters</li>
                <li>Seek medical help for severe burns</li>
              </ol>
            </div>

            <div className="tip-card">
              <h3>Choking</h3>
              <ol>
                <li>Encourage coughing if person can cough</li>
                <li>Give 5 back blows between shoulder blades</li>
                <li>Give 5 abdominal thrusts (Heimlich maneuver)</li>
                <li>Repeat until object is dislodged or person becomes unconscious</li>
                <li>Call emergency services if unsuccessful</li>
              </ol>
            </div>

            <div className="tip-card">
              <h3>Shock</h3>
              <ol>
                <li>Lay person down and elevate legs</li>
                <li>Keep person warm with blanket</li>
                <li>Don't give food or water</li>
                <li>Loosen tight clothing</li>
                <li>Call emergency services immediately</li>
              </ol>
            </div>

            <div className="tip-card">
              <h3>Broken Bones</h3>
              <ol>
                <li>Don't move the injured area</li>
                <li>Support with soft padding/clothing</li>
                <li>Apply ice pack (wrapped in cloth)</li>
                <li>Don't try to realign bones</li>
                <li>Seek immediate medical attention</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Disaster Preparedness Section */}
        <section className="safety-section">
          <h2>🌊 Disaster Preparedness</h2>
          <div className="disaster-tips">
            <div className="disaster-tip-card">
              <h3>📋 Emergency Kit Essentials</h3>
              <ul>
                <li>Water (1 gallon per person per day, 3-day supply)</li>
                <li>Non-perishable food (3-day supply)</li>
                <li>Flashlight with extra batteries</li>
                <li>First aid kit</li>
                <li>Whistle to signal for help</li>
                <li>Dust masks and plastic sheeting</li>
                <li>Moist towelettes and garbage bags</li>
                <li>Wrench or pliers to turn off utilities</li>
                <li>Manual can opener</li>
                <li>Local maps</li>
                <li>Cell phone with chargers</li>
                <li>Important documents (in waterproof container)</li>
              </ul>
            </div>

            <div className="disaster-tip-card">
              <h3>⚠️ Flood Safety</h3>
              <ul>
                <li>Move to higher ground immediately</li>
                <li>Don't walk or drive through floodwater</li>
                <li>Evacuate if advised by authorities</li>
                <li>Turn off utilities at main switches</li>
                <li>Avoid downed power lines</li>
                <li>Listen to weather updates on radio</li>
                <li>Don't return home until declared safe</li>
              </ul>
            </div>

            <div className="disaster-tip-card">
              <h3>🌪️ Cyclone/Tornado Safety</h3>
              <ul>
                <li>Go to the lowest level of your building</li>
                <li>Stay away from windows</li>
                <li>Get under sturdy furniture or cover yourself</li>
                <li>If in vehicle, get out and find shelter</li>
                <li>If outside, lie flat in a low area</li>
                <li>Don't stay in mobile homes</li>
                <li>Listen to weather alerts</li>
              </ul>
            </div>

            <div className="disaster-tip-card">
              <h3>🔥 Fire Safety</h3>
              <ul>
                <li>Install smoke detectors on every floor</li>
                <li>Create and practice a fire escape plan</li>
                <li>Know two ways out of every room</li>
                <li>Stop, drop, and roll if clothes catch fire</li>
                <li>Crawl low under smoke</li>
                <li>Don't use elevators during a fire</li>
                <li>Feel doors before opening - if hot, use another exit</li>
                <li>Call emergency services from safe location</li>
              </ul>
            </div>

            <div className="disaster-tip-card">
              <h3>🌍 Earthquake Safety</h3>
              <ul>
                <li>Drop, cover, and hold on</li>
                <li>Get under sturdy furniture</li>
                <li>Stay away from windows and heavy objects</li>
                <li>If outdoors, move to open area away from buildings</li>
                <li>If in vehicle, pull over and stay inside</li>
                <li>After shaking stops, check for injuries</li>
                <li>Check for gas leaks and fire hazards</li>
                <li>Listen to emergency broadcasts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safety Guidelines Section */}
        <section className="safety-section">
          <h2>✅ General Safety Guidelines</h2>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h3>📍 During Disasters</h3>
              <ul>
                <li>Stay calm and assess the situation</li>
                <li>Follow official instructions</li>
                <li>Help others if it's safe to do so</li>
                <li>Stay informed through official channels</li>
                <li>Conserve phone battery</li>
                <li>Use text messages instead of calls when possible</li>
              </ul>
            </div>

            <div className="guideline-card">
              <h3>🏠 Home Safety</h3>
              <ul>
                <li>Keep emergency contacts posted in visible places</li>
                <li>Have fire extinguishers and know how to use them</li>
                <li>Install carbon monoxide detectors</li>
                <li>Keep important documents in fireproof safe</li>
                <li>Maintain emergency supplies</li>
                <li>Practice evacuation routes with family</li>
              </ul>
            </div>

            <div className="guideline-card">
              <h3>👥 Community Preparedness</h3>
              <ul>
                <li>Know your neighbors and their needs</li>
                <li>Join community emergency response groups</li>
                <li>Participate in disaster drills</li>
                <li>Share safety information with others</li>
                <li>Volunteer with local disaster response organizations</li>
                <li>Stay connected with community alert systems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Important Reminders */}
        <section className="safety-section reminder-section">
          <h2>💡 Important Reminders</h2>
          <div className="reminders">
            <div className="reminder-item">
              <strong>Always call emergency services (999/112) first in life-threatening situations</strong>
            </div>
            <div className="reminder-item">
              <strong>Keep your emergency kit updated and easily accessible</strong>
            </div>
            <div className="reminder-item">
              <strong>Practice your emergency plans regularly with family members</strong>
            </div>
            <div className="reminder-item">
              <strong>Stay informed about weather conditions and disaster warnings</strong>
            </div>
            <div className="reminder-item">
              <strong>Have backup power sources (batteries, power banks) ready</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SafetyTips;

