import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ImageGallery from './ImageGallery';
import { Upload, Image } from 'lucide-react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import FooterBar from './footer';

const Header = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'grey',
  height: 'auto',
  [theme.breakpoints.up('sm')]: {
    height: '80px',
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
}));

const StockImageBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(1),
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(10),
    marginBottom: 0,
  },
}));

const LogoutBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'black',
  padding: theme.spacing(1),
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
}));

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

 

  return (
    <div className="min-vh-100 bg-light font-sans">
      <Header position="static">
        <ToolbarStyled>
          <Button >
            <StockImageBox>
              <Typography variant="h6" noWrap>
                StockImage
              </Typography>
            </StockImageBox>
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.username}!
          </Typography>
          <Button onClick={handleLogout}>
            <LogoutBox>
              <Typography variant="h6" noWrap>
                Logout
              </Typography>
            </LogoutBox>
          </Button>
        </ToolbarStyled>
      </Header>
      <main className="container py-5">
        <div className="row">
          <div className="col-12 mb-5">
            <h2 className="h4 fw-bold mb-4 d-flex align-items-center text-dark">
              <Image className="me-2 text-primary" size={24} />
              Image Gallery
            </h2>
            <div className="col-12">
            <div className="card">
              <div className="card-body">
                <ImageGallery />
              </div>
            </div>
          </div>
          </div>
          <div className="col-12 mb-5">
            <h2 className="h4 fw-bold mb-4 d-flex align-items-center text-dark">
            
              Upload Images
            </h2>
            <div className="card">
              <div className="card-body">
                <ImageUpload />
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterBar/>
    </div>
  );
};

export default Dashboard;