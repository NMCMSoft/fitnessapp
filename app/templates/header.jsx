function Header({ role }) {
    return (
        <>
            <div className="header">
                <h1>Gruppe 36 - Fitness app</h1>
                <hr />
                {
                    role==null?
                    <ul className="navbar">
                        <li><button>My Workouts</button></li>
                    </ul>:<></>
                }
            </div>

        </>
    );

} export default Header;