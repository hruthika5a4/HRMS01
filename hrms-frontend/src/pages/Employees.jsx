import { useState, useEffect } from 'react';
import { employeeAPI } from '../api';
import { UserPlus, Trash2, Mail, Building, IdCard, Loader2, Eye, X, Pencil, CheckCircle, Users } from 'lucide-react';
import { handleApiError, showSuccess } from '../utils/toastHandler';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDataId, setEditDataId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      setEmployees(res.data);
      setError(false);
    } catch (err) {
      console.error("Error fetching employees", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeAPI.delete(id);
        setEmployees(employees.filter(emp => emp.id !== id));
        showSuccess("Employee deleted successfully");
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editMode) {
        await employeeAPI.update(editDataId, formData);
        showSuccess("Employee updated successfully!");
      } else {
        await employeeAPI.create(formData);
        showSuccess("Employee added successfully!");
      }
      setShowAddModal(false);
      setFormData({ full_name: '', email: '', department: '' });
      setEditMode(false);
      setEditDataId(null);
      fetchEmployees();
    } catch (err) {
      handleApiError(err);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditDataId(null);
    setFormData({ full_name: '', email: '', department: '' });
    setShowAddModal(true);
  };

  const handleEditClick = (emp) => {
    setEditMode(true);
    setEditDataId(emp.id);
    setFormData({
      employee_id: emp.employee_id,
      full_name: emp.full_name,
      email: emp.email,
      department: emp.department
    });
    setShowAddModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">Employee Directory</h2>
          <p className="text-muted">Manage your workforce and their records.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn-primary"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {error ? (
        <div className="glass-card flex flex-col items-center justify-center p-20 gap-4">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
            <X size={32} />
          </div>
          <h3 className="text-xl font-bold">Failed to load records</h3>
          <p className="text-muted text-center max-w-sm">The employee directory is currently unavailable. Please verify your backend is running.</p>
          <button onClick={() => fetchEmployees()} className="btn btn-primary">Try Again</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          {loading ? (
          <div className="flex items-center justify-center p-20 gap-3">
            <Loader2 className="animate-spin text-blue-500" />
            <span className="text-muted font-medium">Loading records...</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th style={{ textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                  <td className="font-mono text-blue-400">{emp.employee_id}</td>
                  <td>{emp.full_name}</td>
                  <td className="text-muted">{emp.email}</td>
                  <td>
                    <span className="px-3 py-1 bg-slate-800 rounded-lg text-sm">
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="btn-icon view"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditClick(emp)}
                        className="btn-icon edit"
                        title="Edit Employee"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="btn-icon delete"
                        title="Delete Employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center justify-center p-20 gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-muted">
                        <Users size={24} />
                      </div>
                      <p className="text-muted font-medium">No employees found. Start by adding one!</p>
                      <button onClick={openAddModal} className="btn text-blue-400 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                        Register Employee
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ padding: '32px', width: '450px' }}>
            <h3 className="text-xl font-bold mb-6">{editMode ? 'Update Employee' : 'Register New Employee'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Employee ID — read-only in edit, auto-assigned on create */}
              {editMode ? (
                <div>
                  <label className="text-sm font-medium text-muted mb-2 block">Employee ID</label>
                  <div style={{
                    padding: '10px 14px 10px 40px',
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.25)',
                    borderRadius: '8px',
                    color: 'var(--primary)',
                    fontWeight: '600',
                    fontFamily: 'monospace',
                    position: 'relative',
                  }}>
                    <IdCard className="absolute left-3 top-3.5" size={18} style={{ color: 'var(--primary)' }} />
                    {formData.employee_id}
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: '4px' }}>Employee ID cannot be changed</p>
                </div>
              ) : (
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px dashed var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}>
                  🔢 Employee ID will be auto-assigned (EMP001, EMP002...)
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted mb-2 block">Full Name</label>
                <input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <input
                    style={{ paddingLeft: '40px' }}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted mb-2 block">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3.5 text-slate-500" size={18} />
                  <select
                    style={{ paddingLeft: '40px' }}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn flex-1"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editMode ? 'Update Employee' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <div className="modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="glass-card modal-content relative" style={{ padding: '32px', width: '400px' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="btn-icon absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                {selectedEmployee.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold tracking-tight text-white mb-1 truncate">{selectedEmployee.full_name}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-500/10">ID</span>
                  <span className="text-muted font-mono text-sm">{selectedEmployee.employee_id}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Contact Email</p>
                  <p className="text-sm font-medium text-slate-200" style={{ wordBreak: 'break-all' }}>{selectedEmployee.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                  <Building size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Department</p>
                  <p className="text-sm font-medium text-slate-200">{selectedEmployee.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-all">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest mb-0.5">Attendance Health</p>
                  <p className="text-sm font-bold text-emerald-400">{selectedEmployee.total_present_days} Days Marked Present</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
