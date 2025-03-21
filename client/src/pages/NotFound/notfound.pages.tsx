import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 h-screen text-gray-800">
      <h1 className="font-bold text-blue-500 text-6xl">404</h1>
      <h2 className="mt-2 font-semibold text-2xl">Página não encontrada</h2>
      <p className="mt-2 text-gray-600">
        A página que você procura não existe ou foi removida.
      </p>

      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 shadow-md mt-6 px-6 py-2 rounded-md text-white transition"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
