import React from 'react';
import { Box, Typography } from '@mui/material';

const HeatMap: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  
  // Mock data: attendance percentage for each day/hour
  const data = days.map(() => 
    hours.map(() => Math.floor(Math.random() * 100))
  );

  const getColor = (value: number) => {
    if (value >= 90) return '#4caf50';
    if (value >= 80) return '#8bc34a';
    if (value >= 70) return '#cddc39';
    if (value >= 60) return '#ffeb3b';
    if (value >= 50) return '#ffc107';
    if (value >= 40) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Time labels */}
      <Box sx={{ display: 'flex', ml: 6 }}>
        {hours.map((hour, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              width: 24,
              textAlign: 'center',
              transform: 'rotate(-45deg)',
              transformOrigin: 'left',
            }}
          >
            {hour}
          </Typography>
        ))}
      </Box>

      {/* Heat map grid */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Day labels */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: 30 }}>
          {days.map((day, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        {/* Heat cells */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {data.map((dayData, dayIndex) => (
            <Box key={dayIndex} sx={{ display: 'flex', gap: 1 }}>
              {dayData.map((value, hourIndex) => (
                <Box
                  key={`${dayIndex}-${hourIndex}`}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: getColor(value),
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: 2,
                    },
                  }}
                  title={`${days[dayIndex]} ${hours[hourIndex]}: ${value}% attendance`}
                >
                  <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'white' }}>
                    {value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <Typography variant="caption" sx={{ mr: 1 }}>
          Attendance:
        </Typography>
        {[0, 40, 60, 80, 90].map((value, index, arr) => (
          <React.Fragment key={value}>
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: getColor(value + 1),
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
              {value}%
            </Typography>
            {index < arr.length - 1 && (
              <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                →
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default HeatMap;