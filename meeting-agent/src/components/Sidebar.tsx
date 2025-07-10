import React from 'react';
import { MeetingRecord } from '../types';

interface SidebarProps {
  meetingRecords: MeetingRecord[];
  onSelectMeeting: (meeting: MeetingRecord) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ meetingRecords, onSelectMeeting }) => {
  return (
    <aside id="qaSidebar" className="qa-sidebar">
      <h2>Meeting History</h2>
      {meetingRecords.length === 0 ? (
        <p>No past meetings found.</p>
      ) : (
        <ul>
          {meetingRecords.map((record) => (
            <li key={record.id} onClick={() => onSelectMeeting(record)}>
              {record.title || 'Untitled Meeting'}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar; 