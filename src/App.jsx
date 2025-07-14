import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import Navigation from './components/Navigation'
import './App.css'
import Sensors from './components/Sensors/Sensors'
import NewSensor from './components/Sensors/NewSensor'
import Sensor from './components/Sensors/Sensor'
import SensorForm from './components/Sensors/SensorForm'
import SensorDataForm from './components/SensorsData/SensorDataForm'


const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Navigation />
        <Layout>
          <Content style={{ padding: '24px', background: '#fff' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/sensors" replace />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/sensors/new" element={<NewSensor />} />
              <Route path="/sensors/:id" element={<Sensor />} />
              <Route path="/sensors/edit/:id" element={<SensorForm />} />
              <Route path="/sensors-data/edit/:id" element={<SensorDataForm />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
