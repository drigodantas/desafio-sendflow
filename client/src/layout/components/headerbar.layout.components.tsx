import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.hooks';

export function HeaderbarLayout() {
  const navigate = useNavigate();

  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="flex justify-between items-center bg-blue-600 p-4 text-white">
      <ul className="flex gap-4 mr-auto">
        <li>
          <Link to="/connections" className="hover:border-b-2">
            Conexões
          </Link>
        </li>
        <li>
          <Link to="/contacts" className="hover:border-b-2">
            Contatos
          </Link>
        </li>
        <li>
          <Link to="/messages" className="hover:border-b-2">
            Mensagens
          </Link>
        </li>

        <li>
          <Link to="/schedule-messages" className="hover:border-b-2">
            Agendar Mensagens
          </Link>
        </li>
      </ul>

      <IconButton
        onClick={() => handleLogout()}
        color="inherit"
        className="ml-auto"
      >
        <LogoutIcon />
      </IconButton>
    </nav>
  );
}
