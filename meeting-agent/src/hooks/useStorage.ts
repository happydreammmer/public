import { useState, useEffect, useCallback } from 'react';
import { MeetingRecord } from '../types';
import { LOCAL_STORAGE_KEY } from '../config/constants';

export const useStorage = () => {
  const [meetingRecords, setMeetingRecords] = useState<MeetingRecord[]>([]);

  useEffect(() => {
    try {
      const storedRecords = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedRecords) {
        const records = JSON.parse(storedRecords) as MeetingRecord[];
        setMeetingRecords(records.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (e) {
      console.error("Error loading meeting records from localStorage:", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  const saveMeetingRecord = useCallback((currentRecord: MeetingRecord | null) => {
    if (!currentRecord || !currentRecord.rawTranscription) return;

    setMeetingRecords((prevRecords) => {
      const updatedRecords = [...prevRecords];
      const existingRecordIndex = updatedRecords.findIndex(r => r.id === currentRecord.id);
      if (existingRecordIndex > -1) {
        updatedRecords[existingRecordIndex] = currentRecord;
      } else {
        updatedRecords.push(currentRecord);
      }
      updatedRecords.sort((a, b) => b.timestamp - a.timestamp);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedRecords));
      } catch (e) {
        console.error("Error saving meeting records to localStorage:", e);
      }
      return updatedRecords;
    });
  }, []);

  return { meetingRecords, saveMeetingRecord };
}; 