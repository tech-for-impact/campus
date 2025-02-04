import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../utils/UserContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>로딩 중...</div>; // 사용자 인증 상태가 확인될 때까지 로딩 표시
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
