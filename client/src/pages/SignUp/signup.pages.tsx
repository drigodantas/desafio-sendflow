import { Alert, Button, Input } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';

export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignUp() {
    try {
      setLoading(true);
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);

      navigate('/connections');
    } catch (error: any) {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col justify-evenly items-center gap-4 bg-white shadow-lg p-6 rounded-lg w-96 h-96">
        <h1 className="font-bold text-2xl">Cadastrar</h1>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Input
          placeholder="Senha"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleSignUp}
          fullWidth
          loading={loading}
        >
          Login
        </Button>
        <span>
          Já possui conta?{' '}
          <Link to="/" className="font-bold cursor-pointer">
            Entre aqui
          </Link>
        </span>
      </div>
    </div>
  );
}
