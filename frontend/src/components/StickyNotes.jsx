import React, { useState, useEffect } from "react";

const StickyNotes = () => {
  const [noteContent, setNoteContent] = useState("");
  const [isNoteVisible, setIsNoteVisible] = useState(false);

  // Load note content from localStorage if it exists
  useEffect(() => {
    const savedNote = localStorage.getItem("stickyNote");
    if (savedNote) {
      setNoteContent(savedNote);
    }
  }, []);

  // Save the note content to localStorage
  const saveNote = () => {
    localStorage.setItem("stickyNote", noteContent);
    setIsNoteVisible(false); // Hide the sticky note after saving
  };

  // Cancel and hide the sticky note without saving
  const cancelNote = () => {
    setIsNoteVisible(false);
  };

  return (
    <div>
      {/* Button to show sticky note */}
      <button
        onClick={() => setIsNoteVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-700"
      >
        📝
      </button>

      {/* Sticky note modal */}
      {isNoteVisible && (
        <div className="fixed bottom-16 right-4 w-64 p-4 bg-yellow-200 shadow-lg rounded-md">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded-md"
            placeholder="Write your note..."
          />
          <div className="mt-2 flex justify-between">
            <button onClick={saveNote} className="btn btn-primary btn-sm">
              Save
            </button>
            <button onClick={cancelNote} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyNotes;
