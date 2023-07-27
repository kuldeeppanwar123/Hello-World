import React from 'react';
import { KEY_ACCESS_TOKEN, getItem } from '../utils/localStorageManager';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireUser() {
    const user = getItem(KEY_ACCESS_TOKEN);
  return (
    user?<Outlet/>:<Navigate to="/login"/>
  )
}
