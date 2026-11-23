function Header({ payload }) {
    if(payload==null){
        return(
            <>
            <div className="header">
                <h1>Gruppe 36 - Fitness app</h1>
                <hr />
            </div>
            </>
        );
    }
    return (
        <>
            <div className="header">
                <h1>Gruppe 36 - Fitness app</h1>
                <hr />
                <ul className="navbar">
                    <li><button>My Workouts</button></li>
                </ul>

            </div>

        </>
    );

} export default Header;