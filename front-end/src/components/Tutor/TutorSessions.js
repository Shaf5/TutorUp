import React, { useState, useEffect } from "react";
import { getTutorUpcomingSessions, getTutorPastSessions } from "../../services/api";

function TutorSessions({ tutorId, onNavigate }) {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("Time");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [pastSortBy, setPastSortBy] = useState("Recent");
  const [showPastSortMenu, setShowPastSortMenu] = useState(false);

  const sortParamMap = {
    Time: "time",
    Course: "course",
    Status: "status",
  };

  const pastSortOptions = ["Recent", "Oldest", "Course", "Student"];

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorId, sortBy]);

  const fetchSessions = async () => {
    try {
      const [upcomingResult, pastResult] = await Promise.all([
        getTutorUpcomingSessions(tutorId, sortParamMap[sortBy]),
        getTutorPastSessions(tutorId),
      ]);
      if (upcomingResult.success) {
        setUpcomingSessions(upcomingResult.data);
      }
      if (pastResult.success) {
        setPastSessions(pastResult.data);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSort = (label) => {
    setSortBy(label);
    setShowSortMenu(false);
  };

  const handleSelectPastSort = (label) => {
    setPastSortBy(label);
    setShowPastSortMenu(false);
  };

  // Client-side sort for past sessions
  const sortedPastSessions = [...pastSessions].sort((a, b) => {
    if (pastSortBy === "Recent") {
      const dateStrA = a.Date.split("T")[0];
      const dateStrB = b.Date.split("T")[0];
      const dateA = new Date(`${dateStrA} ${a.StartTime}`);
      const dateB = new Date(`${dateStrB} ${b.StartTime}`);
      return dateB - dateA;
    } else if (pastSortBy === "Oldest") {
      const dateStrA = a.Date.split("T")[0];
      const dateStrB = b.Date.split("T")[0];
      const dateA = new Date(`${dateStrA} ${a.StartTime}`);
      const dateB = new Date(`${dateStrB} ${b.StartTime}`);
      return dateA - dateB;
    } else if (pastSortBy === "Course") {
      return a.CourseName.localeCompare(b.CourseName);
    } else if (pastSortBy === "Student") {
      return (a.StudentName || "").localeCompare(b.StudentName || "");
    }
    return 0;
  });

  // 🔹 Group upcoming sessions by SlotID (same slot = one card) and merge students
  const groupedUpcomingSessions = Object.values(
    upcomingSessions.reduce((acc, session) => {
      const groupKey =
        session.SlotID ||
        `${session.Date}-${session.StartTime}-${session.CourseName || ""}`;

      if (!acc[groupKey]) {
        acc[groupKey] = {
          ...session,
          _students: [], // we'll store { id, name } here
        };
      }

      const tmpStudents = [];

      // Case 1: backend already sends comma-separated StudentNames / StudentIDs
      if (session.StudentNames && session.StudentNames.trim() !== "") {
        const names = session.StudentNames.split(", ");
        const ids = session.StudentIDs ? session.StudentIDs.split("||") : [];
        names.forEach((name, idx) => {
          const id = ids[idx] || `${name}-${idx}`;
          tmpStudents.push({ id, name });
        });
      }
      // Case 2: one row per student with StudentName / StudentID
      else if (session.StudentName && session.StudentName.trim() !== "") {
        const id =
          session.StudentID ||
          session.StudentEmail ||
          session.StudentName;
        tmpStudents.push({ id, name: session.StudentName });
      }

      // Add unique students into the group
      tmpStudents.forEach((stu) => {
        const already = acc[groupKey]._students.some(
          (s) => s.id === stu.id && s.name === stu.name
        );
        if (!already) {
          acc[groupKey]._students.push(stu);
        }
      });

      return acc;
    }, {})
  );

  if (loading) {
    return <div className="loading">Loading sessions...</div>;
  }

  return (
    <div className="page-container">
      <h2>My Tutoring Sessions</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Upcoming Sessions Header + Sort */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>Upcoming Sessions</h3>
        <div className="feed-main-sort-container" style={{ maxWidth: "220px" }}>
          <button
            className="feed-main-sort-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSortMenu(!showSortMenu);
            }}
          >
            Sort: {sortBy} ▼
          </button>
          {showSortMenu && (
            <div className="feed-main-sort-menu">
              {["Time", "Course", "Status"].map((opt) => (
                <div
                  key={opt}
                  className="feed-main-sort-option"
                  onClick={() => handleSelectSort(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Sessions List (grouped by slot) */}
      {groupedUpcomingSessions.length === 0 ? (
        <div className="empty-state">No upcoming sessions</div>
      ) : (
        <div className="list-container">
          {groupedUpcomingSessions.map((session, index) => {
            const students = session._students || [];
            const sessionKey = `${session.SlotID || "slot"}-${
              session.Date
            }-${session.StartTime}-${index}`;

            return (
              <div key={sessionKey} className="list-item">
                <h4>{session.CourseName}</h4>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(session.Date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {session.StartTime} - {session.EndTime}
                </p>
                <p>
                  <strong>Location:</strong> {session.Location}
                </p>
                <p>
                  <strong>Status:</strong> {session.Status}
                </p>
                <div>
                  <strong>Students:</strong>
                  {students.length > 0 ? (
                    <ul
                      style={{
                        margin: "6px 0 0 0",
                        paddingLeft: 18,
                      }}
                    >
                      {students.map((stu) => (
                        <li key={stu.id}>{stu.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ marginLeft: 8 }}>No students booked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Sessions Header + Sort */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginTop: "40px",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ margin: 0 }}>Past Sessions</h3>
        <div className="feed-main-sort-container" style={{ maxWidth: "220px" }}>
          <button
            className="feed-main-sort-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPastSortMenu(!showPastSortMenu);
            }}
          >
            Sort: {pastSortBy} ▼
          </button>
          {showPastSortMenu && (
            <div className="feed-main-sort-menu">
              {pastSortOptions.map((opt) => (
                <div
                  key={opt}
                  className="feed-main-sort-option"
                  onClick={() => handleSelectPastSort(opt)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Past Sessions List */}
      {pastSessions.length === 0 ? (
        <div className="empty-state">No past sessions</div>
      ) : (
        <div className="list-container">
          {sortedPastSessions.map((session, index) => {
            const pastKey = `${session.BookingID || "booking"}-${
              session.Date
            }-${session.StartTime}-${index}`;
            return (
              <div key={pastKey} className="list-item">
                <h4>{session.CourseName}</h4>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(session.Date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {session.StartTime} - {session.EndTime}
                </p>
                <p>
                  <strong>Location:</strong> {session.Location}</p>
                {session.StudentName && (
                  <>
                    <p>
                      <strong>Student:</strong> {session.StudentName}
                    </p>
                    <p>
                      <strong>Attended:</strong>{" "}
                      {session.Attended || "Not marked"}
                    </p>
                  </>
                )}
                {session.Rating && (
                  <div
                    style={{
                      marginTop: "10px",
                      background: "#e8f5e9",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <p>
                      <strong>Student Review:</strong> {session.Rating}/5
                    </p>
                    {session.Comment && <p>{session.Comment}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TutorSessions;
