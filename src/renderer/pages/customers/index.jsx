import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {CustomerDetail} from './CustomerDetail';
import {CustomerList} from './CustomerList';
import {CustomerForm} from './CustomerForm';


export const CustomerManagement = () => {
  return (
   
      <Routes>
        <Route path="/" element={<CustomerList/>} />
        <Route path="/add" element={<CustomerForm />} />
        <Route path="/view/:id" element={<CustomerDetail />} />
        <Route path="/edit/:id" element={<CustomerForm />} />
      </Routes>
  );
};

