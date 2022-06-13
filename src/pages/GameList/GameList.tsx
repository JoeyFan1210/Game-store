import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine } from 'react-icons/ri';
import { Transition, Button, Loading } from '../../components';
import Grid from './components/Grid';
import { Game } from '../../types/Game.types';

interface Props {
  games: Game[],
  loadGames: (value: string) => Promise<Game[]>,
  cartItems: Game[];
  addToCart: (game: Game) => void;
}

function GameList(props: Props) {
  const {
    loadGames,
    cartItems,
    addToCart,
  } = props;
  const [games, setGames] = useState(props.games);
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setIsLoading(true), []);
  useEffect(() => {
    if (props.games.length && !searchParams.get('search')) {
      setGames(props.games);
      setIsLoading(false);
    }
  }, [props.games, searchParams]);
  useEffect(() => {
    const searchValue = searchParams.get('search') || '';
    if (searchValue) {
      setIsLoading(true);
      (async () => {
        setGames(await loadGames(searchValue));
        setIsLoading(false);
      })();
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Transition className="GameList" direction="right">
      <nav>
        {searchParams.get('search') && (
          <Transition direction="left">
            <Link to="/games">
              <Button className="Store"><RiArrowLeftLine /> Store</Button>
            </Link>
          </Transition>
        )}
        <motion.h2 layout>
          {searchParams.get('search') || 'Best of All Time'}
        </motion.h2>
      </nav>
      {isLoading
        ? <Loading />
        : <Grid
          games={games}
          cartItems={cartItems}
          addToCart={addToCart}
        />
      }
    </Transition>
  );
}

export default GameList;
