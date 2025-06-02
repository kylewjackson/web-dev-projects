export function LogIn(props) {
	return (
		<li id="nav-login" className="login">
			{props.loggedIn ? (
				<form id="welcome-form" onSubmit={(e) => props.handleSubmit(null, 'logout', e)}>
					<label htmlFor="welcome-form">Hi, {props.user}!</label>
					<button type="submit" name="signout" value="signout" tabIndex={props.modal ? -1 : null}>Sign Out</button>
				</form>
			) : (
				<form id="sign-in-form">
					<label htmlFor="login-input">You are not signed in.</label>
					<button
						type="button"
						name="login"
						value="login"
						onClick={(e) => props.handleModal({ view: 'login' }, e)}
						tabIndex={props.modal ? -1 : null}
					>
						Log In
					</button>
					<button
						type="button"
						name="signup"
						value="signup"
						onClick={(e) => props.handleModal({ view: 'signup' }, e)}
					>
						Sign Up
					</button>
				</form>
			)}
		</li>
	);
};

export function LogInForm(props) {
	return (
		<form id="login-form" onSubmit={(e) => props.handleSubmit(null, 'login', e)}>
			{props.userNameError && (
				<div style={{ color: 'red', marginBottom: '0.5rem' }}>
					{props.userNameError}
				</div>
			)}
			{props.fullForm &&
				<label htmlFor="login-input">You are not signed in.</label>
			}
			<input type='text' id="login-input" name="login-input" placeholder="enter a name to test" onChange={(e) => props.handleUsername(e)} required value={props.user ?? ''} tabIndex={props.modal ? -1 : null} />
			<button type="submit" name="login" value="login" tabIndex={props.modal ? -1 : null} disabled={!!props.userNameError && !props.userNameError.includes('Log In')}>Log In</button>
			{props.fullForm &&
				<button
					type="button"
					name="signup"
					value="signup"
					onClick={(e) => props.handleModal({ view: 'signup' }, e)}
					tabIndex={props.modal ? -1 : null}
				>
					Need an account? Sign Up
				</button>
			}
		</form>
	)
}

export function SignUpForm(props) {
	return (
		<form id="sign-up-form" onSubmit={(e) => props.handleSubmit(null, 'signup', e)}>
			{props.userNameError && (
				<div style={{ color: 'red', marginBottom: '0.5rem' }}>
					{props.userNameError}
				</div>
			)}
			{props.fullForm &&
				<label htmlFor="login-input">You are not signed in.</label>
			}
			<input type='text' id="login-input" name="login-input" placeholder="enter a name to test" onChange={(e) => props.handleUsername(e)} required value={props.user ?? ''} tabIndex={props.modal ? -1 : null} />
			<button type="submit" name="signup" value="signup" tabIndex={props.modal ? -1 : null} disabled={!!props.userNameError && !props.userNameError.includes('Sign Up')}>Sign Up</button>
			{props.fullForm &&
				<button
					type="button"
					name="login"
					value="login"
					onClick={(e) => props.handleModal({ view: 'login' }, e)}
					tabIndex={props.modal ? -1 : null}
				>
					Already have an account? Log In
				</button>
			}
		</form>
	)
}
