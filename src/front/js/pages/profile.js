import React, { useContext } from 'react';
import { Context } from '../store/appContext';

const Profile = () => {
  const { store } = useContext(Context);

  if (store.user == null) {
    console.log(store.user)
    return <div>You are not logged in</div>;
  }

  return (
    <div className="container text-center my-5">
      <h1 className="fs-1 text fw-bold">Profile</h1>
      <p className="border border-success-subtle rounded-pill border-3" style={{ margin: "20px 150px", padding: "5px", fontSize: "20px" }}>Email: {store.user.email}</p>
      <p className="border border-success-subtle rounded-pill border-3" style={{ margin: "20px 150px", padding: "5px", fontSize: "20px" }}>Is Active: {store.user.is_active ? 'Sí' : 'No'}</p>
    </div>
  );
};

export default Profile;