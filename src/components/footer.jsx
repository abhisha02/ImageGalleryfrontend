import React from 'react';
import { styled, IconButton, Typography, Box } from '@mui/material';
import socialmedia from './socialmedia.jpg'; // Import your social media image

const Footer = styled('footer')(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(3),
  color: 'white',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const FooterSection = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const FooterLinks = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const SocialMediaSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

const SocialMediaIcons = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
  },
}));

const FooterBar = () => {
  return (
    <Footer>
      <FooterSection>
       
        <FooterLinks>
         
        </FooterLinks>
        <SocialMediaSection>
          <Typography variant="subtitle1">Follow Us</Typography>
          <Box display="flex" justifyContent="center" alignItems="center" marginTop={1}>
            <img src={socialmedia} alt="Social Media" style={{ width: '80px', height: 'auto', borderRadius: '50%' }} />
          </Box>
          <SocialMediaIcons>
            <IconButton color="inherit">
              <i className="fab fa-facebook-f"></i>
            </IconButton>
            <IconButton color="inherit">
              <i className="fab fa-instagram"></i>
            </IconButton>
            <IconButton color="inherit">
              <i className="fab fa-youtube"></i>
            </IconButton>
          </SocialMediaIcons>
        </SocialMediaSection>
      </FooterSection>
    </Footer>
  );
};

export default FooterBar;
