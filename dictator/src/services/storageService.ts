import { Note, UserSettings } from '../types';

const NOTES_STORAGE_KEY = 'voiceNotesApp_notes';
const SETTINGS_STORAGE_KEY = 'voiceNotesApp_settings';
const THEME_STORAGE_KEY = 'voiceNotesApp_theme';


export class StorageService {
  constructor() {}

  // Note Operations
  getAllNotes(): Note[] {
    try {
      const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
      return [];
    }
  }

  getNoteById(id: string): Note | undefined {
    const notes = this.getAllNotes();
    return notes.find(note => note.id === id);
  }

  saveNote(note: Note): void {
    try {
      const notes = this.getAllNotes();
      const existingNoteIndex = notes.findIndex(n => n.id === note.id);
      if (existingNoteIndex > -1) {
        notes[existingNoteIndex] = note; // Update existing
      } else {
        notes.push(note); // Add new
      }
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving note to localStorage:", error);
      // Potentially handle quota exceeded error more gracefully
    }
  }

  deleteNote(id: string): void {
    try {
      let notes = this.getAllNotes();
      notes = notes.filter(note => note.id !== id);
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Error deleting note from localStorage:", error);
    }
  }

  // User Settings Operations
  loadUserSettings(): UserSettings {
    try {
      const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return settingsJson ? JSON.parse(settingsJson) : {};
    } catch (error) {
      console.error("Error loading user settings from localStorage:", error);
      return {};
    }
  }

  saveUserSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving user settings to localStorage:", error);
    }
  }

  // Theme Preference Operations
  loadThemePreference(): string | null {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      console.error("Error loading theme preference from localStorage:", error);
      return null;
    }
  }

  saveThemePreference(theme: string): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Error saving theme preference to localStorage:", error);
    }
  }
}
