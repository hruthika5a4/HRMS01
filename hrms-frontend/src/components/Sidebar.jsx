import { LayoutDashboard, Users, CalendarCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
  { name: 'Employees', icon: <Users size={18} />, path: '/employees' },
  { name: 'Attendance', icon: <CalendarCheck size={18} />, path: '/attendance' },
];

const Sidebar = () => {
  return (
    <div className="sidebar" style={{
      borderRight: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(9,9,11,0.95)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      paddingTop: '28px',
    }}>

      {/* Logo */}
      <div style={{ padding: '0 20px 32px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Icon mark */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
            flexShrink: 0,
          }}>
            {/* Custom HR icon shape */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="6" r="3" fill="white" fillOpacity="0.9" />
              <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" fillOpacity="0" />
            </svg>
          </div>

          {/* Text */}
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: 'white',
              lineHeight: '1.2',
              letterSpacing: '-0.01em',
            }}>
              HRMS
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: 'rgba(139,92,246,0.85)',
              fontWeight: '500',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Workspace
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 16px 20px 16px' }} />


      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
              color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.45)',
              borderLeft: isActive ? '2px solid #8b5cf6' : '2px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom version tag */}
      <div style={{ marginTop: 'auto', padding: '20px 20px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)' }}>
        v1.0.0 · HRMS Lite
      </div>
    </div>
  );
};

export default Sidebar;
