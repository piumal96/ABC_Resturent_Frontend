import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: SvgIconComponent;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon: Icon, onClick }) => {
  return (
    <Card onClick={onClick} sx={{ maxWidth: 345, minWidth: 275 }}>
      <CardActionArea>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Icon sx={{ fontSize: 40, color: '#1976d2' }} />
          </Box>
          <Typography gutterBottom variant="h6" component="div" align="center">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DashboardCard;
