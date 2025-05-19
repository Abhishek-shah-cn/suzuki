import { Provider } from 'react-redux';
import { store } from '../redux/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default MyApp;
