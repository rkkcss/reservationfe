import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import './i18n.ts'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import locale from 'antd/locale/hu_HU';
import dayjs from 'dayjs';
import 'dayjs/locale/hu';

dayjs.locale('hu');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        locale={locale}
        theme={{
          components: {
            // Menu: {
            //   colorBgContainer: '#0056d2',
            // }
            Button: {
              controlHeight: 32,
              paddingContentHorizontal: 18,
              fontWeight: '600',
              fontSize: 15
            }
          },
          token: {
            colorPrimary: '#7635f2', // Primary szín
            colorText: '#333', // Szövegszín
            colorTextBase: '#333',
            colorBgContainer: '#ffffff', // Menü háttér
            colorBgTextHover: '#f0f0f0', // Hover állapot
          }
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </StrictMode>,
)
