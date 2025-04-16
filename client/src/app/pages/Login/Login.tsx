import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../../firebase';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSignIn() {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.log(error);
      setError('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col justify-evenly items-center gap-4 bg-white shadow-lg p-6 rounded-lg w-96 h-96">
        <h1 className="font-bold text-2xl">Login</h1>
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
          onClick={handleSignIn}
          fullWidth
          loading={loading}
        >
          Login
        </Button>
        <span>
          Não tem conta?{' '}
          <Link to="/sign-up" className="font-bold cursor-pointer">
            Cadastre-se aqui
          </Link>
        </span>
      </div>
    </div>
  );
}
