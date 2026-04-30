import { useState, useRef } from 'react';

import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { courses, addCourse, deleteCourse, updateCourse } = useApp();
  const { user } = useAuth();
  const [tab, setTab] = useState('courses');
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState('');
  const imageRef = useRef();

  const emptyForm = {
    title: '', category: 'Reading', level: 'Beginner',
    duration: '', description: '', lessons: 1,
    color: '#4CAF50', image: null,
  };

  const [form, setForm] = useState(emptyForm);

  const categories = ['Reading', 'Phonics', 'Spelling', 'Writing', 'Comprehension', 'Mathematics'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return alert('Course title is required');
    if (!form.duration.trim()) return alert('Duration is required');
    if (!form.description.trim()) return alert('Description is required');

    if (editId) {
      updateCourse(editId, form);
      setSuccess('Course updated successfully!');
      setEditId(null);
    } else {
      addCourse(form);
      setSuccess('Course added successfully!');
      setShowAdd(false);
    }
    setForm(emptyForm);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleEdit = (course) => {
    setForm({ ...course });
    setEditId(course.id);
    setShowAdd(true);
    setTab('courses');
  };

  const handleDelete = (id) => {
    if (confirm('Delete this course?')) {
      deleteCourse(id);
      setSuccess('Course deleted.');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="admin-page">
          <div className="admin-header">
            <div>
              <h1>🛡 Admin Panel</h1>
              <p>Manage courses, users, and platform content</p>
            </div>
            <div className="admin-badge-wrap">
              <span className="admin-user-badge">👤 {user?.name} · Admin</span>
            </div>
          </div>

          {success && <div className="alert-success">{success}</div>}

          {/* Stats */}
          <div className="admin-stats">
            {[
              { label: 'Total Courses', value: courses.length, icon: '📚', color: '#4CAF50' },
              { label: 'Published', value: courses.length, icon: '✅', color: '#2196F3' },
              { label: 'Enrolled Students', value: courses.filter(c => c.enrolled).length, icon: '👥', color: '#FF9800' },
            ].map(s => (
              <div key={s.label} className="admin-stat" style={{ borderColor: s.color }}>
                <span className="admin-stat-icon">{s.icon}</span>
                <div>
                  <p className="admin-stat-value">{s.value}</p>
                  <p className="admin-stat-label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-tabs">
            <button className={`admin-tab ${tab === 'courses' ? 'active' : ''}`} onClick={() => setTab('courses')}>
              📚 Courses
            </button>
            <button className={`admin-tab ${tab === 'upload' ? 'active' : ''}`} onClick={() => { setTab('upload'); setShowAdd(true); setEditId(null); setForm(emptyForm); }}>
              ➕ Add Course
            </button>
          </div>

          {/* Course Upload / Edit Form */}
          {(showAdd || tab === 'upload') && (
            <div className="admin-form-card">
              <h2>{editId ? '✏️ Edit Course' : '➕ Add New Course'}</h2>

              <div className="admin-form-grid">
                <div className="form-group">
                  <label>Course Title *</label>
                  <input
                    placeholder="e.g. Reading Foundations"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Level</label>
                  <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                    {levels.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration *</label>
                  <input
                    placeholder="e.g. 4 weeks"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Number of Lessons</label>
                  <input
                    type="number" min="1"
                    value={form.lessons}
                    onChange={e => setForm({ ...form, lessons: +e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Color Theme</label>
                  <div className="color-row">
                    <input type="color" value={form.color}
                      onChange={e => setForm({ ...form, color: e.target.value })} />
                    <span>{form.color}</span>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what students will learn..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Course Image (optional)</label>
                  <div className="image-upload-area" onClick={() => imageRef.current.click()}>
                    {form.image ? (
                      <img src={form.image} alt="Course" className="preview-image" />
                    ) : (
                      <div className="upload-placeholder">
                        <span>📁</span>
                        <p>Click to upload course image</p>
                        <p className="upload-hint">PNG, JPG, WebP supported</p>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={imageRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                  {form.image && (
                    <button className="btn-secondary btn-sm mt-1" onClick={() => setForm({ ...form, image: null })}>
                      Remove Image
                    </button>
                  )}
                </div>
              </div>

              <div className="admin-form-actions">
                <button className="btn-secondary" onClick={() => { setShowAdd(false); setEditId(null); setForm(emptyForm); setTab('courses'); }}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSubmit}>
                  {editId ? '✅ Update Course' : '➕ Add Course'}
                </button>
              </div>
            </div>
          )}

          {/* Courses Table */}
          {tab === 'courses' && (
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h2>All Courses ({courses.length})</h2>
                <button className="btn-primary btn-sm" onClick={() => { setShowAdd(true); setEditId(null); setForm(emptyForm); }}>
                  + New Course
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="empty-state">
                  <span>📚</span>
                  <p>No courses yet. Add your first course!</p>
                </div>
              ) : (
                <div className="admin-course-list">
                  {courses.map(course => (
                    <div key={course.id} className="admin-course-row">
                      <div className="course-color-dot" style={{ background: course.color }} />
                      {course.image && <img src={course.image} alt={course.title} className="admin-course-thumb" />}
                      <div className="admin-course-info">
                        <h3>{course.title}</h3>
                        <p>{course.category} · {course.level} · {course.duration} · {course.lessons} lessons</p>
                        <p className="course-desc-preview">{course.description}</p>
                      </div>
                      <div className="admin-course-meta">
                        {course.enrolled && <span className="enrolled-badge">Enrolled</span>}
                      </div>
                      <div className="admin-course-actions">
                        <button className="btn-secondary btn-sm" onClick={() => handleEdit(course)}>Edit</button>
                        <button className="btn-danger btn-sm" onClick={() => handleDelete(course.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}