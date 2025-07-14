import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import Navigation from './components/Navigation'
import Categories from './components/Categories/Categories'
import Category from './components/Categories/Category'
import Products from './components/Products/Products'
import CategoryForm from './components/Categories/CategoryForm'
import NewCategory from './components/Categories/NewCategory'
import './App.css'

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Navigation />
        <Layout>
          <Content style={{ padding: '24px', background: '#fff' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/categories" replace />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/new" element={<NewCategory />} />
              <Route path="/categories/:id" element={<Category />} />
              <Route path="/categories/edit/:id" element={<CategoryForm />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
