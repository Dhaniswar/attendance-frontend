/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactElement<any, any>;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  const isPositive = !change.startsWith('-');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeValue = change.replace(/[+-]/g, '');

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          transition: 'all 0.2s ease-in-out',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', fontWeight: 500, fontSize: '0.75rem' }}
            >
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
              {value}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              {isPositive ? (
                <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: '1rem' }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: '1rem' }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: isPositive ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              >
                {isPositive ? '+' : ''}{change}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                from last month
              </Typography>
            </Box>
          </Box>
          
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;