import '../styles/globals.scss';
import ContextWrapper from '../frontendWrapper/ContextWrapper';

function MyApp({ Component, pageProps }) {

  return (
    <ContextWrapper>
      <Component {...pageProps} />
    </ContextWrapper>
  );
}

export default MyApp
