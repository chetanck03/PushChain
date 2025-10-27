import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout'
import LandingPage from '../components/LandingPage'
import AboutPage from '../components/AboutPage'
import ContactPage from '../components/ContactForm'
import Dashboard from '../components/Dashboard'
import WalletSelection from '../components/WalletSelection'

import TransactionPage from '../components/Transactions/TransactionPage'
import NotFound from '../components/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'wallet-selection',
        element: <WalletSelection />,
      },

      {
        path: 'transaction/evm/:address',
        element: <TransactionPage />,
      },
      {
        path: 'transaction/pushchain-ui/:address',
        element: <TransactionPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])