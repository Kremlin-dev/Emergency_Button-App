import React from 'react';

interface EmergencyIdProps {
  params: {
    id: string;
  };
}

const EmergencyId = ({ params }: EmergencyIdProps) => {
  return (
    <div>
      <p>Emergency ID: {params.id}</p>
      <p>Emergency Name: Accident</p>
    </div>
  );
};

export default EmergencyId;
