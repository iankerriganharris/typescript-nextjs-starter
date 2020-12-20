/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from 'react-query';

const getMovies = async () => fetch(`/api/movies`).then((x) => x.json());

type Movie = { title: string; releaseDate: string; genre: string };

export default function App() {
  const { status, data, error } = useQuery<{ movies: Movie[] }, any>(
    `movies`,
    getMovies,
  );

  return (
    <div>
      <div>
        <div>{status}</div>
        {error && <div>{error}</div>}
        <div>
          {status === `loading` ? (
            <span>Loading...</span>
          ) : status === `error` ? (
            <span>Error: {error!.message}</span>
          ) : (
            <ul>
              {data!.movies!.map((movie) => (
                <li key={movie.title}>
                  {movie.title} ({movie.releaseDate}, {movie.genre})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
