// src/components/SettingsModal.tsx

import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 text-black relative">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="80"
            className="w-full"
          />
        </div>

        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
