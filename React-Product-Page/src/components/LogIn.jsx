export default function LogIn(props) {
	return (
		<li id="nav-login" className="login">
			{props.loggedIn ? (
				<form id="welcome-form" onSubmit={(e) => props.handleSubmit(null, 'logout', e)}>
					<label htmlFor="welcome-form">Hi, {props.user}!</label>
					<button type="submit" name="signout" value="signout" tabIndex={props.modal ? -1 : null}>Sign Out</button>
				</form>
			) : props.openLogin ? (
				<form id="login-form" onSubmit={(e) => props.handleSubmit(null, 'login', e)}>
					<label htmlFor="login-input">You are not signed in.</label>
					<input type='text' id="login-input" name="login-input" placeholder="enter a name to test" onChange={(e) => props.handleUsername(e)} required tabIndex={props.modal ? -1 : null} />
					<button type="submit" name="login" value="login" tabIndex={props.modal ? -1 : null}>Log In</button>
					<button type="button" name="signup" value="signup" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Need an account? Sign Up</button>
				</form>
			) : props.openSignup ? (
				<form id="sign-up-form" onSubmit={(e) => props.handleSubmit(null, 'signup', e)}>
					<label htmlFor="login-input">You are not signed in.</label>
					<input type='text' id="login-input" name="login-input" placeholder="enter a name to test" onChange={(e) => props.handleUsername(e)} required tabIndex={props.modal ? -1 : null} />
					<button type="submit" name="signup" value="signup" tabIndex={props.modal ? -1 : null}>Sign Up</button>
					<button type="button" name="login" value="login" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Already have an account? Log In</button>
				</form>
			) : (
				<form id="sign-in-form">
					<label htmlFor="login-input">You are not signed in.</label>
					<button type="button" name="login" value="login" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Log In</button>
					<button type="button" name="signup" value="signup" onClick={(e) => props.handleLogin(e)} tabIndex={props.modal ? -1 : null}>Sign Up</button>
				</form>
			)}
		</li>
	);
};