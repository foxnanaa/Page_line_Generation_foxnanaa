
import React from 'react';
import { GridConfig } from '../types';

interface PaperPreviewProps {
  config: GridConfig;
}

const PaperPreview: React.FC<PaperPreviewProps> = ({ config }) => {
  const { spacing, lineColor, lineWidth, showCenterLine, margin, orientation } = config;

  const width = orientation === 'landscape' ? 297 : 210;
  const height = orientation === 'landscape' ? 210 : 297;

  // Visual container style
  const containerStyle: React.CSSProperties = {
    aspectRatio: `${width} / ${height}`,
    width: '100%',
    maxWidth: orientation === 'portrait' ? '450px' : '700px',
    backgroundColor: '#ffffff',
    position: 'relative',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    padding: `${(margin / height) * 100}% ${(margin / width) * 100}%`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const lineCount = Math.floor((height - 2 * margin) / spacing);
  const lines = Array.from({ length: lineCount + 1 });

  return (
    <div className="flex justify-center items-center w-full p-4 md:p-8">
      <div style={containerStyle} className="border border-gray-200">
        <div className="relative w-full h-full">
          {/* Horizontal Lines */}
          {lines.map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${(i * spacing / (height - 2 * margin)) * 100}%`,
                left: 0,
                right: 0,
                // Visual scaling: lineWidth is in mm, we map it to px for screen (approximate)
                height: `${Math.max(0.5, lineWidth * 1.5)}px`,
                backgroundColor: lineColor,
                opacity: 0.7
              }}
            />
          ))}

          {/* Vertical Center Line */}
          {showCenterLine && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: `${Math.max(1, lineWidth * 2.5)}px`,
                backgroundColor: lineColor,
                transform: 'translateX(-50%)'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaperPreview;
