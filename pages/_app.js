import '../styles/globals.css'
import Wrapper from '../components/Wrapper';

function MyApp({ Component, pageProps }) {

  return (
    <Wrapper title="Berrymore" menuItems={['Кабинет', 'Статистика', 'Сотрудники']}>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default MyApp
