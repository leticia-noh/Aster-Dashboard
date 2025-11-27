import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Glass from './Glass';
import { useNavigate } from "react-router-dom"

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  return (
    <div className="min-w-16 min-h-16 rounded-[100px]">
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ padding: 0 }}
      >
        <Glass padding="" className="min-w-16 min-h-16 flex items-center justify-center     ">
            <img src="/src/assets/icons/profile.svg" alt="Profile" className="w-9 h-9"/>
        </Glass>
      </Button>
    
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }} 
        sx={{ left: '-1.25rem', top: '1rem' }}
      >
        <MenuItem divider={true} onClick={() => navigate('/login')}>Mudar usuário</MenuItem>
        <MenuItem onClick={handleClose}>Configurações de perfil</MenuItem>
        <MenuItem onClick={handleClose}>Atualizar informações de acesso</MenuItem>  
        <MenuItem onClick={handleClose}>Preferências</MenuItem>
        <MenuItem divider={true} onClick={handleClose}>Ajuda e suporte</MenuItem>
        <MenuItem onClick={() => navigate('/login')}>Sair</MenuItem>
      </Menu>
    </div>
  );
}