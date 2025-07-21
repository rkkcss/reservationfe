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
import { App as AntdApp } from 'antd';

dayjs.locale('hu');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider
        locale={locale}
        theme={{
          components: {
            Card: {

            },
            Collapse: {
              colorBgContainer: 'transparent'
            },
            Pagination: {
              colorBgContainer: 'transparent'
            },
            Button: {
              colorBgContainer: 'transparent',
              controlHeight: 32,
              paddingContentHorizontal: 18,
              fontWeight: '600',
              fontSize: 15
            }
          },
          token: {
            colorPrimary: '#7635f2',
            colorText: '#333',
            colorTextBase: '#333',
            colorBgContainer: '#ffffff',
            colorBgTextHover: '#f0f0f0',
          }
        }}
      >
        <AntdApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </StrictMode>
)

