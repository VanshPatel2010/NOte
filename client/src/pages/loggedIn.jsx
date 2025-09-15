import React, { useContext, useEffect, useState } from "react";
import LogNavbar from "../components/logNavbar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { backendURL, userData } = useContext(AppContent);
  const [notes, setNotes] = useState([]);
  // State to manage both title and content inputs
  const [noteInput, setNoteInput] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle changes for both input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteInput((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendURL}api/user/notes`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          setNotes(res.data.data || []);
        } else {
          toast.error(res.data?.message || "Failed to load notes");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [backendURL]);

  const addNote = async () => {
    // Check both title and content
    // check no of notes
    if (notes.length >= 3) {
      alert("Note limit reached (3). Please upgrade to Pro Version.");
      return toast.error("Note limit reached (20). Please delete some notes.");
    }
    if (!noteInput.title.trim() || !noteInput.content.trim()) {
      return toast.error("Title and content cannot be empty.");
    }
    try {
      const res = await axios.post(
        `${backendURL}api/user/addNote`,
        noteInput, // Send the whole {title, content} object
        { withCredentials: true }
      );
      if (res.data?.success) {
        setNotes((prev) => [res.data.data, ...prev]);
        toast.success("Note added");
        setNoteInput({ title: "", content: "" }); // Clear both fields
      } else {
        toast.error(res.data?.message || "Add failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  const updateNote = async () => {
    if (!noteInput.title.trim() || !noteInput.content.trim() || !editingId) {
      return toast.error("Title and content cannot be empty.");
    }
    try {
      const res = await axios.put(
        `${backendURL}api/user/updateNote/${editingId}`,
        noteInput, // Send the whole {title, content} object
        { withCredentials: true }
      );
      if (res.data?.success) {
        setNotes((prev) =>
          prev.map((n) => (n._id === editingId ? res.data.data : n))
        );
        toast.success("Note updated");
        cancelEdit();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    // Populate both fields for editing
    setNoteInput({ title: note.title, content: note.content });
  };

  const cancelEdit = () => {
    setEditingId(null);
    // Clear both fields
    setNoteInput({ title: "", content: "" });
  };

  const deleteNote = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      const res = await axios.delete(
        `${backendURL}api/user/deleteNote/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.success) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
        toast.success("Note deleted");
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <LogNavbar />
      <nav className="bg-blue-600 text-white p-4 flex justify-between mt-20">
        <h1 className="text-xl font-bold">Notes App</h1>
        <span>Hi, {userData?.name || "Guest"}</span>
      </nav>

      <div className="max-w-2xl mx-auto mt-8 p-4">
        {/* Updated Form Area */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {editingId ? "Edit Note" : "Add a New Note"}
          </h2>
          <input
            type="text"
            name="title" // Name attribute is crucial
            value={noteInput.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
          />
          <textarea
            name="content" // Name attribute is crucial
            value={noteInput.content}
            onChange={handleInputChange}
            placeholder="Write your content here..."
            className="w-full p-2 border rounded mb-3"
            rows="4"
          ></textarea>
          <div className="flex items-center">
            <button
              onClick={editingId ? updateNote : addNote}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
            >
              {editingId ? "Update Note" : "Add Note"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="ml-2 px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {loading && <p className="text-gray-500">Loading notes...</p>}

        {/* Updated Notes List */}
        <ul className="space-y-3">
          {notes.length === 0 && !loading && (
            <p className="text-gray-500 text-center">No notes yet. Add one!</p>
          )}

          {notes.map((note, index) => (
            // use note._id when available; fallback to index only if necessary
            <li
              key={note._id ?? index}
              className="bg-white shadow-lg rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl mb-1">{note.title}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-indigo-600 hover:underline text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)}
                    className="text-red-500 hover:underline text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
