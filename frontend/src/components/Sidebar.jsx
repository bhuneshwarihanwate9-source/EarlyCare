import React from 'react';

export default function Sidebar({ links, activeLink, onSelect }) {
  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      minHeight: 'calc(100vh - 70px)',
      padding: '1.5rem 1rem'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onSelect(link.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: activeLink === link.id ? '600' : '500',
              backgroundColor: activeLink === link.id ? '#eff6ff' : 'transparent',
              color: activeLink === link.id ? '#2563eb' : '#475569'
            }}
          >
            <span>{link.icon || '•'}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
