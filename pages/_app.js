import '../styles/globals.css';
import AuthWrapper from '../utils/auth/AuthWrapper';

function MyApp({ Component, pageProps }) {

  return (
    <AuthWrapper>
      <Component {...pageProps} />
    </AuthWrapper>
  );
}

export default MyApp
