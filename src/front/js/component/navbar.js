import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Context } from '../store/appContext';

export const Navbar = () => {

	const { store, actions } = useContext(Context);

	const handleLogout = () => {
		actions.logout();
	};
	return (
		<nav className="navbar navbar-light bg-success-subtle">
			<div className="container-fluid justify-content-evenly">
				{
					store.user ?
						<div>
							<Link to="/">
								<span className="btn btn-outline-primary" onClick={handleLogout}>Log out</span>
							</Link>
						</div> :
						<>
							<div>
								<Link to="/login">
									<span className="btn btn-outline-primary">Login</span>
								</Link>
							</div>
							<div>
								<Link to="/register">
									<button className="btn btn-outline-primary">Sign up</button>
								</Link>
							</div>
						</>
				}

			</div>
		</nav>
	);
};
