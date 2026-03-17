import { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../api';
import { Users, CalendarCheck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    topEmployees: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await employeeAPI.getAll();
        const attRes = await attendanceAPI.getAll({ date: format(new Date(), 'yyyy-MM-dd') });
        const allAttRes = await attendanceAPI.getAll();
        
        setStats({
          totalEmployees: empRes.data.length,
          presentToday: attRes.data.filter(a => a.status === 'Present').length,
          recentAttendance: allAttRes.data.slice(0, 5)
        });
        setError(false);
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { title: 'Total Employees', value: stats.totalEmployees, icon: <Users className="text-blue-500" />, color: 'blue', link: '/employees' },
    { title: 'Present Today', value: stats.presentToday, icon: <CheckCircle className="text-emerald-500" />, color: 'emerald', link: '/attendance?status=Present' },
    { title: 'Absence Rate', value: stats.totalEmployees ? Math.round(( (stats.totalEmployees - stats.presentToday) / stats.totalEmployees) * 100) + '%' : '0%', icon: <Clock className="text-orange-500" />, color: 'orange', link: '/attendance?status=Absent' },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh] gap-4">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center">
          <Clock size={32} />
        </div>
        <h3 className="text-xl font-bold">Failed to connect</h3>
        <p className="text-muted">Could not reach the server. Please check your connection.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Retry Connection</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[80vh] gap-3">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="text-muted font-medium text-lg">Initializing Dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">Overview</h2>
          <p className="text-muted">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="glass-card px-4 py-2 flex items-center gap-2">
          <CalendarCheck size={18} className="text-blue-500" />
          <span className="font-medium">{format(new Date(), 'PPP')}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {cards.map((card, i) => (
          <div 
            key={i} 
            className="glass-card" 
            style={{ padding: '24px', cursor: 'pointer' }}
            onClick={() => navigate(card.link)}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-muted font-medium">{card.title}</span>
              <div className="p-2">{card.icon}</div>
            </div>
            <div className="text-3xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <div>
        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAttendance.length > 0 ? stats.recentAttendance.map((log) => (
                <tr key={log.id}>
                  <td className="font-medium">{log.employee_name}</td>
                  <td className="text-muted">{format(new Date(log.date), 'MMM dd, yyyy')}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      log.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`} style={{ padding: '4px 12px', borderRadius: '99px' }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No recent activity found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
