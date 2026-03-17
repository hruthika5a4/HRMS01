import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { employeeAPI, attendanceAPI } from '../api';
import { Calendar, CheckCircle, XCircle, Loader2, Trash2, Pencil, X } from 'lucide-react';
import { format } from 'date-fns';
import { handleApiError, showSuccess } from '../utils/toastHandler';

const today = format(new Date(), 'yyyy-MM-dd');

const Attendance = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'All';

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // date string like 'yyyy-MM-dd', or '' for all dates
  const [dateFilter, setDateFilter] = useState(today);
  // "All" | "Present" | "Absent"
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [employeeFilter, setEmployeeFilter] = useState('');

  const [markData, setMarkData] = useState({
    employee: '',
    status: 'Present',
    date: today
  });

  const [editLog, setEditLog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [dateFilter, statusFilter, employeeFilter]);

  const fetchData = async () => {
    try {
      const params = {};
      if (dateFilter) params.date = dateFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (employeeFilter) params.employee = employeeFilter;

      const [empRes, attRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getAll(params)
      ]);
      setEmployees(empRes.data);
      setAttendance(attRes.data);
    } catch (err) {
      console.error('Error fetching attendance data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setMarking(true);
    try {
      await attendanceAPI.mark(markData);
      setMarkData({ ...markData, employee: '' });
      fetchData();
      showSuccess('Attendance marked successfully!');
    } catch (err) {
      handleApiError(err);
    } finally {
      setMarking(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record permanently?")) {
      try {
        await attendanceAPI.delete(id);
        showSuccess("Record removed");
        fetchData();
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.update(editLog.id, { status: editLog.status });
      showSuccess(`Status updated to ${editLog.status}`);
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      handleApiError(err);
    }
  };

  const openEditModal = (log) => {
    setEditLog({ ...log });
    setShowEditModal(true);
  };

  const statusPills = ['All', 'Present', 'Absent'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Attendance Tracking</h2>
          <p className="text-muted">Monitor and record daily presence.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Mark Attendance Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <CheckCircle style={{ color: 'var(--primary)' }} size={20} />
            Mark Attendance
          </h3>
          <form onSubmit={handleMarkAttendance} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="text-sm font-medium text-muted mb-2 block">Employee</label>
              <select
                value={markData.employee}
                onChange={(e) => setMarkData({ ...markData, employee: e.target.value })}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted mb-2 block">Date</label>
              <input
                type="date"
                max={today}
                value={markData.date}
                onChange={(e) => setMarkData({ ...markData, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted mb-2 block">Status</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setMarkData({ ...markData, status: 'Present' })}
                  className="btn flex-1"
                  style={
                    markData.status === 'Present'
                      ? { background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                  }
                >
                  Present
                </button>
                <button
                  type="button"
                  onClick={() => setMarkData({ ...markData, status: 'Absent' })}
                  className="btn flex-1"
                  style={
                    markData.status === 'Absent'
                      ? { background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                  }
                >
                  Absent
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn btn-primary w-full" disabled={marking}>
                {marking ? 'Processing...' : 'Submit Record'}
              </button>
            </div>
          </form>
        </div>

        {/* Attendance Log Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar style={{ color: 'var(--primary)' }} size={20} />
              Attendance Log
            </h3>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Date picker + Today shortcut */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{ width: 'auto', padding: '5px 10px', fontSize: '0.85rem', height: '34px' }}
                />
                <button
                  type="button"
                  onClick={() => setDateFilter(today)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: dateFilter === today ? 'var(--primary)' : 'transparent',
                    color: dateFilter === today ? 'white' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    height: '34px',
                  }}
                >
                  Today
                </button>
                {dateFilter && (
                  <button
                    type="button"
                    onClick={() => setDateFilter('')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: dateFilter === '' ? 'rgba(139,92,246,0.2)' : 'transparent',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      height: '34px',
                    }}
                  >
                    All Dates
                  </button>
                )}
              </div>

              {/* Status pills — click again to deselect (show all) */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {['Present', 'Absent'].map(s => {
                  const isActive = statusFilter === s;
                  const activeStyle =
                    s === 'Present'
                      ? { background: 'rgba(16,185,129,0.2)', color: '#34d399', borderColor: 'rgba(16,185,129,0.3)' }
                      : { background: 'rgba(244,63,94,0.2)', color: '#fb7185', borderColor: 'rgba(244,63,94,0.3)' };

                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatusFilter(isActive ? 'All' : s)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '99px',
                        border: '1px solid',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        ...(isActive
                          ? activeStyle
                          : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--border)' })
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={employeeFilter}
                onChange={(e) => setEmployeeFilter(e.target.value)}
                style={{ width: '180px', padding: '5px 10px', fontSize: '0.85rem', height: '34px' }}
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-20 gap-3">
                <Loader2 className="animate-spin text-blue-500" />
                <span className="text-muted font-medium">Loading records...</span>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Code</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length > 0 ? attendance.map((log) => (
                    <tr key={log.id}>
                      <td className="font-medium">{log.employee_name}</td>
                      <td className="text-muted font-mono text-sm">{log.employee_code}</td>
                      <td className="text-muted">{format(new Date(log.date), 'MMM dd, yyyy')}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {log.status === 'Present' ? (
                            <CheckCircle size={14} className="text-emerald-500" />
                          ) : (
                            <XCircle size={14} className="text-red-400" />
                          )}
                          <span style={{ color: log.status === 'Present' ? '#34d399' : '#fb7185' }}>
                            {log.status}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openEditModal(log)}
                            className="btn-icon edit"
                            style={{ padding: '4px' }}
                            title="Edit Status"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(log.id)}
                            className="btn-icon delete"
                            style={{ padding: '4px' }}
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4">
                        <div className="flex flex-col items-center justify-center p-20 gap-3">
                          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-muted">
                            <Calendar size={24} />
                          </div>
                          <p className="text-muted font-medium">No records found for this selection.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {showEditModal && editLog && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ padding: '32px', width: '400px' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Update Status</h3>
              <button onClick={() => setShowEditModal(false)} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted mb-1">Employee</p>
              <p className="font-semibold">{editLog.employee_name}</p>
              <p className="text-xs text-blue-400 font-mono">{editLog.employee_code}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted mb-3 block">Current Status</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setEditLog({ ...editLog, status: 'Present' })}
                    className="btn flex-1"
                    style={
                      editLog.status === 'Present'
                        ? { background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white' }
                        : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                    }
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditLog({ ...editLog, status: 'Absent' })}
                    className="btn flex-1"
                    style={
                      editLog.status === 'Absent'
                        ? { background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white' }
                        : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border)' }
                    }
                  >
                    Absent
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn flex-1"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
