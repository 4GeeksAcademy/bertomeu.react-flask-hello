const getState = ({ getStore, getActions, setStore }) => {
	const apiEndpoint = process.env.BACKEND_URL;

	const store = {
		user: null,
		verified: false,
	};

	const actions = {
		login: async (email, password) => {
			try {
				const response = await fetch(`${apiEndpoint}/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password }),
				});
				const data = await response.json();
				if (response.ok) {
					localStorage.setItem('token', data.jwt_token);
					setStore({ verified: true, user: data.user_data });
					return data;
				} else {
					throw new Error(data.msg || 'Login failed');
				}
			} catch (error) {
				console.error('Login error', error);
				throw error;
			}
		},

		private: async () => {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					const response = await fetch(`${apiEndpoint}/private`, {
						headers: { Authorization: `Bearer ${token}` },
					});
					if (response.ok) {
						const data = await response.json();
						setStore({ verified: true, user: data.user_data });
					} else {
						setStore({ verified: false, user: null });
					}
				} catch (error) {
					console.error('Auth error', error);
					setStore({ verified: false, user: null });
				}
			} else {
				setStore({ verified: false, user: null });
			}
		},

		logout: () => {
			localStorage.removeItem('token');
			setStore({ verified: false, user: null });
		},

		register: async (email, password) => {
			try {
				const response = await fetch(`${apiEndpoint}/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password }),
				});
				const data = await response.json();
				if (response.ok) {
					return data;
				} else {
					throw new Error(data.msg || 'Registration error');
				}
			} catch (error) {
				console.error('Registration error', error);
				throw error;
			}
		},
	};

	return { store, actions };
};
export default getState;