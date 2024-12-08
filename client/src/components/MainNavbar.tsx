/*
Author(s): Djamel Almabouada, Derek Petersen, Geromy Cunningham
Purpose: Navigation bar for the main page
*/

function MainNavbar() {
  return (
    <div className="navbar">
      <a href="/home">
        <div className="logo">
          <img src="/purdue_logo.PNG" alt="Home" />
        </div>
      </a>
    </div>
  );
}

export default MainNavbar;
