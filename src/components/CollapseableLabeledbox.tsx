import React, { useState } from 'react';
interface LabeledBoxProps {
  label?: string | React.ReactNode;
  hide?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const CollapseLabeledBox: React.FC<LabeledBoxProps> = ({
  label,
  children,
  className,
  disabled,
  hide=false,  //if any parameter is not passed it will visible
}) => {
  const [collapsed, setCollapsed] = useState(hide);

  return (
    <div className={`custom-blue-container-border relative p-2 shadow-sm ${className}`}>
      <span className="text-custom-blue absolute left-6 top-1 -ml-2 -mt-5 rounded-md rounded-bl-md bg-white px-2 py-1 text-sm">
        <button onClick={(e) =>{ e.preventDefault(), setCollapsed(!collapsed)}} className="ml-2 text-sm ">
          {collapsed && label ? label +`${' ▼'}` : label +`${' ▲'}`}
        </button>
      </span>
      <div className={`collapsible-content ${collapsed ? 'collapsed' : ''}`}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { disabled } as React.Attributes);
          }
          return child;
        })}
      </div>
    </div>
  );
};

export default CollapseLabeledBox;
