import React from 'react';

interface ContextToggleProps {
  withContext: boolean;
  toggleWithContext: () => void;
  disabled: boolean;
}

const ContextToggle: React.FC<ContextToggleProps> = ({ withContext, toggleWithContext, disabled }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
      <input
        type="checkbox"
        id="context-toggle"
        checked={withContext}
        onChange={toggleWithContext}
        disabled={disabled}
      />
      <label htmlFor="context-toggle" style={{ marginLeft: '8px' }}>
        Include Context
      </label>
    </div>
  );
};

export default ContextToggle;
